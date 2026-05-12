import {
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
	WALLPAPER_BANNER,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "@constants/constants";
import type { LIGHT_DARK_MODE, WALLPAPER_MODE } from "@/types/config";
import {
	backgroundWallpaper,
	expressiveCodeConfig,
	siteConfig,
} from "../config";
import { isHomePage as checkIsHomePage } from "./layout-utils";

// Declare global functions
declare global {
	interface Window {
		initSemifullScrollDetection?: () => void;
		semifullScrollHandler?: () => void;
	}
}

export function getDefaultHue(): number {
	const fallback = "250";
	// 妫€鏌ユ槸鍚﹀湪娴忚鍣ㄧ幆澧冧腑
	if (typeof document === "undefined") {
		return Number.parseInt(fallback, 10);
	}
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

export function getDefaultTheme(): LIGHT_DARK_MODE {
	// 濡傛灉閰嶇疆鏂囦欢涓缃簡 defaultMode锛屼娇鐢ㄩ厤缃殑鍊?
	// 鍚﹀垯浣跨敤 DEFAULT_THEME锛堝悜鍚庡吋瀹癸級
	return siteConfig.themeColor.defaultMode ?? DEFAULT_THEME;
}

export function resolveTheme(theme: LIGHT_DARK_MODE): LIGHT_DARK_MODE {
	return theme === DARK_MODE ? DARK_MODE : LIGHT_MODE;
}

export function getHue(): number {
	// 鍏堟鏌ュ叏灞€瀵硅薄
	if (typeof window === "undefined" || !window.localStorage) {
		return getDefaultHue();
	}
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
	// 鍏堟鏌ユ槸鍚﹀湪娴忚鍣ㄧ幆澧?
	if (
		typeof window === "undefined" ||
		!window.localStorage ||
		typeof document === "undefined"
	) {
		return;
	}
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	// 妫€鏌ユ槸鍚﹀湪娴忚鍣ㄧ幆澧冧腑
	if (typeof document === "undefined") {
		return;
	}

	// 瑙ｆ瀽涓婚
	const resolvedTheme = resolveTheme(theme);

	// 鑾峰彇褰撳墠涓婚鐘舵€佺殑瀹屾暣淇℃伅
	const currentIsDark = document.documentElement.classList.contains("dark");
	const currentTheme = document.documentElement.getAttribute("data-theme");

	// 璁＄畻鐩爣涓婚鐘舵€?
	let targetIsDark = false; // 鍒濆鍖栭粯璁ゅ€?
	switch (resolvedTheme) {
		case LIGHT_MODE:
			targetIsDark = false;
			break;
		case DARK_MODE:
			targetIsDark = true;
			break;
		default:
			// 澶勭悊榛樿鎯呭喌锛屼娇鐢ㄥ綋鍓嶄富棰樼姸鎬?
			targetIsDark = currentIsDark;
			break;
	}

	// 妫€娴嬫槸鍚︾湡鐨勯渶瑕佷富棰樺垏鎹細
	// 1. dark绫荤姸鎬佹槸鍚︽敼鍙?
	// 2. expressiveCode涓婚鏄惁闇€瑕佹洿鏂?
	const needsThemeChange = currentIsDark !== targetIsDark;
	const expectedTheme = targetIsDark
		? expressiveCodeConfig.darkTheme
		: expressiveCodeConfig.lightTheme;
	const needsCodeThemeUpdate = currentTheme !== expectedTheme;

	// 濡傛灉鏃笉闇€瑕佷富棰樺垏鎹篃涓嶉渶瑕佷唬鐮佷富棰樻洿鏂帮紝鐩存帴杩斿洖
	if (!needsThemeChange && !needsCodeThemeUpdate) {
		return;
	}

	// 鎵归噺 DOM 鎿嶄綔锛屽噺灏戦噸缁?
	if (needsThemeChange) {
		// 娣诲姞杩囨浮淇濇姢绫伙紙浣嗕細瀵艰嚧澶ч噺閲嶇粯锛屾墍浠ヤ娇鐢ㄦ洿杞婚噺鐨勬柟寮忥級
		// document.documentElement.classList.add("is-theme-transitioning");

		// 鐩存帴鍒囨崲涓婚锛屽埄鐢?CSS 鍙橀噺鐨勭壒鎬ц娴忚鍣ㄤ紭鍖栬繃娓?
		if (targetIsDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}

	// Set the theme for Expressive Code based on current mode
	if (needsCodeThemeUpdate) {
		document.documentElement.setAttribute("data-theme", expectedTheme);
	}
}

// 绯荤粺涓婚鐩戝惉鍣ㄥ紩鐢?
export function setTheme(theme: LIGHT_DARK_MODE): void {
	// 妫€鏌ユ槸鍚﹀湪娴忚鍣ㄧ幆澧冧腑
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.setItem !== "function"
	) {
		return;
	}

	// 鍏堝簲鐢ㄤ富棰?
	applyThemeToDocument(theme);

	// 淇濆瓨鍒發ocalStorage
	localStorage.setItem("theme", theme === DARK_MODE ? DARK_MODE : LIGHT_MODE);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	// 妫€鏌ユ槸鍚﹀湪娴忚鍣ㄧ幆澧冧腑
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.getItem !== "function"
	) {
		return getDefaultTheme();
	}
	const theme = (localStorage.getItem("theme") as LIGHT_DARK_MODE) || getDefaultTheme();
	return theme === DARK_MODE ? DARK_MODE : LIGHT_MODE;
}

// 鍒濆鍖栦富棰樼洃鍚櫒锛堢敤浜庨〉闈㈠姞杞藉悗锛?
export function initThemeListener() {
	applyThemeToDocument(getStoredTheme());
}

// Wallpaper mode functions
export function applyWallpaperModeToDocument(mode: WALLPAPER_MODE) {
	// 妫€鏌ユ槸鍚﹀厑璁稿垏鎹㈠绾告ā寮?
	const isSwitchable = backgroundWallpaper.switchable ?? true;
	if (!isSwitchable) {
		// 濡傛灉涓嶅厑璁稿垏鎹紝鐩存帴杩斿洖锛屼笉鎵ц浠讳綍鎿嶄綔
		return;
	}

	// 鑾峰彇褰撳墠鐨勫绾告ā寮?
	const currentMode =
		(document.documentElement.getAttribute(
			"data-wallpaper-mode",
		) as WALLPAPER_MODE) || backgroundWallpaper.mode;

	// 濡傛灉妯″紡娌℃湁鍙樺寲锛岀洿鎺ヨ繑鍥?
	if (currentMode === mode) {
		// 鍗充娇鏄浉鍚屾ā寮忥紝涔熻纭繚UI鐘舵€佹纭?
		ensureWallpaperState(mode);
		return;
	}

	// 娣诲姞杩囨浮淇濇姢绫?
	document.documentElement.classList.add("is-wallpaper-transitioning");

	// 鏇存柊鏁版嵁灞炴€?
	document.documentElement.setAttribute("data-wallpaper-mode", mode);

	// 浣跨敤 requestAnimationFrame 纭繚鍦ㄤ笅涓€甯ф墽琛岋紝閬垮厤闂睆
	requestAnimationFrame(() => {
		const body = document.body;
		const isPostPage = body?.dataset?.pageType === "post";
		const isMobile = window.innerWidth < 1024;
		const effectiveMode: WALLPAPER_MODE =
			isMobile && isPostPage ? WALLPAPER_NONE : isPostPage ? WALLPAPER_BANNER : mode;

		// 绉婚櫎鎵€鏈夊绾哥浉鍏崇殑CSS绫?
		body.classList.remove("enable-banner", "wallpaper-transparent");
		// 鏂囩珷椤靛拰棣栭〉鍏佽 banner 妯″紡
		if (isPostPage && !(isMobile && isPostPage)) {
			body.classList.add("enable-banner");
			body.classList.remove("wallpaper-transparent");
		}

		// 鏍规嵁妯″紡娣诲姞鐩稿簲鐨凜SS绫?
		switch (effectiveMode) {
			case WALLPAPER_BANNER:
				body.classList.add("enable-banner");
				showBannerMode();
				break;
			case WALLPAPER_OVERLAY:
				body.classList.add("wallpaper-transparent");
				showOverlayMode();
				break;
			case WALLPAPER_NONE:
				hideAllWallpapers();
				break;
			default:
				hideAllWallpapers();
				break;
		}

		// 鏇存柊瀵艰埅鏍忛€忔槑妯″紡
		updateNavbarTransparency(effectiveMode);

		// 鍦ㄤ笅涓€甯хЩ闄よ繃娓′繚鎶ょ被
		requestAnimationFrame(() => {
			document.documentElement.classList.remove("is-wallpaper-transitioning");
		});
	});
}

// 纭繚澹佺焊鐘舵€佹纭?
function ensureWallpaperState(mode: WALLPAPER_MODE) {
	const body = document.body;
	const isPostPage = body?.dataset?.pageType === "post";
	const isMobile = window.innerWidth < 1024;
	const effectiveMode: WALLPAPER_MODE =
		isMobile && isPostPage ? WALLPAPER_NONE : isPostPage ? WALLPAPER_BANNER : mode;

	// 绉婚櫎鎵€鏈夊绾哥浉鍏崇殑CSS绫?
	body.classList.remove("enable-banner", "wallpaper-transparent");
	if (isPostPage && !(isMobile && isPostPage)) {
		body.classList.add("enable-banner");
		body.classList.remove("wallpaper-transparent");
	}

	// 鏍规嵁妯″紡娣诲姞鐩稿簲鐨凜SS绫?
	switch (effectiveMode) {
		case WALLPAPER_BANNER:
			body.classList.add("enable-banner");
			showBannerMode();
			break;
		case WALLPAPER_OVERLAY:
			body.classList.add("wallpaper-transparent");
			showOverlayMode();
			break;
		case WALLPAPER_NONE:
			hideAllWallpapers();
			break;
	}

	// 鏇存柊瀵艰埅鏍忛€忔槑妯″紡
	updateNavbarTransparency(effectiveMode);
}

function showBannerMode() {
	// 闅愯棌鍏ㄥ睆澹佺焊锛堥€氳繃CSS绫诲拰display鎺у埗锛?
	const overlayContainer = document.querySelector(
		"[data-overlay-wallpaper]",
	) as HTMLElement;
	if (overlayContainer) {
		overlayContainer.style.display = "none";
		overlayContainer.classList.add("hidden");
		overlayContainer.classList.add("opacity-0");
		overlayContainer.classList.remove("opacity-100");
	}

	// 鏄剧ずbanner澹佺焊锛堥€氳繃CSS绫诲拰display鎺у埗锛?
	const bannerWrapper = document.getElementById("banner-wrapper");
	if (bannerWrapper) {
		// 妫€鏌ュ綋鍓嶆槸鍚︿负棣栭〉
		const isHomePage = checkIsHomePage(window.location.pathname);
		const isPostPage =
			(document.body?.dataset?.pageType === "post") ||
			/\/posts\/.+/.test(window.location.pathname);
		const isMobile = window.innerWidth < 1024;

		// 绉诲姩绔枃绔犺鎯呴〉锛氱粺涓€涓嶆樉绀哄绾?banner
		// 绉诲姩绔潪棣栭〉鏃讹紝涓嶆樉绀篵anner锛涗絾鈥滈〉闈㈡爣棰樻í骞呪€濋〉闈緥澶栬鏄剧ず
		// 妗岄潰绔缁堟樉绀?
		if (isMobile && isPostPage) {
			bannerWrapper.style.display = "none";
			bannerWrapper.classList.add("mobile-hide-banner");
		} else if (isMobile && !isHomePage && !isPostPage) {
			bannerWrapper.style.display = "none";
			bannerWrapper.classList.add("mobile-hide-banner");
		} else {
			// 棣栭〉鎴栨闈㈢锛氬厛璁剧疆display锛岀劧鍚庝娇鐢╮equestAnimationFrame纭繚娓叉煋
			bannerWrapper.style.display = "block";
			bannerWrapper.style.setProperty("display", "block", "important");
			requestAnimationFrame(() => {
				bannerWrapper.classList.remove("hidden");
				bannerWrapper.classList.remove("opacity-0");
				bannerWrapper.classList.add("opacity-100");
				bannerWrapper.classList.remove("mobile-hide-banner");
			});
		}
	}

	// 鏄剧ず妯箙鍥剧墖鏉ユ簮鏂囨湰
	const creditDesktop = document.getElementById("banner-credit-desktop");
	const creditMobile = document.getElementById("banner-credit-mobile");
	if (creditDesktop) creditDesktop.style.display = "";
	if (creditMobile) creditMobile.style.display = "";

	// 鏄剧ず妯箙鏂囧瓧锛堥椤?鏂囩珷椤靛垎娴侊級
	const isHomePage = checkIsHomePage(window.location.pathname);
	const isPostPage =
		(document.body?.dataset?.pageType === "post") ||
		/\/posts\/.+/.test(window.location.pathname);
	const bannerTextOverlays = document.querySelectorAll(
		"[data-banner-text-overlay]",
	);
	bannerTextOverlays.forEach((el) => {
		const overlayType = el.getAttribute("data-banner-text-overlay");
		const shouldShow = overlayType === "home" && isHomePage;
		if (shouldShow) {
			el.classList.remove("hidden");
		} else {
			el.classList.add("hidden");
		}
	});

	// 璋冩暣涓诲唴瀹逛綅缃?
	adjustMainContentPosition("banner");

	// 澶勭悊绉诲姩绔潪棣栭〉涓诲唴瀹瑰尯鍩熶綅缃?
	const mainContentWrapper = document.querySelector(".absolute.w-full.z-30");
	if (mainContentWrapper) {
		const isHomePage = checkIsHomePage(window.location.pathname);
		const isPostPage =
			(document.body?.dataset?.pageType === "post") ||
			/\/posts\/.+/.test(window.location.pathname);
		const isMobile = window.innerWidth < 1024;
		// 鍙湪绉诲姩绔潪棣栭〉鏃惰皟鏁翠富鍐呭浣嶇疆
		if (isMobile && !isHomePage && !isPostPage) {
			mainContentWrapper.classList.add("mobile-main-no-banner");
		} else {
			mainContentWrapper.classList.remove("mobile-main-no-banner");
		}
	}

	// 绉婚櫎閫忔槑鏁堟灉锛堟í骞呮ā寮忎笉浣跨敤鍗婇€忔槑锛?
	adjustMainContentTransparency(false);

	// 璋冩暣瀵艰埅鏍忛€忔槑搴?
	const navbar = document.getElementById("navbar");
	if (navbar) {
		// 鑾峰彇瀵艰埅鏍忛€忔槑妯″紡閰嶇疆锛坆anner妯″紡锛?
		const transparentMode =
			backgroundWallpaper.banner?.navbar?.transparentMode || "semi";
		navbar.setAttribute("data-transparent-mode", transparentMode);

		// 閲嶆柊鍒濆鍖栧崐閫忔槑妯″紡婊氬姩妫€娴嬶紙濡傛灉闇€瑕侊級
		if (
			transparentMode === "semifull" &&
			typeof window.initSemifullScrollDetection === "function"
		) {
			window.initSemifullScrollDetection();
		}
	}
}

function showOverlayMode() {
	// 鏄剧ず鍏ㄥ睆澹佺焊锛堥€氳繃CSS绫诲拰display鎺у埗锛?
	const overlayContainer = document.querySelector(
		"[data-overlay-wallpaper]",
	) as HTMLElement;
	if (overlayContainer) {
		// 鍏堣缃甦isplay锛岀劧鍚庝娇鐢╮equestAnimationFrame纭繚娓叉煋
		overlayContainer.style.display = "block";
		overlayContainer.style.setProperty("display", "block", "important");
		requestAnimationFrame(() => {
			overlayContainer.classList.remove("hidden");
			overlayContainer.classList.remove("opacity-0");
			overlayContainer.classList.add("opacity-100");
		});
	}

	// 闅愯棌banner澹佺焊锛堥€氳繃CSS绫诲拰display鎺у埗锛?
	const bannerWrapper = document.getElementById("banner-wrapper");
	if (bannerWrapper) {
		bannerWrapper.style.display = "none";
		bannerWrapper.classList.add("hidden");
		bannerWrapper.classList.add("opacity-0");
		bannerWrapper.classList.remove("opacity-100");
	}

	// 闅愯棌妯箙鍥剧墖鏉ユ簮鏂囨湰
	const creditDesktop = document.getElementById("banner-credit-desktop");
	const creditMobile = document.getElementById("banner-credit-mobile");
	if (creditDesktop) creditDesktop.style.display = "none";
	if (creditMobile) creditMobile.style.display = "none";

	// 闅愯棌妯箙棣栭〉鏂囨湰
	const bannerTextOverlays = document.querySelectorAll(
		"[data-banner-text-overlay]",
	);
	bannerTextOverlays.forEach((el) => el.classList.add("hidden"));

	// 璋冩暣涓诲唴瀹归€忔槑搴?
	adjustMainContentTransparency(true);

	// 璋冩暣甯冨眬涓虹揣鍑戞ā寮?
	adjustMainContentPosition("overlay");
}

function hideAllWallpapers() {
	// 闅愯棌鎵€鏈夊绾革紙閫氳繃CSS绫诲拰display鎺у埗锛?
	const bannerWrapper = document.getElementById("banner-wrapper");
	const overlayContainer = document.querySelector(
		"[data-overlay-wallpaper]",
	) as HTMLElement;

	if (bannerWrapper) {
		bannerWrapper.style.display = "none";
		bannerWrapper.classList.add("hidden");
		bannerWrapper.classList.add("opacity-0");
	}

	if (overlayContainer) {
		overlayContainer.style.display = "none";
		overlayContainer.classList.add("hidden");
		overlayContainer.classList.add("opacity-0");
		overlayContainer.classList.remove("opacity-100");
	}

	// 闅愯棌妯箙鍥剧墖鏉ユ簮鏂囨湰
	const creditDesktop = document.getElementById("banner-credit-desktop");
	const creditMobile = document.getElementById("banner-credit-mobile");
	if (creditDesktop) creditDesktop.style.display = "none";
	if (creditMobile) creditMobile.style.display = "none";

	// 闅愯棌妯箙棣栭〉鏂囨湰
	const bannerTextOverlays = document.querySelectorAll(
		"[data-banner-text-overlay]",
	);
	bannerTextOverlays.forEach((el) => el.classList.add("hidden"));

	// 璋冩暣涓诲唴瀹逛綅缃拰閫忔槑搴?
	adjustMainContentPosition("none");
	adjustMainContentTransparency(false);
}

function updateNavbarTransparency(mode: WALLPAPER_MODE) {
	const navbar = document.getElementById("navbar");
	if (!navbar) return;

	let transparentMode: string;
	let enableBlur: boolean;

	// 鏍规嵁褰撳墠澹佺焊妯″紡璁剧疆瀵艰埅鏍忛€忔槑妯″紡鍜屾ā绯婃晥鏋?
	if (mode === WALLPAPER_OVERLAY) {
		// 鍏ㄥ睆澹佺焊妯″紡
		transparentMode = "none";
		enableBlur = false;
	} else if (mode === WALLPAPER_NONE) {
		// 绾壊鑳屾櫙妯″紡
		transparentMode = "none";
		enableBlur = false;
	} else {
		// Banner妯″紡锛氫娇鐢ㄩ厤缃殑閫忔槑妯″紡鍜屾ā绯婃晥鏋?
		transparentMode =
			backgroundWallpaper.banner?.navbar?.transparentMode || "semi";
		enableBlur = backgroundWallpaper.banner?.navbar?.enableBlur ?? true;
	}

	// 鏇存柊瀵艰埅鏍忕殑閫忔槑妯″紡灞炴€?
	navbar.setAttribute("data-transparent-mode", transparentMode);
	navbar.setAttribute("data-enable-blur", String(enableBlur));

	// 绉婚櫎鐜版湁鐨勯€忔槑妯″紡绫?
	navbar.classList.remove(
		"navbar-transparent-semi",
		"navbar-transparent-full",
		"navbar-transparent-semifull",
	);

	// 绉婚櫎scrolled绫?
	navbar.classList.remove("scrolled");

	// 婊氬姩妫€娴嬪姛鑳?
	if (
		transparentMode === "semifull" &&
		mode === WALLPAPER_BANNER &&
		typeof window.initSemifullScrollDetection === "function"
	) {
		// 浠呭湪Banner妯″紡鐨剆emifull涓嬪惎鐢ㄦ粴鍔ㄦ娴?
		window.initSemifullScrollDetection();
	} else if (window.semifullScrollHandler) {
		// 绉婚櫎婊氬姩鐩戝惉鍣?
		window.removeEventListener("scroll", window.semifullScrollHandler);
		delete window.semifullScrollHandler;
	}
}

function adjustMainContentPosition(
	mode: WALLPAPER_MODE | "banner" | "none" | "overlay",
) {
	const mainContent = document.querySelector(
		".absolute.w-full.z-30",
	) as HTMLElement;
	if (!mainContent) return;

	// 绉婚櫎鐜版湁鐨勪綅缃被
	mainContent.classList.remove("mobile-main-no-banner", "no-banner-layout");

	switch (mode) {
		case "banner":
			// Banner妯″紡锛氫富鍐呭鍦╞anner涓嬫柟
			mainContent.style.top = "calc(var(--banner-height) - 3rem)";
			break;
		case "overlay":
			// Overlay妯″紡锛氫娇鐢ㄧ揣鍑戝竷灞€锛屼富鍐呭浠庡鑸爮涓嬫柟寮€濮?
			mainContent.classList.add("no-banner-layout");
			mainContent.style.top = "5.5rem";
			break;
		case "none":
			// 鏃犲绾告ā寮忥細涓诲唴瀹逛粠瀵艰埅鏍忎笅鏂瑰紑濮?
			mainContent.classList.add("no-banner-layout");
			mainContent.style.top = "5.5rem";
			break;
		default:
			mainContent.style.top = "5.5rem";
			break;
	}
}

function adjustMainContentTransparency(enable: boolean) {
	const mainContent = document.querySelector(".absolute.w-full.z-30");
	const body = document.body;

	if (!mainContent || !body) return;

	if (enable) {
		mainContent.classList.add("wallpaper-transparent");
		body.classList.add("wallpaper-transparent");
	} else {
		mainContent.classList.remove("wallpaper-transparent");
		body.classList.remove("wallpaper-transparent");
	}
}

export function setWallpaperMode(mode: WALLPAPER_MODE): void {
	// 妫€鏌ユ槸鍚﹀湪娴忚鍣ㄧ幆澧冧腑
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.setItem !== "function"
	) {
		return;
	}
	localStorage.setItem("wallpaperMode", mode);
	applyWallpaperModeToDocument(mode);
}

