/**
 * TOC (Table of Contents) 工具类
 * 用于 SidebarTOC 和 FloatingTOC 的共享逻辑
 */

/**
 * TOC 空状态文案。
 *
 * 刻意不 import `@i18n/translation`：本模块只跑在客户端，而那个模块静态引用了
 * 全部 5 种语言（打包后 ~44KB），为一个字符串把它拖进每个页面的首屏 JS 不划算。
 * 文案由 ConfigCarrier.astro 在服务端写进 `#config-carrier[data-toc-empty]`。
 */
function getTocEmptyLabel(): string {
	const carrier = document.getElementById("config-carrier");
	return carrier?.dataset.tocEmpty || "No headings found";
}

export interface TOCConfig {
	contentId: string;
	indicatorId: string;
	maxLevel?: number;
	scrollOffset?: number;
}

export class TOCManager {
	private tocItems: HTMLElement[] = [];
	private observer: IntersectionObserver | null = null;
	private minDepth = 10;
	private maxLevel: number;
	private scrollTimeout: number | null = null;
	private scrollCorrectionFrame: number | null = null;
	private scrollCorrectionCleanup: (() => void) | null = null;
	private contentId: string;
	private indicatorId: string;
	private scrollOffset: number;

	constructor(config: TOCConfig) {
		this.contentId = config.contentId;
		this.indicatorId = config.indicatorId;
		this.maxLevel = config.maxLevel || 3;
		this.scrollOffset = config.scrollOffset || 80;
	}

	/**
	 * 查找文章内容容器
	 */
	private getContentContainer(): Element | null {
		return (
			document.querySelector(".custom-md") ||
			document.querySelector(".prose") ||
			document.querySelector(".markdown-content")
		);
	}

	/**
	 * 查找所有标题
	 */
	private getAllHeadings(): HTMLElement[] {
		const contentContainer = this.getContentContainer();
		if (!contentContainer) {
			return [];
		}
		return Array.from(
			contentContainer.querySelectorAll("h1, h2, h3, h4, h5, h6"),
		);
	}

	/**
	 * 计算最小深度
	 */
	private calculateMinDepth(headings: HTMLElement[]): number {
		let minDepth = 10;
		headings.forEach((heading) => {
			const depth = Number.parseInt(heading.tagName.charAt(1), 10);
			minDepth = Math.min(minDepth, depth);
		});
		return minDepth;
	}

	/**
	 * 过滤标题
	 */
	private filterHeadings(headings: HTMLElement[]): HTMLElement[] {
		return Array.from(headings).filter((heading) => {
			const depth = Number.parseInt(heading.tagName.charAt(1), 10);
			return depth < this.minDepth + this.maxLevel;
		});
	}

	/**
	 * 获取标题的纯文本内容（排除 script/style 标签的文本）
	 */
	private getCleanTextContent(element: HTMLElement): string {
		const clone = element.cloneNode(true) as HTMLElement;
		for (const el of clone.querySelectorAll("script, style")) {
			el.remove();
		}
		return clone.textContent || "";
	}

