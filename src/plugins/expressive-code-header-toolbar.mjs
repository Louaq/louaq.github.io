/**
 * Expressive Code 插件：把复制按钮与折叠展开/收起按钮从 figure 顶层挪进标题栏
 * （figcaption.header），让每个代码块都拥有统一的 mac 风格标题栏
 * （左侧三色圆点 + 居中语言徽标 + 右侧按钮组，样式见 main.css）。
 *
 * - 复制按钮（.copy）默认渲染在 figure 顶层，靠绝对定位悬浮在代码区右上角；
 *   折叠按钮（expressive-code-collapsible 生成）只有在代码块带 has-title/
 *   is-terminal 时才会自动注入 header，其余情况只有底部悬浮的 .ec-collapse__toggle。
 *   这里把两者统一挪进 header，交给 main.css 的 flex 布局排布。
 * - 折叠按钮的点击逻辑仍由 expressive-code-collapsible 自带的前端脚本处理，
 *   它用 querySelectorAll('.ec-collapse__toggle, .ec-collapse__header-toggle')
 *   统一绑定，与按钮在 DOM 中的位置无关，所以直接克隆一份挪进 header 即可。
 *
 * 必须排在 pluginCollapsible 之后注册，这样折叠包装器已经生成完毕。
 */

function isElement(node, tagName) {
	return (
		!!node && node.type === "element" && (!tagName || node.tagName === tagName)
	);
}

function hasClass(node, className) {
	const value = node?.properties?.className;
	if (Array.isArray(value)) return value.includes(className);
	if (typeof value === "string") return value.split(/\s+/).includes(className);
	return false;
}

function findFirst(node, predicate) {
	if (!node) return null;
	if (predicate(node)) return node;
	if (Array.isArray(node.children)) {
		for (const child of node.children) {
			const found = findFirst(child, predicate);
			if (found) return found;
		}
	}
	return null;
}

export function pluginHeaderToolbar() {
	return {
		name: "Header Toolbar",
		hooks: {
			postprocessRenderedBlock(context) {
				const root = context.renderData.blockAst;
				const figure = findFirst(
					root,
					(node) => isElement(node, "figure") && hasClass(node, "frame"),
				);
				if (!figure || !Array.isArray(figure.children)) return;

				const header = figure.children.find((node) =>
					isElement(node, "figcaption"),
				);
				if (!header) return;
				if (!Array.isArray(header.children)) header.children = [];

				// 复制按钮原本是 figure 的顶层子节点，移到 header 末尾
				const copyIndex = figure.children.findIndex(
					(node) => isElement(node, "div") && hasClass(node, "copy"),
				);
				const copyButton =
					copyIndex !== -1 ? figure.children.splice(copyIndex, 1)[0] : null;

				// 折叠插件只在 has-title/is-terminal 时才会往 header 里塞按钮，
				// 其余情况从底部悬浮按钮克隆一份挪进 header
				const alreadyInHeader = header.children.some(
					(node) =>
						isElement(node, "button") &&
						hasClass(node, "ec-collapse__header-toggle"),
				);
				if (!alreadyInHeader) {
					const floatingToggle = findFirst(
						root,
						(node) =>
							isElement(node, "button") &&
							hasClass(node, "ec-collapse__toggle"),
					);
					if (floatingToggle) {
						header.children.push({
							type: "element",
							tagName: "button",
							properties: {
								...floatingToggle.properties,
								className: ["ec-collapse__header-toggle"],
							},
							children: floatingToggle.children,
						});
					}
				}

				if (copyButton) header.children.push(copyButton);
			},
		},
	};
}

export default pluginHeaderToolbar;
