function visitElements(node, visitor) {
	if (!node || typeof node !== "object") return;
	if (node.type === "element") visitor(node);
	if (!Array.isArray(node.children)) return;
	for (const child of node.children) visitElements(child, visitor);
}

/**
 * Keep unusually large fenced blocks as plain text. Expressive Code normally
 * creates several wrapper nodes per line and token, which becomes expensive
 * for logs and generated configuration dumps.
 */
export function rehypeLongCodeBlocks(options = {}) {
	const maxLines = options.maxLines ?? 200;
	const maxCharacters = options.maxCharacters ?? 16_000;

	return (tree) => {
		visitElements(tree, (node) => {
			if (node.tagName !== "pre" || node.children?.length !== 1) return;

			const code = node.children[0];
			if (
				code?.type !== "element" ||
				code.tagName !== "code" ||
				code.children?.length !== 1 ||
				code.children[0]?.type !== "text"
			) {
				return;
			}

			const textNode = code.children[0];
			const lineCount =
				textNode.value === "" ? 0 : textNode.value.split("\n").length;
			if (lineCount <= maxLines && textNode.value.length <= maxCharacters)
				return;

			const preClasses = Array.isArray(node.properties?.className)
				? node.properties.className
				: [];
			node.properties = {
				...(node.properties || {}),
				className: [...preClasses, "long-code-block"],
				dataLineCount: String(lineCount),
				tabIndex: 0,
			};

			// rehype-expressive-code only transforms code whose sole child is text.
			// One semantic wrapper preserves the exact escaped source but skips that
			// expensive transformation.
			code.children = [
				{
					type: "element",
					tagName: "span",
					properties: { className: ["long-code-plain-text"] },
					children: [textNode],
				},
			];
		});
	};
}
