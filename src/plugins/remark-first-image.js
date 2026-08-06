import { EXIT, visit } from "unist-util-visit";

/* Use the post's first image as a fallback cover when no `image` frontmatter is set */
export function remarkFirstImage() {
	return (tree, { data }) => {
		let firstImage = "";
		visit(tree, "image", (node) => {
			if (node.url) {
				firstImage = node.url;
			}
			return EXIT;
		});
		data.astro.frontmatter.firstImage = firstImage;
	};
}
