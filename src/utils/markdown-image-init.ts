/**
 * 正文图片的「加载完成前模糊占位」（参考 ThriveX-Blog 的 markdown-img--loading）。
 *
 * 刻意由 JS 加类而不是让 rehype 直接把类写进 HTML：这样禁用/加载失败 JS 时
 * 图片是正常显示的，不会永远糊着。
 *
 * 正文图已改为 eager 加载（见 src/plugins/rehype-figure.mjs），所以这里只负责观感，
 * 不承担布局稳定性的职责。
 */

const LOADING_CLASS = "markdown-img--loading";

function track(img: HTMLImageElement): void {
	// 已经处理过或已经加载完的，直接跳过
	if (img.dataset.mdImgTracked === "1") return;
	img.dataset.mdImgTracked = "1";

	if (img.complete && img.naturalWidth > 0) return;

	img.classList.add(LOADING_CLASS);

	const clear = () => {
		img.classList.remove(LOADING_CLASS);
		img.removeEventListener("load", clear);
		img.removeEventListener("error", clear);
	};

	img.addEventListener("load", clear);
	// 加载失败也要把模糊去掉，否则会留下一块糊掉的占位
	img.addEventListener("error", clear);
}

export function initMarkdownImages(): void {
	const imgs = document.querySelectorAll<HTMLImageElement>(
		".custom-md img.markdown-img",
	);
	for (const img of imgs) {
		track(img);
	}
}