export function initWallpaperMode(): void {
	const storedMode = getStoredWallpaperMode();
	applyWallpaperModeToDocument(storedMode);
}

export function getStoredWallpaperMode(): WALLPAPER_MODE {
	// 閰嶇疆涓?overlay/none 鏃跺己鍒朵娇鐢ㄩ厤缃紝涓嶈 localStorage锛岄伩鍏嶅埛鏂颁粛鏄剧ず鍏朵粬澹佺焊
	if (backgroundWallpaper.mode === WALLPAPER_OVERLAY) {
		return WALLPAPER_OVERLAY;
	}
	if (backgroundWallpaper.mode === WALLPAPER_NONE) {
		return WALLPAPER_NONE;
	}
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.getItem !== "function"
	) {
		return backgroundWallpaper.mode;
	}
	return (
		(localStorage.getItem("wallpaperMode") as WALLPAPER_MODE) ||
		backgroundWallpaper.mode
	);
}
// Waves animation functions
export function getDefaultWavesEnabled(): boolean {
	const wavesConfig = backgroundWallpaper.banner?.waves?.enable;
	if (typeof wavesConfig === "object") {
		// 濡傛灉鏄垎璁惧閰嶇疆锛屾鏌ュ綋鍓嶈澶?
		const isMobile =
			typeof window !== "undefined" ? window.innerWidth < 768 : false;
		return isMobile ? (wavesConfig.mobile ?? false) : (wavesConfig.desktop ?? false);
	}
	return wavesConfig ?? false;
}

