import { DARK_MODE, DEFAULT_THEME, LIGHT_MODE } from "@constants/constants";
import type { LIGHT_DARK_MODE } from "@/types/config";
import { expressiveCodeConfig, siteConfig } from "../config";

/**
 * 本模块只有两个使用方，都不经过服务端：
 * - Layout.astro 的常驻客户端脚本里 `await import()` 动态载入；
 * - DisplaySettingsIntegrated.svelte，挂载方式是 client:only="svelte"，从不 SSR。
 *
 * 因此这里的函数一律可以直接用 document / localStorage。此前每个导出函数开头都有
 * 一段 `typeof document === "undefined"` / `typeof localStorage === "undefined"`
 * 的守卫（共 14 处），一次也命中不了，已移除。
 *
 * 此处原本还有一整套背景壁纸逻辑（banner / overlay / none 三种模式的切换、横幅
 * 显隐、导航栏透明度、主内容位置与半透明、横幅标题开关），随 backgroundWallpaper
 * 配置一并删除。
 */

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

function getDefaultTheme(): LIGHT_DARK_MODE {
	// 配置文件中设置了 defaultMode 就用它，否则用 DEFAULT_THEME（向后兼容）
	return siteConfig.themeColor.defaultMode ?? DEFAULT_THEME;
}

function resolveTheme(theme: LIGHT_DARK_MODE): LIGHT_DARK_MODE {
	return theme === DARK_MODE ? DARK_MODE : LIGHT_MODE;
}

export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	r.style.setProperty("--hue", String(hue));
}

function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	const resolvedTheme = resolveTheme(theme);

	const currentIsDark = document.documentElement.classList.contains("dark");
	const currentTheme = document.documentElement.getAttribute("data-theme");
	const targetIsDark = resolvedTheme === DARK_MODE;

	// 主题类与 expressive-code 主题各自只在真正变化时才写 DOM，避免无谓重绘
	const needsThemeChange = currentIsDark !== targetIsDark;
	const expectedTheme = targetIsDark
		? expressiveCodeConfig.darkTheme
		: expressiveCodeConfig.lightTheme;
	const needsCodeThemeUpdate = currentTheme !== expectedTheme;

	if (needsThemeChange) {
		document.documentElement.classList.toggle("dark", targetIsDark);
	}

	if (needsCodeThemeUpdate) {
		document.documentElement.setAttribute("data-theme", expectedTheme);
	}
}

function getStoredTheme(): LIGHT_DARK_MODE {
	const theme =
		(localStorage.getItem("theme") as LIGHT_DARK_MODE) || getDefaultTheme();
	return theme === DARK_MODE ? DARK_MODE : LIGHT_MODE;
}

// 初始化主题监听器（用于页面加载后）
export function initThemeListener() {
	applyThemeToDocument(getStoredTheme());
}
