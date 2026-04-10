import type { MomentPost, MomentsPageConfig } from "../types/config";

export const momentsPageConfig: MomentsPageConfig = {
	title: "",
	description: "",
	coverImage: "https://pic1.imgdb.cn/item/6919c4373203f7be000aeaf8.jpg",
};

export const momentsPosts: MomentPost[] = [
	{
		id: "1",
		author: "Louaq",
		avatar: "https://pic1.imgdb.cn/item/6919c42d3203f7be000aeabc.webp",
		content: "多图九宫格示例 (配图来自 Unsplash)。",
		images: [
			"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
			"https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80",
			"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
		],
		publishedAt: "2026-04-10T14:30:00+08:00",
		enabled: true,
	},
	{
		id: "2",
		author: "Louaq",
		avatar: "https://pic1.imgdb.cn/item/6919c42d3203f7be000aeabc.webp",
		content: "分享一篇在读的论文笔记。",
		publishedAt: "2026-04-09T09:00:00+08:00",
		link: {
			title: "站点文章列表",
			url: "/archive/",
		},
		enabled: true,
	},
];

export const getEnabledMoments = (): MomentPost[] =>
	momentsPosts.filter((m) => m.enabled !== false);
