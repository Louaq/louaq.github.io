/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * 内嵌 PDF 预览（iframe，无需点击即可显示）。
 * 用法：::pdf{src="https://..." title="可选" height="560px" viewer="direct"}
 * - src / url：PDF 直链
 * - title：iframe 标题与无障碍说明
 * - height：可选，默认 min(70vh, 42rem)，可写 480px、60vh 等
 * - viewer：direct（默认，浏览器直接打开 PDF）| gview（经 Google 文档查看器，部分环境内嵌更稳）
 */
export function PdfEmbedComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0) {
		return h("div", { class: "hidden" }, [
			'Invalid directive. ("pdf" must be leaf: ::pdf{src="https://..."})',
		]);
	}

	const rawSrc = properties.src || properties.url;
	if (!rawSrc || typeof rawSrc !== "string") {
		return h(
			"p",
			{ class: "pdf-embed-error my-4 text-red-500" },
			"PDF 预览：缺少 src（或 url）属性。",
		);
	}

	const title =
		typeof properties.title === "string" && properties.title.trim()
			? properties.title.trim()
			: "PDF";
	const height =
		typeof properties.height === "string" && properties.height.trim()
			? properties.height.trim()
			: "min(70vh, 42rem)";

	const viewerRaw =
		typeof properties.viewer === "string" ? properties.viewer.trim().toLowerCase() : "direct";
	const useGview = viewerRaw === "gview" || viewerRaw === "google";
	const iframeSrc = useGview
		? `https://docs.google.com/viewer?url=${encodeURIComponent(rawSrc)}&embedded=true`
		: rawSrc;

	return h(
		"div",
		{
			class:
				"pdf-embed not-prose my-6 w-full max-w-full rounded-[var(--radius-large)] border border-black/10 dark:border-white/10 bg-[var(--btn-regular-bg)]/30 dark:bg-white/[0.06]",
			style: `--pdf-embed-h: ${height};`,
		},
		[
			h("iframe", {
				src: iframeSrc,
				"data-pdf-src": iframeSrc,
				title,
				class: "pdf-embed-iframe block w-full border-0 bg-white/80 dark:bg-black/20",
				referrerpolicy: "no-referrer-when-downgrade",
			}),
			h(
				"div",
				{
					class:
						"pdf-embed-toolbar flex flex-wrap items-center justify-between gap-2 border-t border-black/10 bg-[var(--card-bg)] px-3 py-2.5 text-xs text-black/65 dark:border-white/10 dark:text-white/60",
				},
				[
					h(
						"a",
						{
							href: rawSrc,
							target: "_blank",
							rel: "noopener noreferrer",
							class: "font-medium text-[var(--primary)] hover:underline",
						},
						"新窗口打开 PDF",
					),
					h(
						"span",
						{ class: "max-w-[min(100%,28rem)] leading-snug opacity-90" },
						"若上方为空白，请使用左侧链接在新窗口查看。",
					),
				],
			),
		],
	);
}
