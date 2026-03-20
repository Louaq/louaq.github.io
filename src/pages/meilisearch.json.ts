import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { getEnabledFriends } from "../config/friendsConfig";
import { sponsorConfig } from "../config/sponsorConfig";
import { siteConfig } from "../config/siteConfig";
import { scanAlbums } from "../utils/album-scanner";
import { watchlistConfig } from "../config/watchlist";

// 截断文本到指定字节大小，避免单条记录过大导致 Meilisearch 入库失败
function truncateToBytes(str: string, maxBytes: number): string {
	const encoder = new TextEncoder();
	let bytes = encoder.encode(str);

	if (bytes.length <= maxBytes) {
		return str;
	}

	// 截断到安全字节数
	let truncated = str;
	while (encoder.encode(truncated).length > maxBytes) {
		truncated = truncated.slice(0, Math.floor(truncated.length * 0.9));
	}

	return truncated + "...";
}

// 估算对象的字节大小
function estimateObjectSize(obj: any): number {
	return new TextEncoder().encode(JSON.stringify(obj)).length;
}

type MeilisearchRecord = {
	// Meilisearch 默认 primary key 为 id（我们这里显式保证所有记录都有 id）
	id: string;
	// 保留 objectID 字段，便于和旧 Algolia 记录互相对照
	objectID: string;
	type: "post" | "page" | "friend" | "album" | "watchlist";
	title: string;
	description?: string;
	content: string;
	url: string;
	tags?: string[];
	category?: string;
	updated?: string;
	published?: string;
};

