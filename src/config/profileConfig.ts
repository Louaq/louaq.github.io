import type { ProfileConfig } from "../types/config";

export const profileConfig: ProfileConfig = {
  avatar: "https://pic1.imgdb.cn/item/6919c42d3203f7be000aeabc.webp",
  name: "Louaq",
  bio: "晚来天欲雪,能饮一杯无",
  /** 掘金式等级角标，不需要可删或设为空 */
  level: "LV.5",
  badges: [
    {
      text: "优秀作者",
      href: "/about/",
      icon: "fa6-solid:crown",
    },
  ],
  /** 文章数为真实 posts 篇数；阅读、粉丝为固定展示文案（自行修改 value） */
  stats: [
    { label: "文章", valueMode: "postCount", href: "/archive/" },
    { label: "阅读", value: "2k" },
    { label: "粉丝", value: "1.3k" },
  ],
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
      name: "RSS",
      icon: "fa6-solid:rss",
      url: "/rss.xml",
    },
    {
			name: "开往",
			url: "https://www.travellings.cn/go.html",
			icon: "material-symbols:subway-rounded",
		}
  ],
};
