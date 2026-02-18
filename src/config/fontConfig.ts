// 字体配置
export const fontConfig = {
	// 是否启用自定义字体功能
	enable: true,
	// 是否预加载字体文件
	preload: true,
	// 当前选择的字体，支持多个字体组合
	selected: ["jetbrains-mono-nl", "noto-serif-sc"],

	// 字体列表
	fonts: {
		// 系统字体
		system: {
			id: "system",
			name: "系统字体",
			src: "", // 系统字体无需 src
			family:
				"system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
		},

		// Google Fonts - JetBrains Mono（页面中显示为 JetBrains Mono NL，与 Google 提供的 family 名一致）
		"jetbrains-mono-nl": {
			id: "jetbrains-mono-nl",
			name: "JetBrains Mono NL",
			src: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap",
			family: "JetBrains Mono",
			display: "swap" as const,
		},

		// Google Fonts - Noto Serif SC
		"noto-serif-sc": {
			id: "noto-serif-sc",
			name: "Noto Serif SC",
			src: "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200..900&display=swap",
			family: "Noto Serif SC",
			display: "swap" as const,
		},

		// Google Fonts - Zen Maru Gothic
		"zen-maru-gothic": {
			id: "zen-maru-gothic",
			name: "Zen Maru Gothic",
			src: "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@300;400;500;700;900&display=swap",
			family: "Zen Maru Gothic",
			display: "swap" as const,
		},

		// Google Fonts - Inter
		inter: {
			id: "inter",
			name: "Inter",
			src: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
			family: "Inter",
			display: "swap" as const,
		},

		// 小米字体 - MiSans Normal
		"misans-normal": {
			id: "misans-normal",
			name: "MiSans Normal",
			src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Normal.min.css",
			family: "MiSans",
			weight: 400,
			display: "swap" as const,
		},

		// 小米字体 - MiSans Semibold
		"misans-semibold": {
			id: "misans-semibold",
			name: "MiSans Semibold",
			src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Semibold.min.css",
			family: "MiSans",
			weight: 600,
			display: "swap" as const,
		},
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
};
