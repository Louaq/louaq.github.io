import type { ProfileConfig } from "../types/config";

export const profileConfig: ProfileConfig = {
  avatar: "https://pic1.imgdb.cn/item/6919c42d3203f7be000aeabc.jpg",
  name: "Louaq",
  bio: "Hello, I'm Louaq.",
  links: [
    {
      name: "Email",
      icon: "mdi:email",
      url: "mailto:yang_syy@qq.com",
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
		  },
  ],
};
