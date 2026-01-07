import {
	LinkPreset,
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/config";
import { siteConfig } from "./siteConfig";

// 根据页面开关动态生成导航栏配置
const getDynamicNavBarConfig = (): NavBarConfig => {
	// 基础导航栏链接
	const links: (NavBarLink | LinkPreset)[] = [
		// 主页
		LinkPreset.Home,

		// 归档
		LinkPreset.Archive,
	];

	links.push(LinkPreset.Friends);

	// 根据配置决定是否添加留言板，在siteConfig关闭pages.guestbook时导航栏不显示留言板
	if (siteConfig.pages.guestbook) {
		links.push(LinkPreset.Guestbook);
	}

	// 根据配置决定是否添加观影清单页面
// 	if (siteConfig.pages.watchlist) {
// 		links.push(LinkPreset.Watchlist);
// 	}

//   links.push(LinkPreset.About);

    // 支持自定义导航栏链接,并且支持多级菜单
	links.push({
		name: "链接",
		url: "/links/",
		icon: "material-symbols:link",
		children: [
		  {
			name: "状态",
			url: "https://louaq.com",
			external: true,
			icon: "material-symbols:cloud-done-rounded",
		  },
		  {
			name: "开往",
			url: "https://www.travellings.cn/go.html",
			external: true,
			icon: "material-symbols:subway-rounded",
		  },
		],
	  });

  links.push({
    name: "关于",
    url: "/content/",
    icon: "material-symbols:info",
    children: [
      LinkPreset.About,
	  ...(siteConfig.pages.albums ? [LinkPreset.Albums] : []), // 根据配置决定是否添加相册页面
	  ...(siteConfig.pages.watchlist ? [LinkPreset.Watchlist] : []), // 根据配置决定是否添加观影清单页面
	  ...(siteConfig.pages.sponsor ? [LinkPreset.Sponsor] : []), // 根据配置决定是否添加赞助页面
	  ...(siteConfig.pages.bangumi ? [LinkPreset.Bangumi] : []), // 根据配置决定是否添加番组计划页面

    ],
  });
  // 仅返回链接，其它导航搜索相关配置在模块顶层常量中独立导出
  return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
