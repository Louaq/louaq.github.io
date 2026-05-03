import type {
	HomeTopNoticeConfig,
	HomeTopNoticeItem,
} from "../types/config";

/**
 * 首页顶部重要通知（主栏顶部轮播/列表上方）
 * - 单条：填写 title/content/type 等顶层字段。
 * - 多条：设置 items，每项可有独立的 type（info / warning / success / error / neutral / tip / urgent）。
 */
export const homeTopNoticeConfig: HomeTopNoticeConfig = {
	enable: false,
	title: "重要通知",
	content: "今晚23:00-24:00 进行维护，期间可能无法访问",
	type: "warning",
	icon: "fa6-solid:triangle-exclamation",
	closable: false,
	dismissKey: "default",
	link: {
		enable: false,
		text: "",
		url: "",
		external: false,
	},
};


// 多条
// export const homeTopNoticeConfig: HomeTopNoticeConfig = {
// 	enable: true,
// 	items: [
// 	  {
// 		type: "urgent",
// 		title: "紧急",
// 		content: "某服务短暂异常，正在处理。",
// 		closable: true,
// 		dismissKey: "incident-20260503",
// 	  },
// 	  {
// 		type: "info",
// 		title: "提示",
// 		content: "新文章 RSS 已更新。",
// 		closable: true,
// 	  },
// 	],
//   };

/** 供布局与组件统一解析：启用且至少有一条有效正文 */
export function getNormalizedHomeTopNoticeItems(): HomeTopNoticeItem[] {
	const cfg = homeTopNoticeConfig;
	if (!cfg.enable) return [];

	const trimmedItems =
		cfg.items?.filter((item) => item.content?.trim() !== "") ?? [];
	if (trimmedItems.length > 0) return trimmedItems;

	const content = cfg.content?.trim() ?? "";
	if (content === "") return [];

	return [
		{
			title: cfg.title,
			content,
			icon: cfg.icon,
			type: cfg.type,
			closable: cfg.closable,
			dismissKey: cfg.dismissKey,
			link: cfg.link,
		},
	];
}
