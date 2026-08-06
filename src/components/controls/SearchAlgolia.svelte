<script lang="ts">
import { onDestroy, onMount, tick } from "svelte";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { navigateToPage } from "@utils/navigation-utils";

interface Props {
	engine?: "algolia" | "milisearch";
	/** 首次挂载时是否直接打开搜索弹窗（用于懒加载入口） */
	initialOpen?: boolean;
}

let { engine, initialOpen = false } : Props = $props();

const ALGOLIA_APP_ID = import.meta.env.PUBLIC_ALGOLIA_APP_ID;
const ALGOLIA_SEARCH_KEY = import.meta.env.PUBLIC_ALGOLIA_SEARCH_KEY;
const ALGOLIA_INDEX_NAME = import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME || "blog";

const MEILISEARCH_HOST = import.meta.env.PUBLIC_MEILISEARCH_HOST || "https://search.louaq.com";
const MEILISEARCH_SEARCH_KEY = import.meta.env.PUBLIC_MEILISEARCH_SEARCH_KEY;
const MEILISEARCH_INDEX_NAME = import.meta.env.PUBLIC_MEILISEARCH_INDEX_NAME || "blog";

let initialized = $state(false);
let searchClient: any = $state(null);
let searchEngine: "algolia" | "milisearch" = $state("algolia");

let isOpen = $state(false);
let query = $state("");
let results: any[] = $state([]);
let isSearching = $state(false);
let debounceTimer: NodeJS.Timeout;
let activeIndex = $state(-1);
let prevScrollLock:
	| {
			bodyOverflow: string;
			bodyPaddingRight: string;
			htmlOverflow: string;
			htmlPaddingRight: string;
	  }
	| null = null;
const hitsPerPage = 20;
let page = $state(0);
let nbHits = $state(0);
let nbPages = $state(0);
let hasMore = $state(false);
let isLoadingMore = $state(false);
let requestSeq = 0;
let listEl: HTMLDivElement | null = $state(null);
let lastScrolledIndex = -1;

let modalInputEl: HTMLInputElement | null = $state(null);

function lockScroll() {
	if (typeof document === "undefined") return;
	if (prevScrollLock) return;

	const html = document.documentElement;
	const body = document.body;

	prevScrollLock = {
		bodyOverflow: body.style.overflow,
		bodyPaddingRight: body.style.paddingRight,
		htmlOverflow: html.style.overflow,
		htmlPaddingRight: html.style.paddingRight,
	};

	// 先计算滚动条宽度（必须在 overflow hidden 之前）
	const scrollbarWidth = window.innerWidth - html.clientWidth;

	// 锁滚动（同时锁 html/body，覆盖不同浏览器的滚动容器差异）
	html.style.overflow = "hidden";
	body.style.overflow = "hidden";

	// 用 padding-right 抵消滚动条消失导致的视口变宽（Windows 下最常见抖动来源）
	// 如果浏览器已支持 scrollbar-gutter: stable，则无需（且不应）再做 padding 补偿，否则会过度补偿导致导航栏抖动
	const hasStableScrollbarGutter =
		typeof CSS !== "undefined" &&
		typeof CSS.supports === "function" &&
		CSS.supports("scrollbar-gutter: stable");

	if (!hasStableScrollbarGutter && scrollbarWidth > 0) {
		const computed = window.getComputedStyle(body).paddingRight;
		body.style.paddingRight = `calc(${computed} + ${scrollbarWidth}px)`;
	}
}

function unlockScroll() {
	if (typeof document === "undefined") return;
	if (!prevScrollLock) return;

	const html = document.documentElement;
	const body = document.body;

	body.style.overflow = prevScrollLock.bodyOverflow;
	body.style.paddingRight = prevScrollLock.bodyPaddingRight;
	html.style.overflow = prevScrollLock.htmlOverflow;
	html.style.paddingRight = prevScrollLock.htmlPaddingRight;
	prevScrollLock = null;
}

const typeLabel = (t: string | undefined): string => {
	switch (t) {
		case "post":
			return "文章";
		case "page":
			return "页面";
		case "friend":
			return "友链";
		default:
			return "内容";
	}
};

// 简易 Portal：将节点移动到 document.body，避免被页面滚动/transform 影响
function portal(node: HTMLElement) {
	if (typeof document === "undefined") return;
	document.body.appendChild(node);
	return {
		destroy() {
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		},
	};
}

const openModal = async () => {
	isOpen = true;
	// 锁定背景滚动，避免滚动导致弹窗“丢失/穿透”
	// 注意：先打开弹窗，再锁滚动；即使锁滚动异常，也不应阻止弹窗出现
	try {
		lockScroll();
	} catch (e) {
		console.error("lockScroll failed:", e);
	}
	await tick();
	modalInputEl?.focus();
	activeIndex = -1;
	page = 0;
	nbHits = 0;
	nbPages = 0;
	hasMore = false;
	isLoadingMore = false;
};

const closeModal = () => {
	isOpen = false;
	query = "";
	results = [];
	isSearching = false;
	activeIndex = -1;
	page = 0;
	nbHits = 0;
	nbPages = 0;
	hasMore = false;
	isLoadingMore = false;
	// 恢复背景滚动
	try {
		unlockScroll();
	} catch (e) {
		console.error("unlockScroll failed:", e);
	}
};

const handleResultClick = (event: Event, url: string): void => {
	event.preventDefault();
	closeModal();
	navigateToPage(url);
};

const highlightText = (text: string, q: string): string => {
	if (!q || !text) return text;
	// 支持空格分词：对每个 token 高亮，避免整句命中率过低
	const tokens = q
		.split(/\s+/g)
		.map((t) => t.trim())
		.filter(Boolean)
		.slice(0, 8);
	if (tokens.length === 0) return text;
	const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
	const regex = new RegExp(`(${escaped.join("|")})`, "gi");
	return text.replace(regex, "<mark>$1</mark>");
};

