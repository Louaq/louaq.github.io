import type { MomentPost, MomentsPageConfig } from "../types/config";

export const momentsPageConfig: MomentsPageConfig = {
	title: "",
	description: "",
	coverImage: "",
};

export const momentsPosts: MomentPost[] = [
	{
		id: "1",
		author: "Louaq",
		avatar: "https://pic1.imgdb.cn/item/6919c42d3203f7be000aeabc.webp",
		content: "今天把博客加上了「朋友圈」页面，样式参考微信，记录一点生活与技术日常。",
		images: [
			"https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
		],
		time: "1 小时前",
		location: "上海",
		enabled: true,
	},
	{
		id: "2",
		author: "Louaq",
		avatar: "https://pic1.imgdb.cn/item/6919c42d3203f7be000aeabc.webp",
		content: "多图九宫格示例（配图来自 Unsplash）。",
		images: [
			"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
			"https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80",
			"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
			"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80",
			"https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80",
		],
		time: "昨天",
		enabled: true,
	},
	{
		id: "3",
		author: "Louaq",
		avatar: "https://pic1.imgdb.cn/item/6919c42d3203f7be000aeabc.webp",
		content: "分享一篇在读的论文笔记。",
		time: "3 天前",
		link: {
			title: "站点文章列表",
			url: "/archive/",
		},
		enabled: true,
	},
];

export const getEnabledMoments = (): MomentPost[] =>
	momentsPosts.filter((m) => m.enabled !== false);
