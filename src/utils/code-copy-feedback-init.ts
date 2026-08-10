/**
 * 代码块复制按钮：点击后把图标换成对勾，3 秒后恢复。
 *
 * expressive-code 自带的反馈是一个绿色文字气泡（.feedback），是在点击后异步
 * （await navigator.clipboard.writeText 成功后）才插入 DOM 的，没法用 CSS
 * 提前拦住，纯 opacity 隐藏它也还留着节点。这里用 MutationObserver 监听，
 * 一旦它被插入就立刻整个删掉。事件委托 + 全局观察都挂在 document 上，
 * 不依赖枚举 DOM，swup 换页后新出现的复制按钮无需重新初始化。
 */

const COPIED_CLASS = "ec-copy-done";
const COPIED_DURATION_MS = 3000;
const FEEDBACK_SELECTOR = ".expressive-code .copy .feedback";

function scheduleRevert(button: HTMLElement): void {
	const prevTimer = button.dataset.copyTimer;
	if (prevTimer) window.clearTimeout(Number(prevTimer));

	const timerId = window.setTimeout(() => {
		button.classList.remove(COPIED_CLASS);
		delete button.dataset.copyTimer;
	}, COPIED_DURATION_MS);
	button.dataset.copyTimer = String(timerId);
}

function stripFeedbackBubbles(node: Node): void {
	if (!(node instanceof Element)) return;
	if (node.matches(FEEDBACK_SELECTOR)) {
		node.remove();
		return;
	}
	for (const el of node.querySelectorAll(FEEDBACK_SELECTOR)) el.remove();
}

export function initCodeCopyFeedback(): void {
	if (document.documentElement.dataset.codeCopyFeedbackInit === "1") return;
	document.documentElement.dataset.codeCopyFeedbackInit = "1";

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const button = target.closest<HTMLElement>(".expressive-code .copy button");
		if (!button) return;

		button.classList.add(COPIED_CLASS);
		scheduleRevert(button);
	});

	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) stripFeedbackBubbles(node);
		}
	}).observe(document.body, { childList: true, subtree: true });
}