const doSearch = async (keyword: string, opts?: { reset?: boolean }) => {
	if (!initialized) return;
	if (searchEngine === "algolia" && !searchClient) return;

	const trimmed = keyword.trim();
	if (!trimmed) {
		results = [];
		isSearching = false;
		activeIndex = -1;
		page = 0;
		nbHits = 0;
		nbPages = 0;
		hasMore = false;
		isLoadingMore = false;
		return;
	}

	if (opts?.reset) {
		page = 0;
		results = [];
		activeIndex = -1;
		nbHits = 0;
		nbPages = 0;
		hasMore = false;
		isLoadingMore = false;
	}

	isSearching = true;
	const currentReq = ++requestSeq;
	try {
		if (searchEngine === "algolia") {
			const response = await searchClient.search({
				requests: [
					{
						indexName: ALGOLIA_INDEX_NAME,
						query: trimmed,
						page: 0,
						hitsPerPage,
						attributesToRetrieve: [
							"type",
							"title",
							"description",
							"content",
							"url",
							"tags",
							"category",
						],
						attributesToSnippet: ["content:30"],
					},
				],
			});

			// 如果期间发起了新的请求，丢弃旧结果
			if (currentReq !== requestSeq) return;

			const res0 = response?.results?.[0];
			page = res0?.page ?? 0;
			nbHits = res0?.nbHits ?? 0;
			nbPages = res0?.nbPages ?? 0;
			hasMore = page < nbPages - 1;

			results = (res0?.hits || []).map((hit: any) => ({
				url: hit.url,
				type: hit.type,
				title: highlightText(hit.title, trimmed),
				description: hit.description ? highlightText(hit.description, trimmed) : "",
				excerpt: hit._snippetResult?.content?.value || "",
				tags: hit.tags || [],
				category: hit.category || "",
			}));
			activeIndex = results.length > 0 ? 0 : -1;
		} else {
			// Meilisearch(=milisearch) 搜索（search.louaq.com）
			const offset = page * hitsPerPage;
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
			};
			if (MEILISEARCH_SEARCH_KEY) {
				headers.Authorization = `Bearer ${MEILISEARCH_SEARCH_KEY}`;
			}

			const response = await fetch(
				`${MEILISEARCH_HOST.replace(/\/$/, "")}/indexes/${MEILISEARCH_INDEX_NAME}/search`,
				{
					method: "POST",
					headers,
					body: JSON.stringify({
						q: trimmed,
						limit: hitsPerPage,
						offset,
						attributesToRetrieve: [
							"type",
							"title",
							"description",
							"content",
							"url",
							"tags",
							"category",
						],
					}),
				},
			);

			const data = await response.json();
			if (currentReq !== requestSeq) return;

			const hits = data?.hits || [];
			nbHits = data?.estimatedTotalHits ?? 0;
			nbPages = Math.ceil(nbHits / hitsPerPage) || 0;
			hasMore = offset + hitsPerPage < nbHits;
			page = Math.floor(offset / hitsPerPage);

			results = hits.map((hit: any) => {
				const content = typeof hit?.content === "string" ? hit.content : "";
				const excerptRaw = content.replace(/\s+/g, " ").trim().slice(0, 180);
				return {
					url: hit.url,
					type: hit.type,
					title: highlightText(hit.title ?? "", trimmed),
					description: hit.description ? highlightText(hit.description, trimmed) : "",
					excerpt: excerptRaw ? highlightText(excerptRaw, trimmed) : "",
					tags: hit.tags || [],
					category: hit.category || "",
				};
			});
			activeIndex = results.length > 0 ? 0 : -1;
		}
	} catch (error) {
		// 保持静默失败，避免刷屏；必要时可打开 console
		console.error("Search error:", error);
		results = [];
		activeIndex = -1;
		page = 0;
		nbHits = 0;
		nbPages = 0;
		hasMore = false;
	} finally {
		if (currentReq === requestSeq) isSearching = false;
	}
};

const loadMore = async () => {
	if (!initialized) return;
	if (searchEngine === "algolia" && !searchClient) return;
	const trimmed = query.trim();
	if (!trimmed) return;
	if (!hasMore || isLoadingMore) return;

	isLoadingMore = true;
	const nextPage = page + 1;
	const currentReq = ++requestSeq;
	try {
		let newHits: any[] = [];

		if (searchEngine === "algolia") {
			const response = await searchClient.search({
				requests: [
					{
						indexName: ALGOLIA_INDEX_NAME,
						query: trimmed,
						page: nextPage,
						hitsPerPage,
						attributesToRetrieve: [
							"type",
							"title",
							"description",
							"content",
							"url",
							"tags",
							"category",
						],
						attributesToSnippet: ["content:30"],
					},
				],
			});

			if (currentReq !== requestSeq) return;

			const res0 = response?.results?.[0];
			newHits = (res0?.hits || []).map((hit: any) => ({
				url: hit.url,
				type: hit.type,
				title: highlightText(hit.title, trimmed),
				description: hit.description ? highlightText(hit.description, trimmed) : "",
				excerpt: hit._snippetResult?.content?.value || "",
				tags: hit.tags || [],
				category: hit.category || "",
			}));

			page = res0?.page ?? nextPage;
			nbHits = res0?.nbHits ?? nbHits;
			nbPages = res0?.nbPages ?? nbPages;
			hasMore = page < nbPages - 1;
		} else {
			// Meilisearch(=milisearch) 搜索（search.louaq.com）
			const offset = nextPage * hitsPerPage;
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
			};
			if (MEILISEARCH_SEARCH_KEY) {
				headers.Authorization = `Bearer ${MEILISEARCH_SEARCH_KEY}`;
			}

			const response = await fetch(
				`${MEILISEARCH_HOST.replace(/\/$/, "")}/indexes/${MEILISEARCH_INDEX_NAME}/search`,
				{
					method: "POST",
					headers,
					body: JSON.stringify({
						q: trimmed,
						limit: hitsPerPage,
						offset,
						attributesToRetrieve: [
							"type",
							"title",
							"description",
							"content",
							"url",
							"tags",
							"category",
						],
					}),
				},
			);

			const data = await response.json();
			if (currentReq !== requestSeq) return;

			const hits = data?.hits || [];
			newHits = hits.map((hit: any) => {
				const content = typeof hit?.content === "string" ? hit.content : "";
				const excerptRaw = content.replace(/\s+/g, " ").trim().slice(0, 180);
				return {
					url: hit.url,
					type: hit.type,
					title: highlightText(hit.title ?? "", trimmed),
					description: hit.description ? highlightText(hit.description, trimmed) : "",
					excerpt: excerptRaw ? highlightText(excerptRaw, trimmed) : "",
					tags: hit.tags || [],
					category: hit.category || "",
				};
			});

			page = nextPage;
			nbHits = data?.estimatedTotalHits ?? nbHits;
			nbPages = Math.ceil(nbHits / hitsPerPage) || 0;
			hasMore = offset + hitsPerPage < nbHits;
		}

		// 追加并去重（按 url）
		const existing = new Set(results.map((r) => r.url));
		const merged = [...results];
		for (const h of newHits) {
			if (h?.url && !existing.has(h.url)) {
				merged.push(h);
				existing.add(h.url);
			}
		}
		results = merged;
	} catch (error) {
		console.error("Load more error:", error);
	} finally {
		if (currentReq === requestSeq) isLoadingMore = false;
	}
};

