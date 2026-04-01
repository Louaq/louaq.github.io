/**
 * 分类页（/categories/）卡片样式：图标、副标题、主题色可按分类名覆盖。
 * 未配置的分类按顺序循环使用 palettes 中的默认样式。
 */
export type CategoryCardStyle = {
	icon: string;
	/** 卡片内灰色说明文案；留空则不显示该行 */
	description: string;
	/** 图标与底部「N 篇」数字的主题色（建议 hex） */
	accent: string;
};

const DEFAULT_PALETTES: CategoryCardStyle[] = [
	{
		icon: "material-symbols:auto-awesome-rounded",
		description: "",
		accent: "#e11d48",
	},
	{
		icon: "material-symbols:badge-rounded",
		description: "",
		accent: "#0d9488",
	},
	{
		icon: "material-symbols:code-rounded",
		description: "",
		accent: "#0284c7",
	},
	{
		icon: "material-symbols:menu-book-rounded",
		description: "",
		accent: "#7c3aed",
	},
	{
		icon: "material-symbols:folder-rounded",
		description: "",
		accent: "#ea580c",
	},
	{
		icon: "material-symbols:topic-rounded",
		description: "",
		accent: "#db2777",
	},
];

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

export function getCategoryCardStyle(
	categoryName: string,
	index: number,
): CategoryCardStyle {
	const o = categoriesPageConfig.overrides[categoryName];
	const base = DEFAULT_PALETTES[index % DEFAULT_PALETTES.length];
	return {
		icon: o?.icon ?? base.icon,
		description: o?.description ?? base.description,
		accent: o?.accent ?? base.accent,
	};
}
