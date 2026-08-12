import { type CollectionEntry, render } from "astro:content";

const metadataCache = new Map<
	string,
	Promise<Awaited<ReturnType<typeof loadPostRenderMetadata>>>
>();

async function loadPostRenderMetadata(entry: CollectionEntry<"posts">) {
	const { remarkPluginFrontmatter } = await render(entry);
	return remarkPluginFrontmatter;
}

/** Reuse remark-derived metadata when the same post appears on multiple listing pages. */
export function getPostRenderMetadata(entry: CollectionEntry<"posts">) {
	let pending = metadataCache.get(entry.id);
	if (!pending) {
		pending = loadPostRenderMetadata(entry);
		metadataCache.set(entry.id, pending);
	}
	return pending;
}
