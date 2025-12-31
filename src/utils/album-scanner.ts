import { albumsConfig } from "../config/albumsConfig";
import type { Album, AlbumConfig, Photo, PhotoConfig } from "../types/albums";

const fileNameFromUrl = (src: string) => {
	try {
		const u = new URL(src);
		return u.pathname.split("/").filter(Boolean).pop() ?? "";
	} catch {
		// 非 URL（本地路径）
		return src.split("/").filter(Boolean).pop() ?? "";
	}
};

const stripExt = (name: string) => name.replace(/\.[a-z0-9]+$/i, "");

const normalizePhoto = (p: PhotoConfig, index: number): Photo => {
	if (typeof p === "string") {
		const base = stripExt(fileNameFromUrl(p)) || `photo-${index + 1}`;
		return { id: base, src: p, thumbnail: p };
	}
	const base = (p.id ?? stripExt(fileNameFromUrl(p.src))) || `photo-${index + 1}`;
	return {
		...p,
		id: base,
		thumbnail: p.thumbnail ?? p.src,
	};
};

const normalizeAlbum = (a: AlbumConfig): Album => {
	const photos = (a.photos ?? []).map(normalizePhoto);
	const cover = a.cover ?? (photos[0]?.src ?? "");
	return {
		id: a.id,
		title: a.title,
		description: a.description,
		cover,
		date: a.date,
		location: a.location,
		tags: a.tags,
		layout: a.layout ?? "masonry",
		photos,
	};
};

/**
 * 从配置文件获取所有相册
 * 相册配置位于 src/config/albumsConfig.ts
 */
export async function scanAlbums(): Promise<Album[]> {
	// 从配置文件读取相册数据
	const albums = albumsConfig.map(normalizeAlbum);

	// 按日期倒序排序相册
	albums.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return albums;
}

/**
 * 获取单个相册详情
 */
export async function getAlbum(id: string): Promise<Album | null> {
	const albums = await scanAlbums();
	return albums.find(album => album.id === id) || null;
}