const moveActive = (delta: number) => {
	if (!results.length) return;
	const next = activeIndex < 0 ? 0 : activeIndex + delta;
	if (next < 0) activeIndex = results.length - 1;
	else if (next >= results.length) activeIndex = 0;
	else activeIndex = next;
};

const openActive = () => {
	if (activeIndex < 0 || activeIndex >= results.length) return;
	const url = results[activeIndex]?.url;
	if (typeof url === "string" && url) {
		closeModal();
		navigateToPage(url);
	}
};

const handleInputKeydown = (e: KeyboardEvent) => {
	if (e.key === "ArrowDown") {
		e.preventDefault();
		moveActive(1);
		return;
	}
	if (e.key === "ArrowUp") {
		e.preventDefault();
		moveActive(-1);
		return;
	}
	if (e.key === "Enter" && results.length > 0) {
		e.preventDefault();
		openActive();
	}
};

// 输入防抖
$effect(() => {
	if (isOpen) {
		// 读取 query 以建立依赖
		const _q = query;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => void doSearch(_q, { reset: true }), 250);
	}
});

// 键盘上下选择时，让高亮项随之滚动到可视区域
$effect(() => {
	if (isOpen && listEl && activeIndex >= 0 && activeIndex !== lastScrolledIndex) {
		lastScrolledIndex = activeIndex;
		// 等 DOM 更新后再滚动
		tick().then(() => {
			const active = listEl?.querySelector<HTMLAnchorElement>("a.algolia-item.is-active");
			active?.scrollIntoView({ block: "nearest" });
		});
	}
});

// 放在依赖的函数与 $effect 之后注册，避免 Svelte 5 + Astro 岛水合时 lifecycle_outside_component
onMount(() => {
	let disposed = false;
	let keydownHandler: ((e: KeyboardEvent) => void) | undefined;

	void (async () => {
		const selectedEngine: "algolia" | "milisearch" =
			engine ?? (ALGOLIA_APP_ID && ALGOLIA_SEARCH_KEY ? "algolia" : "milisearch");
		searchEngine = selectedEngine;

		if (selectedEngine === "algolia") {
			if (!ALGOLIA_APP_ID || !ALGOLIA_SEARCH_KEY) {
				initialized = false;
				return;
			}
			try {
				const { liteClient } = await import("algoliasearch/lite");
				if (disposed) return;
				searchClient = liteClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
				initialized = true;
			} catch {
				initialized = false;
			}
		} else {
			initialized = !!MEILISEARCH_HOST && !!MEILISEARCH_INDEX_NAME;
			searchClient = null;
		}

		if (disposed) return;

		const onKeydown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) closeModal();
			if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
				e.preventDefault();
				openModal();
			}
		};
		keydownHandler = onKeydown;
		document.addEventListener("keydown", onKeydown);

		if (initialOpen) {
			await tick();
			if (disposed) return;
			await openModal();
		}
	})();

	return () => {
		disposed = true;
		if (keydownHandler) {
			document.removeEventListener("keydown", keydownHandler);
		}
	};
});

onDestroy(() => clearTimeout(debounceTimer));
onDestroy(() => {
	unlockScroll();
});
</script>

