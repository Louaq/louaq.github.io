import type { ProfileConfig } from "../types/config";

export const profileConfig: ProfileConfig = {
	// 本地优化版（256×256 webp, 16.5KB）。原图床为 2.3MB PNG、每页加载，显示仅 64px。
	// 原始外链备份：https://pic1.imgdb.cn/item/6a28b506edae85a628525712.webp
	avatar: "/assets/images/avatar.webp",
	/** 侧栏 Profile 头图，可改成本地 / 任意图床 */
	// 本地优化版（640px webp, 22KB，原图床 163KB，显示约 320×104）。
	// 原始外链备份：https://pic1.imgdb.cn/item/6a291954eae595505fc16265.webp
	cover: "/assets/images/profile-cover.webp",
	name: "Louaq",
	bio: "晚来天欲雪,能饮一杯无",
	level: "化神期",
	links: [
		{
			name: "Email",
			icon: "/assets/images/gmail.svg",
			url: "mailto:louaqo@gmail.com",
		},
		{
			name: "GitHub",
			icon: "/assets/images/GitHub.0_p4tn41l679b.svg",
			url: "#",
		},
		{
			name: "CSDN",
			icon: "/assets/images/CSDN.24mmyqv-nyyoc.svg",
			url: "#",
		},
		{
			name: "Gitee",
			icon: "/assets/images/Gitee.0jouzwjw2-b4e.svg",
			url: "#",
		},
		{
			name: "RSS",
			icon: "/assets/images/rss.svg",
			url: "/rss.xml",
		},
	],
};
