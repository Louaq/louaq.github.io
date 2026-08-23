import type { DARK_MODE, LIGHT_MODE } from "../constants/constants";

export type SiteConfig = {
	title: string;
	subtitle: string;
	site_url: string;
	description?: string; // 网站描述，用于生成 <meta name="description">
	keywords?: string[]; // 站点关键词，用于生成 <meta name="keywords">

	lang: "en" | "zh_CN" | "zh_TW" | "ja" | "ru";

	themeColor: {
		hue: number;
		showModeSwitch?: boolean; // 是否显示明暗/跟随系统模式切换按钮，默认 true
		defaultMode?: LIGHT_DARK_MODE; // 默认模式：浅色、深色或跟随系统
	};

	// 卡片样式配置
	card: {
		// 是否开启卡片边框和阴影立体效果
		border: boolean;
	};

	// 字体配置
	font: FontConfig;

	// 站点开始日期，用于计算运行天数
	siteStartDate?: string; // 格式: "YYYY-MM-DD"

	// 可选：站点时区，使用 IANA 时区标识，例如 "Asia/Shanghai"、"UTC"
	timezone?: string;

	// RSS 输出配置
	rss?: {
		// 输出模式：full=输出全文（包含 content），summary=仅输出摘要（即 description）
		mode: "full" | "summary";
	};

	// 提醒框配置
	rehypeCallouts: {
		theme: "github" | "obsidian" | "vitepress";
	};

	// 添加bangumi配置
	bangumi?: {
		userId?: string; // Bangumi用户ID
	};

	generateOgImages: boolean;
	favicon: Array<{
		src: string;
		theme?: "light" | "dark";
		sizes?: string;
	}>;

	navbar: {
		logo?: {
			type: "icon" | "image" | "url";
			value: string; // icon 名称、本地图片路径或网络图片 url
			alt?: string; // 图片alt文本
		};
	};

	showLastModified: boolean; // 控制文章页元信息中的更新日期与正文前过期提醒卡片
	outdatedThreshold?: number; // 过期提醒卡片：距上次编辑超过该天数才显示（元信息更新日期不受此限制）
	showPostPrevNext?: boolean; // 文章页是否显示上一篇/下一篇导航

	postPathMode?: "hash" | "legacy";

	// 页面开关配置
	pages: {
		friends: boolean; // 友链页面开关
		sponsor: boolean; // 赞助页面开关
		guestbook: boolean; // 留言板页面开关
		bangumi: boolean; // 番组计划页面开关
		watchlist: boolean; // 观影清单页面开关
	};

	// 文章列表布局配置
	postListLayout: {
		defaultMode: "list" | "grid"; // 默认布局模式：list=列表模式，grid=网格模式
		grid: {
			// 网格布局配置，仅当 defaultMode 为 "grid" 时生效
			// 是否开启瀑布流布局
			masonry: boolean;
			// 网格模式列数，2 或 3，默认为 2。注意：3列模式仅在单侧边栏（或无侧边栏）且屏幕宽度足够时生效
			columns?: 2 | 3;
		};
	};

	// 分页配置
	pagination: {
		postsPerPage: number;

		archivePostsPerPage?: number;
	};

	// 文章密码保护配置
	postPassword?: string; // 当文章的 password 字段设置为 true 时使用的默认密码
	postPasswordHint?: string; // 密码提示文案，如 "示例文章密码123456"
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
	Friends = 3,
	Sponsor = 4,
	Guestbook = 5,
	Bangumi = 6,
	Watchlist = 7,
	Categories = 8,
	Tags = 9,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
	icon?: string; // 菜单项图标
	children?: (NavBarLink | LinkPreset)[]; // 支持子菜单，可以是NavBarLink或LinkPreset
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

export type ProfileLinkItem = {
	name: string;
	url: string;
	icon: string;
	showName?: boolean;
};

export type ProfileBadgeItem = {
	text: string;
	href?: string;
	icon?: string;
};

export type ProfileStatValueMode =
	| "literal"
	| "postCount"
	| "randomReads"
	| "randomFollowers";

export type ProfileStatItem = {
	label: string;
	value?: string;
	href?: string;

	valueMode?: ProfileStatValueMode;

	randomMin?: number;
	randomMax?: number;
};

export type ProfileConfig = {
	avatar?: string;
	cover?: string;
	name: string;
	bio?: string;
	level?: string;
	badges?: ProfileBadgeItem[];
	stats?: ProfileStatItem[];
	links: ProfileLinkItem[];
};

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};
// 评论配置

