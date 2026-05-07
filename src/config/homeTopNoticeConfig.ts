import type {
	HomeTopNoticeConfig,
	HomeTopNoticeItem,
} from "../types/config";

/**
 * 首页顶部重要通知（主栏顶部，列表/卡片上方）
 *
 * 用法：在 items 数组中添加任意条数的通知，每条可独立设置：
 *  - title    : 通知标题（可选）
 *  - content  : 通知正文（必填，空字符串会被忽略）；可按 HTML 书写，例如
 *               '维护说明见<a href="/posts/foo/">此文</a>。' 外链请自行加 target="_blank" rel="noopener noreferrer"
 *  - type     : 配色，info / warning / success / error / neutral / tip / urgent
 *  - icon     : 预留字段（当前组件不展示图标）
 *  - link     : 末尾的跳转按钮，可选
 *
 * 如需临时关闭整块通知区域，将 enable 设为 false 即可。
 */
export const homeTopNoticeConfig: HomeTopNoticeConfig = {
	enable: true,
	items: [
		{
			title: "重要通知",
			content: "今晚23:00-24:00 进行维护，期间可能无法访问",
			type: "info",
			icon: "fa6-solid:triangle-exclamation",
			link: {
				enable: false,
				text: "",
				url: "",
				external: false,
			},
		},
		// 你可以继续在下面添加更多条通知，例如：
		// {
		// 	title: "紧急",
		// 	content: "某服务短暂异常，正在处理。",
		// 	type: "urgent",
		// },
		// {
		// 	title: "提示",
		// 	content: "新文章 RSS 已更新。",
		// 	type: "info",
		// 	link: {
		// 		enable: true,
		// 		text: "查看",
		// 		url: "/rss/",
		// 		external: false,
		// 	},
		// },
	],
};

/** 供布局与组件统一解析：启用且 content 非空的条目 */
export function getNormalizedHomeTopNoticeItems(): HomeTopNoticeItem[] {
	const cfg = homeTopNoticeConfig;
	if (!cfg.enable) return [];
	return (cfg.items ?? []).filter(
		(item) => (item?.content ?? "").trim() !== "",
	);
}
