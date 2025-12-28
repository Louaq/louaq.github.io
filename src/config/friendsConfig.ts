import type { FriendLink } from "../types/config";

// 可以在src/content/spec/friends.md中编写友链页面下方的自定义内容

// 友链配置
export const friendsConfig: FriendLink[] = [
  {
    title: "夏叶",
    imgurl:
      "https://q1.qlogo.cn/g?b=qq&nk=7618557&s=640",
    desc: "飞萤之火自无梦的长夜亮起，绽放在终竟的明天。",
    siteurl: "https://blog.cuteleaf.cn",
    tags: ["Blog"],
    weight: 10, // 权重，数字越大排序越靠前
    enabled: true, // 是否启用
  },
  {
    title: "聚合图床",
    imgurl:
      "https://www.superbed.cn/favicon.ico",
    desc: "免费图片上传",
    siteurl: "https://www.superbed.cn/",
    tags: ["image"],
    weight: 9, // 权重，数字越大排序越靠前
    enabled: true, // 是否启用
  },
  {
    title: "最美博客",
    imgurl:
      "https://s1.ax1x.com/2022/11/10/z9E7X4.jpg",
    desc: "这是一个 Vue2 Vue3 与 SpringBoot 结合的产物",
    siteurl: "https://poetize.cn/",
    tags: ["zuimei"],
    weight: 8, // 权重，数字越大排序越靠前
    enabled: true, // 是否启用
  },
];

// 获取启用的友链并按权重排序
export const getEnabledFriends = (): FriendLink[] => {
	return friendsConfig
		.filter((friend) => friend.enabled)
		.sort((a, b) => b.weight - a.weight); // 按权重降序排序
};
