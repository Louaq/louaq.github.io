import type { ProfileConfig } from "../types/config";

export const profileConfig: ProfileConfig = {
  avatar: "https://pic1.imgdb.cn/item/6919c42d3203f7be000aeabc.webp",
  /** 侧栏 Profile 头图，可改成本地 / 任意图床 */
  cover:
    "https://pic1.imgdb.cn/item/69ed731cde2d74e282b73f88.webp",
  verified: true,
  menuHref: "/about/",
  name: "Louaq",
  bio: "晚来天欲雪,能饮一杯无",
  /** 掘金式等级角标，不需要可删或设为空 */
  level: "LV.5",
  links: [
    {
      name: "Email",
      icon: "mdi:email",
      url: "mailto:astroal@qq.com",
    },
    {
      name: "Bilibli",
      icon: "fa6-brands:bilibili",
      url: "https://space.bilibili.com/397523112",
    },
    {
      name: "GitHub",
      icon: "fa6-brands:github",
      url: "https://github.com/Louaq",
    },
    {
			name: "开往",
			url: "https://www.travellings.cn/go.html",
			icon: "material-symbols:subway-rounded",
		},
    {
      name: "RSS",
      icon: "fa6-solid:rss",
      url: "/rss.xml",
    }
  ],
};
