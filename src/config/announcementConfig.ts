import type { AnnouncementConfig } from "../types/config";

export const announcementConfig: AnnouncementConfig = {
  title: "重要提醒",
  content: "暑假开始",
  closable: false, // 重要提醒不可关闭
  link: {
    enable: false, // 不需要链接
    text: "",
    url: "",
    external: false,
  }, 
};
