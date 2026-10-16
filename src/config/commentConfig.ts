import type { CommentConfig } from "../types/config";

export const commentConfig: CommentConfig = {
	type: "twikoo", // 当前启用的评论系统类型: none, twikoo，默认为none，即不启用评论系统。
	//twikoo评论系统配置
	twikoo: {
		envId: "https://twikoo.louaq.com",
		lang: "zh-CN", // 设置 Twikoo 评论系统语言
		visitorCount: false, // 文章浏览量改由 Vercount 统计。
	},
};
