import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import swup from "@swup/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import katex from "katex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components"; /* Render the custom directive content */
import rehypeKatex from "rehype-katex";
import "katex/dist/contrib/mhchem.mjs"; // 加载 mhchem 扩展
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import { pluginCollapsible } from "expressive-code-collapsible"; /* Collapsible */
import rehypeCallouts from "rehype-callouts";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive"; /* Handle directives */
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import {
	backgroundWallpaper,
	expressiveCodeConfig,
	fontConfig,
	siteConfig,
} from "./src/config";
import I18nKey from "./src/i18n/i18nKey";
import { i18n } from "./src/i18n/translation";
import { pluginHeaderToolbar } from "./src/plugins/expressive-code-header-toolbar.mjs"; /* mac 风格标题栏：把复制/折叠按钮挪进 header */
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { PdfEmbedComponent } from "./src/plugins/rehype-component-pdf-embed.mjs";
import rehypeEmailProtection from "./src/plugins/rehype-email-protection.mjs";
import rehypeExternalLinks from "./src/plugins/rehype-external-links.mjs";
import rehypeFigure from "./src/plugins/rehype-figure.mjs";
import rehypeImageDimensions from "./src/plugins/rehype-image-dimensions.mjs";
import rehypeOssImage from "./src/plugins/rehype-oss-image.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkFirstImage } from "./src/plugins/remark-first-image.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import meilisearch from "./src/utils/meilisearch.ts";

const isDev = process.env.NODE_ENV === "development";
const swupContainers = [
	"#swup-container",
	"#floating-toc-wrapper",
	"#post-toc-floating-layer",
	"#left-sidebar-wrapper",
];
if (backgroundWallpaper.switchable || backgroundWallpaper.mode === "banner") {
	swupContainers.unshift("#banner-wrapper");
}
const collapsibleConfig = expressiveCodeConfig.pluginCollapsible;
const collapsibleOptions =
	collapsibleConfig?.enable === true
		? {
				lineThreshold: collapsibleConfig.lineThreshold ?? 15,
				previewLines: collapsibleConfig.previewLines ?? 8,
				defaultCollapsed: collapsibleConfig.defaultCollapsed ?? true,
				expandButtonText: i18n(I18nKey.codeCollapsibleShowMore),
				collapseButtonText: i18n(I18nKey.codeCollapsibleShowLess),
				expandedAnnouncement: i18n(I18nKey.codeCollapsibleExpanded),
				collapsedAnnouncement: i18n(I18nKey.codeCollapsibleCollapsed),
			}
		: null;
const collapsiblePlugin =
	collapsibleOptions &&
	Object.assign(pluginCollapsible(collapsibleOptions), {
		configDigest: collapsibleOptions,
	});

