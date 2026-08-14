/**
 * 正文重型块（超长代码块 .expressive-code / 公式 .katex-display-container）在
 * markdown.css 里设了 `content-visibility: auto; contain-intrinsic-size: auto <估值>`：
 * 视口外整块跳过渲染，让首屏与深浅色切换的开销只与可见区域成正比。
 *
 * 代价是：块在第一次进入视口之前，参与布局的是占位估值而非真实高度。目标标题
 * 上方每个未渲染过的块都贡献一份「真实高度 − 估值」的误差并沿文档累积，导致
 * 一切基于坐标的滚动（目录点击、URL hash、页内查找）落点偏移——scrollIntoView
 * 只强制渲染目标自身的祖先链，管不到滚动路径上的中间块。
 *
 * 本模块在页面空闲期让所有此类块真实渲染一帧再恢复 auto。contain-intrinsic-size
 * 的 auto 关键字会在这一帧记住真实尺寸，此后估值即精确值，布局彻底稳定，同时
 * content-visibility 的按视口渲染优化原样保留。渲染成本一次性发生在空闲期，
 * 相当于把未加 content-visibility 之前本就存在的整页布局从首屏挪到了空闲时。
 *
 * 记住的尺寸依赖布局宽度，故视口宽度变化后需重新预热（窄→宽换行数不同）。
 */

const idleSchedule: (cb: () => void) => number =
	typeof requestIdleCallback === "function"
		? (cb) => requestIdleCallback(cb)
		: (cb) => window.setTimeout(cb, 200);

const idleCancel: (handle: number) => void =
	typeof cancelIdleCallback === "function"
		? (handle) => cancelIdleCallback(handle)
		: (handle) => clearTimeout(handle);

let pendingIdle: number | null = null;
let resizeListenerBound = false;
let resizeTimeout: number | null = null;
let lastWarmedWidth = 0;

function collectDeferredBlocks(): HTMLElement[] {
	return Array.from(
		document.querySelectorAll<HTMLElement>(
			".custom-md .expressive-code, .custom-md .katex-display-container",
		),
	);
}

/**
 * 让所有块真实渲染一帧：inline 的 visible 覆盖样式表的 auto，帧末的
 * 渲染步骤会以真实内容布局并记录 last remembered size；下一帧撤销
 * inline 值恢复 auto——此时估值已是精确尺寸。
 */
function renderOnceToRememberSizes(blocks: HTMLElement[]): void {
	for (const block of blocks) {
		block.style.contentVisibility = "visible";
	}
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			for (const block of blocks) {
				block.style.contentVisibility = "";
			}
		});
	});
}

function scheduleWarmup(): void {
	if (pendingIdle !== null) {
		idleCancel(pendingIdle);
	}
	pendingIdle = idleSchedule(() => {
		pendingIdle = null;
		// 等 web 字体就绪后再量：字体换用会改变换行数与块高，
		// 提前记住的尺寸会作废
		document.fonts.ready.then(() => {
			const blocks = collectDeferredBlocks();
			if (blocks.length === 0) return;
			lastWarmedWidth = window.innerWidth;
			renderOnceToRememberSizes(blocks);
		});
	});
}

/**
 * 立即（同步）强制渲染目标元素之前的所有重型块，用于目录点击等程序化跳转。
 *
 * 空闲期预热覆盖不了一种竞态：页面刚加载、空闲回调还没跑完用户就点了目录。
 * 跳转路径上尚未预热的块仍用占位估值参与布局，scrollIntoView 只按点击那一刻
 * 的布局算一次落点就开始动画；动画途中这些块从占位值变为真实值（通常占位值
 * 偏大，块一收缩，目标标题连同其后内容一起上移），落点还停在旧的、偏大的
 * 坐标上，于是越过标题、落进紧跟其后的块内容里，须再点一次才准。
 *
 * 这里在跳转前把目标之前的块同步渲染一次，把坐标钉死，不再依赖空闲回调是否
 * 已经跑完。
 */
export function warmBlocksBeforeElement(target: Element): void {
	const blocks = collectDeferredBlocks().filter(
		(block) =>
			target.compareDocumentPosition(block) & Node.DOCUMENT_POSITION_PRECEDING,
	);
	if (blocks.length === 0) return;
	renderOnceToRememberSizes(blocks);
}

/**
 * 每次进入新页面（首载与 swup content:replace）调用。
 * 非文章页无匹配块，内部空转，无副作用。
 */
export function warmUpDeferredBlocks(): void {
	scheduleWarmup();

	if (!resizeListenerBound) {
		resizeListenerBound = true;
		window.addEventListener("resize", () => {
			if (resizeTimeout !== null) {
				clearTimeout(resizeTimeout);
			}
			resizeTimeout = window.setTimeout(() => {
				resizeTimeout = null;
				// 仅宽度变化会改变换行与块高；移动端滚动引发的工具栏高度抖动忽略
				if (window.innerWidth !== lastWarmedWidth) {
					scheduleWarmup();
				}
			}, 300);
		});
	}
}
