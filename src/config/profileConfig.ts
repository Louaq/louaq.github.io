import type { ProfileConfig } from "../types/config";

export const profileConfig: ProfileConfig = {
	avatar: "/assets/images/avatar.webp",
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
