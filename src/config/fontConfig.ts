// 字体配置
//
// 架构（务实迁移 + 保留 CDN）：
// - 正文字体（body）：霞鹜文楷 LXGW WenKai Regular，本地字体文件
//   （public/font/），由 FontSetup.astro 以 @font-face 形式加载。
// - 代码字体（code）：JetBrains Mono，通过 Astro Font API（fontsource provider）
//   自托管 + 子集化，由 astro.config.mjs 的 `fonts` 与 <Font /> 组件统一管理。
// - og：OpenGraph 图片由 satori 服务端渲染，需要原始字体 buffer，独立于浏览器
//   字体加载，保持原样。
export const fontConfig = {
	// 是否启用自定义字体功能
	enable: true,
	// 是否预加载代码字体（正文字体已切片，整包预加载无意义，见 body）
	preload: true,

	// 正文字体（CJK，本地文件托管，不走 Astro Font API 自托管）
	//
	// 两级处理，缺一不可：
	// 1. `pnpm subset-font`：19.3MB 原始 TTF → 按全站实际用字子集化 → ~454KB woff2
	// 2. `pnpm split-font`：再把这 454KB 按 unicode-range 切成 40+ 个分片
	//
	// 只做第 1 步的话每个访客首屏都要下完整的 454KB（woff2 已压缩，gzip/brotli
	// 再压不动）；切片后浏览器只取当前页面命中的那十几片。
	//
	// 页面引用的是切片产物的 CSS（`css` 字段），单文件 woff2 只作为 split-font
	// 的输入保留在仓库里，不再被任何页面加载。
	// 新增文章若用到子集里没有的生僻字，会优雅回退到 fallback 里的系统字体
	// （不会破版），依次重跑上面两个命令即可补齐。
	body: {
		name: "LXGW WenKai Regular",
		family: "LXGWWenKai_Regular",
		/** cn-font-split 生成的分片样式表，含全部 @font-face + unicode-range */
		css: "/font/lxgw/result.css",
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
