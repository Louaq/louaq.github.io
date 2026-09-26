import type { AdConfig, AdItem, AdPlacementName } from "../types/config";

export const adConfig: AdConfig = {
	// 总开关：关闭后两个位置都不渲染
	enable: true,

	// 默认横幅宽高比，按素材实际尺寸填写（宽 / 高）；各位置可单独覆盖
	aspectRatio: "350 / 60",

	// 文章正文上方
	top: {
		enable: true,
		items: [
			{
				// 唯一标识；顶部与底部配成同一个 id 时，关掉一处另一处也一起消失
				id: "banner-1",
				// 是否启用该条
				enable: true,
				// 横幅图片：/ 开头为 public 下的站内资源，也可直接填外链
				image: "https://pic1.imgdb.cn/i/034FQFr5RDbiAbVdF8hcW1.gif",
				// 图片描述（无障碍与图片加载失败时显示）
				alt: "广告横幅",
				// 点击跳转地址
				link: "https://www.onesproxy.com/?user_source=1&invite_code=HLY74977",
				// 没有 image 时占位块上的文字，留空用「广告」；填了 image 则不生效
				// placeholderText: "广告位",
				// 是否在新标签页打开
				external: true,
				// 左上角是否显示「关闭」按钮
				closable: true,
				// 右上角标记文案，留空用「广告」
				label: "广告",
			},
			{
				// 唯一标识；顶部与底部配成同一个 id 时，关掉一处另一处也一起消失
				id: "banner-2",
				// 是否启用该条
				enable: true,
				// 横幅图片：/ 开头为 public 下的站内资源，也可直接填外链
				image: "https://pic1.imgdb.cn/i/034FQGE2wHXXEYRCq3SghB.gif",
				// 图片描述（无障碍与图片加载失败时显示）
				alt: "广告横幅",
				// 点击跳转地址
				link: "https://linkstatic.com/?kwd=lqd-pingo",
				// 没有 image 时占位块上的文字，留空用「广告」；填了 image 则不生效
				// placeholderText: "广告位",
				// 是否在新标签页打开
				external: true,
				// 左上角是否显示「关闭」按钮
				closable: true,
				// 右上角标记文案，留空用「广告」
				label: "广告",
			},
			{
				// 唯一标识；顶部与底部配成同一个 id 时，关掉一处另一处也一起消失
				id: "banner-3",
				// 是否启用该条
				enable: true,
				// 横幅图片：/ 开头为 public 下的站内资源，也可直接填外链
				image: "https://pic1.imgdb.cn/i/034FQGqal51eVmyA4QHaCS.gif",
				// 图片描述（无障碍与图片加载失败时显示）
				alt: "广告横幅",
				// 点击跳转地址
				link: "https://www.proxy-cheap.com/cn/?utm_source=ping0cc&utm_medium=banner&utm_campaign=display_ads",
				// 没有 image 时占位块上的文字，留空用「广告」；填了 image 则不生效
				// placeholderText: "广告位",
				// 是否在新标签页打开
				external: true,
				// 左上角是否显示「关闭」按钮
				closable: true,
				// 右上角标记文案，留空用「广告」
				label: "广告",
			},
		],
	},

	// 文章正文下方（版权声明之后）
	bottom: {
		enable: true,

		// 该位置若用不同尺寸的素材，在这里单独写宽高比即可
		// aspectRatio: "728 / 90",
		items: [
			{
				// 唯一标识；顶部与底部配成同一个 id 时，关掉一处另一处也一起消失
				id: "bottom-1",
				// 是否启用该条
				enable: true,
				// 横幅图片：/ 开头为 public 下的站内资源，也可直接填外链
				image: "https://pic1.imgdb.cn/i/034FQIgm9akNXeWogg97gw.gif",
				// 图片描述（无障碍与图片加载失败时显示）
				alt: "广告横幅",
				// 点击跳转地址
				link: "https://bestproxy.com/?keyword=ihoa1wt1",
				// 没有 image 时占位块上的文字，留空用「广告」；填了 image 则不生效
				// placeholderText: "广告位",
				// 是否在新标签页打开
				external: true,
				// 左上角是否显示「关闭」按钮
				closable: true,
				// 右上角标记文案，留空用「广告」
				label: "广告",
			},
			{
				// 唯一标识；顶部与底部配成同一个 id 时，关掉一处另一处也一起消失
				id: "bottom-2",
				// 是否启用该条
				enable: true,
				// 横幅图片：/ 开头为 public 下的站内资源，也可直接填外链
				image: "https://pic1.imgdb.cn/i/034FQJE23MJ1xb0zwSF69y.gif",
				// 图片描述（无障碍与图片加载失败时显示）
				alt: "广告横幅",
				// 点击跳转地址
				link: "https://www.vircs.com/promotion?code=4",
				// 没有 image 时占位块上的文字，留空用「广告」；填了 image 则不生效
				// placeholderText: "广告位",
				// 是否在新标签页打开
				external: true,
				// 左上角是否显示「关闭」按钮
				closable: true,
				// 右上角标记文案，留空用「广告」
				label: "广告",
			},
			{
				// 唯一标识；顶部与底部配成同一个 id 时，关掉一处另一处也一起消失
				id: "bottom-3",
				// 是否启用该条
				enable: true,
				// 横幅图片：/ 开头为 public 下的站内资源，也可直接填外链
				image: "https://pic1.imgdb.cn/i/034FQJifkC3XyLdsWSsiZm.gif",
				// 图片描述（无障碍与图片加载失败时显示）
				alt: "广告横幅",
				// 点击跳转地址
				link: "https://www.nsocks.com/?keyword=0suirfse",
				// 没有 image 时占位块上的文字，留空用「广告」；填了 image 则不生效
				// placeholderText: "广告位",
				// 是否在新标签页打开
				external: true,
				// 左上角是否显示「关闭」按钮
				closable: true,
				// 右上角标记文案，留空用「广告」
				label: "广告",
			},
		],
	},
};

export function getActiveAdItems(placement: AdPlacementName): AdItem[] {
	const group = adConfig[placement];
	if (!adConfig.enable || !group.enable) {
		return [];
	}

	const now = new Date();
	return group.items.filter((item) => {
		if (!item.enable) {
			return false;
		}
		return !(item.expireDate && now > new Date(item.expireDate));
	});
}

export function getAdAspectRatio(placement: AdPlacementName): string {
	return adConfig[placement].aspectRatio || adConfig.aspectRatio || "350 / 60";
}