export function getStoredWavesEnabled(): boolean {
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.getItem !== "function"
	) {
		return getDefaultWavesEnabled();
	}
	const stored = localStorage.getItem("wavesEnabled");
	if (stored === null) {
		return getDefaultWavesEnabled();
	}
	return stored === "true";
}

export function setWavesEnabled(enabled: boolean): void {
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.setItem !== "function"
	) {
		return;
	}
	localStorage.setItem("wavesEnabled", String(enabled));
	applyWavesEnabledToDocument(enabled);
}

export function applyWavesEnabledToDocument(enabled: boolean): void {
	if (typeof document === "undefined") {
		return;
	}
	// 鏇存柊 html 灞炴€э紝CSS 浼氱珛鍗崇敓鏁?
	document.documentElement.setAttribute("data-waves-enabled", String(enabled));
	// 鍚屾椂鏇存柊鍏冪礌鏍峰紡锛堝吋瀹规€э級
	const wavesElement = document.getElementById("header-waves");
	if (wavesElement) {
		if (enabled) {
			wavesElement.style.display = "";
			wavesElement.classList.remove("waves-disabled");
		} else {
			wavesElement.style.display = "none";
			wavesElement.classList.add("waves-disabled");
		}
	}
}

// Banner title functions
export function getDefaultBannerTitleEnabled(): boolean {
	return backgroundWallpaper.banner?.homeText?.enable ?? true;
}

