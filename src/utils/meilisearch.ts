import type { AstroIntegration } from "astro";
import { readFile } from "node:fs/promises";

function normalizeHost(host: string) {
	return host.replace(/\/$/, "");
}

async function waitForTask(options: {
	host: string;
	adminKey: string;
	taskUid: string | number;
	timeoutMs?: number;
}) {
	const { host, adminKey, taskUid } = options;
	const timeoutMs = options.timeoutMs ?? 60_000;
	const start = Date.now();

	while (Date.now() - start < timeoutMs) {
		const res = await fetch(`${host}/tasks/${taskUid}`, {
			headers: {
				Authorization: `Bearer ${adminKey}`,
			},
		});
		const data = await res.json().catch(() => ({}));
		const status = data?.status;

		if (status === "succeeded") return data;
		if (status === "failed") {
			throw new Error(data?.error || `Meilisearch task failed: ${taskUid}`);
		}

		// enqueued | processing
		await new Promise((r) => setTimeout(r, 1000));
	}

	throw new Error(`Timed out waiting Meilisearch task: ${taskUid}`);
}

async function meiliRequest(options: {
	url: string;
	method: "GET" | "POST" | "PATCH";
	adminKey: string;
	body?: unknown;
}) {
	const headers: Record<string, string> = {
		Authorization: `Bearer ${options.adminKey}`,
	};

	if (options.body !== undefined) {
		headers["Content-Type"] = "application/json";
	}

	return fetch(options.url, {
		method: options.method,
		headers,
		body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
	});
}

async function addDocumentsWithFallback(options: {
	host: string;
	indexUid: string;
	adminKey: string;
	documents: unknown[];
	logger: { info: Function; warn: Function; error: Function };
}) {
	const { host, indexUid, adminKey, documents, logger } = options;

	// 兼容：不同 Meilisearch 版本对 /documents 的入参可能要求不同
	// - 某些版本接受数组：POST /documents { ... body: documents[] }
	// - 某些版本接受包装：POST /documents { documents: [...] }
	const endpoint = `${host}/indexes/${indexUid}/documents`;

	const tryAdd = async (body: unknown) => {
		const res = await meiliRequest({
			url: endpoint,
			method: "POST",
			adminKey,
			body,
		});
		const json = await res.json().catch(() => ({}));
		return { res, json };
	};

	// 1) 优先：数组形式
	let { res, json } = await tryAdd(documents);
	if (res.ok && json?.taskUid) return { res, json, used: "array" as const };

	// 2) 回退：包装形式
	logger.warn(
		`Meilisearch addDocuments fallback triggered (status=${res.status}). Retrying with { documents: [...] } ...`,
	);
	({ res, json } = await tryAdd({ documents }));
	return { res, json, used: "wrapped" as const };
}

/**
 * Meilisearch(=milisearch) 集成
 * 在构建完成后自动将索引数据上传到 Meilisearch（search.louaq.com）
 */
