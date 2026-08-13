import type { CoverImageConfig } from "../types/config";

/**
 * 文章封面图配置
 *
 * enableInPost - 是否在文章详情页显示封面图
 *
 * 列表页封面的取值顺序（见 PostCard.astro）：
 * 1. 文章 Frontmatter 的 image 字段
 * 2. 正文中的第一张图片
 * 3. PostCard 内置兜底图池中按文章 id 稳定选取的一张
 *
 * 此处原本还有一组 randomCoverImage 配置（随机图 API 列表、失败备用图、加载指示器、
 * 水印），配套 image-utils.ts 与 cover-image-init.ts 实现「依次轮换 API → 换备用图」
 * 的降级链。封面图早已本地化 / 固定图床，该开关长期为 false，整套已随之移除。
 */
export const coverImageConfig: CoverImageConfig = {
	// 是否在文章详情页显示封面图
	enableInPost: false,
};
