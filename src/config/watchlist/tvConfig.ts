// 电视剧观影清单配置
// 用于配置最近观看的电视剧作品

import type { WatchlistItem } from "./types";

export const tvItems: WatchlistItem[] = [
	{
		title: "三体",
		cover: "https://pic1.imgdb.cn/item/694fc37d161224305eb307f3.webp",
		type: "tv",
		status: "completed",
		rating: 8.5,
		episodes: {
			current: 30,
			total: 30,
		},
		startDate: "2024-12-10",
		comment: "国产科幻的新高度",
		link: "https://movie.douban.com/subject/35056124/",
		tags: ["科幻", "悬疑"],
		enabled: true,
	},
	{
		title: "唐朝诡事录之长安",
		cover: "https://pic1.imgdb.cn/item/694fde44161224305eb30a13.webp",
		type: "tv",
		status: "completed",
		rating: 8.0,
		episodes: {
			current: 40,
			total: 40,
		},
		startDate: "2025-10-12",
		comment: "唐诡系列：不只是一个IP的成功，更是打开了内娱新纪元",
		link: "https://movie.douban.com/subject/36318037/",
		tags: [" 动作", "悬疑", "犯罪"],
		enabled: true,
	},
	{
		title: "鹊刀门传奇 第二季",
		cover: "https://pic1.imgdb.cn/item/694fdf2d161224305eb30a1c.webp",
		type: "tv",
		status: "completed",
		rating: 8.2,
		episodes: {
			current: 40,
			total: 40,
		},
		startDate: "2025-01-12",
		comment: "春节喜剧还得看咱大爷的，每个梗都是满满的年味儿",
		link: "https://movie.douban.com/subject/36641286",
		tags: ["喜剧", "剧情", "武侠"],
		enabled: true,
	},
];

