/**
 * 节假日和特殊日期管理工具
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

/**
 * 获取当前激活的节假日装饰
 * @param festivalConfig 节假日装饰配置
 * @returns 当前激活的节假日装饰，如果没有则返回null
 */
export function getActiveFestival(
	festivalConfig?: SiteConfig["festivalDecoration"],
) {
	if (!festivalConfig?.enable || !festivalConfig.festivals) {
		return null;
	}

	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
	const currentDay = String(now.getDate()).padStart(2, "0");

	for (const festival of festivalConfig.festivals) {
		const [startMonth, startDay] = festival.startDate.split("-");
		const [endMonth, endDay] = festival.endDate.split("-");

		const startDate = new Date(
			currentYear,
			Number.parseInt(startMonth) - 1,
			Number.parseInt(startDay),
		);
		const endDate = new Date(
			currentYear,
			Number.parseInt(endMonth) - 1,
			Number.parseInt(endDay),
		);

		// 处理跨年的情况（如春节）
		if (startDate > endDate) {
			// 检查是否在年初的日期范围内
			const yearStartDate = new Date(currentYear, 0, 1);
			const currentDate = new Date(
				currentYear,
				Number.parseInt(currentMonth) - 1,
				Number.parseInt(currentDay),
			);

			if (currentDate >= yearStartDate && currentDate <= endDate) {
				return festival;
			}

			// 检查是否在年末的日期范围内
			const yearEndDate = new Date(currentYear, 11, 31);
			if (currentDate >= startDate && currentDate <= yearEndDate) {
				return festival;
			}
		} else {
			// 正常的日期范围
			const currentDate = new Date(
				currentYear,
				Number.parseInt(currentMonth) - 1,
				Number.parseInt(currentDay),
			);

			if (currentDate >= startDate && currentDate <= endDate) {
				return festival;
			}
		}
	}

	return null;
}

/**
 * 获取装饰效果的 CSS 类名
 * @param decorationType 装饰类型
 * @returns CSS 类名
 */
export function getDecorationClassName(
	decorationType: string,
): string | undefined {
	const classMap: Record<string, string> = {
		"spring-festival": "festival-spring",
		christmas: "festival-christmas",
		halloween: "festival-halloween",
		valentines: "festival-valentines",
		custom: "festival-custom",
	};

	return classMap[decorationType];
}

