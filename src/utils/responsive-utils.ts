import { sidebarLayoutConfig } from "../config";
import { widgetManager } from "./widget-manager";

// 响应式侧边栏配置（仅支持左侧单侧栏）
export const getResponsiveSidebarConfig = () => {
	const globalSidebarEnabled = sidebarLayoutConfig.enable;
	const isBothSidebars = false;

	return {
		globalSidebarEnabled,
		isBothSidebars,
		mobileShowSidebar:
			globalSidebarEnabled && widgetManager.shouldShowSidebar("mobile"),
		tabletShowSidebar:
			globalSidebarEnabled && widgetManager.shouldShowSidebar("tablet"),
		desktopShowSidebar:
			globalSidebarEnabled && widgetManager.shouldShowSidebar("desktop"),
		// 检查左右侧边栏是否有组件
		hasLeftComponents:
			isBothSidebars && widgetManager.hasComponentsInSidebar("left"),
		hasRightComponents:
			isBothSidebars && widgetManager.hasComponentsInSidebar("right"),
		// 检查各设备上左右侧边栏是否有可见组件
		hasLeftComponentsMobile:
			isBothSidebars &&
			widgetManager.hasVisibleComponentsInSidebar("left", "mobile"),
		hasLeftComponentsTablet:
			isBothSidebars &&
			widgetManager.hasVisibleComponentsInSidebar("left", "tablet"),
		hasLeftComponentsDesktop:
			isBothSidebars &&
			widgetManager.hasVisibleComponentsInSidebar("left", "desktop"),
		hasRightComponentsMobile:
			isBothSidebars &&
			widgetManager.hasVisibleComponentsInSidebar("right", "mobile"),
		hasRightComponentsTablet:
			isBothSidebars &&
			widgetManager.hasVisibleComponentsInSidebar("right", "tablet"),
		hasRightComponentsDesktop:
			isBothSidebars &&
			widgetManager.hasVisibleComponentsInSidebar("right", "desktop"),
	};
};