export type CommentConfig = {
	/**
	 * "none" | "twikoo"
	 */
	type: "none" | "twikoo";
	twikoo?: {
		envId: string;
		region?: string;
		lang?: string;
		visitorCount?: boolean;
	};
};

export type LIGHT_DARK_MODE = typeof LIGHT_MODE | typeof DARK_MODE;

export type ExpressiveCodeConfig = {
	theme?: string;
	darkTheme: string;
	lightTheme: string;
	pluginCollapsible?: PluginCollapsibleConfig;
	pluginLanguageBadge?: PluginLanguageBadgeConfig;
};

export type PluginLanguageBadgeConfig = {
	enable: boolean; // 是否启用语言徽章
};

export type PluginCollapsibleConfig = {
	enable: boolean; // 是否启用代码块折叠功能
	lineThreshold: number; // 触发折叠的行数阈值
	previewLines: number; // 折叠时显示的预览行数
	defaultCollapsed: boolean; // 默认是否折叠
};

export type AnnouncementConfig = {
	// enable 属性已移除，现在通过 sidebarLayoutConfig 统一控制
	title?: string; // 公告栏标题
	content: string; // 公告栏内容
	icon?: string; // 公告栏图标
	type?: "info" | "warning" | "success" | "error"; // 公告类型
	closable?: boolean; // 是否可关闭
	link?: {
		enable: boolean; // 是否启用链接
		text: string; // 链接文字
		url: string; // 链接地址
		external?: boolean; // 是否外部链接
	};
};

export type HomeTopNoticeItem = {
	title?: string;

	content: string;
	icon?: string;
	link?: {
		enable: boolean;
		text: string;
		url: string;
		external?: boolean;
	};
};

export type HomeTopNoticeConfig = {
	enable: boolean;
	items: HomeTopNoticeItem[];
	/** 多条通知的轮播间隔（毫秒），仅在通知条数 > 1 时生效；缺省 8000 */
	switchInterval?: number;
};

// 正文字体（本地托管，由 scripts/split-font.js 分层切片后以样式表形式加载）
export type BodyFont = {
	name: string; // 字体显示名称
	family: string; // CSS font-family 名称
	/**
	 * 分层切片产物的样式表路径（含各层 @font-face 与 unicode-range）。
	 * 由 `pnpm split-font` 生成，不再是单个字体文件——所以这里是 css 而非 src，
	 * font-display / format 等也都写在生成的样式表里，无需在配置中重复。
	 */
	css: string;
};

// 代码字体（通过 Astro Font API / fontsource provider 自托管 + 子集化）
export type CodeFont = {
	cssVariable: string; // astro:assets <Font /> 注入的 CSS 变量名
	family: string; // fontsource 家族名
	weights: [string, ...string[]]; // 字重，变量字体可用范围字符串如 "100 800"
	styles: [string, ...string[]]; // 字体样式，如 ["normal"]
	subsets: [string, ...string[]]; // 子集，如 ["latin"]
	fallbacks: string[]; // 注入到 cssVariable 的回退序列（不含字体本身）
};

// 字体配置
export type FontConfig = {
	enable: boolean; // 是否启用自定义字体功能
	preload?: boolean; // 是否预加载代码字体（正文字体已分层，见 BodyFont）
	body: BodyFont; // 正文字体（本地托管 + 分层切片）
	code: CodeFont; // 代码字体（Astro Font API 自托管 + 子集化）
	fallback?: string[]; // 全局字体回退列表
	og?: {
		family: string; // OpenGraph 使用的字体族
		cssUrl: string; // OpenGraph 获取字体的 CSS 地址
		weights: {
			regular: number;
			bold: number;
		};
		fallback: string[];
	};
};

export type FooterConfig = {
	enable: boolean; // 是否启用Footer HTML注入功能
	customHtml?: string; // 自定义 HTML 内容，用于添加备案号等信息
	visitorCount?: {
		enable: boolean; // 是否在页脚显示访客计数
		apiUrl?: string; // 统计接口地址（Vercount，接口与不蒜子兼容）
		showSitePv?: boolean; // 显示全站访问量（PV）
		showSiteUv?: boolean; // 显示全站访客数（UV）
	};
};

export type CoverImageConfig = {
	enableInPost: boolean; // 是否在文章详情页显示封面图
};

// 组件配置类型定义
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "sidebarToc"
	| "advertisement"
	| "stats"
	| "runtime";