export default function meilisearch(): AstroIntegration {
	return {
		name: "meilisearch",
		hooks: {
			"astro:build:done": async ({ logger, dir }) => {
				const MEILISEARCH_HOST =
					process.env.MEILISEARCH_HOST ||
					process.env.PUBLIC_MEILISEARCH_HOST ||
					"https://search.louaq.com";
				const MEILISEARCH_ADMIN_KEY = process.env.MEILISEARCH_ADMIN_KEY;
				const MEILISEARCH_INDEX_NAME = process.env.MEILISEARCH_INDEX_NAME || "blog";

				// 没有 admin key 就跳过上传（只要 Meilisearch 端已有索引即可）
				if (!MEILISEARCH_ADMIN_KEY) {
					logger.warn("Meilisearch admin key not configured. Skipping index upload.");
					return;
				}

				const host = normalizeHost(MEILISEARCH_HOST);

				try {
					const path = new URL("./meilisearch.json", dir);
					logger.info(`Reading data from: ${path.pathname}`);

					const data = await readFile(path, "utf-8");
					if (!data) throw new Error("No data found in meilisearch.json");

					const records = JSON.parse(data);
					if (!Array.isArray(records)) throw new Error("Invalid data format: expected an array");

					logger.info(`Found ${records.length} records to upload to Meilisearch index: ${MEILISEARCH_INDEX_NAME}`);

					// 1) 尝试创建索引（如已存在会失败，这里忽略）
					try {
						const createRes = await meiliRequest({
							url: `${host}/indexes`,
							method: "POST",
							adminKey: MEILISEARCH_ADMIN_KEY,
							body: {
								uid: MEILISEARCH_INDEX_NAME,
								primaryKey: "id",
							},
						});

						// 已存在索引时一般会返回 4xx，这里不致命
						if (!createRes.ok) {
							logger.info(`Meilisearch index may already exist: ${MEILISEARCH_INDEX_NAME}`);
						} else {
							const json = await createRes.json().catch(() => ({}));
							if (json?.taskUid) {
								logger.info(`Waiting Meilisearch create-index task: ${json.taskUid}`);
								await waitForTask({
									host,
									adminKey: MEILISEARCH_ADMIN_KEY,
									taskUid: json.taskUid,
								});
							}
						}
					} catch (e) {
						logger.warn(`Meilisearch create-index failed (ignored): ${e instanceof Error ? e.message : String(e)}`);
					}

					// 2) 更新索引设置
					// displayedAttributes 用于确保前端能拿到 content/title 等字段（避免默认不返回）
					const searchableAttributes = ["title", "description", "content", "tags", "category", "type"];
					const displayedAttributes = ["type", "title", "description", "content", "url", "tags", "category"];

					try {
						const settingsRes = await meiliRequest({
							url: `${host}/indexes/${MEILISEARCH_INDEX_NAME}/settings`,
							method: "PATCH",
							adminKey: MEILISEARCH_ADMIN_KEY,
							body: {
								searchableAttributes,
								displayedAttributes,
							},
						});
						const json = await settingsRes.json().catch(() => ({}));
						if (settingsRes.ok && json?.taskUid) {
							logger.info(`Waiting Meilisearch settings task: ${json.taskUid}`);
							await waitForTask({
								host,
								adminKey: MEILISEARCH_ADMIN_KEY,
								taskUid: json.taskUid,
								timeoutMs: 30_000,
							});
						}
					} catch (e) {
						logger.warn(`Meilisearch setSettings failed (ignored): ${e instanceof Error ? e.message : String(e)}`);
					}

					// 3) 上传文档（按块，避免单次请求过大）
					const chunkSize = Number(process.env.MEILISEARCH_UPLOAD_CHUNK_SIZE || 100);
					for (let i = 0; i < records.length; i += chunkSize) {
						const batch = records.slice(i, i + chunkSize);
						logger.info(`Uploading batch ${i / chunkSize + 1} / ${Math.ceil(records.length / chunkSize)} ...`);

						const { res: addRes, json: addJson } = await addDocumentsWithFallback({
							host,
							indexUid: MEILISEARCH_INDEX_NAME,
							adminKey: MEILISEARCH_ADMIN_KEY,
							documents: batch,
							logger: { info: logger.info.bind(logger), warn: logger.warn.bind(logger), error: logger.error.bind(logger) },
						});

						if (!addRes.ok) {
							logger.warn(
								`Meilisearch addDocuments failed: status=${addRes.status} body=${JSON.stringify(addJson).slice(0, 500)}`,
							);
							continue;
						}

						if (!addJson?.taskUid) {
							logger.warn(
								`Meilisearch addDocuments returned no taskUid (status=${addRes.status}). body=${JSON.stringify(addJson).slice(0, 500)}`,
							);
							continue;
						}

						if (addJson?.taskUid) {
							await waitForTask({
								host,
								adminKey: MEILISEARCH_ADMIN_KEY,
								taskUid: addJson.taskUid,
								timeoutMs: 60_000,
							}).catch((e) => {
								logger.warn(
									`Meilisearch upload wait failed (ignored): ${e instanceof Error ? e.message : String(e)}`,
								);
							});
						}
					}

					logger.info(`✓ Successfully uploaded records to Meilisearch: ${MEILISEARCH_INDEX_NAME}`);
				} catch (error) {
					logger.error(`✗ Meilisearch upload error: ${error instanceof Error ? error.message : String(error)}`);
					// 不要让构建失败
				}
			},
		},
	};
}

