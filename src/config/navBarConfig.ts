import {
	LinkPreset,
	type NavBarConfig,
	type NavBarLink,
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
		name: "状态",
		url: "http://status.louaq.com",
		external: true,
		icon: "material-symbols:cloud-done-rounded",
	  });

  // 构建子菜单，确保所有项都是有效的
	const aboutChildren: (NavBarLink | LinkPreset)[] = [
		LinkPreset.About,
	];
	
	// 根据配置添加子菜单项
	if (siteConfig.pages.albums) {
		aboutChildren.push(LinkPreset.Albums);
	}
	if (siteConfig.pages.watchlist) {
		aboutChildren.push(LinkPreset.Watchlist);
	}
	if (siteConfig.pages.sponsor) {
		aboutChildren.push(LinkPreset.Sponsor);
	}
	if (siteConfig.pages.bangumi) {
		aboutChildren.push(LinkPreset.Bangumi);
	}

	links.push({
		name: "关于",
		url: "/content/",
		icon: "material-symbols:info",
		children: aboutChildren,
	});
  // 仅返回链接，其它导航搜索相关配置在模块顶层常量中独立导出
  return { links } as NavBarConfig;
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
