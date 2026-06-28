import type { ProfileConfig } from "../types/config";

export const profileConfig: ProfileConfig = {
  // 本地优化版（256×256 webp, 16.5KB）。原图床为 2.3MB PNG、每页加载，显示仅 64px。
  // 原始外链备份：https://pic1.imgdb.cn/item/6a28b506edae85a628525712.webp
  avatar: "/assets/images/avatar.webp",
  /** 侧栏 Profile 头图，可改成本地 / 任意图床 */
  // 本地优化版（640px webp, 22KB，原图床 163KB，显示约 320×104）。
  // 原始外链备份：https://pic1.imgdb.cn/item/6a291954eae595505fc16265.webp
  cover: "/assets/images/profile-cover.webp",
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
    // {
    //   name: "Bilibli",
    //   icon: "fa6-brands:bilibili",
    //   url: "https://space.bilibili.com/397523112",
    // },
    // {
    //   name: "GitHub",
    //   icon: "fa6-brands:github",
    //   url: "https://github.com/Louaq",
    // },
    {
      name: "RSS",
      icon: "fa6-solid:rss",
      url: "/rss.xml",
    },
    {
			name: "虫洞",
			url: "https://foreverblog.cn/go.html",
			icon: "material-symbols:subway-rounded",
		}
  ],
};
