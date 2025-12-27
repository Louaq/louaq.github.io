// 观影清单类型定义

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

