import { sidebarLayoutConfig } from "../config";
import { adConfig } from "../config/adConfig";
import type { WidgetComponentConfig } from "../types/config";

/** 广告位单独配在 adConfig，读取时注入侧边栏（见 types/config.ts 的说明） */
function buildComponents(): WidgetComponentConfig[] {
	const ad = adConfig.sidebar;
	if (!adConfig.enable || !ad.enable || ad.items.length === 0) {
		return sidebarLayoutConfig.components;
	}
	return [
		...sidebarLayoutConfig.components,
		{
			type: "advertisement",
			enable: true,
			position: ad.position,
			order: ad.order,
			class: ad.class,
			animationDelay: ad.animationDelay,
			style: ad.style,
			responsive: ad.responsive,
		},
	];
}

/** 侧边栏全部组件（含注入的广告位），未过滤 enable */
export const sidebarComponents = buildComponents();

/** 移动端是否走侧边栏布局；MainGridLayout 据此决定单列 */
export const showSidebarOnMobile =
	sidebarLayoutConfig.enable &&
	(sidebarLayoutConfig.responsive?.layout?.mobile ?? "sidebar") === "sidebar";

/** 按位置取启用的组件，order 未设置时按 0 排 */
export function getComponentsByPosition(
	position: "top" | "sticky",
): WidgetComponentConfig[] {
	return sidebarComponents
		.filter((component) => component.enable && component.position === position)
		.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** 组件内联样式：自定义样式 + 入场动画延迟 */
export function getComponentStyle(
	component: WidgetComponentConfig,
	index: number,
): string {
	const styles: string[] = [];
	if (component.style) {
		styles.push(component.style);
	}

	const defaultAnim = sidebarLayoutConfig.defaultAnimation;
	const delay =
		component.animationDelay ??
		(defaultAnim?.enable
			? defaultAnim.baseDelay + index * defaultAnim.increment
			: 0);
	if (delay > 0) {
		styles.push(`animation-delay: ${delay}ms`);
	}

	return styles.join("; ");
}

/** 内容项数量达到阈值时折叠；未配阈值即不折叠 */
export function isCollapsed(
	component: WidgetComponentConfig,
	itemCount: number,
): boolean {
	const threshold = component.responsive?.collapseThreshold;
	return threshold ? itemCount >= threshold : false;
}
