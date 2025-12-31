import type { AlbumConfig } from "../types/albums";

/**
 * 相册配置
 * 
 * 使用说明：
 * 1. 图片文件放在 public/albums/相册ID/ 目录下（或使用外部链接）
 * 2. 在此文件中配置相册信息和照片元数据
 * 3. layout 可选：masonry（瀑布流，默认）或 grid（网格）
 * 4. photos 支持简写：直接写图片地址数组，如 ["url1.jpg", "url2.jpg"]
 */

export const albumsConfig: AlbumConfig[] = [
	{
		id: "album",
		title: "相册",
		description: "blog封面",
		cover: "https://pic1.imgdb.cn/item/6919c4403203f7be000aeb20.jpg", // 封面图片路径
		date: "2025-12-31",
		location: "武汉",
		tags: ["blog", "动漫"],
		layout: "masonry", // 布局：masonry=瀑布流（默认）, grid=网格
		photos: [
			{
				id: "photo1",
				src: "https://pic1.imgdb.cn/item/6919c4403203f7be000aeb20.jpg",
			},
			{
				id: "photo2",
				src: "https://pic1.imgdb.cn/item/6919c43e3203f7be000aeb19.jpg",

			},
			{
				id: "photo3",
				src: "https://pic1.imgdb.cn/item/6919c43f3203f7be000aeb1e.jpg",
			},
			{
				id: "photo4",
				src: "https://pic1.imgdb.cn/item/6919c43f3203f7be000aeb1b.jpg",
			},
			{
				id: "photo5",
				src: "https://pic1.imgdb.cn/item/6919c43d3203f7be000aeb14.jpg",
			},
			{
				id: "photo6",
				src: "https://pic1.imgdb.cn/item/6919c43d3203f7be000aeb16.jpg",
			},
			{
				id: "photo7",
				src: "https://pic1.imgdb.cn/item/6919c43e3203f7be000aeb17.jpg",
			},
			{
				id: "photo8",
				src: "https://pic1.imgdb.cn/item/6919c43c3203f7be000aeb0f.jpg",
			},
			{
				id: "photo9",
				src: "https://pic1.imgdb.cn/item/6919c43d3203f7be000aeb10.jpg",
			},
			{
				id: "photo10",
				src: "https://pic1.imgdb.cn/item/6919c43d3203f7be000aeb12.png",
			},
		],
	},
	// 添加更多相册...
	{
		id: "wallpaper",
		title: "壁纸",
		description: "壁纸",
		cover: "https://pic1.imgdb.cn/item/6919c4273203f7be000aea80.jpg",
		date: "2025-12-31",
		location: "武汉",
		tags: ["壁纸", "动漫"],
		layout: "grid", // 使用网格布局
		photos: [
			// 简写方式：直接写图片地址
			"https://pic1.imgdb.cn/item/6919c4393203f7be000aeb07.jpg",
			"https://pic1.imgdb.cn/item/6919c43a3203f7be000aeb0a.jpg",
			"https://pic1.imgdb.cn/item/6919c43a3203f7be000aeb08.jpg",
			"https://pic1.imgdb.cn/item/6919c4383203f7be000aeaff.jpg",
			"https://pic1.imgdb.cn/item/6919c4393203f7be000aeb00.jpg",
			"https://pic1.imgdb.cn/item/6919c4393203f7be000aeb01.jpg",
			"https://pic1.imgdb.cn/item/6919c42b3203f7be000aeaac.jpg",
			"https://pic1.imgdb.cn/item/6919c4273203f7be000aea80.jpg",
		],
	},
];