export function getStoredBannerTitleEnabled(): boolean {
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.getItem !== "function"
	) {
		return getDefaultBannerTitleEnabled();
	}
	const stored = localStorage.getItem("bannerTitleEnabled");
	if (stored === null) {
		return getDefaultBannerTitleEnabled();
	}
	return stored === "true";
}

export function setBannerTitleEnabled(enabled: boolean): void {
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.setItem !== "function"
	) {
		return;
	}
	localStorage.setItem("bannerTitleEnabled", String(enabled));
	applyBannerTitleEnabledToDocument(enabled);
}

export function applyBannerTitleEnabledToDocument(enabled: boolean): void {
	if (typeof document === "undefined") {
		return;
	}
	// 鏇存柊 html 灞炴€э紝CSS 浼氱珛鍗崇敓鏁?
	document.documentElement.setAttribute("data-banner-title-enabled", String(enabled));
	// 鍚屾椂鏇存柊鍏冪礌鏍峰紡锛堝吋瀹规€э級
	const homeBannerTextOverlays = document.querySelectorAll(
		'.banner-text-overlay[data-banner-text-overlay="home"]',
	) as NodeListOf<HTMLElement>;
	homeBannerTextOverlays.forEach((el) => {
		if (enabled) {
			el.classList.remove("user-hidden");
		} else {
			el.classList.add("user-hidden");
		}
	});
}
