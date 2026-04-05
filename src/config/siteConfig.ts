import type { SiteConfig } from "@/types/config";
import { fontConfig } from "./fontConfig";

// 定义站点语言
// 语言代码，例如：'zh_CN', 'zh_TW', 'en', 'ja', 'ru'。
const SITE_LANG = "zh_CN";

export const siteConfig: SiteConfig = {
  title: "Louaq",
  subtitle: "论文阅读笔记",
  site_url: "https://louaq.io",
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
	"ACM MM"
  ],

	// 主题色
	themeColor: {
		// 主题色的默认色相，范围从 0 到 360。例如：红色：0，青色：200，蓝绿色：250，粉色：345
		hue: 240,
		// 是否对访问者隐藏主题色选择器（调色盘按钮及面板内主题色滑块）
		fixed: false,
		// 是否显示明暗/跟随系统模式切换按钮，与 fixed 独立配置
		showModeSwitch: true,
		// 默认模式："light" 亮色，"dark" 暗色，"system" 跟随系统
		defaultMode: "system",
	},

  favicon: [
    // 留空以使用默认 favicon
    {
      src: "https://pic1.imgdb.cn/item/691c65bb3203f7be0013b576.png", // 图标文件路径
      theme: "light", // 可选，指定主题 'light' | 'dark'
      sizes: "32x32", // 可选，图标大小
    },
  ],
	// 网站Card样式配置
	card: {
		// 是否开启卡片边框和阴影，开启后让网站更有立体感
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
			alt: "louaq",
		},
		// 导航栏标题
		title: "louaq",
		// 全宽导航栏，导航栏是否占满屏幕宽度，true：占满，false：不占满
		widthFull: false,
		// 导航栏图标和标题是否跟随主题色
		followTheme: false,
	},

	// 搜索引擎配置：algolia / milisearch

	search: {
		// milisearch (Meilisearch) 搜索（需要配置环境变量；前端会访问 https://search.louaq.com）
		// 如果未配置 Meilisearch 的 search key，组件会退回到未配置提示。
		engine: "milisearch",
	},
  // 站点开始日期，用于统计运行天数
  siteStartDate: "2025-11-14", // 请修改为你的站点实际开始日期，格式：YYYY-MM-DD


	// bangumi配置
	bangumi: {
		userId: "1163581", // 在此处设置你的Bangumi用户ID
	},

	// 站点时区（IANA 时区字符串），用于格式化bangumi、rss里的构建日期时间等等..
	// 示例："Asia/Shanghai", "UTC", 如果为空，则按照构建服务器的时区进行时区转换
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
	outdatedThreshold: 5,

	// 文章页"上一篇/下一篇"导航开关
	showPostPrevNext: false,

	// OpenGraph图片功能,注意开启后要渲染很长时间，不建议本地调试的时候开启
	generateOgImages: false,

  // 页面开关配置 - 控制特定页面的访问权限，设为false会返回404
  // bangumi的数据为编译时获取的，所以不是实时数据，请配置bangumi.userId
  pages: {

	// 友链页面开关
	friends: false,
    sponsor: false, // 赞助页面开关
    guestbook: false, // 留言板页面开关，需要配置评论系统
    bangumi: false, // 番组计划页面开关，含追番和游戏，dev调试时只获取一页数据，build才会获取全部数据
    watchlist: true, // 观影清单页面开关
    albums: false, // 相册页面开关
    moments: true, // 朋友圈页面开关
  },

	// 文章列表布局配置
	postListLayout: {
		// 默认布局模式："list" 列表模式（单列布局），"grid" 网格模式（多列布局）
		defaultMode: "list",
		// 是否允许用户切换布局
		allowSwitch: true,
		// 网格布局配置，仅在 defaultMode 为 "grid" 或允许切换布局时生效
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
		// 每页显示的文章数量
		postsPerPage: 10,
		// 归档页每页显示的文章数量，默认20
		archivePageSize: 20,
	},

	// 字体配置
	// 在src/config/fontConfig.ts中配置具体字体
	font: fontConfig,

	// 文章密码保护配置
	// 当文章的password字段设置为true时，将使用此密码
	postPassword: "123456",
	// 密码提示文案，留空则不显示提示
	postPasswordHint: "示例文章密码",

	// 全站变灰配置
	// 手动控制：true = 启用变灰，false = 关闭变灰
	// 适用于特殊纪念日（如清明节、国家公祭日等）
	grayscale: {
		enable: false, // 设置为 true 启用全站变灰，false 关闭
	},

    // 站点语言，在本配置文件顶部SITE_LANG定义
	lang: SITE_LANG,


};
