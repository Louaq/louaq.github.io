import type { FooterConfig } from "../types/config";

export const footerConfig: FooterConfig = {
	enable: true, // 是否启用Footer HTML注入功能

	// 页脚访客计数（Vercount：免注册，接口与不蒜子兼容）
	visitorCount: {
		enable: true, // 是否显示访客计数
		apiUrl: "https://events.vercount.one/api/v2/log", // 统计接口地址
		showSitePv: true, // 全站访问量
		showSiteUv: true, // 全站访客数
	},
};

// 直接编辑 config/FooterConfig.html 文件来添加备案号等自定义内容
