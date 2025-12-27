// 电影观影清单配置
// 用于配置最近观看的电影作品

import type { WatchlistItem } from "./types";

export const movieItems: WatchlistItem[] = [
	{
		title: "星际穿越",
		cover: "https://pic1.imgdb.cn/item/694fc3b6161224305eb307f5.webp",
		type: "movie",
		status: "completed",
		rating: 9.8,
		startDate: "2025-11-15",
		endDate: "2025-11-15",
		comment: "诺兰的巅峰之作，科幻电影的里程碑",
		link: "https://movie.douban.com/subject/1889243/",
		tags: ["科幻", "冒险", "剧情"],
		enabled: true,
	},
	{
		title: "肖申克的救赎 ",
		cover: "https://pic1.imgdb.cn/item/694fdc86161224305eb309ff.webp",
		type: "movie",
		status: "completed",
		rating: 9.7,
		startDate: "2018-11-15",
		endDate: "2028-11-15",
		comment: "终于找到了郁闷人生的原因――观《肖申克的救赎》有感",
		link: "https://movie.douban.com/subject/1292052/",
		tags: ["剧情", "犯罪"],
		enabled: true,
	},
	{
		title: "疯狂动物城",
		cover: "https://pic1.imgdb.cn/item/694fdd58161224305eb30a0b.webp",
		type: "movie",
		status: "completed",
		rating: 9.3,
		startDate: "2020-05-21",
		endDate: "2020-05-21",
		comment: "孩子：学会做一个体面的普通人",
		link: "https://movie.douban.com/subject/25662329/",
		tags: ["喜剧", "动画", "冒险"],
		enabled: true,
	},
];

