import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site, url }) => {
	const origin = site?.toString() ?? url.origin;
	const sitemapUrl = new URL("sitemap.xml", origin).toString();
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${sitemapUrl}</loc>
  </sitemap>
</sitemapindex>`;

	return new Response(body, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
};
