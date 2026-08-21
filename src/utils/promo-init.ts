/**
 * 文章页推广位的关闭逻辑。
 *
 * 关闭只在当前页面有效：不写任何 storage，也不跨页记忆。读者刷新、点进另一篇
 * 文章、或用 swup 前进后退，广告都会重新出现。
 *
 * 推广位只在文章详情页渲染，它的 <script> 也就只出现在文章页；swup 不会执行
 * 新页面的脚本，于是「从列表点进文章」时关闭按钮会整块失效。改由 Layout 常驻
 * 脚本调用，监听器挂在 document 上，重复调用会先移除再绑定，是幂等的。
 *
 * 类名、属性名都避开 ad / advertisement：拦截名单里的通用元素规则会直接隐藏
 * .ad-* 一类结构，那样服务端渲染再正确也看不见。
 */

/** 容器里没有可见条目了就把它一并收掉，免得留一段空白 */
function collapseEmptyStrips(): void {
	for (const strip of document.querySelectorAll<HTMLElement>(".promo-strip")) {
		const remaining = strip.querySelectorAll(
			"[data-promo-id]:not([hidden])",
		).length;
		strip.hidden = remaining === 0;
	}
}

function handlePromoClose(e: MouseEvent): void {
	const btn = (e.target as HTMLElement)?.closest<HTMLElement>(".promo-close");
	if (!btn) {
		return;
	}

	// 关闭按钮压在推广链接上，别让点击落到推广位本身
	e.preventDefault();
	e.stopPropagation();

	const item = btn.closest<HTMLElement>("[data-promo-id]");
	const id = item?.dataset.promoId;
	if (!item || !id) {
		return;
	}

	// 顶部和底部若配了同一个 id，视为同一条广告，一起收起
	const selector = `[data-promo-id="${CSS.escape(id)}"]`;
	for (const el of document.querySelectorAll<HTMLElement>(selector)) {
		el.hidden = true;
	}

	collapseEmptyStrips();
}

export function initPromoStrip(): void {
	document.removeEventListener("click", handlePromoClose, true);
	document.addEventListener("click", handlePromoClose, true);
}
