// 相册配置：按顺序平铺，src 填图床/CDN 外链
export type AlbumPhoto = {
	src: string; // 图片 URL
	alt?: string; // 图片描述（无障碍与图片加载失败时显示）
};

// 每页显示张数（桌面 4 列、手机 2 列，取 4 的倍数可让每页排满整行）
export const albumItemsPerPage = 12;

export const albumPhotos: AlbumPhoto[] = [
	{ src: "https://pic1.imgdb.cn/i/5v95fu9MVuN6nl6pngnRE1.jpg", alt: "天空与电线杆" },
	{ src: "https://pic1.imgdb.cn/i/1mN0SFLntnFm1qoz1Rc8uY.jpg", alt: "天空与电线杆" },
	{ src: "https://pic1.imgdb.cn/i/2MVWmt2GKFiRJD5dAEGNGX.png", alt: "天空与电线杆" },
	{ src: "https://pic1.imgdb.cn/i/033r1XwNUbgTLe4lO7cO1o.jpg", alt: "天空与电线杆" },
	{ src: "https://pic1.imgdb.cn/i/033r1XwmpoE3Gbv4LfKsCv.jpg", alt: "天空与电线杆" },
	{ src: "https://pic1.imgdb.cn/i/033r1XwvuAzjABPhHjDnze.jpg", alt: "天空与电线杆" },
	{ src: "https://pic1.imgdb.cn/i/7IiyvZZ1yjeCsAipLdiiUj.png", alt: "天空与电线杆" },
	{ src: "https://pic1.imgdb.cn/i/5BBgnRCAzYGPUK7MHaFfWo.png", alt: "天空与电线杆" },
	{ src: "https://pic1.imgdb.cn/i/4v5h1uhGP4xpz0v9ShjWhQ.png", alt: "天空与电线杆" },
	{ src: "https://pic1.imgdb.cn/i/034ZMknGevJT4oWECLatyW.png", alt: "天空与电线杆" },
	{ src: "https://pic1.imgdb.cn/i/034ZMknZxf8zzi9N9j4ODy.jpg", alt: "天空与电线杆" },
	{ src: "https://pic1.imgdb.cn/i/034ZMl0KiRv7NeaW5Rp5U3.png", alt: "天空与电线杆" },
	{ src: "https://pic1.imgdb.cn/i/034ZNXucDQ7W8ywH9ZrrrC.webp", alt: "天空与电线杆" },
	{ src: "https://pic1.imgdb.cn/i/034ZNXV1j7FrOPsXhA8ARN.webp", alt: "天空与电线杆" },
	{ src: "https://pic1.imgdb.cn/i/034ZNXUrCe6F9ALU9g8iep.webp", alt: "天空与电线杆" },
	{ src: "https://pic1.imgdb.cn/i/034ZNXUeWmwe2uofgnR6qn.webp", alt: "天空与电线杆" },
];
