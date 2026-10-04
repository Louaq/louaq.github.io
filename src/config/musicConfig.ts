// 左侧边栏音乐播放器配置（开关在 sidebarConfig 的 music 组件，swup 换页不中断）
// 数据来自自建曲库 own-music-api（网易云兼容接口），歌单 music.json 由服务器上的 scan.mjs 生成
export const musicConfig = {
	// 同源路径：openresty 把 /ncm/ 反代到内网 API 容器（只放行歌单与取链两个接口），浏览器不跨域、不接触签名密钥
	api: "/ncm",
};
