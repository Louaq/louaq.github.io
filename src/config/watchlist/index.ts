// 观影清单主配置文件
// 整合所有类型的观影记录

import type { WatchlistConfig } from "./types";
import { animeItems } from "./animeConfig";
import { movieItems } from "./movieConfig";
import { tvItems } from "./tvConfig";
import { documentaryItems } from "./documentaryConfig";
import { otherItems } from "./otherConfig";

// 导出类型定义供其他文件使用
export type { WatchlistItem, WatchlistConfig } from "./types";

// 整合所有观影记录
export const watchlistConfig: WatchlistConfig = {
	items: [
		...animeItems,
		...movieItems,
		...tvItems,
		...documentaryItems,
		...otherItems,
	],
	display: {
		itemsPerPage: 12,
		sortBy: "date",
		sortOrder: "desc",
		showRating: true,
		showProgress: true,
	},
};

