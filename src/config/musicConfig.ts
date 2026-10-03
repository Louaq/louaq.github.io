// 全站悬浮音乐播放器配置（左下角，swup 换页不中断）
// 数据来自自建的 NeteaseCloudMusicApi Enhanced
export const musicConfig = {
	enable: true, // 播放器开关
	// 同源路径：openresty 把 /ncm/ 反代到内网 API 容器（只放行歌单与取链两个接口），浏览器不跨域、不接触签名密钥
	api: "/ncm",
	// 网易云歌单 ID（分享链接里的 id 参数），按顺序合并成一个播放列表
	playlists: ["2321957752"],
};
