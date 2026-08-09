import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { imageSize } from "image-size";
import { visit } from "unist-util-visit";

/**
 * 构建期给正文图片写入真实 width/height。
 *
 * 这是目录（TOC）落点不准的根治方案：正文里的远程图（imgdb / 阿里云 OSS）
 * 原本没有任何尺寸信息，加载前高度 ≈ 0、加载后撑到几百像素，冷缓存环境
 * （如 Netlify 首访）下页面高度在首屏后的几秒内持续增长——点击目录那一刻
 * 算出的滚动坐标随即过期。写入 width/height 后，浏览器在 HTML 解析阶段就
 * 按宽高比预留好每张图的空间（Tailwind preflight 的 `img { max-width:100%;
 * height:auto }` 负责把属性尺寸换算成响应式占位），布局一次成形，不再抖动。
 *
 * 尺寸来源：
 * - 远程图：构建时用 Range 请求抓取文件头部，由 image-size 解出尺寸；
 * - 本地图（`/` 开头）：直接读 public/ 下的文件。
 *
 * 结果持久化在 src/data/image-dimensions.json（随仓库提交）。命中缓存的图
 * 不发任何网络请求，因此 Netlify 构建通常零探测；新文章的新图在本地构建时
 * 探测一次并写回缓存文件。探测失败（网络波动、非图片资源）只告警不中断构建，
 * 该图保持无尺寸——退化为修复前的行为，而不是构建失败。
 *
 * 必须排在 rehype-oss-image 之后（要探测追加了 resize 参数后的最终 URL，
 * OSS 转码会改变实际像素尺寸）、rehype-figure 之前（figure 会整体复制 img
 * 的 properties）。
 */

const CACHE_PATH = fileURLToPath(
	new URL("../data/image-dimensions.json", import.meta.url),
);
const PUBLIC_DIR = fileURLToPath(new URL("../../public", import.meta.url));

/** Range 探测抓取的头部字节数；常见格式的尺寸信息都在文件最前面 */
const PROBE_BYTES = 128 * 1024;
const FETCH_TIMEOUT_MS = 15_000;

/** 磁盘缓存（懒加载一次）+ 本次进程内的探测结果与去重 */
let diskCache = null;
const memoryCache = new Map(); // src -> {width,height} | null（null=失败，不落盘）
const inflight = new Map(); // src -> Promise

function loadDiskCache() {
	if (diskCache) return diskCache;
	try {
		diskCache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
	} catch {
		diskCache = {};
	}
	return diskCache;
}

function saveDiskCache() {
	// key 排序保证文件 diff 稳定
	const sorted = Object.fromEntries(
		Object.entries(diskCache).sort(([a], [b]) => a.localeCompare(b)),
	);
	fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
	fs.writeFileSync(CACHE_PATH, `${JSON.stringify(sorted, null, "\t")}\n`);
}

function parseDimensions(buffer) {
	const { width, height } = imageSize(buffer);
	if (!width || !height) throw new Error("no dimensions");
	return { width, height };
}

async function probeRemote(src) {
	const fetchBytes = async (headers) => {
		const res = await fetch(src, {
			headers,
			redirect: "follow",
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return Buffer.from(await res.arrayBuffer());
	};

	const head = await fetchBytes({ Range: `bytes=0-${PROBE_BYTES - 1}` });
	try {
		return parseDimensions(head);
	} catch {
		// 头部不够（个别渐进式 JPEG）：若服务器确实只给了片段，就退回抓整张
		if (head.length < PROBE_BYTES) throw new Error("unparsable image");
		return parseDimensions(await fetchBytes({}));
	}
}

function probeLocal(src) {
	const rel = decodeURIComponent(src.split(/[?#]/)[0]);
	const file = path.join(PUBLIC_DIR, rel);
	return parseDimensions(fs.readFileSync(file));
}

async function resolveDimensions(src) {
	if (memoryCache.has(src)) return memoryCache.get(src);

	const cached = loadDiskCache()[src];
	if (cached?.width && cached?.height) {
		memoryCache.set(src, cached);
		return cached;
	}

	if (inflight.has(src)) return inflight.get(src);

	const task = (async () => {
		try {
			const dims = /^https?:\/\//i.test(src)
				? await probeRemote(src)
				: probeLocal(src);
			diskCache[src] = dims;
			saveDiskCache();
			return dims;
		} catch (error) {
			console.warn(
				`[rehype-image-dimensions] 探测失败，跳过 ${src}: ${error.message}`,
			);
			return null; // 失败只记在内存里，下次构建重试
		} finally {
			inflight.delete(src);
		}
	})();

	inflight.set(src, task);
	const dims = await task;
	memoryCache.set(src, dims);
	return dims;
}

export default function rehypeImageDimensions() {
	return async (tree) => {
		const pending = [];

		visit(tree, "element", (node) => {
			if (node.tagName !== "img") return;
			const src = node.properties?.src;
			if (typeof src !== "string" || src.length === 0) return;
			// 只处理远程图与 public/ 下的绝对路径；相对路径图片由 Astro
			// 自己的图片管线处理（已自带尺寸），data: 等一律跳过
			if (!/^https?:\/\//i.test(src) && !src.startsWith("/")) return;
			// 作者手写过尺寸的尊重原值
			if (node.properties.width && node.properties.height) return;
			pending.push(node);
		});

		if (pending.length === 0) return;

		await Promise.all(
			pending.map(async (node) => {
				const dims = await resolveDimensions(String(node.properties.src));
				if (dims) {
					node.properties.width = dims.width;
					node.properties.height = dims.height;
				}
			}),
		);
	};
}