export type WidgetComponentConfig = {
	type: WidgetComponentType; // 组件类型
	enable: boolean; // 是否启用该组件
	position: "top" | "sticky"; // 组件位置：top=固定在顶部，sticky=粘性定位（可滚动）
	order?: number; // 组件显示顺序（数字越小越靠前）
	class?: string; // CSS 类名，用于应用样式和动画
	animationDelay?: number; // 动画延迟时间（毫秒），用于错开动画效果
	style?: string; // 自定义内联样式
	showOnPostPage?: boolean; // 是否在文章详情页显示
	showOnNonPostPage?: boolean; // 是否在非文章详情页显示
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // 在指定设备上隐藏
		collapseThreshold?: number; // 折叠阈值
	};
	customProps?: Record<string, unknown>; // 自定义属性，用于扩展组件功能
};

export type MobileBottomComponentConfig = {
	type: WidgetComponentType; // 组件类型
	enable: boolean; // 是否启用该组件
	showOnPostPage?: boolean; // 是否在文章详情页显示
	showOnNonPostPage?: boolean; // 是否在非文章详情页显示
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // 在指定设备上隐藏
		collapseThreshold?: number; // 折叠阈值
	};
	customProps?: Record<string, unknown>; // 自定义属性，用于扩展组件功能
};

export type SidebarLayoutConfig = {
	enable: boolean; // 是否启用侧边栏
	leftComponents: WidgetComponentConfig[]; // 左侧边栏组件配置列表
	rightComponents: WidgetComponentConfig[]; // 右侧边栏组件配置列表
	mobileBottomComponents?: MobileBottomComponentConfig[]; // 移动端底部组件配置列表（<768px 显示）
	defaultAnimation?: {
		enable: boolean; // 是否启用默认动画
		baseDelay: number; // 基础延迟时间（毫秒）
		increment: number; // 递增延迟时间（毫秒），每个组件依次增加的延迟
	};
	responsive?: {
		layout: {
			mobile: "hidden" | "drawer" | "sidebar"; // 移动端布局模式：hidden=不显示侧边栏，drawer=抽屉模式，sidebar=显示侧边栏
			tablet: "hidden" | "drawer" | "sidebar"; // 平板端布局模式
			desktop: "hidden" | "drawer" | "sidebar"; // 桌面端布局模式
		};
	};
};

// 单条横幅广告
export type AdItem = {
	id: string; // 唯一标识；顶部与底部配成同一个 id 时，关掉一处另一处也一起消失
	enable: boolean; // 是否启用该条
	image?: string; // 横幅图片地址（/ 开头为 public 下的站内资源，也可填外链）；留空显示占位块
	alt?: string; // 图片描述
	link?: string; // 点击跳转地址；留空则整块不可点击
	placeholderText?: string; // 没有 image 时占位块上的文字，留空用「广告」
	external?: boolean; // 是否在新标签页打开
	closable?: boolean; // 左上角是否显示「关闭」按钮
	label?: string; // 右上角标记文案，留空则用「广告」
	expireDate?: string; // 过期时间 (ISO 8601 格式)，过期后不再显示该条
};

// 广告位置：文章详情页的顶部 / 底部，以及全站侧边栏
export type AdPlacementName = "top" | "bottom" | "sidebar";

// 单个广告位的配置
export type AdPlacement = {
	enable: boolean; // 该位置是否启用
	aspectRatio?: string; // 该位置的横幅宽高比，留空则用顶层的 aspectRatio
	items: AdItem[]; // 广告条目，按顺序横向排列，一行最多三条
};

// 侧边栏广告位：除条目外还要描述在侧边栏里的位置，这些字段原本在 sidebarConfig.ts
// 的组件列表里，现在统一收进 adConfig.ts，由 widgetManager 读取后注入左侧边栏
export type AdSidebarPlacement = AdPlacement & {
	position: "top" | "sticky"; // top=固定在顶部，sticky=粘性定位（跟随滚动）
	order?: number; // 显示顺序，与 sidebarConfig.ts 里其他组件的 order 一起排序
	class?: string; // CSS 类名，用于应用样式和动画
	animationDelay?: number; // 动画延迟时间（毫秒）
	style?: string; // 自定义内联样式
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // 在指定设备上隐藏
	};
};

// 文章列表信息流里的单条原生广告卡：外观与文章卡一致，靠角标区分
export type AdFeedItem = {
	id: string; // 唯一标识；与其他位置配成同一个 id 时，关掉一处另一处也一起消失
	enable: boolean; // 是否启用该条
	title: string; // 卡片标题
	description?: string; // 卡片描述，最多两三行，超出截断
	image?: string; // 卡片配图（/ 开头为 public 下的站内资源，也可填外链）；留空则不显示图片区
	alt?: string; // 图片描述
	link?: string; // 点击跳转地址；留空则整卡不可点击
	external?: boolean; // 是否在新标签页打开
	closable?: boolean; // 是否显示「关闭」按钮
	label?: string; // 角标文案，留空则用「广告」
	cta?: string; // 卡片底部的行动文案，留空则用「了解更多」
	expireDate?: string; // 过期时间 (ISO 8601 格式)，过期后不再显示该条
};

