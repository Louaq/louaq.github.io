/**
 * 分类页（/categories/）卡片样式：图标、副标题、强调色可按分类名覆盖。
 * 未配置时统一使用主题色 var(--primary)。
 */
export type CategoryCardStyle = {
	icon: string;
	/** 卡片内灰色说明文案；留空则不显示该行 */
	description: string;
	/** 图标与底部「N 篇」的强调色：默认 var(--primary)，也可写 hex 覆盖 */
	accent: string;
};

const DEFAULT_STYLE: CategoryCardStyle = {
	icon: "material-symbols:folder-outline-rounded",
	description: "",
	accent: "var(--primary)",
};

export const categoriesPageConfig: {
	/** 键为分类显示名（与文章 frontmatter 的 category 一致，含「未分类」等本地化名称） */
	overrides: Record<
		string,
		Partial<Pick<CategoryCardStyle, "icon" | "description" | "accent">>
	>;
} = {
	overrides: {
		// 示例（按需取消注释并改成你的分类名）：
		// "林间·拾光": {
		// 	icon: "material-symbols:auto-awesome-rounded",
		// 	description: "记下思想的流动",
		// 	accent: "#e11d48",
		// },
	},
};

export function getCategoryCardStyle(categoryName: string): CategoryCardStyle {
	const o = categoriesPageConfig.overrides[categoryName];
	return {
		icon: o?.icon ?? DEFAULT_STYLE.icon,
		description: o?.description ?? DEFAULT_STYLE.description,
		accent: o?.accent ?? DEFAULT_STYLE.accent,
	};
}
