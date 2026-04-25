export interface HomeCarouselConfig {
	enable: boolean;
	autoplayMs: number;
	maxItems: number;
}

export const homeCarouselConfig: HomeCarouselConfig = {
	// 首页轮播总开关
	enable: true,
	// 自动轮播间隔（毫秒），设置为 0 可关闭自动播放
	autoplayMs: 5000,
	// 最多展示多少篇（从文章 frontmatter 中筛选）
	maxItems: 5,
};
