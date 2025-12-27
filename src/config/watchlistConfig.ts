// 观影清单配置文件
// 用于配置最近观看的动漫、影视作品等

export type WatchlistItem = {
	title: string; // 作品名称
	cover: string; // 封面图片URL
	type: "anime" | "movie" | "tv" | "documentary" | "other"; // 作品类型
	status: "watching" | "completed" | "plan_to_watch"; // 观看状态
	rating?: number; // 评分（1-10）
	episodes?: {
		current?: number; // 当前观看到第几集
		total?: number; // 总集数
	};
	startDate?: string; // 开始观看日期 YYYY-MM-DD
	endDate?: string; // 完成观看日期 YYYY-MM-DD
	comment?: string; // 简短评价
	link?: string; // 相关链接（如豆瓣、Bangumi等）
	tags?: string[]; // 标签
	enabled: boolean; // 是否启用
};

export type WatchlistConfig = {
	items: WatchlistItem[];
	// 显示设置
	display: {
		itemsPerPage: number; // 每页显示数量
		sortBy: "date" | "rating" | "title"; // 排序方式
		sortOrder: "asc" | "desc"; // 排序顺序
		showRating: boolean; // 是否显示评分
		showProgress: boolean; // 是否显示观看进度
	};
};

export const watchlistConfig: WatchlistConfig = {
	items: [
		{
			title: "仙逆",
			cover:
				"https://pic1.imgdb.cn/item/694fc15e161224305eb307dc.webp",
			type: "anime",
			status: "watching",
			rating: 8.9,
			episodes: {
				current: 120,
				total: 128,
			},
			startDate: "2025-02-24",
			comment: "No.6 豆瓣2025评分最高动画剧集",
			link: "https://movie.douban.com/subject/37220616/",
			tags: ["动作", "动画", " 奇幻"],
			enabled: true,
		},
		{
			title: "吞噬星空 第5季",
			cover:
				"https://pic1.imgdb.cn/item/694fc2a9161224305eb307e5.webp",
			type: "anime",
			status: "watching",
			rating: 7.4,
			episodes: {
				current: 137,
				total: 156,
			},
			startDate: "2024-08-06",
			comment: "百分之八十的剧情都在打斗中结束了",
			link: "https://movie.douban.com/subject/36985220/",
			tags: ["科幻 ", "动画"],
			enabled: true,
		},
		{
			title: "遮天 年番3",
			cover:
				"https://pic1.imgdb.cn/item/694fc435161224305eb307fc.webp",
			type: "anime",
			status: "watching",
			rating: 0.0,
			episodes: {
				current: 107,
				total: 156,
			},
			startDate: "2024-04-30",
			comment: "遮天112集封神",
			link: "https://movie.douban.com/subject/37304613/",
			tags: ["动作", "动画", " 奇幻"],
			enabled: true,
		},
		{
			title: "师兄啊师兄 年番2",
			cover:
				"https://pic1.imgdb.cn/item/694fc4eb161224305eb30805.webp",
			type: "anime",
			status: "watching",
			rating: 0.0,
			episodes: {
				current: 92,
				total: 143,
			},
			startDate: "2025-06-05",
			comment: "可做泡面番",
			link: "https://movie.douban.com/subject/37060848/",
			tags: ["动作", "动画", "奇幻"],
			enabled: true,
		},
		{
			title: "一念永恒 第三季",
			cover:
				"https://pic1.imgdb.cn/item/694fc5cf161224305eb3080f.webp",
			type: "anime",
			status: "completed",
			rating: 8.0,
			episodes: {
				current: 59,
				total: 59,
			},
			startDate: "2024-07-30",
			comment: "登峰造极",
			link: "https://movie.douban.com/subject/36055705/",
			tags: ["喜剧", "动作", "动画", "奇幻"],
			enabled: true,
		},
		{
			title: "完美世界",
			cover:
				"https://pic1.imgdb.cn/item/694fc690161224305eb30816.webp",
			type: "anime",
			status: "watching",
			rating: 7.9,
			episodes: {
				current: 247,
				total: 286,
			},
			startDate: "2025-10-03",
			comment: "石昊以身化种，一触即发",
			link: "https://movie.douban.com/subject/37516275/",
			tags: ["动作", "动画", "奇幻"],
			enabled: true,
		},
		{
			title: "永生之太元仙府",
			cover:
				"https://pic1.imgdb.cn/item/694fc768161224305eb3081e.webp",
			type: "anime",
			status: "watching",
			rating: 0.0,
			episodes: {
				current: 4,
				total: 26,
			},
			startDate: "2025-12-20",
			comment: "有进步，加油加油",
			link: "https://movie.douban.com/subject/37167540/",
			tags: ["动作", "动画", "奇幻"],
			enabled: true,
		},
		{
			title: "凡人修仙传：外海风云",
			cover:
				"https://pic1.imgdb.cn/item/694fc810161224305eb30829.webp",
			type: "anime",
			status: "watching",
			rating: 9.6,
			episodes: {
				current: 175,
				total: 176,
			},
			startDate: "2025-01-18",
			comment: "No.1 豆瓣2025评分最高动画剧集",
			link: "https://movie.douban.com/subject/36923479/",
			tags: ["动画", "奇幻"],
			enabled: true,
		},
		{
			title: "牧神记 年番2",
			cover:
				"https://pic1.imgdb.cn/item/694fc8c3161224305eb30835.webp",
			type: "anime",
			status: "watching",
			rating: 0.0,
			episodes: {
				current: 53,
				total: 104,
			},
			startDate: "2025-10-19",
			comment: "圣临山登基：一场兼具美学、深度与温情的国漫盛宴",
			link: "https://movie.douban.com/subject/37449251/",
			tags: ["动作", "动画", "奇幻"],
			enabled: true,
		},
		{
			title: "剑来 第二季",
			cover:
				"https://pic1.imgdb.cn/item/694fc99b161224305eb3083c.webp",
			type: "anime",
			status: "watching",
			rating: 0.0,
			episodes: {
				current: 3,
				total: 26,
			},
			startDate: "2025-12-25",
			comment: "从骊珠洞天到万里山河，小镇少年创造自己的“机缘”与“气运”",
			link: "https://movie.douban.com/subject/37220896/",
			tags: ["动作", "动画", "奇幻"],
			enabled: true,
		},
		{
			title: "星际穿越",
			cover:
				"https://pic1.imgdb.cn/item/694fc3b6161224305eb307f5.webp",
			type: "movie",
			status: "completed",
			rating: 9.8,
			startDate: "2024-11-15",
			endDate: "2024-11-15",
			comment: "诺兰的巅峰之作，科幻电影的里程碑",
			link: "https://movie.douban.com/subject/1889243/",
			tags: ["科幻", "冒险", "剧情"],
			enabled: true,
		},
		{
			title: "三体",
			cover:
				"https://pic1.imgdb.cn/item/694fc37d161224305eb307f3.webp",
			type: "tv",
			status: "completed",
			rating: 8.5,
			episodes: {
				current: 15,
				total: 30,
			},
			startDate: "2024-12-10",
			comment: "国产科幻的新高度",
			link: "https://movie.douban.com/subject/35056124/",
			tags: ["科幻", "悬疑", "中国"],
			enabled: true,
		},
	],
	display: {
		itemsPerPage: 12,
		sortBy: "date",
		sortOrder: "desc",
		showRating: true,
		showProgress: true,
	},
};

