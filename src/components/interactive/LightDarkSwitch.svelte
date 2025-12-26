<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import { DARK_MODE, LIGHT_MODE } from "@/constants/constants";
import type { LIGHT_DARK_MODE } from "@/types/config.ts";
import {
	applyThemeToDocument,
	getStoredTheme,
	setTheme,
} from "@/utils/setting-utils";

// Define Swup type for window object
interface SwupHooks {
	on(event: string, callback: () => void): void;
}

interface SwupInstance {
	hooks?: SwupHooks;
}

type WindowWithSwup = Window & { swup?: SwupInstance };

let currentMode: LIGHT_DARK_MODE = $state(LIGHT_MODE);

// 切换主题（在亮色和暗色之间）
function toggleTheme() {
	const newMode = currentMode === LIGHT_MODE ? DARK_MODE : LIGHT_MODE;
	currentMode = newMode;
	setTheme(newMode);
}

// 使用onMount确保在组件挂载后正确初始化
onMount(() => {
	// 立即获取并设置正确的主题
	const storedTheme = getStoredTheme();
	// 如果存储的是SYSTEM_MODE，转换为实际的亮色或暗色模式
	if (storedTheme === "SYSTEM_MODE") {
		const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		currentMode = isSystemDark ? DARK_MODE : LIGHT_MODE;
		setTheme(currentMode);
	} else {
		currentMode = storedTheme;
	}

	// 确保DOM状态与存储的主题一致
	const currentTheme = document.documentElement.classList.contains("dark")
		? DARK_MODE
		: LIGHT_MODE;
	if (currentMode !== currentTheme) {
		applyThemeToDocument(currentMode);
	}

	// 添加Swup监听
	const handleContentReplace = () => {
		const newTheme = getStoredTheme();
		if (newTheme === "SYSTEM_MODE") {
			const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			currentMode = isSystemDark ? DARK_MODE : LIGHT_MODE;
		} else {
			currentMode = newTheme;
		}
	};

	// 检查Swup是否已经加载
	const win = window as WindowWithSwup;
	if (win.swup?.hooks) {
		win.swup.hooks.on("content:replace", handleContentReplace);
	} else {
		document.addEventListener("swup:enable", () => {
			const w = window as WindowWithSwup;
			if (w.swup?.hooks) {
				w.swup.hooks.on("content:replace", handleContentReplace);
			}
		});
	}

	// 监听主题变化事件
	const handleThemeChange = () => {
		const newTheme = getStoredTheme();
		if (newTheme === "SYSTEM_MODE") {
			const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			currentMode = isSystemDark ? DARK_MODE : LIGHT_MODE;
		} else {
			currentMode = newTheme;
		}
	};

	window.addEventListener("theme-change", handleThemeChange);

	// 清理函数
	return () => {
		window.removeEventListener("theme-change", handleThemeChange);
	};
});
</script>

<button 
    aria-label="Toggle Light/Dark Mode" 
    onclick={toggleTheme}
    class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" 
    id="scheme-switch"
>
    <div class="absolute transition-opacity duration-200" class:opacity-0={currentMode !== LIGHT_MODE} class:opacity-100={currentMode === LIGHT_MODE}>
        <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem]"></Icon>
    </div>
    <div class="absolute transition-opacity duration-200" class:opacity-0={currentMode !== DARK_MODE} class:opacity-100={currentMode === DARK_MODE}>
        <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem]"></Icon>
    </div>
</button>