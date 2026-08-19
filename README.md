## Firefly 修改自用版, 原项目：[https://github.com/CuteLeaf/Firefly](https://github.com/CuteLeaf/Firefly)
[![Netlify Status](https://api.netlify.com/api/v1/badges/960d4c9f-098f-4174-a712-d0d6ee12d8bc/deploy-status)](https://app.netlify.com/projects/louaq/deploys)


<p align="center">
  <a href="https://louaq.com">
    <img src="https://pic1.imgdb.cn/i/0349qHhT4zzSFKBScTUplb.png" alt="站点首页预览" width="880">
  </a>
</p>

<p align="center">
  <a href="https://louaq.com"><b>在线预览 →</b></a>
</p>

基于 [Firefly](https://github.com/CuteLeaf/Firefly) 主题二次开发的个人博客，专注于多模态医学图像分析领域的论文阅读笔记与技术分享。使用 [Astro](https://astro.build) 构建，站点内容全部为静态生成。

## 预览

<table>
  <tr>
    <td width="50%" align="center">
      <img src="https://pic1.imgdb.cn/i/0349qHhT4zzSFKBScTUplb.png" alt="首页"><br>
      <sub><b>首页 · 深色</b>｜一键明暗切换</sub>
    </td>
    <td width="50%" align="center">
      <img src="https://pic1.imgdb.cn/i/0349qJEKFNIPN5WZBmEuT3.webp" alt="文章页"><br>
      <sub><b>文章页</b>｜右侧目录、字数与阅读时长</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="https://pic1.imgdb.cn/i/0349qKLQauRSz9PK54K5uA.png" alt="归档页"><br>
      <sub><b>归档页</b>｜按年份时间线，支持标签 / 分类筛选</sub>
    </td>
    <td width="50%" align="center">
      <img src="https://pic1.imgdb.cn/i/0349qKoR6W8JK2l3rc1O1r.png" alt="追番 / 观影清单"><br>
      <sub><b>追番 / 观影清单</b>｜评分、观看状态与分类</sub>
    </td>
  </tr>
</table>

## 特性

- 📝 Markdown / MDX 写作，支持数学公式（KaTeX）、Mermaid 图表、代码高亮（Expressive Code）、GitHub 卡片、PDF 内嵌等自定义指令
- 🔍 站内搜索，可切换 Algolia / Meilisearch
- 💬 Twikoo 评论系统
- 🌗 明暗主题切换
- 🏷️ 分类、标签、归档、RSS 订阅、站点地图
- 🔐 文章密码保护
- 🎬 追番/观影清单、友链、赞助、留言板等可选页面
- 🌐 多语言界面（简体中文 / 繁体中文 / English / 日本語 / Русский）
- ⚡ 页面过渡动画（Swup）及性能优化（图片懒加载、字体子集化等）

## 技术栈

[Astro](https://astro.build) 7 · [Svelte](https://svelte.dev) 5 · [Tailwind CSS](https://tailwindcss.com) 4 · TypeScript · pnpm

## 快速开始

环境要求：Node.js ≥ 22，pnpm（`preinstall` 已强制要求使用 pnpm，版本见 `package.json` 的 `packageManager` 字段）。

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产环境静态站点（输出到 dist/）
pnpm build

# 本地预览构建产物
pnpm preview
```

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产环境静态站点 |
| `pnpm build:algolia` | 构建并触发 Algolia 索引相关流程（CI 使用） |
| `pnpm preview` | 本地预览构建产物 |
| `pnpm check` | Astro 类型/内容检查 |
| `pnpm type-check` | TypeScript 类型检查 |
| `pnpm format` | 使用 Biome 格式化代码 |
| `pnpm lint` | 使用 Biome 检查并修复代码 |
| `pnpm new-post -- <文件名>` | 创建带 front-matter 的新文章 |
| `pnpm subset-font` | 重新扫描全站用字并子集化正文字体（新增生僻字后需要重跑） |

## 部署

- **GitHub Pages**：`.github/workflows/deploy.yml` 在推送到 `master` 分支时自动构建并部署，如需启用 Algolia / Meilisearch 索引同步，需在仓库 Secrets 中配置相应变量。
- **Netlify / Vercel**：仓库已包含 `vercel.json`；Netlify 部署状态见文首徽章。两者均可直接托管构建产物 `dist/`。

## 目录结构（节选）

```
src/
├── components/   # UI 组件
├── config/       # 站点配置（模块化，见 src/config/README.md）
├── content/      # 文章与页面内容（Markdown/MDX）
├── i18n/         # 多语言文案
├── layouts/      # 页面布局
├── pages/        # 路由页面
├── plugins/      # remark/rehype 自定义插件
└── styles/       # 全局样式
scripts/          # 辅助脚本（新建文章、字体子集化等）
public/           # 静态资源
docs/preview/     # README 预览截图
```

站点绝大多数外观与功能开关都集中在 `src/config/` 下，逐文件说明见 [src/config/README.md](src/config/README.md)。

## 贡献

欢迎提交 Issue / PR，提交前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。


## 感谢

参考样式：[Ru-yu Blog](https://www.chichu.chat/)、[ThriveX Blog](https://liuyuyang.net/)

## 许可证

[MIT](LICENSE)