	/**
	 * 转义 HTML 属性值，避免标题中的引号破坏属性
	 */
	private escapeHtmlAttr(value: string): string {
		return value
			.replace(/&/g, "&amp;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
	}

	/**
	 * 生成徽章内容
	 */
	private generateBadgeContent(depth: number, heading1Count: number): string {
		if (depth === this.minDepth) {
			return heading1Count.toString();
		}
		if (depth === this.minDepth + 1) {
			return '<span class="toc-badge-dot"></span>';
		}
		return '<span class="toc-badge-dot toc-badge-dot-sm"></span>';
	}

	/**
	 * 空状态文案
	 */
	private getEmptyStateHTML(): string {
		return `<div class="text-center py-8 text-gray-500 dark:text-gray-400"><p>${getTocEmptyLabel()}</p></div>`;
	}

	/**
	 * 生成TOC HTML
	 */
	public generateTOCHTML(): string {
		const headings = this.getAllHeadings();

		if (headings.length === 0) {
			return this.getEmptyStateHTML();
		}

		this.minDepth = this.calculateMinDepth(headings);
		const filteredHeadings = this.filterHeadings(headings);

		if (filteredHeadings.length === 0) {
			return this.getEmptyStateHTML();
		}

		let tocHTML = "";
		let heading1Count = 1;

		filteredHeadings.forEach((heading) => {
			const depth = Number.parseInt(heading.tagName.charAt(1), 10);
			const depthLevel =
				depth === this.minDepth ? 0 : depth === this.minDepth + 1 ? 1 : 2;

			if (!heading.id) {
				return;
			}

			const badgeContent = this.generateBadgeContent(depth, heading1Count);
			if (depth === this.minDepth) {
				heading1Count++;
			}

			let headingText = this.getCleanTextContent(heading)
				.replace(/#+\s*$/, "")
				.trim();

			// Fallback for empty text (e.g. dynamic subtitle)
			if (!headingText) {
				const dataSubtitles = heading.getAttribute("data-subtitles");
				if (dataSubtitles) {
					try {
						const subtitles = JSON.parse(dataSubtitles);
						headingText = Array.isArray(subtitles) ? subtitles[0] : subtitles;
					} catch {
						// ignore
					}
				}
			}

			if (!headingText) {
				headingText =
					heading.id === "banner-subtitle"
						? "Banner Subtitle"
						: heading.id || "Heading";
			}

			const escapedHeadingText = this.escapeHtmlAttr(headingText);

			tocHTML += `
        <a 
          href="#${heading.id}" 
			  class="toc-item toc-level-${depthLevel}"
          data-heading-id="${heading.id}"
		  aria-label="${escapedHeadingText}"
		  title="${escapedHeadingText}"
        >
			  <div class="toc-badge ${depth === this.minDepth ? "toc-badge-index" : ""}">
            ${badgeContent}
          </div>
			  <div class="toc-label ${depth <= this.minDepth + 1 ? "toc-label-primary" : "toc-label-secondary"}">${headingText}</div>
        </a>
      `;
		});

		tocHTML += `<div id="${this.indicatorId}" style="opacity: 0;" class="toc-active-indicator"></div>`;

		return tocHTML;
	}

	/**
	 * 更新TOC内容
	 */
	public updateTOCContent(): void {
		const tocContent = document.getElementById(this.contentId);
		if (!tocContent) return;

		tocContent.innerHTML = this.generateTOCHTML();
		this.tocItems = Array.from(
			document.querySelectorAll(`#${this.contentId} a`),
		);
	}

	/**
	 * 获取可见的标题ID
	 */
	private getVisibleHeadingIds(): string[] {
		const headings = this.getAllHeadings();
		const visibleHeadingIds: string[] = [];

		headings.forEach((heading) => {
			if (heading.id) {
				const rect = heading.getBoundingClientRect();
				const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

				if (isVisible) {
					visibleHeadingIds.push(heading.id);
				}
			}
		});

		// 如果没有可见标题，选择最接近屏幕顶部的标题
		if (visibleHeadingIds.length === 0 && headings.length > 0) {
			let closestHeading: string | null = null;
			let minDistance = Number.POSITIVE_INFINITY;

			headings.forEach((heading) => {
				if (heading.id) {
					const rect = heading.getBoundingClientRect();
					const distance = Math.abs(rect.top);

					if (distance < minDistance) {
						minDistance = distance;
						closestHeading = heading.id;
					}
				}
			});

			if (closestHeading) {
				visibleHeadingIds.push(closestHeading);
			}
		}

		return visibleHeadingIds;
	}

	/**
	 * 更新活动状态
	 */
	public updateActiveState(): void {
		if (!this.tocItems || this.tocItems.length === 0) return;

		// 移除所有活动状态
		this.tocItems.forEach((item) => {
			item.classList.remove("visible");
		});

		const visibleHeadingIds = this.getVisibleHeadingIds();

		// 找到对应的TOC项并添加活动状态
		const activeItems = this.tocItems.filter((item) => {
			const headingId = item.dataset.headingId;
			return headingId && visibleHeadingIds.includes(headingId);
		});

		// 添加活动状态
		activeItems.forEach((item) => {
			item.classList.add("visible");
		});

		// 更新活动指示器
		this.updateActiveIndicator(activeItems);
	}

	/**
	 * 更新活动指示器
	 */
	private updateActiveIndicator(activeItems: HTMLElement[]): void {
		const indicator = document.getElementById(this.indicatorId);
		if (!indicator || !this.tocItems.length) return;

		if (activeItems.length === 0) {
			indicator.style.opacity = "0";
			return;
		}

		const tocContent = document.getElementById(this.contentId);
		if (!tocContent) return;

		const contentRect = tocContent.getBoundingClientRect();
		const firstActive = activeItems[0];
		const lastActive = activeItems[activeItems.length - 1];

		const firstRect = firstActive.getBoundingClientRect();
		const lastRect = lastActive.getBoundingClientRect();

		const top = firstRect.top - contentRect.top;
		const height = lastRect.bottom - firstRect.top;

		indicator.style.top = `${top}px`;
		indicator.style.height = `${height}px`;
		indicator.style.opacity = "1";

		// 自动滚动到活动项
		if (firstActive) {
			this.scrollToActiveItem(firstActive);
		}
	}

	/**
	 * 滚动到活动项
	 */
	private scrollToActiveItem(activeItem: HTMLElement): void {
		if (!activeItem) return;

		const tocContainer = document
			.querySelector(`#${this.contentId}`)
			?.closest(".toc-scroll-container");
		if (!tocContainer) return;

		// 清除之前的定时器
		if (this.scrollTimeout) {
			clearTimeout(this.scrollTimeout);
		}

		// 使用节流机制
		this.scrollTimeout = window.setTimeout(() => {
			const containerRect = tocContainer.getBoundingClientRect();
			const itemRect = activeItem.getBoundingClientRect();

			// 只在元素不在可视区域时才滚动
			const isVisible =
				itemRect.top >= containerRect.top &&
				itemRect.bottom <= containerRect.bottom;

			if (!isVisible) {
				const itemOffsetTop = (activeItem as HTMLElement).offsetTop;
				const containerHeight = tocContainer.clientHeight;
				const itemHeight = activeItem.clientHeight;

				// 计算目标滚动位置，将元素居中显示
				const targetScroll =
					itemOffsetTop - containerHeight / 2 + itemHeight / 2;

				tocContainer.scrollTo({
					top: targetScroll,
					behavior: "smooth",
				});
			}
		}, 100);
	}

	/**
	 * 处理点击事件
	 */
	public handleClick(event: Event): void {
		event.preventDefault();
		const target = event.currentTarget as HTMLAnchorElement;
		const id = decodeURIComponent(
			target.getAttribute("href")?.substring(1) || "",
		);
		const targetElement = document.getElementById(id);

		if (targetElement) {
			this.scrollToHeading(targetElement);
		}
	}

	/**
	 * 滚动到指定标题：自己用 rAF 逐帧驱动，每帧重新测量目标位置。
	 *
	 * 为什么不能直接用原生 `scrollTo({ behavior: "smooth" })`：正文图片是 loading="lazy"
	 * 且没有固定宽高，滚动经过时才开始加载，加载完又把后面的内容往下推，点击瞬间算好的
	 * 坐标滚到一半就过期了，标题越靠后偏得越多。而"滚完再补一次平滑滚动"的做法，用户会
	 * 看到一段一段地挪过去。
	 *
	 * 这里改成自己控制每一帧的位置：插值的终点每帧重新取，布局抖动被均摊进正在进行的这
	 * 一次动画里，看到的始终是一段连续的运动，且动画结束时刚好落在最新的正确位置。
	 * 动画结束后再盯一小段时间，此时若仍有图片加载完成，就瞬时补偿——因为人眼盯着的是
	 * 目标标题，瞬时补偿反而让标题稳稳钉在原处。
	 */
	private scrollToHeading(el: HTMLElement): void {
		// 上一次还没结束就又点了，先取消，避免两段动画互相打架
		this.cancelScrollCorrection();

		const DURATION_MS = 460;
		// 动画结束后继续盯这么久，把迟到的图片造成的位移吃掉
		const SETTLE_MS = 900;
		const TOLERANCE_PX = 1;

		const root = document.documentElement;
		// 全局 html{scroll-behavior:smooth} 会把我们逐帧的 scrollTo 也变成动画，必须临时关掉
		const prevBehavior = root.style.scrollBehavior;
		root.style.scrollBehavior = "auto";

		const desiredTop = () => {
			const wanted =
				el.getBoundingClientRect().top + window.scrollY - this.scrollOffset;
			const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
			// 末尾的标题可能压根滚不到指定偏移，钳到底部即可，否则会一直判定"没到位"
			return Math.min(Math.max(wanted, 0), maxScroll);
		};

		const stop = () => this.cancelScrollCorrection();

		// 用户中途自己滚动/翻页，立刻让路
		const userInterrupts = ["wheel", "touchstart", "keydown"] as const;
		for (const type of userInterrupts) {
			window.addEventListener(type, stop, { passive: true, once: true });
		}
		this.scrollCorrectionCleanup = () => {
			for (const type of userInterrupts) {
				window.removeEventListener(type, stop);
			}
			root.style.scrollBehavior = prevBehavior;
		};

		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		const startY = window.scrollY;
		const startTime = performance.now();
		// easeInOutCubic
		const ease = (t: number) =>
			t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

		const step = (now: number) => {
			const elapsed = now - startTime;
			const target = desiredTop();

			if (reduceMotion || elapsed >= DURATION_MS) {
				// 动画阶段结束：进入盯梢，位置有偏差就瞬时补上
				if (Math.abs(target - window.scrollY) > TOLERANCE_PX) {
					window.scrollTo(0, target);
				}
				if (elapsed >= DURATION_MS + SETTLE_MS) {
					stop();
					return;
				}
			} else {
				const t = ease(elapsed / DURATION_MS);
				// 终点每帧重取：目标被推走多少，本帧就按当前进度吃掉多少，
				// t→1 时完全吸收，动画自然收在最新的正确位置上
				window.scrollTo(0, startY + (target - startY) * t);
			}

			this.scrollCorrectionFrame = requestAnimationFrame(step);
		};

		this.scrollCorrectionFrame = requestAnimationFrame(step);
	}

	/** 停止正在进行的落点校正 */
	private cancelScrollCorrection(): void {
		if (this.scrollCorrectionFrame !== null) {
			cancelAnimationFrame(this.scrollCorrectionFrame);
			this.scrollCorrectionFrame = null;
		}
		this.scrollCorrectionCleanup?.();
		this.scrollCorrectionCleanup = null;
	}

	/**
	 * 设置IntersectionObserver
	 */
	public setupObserver(): void {
		const headings = this.getAllHeadings();

		if (this.observer) {
			this.observer.disconnect();
		}

		this.observer = new IntersectionObserver(
			() => {
				this.updateActiveState();
			},
			{
				rootMargin: "0px 0px 0px 0px",
				threshold: 0,
			},
		);

		headings.forEach((heading) => {
			if (heading.id) {
				this.observer?.observe(heading);
			}
		});
	}

	/**
	 * 绑定点击事件
	 */
	public bindClickEvents(): void {
		this.tocItems.forEach((item) => {
			item.addEventListener("click", this.handleClick.bind(this));
		});
	}

	/**
	 * 清理
	 */
	public cleanup(): void {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
		if (this.scrollTimeout) {
			clearTimeout(this.scrollTimeout);
			this.scrollTimeout = null;
		}
		this.cancelScrollCorrection();
	}

	/**
	 * 初始化
	 */
	public init(): void {
		this.updateTOCContent();
		this.bindClickEvents();
		this.setupObserver();
		this.updateActiveState();
	}
}

/**
 * 检查是否为文章页面
 */
export function isPostPage(): boolean {
	return window.location.pathname.includes("/posts/");
}
