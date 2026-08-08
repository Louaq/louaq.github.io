import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { url } from "@utils/url-utils";

/**
 * 分类链接。
 *
 * 单独放在这里而不是 url-utils：它是唯一需要 i18n 的 URL 工具，而 i18n/translation
 * 会把全部语言包（~46KB）拉进依赖图。url-utils 会被 Layout 的客户端脚本 import，
 * 混在一起会让每个页面都白背这 46KB。本函数只在服务端（.astro / content-utils）用。
 */
export function getCategoryUrl(category: string | null): string {
	const uncategorizedLabel = i18n(I18nKey.uncategorized);
	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() === uncategorizedLabel.toLowerCase()
	) {
		return url(`/categories/${encodeURIComponent(uncategorizedLabel)}/`);
	}
	return url(`/categories/${encodeURIComponent(category.trim())}/`);
}
