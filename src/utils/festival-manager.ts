/**
 * 全站变灰等站点级视觉效果（与节假日装饰无关）
 */

import type { SiteConfig } from "@/types/config";

/**
 * 判断是否应该全站变灰
 * @param grayscaleConfig 全站变灰配置
 * @returns 是否应该变灰
 */
export function shouldApplyGrayscale(
	grayscaleConfig?: SiteConfig["grayscale"],
): boolean {
	return grayscaleConfig?.enable ?? false;
}
