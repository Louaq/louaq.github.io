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
	// 可选：日期文本，原样显示（例如 "2026-04-29" 或 "2026 年特刊"）
	date?: string;
	// 可选：分类
	category?: string;
	// 可选：标签数组（最多展示前 2 个）
	tags?: string[];
	// 可选：外链是否在新窗口打开（默认根据 href 是否以 http 开头自动判断）
	openInNewTab?: boolean;
}

export interface HomeCarouselConfig {
	enable: boolean;
	autoplayMs: number;
	manualItems: HomeCarouselManualItem[];
}

export const homeCarouselConfig: HomeCarouselConfig = {
	// 首页轮播总开关
	enable: true,
	// 自动轮播间隔（毫秒），设置为 0 可关闭自动播放
	autoplayMs: 10000,
	// 手动轮播项列表（顺序即展示顺序，且整体排在文章项之前）
	manualItems: [
		// 示例：
		{
			title: "",
			image: "https://pic1.imgdb.cn/item/69f84824c32b4b1956182133.webp",
			href: "",
			date: "",
			category: "",
			tags: [],
		},
	],
};
