<script lang="ts">
import { onMount } from "svelte";
import Icon from "@iconify/svelte";

import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import { getPostUrlBySlug, getResolvedPostPath } from "@/utils/url-utils";

interface Props {
	/** 全部文章（支持 URL 上 tag / category / uncategorized 筛选） */
	sortedPosts: Post[];
}
let { sortedPosts }: Props = $props();

/** Svelte 5 下勿对 export props 再赋值；URL 筛选用本地 $state，在 onMount 中读取 */
let tags = $state<string[]>([]);
let categories = $state<string[]>([]);
let uncategorized = $state<string | null>(null);

interface Post {
	id: string;
	data: {
		title: string;
		tags: string[];
		category?: string | null;
		published: Date;
		password?: string | boolean;
		slug?: string;
	};
}

interface Group {
	year: number;
	posts: Post[];
}

let groups = $state<Group[]>([]);

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

onMount(() => {
	const params = new URLSearchParams(window.location.search);
	tags = params.has("tag")
		? params.getAll("tag").map((t) => t.trim()).filter(Boolean)
		: [];
	categories = params.has("category")
		? params.getAll("category").map((c) => c.trim()).filter(Boolean)
		: [];
	uncategorized = params.get("uncategorized");

	let filteredPosts: Post[] = sortedPosts;

	if (tags.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) =>
					tags.some((urlTag) => urlTag === tag.trim()),
				),
		);
	}

	if (categories.length > 0) {
		filteredPosts = filteredPosts.filter((post) => {
			const c = post.data.category?.trim();
			return Boolean(c) && categories.includes(c);
		});
	}

	if (uncategorized) {
		filteredPosts = filteredPosts.filter(
			(post) => !post.data.category?.trim(),
		);
	}

	filteredPosts = filteredPosts
		.slice()
		.sort((a, b) => b.data.published.getTime() - a.data.published.getTime());

	groups = buildGroups(filteredPosts);
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
                        href={getPostUrlBySlug(getResolvedPostPath(post.id, post.data))}
                        aria-label={post.data.title}
                        class="group archive-row-link !block h-10 w-full rounded-lg text-black/75 dark:text-white/75
                        transition-colors duration-150
                        hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]
                        hover:text-[initial]"
                >
                    <div class="flex flex-row justify-start items-center h-full">
                        <!-- date -->
                        <div class="w-[15%] md:w-[10%] transition-colors text-sm text-right text-50">
                            {formatDate(post.data.published)}
                        </div>

                        <!-- dot and line（圆点 hover 纵向拉长，整行仍无 btn-plain 缩放） -->
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
                                class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold transition-colors duration-150
                     group-hover:text-[var(--primary)]
                     text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden flex items-center gap-1"
                        >
                            <span class="min-w-0 truncate">{post.data.title}</span>
                            {#if post.data.password}
                                <Icon name="material-symbols:lock-outline" class="inline text-xl align-middle -translate-y-px text-inherit flex-shrink-0" aria-label="加密" />
                            {/if}
                        </div>

                        <!-- tag list -->
                        <div
                                class="hidden md:block md:w-[15%] text-left text-sm transition-colors duration-150
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
