import { visit } from "unist-util-visit";
import { withOssImageProcess } from "../utils/oss-image.ts";

/**
 * 给 markdown 正文里的阿里云 OSS 图片追加限宽 + webp 转码参数。
 *
 * 必须排在 rehype-figure 之前：figure 会把 img 的 properties 整体复制一份，
 * 排在后面就只改到被丢弃的那个节点。
 *
 * 正文最大显示宽度约 800px（--page-width 75rem 减去侧栏），按 2x DPR 取 1600。
 */
export default function rehypeOssImage(options = {}) {
	const width = options.width ?? 1600;
	const quality = options.quality ?? 80;

	const rewrite = (src) => withOssImageProcess(src, { width, quality });

	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName !== "img") return;
			const src = node.properties?.src;
			if (typeof src !== "string") return;

			const next = rewrite(src);
			if (next !== src) {
				node.properties.src = next;
			}
		});

		// 少数文章直接在 markdown 里写了原生 <img>，这类内容以 raw 节点原样透传，
		// 不会进入上面的 element 遍历。这里只替换 src 属性里的 OSS 链接，
		// 匹配范围限定在主机名 + 图片扩展名上，不解析也不改动其它 HTML。
		visit(tree, "raw", (node) => {
			if (typeof node.value !== "string") return;
			if (!node.value.includes("aliyuncs.com")) return;

			node.value = node.value.replace(
				/(src=")(https?:\/\/[^"]*aliyuncs\.com\/[^"]*)(")/g,
				(match, prefix, src, suffix) => {
					const next = rewrite(src);
					return next === src ? match : `${prefix}${next}${suffix}`;
				},
			);
		});
	};
}
