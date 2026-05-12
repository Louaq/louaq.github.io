import type { AnnouncementConfig } from "../types/config";

export const announcementConfig: AnnouncementConfig = {
  title: "重要提醒",
  content: "ACM MM 2026审稿截至时间16 May 2026, 19:59 China Standard Time",
  closable: false, // 重要提醒不可关闭
  link: {
    enable: false, // 不需要链接
    text: "",
    url: "",
    external: false,
  },
};
