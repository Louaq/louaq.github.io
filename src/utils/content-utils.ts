import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/category-utils";
import { getResolvedPostPath } from "@utils/url-utils";

type PostEntry = CollectionEntry<"posts">;

let sortedPostsPromise: Promise<PostEntry[]> | undefined;
let tagListPromise: Promise<Tag[]> | undefined;
let categoryListPromise: Promise<Category[]> | undefined;

// Content collections are immutable during one build. Cache the shared derivations so
// every generated route does not scan and sort the complete collection again.
function getRawSortedPosts(): Promise<PostEntry[]> {
	if (sortedPostsPromise) return sortedPostsPromise;

	sortedPostsPromise = getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	}).then((allBlogPosts) => {
		const sorted = [...allBlogPosts].sort((a, b) => {
			// 首先按置顶状态排序，置顶文章在前
			if (a.data.pinned && !b.data.pinned) return -1;
			if (!a.data.pinned && b.data.pinned) return 1;

			// 如果置顶状态相同，则按发布日期排序
			const dateA = new Date(a.data.published);
			const dateB = new Date(b.data.published);
			return dateA > dateB ? -1 : 1;
		});

		for (let i = 1; i < sorted.length; i++) {
			sorted[i].data.nextSlug = getResolvedPostPath(
				sorted[i - 1].id,
				sorted[i - 1].data,
			);
			sorted[i].data.nextTitle = sorted[i - 1].data.title;
		}
		for (let i = 0; i < sorted.length - 1; i++) {
			sorted[i].data.prevSlug = getResolvedPostPath(
				sorted[i + 1].id,
				sorted[i + 1].data,
			);
			sorted[i].data.prevTitle = sorted[i + 1].data.title;
		}

		return sorted;
	});

	return sortedPostsPromise;
}

export async function getSortedPosts() {
	return getRawSortedPosts();
}
export type ArchivePost = {
	id: string;
	pathSlug: string;
	title: string;
	published: Date;
	tags: string[];
	category: string;
	password: boolean;
};
export async function getArchivePostsList(): Promise<ArchivePost[]> {
	const posts = await getRawSortedPosts();
	return posts.map(({ id, data }) => ({
		id,
		pathSlug: getResolvedPostPath(id, data),
		title: data.title,
		published: data.published,
		tags: data.tags ?? [],
		category: data.category?.trim() ?? "",
		password: !!data.password,
	}));
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	if (tagListPromise) return tagListPromise;

	tagListPromise = getRawSortedPosts().then((allBlogPosts) => {
		const countMap: { [key: string]: number } = {};
		allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
			post.data.tags.forEach((tag: string) => {
				if (!countMap[tag]) countMap[tag] = 0;
				countMap[tag]++;
			});
		});

		// sort tags
		const keys: string[] = Object.keys(countMap).sort((a, b) => {
			return a.toLowerCase().localeCompare(b.toLowerCase());
		});

		return keys.map((key) => ({ name: key, count: countMap[key] }));
	});

	return tagListPromise;
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	if (categoryListPromise) return categoryListPromise;

	categoryListPromise = getRawSortedPosts().then((allBlogPosts) => {
		const count: { [key: string]: number } = {};
		allBlogPosts.forEach((post: { data: { category: string | null } }) => {
			if (!post.data.category) {
				const ucKey = i18n(I18nKey.uncategorized);
				count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
				return;
			}

			const categoryName =
				typeof post.data.category === "string"
					? post.data.category.trim()
					: String(post.data.category).trim();

			count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
		});

		const lst = Object.keys(count).sort((a, b) => {
			return a.toLowerCase().localeCompare(b.toLowerCase());
		});

		const ret: Category[] = [];
		for (const c of lst) {
			ret.push({
				name: c,
				count: count[c],
				url: getCategoryUrl(c),
			});
		}
		return ret;
	});

	return categoryListPromise;
}