// 信息流广告位：首页 / 分类页 / 标签页的文章列表共用一套配置
export type AdFeedPlacement = {
	enable: boolean; // 该位置是否启用
	interval: number; // 每隔几篇文章插一条（如 4 表示第 4、8、12 篇之后各插一条）
	maxPerPage?: number; // 单页最多插几条；0 或省略表示不限
	items: AdFeedItem[]; // 广告条目，按顺序轮着用，用完从头循环
};

// 广告栏配置：文章详情页顶部 / 底部的横幅广告条，以及全站侧边栏广告位
export type AdConfig = {
	enable: boolean; // 总开关，关闭后三个位置都不渲染
	aspectRatio?: string; // 默认横幅宽高比，如 "350 / 60"
	top: AdPlacement; // 文章正文上方
	bottom: AdPlacement; // 文章正文下方（版权声明之后）
	sidebar: AdSidebarPlacement; // 左侧边栏（全站，不限文章页）
	feed: AdFeedPlacement; // 文章列表信息流（首页 / 分类页 / 标签页）
};

// 友链配置
export type FriendLink = {
	title: string; // 友链标题
	imgurl: string; // 头像图片URL
	desc: string; // 友链描述
	siteurl: string; // 友链地址
	weight: number; // 权重，数字越大排序越靠前
	enabled: boolean; // 是否启用
	badge?: string; // 卡片右上角徽标文字，如 "PINNED"、"赞助商"，留空则不显示
	badgeIcon?: string; // 徽标图标（Iconify 名称），如 "material-symbols:keep-rounded"
};

// 友链分组的卡片布局
// default = 大卡片（方形头像 + 描述），compact = 小卡片（圆形头像，一行多个）
export type FriendGroupLayout = "default" | "compact";

// 友链分组，如"全站置顶"、"大佬"，可自由增删
export type FriendGroup = {
	name: string; // 分组名，显示为小标题
	description?: string; // 分组说明，显示在小标题下方，可留空
	layout?: FriendGroupLayout; // 卡片布局，默认 "default"
	includeSelf?: boolean; // 是否在该分组开头插入本站卡片（带 OWNER 徽标）
	enabled?: boolean; // 是否启用该分组，默认 true
	weight?: number; // 分组排序权重，数字越大越靠前，默认 0
	friends: FriendLink[]; // 该分组下的友链
};

export type FriendsPageConfig = {
	title?: string; // 页面标题，留空则使用 i18n 中的翻译
	description?: string; // 页面描述，留空则使用 i18n 中的翻译
	showCustomContent?: boolean; // 是否显示自定义内容（friends.mdx）
	showComment?: boolean; // 是否显示评论区，默认 true
	randomizeSort?: boolean; // 是否打乱排序，如果为 true，将忽略 weight，随机排序
};

// 赞助方式类型
export type SponsorMethod = {
	name: string; // 赞助方式名称，如 "支付宝"、"微信"、"PayPal"
	icon?: string; // 图标名称（Iconify 格式），如 "fa6-brands:alipay"
	qrCode?: string; // 收款码图片路径（相对于 public 目录），可选
	link?: string; // 赞助链接 URL，可选，如果提供，会显示跳转按钮
	description?: string; // 描述文本
	enabled: boolean; // 是否启用
};

// 赞助者列表项
export type SponsorItem = {
	name: string; // 赞助者名称，如果想显示匿名，可以直接设置为"匿名"或使用 i18n
	amount?: string; // 赞助金额（可选）
	date?: string; // 赞助日期（可选，ISO 格式）
	message?: string; // 留言（可选）
};

// 赞助配置
export type SponsorConfig = {
	title?: string; // 页面标题，默认使用 i18n
	description?: string; // 页面描述文本
	usage?: string; // 赞助用户说明
	methods: SponsorMethod[]; // 赞助方式列表
	sponsors?: SponsorItem[]; // 赞助者列表（可选）
	showSponsorsList?: boolean; // 是否显示赞助者列表，默认 true
	showComment?: boolean; // 是否显示评论区，默认 false
	showButtonInPost?: boolean; // 是否在文章详情页底部显示赞助按钮，默认 true
};
