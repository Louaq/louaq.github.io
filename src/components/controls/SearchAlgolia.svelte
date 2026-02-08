<script lang="ts">
import { onDestroy, onMount, tick } from "svelte";
import Icon from "@iconify/svelte";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { navigateToPage } from "@utils/navigation-utils";

const ALGOLIA_APP_ID = import.meta.env.PUBLIC_ALGOLIA_APP_ID;
const ALGOLIA_SEARCH_KEY = import.meta.env.PUBLIC_ALGOLIA_SEARCH_KEY;
const ALGOLIA_INDEX_NAME = import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME || "blog";

let initialized = $state(false);
let searchClient: any = $state(null);

let isOpen = $state(false);
let query = $state("");
let results: any[] = $state([]);
let isSearching = $state(false);
let debounceTimer: NodeJS.Timeout;
let activeIndex = $state(-1);
let prevBodyOverflow: string | null = null;
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

onMount(async () => {
	if (!ALGOLIA_APP_ID || !ALGOLIA_SEARCH_KEY) {
		initialized = false;
		return;
	}
	try {
		const { liteClient } = await import("algoliasearch/lite");
		searchClient = liteClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
		initialized = true;
	} catch {
		initialized = false;
	}

	const onKeydown = (e: KeyboardEvent) => {
		if (e.key === "Escape" && isOpen) closeModal();
		// Ctrl/Cmd + K 打开
		if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
			e.preventDefault();
			openModal();
		}
	};
	document.addEventListener("keydown", onKeydown);
	return () => document.removeEventListener("keydown", onKeydown);
});

onDestroy(() => clearTimeout(debounceTimer));
onDestroy(() => {
	// 组件卸载时兜底恢复滚动
	if (typeof document !== "undefined") {
		document.body.style.overflow = prevBodyOverflow ?? "";
	}
});

const openModal = async () => {
	// 锁定背景滚动，避免滚动导致弹窗“丢失/穿透”
	if (typeof document !== "undefined") {
		prevBodyOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
	}
	isOpen = true;
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
	if (typeof document !== "undefined") {
		document.body.style.overflow = prevBodyOverflow ?? "";
	}
};

const handleResultClick = (event: Event, url: string): void => {
	event.preventDefault();
	closeModal();
	navigateToPage(url);
};

const highlightText = (text: string, q: string): string => {
	if (!q || !text) return text;
	const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const regex = new RegExp(`(${safe})`, "gi");
	return text.replace(regex, "<mark>$1</mark>");
};

