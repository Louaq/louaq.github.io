import type { SiteConfig } from "@/types/config";
import { fontConfig } from "./fontConfig";

const SITE_LANG = "zh_CN";

export const siteConfig: SiteConfig = {
	title: "Louaq",
	subtitle: "论文阅读笔记",
	site_url: "https://louaq.com",
	description:
		"注于多模态医学图像领域的研究者与爱好者。在这个日新月异的医学影像技术世界里，我希望通过这个小小的平台，与大家分享我对前沿论文的阅读心得、技术分析以及实践经验",
	keywords: [
		"louaq",
		"多模态",
		"医学图像分析",
		"AIGC",
		"计算机视觉",
		"论文",
		"CVPR",
		"ECCV",
		"ICCV",
		"MICCAI",
		"TPAMI",
		"TMI",
		"TMM",
		"TIP",
		"TNNLS",
		"ACM MM",
	],

	// 主题色
	themeColor: {
		// 站点色相，范围从 0 到 360。例如：红色：0，青色：200，蓝绿色：250，粉色：345
		// 39 = Claude 品牌橙 #D97757（oklch 0.672 0.131 38.8）
		hue: 39,
		showModeSwitch: true,
		defaultMode: "light",
	},

	favicon: [
		{
			src: "https://pic1.imgdb.cn/item/691c65bb3203f7be0013b576.png", 
			theme: "light",
			sizes: "32x32",
		},
	],

	card: {
		border: true,
	},

	// 导航栏配置
	navbar: {
		// 支持三种类型：
		// 1. Astro图标库: { type: "icon", value: "material-symbols:home-pin-outline" }
		// 2. 本地图片: { type: "image", value: "/assets/images/logo.webp", alt: "Firefly Logo" }
		// 3. 网络图片: { type: "url", value: "https://example.com/logo.png", alt: "Firefly Logo" }
		logo: {
			type: "image",
			value: "/assets/images/favicon.png",
			alt: "",
		},
	},

	// 站点开始日期，用于统计运行天数
	siteStartDate: "2025-11-14", // 请修改为你的站点实际开始日期，格式：YYYY-MM-DD

	timezone: "Asia/Shanghai",

	// RSS 输出配置
	// - full：输出全文（RSS item 包含 content）
	// - summary：仅输出摘要（只保留 description，兼容只想看摘要的阅读器）
	rss: {
		mode: "summary",
	},

	// 提醒框（Admonitions）配置，修改后需要重启开发服务器才能生效
	// 主题：'github' | 'obsidian' | 'vitepress'，每个主题风格和语法不同，可根据喜好选择
	rehypeCallouts: {
		theme: "github",
	},

	// 文章页「上次编辑」相关展示：false 时隐藏元信息里的更新日期 + 正文前的过期提醒卡片
	showLastModified: true,

	// 文章过期阈值（天数），超过此天数才显示过期提醒卡片（元信息里的更新日期不受此阈值影响）
	outdatedThreshold: 10,

	// 文章页"上一篇/下一篇"导航开关
	showPostPrevNext: true,

	// 文章 URL：hash=自动生成稳定短 id；legacy=旧版「文件名去扩展名」长路径
	postPathMode: "hash",

	// 页面开关配置 - 控制特定页面的访问权限，设为false会返回404
	pages: {
		// 友链页面开关
		friends: true,
		sponsor: false, // 赞助页面开关
		guestbook: false, // 留言板页面开关，需要配置评论系统
		watchlist: true, // 观影清单页面开关
	},

	// 文章列表布局配置
	postListLayout: {
		// 默认布局模式："list" 列表模式（单列布局），"grid" 网格模式（多列布局）
		defaultMode: "list",
		// 网格布局配置，仅在 defaultMode 为 "grid" 时生效
		grid: {
			// 是否开启瀑布流布局，同时有封面图和无封面图的混合文章推荐开启
			masonry: false,
			// 网格模式列数：2 或 3
			// 2列是默认模式，在任何侧边栏配置下均可生效
			// 3列模式仅在单侧边栏（或无侧边栏）时生效，
			columns: 2,
		},
	},

	// 分页配置
	pagination: {
		// 首页每页文章数
		postsPerPage: 12,
	},

	// 字体配置
	// 在src/config/fontConfig.ts中配置具体字体
	font: fontConfig,

	// 文章密码保护配置
	// 当文章的password字段设置为true时，将使用此密码
	postPassword: "12345678yy",
	// 密码提示文案，留空则不显示提示
	postPasswordHint: "",

	// 站点语言，在本配置文件顶部SITE_LANG定义
	lang: SITE_LANG,
};
