export type PhotoConfig =
	| string
	| {
			/** 可选：不填会自动根据 src 推导 */
			id?: string;
			/** 必需：图片地址（支持 /albums/... 本地路径 或 https://... 外链） */
			src: string;
			/** 可选：不填默认使用 src */
			thumbnail?: string;
			title?: string;
			description?: string;
			date?: string;
			location?: string;
			tags?: string[];
			width?: number;
			height?: number;
	  };

export type AlbumConfig = {
	id: string;
	title: string;
	description?: string;
	/** 可选：不填默认用第一张照片作为封面 */
	cover?: string;
	date: string;
	location?: string;
	tags?: string[];
	/** 可选：布局模式，masonry=瀑布流（默认），grid=网格 */
	layout?: "masonry" | "grid";
	/** 只写图片地址也可以：["https://.../1.jpg","https://.../2.jpg"] */
	photos: PhotoConfig[];
};

export type Photo = {
	id: string;
	src: string;
	thumbnail?: string;
	title?: string;
	description?: string;
	date?: string;
	location?: string;
	tags?: string[];
	width?: number;
	height?: number;
};

export type Album = {
	id: string;
	title: string;
	description?: string;
	cover: string;
	date: string;
	location?: string;
	tags?: string[];
	layout: "masonry" | "grid";
	photos: Photo[];
};


