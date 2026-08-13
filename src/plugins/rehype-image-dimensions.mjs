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
 * - 远程图：每次构建用 Range 请求抓取文件头部，由 image-size 解出尺寸；
 * - 本地图（`/` 开头）：直接读 public/ 下的文件。
 *
 * 不持久化或缓存探测结果。图片不可访问、响应失败或尺寸无法解析时直接中断
 * 构建，确保发布产物中的每张目标图片都有真实 width/height。
 *
 * 必须排在 rehype-oss-image 之后（要探测追加了 resize 参数后的最终 URL，
 * OSS 转码会改变实际像素尺寸）、rehype-figure 之前（figure 会整体复制 img
 * 的 properties）。
 */

const PUBLIC_DIR = fileURLToPath(new URL("../../public", import.meta.url));

/** Range 探测抓取的头部字节数；常见格式的尺寸信息都在文件最前面 */
const PROBE_BYTES = 128 * 1024;

function parseDimensions(buffer) {
	const { width, height } = imageSize(buffer);
	if (!width || !height) throw new Error("no dimensions");
	return { width, height };
}

async function probeRemote(src) {
	const response = await fetch(src, {
		headers: { Range: `bytes=0-${PROBE_BYTES - 1}` },
		redirect: "follow",
	});
	if (!response.ok) throw new Error(`${src}: HTTP ${response.status}`);
	return parseDimensions(Buffer.from(await response.arrayBuffer()));
}

function probeLocal(src) {
	const rel = decodeURIComponent(src.split(/[?#]/)[0]);
	const file = path.join(PUBLIC_DIR, rel);
	return parseDimensions(fs.readFileSync(file));
}

function resolveDimensions(src) {
	return /^https?:\/\//i.test(src) ? probeRemote(src) : probeLocal(src);
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
				node.properties.width = dims.width;
				node.properties.height = dims.height;
			}),
		);
	};
}
