<script lang="ts">
import { onMount } from "svelte";
import Icon from "@iconify/svelte";

import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import { getPostUrlBySlug } from "@/utils/url-utils";

export let tags: string[] = [];
export let categories: string[] = [];
export let sortedPosts: Post[] = [];
export let pageSize: number = 20;

const params = new URLSearchParams(window.location.search);
tags = params.has("tag") ? params.getAll("tag") : [];
categories = params.has("category") ? params.getAll("category") : [];
const uncategorized = params.get("uncategorized");

interface Post {
	id: string;
	data: {
		title: string;
		tags: string[];
		category?: string | null;
		published: Date;
		password?: string | boolean;
	};
}

interface Group {
	year: number;
	posts: Post[];
}

let groups: Group[] = [];
let currentPage = 1;
let totalPages = 1;
let totalCount = 0;
let allFilteredPosts: Post[] = [];

function formatDate(date: Date) {
	const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
	const day = date.getUTCDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}

function buildGroups(posts: Post[]): Group[] {
	const grouped = posts.reduce(
		(acc, post) => {
			const year = post.data.published.getUTCFullYear();
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(post);
			return acc;
		},
		{} as Record<number, Post[]>,
	);

	const groupedArray = Object.keys(grouped).map((yearStr) => ({
		year: Number.parseInt(yearStr, 10),
		posts: grouped[Number.parseInt(yearStr, 10)],
	}));

	groupedArray.sort((a, b) => b.year - a.year);
	return groupedArray;
}

function goToPage(page: number) {
	if (page < 1 || page > totalPages) return;
	currentPage = page;

	const url = new URL(window.location.href);
	if (page === 1) {
		url.searchParams.delete("page");
	} else {
		url.searchParams.set("page", String(page));
	}
	window.history.replaceState(null, "", url.toString());

	const start = (currentPage - 1) * pageSize;
	const end = start + pageSize;
	groups = buildGroups(allFilteredPosts.slice(start, end));

	window.scrollTo({ top: 0, behavior: "smooth" });
}

function getPageNumbers(): (number | "...")[] {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}
	const pages: (number | "...")[] = [1];
	if (currentPage > 3) pages.push("...");
	const start = Math.max(2, currentPage - 1);
	const end = Math.min(totalPages - 1, currentPage + 1);
	for (let i = start; i <= end; i++) pages.push(i);
	if (currentPage < totalPages - 2) pages.push("...");
	pages.push(totalPages);
	return pages;
}

onMount(async () => {
	let filteredPosts: Post[] = sortedPosts;

	if (tags.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => tags.includes(tag)),
		);
	}

	if (categories.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) => post.data.category && categories.includes(post.data.category),
		);
	}

	if (uncategorized) {
		filteredPosts = filteredPosts.filter((post) => !post.data.category);
	}

	filteredPosts = filteredPosts
		.slice()
		.sort((a, b) => b.data.published.getTime() - a.data.published.getTime());

	allFilteredPosts = filteredPosts;
	totalCount = filteredPosts.length;
	totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

	const pageParam = new URLSearchParams(window.location.search).get("page");
	const initialPage = Math.min(
		Math.max(1, pageParam ? Number.parseInt(pageParam, 10) : 1),
		totalPages,
	);
	currentPage = initialPage;

	const start = (currentPage - 1) * pageSize;
	const end = start + pageSize;
	groups = buildGroups(filteredPosts.slice(start, end));
});
</script>

<div class="card-base px-8 py-6">
    {#each groups as group}
        <div>
            <div class="flex flex-row w-full items-center h-[3.75rem]">
                <div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">
                    {group.year}
                </div>
                <div class="w-[15%] md:w-[10%]">
                    <div
                            class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto
                  -outline-offset-[2px] z-50 outline-3"
                    ></div>
                </div>
                <div class="w-[70%] md:w-[80%] transition text-left text-50">
                    {group.posts.length} {i18n(group.posts.length === 1 ? I18nKey.postCount : I18nKey.postsCount)}
                </div>
            </div>

            {#each group.posts as post}
                <a
                        href={getPostUrlBySlug(post.id)}
                        aria-label={post.data.title}
                        class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]"
                >
                    <div class="flex flex-row justify-start items-center h-full">
                        <!-- date -->
                        <div class="w-[15%] md:w-[10%] transition text-sm text-right text-50">
                            {formatDate(post.data.published)}
                        </div>

                        <!-- dot and line -->
                        <div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                            <div
                                    class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                       bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)]
                       outline outline-4 z-50
                       outline-[var(--card-bg)]
                       group-hover:outline-[var(--btn-plain-bg-hover)]
                       group-active:outline-[var(--btn-plain-bg-active)]"
                            ></div>
                        </div>

                        <!-- post title -->
                        <div
                                class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
                     group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)]
                     text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden flex items-center gap-1"
                        >
                            <span class="min-w-0 truncate">{post.data.title}</span>
                            {#if post.data.password}
                                <Icon name="material-symbols:lock-outline" class="inline text-xl align-middle -translate-y-px text-inherit flex-shrink-0" aria-label="加密" />
                            {/if}
                        </div>

                        <!-- tag list -->
                        <div
                                class="hidden md:block md:w-[15%] text-left text-sm transition
                     whitespace-nowrap overflow-ellipsis overflow-hidden text-30"
                        >
                            {formatTag(post.data.tags)}
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/each}
</div>

<!-- 分页控件：放在 card-base 外，使 btn-card 背景色可见 -->
{#if totalPages > 1}
    <div class="flex flex-col gap-4 items-center mt-4">
        <div class="flex flex-row gap-3 justify-center">
            <!-- 上一页 -->
            <button
                    on:click={() => goToPage(currentPage - 1)}
                    aria-label="上一页"
                    class="btn-card overflow-hidden rounded-lg text-[var(--primary)] w-11 h-11 {currentPage === 1 ? 'disabled' : ''}"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M14 18l-6-6 6-6 1.4 1.4-4.6 4.6 4.6 4.6z"/>
                </svg>
            </button>

            <!-- 页码 -->
            <div class="bg-[var(--card-bg)] flex flex-row rounded-lg items-center text-neutral-700 dark:text-neutral-300 font-bold">
                {#each getPageNumbers() as page}
                    {#if page === "..."}
                        <span class="w-11 h-11 flex items-center justify-center text-50 select-none">…</span>
                    {:else if page === currentPage}
                        <div class="h-11 w-11 rounded-lg bg-[var(--primary)] flex items-center justify-center font-bold text-white dark:text-black/70">
                            {page}
                        </div>
                    {:else}
                        <button
                                on:click={() => goToPage(page)}
                                aria-label={`第 ${page} 页`}
                                class="btn-card w-11 h-11 rounded-lg overflow-hidden active:scale-[0.85]"
                        >
                            {page}
                        </button>
                    {/if}
                {/each}
            </div>

            <!-- 下一页 -->
            <button
                    on:click={() => goToPage(currentPage + 1)}
                    aria-label="下一页"
                    class="btn-card overflow-hidden rounded-lg text-[var(--primary)] w-11 h-11 {currentPage === totalPages ? 'disabled' : ''}"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9.4 18 8 16.6l4.6-4.6L8 7.4 9.4 6l6 6z"/>
                </svg>
            </button>
        </div>

        <!-- 页面信息 -->
        <div class="text-sm text-50">
            第 {currentPage} / {totalPages} 页，共 {totalCount} 篇文章
        </div>
    </div>
{/if}