function shrinkRecordToFit(record: MeilisearchRecord, maxBytes = 9500): MeilisearchRecord {
	// Meilisearch 每条文档最大 10KB（不同版本可能略有差异）
	// 留 500 bytes 缓冲
	let safe: MeilisearchRecord = { ...record };
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

function makeAnchorId(prefix: string, raw: string): string {
	const base = encodeURIComponent(raw.trim())
		.replace(/%/g, "")
		.replace(/[()]/g, "");
	// 控制长度，避免 url/id 过长
	const short = base.length > 80 ? base.slice(0, 80) : base;
	return `${prefix}-${short}` || prefix;
}

export const GET: APIRoute = async () => {
	const posts = await getCollection("posts");
	const spec = await getCollection("spec");

	// 过滤掉草稿文章（spec 默认都视为发布）
	const publishedPosts = posts.filter((post) => !post.data.draft);

	const records: MeilisearchRecord[] = [];

	// 1) 文章
	for (const post of publishedPosts) {
		// 预留一部分给其他字段，正文最多约 8KB
		const maxContentBytes = 8000;
		const body = post.body ?? "";
		const truncatedContent = truncateToBytes(body, maxContentBytes);

		const objectID = post.id;
		const rec: MeilisearchRecord = {
			// 保持与旧索引兼容：沿用文章原 objectID
			id: objectID,
			objectID,
			type: "post",
			title: post.data.title,
			description: post.data.description || "",
			content: truncatedContent,
			published: post.data.published.toISOString(),
			updated: (post.data.updated ?? post.data.published).toISOString(),
			tags: post.data.tags || [],
			category: post.data.category || "",
			url: `/posts/${post.id}/`,
		};
		records.push(shrinkRecordToFit(rec));
	}

	// 2) 固定页面（src/content/spec/*.md）
	const specMeta: Record<string, { title: string; url: string; description?: string }> = {
		about: { title: "关于", url: "/about/" },
		friends: { title: "友链", url: "/friends/" },
		guestbook: { title: "留言板", url: "/guestbook/" },
	};
	for (const page of spec) {
		const meta = specMeta[page.id] ?? { title: page.id, url: `/${page.id}/` };
		const maxContentBytes = 8000;
		const body = page.body ?? "";
		const truncatedContent = truncateToBytes(body, maxContentBytes);

		const objectID = `page:${page.id}`;
		const rec: MeilisearchRecord = {
			id: objectID,
			objectID,
			type: "page",
			title: meta.title,
			description: meta.description ?? "",
			content: truncatedContent,
			url: meta.url,
		};
		records.push(shrinkRecordToFit(rec));
	}

	// 2.5) 站点栏目入口页（不依赖 markdown 内容）
	records.push(
		shrinkRecordToFit({
			id: "page:archive",
			objectID: "page:archive",
			type: "page",
			title: "归档",
			description: "按时间浏览全部文章",
			content: publishedPosts.map((p) => p.data.title).join("\n"),
			url: "/archive/",
		}),
	);

	if (siteConfig.pages.bangumi) {
		records.push(
			shrinkRecordToFit({
				id: "page:bangumi",
				objectID: "page:bangumi",
				type: "page",
				title: "Bangumi",
				description: "追番与游戏",
				content: "Bangumi 追番与游戏",
				url: "/bangumi/",
			}),
		);
	}

	// 3) 友链（外部链接也纳入搜索）
	const friends = getEnabledFriends();
	for (const f of friends) {
		const objectID = `friend:${f.siteurl}`;
		const rec: MeilisearchRecord = {
			id: objectID,
			objectID,
			type: "friend",
			title: f.title,
			description: f.desc ?? "",
			content: [f.title, f.desc, ...(f.tags ?? [])].filter(Boolean).join("\n"),
			url: f.siteurl,
			tags: f.tags ?? [],
			category: "friends",
		};
		records.push(shrinkRecordToFit(rec));
	}

	// 4) 相册（如果页面开启，则索引相册列表与每个相册）
	if (siteConfig.pages.albums) {
		const albums = await scanAlbums();

		// 相册总览页
		records.push(
			shrinkRecordToFit({
				id: "page:albums",
				objectID: "page:albums",
				type: "page",
				title: "相册",
				description: "相册与照片集",
				content: albums
					.map((a) => `${a.title}\n${a.description ?? ""}\n${(a.tags ?? []).join(" ")}`)
					.join("\n\n"),
				url: "/albums/",
			}),
		);

		// 每个相册详情页
		for (const a of albums) {
			const objectID = `album:${a.id}`;
			const rec: MeilisearchRecord = {
				id: objectID,
				objectID,
				type: "album",
				title: a.title,
				description: a.description ?? "",
				content: [a.title, a.description, a.location, ...(a.tags ?? [])].filter(Boolean).join("\n"),
				url: `/albums/${a.id}/`,
				tags: a.tags ?? [],
				category: a.location ?? "",
				updated: new Date(a.date).toISOString(),
			};
			records.push(shrinkRecordToFit(rec));
		}
	}

	// 5) 观影清单（如果页面开启，则索引每条作品并跳到锚点）
	if (siteConfig.pages.watchlist) {
		const enabledItems = watchlistConfig.items.filter((it) => it.enabled);

		// 观影清单入口页
		records.push(
			shrinkRecordToFit({
				id: "page:watchlist",
				objectID: "page:watchlist",
				type: "page",
				title: "观影清单",
				description: "动漫 / 电影 / 电视剧 / 纪录片 / 其他",
				content: enabledItems
					.map((it) => `${it.title}\n${it.comment ?? ""}\n${(it.tags ?? []).join(" ")}`)
					.join("\n\n"),
				url: "/watchlist/",
			}),
		);

		for (const it of enabledItems) {
			const anchor = makeAnchorId("watch", `${it.type} ${it.title}`);
			const objectID = `watchlist:${it.type}:${it.title}`;
			const rec: MeilisearchRecord = {
				id: objectID,
				objectID,
				type: "watchlist",
				title: it.title,
				description: it.comment ?? "",
				content: [it.title, it.comment, it.type, it.status, it.startDate, it.endDate, ...(it.tags ?? [])]
					.filter(Boolean)
					.join("\n"),
				url: `/watchlist/#${anchor}`,
				tags: it.tags ?? [],
				category: it.type,
				updated: new Date(
					((it.endDate ?? it.startDate ?? new Date().toISOString()) as string),
				).toISOString(),
			};
			records.push(shrinkRecordToFit(rec));
		}
	}

	// 6) 赞助页（如果页面开启）
	if (siteConfig.pages.sponsor) {
		const enabledMethods = sponsorConfig.methods.filter((m) => m.enabled);
		records.push(
			shrinkRecordToFit({
				id: "page:sponsor",
				objectID: "page:sponsor",
				type: "page",
				title: sponsorConfig.title || "赞助",
				description: sponsorConfig.description || sponsorConfig.usage || "",
				content: [
					sponsorConfig.usage,
					...enabledMethods.map((m) => `${m.name}\n${m.description ?? ""}\n${m.link ?? ""}`),
					...(sponsorConfig.sponsors ?? []).map((s) => `${s.name}\n${s.amount ?? ""}\n${s.message ?? ""}`),
				]
					.filter(Boolean)
					.join("\n\n"),
				url: "/sponsor/",
			}),
		);
	}

	return new Response(JSON.stringify(records, null, 2), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};

