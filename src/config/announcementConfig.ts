import type { AnnouncementConfig } from "../types/config";

export const announcementConfig: AnnouncementConfig = {
  title: "重要提醒",
  content: "网站将于今晚 22:00-24:00 进行维护，期间可能无法访问。",
  closable: false, // 重要提醒不可关闭
  link: {
    enable: false, // 不需要链接
    text: "",
    url: "",
    external: false,
  },
};