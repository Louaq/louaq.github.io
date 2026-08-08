import { friendSiteInfo } from "@/config";

// 「申请友链」弹窗的文案。属于弹窗自身的内容，与 friendsConfig.ts 里的友链数据无关。

// 申请流程的步骤说明
export const applySteps: { title: string; desc: string }[] = [
	{
		title: "添加本站友链",
		desc: "请先在您的网站友链页面添加本站信息，可直接复制页面上方「本站信息」卡片中的各字段",
	},
	{
		title: "邮箱申请",
		desc: `申请模板，把内容复制修改后发送到邮箱：${friendSiteInfo.email}`,
	},
	{
		title: "等待审核",
		desc: "确认信息无误后会尽快添加您的友链",
	},
];

// 申请邮件的复制模板，展示在第 2 步下方
export const applyEmailTemplate =
	"站点名称：您的站点名称\n站点描述：您的站点描述\n站点链接：您的站点链接\n头像链接：您的站点头像";

// 「注意事项」列表
export const applyNotes: { title: string; content: string }[] = [
	{
		title: "互换原则",
		content: "请先将本站添加到您的友链页面，确认后会添加您的友链",
	},
	{ title: "链接维护", content: "友链网站长期无法访问或内容违规，将会被移除" },
	{
		title: "内容要求",
		content: "内容积极向上，不含有任何含色情/反动/暴力等违法违规内容",
	},
	{
		title: "站点要求",
		content: "支持 HTTPS，以原创内容为主，能够正常访问且有持续更新",
	},
];
