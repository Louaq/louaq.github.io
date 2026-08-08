import { getCollection } from "astro:content";
import { createHash } from "node:crypto";
import type { APIRoute } from "astro";
import { getPostUrlForEntry } from "@/utils/url-utils";

// 截断文本到指定字节大小，避免单条记录过大导致 Meilisearch 入库失败
function truncateToBytes(str: string, maxBytes: number): string {
	const encoder = new TextEncoder();
	const bytes = encoder.encode(str);

	if (bytes.length <= maxBytes) {
		return str;
	}

	// 截断到安全字节数
	let truncated = str;
	while (encoder.encode(truncated).length > maxBytes) {
		truncated = truncated.slice(0, Math.floor(truncated.length * 0.9));
	}

	return `${truncated}...`;
}

// 估算对象的字节大小
function estimateObjectSize(obj: any): number {
	return new TextEncoder().encode(JSON.stringify(obj)).length;
}

type MeilisearchRecord = {
	// Meilisearch 默认 primary key 为 id（我们这里显式保证所有记录都有 id）
	id: string;
	// objectID 作为 Meilisearch 的主键（primaryKey）
	objectID: string;
	// 索引只收录文章，不收录页面 / 友链 / 赞助等站点内容
	type: "post";
	title: string;
	description?: string;
	content: string;
	url: string;
	tags?: string[];
	category?: string;
	updated?: string;
	published?: string;
};

function shrinkRecordToFit(
	record: MeilisearchRecord,
	maxBytes = 9500,
): MeilisearchRecord {
	// Meilisearch 每条文档最大 10KB（不同版本可能略有差异）
	// 留 500 bytes 缓冲
	const safe: MeilisearchRecord = { ...record };
	let size = estimateObjectSize(safe);
	while (size > maxBytes) {
		const nextLen = Math.max(80, Math.floor((safe.content?.length ?? 0) * 0.8));
		safe.content = truncateToBytes(safe.content ?? "", nextLen);
		size = estimateObjectSize(safe);
		// 防止死循环（content 已经很短）
		if ((safe.content?.length ?? 0) <= 90) break;
	}
	return safe;
}

/**
 * Meilisearch 的 primary key `id` 有严格字符限制：
 * 仅允许 a-z A-Z 0-9 - _，且 <= 511 bytes。
 *
 * 站内 objectID 可能包含 `/`、`:`、`.`、中文等非法字符，所以这里做稳定映射。
 */
function makeMeiliId(objectID: string): string {
	const hash = createHash("sha256").update(objectID).digest("hex"); // 64 chars, [a-f0-9]

	let base = objectID
		.replace(/[^a-zA-Z0-9-_]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");

	if (!base) base = "doc";

	// 留出 hash 的空间，避免超过 511 bytes
	const maxBaseBytes = 430;
	// base 这里只包含 ASCII，直接 slice 字符即可
	if (Buffer.byteLength(base, "utf8") > maxBaseBytes) {
		base = base.slice(0, maxBaseBytes);
	}

	return `${base}-${hash.slice(0, 12)}`;
}

export const GET: APIRoute = async () => {
	const posts = await getCollection("posts");

	// 过滤掉草稿文章
	const publishedPosts = posts.filter((post) => !post.data.draft);

	const records: MeilisearchRecord[] = [];

	// 索引只收录文章。页面（关于/留言板/归档/友链/赞助等）与友链条目一律不入库，
	// 从 payload 里消失的旧记录会被 utils/meilisearch.ts 的陈旧文档清理自动删除。
	for (const post of publishedPosts) {
		// 加密文章：标题/描述/标签仍可被搜到（方便用户找到入口去解锁），
		// 但正文明文绝不能进索引——否则会绕过页面端的密码/加密保护，
		// 被公开 search key 直接查到完整内容
		const isProtected = Boolean(post.data.password);

		// 预留一部分给其他字段，正文最多约 8KB
		const maxContentBytes = 8000;
		const body = post.body ?? "";
		const truncatedContent = isProtected
			? ""
			: truncateToBytes(body, maxContentBytes);

		const objectID = post.id;
		const rec: MeilisearchRecord = {
			// Meilisearch primaryKey：必须满足字符限制
			id: makeMeiliId(objectID),
			objectID,
			type: "post",
			title: post.data.title,
			description: post.data.description || "",
			content: truncatedContent,
			published: post.data.published.toISOString(),
			updated: (post.data.updated ?? post.data.published).toISOString(),
			tags: post.data.tags || [],
			category: post.data.category || "",
			url: getPostUrlForEntry(post),
		};
		records.push(shrinkRecordToFit(rec));
	}

	return new Response(JSON.stringify(records, null, 2), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
