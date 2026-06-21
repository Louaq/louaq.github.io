// 观影清单主配置文件
// 整合所有类型的观影记录

import type { WatchlistConfig } from "./types";
import { animeItems } from "./animeConfig";
import { movieItems } from "./movieConfig";
import { tvItems } from "./tvConfig";

// 导出类型定义供其他文件使用
export type { WatchlistItem, WatchlistConfig } from "./types";

// 整合所有观影记录（仅保留动漫、电影、电视剧）
export const watchlistConfig: WatchlistConfig = {
	items: [...animeItems, ...movieItems, ...tvItems],
	display: {
		itemsPerPage: 12,
		sortBy: "date",
		sortOrder: "desc",
		showRating: true,
		showProgress: true,
	},
};

