// 配置索引文件 - 统一导出所有配置
// 这样组件可以一次性导入多个相关配置，减少重复的导入语句

// 功能配置
export { commentConfig } from "./commentConfig"; // 评论系统配置
export { expressiveCodeConfig } from "./expressiveCodeConfig"; // 代码高亮配置
export { fontConfig } from "./fontConfig"; // 字体配置
export { footerConfig } from "./footerConfig"; // 页脚配置
export {
	friendSiteInfo,
	friendsPageConfig,
	getEnabledFriendGroups,
} from "./friendsConfig"; // 友链配置
export { homeCarouselConfig } from "./homeCarouselConfig"; // 首页轮播配置
export { getNormalizedHomeTopNoticeItems } from "./homeTopNoticeConfig"; // 首页顶部通知
// 组件配置
export { navBarConfig } from "./navBarConfig"; // 导航栏配置
export { profileConfig } from "./profileConfig"; // 用户资料配置
// 布局配置
export { sidebarLayoutConfig } from "./sidebarConfig"; // 侧边栏布局配置
// 核心配置
export { siteConfig } from "./siteConfig"; // 站点基础配置
