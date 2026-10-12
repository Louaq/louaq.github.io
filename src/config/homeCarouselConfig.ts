// 手动配置的轮播项
// 这些项的展示顺序高于所有由文章 frontmatter 中 `homeCarouselOrder` 决定的顺序
// 即：手动项始终排在前面（按数组定义顺序），其后才是文章项
export interface HomeCarouselManualItem {
	// 必填：标题（轮播图主文案）
	title: string;
	// 必填：背景图（远程 URL，或以 / 开头的 public 路径）
	image: string;
	// 必填：点击跳转的链接（外链或站内路径）
	href: string;
	// 可选：发布日期，与文章一致显示为年月日（例如 "2026-04-29"）
	published?: string | Date;
	// 可选：分类
	category?: string;
	// 可选：描述（标题下方的一行摘要）
	description?: string;
}

export interface HomeCarouselConfig {
	enable: boolean;
	autoplayMs: number;
	manualItems: HomeCarouselManualItem[];
}

export const homeCarouselConfig: HomeCarouselConfig = {
	enable: true,
	autoplayMs: 10000,
	manualItems: [
		// {
		// 	title: "1111111111",
		// 	image: "https://pic1.imgdb.cn/i/034ZNXV1j7FrOPsXhA8ARN.webp",
		// 	href: "https://www.baidu.com/",
		// 	published: "2026-10-12",
		// 	category: "测试",
		// 	description: "测试",
		// },
	],
};
