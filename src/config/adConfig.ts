import type {
	AdConfig,
	AdFeedItem,
	AdItem,
	AdPlacementName,
} from "../types/config";

export const adConfig: AdConfig = {
	// 总开关：关闭后三个位置都不渲染
	enable: true,

	// 默认横幅宽高比，按素材实际尺寸填写（宽 / 高）；各位置可单独覆盖
	aspectRatio: "350 / 60",

	// 文章正文上方
	top: {
		enable: true,
		items: [
			{
				// 唯一标识；顶部与底部配成同一个 id 时，关掉一处另一处也一起消失
				id: "banner-1",
				// 是否启用该条
				enable: true,
				// 横幅图片：/ 开头为 public 下的站内资源，也可直接填外链
				image: "https://cdn.ping0.cc/images/ex/8c0e97165f9193cadf2d90966867b771.gif",
				// 图片描述（无障碍与图片加载失败时显示）
				alt: "广告横幅",
				// 点击跳转地址
				link: "https://www.onesproxy.com/?user_source=1&invite_code=HLY74977",
				// 是否在新标签页打开
				external: true,
				// 左上角是否显示「关闭」按钮
				closable: true,
				// 右上角标记文案，留空用「广告」
				label: "广告",
			},
			{
				// 唯一标识；顶部与底部配成同一个 id 时，关掉一处另一处也一起消失
				id: "banner-2",
				// 是否启用该条
				enable: true,
				// 横幅图片：/ 开头为 public 下的站内资源，也可直接填外链
				image:
					"https://cdn.ping0.cc/images/ex/2a7f7aab058744841a8c466aa7ac3229.gif",
				// 图片描述（无障碍与图片加载失败时显示）
				alt: "广告横幅",
				// 点击跳转地址
				link: "https://linkstatic.com/?kwd=lqd-pingo",
				// 是否在新标签页打开
				external: true,
				// 左上角是否显示「关闭」按钮
				closable: true,
				// 右上角标记文案，留空用「广告」
				label: "广告",
			},
			{
				// 唯一标识；顶部与底部配成同一个 id 时，关掉一处另一处也一起消失
				id: "banner-3",
				// 是否启用该条
				enable: true,
				// 横幅图片：/ 开头为 public 下的站内资源，也可直接填外链
				image:
					"https://cdn.ping0.cc/images/ex/d9de6192346895b1eab7d4dd2f99d396.gif",
				// 图片描述（无障碍与图片加载失败时显示）
				alt: "广告横幅",
				// 点击跳转地址
				link: "https://www.proxy-cheap.com/cn/?utm_source=ping0cc&utm_medium=banner&utm_campaign=display_ads",
				// 是否在新标签页打开
				external: true,
				// 左上角是否显示「关闭」按钮
				closable: true,
				// 右上角标记文案，留空用「广告」
				label: "广告",
			},
		],
	},

	// 文章正文下方（版权声明之后）
	bottom: {
		enable: true,

		// 该位置若用不同尺寸的素材，在这里单独写宽高比即可
		// aspectRatio: "728 / 90",
		items: [
			{
				// 唯一标识；顶部与底部配成同一个 id 时，关掉一处另一处也一起消失
				id: "bottom-1",
				// 是否启用该条
				enable: true,
				// 横幅图片：/ 开头为 public 下的站内资源，也可直接填外链
				image:
					"https://cdn.ping0.cc/images/ex/ae2c0d87898528db4825dd7af4c86d81.gif",
				// 图片描述（无障碍与图片加载失败时显示）
				alt: "广告横幅",
				// 点击跳转地址
				link: "https://bestproxy.com/?keyword=ihoa1wt1",
				// 是否在新标签页打开
				external: true,
				// 左上角是否显示「关闭」按钮
				closable: true,
				// 右上角标记文案，留空用「广告」
				label: "广告",
			},
			{
				// 唯一标识；顶部与底部配成同一个 id 时，关掉一处另一处也一起消失
				id: "bottom-2",
				// 是否启用该条
				enable: true,
				// 横幅图片：/ 开头为 public 下的站内资源，也可直接填外链
				image:
					"https://cdn.ping0.cc/images/ex/189722caa53bcad8d2e7c2e0e1048d5f.gif",
				// 图片描述（无障碍与图片加载失败时显示）
				alt: "广告横幅",
				// 点击跳转地址
				link: "https://www.vircs.com/promotion?code=4",
				// 是否在新标签页打开
				external: true,
				// 左上角是否显示「关闭」按钮
				closable: true,
				// 右上角标记文案，留空用「广告」
				label: "广告",
			},
			{
				// 唯一标识；顶部与底部配成同一个 id 时，关掉一处另一处也一起消失
				id: "bottom-3",
				// 是否启用该条
				enable: true,
				// 横幅图片：/ 开头为 public 下的站内资源，也可直接填外链
				image:
					"https://cdn.ping0.cc/images/ex/3144865ef774d6b2e32914ec4420863f.gif",
				// 图片描述（无障碍与图片加载失败时显示）
				alt: "广告横幅",
				// 点击跳转地址
				link: "https://www.nsocks.com/?keyword=0suirfse",
				// 是否在新标签页打开
				external: true,
				// 左上角是否显示「关闭」按钮
				closable: true,
				// 右上角标记文案，留空用「广告」
				label: "广告",
			},
		],
	},

	// 左侧边栏（全站生效，不只文章页）。侧边栏窄，这里固定单列堆叠。
	// 注：项目只渲染左侧边栏，右栏没有对应组件，所以不提供左右选择。
	sidebar: {
		enable: true,

		// 侧边栏宽度约 300px，竖版或方形素材更合适；留空则用顶层的 aspectRatio
		aspectRatio: "300 / 60",

		// 在侧边栏里的位置：top=固定顶部，sticky=跟随滚动
		position: "sticky",

		// 显示顺序，与 sidebarConfig.ts 里 profile(1) / announcement(2) / runtime(3) 一起排
		order: 6,

		// CSS 类名与入场动画延迟
		class: "onload-animation",
		animationDelay: 0,

		items: [
			{
				// 唯一标识；与其他位置配成同一个 id 时，关掉一处另一处也一起消失
				id: "sidebar-1",
				// 是否启用该条
				enable: true,
				// 横幅图片：/ 开头为 public 下的站内资源，也可直接填外链
				image:
					"https://cdn.ping0.cc/images/ex/727b9914f72e0a8b99f246608f71dc1d.gif",
				// 图片描述（无障碍与图片加载失败时显示）
				alt: "广告横幅",
				// 点击跳转地址
				link: "https://proxy001.com/?ppf=jason_ping0",
				// 是否在新标签页打开
				external: true,
				// 左上角是否显示「关闭」按钮
				closable: true,
				// 右上角标记文案，留空用「广告」
				label: "广告",
			},
			{
				// 唯一标识；与其他位置配成同一个 id 时，关掉一处另一处也一起消失
				id: "sidebar-2",
				// 是否启用该条
				enable: true,
				// 横幅图片：/ 开头为 public 下的站内资源，也可直接填外链
				image: "",
				// 图片描述（无障碍与图片加载失败时显示）
				alt: "广告横幅",
				// 点击跳转地址
				link: "",
				// 是否在新标签页打开
				external: true,
				// 左上角是否显示「关闭」按钮
				closable: true,
				// 右上角标记文案，留空用「广告」
				label: "广告",
			},
		],
	},

	// 文章列表信息流（首页 / 分类页 / 标签页共用同一份配置）。
	// 广告做成与文章卡同样式的原生卡片，靠右上角标区分，每隔 interval 篇插一条。
	feed: {
		enable: true,

		// 每隔几篇文章插一条：5 表示第 5、10、15 篇之后各插一条。
		// 广告不会成为列表的最后一项，所以每页 10 篇 + interval 5 实际是每页 1 条。
		interval: 5,

		// 单页最多插几条；0 或省略表示不限
		maxPerPage: 2,

		// 多条时按顺序轮着用，用完从头循环
		items: [
			{
				// 唯一标识；与其他位置配成同一个 id 时，关掉一处另一处也一起消失
				id: "feed-1",
				// 是否启用该条
				enable: true,
				// 卡片标题
				title: "广告位",
				// 卡片描述，窄屏两行、宽屏三行，超出截断
				description:
					"把 title / description / image / link 换成真实素材即可上线；留空 image 则只显示文字。",
				// 卡片配图：/ 开头为 public 下的站内资源，也可直接填外链；留空则不显示图片区
				image: "",
				// 图片描述（无障碍与图片加载失败时显示）
				alt: "广告配图",
				// 点击跳转地址；留空则整卡不可点击
				link: "",
				// 是否在新标签页打开
				external: true,
				// 是否显示「关闭」按钮
				closable: true,
				// 角标文案，留空用「广告」
				label: "广告",
				// 卡片底部行动文案，留空用「了解更多」
				cta: "了解更多",
			},
		],
	},
};

