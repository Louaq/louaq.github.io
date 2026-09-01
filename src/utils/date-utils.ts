import { siteConfig } from "../config";

export function formatDateToYYYYMMDD(date: Date): string {
	return date.toISOString().substring(0, 10);
}

/** 本地化的完整日期时间（含时分秒），目前用于 RSS 的 lastBuildDate */
export function formatDateI18nWithTime(dateInput: Date | string): string {
	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
	// 配置里的 zh_CN 形式转成 BCP 47 的 zh-CN；timeZone 为 undefined 时 Intl 用系统时区
	return date.toLocaleString(siteConfig.lang.replace("_", "-"), {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZone: siteConfig.timezone,
	});
}