{#snippet searchIcon(size: number)}
	<svg viewBox="0 0 1024 1024" width={size} height={size} aria-hidden="true" class="search-trigger-icon">
		<path d="M908.488 821.348L783.7 696.56a401.635 401.635 0 0 1-41.665 48.894 403.103 403.103 0 0 1-35.653 31.68l123.159 123.159c10.855 10.854 25.117 16.282 39.376 16.283 14.262 0.002 28.518-5.427 39.376-16.283l0.188-0.188c10.524-10.524 16.316-24.508 16.316-39.382s-5.792-28.858-16.309-39.375z" fill="#2FBC3C" />
		<path d="M932.967 796.868L803.1 667.001a399.223 399.223 0 0 0 24.478-48.428c20.821-49.225 31.377-101.505 31.377-155.386S848.398 357.024 827.578 307.8c-20.106-47.537-48.887-90.226-85.542-126.881s-79.344-65.435-126.88-85.542C565.931 74.557 513.651 64 459.769 64S353.607 74.557 304.382 95.377c-47.537 20.107-90.226 48.887-126.881 85.542S112.066 260.263 91.96 307.8c-20.82 49.225-31.377 101.504-31.377 155.386S71.139 569.348 91.96 618.573c20.106 47.537 48.887 90.226 85.542 126.881s79.344 65.435 126.881 85.542c49.225 20.82 101.504 31.377 155.386 31.377s106.162-10.557 155.386-31.377a398.173 398.173 0 0 0 62.736-33.395l127.172 127.172c17.605 17.605 40.727 26.407 63.852 26.406 23.126-0.001 46.256-8.805 63.864-26.413l0.188-0.188c17.057-17.056 26.45-39.734 26.45-63.855 0-24.121-9.393-46.799-26.45-63.855z m-24.674 103.425c-10.857 10.857-25.114 16.285-39.376 16.283-14.258-0.001-28.521-5.429-39.376-16.283L706.383 777.134a403.405 403.405 0 0 0 35.653-31.68 401.649 401.649 0 0 0 41.665-48.894l124.787 124.788c10.518 10.518 16.31 24.501 16.31 39.375s-5.792 28.858-16.316 39.382l-0.189 0.188zM459.769 98.619c101.891 0 194.152 42.018 260.37 109.635-9.882-11.269-20.787-22.236-32.792-32.835 185.143 163.447 180.59 397.176 31.458 546.309-64.921 64.921-146.438 99.985-230.202 104.893a367.842 367.842 0 0 1-28.834 1.133c-201.023 0-364.567-163.544-364.567-364.567S258.746 98.619 459.769 98.619z" fill="currentColor" />
		<path d="M224.978 245.35c-98.897 103.804-146.487 307.567-35.566 454.728 147.889 153.727 380.29 106.897 493.595-1.051 103.641-98.742 174.303-311.826 51.99-472.601-163.445-166.451-403.394-92.991-510.019 18.924z m96.27 358.446c-36.341-36.341-56.355-84.659-56.355-136.054 0-51.394 20.014-99.713 56.355-136.054 36.341-36.342 84.659-56.356 136.054-56.356s99.713 20.014 136.054 56.356c36.341 36.341 56.355 84.659 56.355 136.054 0 51.395-20.014 99.713-56.355 136.054s-84.659 56.355-136.054 56.355-99.713-20.014-136.054-56.355z" fill="#8BF268" />
		<path d="M459.769 827.754c9.704 0 19.319-0.385 28.834-1.133-105.408 6.176-214.373-35.409-298.313-125.378 11.822 15.535 25.415 30.434 40.917 44.508-169.676-150.365-178.062-387.067-28.93-536.199C347.102 64.727 571.707 56.258 734.25 225.45a338.221 338.221 0 0 0-14.111-17.196C653.921 140.637 561.66 98.619 459.769 98.619c-201.023 0-364.567 163.544-364.567 364.567s163.544 364.568 364.567 364.568z" fill="#8BF268" />
		<path d="M649.711 467.742c0-51.394-20.014-99.713-56.355-136.054-36.341-36.342-84.659-56.356-136.054-56.356s-99.713 20.014-136.054 56.356c-36.341 36.341-56.355 84.659-56.355 136.054 0 51.395 20.014 99.713 56.355 136.054s84.659 56.355 136.054 56.355 99.713-20.014 136.054-56.355 56.355-84.66 56.355-136.054z m-192.409 157.79c-87.006 0-157.791-70.784-157.791-157.791S370.295 309.95 457.302 309.95s157.791 70.784 157.791 157.791-70.785 157.791-157.791 157.791z" fill="currentColor" />
		<path d="M189.412 700.078C78.491 552.917 126.081 349.154 224.978 245.35c106.625-111.915 346.574-185.374 510.019-18.924-0.248-0.326-0.498-0.651-0.747-0.976C571.707 56.258 347.102 64.727 202.277 209.552 53.145 358.684 61.531 595.386 231.207 745.75c-15.502-14.074-29.095-28.973-40.917-44.508a439.694 439.694 0 0 1-7.684-8.445 344.242 344.242 0 0 0 6.806 7.281z" fill="#FFFFFF" />
		<path d="M734.997 226.426c122.313 160.775 51.651 373.859-51.99 472.601-113.305 107.948-345.706 154.778-493.595 1.051a343.975 343.975 0 0 1-6.805-7.28 445.765 445.765 0 0 0 7.684 8.445c83.939 89.97 192.905 131.554 298.313 125.378 83.764-4.908 165.281-39.972 230.202-104.893 149.132-149.132 153.685-382.862-31.458-546.309 12.005 10.598 22.91 21.566 32.792 32.835a337.686 337.686 0 0 1 14.111 17.196l0.746 0.976z" fill="#2FBC3C" />
	</svg>
{/snippet}

<!-- 触发器：参考 Ruyu-Blog 的搜索按钮实现——纯 SVG 图标 + 悬浮缩放，不再套用输入框外壳 -->
<button
	type="button"
	aria-label="Open search"
	title={`${i18n(I18nKey.search)} · Ctrl K`}
	class="search-trigger hidden shrink-0 lg:flex"
	onclick={openModal}
>
	{@render searchIcon(24)}
</button>

<!-- 触发器：移动端保留搜索按钮 -->
<button
	type="button"
	onclick={openModal}
	aria-label="Open search"
	class="search-trigger flex lg:hidden!"
>
	{@render searchIcon(22)}
</button>

{#if isOpen}
	<div class="algolia-portal-root" use:portal>
		<!-- 遮罩层（portal 到 body，避免被滚动/transform 影响） -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="algolia-backdrop"
			role="presentation"
			onclick={(e) => { e.stopPropagation(); e.preventDefault(); closeModal(); }}
			onmousedown={(e) => { e.stopPropagation(); e.preventDefault(); closeModal(); }}
		></div>

		<!-- 弹窗（portal 到 body，始终在视口顶层） -->
		<div
			class="algolia-modal"
			role="dialog"
			aria-modal="true"
			aria-label="Search"
			tabindex="-1"
		>
		<div class="algolia-header">
			<div class="algolia-input-wrap">
				<span class="algolia-search-icon" aria-hidden="true">
					{@render searchIcon(20)}
				</span>
				<input
					bind:this={modalInputEl}
					bind:value={query}
					placeholder={i18n(I18nKey.search)}
					class="algolia-input"
					onkeydown={handleInputKeydown}
				/>
			</div>
		</div>

		<div class="algolia-body">
			{#if !initialized}
				<div class="algolia-empty">搜索服务未配置</div>
			{:else if isSearching}
				<div class="algolia-empty">{i18n(I18nKey.searchLoading)}</div>
			{:else if !query.trim()}
				<div class="algolia-empty algolia-empty-centered"></div>
			{:else if results.length === 0}
				<div class="algolia-empty">{i18n(I18nKey.searchNoResults)}</div>
			{:else}
				<div class="algolia-list" role="list" bind:this={listEl}>
					{#each results as item, idx}
						<a
							href={item.url}
							class="algolia-item {idx === activeIndex ? 'is-active' : ''}"
							onclick={(e) => handleResultClick(e, item.url)}
							onmouseenter={() => (activeIndex = idx)}
						>
							<div class="algolia-title-row">
								<div class="algolia-title">
									{@html item.title}
								</div>
								{#if item.type}
									<span class="algolia-badge">{typeLabel(item.type)}</span>
								{/if}
							</div>
							{#if item.excerpt || item.description}
								<div class="algolia-excerpt">
									{@html item.excerpt || item.description}
								</div>
							{/if}
						</a>
					{/each}
				</div>

				<div class="algolia-more">
					<div class="algolia-more-meta">
						已显示 {results.length}{nbHits ? ` / ${nbHits}` : ""}{nbHits ? " 条" : ""}
					</div>
					{#if hasMore}
						<button
							type="button"
							class="algolia-more-btn"
							onclick={loadMore}
							disabled={isLoadingMore}
						>
							{isLoadingMore ? "加载中…" : "加载更多"}
						</button>
					{/if}
				</div>
			{/if}
		</div>

		<footer class="docsearch-modal-footer">
			<ul class="docsearch-modal-footer-commands" role="list">
				<li>
					<kbd class="docsearch-modal-footer-commands-key">
						<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
							<g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
								<path
									d="M3 14a1 1 0 0 1 1-1h12a3 3 0 0 0 3-3V6a1 1 0 1 1 2 0v4a5 5 0 0 1-5 5H4a1 1 0 0 1-1-1z"
								></path>
								<path
									d="M3.293 14.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 1.414L5.414 14l3.293 3.293a1 1 0 1 1-1.414 1.414l-4-4z"
								></path>
							</g>
						</svg>
					</kbd>
					<span class="docsearch-modal-footer-commands-label">{i18n(I18nKey.searchKbdSelect)}</span>
				</li>
				<li>
					<kbd class="docsearch-modal-footer-commands-key">
						<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill="currentColor"
								d="M12 4a1 1 0 0 1 1 1v11.586l4.293-4.293a1 1 0 0 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 1 1 1.414-1.414L11 16.586V5a1 1 0 0 1 1-1z"
							></path>
						</svg>
					</kbd>
					<kbd class="docsearch-modal-footer-commands-key">
						<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill="currentColor"
								d="M12 4a1 1 0 0 1 .707.293l6 6a1 1 0 0 1-1.414 1.414L13 7.414V19a1 1 0 1 1-2 0V7.414l-4.293 4.293a1 1 0 0 1-1.414-1.414l6-6A1 1 0 0 1 12 4z"
							></path>
						</svg>
					</kbd>
					<span class="docsearch-modal-footer-commands-label">{i18n(I18nKey.searchKbdSwitch)}</span>
				</li>
				<li>
					<kbd class="docsearch-modal-footer-commands-key">
						<svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">
							<g
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.2"
							>
								<path
									d="M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"
								></path>
							</g>
						</svg>
					</kbd>
					<span class="docsearch-modal-footer-commands-label">{i18n(I18nKey.announcementClose)}</span>
				</li>
			</ul>
			<span class="docsearch-modal-footer-logo" aria-label={searchEngine === "milisearch" ? "Meilisearch" : "Algolia"}>
				{#if searchEngine === "algolia"}
					<span class="docsearch-modal-footer-logo-label">{i18n(I18nKey.searchBy)}</span>
					<a
						class="docsearch-modal-footer-logo-link"
						href="https://www.algolia.com/"
						target="_blank"
						rel="noopener noreferrer"
					>
				<svg
					width="77"
					height="19"
					aria-label="Algolia"
					role="img"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 2196.2 500"
					class="docsearch-modal-footer-logo-icon docsearch-modal-footer-algolia-mark"
				>
					<defs>
						<style>
							.cls-1,
							.cls-2 {
								fill: #003dff;
							}
							.cls-2 {
								fill-rule: evenodd;
							}
						</style>
					</defs>
					<path
						d="M1070.38,275.3V5.91c0-3.63-3.24-6.39-6.82-5.83l-50.46,7.94c-2.87,.45-4.99,2.93-4.99,5.84l.17,273.22c0,12.92,0,92.7,95.97,95.49,3.33,.1,6.09-2.58,6.09-5.91v-40.78c0-2.96-2.19-5.51-5.12-5.84-34.85-4.01-34.85-47.57-34.85-54.72Z"
						class="cls-2"
					></path>
					<rect
						x="1845.88"
						y="104.73"
						width="62.58"
						height="277.9"
						rx="5.9"
						ry="5.9"
						class="cls-1"
					></rect>
					<path
						d="M1851.78,71.38h50.77c3.26,0,5.9-2.64,5.9-5.9V5.9c0-3.62-3.24-6.39-6.82-5.83l-50.77,7.95c-2.87,.45-4.99,2.92-4.99,5.83v51.62c0,3.26,2.64,5.9,5.9,5.9Z"
						class="cls-2"
					></path>
					<path
						d="M1764.03,275.3V5.91c0-3.63-3.24-6.39-6.82-5.83l-50.46,7.94c-2.87,.45-4.99,2.93-4.99,5.84l.17,273.22c0,12.92,0,92.7,95.97,95.49,3.33,.1,6.09-2.58,6.09-5.91v-40.78c0-2.96-2.19-5.51-5.12-5.84-34.85-4.01-34.85-47.57-34.85-54.72Z"
						class="cls-2"
					></path>
					<path
						d="M1631.95,142.72c-11.14-12.25-24.83-21.65-40.78-28.31-15.92-6.53-33.26-9.85-52.07-9.85-18.78,0-36.15,3.17-51.92,9.85-15.59,6.66-29.29,16.05-40.76,28.31-11.47,12.23-20.38,26.87-26.76,44.03-6.38,17.17-9.24,37.37-9.24,58.36,0,20.99,3.19,36.87,9.55,54.21,6.38,17.32,15.14,32.11,26.45,44.36,11.29,12.23,24.83,21.62,40.6,28.46,15.77,6.83,40.12,10.33,52.4,10.48,12.25,0,36.78-3.82,52.7-10.48,15.92-6.68,29.46-16.23,40.78-28.46,11.29-12.25,20.05-27.04,26.25-44.36,6.22-17.34,9.24-33.22,9.24-54.21,0-20.99-3.34-41.19-10.03-58.36-6.38-17.17-15.14-31.8-26.43-44.03Zm-44.43,163.75c-11.47,15.75-27.56,23.7-48.09,23.7-20.55,0-36.63-7.8-48.1-23.7-11.47-15.75-17.21-34.01-17.21-61.2,0-26.89,5.59-49.14,17.06-64.87,11.45-15.75,27.54-23.52,48.07-23.52,20.55,0,36.63,7.78,48.09,23.52,11.47,15.57,17.36,37.98,17.36,64.87,0,27.19-5.72,45.3-17.19,61.2Z"
						class="cls-2"
					></path>
					<path
						d="M894.42,104.73h-49.33c-48.36,0-90.91,25.48-115.75,64.1-14.52,22.58-22.99,49.63-22.99,78.73,0,44.89,20.13,84.92,51.59,111.1,2.93,2.6,6.05,4.98,9.31,7.14,12.86,8.49,28.11,13.47,44.52,13.47,1.23,0,2.46-.03,3.68-.09,.36-.02,.71-.05,1.07-.07,.87-.05,1.75-.11,2.62-.2,.34-.03,.68-.08,1.02-.12,.91-.1,1.82-.21,2.73-.34,.21-.03,.42-.07,.63-.1,32.89-5.07,61.56-30.82,70.9-62.81v57.83c0,3.26,2.64,5.9,5.9,5.9h50.42c3.26,0,5.9-2.64,5.9-5.9V110.63c0-3.26-2.64-5.9-5.9-5.9h-56.32Zm0,206.92c-12.2,10.16-27.97,13.98-44.84,15.12-.16,.01-.33,.03-.49,.04-1.12,.07-2.24,.1-3.36,.1-42.24,0-77.12-35.89-77.12-79.37,0-10.25,1.96-20.01,5.42-28.98,11.22-29.12,38.77-49.74,71.06-49.74h49.33v142.83Z"
						class="cls-2"
					></path>
					<path
						d="M2133.97,104.73h-49.33c-48.36,0-90.91,25.48-115.75,64.1-14.52,22.58-22.99,49.63-22.99,78.73,0,44.89,20.13,84.92,51.59,111.1,2.93,2.6,6.05,4.98,9.31,7.14,12.86,8.49,28.11,13.47,44.52,13.47,1.23,0,2.46-.03,3.68-.09,.36-.02,.71-.05,1.07-.07,.87-.05,1.75-.11,2.62-.2,.34-.03,.68-.08,1.02-.12,.91-.1,1.82-.21,2.73-.34,.21-.03,.42-.07,.63-.1,32.89-5.07,61.56-30.82,70.9-62.81v57.83c0,3.26,2.64,5.9,5.9,5.9h50.42c3.26,0,5.9-2.64,5.9-5.9V110.63c0-3.26-2.64-5.9-5.9-5.9h-56.32Zm0,206.92c-12.2,10.16-27.97,13.98-44.84,15.12-.16,.01-.33,.03-.49,.04-1.12,.07-2.24,.1-3.36,.1-42.24,0-77.12-35.89-77.12-79.37,0-10.25,1.96-20.01,5.42-28.98,11.22-29.12,38.77-49.74,71.06-49.74h49.33v142.83Z"
						class="cls-2"
					></path>
					<path
						d="M1314.05,104.73h-49.33c-48.36,0-90.91,25.48-115.75,64.1-11.79,18.34-19.6,39.64-22.11,62.59-.58,5.3-.88,10.68-.88,16.14s.31,11.15,.93,16.59c4.28,38.09,23.14,71.61,50.66,94.52,2.93,2.6,6.05,4.98,9.31,7.14,12.86,8.49,28.11,13.47,44.52,13.47h0c17.99,0,34.61-5.93,48.16-15.97,16.29-11.58,28.88-28.54,34.48-47.75v50.26h-.11v11.08c0,21.84-5.71,38.27-17.34,49.36-11.61,11.08-31.04,16.63-58.25,16.63-11.12,0-28.79-.59-46.6-2.41-2.83-.29-5.46,1.5-6.27,4.22l-12.78,43.11c-1.02,3.46,1.27,7.02,4.83,7.53,21.52,3.08,42.52,4.68,54.65,4.68,48.91,0,85.16-10.75,108.89-32.21,21.48-19.41,33.15-48.89,35.2-88.52V110.63c0-3.26-2.64-5.9-5.9-5.9h-56.32Zm0,64.1s.65,139.13,0,143.36c-12.08,9.77-27.11,13.59-43.49,14.7-.16,.01-.33,.03-.49,.04-1.12,.07-2.24,.1-3.36,.1-1.32,0-2.63-.03-3.94-.1-40.41-2.11-74.52-37.26-74.52-79.38,0-10.25,1.96-20.01,5.42-28.98,11.22-29.12,38.77-49.74,71.06-49.74h49.33Z"
						class="cls-2"
					></path>
					<path
						d="M249.83,0C113.3,0,2,110.09,.03,246.16c-2,138.19,110.12,252.7,248.33,253.5,42.68,.25,83.79-10.19,120.3-30.03,3.56-1.93,4.11-6.83,1.08-9.51l-23.38-20.72c-4.75-4.21-11.51-5.4-17.36-2.92-25.48,10.84-53.17,16.38-81.71,16.03-111.68-1.37-201.91-94.29-200.13-205.96,1.76-110.26,92-199.41,202.67-199.41h202.69V407.41l-115-102.18c-3.72-3.31-9.42-2.66-12.42,1.31-18.46,24.44-48.53,39.64-81.93,37.34-46.33-3.2-83.87-40.5-87.34-86.81-4.15-55.24,39.63-101.52,94-101.52,49.18,0,89.68,37.85,93.91,85.95,.38,4.28,2.31,8.27,5.52,11.12l29.95,26.55c3.4,3.01,8.79,1.17,9.63-3.3,2.16-11.55,2.92-23.58,2.07-35.92-4.82-70.34-61.8-126.93-132.17-131.26-80.68-4.97-148.13,58.14-150.27,137.25-2.09,77.1,61.08,143.56,138.19,145.26,32.19,.71,62.03-9.41,86.14-26.95l150.26,133.2c6.44,5.71,16.61,1.14,16.61-7.47V9.48C499.66,4.25,495.42,0,490.18,0H249.83Z"
						class="cls-1"
					></path>
				</svg>
					</a>
				{:else}
					<a
						class="docsearch-modal-footer-logo-link"
						href="https://www.meilisearch.com/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src="/assets/images/meilisearch-logo-light.svg"
							alt="Meilisearch"
							width="110"
							height="16"
							class="docsearch-modal-footer-logo-icon docsearch-modal-footer-logo-light"
						/>
						<img
							src="/assets/images/meilisearch-logo-dark.svg"
							alt=""
							width="110"
							height="16"
							class="docsearch-modal-footer-logo-icon docsearch-modal-footer-logo-dark"
							aria-hidden="true"
						/>
					</a>
				{/if}
			</span>
		</footer>
	</div>
	</div>
{/if}

<style>
	:global(mark) {
		background-color: color-mix(in oklch, var(--primary) 22%, transparent);
		color: var(--primary);
		padding: 0.1em 0.2em;
		border-radius: 3px;
		font-weight: 600;
	}

	.algolia-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.22);
		z-index: 2147483646;
	}
	:global(html.dark) .algolia-backdrop {
		background: rgba(0, 0, 0, 0.55);
	}

	.algolia-portal-root {
		position: fixed;
		inset: 0;
		z-index: 2147483647;
	}

	.algolia-modal {
		position: fixed;
		top: clamp(1rem, 8vh, 4rem);
		left: 50%;
		transform: translateX(-50%);
		width: min(560px, calc(100vw - 2rem));
		max-height: min(640px, calc(100vh - 2rem));
		display: flex;
		flex-direction: column;
		border-radius: 5px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.98);
		color: #111827;
		box-shadow:
			0 28px 90px rgba(0, 0, 0, 0.25),
			0 2px 0 rgba(255, 255, 255, 0.6) inset;
		z-index: 2147483647;
		border: 1px solid rgba(0, 0, 0, 0.06);
	}

	/* 无搜索词时的空闲态：总高约 160–180px，接近 DocSearch 紧凑面板（图一） */
	.algolia-modal:has(.algolia-empty-centered) {
		max-height: none;
		height: auto;
	}
	.algolia-modal:has(.algolia-empty-centered) .algolia-header {
		padding: 0.625rem 0.75rem 0.5rem;
	}
	.algolia-modal:has(.algolia-empty-centered) .algolia-body {
		flex: 0 0 auto;
		min-height: 0;
		overflow: visible;
		padding: 0.2rem 0.5rem 0.35rem;
	}
	.algolia-modal:has(.algolia-empty-centered) .algolia-empty-centered {
		min-height: 2.25rem;
		padding: 0.25rem 0.75rem;
	}

	:global(html.dark) .algolia-modal {
		background: #1e293b;
		color: #e2e8f0;
		border: 1px solid rgba(148, 163, 184, 0.22);
		box-shadow:
			0 28px 90px rgba(0, 0, 0, 0.55),
			0 0 0 1px rgba(15, 23, 42, 0.5);
	}

	.algolia-header {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding: 0.75rem 0.75rem 0.6rem 0.75rem;
	}

	.algolia-input-wrap {
		position: relative;
		flex: 1;
		display: flex;
		align-items: center;
		border-radius: 5px;
		background: rgba(255, 255, 255, 1);
		border: 1px solid rgba(17, 24, 39, 0.12);
		box-shadow: 0 1px 0 rgba(17, 24, 39, 0.04);
	}
	:global(html.dark) .algolia-input-wrap {
		background: #0f172a;
		border: 1px solid rgba(148, 163, 184, 0.28);
		box-shadow: none;
	}
	.algolia-input-wrap:focus-within {
		border-color: var(--primary);
		box-shadow: 0 0 0 2px color-mix(in oklch, var(--primary) 28%, transparent);
	}
	:global(html.dark) .algolia-input-wrap:focus-within {
		border-color: var(--primary);
		box-shadow: 0 0 0 2px color-mix(in oklch, var(--primary) 32%, transparent);
	}

	.algolia-search-icon {
		position: absolute;
		left: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: rgba(17, 24, 39, 0.35);
		pointer-events: none;
	}
	:global(html.dark) .algolia-search-icon {
		color: #60a5fa;
	}

	.DocSearch-Search-Icon {
		display: block;
	}

	/* 搜索触发按钮：仅图标 + 悬浮放大，参考 Ruyu-Blog 的搜索入口实现
	   注意：display 由 Tailwind 的 hidden/flex/lg:* 工具类控制，此处不设 display，
	   避免 Svelte 作用域样式的属性选择器特异性高于单类 .hidden 而覆盖响应式显隐 */
	.search-trigger {
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		margin-right: 0.25rem;
		border: none;
		border-radius: 9999px;
		background: none;
		cursor: pointer;
		transition: transform 0.3s linear;
	}
	.search-trigger:hover {
		transform: scale(1.12);
	}
	.search-trigger:active {
		transform: scale(0.94);
	}

	.search-trigger-icon {
		display: block;
		color: rgba(17, 24, 39, 0.55);
	}
	:global(html.dark) .search-trigger-icon {
		color: rgba(255, 255, 255, 0.7);
	}

	.algolia-input {
		width: 100%;
		height: 46px;
		padding: 0 0.75rem 0 2.85rem;
		background: transparent;
		border: 0;
		outline: 0;
		color: inherit;
		font-size: 1rem;
	}
	.algolia-input::placeholder {
		color: #64748b;
	}
	:global(html.dark) .algolia-input::placeholder {
		color: #94a3b8;
	}

	.algolia-body {
		padding: 0.35rem 0.5rem 0.5rem 0.5rem;
		overflow: auto;
		flex: 1 1 auto;
		min-height: 0;
	}

	.algolia-empty {
		padding: 0.75rem;
		opacity: 0.8;
		color: #4b5563;
	}
	:global(html.dark) .algolia-empty {
		color: #cbd5e1;
		opacity: 0.95;
	}
	.algolia-empty-centered {
		min-height: 3.5rem;
		padding: 0.5rem 0.75rem 0.65rem 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(107, 114, 128, 1);
	}
	:global(html.dark) .algolia-empty-centered {
		color: #cbd5e1;
	}

	.algolia-list {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.algolia-more {
		margin-top: 0.5rem;
		padding: 0.25rem 0.25rem 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.algolia-more-meta {
		font-size: 0.8rem;
		color: rgba(107, 114, 128, 1);
	}
	:global(html.dark) .algolia-more-meta {
		color: rgba(156, 163, 175, 1);
	}

	.algolia-more-btn {
		border: 1px solid rgba(17, 24, 39, 0.14);
		background: rgba(255, 255, 255, 1);
		border-radius: 8px;
		padding: 0.35rem 0.6rem;
		font-size: 0.8rem;
		color: rgba(55, 65, 81, 1);
		cursor: pointer;
	}
	.algolia-more-btn:hover {
		background: rgba(17, 24, 39, 0.04);
	}
	.algolia-more-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	:global(html.dark) .algolia-more-btn {
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(31, 41, 55, 1);
		color: rgba(229, 231, 235, 1);
	}
	:global(html.dark) .algolia-more-btn:hover {
		background: rgba(255, 255, 255, 0.06);
	}

	.algolia-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 64px; /* 统一每条结果高度 */
		padding: 0.6rem 0.75rem;
		border-radius: 10px;
		text-decoration: none;
		color: inherit;
		background: transparent;
		border: 1px solid rgba(17, 24, 39, 0.08);
		overflow: hidden;
	}
	.algolia-item:hover {
		background: rgba(17, 24, 39, 0.04);
		border-color: rgba(17, 24, 39, 0.14);
	}
	:global(html.dark) .algolia-item:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.16);
	}
	:global(html.dark) .algolia-item {
		border-color: rgba(255, 255, 255, 0.1);
	}

	.algolia-item.is-active {
		background: transparent;
		border-color: var(--primary);
	}
	:global(html.dark) .algolia-item.is-active {
		background: transparent;
		border-color: var(--primary);
	}
	.algolia-item.is-active :global(mark) {
		background-color: color-mix(in oklch, var(--primary) 25%, transparent);
		color: inherit;
	}

	.algolia-title {
		font-weight: 700;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		line-height: 1.2;
	}

	.algolia-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
	}

	.algolia-badge {
		flex: none;
		font-size: 0.7rem;
		line-height: 1;
		padding: 0.3rem 0.45rem;
		border-radius: 999px;
		border: 1px solid rgba(17, 24, 39, 0.12);
		color: rgba(55, 65, 81, 0.85);
		background: rgba(17, 24, 39, 0.03);
	}
	:global(html.dark) .algolia-badge {
		border: 1px solid rgba(255, 255, 255, 0.14);
		color: rgba(229, 231, 235, 0.9);
		background: rgba(255, 255, 255, 0.06);
	}

	.algolia-excerpt {
		margin-top: 0.25rem;
		font-size: 0.9rem;
		opacity: 0.75;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		line-height: 1.2;
	}

	.docsearch-modal-footer {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem 1rem;
		padding: 0.5rem 0.75rem;
		background: rgba(249, 250, 251, 1);
		border-top: 1px solid rgba(17, 24, 39, 0.08);
	}
	:global(html.dark) .docsearch-modal-footer {
		background: #0f172a;
		border-top: 1px solid rgba(148, 163, 184, 0.18);
	}

	.docsearch-modal-footer-commands {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.65rem 1rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.docsearch-modal-footer-commands li {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}
	.docsearch-modal-footer-commands-key {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.5rem;
		height: 1.375rem;
		padding: 0 0.35rem;
		border-radius: 0.25rem;
		border: 1px solid #d1d5db;
		background: linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%);
		box-shadow:
			0 1px 1px rgba(15, 23, 42, 0.06),
			inset 0 -1px 0 rgba(15, 23, 42, 0.04);
		color: #374151;
		line-height: 1;
	}
	.docsearch-modal-footer-commands-key :global(svg) {
		display: block;
		flex-shrink: 0;
	}
	:global(html.dark) .docsearch-modal-footer-commands-key {
		border-color: rgba(148, 163, 184, 0.35);
		background: linear-gradient(180deg, #374151 0%, #1f2937 100%);
		color: #e5e7eb;
		box-shadow:
			0 1px 1px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}
	.docsearch-modal-footer-commands-label {
		font-size: 0.75rem;
		color: #6b7280;
		white-space: nowrap;
	}
	:global(html.dark) .docsearch-modal-footer-commands-label {
		color: #9ca3af;
	}

	.docsearch-modal-footer-logo {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-left: auto;
	}
	.docsearch-modal-footer-logo-label {
		font-size: 0.75rem;
		color: #6b7280;
		white-space: nowrap;
	}
	:global(html.dark) .docsearch-modal-footer-logo-label {
		color: #9ca3af;
	}
	.docsearch-modal-footer-logo-link {
		display: inline-flex;
		align-items: center;
		line-height: 0;
		color: inherit;
		text-decoration: none;
	}
	.docsearch-modal-footer-logo-link:hover {
		opacity: 0.9;
	}
	.docsearch-modal-footer-logo-icon {
		display: block;
		width: auto;
		height: 1.125rem;
		max-width: 6.875rem;
		object-fit: contain;
		object-position: left center;
	}
	.docsearch-modal-footer-algolia-mark {
		height: 1rem;
		max-width: 5rem;
	}
	.docsearch-modal-footer-logo-dark {
		display: none;
	}
	:global(html.dark) .docsearch-modal-footer-logo-light {
		display: none;
	}
	:global(html.dark) .docsearch-modal-footer-logo-dark {
		display: block;
	}
</style>
