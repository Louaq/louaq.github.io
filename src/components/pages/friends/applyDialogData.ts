import { friendSiteInfo } from "@/config";

// 「申请友链」弹窗的文案。属于弹窗自身的内容，与 friendsConfig.ts 里的友链数据无关。
// 弹窗要求一屏放下不滚动，所以文案尽量短。

// 申请流程的步骤说明（横向三步展示，描述控制在两三行内）
export const applySteps: { title: string; desc: string }[] = [
	{
		title: "添加本站友链",
		desc: "复制页面上方「本站信息」卡片中的字段，添加到您的友链页面",
	},
	{
		title: "邮箱申请",
		desc: "复制下方模板，填好信息后发送到本站邮箱",
	},
	{
		title: "等待审核",
		desc: "确认信息无误后会尽快添加您的友链",
	},
];

// 「申请模板」区块中可一键复制的两个字段
export const applyEmail = friendSiteInfo.email;
export const applyEmailTemplate =
	"站点名称：您的站点名称\n站点描述：您的站点描述\n站点链接：您的站点链接\n头像链接：您的站点头像";