// https://astro.build/config
export default defineConfig({
	site: siteConfig.site_url,

	base: "/",
	trailingSlash: "always",
	// 代码字体通过 Astro Font API 自托管 + 子集化；正文字体（CJK）保留 CDN，见 FontSetup.astro
	fonts: fontConfig.enable
		? [
				{
					name: fontConfig.code.family,
					cssVariable: fontConfig.code.cssVariable,
					provider: fontProviders.fontsource(),
					weights: fontConfig.code.weights,
					styles: fontConfig.code.styles,
					subsets: fontConfig.code.subsets,
					fallbacks: fontConfig.code.fallbacks,
				},
			]
		: [],
	integrations: [
		swup({
			theme: false,
			animationClass: "transition-swup-", // see https://swup.js.org/options/#animationselector
			// the default value `transition-` cause transition delay
			// when the Tailwind class `transition-all` is used
			containers: swupContainers,
			smoothScrolling: false,
			// 开发模式下 Vite 依赖重优化会导致 swup 预加载/缓存命中旧的 deps，出现 504 (Outdated Optimize Dep)
			cache: !isDev,
			// 本站 HTML 体积较大，hover 预取容易在用户仅经过链接时浪费整页下载。
			preload: false,
			accessibility: true,
			updateHead: true,
			updateBodyClass: false,
			globalInstance: true,
			// @swup/astro 仅合并 data-no-swup 与其「ignore」选项到 ignoreVisit，单独的 ignoreVisit 配置不会生效
			ignore: (url) => {
				try {
					const pathname = new URL(url, "https://swup-ignore.local").pathname;
					return pathname.toLowerCase().endsWith(".xml");
				} catch {
					return false;
				}
			},
			// 滚动相关配置优化
			resolveUrl: (url) => url,
			animateHistoryBrowsing: false,
			skipPopStateHandling: (event) => {
				// 跳过锚点链接的处理，让浏览器原生处理
				return event.state && event.state.url && event.state.url.includes("#");
			},
		}),
		icon({
			include: {
				"fa6-brands": ["alipay", "creative-commons", "weixin"],
				"fa6-regular": ["calendar"],
				"fa6-solid": [
					"arrow-right",
					"arrow-rotate-left",
					"arrow-up-right-from-square",
					"chevron-left",
					"chevron-right",
					"user-shield",
					"xmark",
				],
			},
		}),
		expressiveCode({
			// 默认会把 ec.*.css 以外链形式插在正文第一个代码块前，需二次请求，易出现代码块“先丑后美”的 FOUC
			emitExternalStylesheet: false,
			themes: [expressiveCodeConfig.darkTheme, expressiveCodeConfig.lightTheme],
			useDarkModeMediaQuery: false,
			themeCssSelector: (theme) => `[data-theme='${theme.name}']`,
			plugins: [
				// 语言徽章不用第三方插件：EC 原生就在 <pre> 上输出 data-language，
				// 徽标由 main.css 的 [data-language]::before 绘制，开关见 Layout 的
				// data-language-badge-enabled（源头仍是 expressiveCodeConfig.pluginLanguageBadge.enable）。
				// expressive-code-language-badge@1.1.0 的 peer 为 core ^0.41.3，
				// 在本项目的 core 0.43.1 下 baseStyles 不会被采纳，徽标画不出来。
				pluginLineNumbers(),
				// pluginCollapsible 配置 - 从expressiveCodeConfig读取设置，使用i18n文本
				...(collapsiblePlugin ? [collapsiblePlugin] : []),
				// 必须排在 collapsiblePlugin 之后：把复制/折叠按钮挪进标题栏
				pluginHeaderToolbar(),
			],
			defaultProps: {
				wrap: false,
				overridesByLang: {
					shellsession: {
						showLineNumbers: false,
					},
				},
			},
			styleOverrides: {
				borderRadius: "0.75rem",
				codeFontSize: "13px",
				// 由 Astro Font API 提供（fontsource，自托管 + 子集化），变量已含回退
				codeFontFamily: `var(${fontConfig.code.cssVariable})`,
				codeLineHeight: "1.5rem",
				textMarkers: {
					delHue: 0,
					insHue: 180,
					markHue: 250,
				},
			},
			frames: {
				showCopyToClipboardButton: true,
			},
		}),
		svelte(),
		sitemap({
			filter: (page) => {
				// 根据页面开关配置过滤sitemap
				const url = new URL(page);
				const pathname = url.pathname;
				if (pathname === "/friends/" && !siteConfig.pages.friends) {
					return false;
				}
				if (pathname === "/sponsor/" && !siteConfig.pages.sponsor) {
					return false;
				}
				if (pathname === "/guestbook/" && !siteConfig.pages.guestbook) {
					return false;
				}
				if (pathname === "/bangumi/" && !siteConfig.pages.bangumi) {
					return false;
				}

				return true;
			},
		}),
		mdx(),
		meilisearch(),
	],
	markdown: {
		// Astro 7: 自定义 remark/rehype 流水线改为传入 unified() 处理器，
		// 替代已弃用的 markdown.remarkPlugins / markdown.rehypePlugins
		processor: unified({
			remarkPlugins: [
				remarkMath,
				remarkReadingTime,
				remarkExcerpt,
				remarkFirstImage,
				remarkDirective,
				remarkSectionize,
				parseDirectiveNode,
			],
			rehypePlugins: [
				[rehypeKatex, { katex }],
				[rehypeCallouts, { theme: siteConfig.rehypeCallouts.theme }],
				rehypeSlug,
				// 必须在 rehypeFigure 之前：figure 会复制 img 的 properties
				rehypeOssImage,
				// 必须在 rehypeOssImage 之后（探测 OSS 转码后的最终尺寸）、rehypeFigure 之前
				rehypeImageDimensions,
				rehypeFigure,
				[rehypeExternalLinks, { siteUrl: siteConfig.site_url }],
				[rehypeEmailProtection, { method: "base64" }], // 邮箱保护插件，支持 'base64' 或 'rot13'
				[
					rehypeComponents,
					{
						components: {
							github: GithubCardComponent,
							pdf: PdfEmbedComponent,
						},
					},
				],
				[
					rehypeAutolinkHeadings,
					{
						behavior: "append",
						properties: {
							className: ["anchor"],
						},
						content: {
							type: "element",
							tagName: "span",
							properties: {
								className: ["anchor-icon"],
							},
							children: [
								{
									type: "text",
									value: "#",
								},
							],
						},
					},
				],
			],
		}),
	},
	vite: {
		// Tailwind CSS v4 通过官方 Vite 插件接入
		plugins: [tailwindcss()],
		// 开发时预打包 Swup 子入口，减少 504 Outdated Optimize Dep（依赖变更后仍建议重启 dev）
		optimizeDeps: {
			include: [
				"@swup/astro/client",
				"@swup/astro/serialise",
				"@swup/astro/idle",
				"medium-zoom",
			],
		},
		resolve: {
			// 避免多份 svelte 运行时导致 onMount 报 lifecycle_outside_component
			dedupe: ["svelte"],
			alias: {
				"@rehype-callouts-theme": `rehype-callouts/theme/${siteConfig.rehypeCallouts.theme}`,
			},
		},
		build: {
			// 启用资源压缩和优化
			minify: "terser",
			terserOptions: {
				compress: {
					drop_console: false, // 生产环境可改为true移除console
					drop_debugger: true,
				},
				mangle: true,
				format: {
					comments: false,
				},
			},
			rollupOptions: {
				onwarn(warning, warn) {
					// temporarily suppress this warning
					if (
						warning.message.includes("is dynamically imported by") &&
						warning.message.includes("but also statically imported by")
					) {
						return;
					}
					warn(warning);
				},
			},
			// CSS 优化
			cssCodeSplit: true,
			// Astro 7 / Vite 8 默认用 lightningcss 压缩 CSS，会对原生 `&` 嵌套等语法报错；
			// 显式指定 esbuild 以保持旧的宽松行为
			cssMinify: "esbuild",
			// 资源大小限制 - 减少内联资源
			assetsInlineLimit: 4096,
			// 减少源映射大小（可选，生产环境改为false）
			sourcemap: false,
			// 并行处理构建
			workers: 4,
		},
	},
});