/**
 * 取指定位置当前应当展示的条目。
 * 总开关或该位置关闭、条目未启用、已过期的都会被滤掉；
 * 结果为空时调用方跳过整条广告栏。
 */
export function getActiveAdItems(placement: AdPlacementName): AdItem[] {
	const group = adConfig[placement];
	if (!adConfig.enable || !group.enable) {
		return [];
	}

	const now = new Date();
	return group.items.filter((item) => {
		if (!item.enable) {
			return false;
		}
		return !(item.expireDate && now > new Date(item.expireDate));
	});
}

/** 取指定位置的横幅宽高比：位置上没写就回退到顶层配置，再没有用默认值 */
export function getAdAspectRatio(placement: AdPlacementName): string {
	return adConfig[placement].aspectRatio || adConfig.aspectRatio || "350 / 60";
}

/**
 * 取信息流广告里当前可用的条目，过滤规则与横幅位一致
 * （总开关 / 位置开关 / 单条开关 / 过期时间）。
 */
export function getActiveFeedAdItems(): AdFeedItem[] {
	const group = adConfig.feed;
	if (!adConfig.enable || !group.enable) {
		return [];
	}

	const now = new Date();
	return group.items.filter((item) => {
		if (!item.enable) {
			return false;
		}
		return !(item.expireDate && now > new Date(item.expireDate));
	});
}

/**
 * 算出当前这一页的广告插槽：key 是「插在第几篇文章之后」（1 起数），
 * value 是该位置要展示的条目。
 *
 * 每页独立计数，翻页后照样出现；条件不满足（没启用、没条目、文章太少）时
 * 返回空 Map，调用方原样渲染文章列表。
 * 刻意用 after < postCount：广告永远不会成为列表的最后一项。
 */
export function getFeedAdSlots(postCount: number): Map<number, AdFeedItem> {
	const slots = new Map<number, AdFeedItem>();
	const items = getActiveFeedAdItems();
	if (items.length === 0 || postCount <= 1) {
		return slots;
	}

	const interval = Math.max(1, Math.floor(adConfig.feed.interval || 5));
	const configuredMax = adConfig.feed.maxPerPage;
	const max =
		configuredMax && configuredMax > 0
			? configuredMax
			: Number.POSITIVE_INFINITY;

	let used = 0;
	for (
		let after = interval;
		after < postCount && used < max;
		after += interval
	) {
		slots.set(after, items[used % items.length]);
		used += 1;
	}

	return slots;
}