const doSearch = async (keyword: string, opts?: { reset?: boolean }) => {
	if (!initialized || !searchClient) return;

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
		const response = await searchClient.search({
			requests: [
				{
					indexName: ALGOLIA_INDEX_NAME,
					query: trimmed,
					page: 0,
					hitsPerPage,
					attributesToRetrieve: [
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
			title: highlightText(hit.title, trimmed),
			description: hit.description ? highlightText(hit.description, trimmed) : "",
			excerpt: hit._snippetResult?.content?.value || "",
			tags: hit.tags || [],
			category: hit.category || "",
		}));
		activeIndex = results.length > 0 ? 0 : -1;
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
	if (!initialized || !searchClient) return;
	const trimmed = query.trim();
	if (!trimmed) return;
	if (!hasMore || isLoadingMore) return;

	isLoadingMore = true;
	const nextPage = page + 1;
	const currentReq = ++requestSeq;
	try {
		const response = await searchClient.search({
			requests: [
				{
					indexName: ALGOLIA_INDEX_NAME,
					query: trimmed,
					page: nextPage,
					hitsPerPage,
					attributesToRetrieve: [
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
		const newHits = (res0?.hits || []).map((hit: any) => ({
			url: hit.url,
			title: highlightText(hit.title, trimmed),
			description: hit.description ? highlightText(hit.description, trimmed) : "",
			excerpt: hit._snippetResult?.content?.value || "",
			tags: hit.tags || [],
			category: hit.category || "",
		}));

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

		page = res0?.page ?? nextPage;
		nbHits = res0?.nbHits ?? nbHits;
		nbPages = res0?.nbPages ?? nbPages;
		hasMore = page < nbPages - 1;
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
</script>

<!-- 触发器：桌面端显示一个“搜索框样式”的按钮，点击后弹窗内搜索 -->
<button
	type="button"
	aria-label="Open search"
	class="hidden lg:flex transition-all items-center h-11 mr-2 rounded-full px-4 w-44 xl:w-52
      bg-black/[0.06] hover:bg-black/[0.08] active:bg-black/[0.10]
      dark:bg-white/[0.08] dark:hover:bg-white/[0.12] dark:active:bg-white/[0.14]
      text-black/55 dark:text-white/55 text-sm
      border border-transparent hover:border-[var(--primary)]
      outline-none focus:outline-none focus-visible:outline-none
      focus-visible:border-[var(--primary)]
      focus-visible:ring-2 focus-visible:ring-[var(--primary)]/25"
	onclick={openModal}
>
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		aria-hidden="true"
		class="DocSearch-Search-Icon trigger-search-icon"
	>
		<path
			d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
			stroke="currentColor"
			fill="none"
			fill-rule="evenodd"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
	<span class="flex-1 text-left">{i18n(I18nKey.search)}</span>
	<span class="text-xs text-black/35 dark:text-white/35">Ctrl K</span>
</button>

<!-- 触发器：移动端保留搜索按钮 -->
<button
	type="button"
	onclick={openModal}
	aria-label="Open search"
	class="btn-plain scale-animation lg:!hidden rounded-lg w-11 h-11 active:scale-90"
>
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		aria-hidden="true"
		class="DocSearch-Search-Icon mobile-search-icon"
	>
		<path
			d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
			stroke="currentColor"
			fill="none"
			fill-rule="evenodd"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
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
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					aria-hidden="true"
					class="DocSearch-Search-Icon algolia-search-icon"
				>
					<path
						d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
						stroke="currentColor"
						fill="none"
						fill-rule="evenodd"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
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
				<div class="algolia-empty algolia-empty-centered">No recent searches</div>
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
							<div class="algolia-title">
								{@html item.title}
							</div>
							{#if item.excerpt}
								<div class="algolia-excerpt">
									{@html item.excerpt}
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

		<div class="algolia-footer">
			<div class="algolia-hints">
				<span class="hint">
					<kbd class="keycap">⏎</kbd>
					<span class="hint-text">to select</span>
				</span>
				<span class="hint">
					<kbd class="keycap">↓</kbd><kbd class="keycap">↑</kbd>
					<span class="hint-text">to navigate</span>
				</span>
				<span class="hint">
					<kbd class="keycap">esc</kbd>
					<span class="hint-text">to close</span>
				</span>
			</div>
			<div class="algolia-brand" aria-label="Algolia" role="img">
				<span class="algolia-brand-text">Search by</span>
				<svg
					width="77"
					height="19"
					aria-label="Algolia"
					role="img"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 2196.2 500"
					class="algolia-brand-svg"
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
			</div>
		</div>
	</div>
	</div>
{/if}

<style>
	:global(mark) {
		background-color: rgba(var(--primary-rgb), 0.2);
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

	.algolia-portal-root {
		position: fixed;
		inset: 0;
		z-index: 2147483647;
	}

	.algolia-modal {
		position: fixed;
		top: 14vh;
		left: 50%;
		transform: translateX(-50%);
		width: min(560px, calc(100vw - 2rem));
		max-height: 72vh;
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

	:global([data-theme="dark"]) .algolia-modal {
		background: rgba(17, 24, 39, 0.96);
		color: rgba(255, 255, 255, 0.92);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.algolia-header {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding: 0.75rem 0.75rem 0.6rem 0.75rem;
		border-bottom: 1px solid rgba(17, 24, 39, 0.08);
	}
	:global([data-theme="dark"]) .algolia-header {
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
	:global([data-theme="dark"]) .algolia-input-wrap {
		background: rgba(31, 41, 55, 1);
		border: 1px solid rgba(255, 255, 255, 0.12);
		box-shadow: none;
	}
	.algolia-input-wrap:focus-within {
		border-color: rgba(37, 99, 235, 1);
		box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.18);
	}
	:global([data-theme="dark"]) .algolia-input-wrap:focus-within {
		border-color: rgba(59, 130, 246, 1);
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.22);
	}

	.algolia-search-icon {
		position: absolute;
		left: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: rgba(17, 24, 39, 0.35);
		pointer-events: none;
	}
	:global([data-theme="dark"]) .algolia-search-icon {
		color: rgba(255, 255, 255, 0.45);
	}

	.DocSearch-Search-Icon {
		display: block;
	}

	.trigger-search-icon {
		margin-right: 0.5rem;
		color: rgba(17, 24, 39, 0.3);
	}
	:global([data-theme="dark"]) .trigger-search-icon {
		color: rgba(255, 255, 255, 0.35);
	}

	.mobile-search-icon {
		margin: 0 auto;
		color: currentColor;
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

	.algolia-body {
		padding: 0.5rem 0.5rem 0.75rem 0.5rem;
		overflow: auto;
	}

	.algolia-empty {
		padding: 0.75rem;
		opacity: 0.8;
	}
	.algolia-empty-centered {
		height: 180px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(107, 114, 128, 1);
	}
	:global([data-theme="dark"]) .algolia-empty-centered {
		color: rgba(156, 163, 175, 1);
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
	:global([data-theme="dark"]) .algolia-more-meta {
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
	:global([data-theme="dark"]) .algolia-more-btn {
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(31, 41, 55, 1);
		color: rgba(229, 231, 235, 1);
	}
	:global([data-theme="dark"]) .algolia-more-btn:hover {
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
	:global([data-theme="dark"]) .algolia-item:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.16);
	}
	:global([data-theme="dark"]) .algolia-item {
		border-color: rgba(255, 255, 255, 0.1);
	}

	.algolia-item.is-active {
		background: rgba(37, 99, 235, 1);
		color: white;
		border-color: rgba(255, 255, 255, 0.22);
	}
	.algolia-item.is-active :global(mark) {
		background-color: rgba(255, 255, 255, 0.22);
		color: white;
	}

	.algolia-title {
		font-weight: 700;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		line-height: 1.2;
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

	.algolia-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0.75rem;
		background: rgba(249, 250, 251, 1);
		border-top: 1px solid rgba(17, 24, 39, 0.08);
	}
	:global([data-theme="dark"]) .algolia-footer {
		background: rgba(15, 23, 42, 1);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.algolia-hints {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		flex-wrap: wrap;
	}
	.hint {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}
	.hint-text {
		font-size: 0.75rem;
		color: rgba(107, 114, 128, 1);
	}
	:global([data-theme="dark"]) .hint-text {
		color: rgba(156, 163, 175, 1);
	}

	.keycap {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 20px;
		min-width: 20px;
		padding: 0 6px;
		border-radius: 6px;
		border: 1px solid rgba(17, 24, 39, 0.18);
		background: rgba(255, 255, 255, 1);
		box-shadow: 0 1px 0 rgba(17, 24, 39, 0.08);
		font-size: 0.75rem;
		color: rgba(55, 65, 81, 1);
		line-height: 1;
	}
	:global([data-theme="dark"]) .keycap {
		background: rgba(31, 41, 55, 1);
		border: 1px solid rgba(255, 255, 255, 0.16);
		color: rgba(229, 231, 235, 1);
		box-shadow: none;
	}

	.algolia-brand {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.algolia-brand-text {
		font-size: 0.75rem;
		color: rgba(107, 114, 128, 1);
		white-space: nowrap;
	}
	:global([data-theme="dark"]) .algolia-brand-text {
		color: rgba(156, 163, 175, 1);
	}

	.algolia-brand-svg {
		display: block;
		height: 16px;
		width: auto;
	}
</style>
