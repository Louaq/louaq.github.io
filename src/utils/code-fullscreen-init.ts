/**
 * 代码块全屏按钮（.ec-fullscreen，由 expressive-code-header-toolbar 插件注入标题栏）：
 * 点击后把所在的 figure.frame 铺满浏览器视口（不是系统级全屏），再点一次或按 Esc 退出。
 * 用 Popover API 把 figure 送进顶层（top layer），不受外层 content-visibility 的包含块
 * 和折叠容器 max-height 裁剪影响，折叠的长代码铺满时自然完整显示。
 * popover 属性只在打开期间挂上（常驻会被 UA 样式隐藏），关闭后摘掉。
 * 事件委托挂在 document 上，swup 换页后新出现的按钮无需重新初始化。
 */

export function initCodeFullscreen(): void {
	if (document.documentElement.dataset.codeFullscreenInit === "1") return;
	document.documentElement.dataset.codeFullscreenInit = "1";

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const button = target.closest(".expressive-code .ec-fullscreen");
		if (!button) return;

		const figure = button.closest("figure") as HTMLElement;
		if (figure.matches(":popover-open")) {
			figure.hidePopover();
			return;
		}
		figure.popover = "auto";
		figure.showPopover();
	});

	// toggle 事件不冒泡，用捕获阶段在 document 上统一处理（含 Esc 关闭）
	document.addEventListener(
		"toggle",
		(event) => {
			const target = event.target as HTMLElement;
			if (
				(event as ToggleEvent).newState === "closed" &&
				target.matches(".expressive-code .frame")
			)
				target.removeAttribute("popover");
		},
		true,
	);
}
