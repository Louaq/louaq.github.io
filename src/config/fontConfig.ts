// 字体配置
//
// 架构（务实迁移 + 保留 CDN）：
// - 正文字体（body）：HarmonyOS Regular，体积大的中文字体，继续走 B 站 CDN
//   托管，由 FontSetup.astro 以 @font-face 形式加载。
// - 代码字体（code）：JetBrains Mono，通过 Astro Font API（fontsource provider）
//   自托管 + 子集化，由 astro.config.mjs 的 `fonts` 与 <Font /> 组件统一管理。
// - og：OpenGraph 图片由 satori 服务端渲染，需要原始字体 buffer，独立于浏览器
//   字体加载，保持原样。
export const fontConfig = {
	// 是否启用自定义字体功能
	enable: true,
	// 是否预加载正文字体文件
	preload: true,

	// 正文字体（CJK，体积大，保留 CDN 托管，不走 Astro Font API 自托管）
	body: {
		name: "HarmonyOS Regular",
		family: "HarmonyOS_Regular",
		// 华为鸿蒙字体 - HarmonyOS_Regular（B站 CDN 直接 woff2）
		src: "https://s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ao.woff2",
		format: "woff2" as const,
		display: "swap" as const,
	},

	// 代码字体（通过 Astro Font API 自托管 + 子集化）
	// astro.config.mjs 据此构建 `fonts` 条目，组件通过 cssVariable 引用。
	code: {
		// astro:assets <Font /> 注入的 CSS 变量名
		cssVariable: "--font-jetbrains-mono",
		// 与 fontsource 家族名一致（fontsource provider 据此匹配）
		family: "JetBrains Mono",
		// 变量字体的字重范围（仅 normal，保持与原 fontsource 导入一致）
		weights: ["100 800"] as [string, ...string[]],
		styles: ["normal"] as ["normal"],
		subsets: ["latin"] as [string, ...string[]],
		// 注入到 --font-jetbrains-mono 的回退序列（不含 JetBrains Mono 本身）
		fallbacks: [
			"ui-monospace",
			"SFMono-Regular",
			"Menlo",
			"Monaco",
			"Consolas",
			"Liberation Mono",
			"Courier New",
			"monospace",
		],
	},

	// 全局字体回退（与 font-family 中顺序一致，含空格的名称需带引号）
	fallback: [
		"-apple-system",
		"BlinkMacSystemFont",
		'"PingFang SC"',
		'"Hiragino Sans GB"',
		'"Microsoft YaHei"',
		'"Segoe UI"',
		'"Roboto"',
		'"Helvetica Neue"',
		"Helvetica",
		"Arial",
		"sans-serif",
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	],

	// OpenGraph 图片字体配置
	og: {
		family: "Noto Sans SC",
		cssUrl:
			"https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap",
		weights: {
			regular: 400,
			bold: 700,
		},
		fallback: [
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Roboto",
			'"Helvetica Neue"',
			"Arial",
			"sans-serif",
		],
	},
};
