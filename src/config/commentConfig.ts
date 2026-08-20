import type { CommentConfig } from "../types/config";

export const commentConfig: CommentConfig = {
	type: "none", // 当前启用的评论系统类型: none, twikoo，默认为none，即不启用评论系统。
	//twikoo评论系统配置
	twikoo: {
		envId: "https://twikoo.louaq.com",
		lang: "zh-CN", // 设置 Twikoo 评论系统语言
		visitorCount: true, // 文章访问量统计功能。
	},
};
