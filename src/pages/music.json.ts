import type { APIRoute } from "astro";
import { siteConfig } from "@/config";
import { musicConfig } from "@/config/musicConfig";

type Song = {
	id: number;
	name: string;
	ar: { name: string }[];
	al: { picUrl: string };
};

// 构建时拉取歌单生成静态 music.json，访客不再请求 /playlist/track/all；网易云上改了歌单需重新部署才同步
export const GET: APIRoute = async () => {
	const lists = await Promise.all(
		musicConfig.playlists.map((id) =>
			// 构建时没有同源，走线上站点的 /ncm 反代；反代按 Referer 放行，手动带上站点域名
			fetch(
				`${siteConfig.site_url}${musicConfig.api}/playlist/track/all?id=${id}`,
				{
					headers: { Referer: `${siteConfig.site_url}/` },
				},
			)
				.then((r) => r.json())
				.then((d: { songs: Song[] }) => d.songs),
		),
	);

	const songs = lists.flat().map((s) => ({
		id: s.id,
		name: s.name,
		artist: s.ar.map((a) => a.name).join(" / "),
		cover: `${s.al.picUrl}?param=300y300`,
	}));

	return new Response(JSON.stringify(songs), {
		headers: { "Content-Type": "application/json" },
	});
};
