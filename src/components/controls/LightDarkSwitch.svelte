<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import DropdownItem from "@/components/common/DropdownItem.svelte";
import DropdownPanel from "@/components/common/DropdownPanel.svelte";
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

function toggleTheme() {
	let newMode: LIGHT_DARK_MODE;
	newMode = currentMode === LIGHT_MODE ? DARK_MODE : LIGHT_MODE;
	currentMode = newMode;
	setTheme(newMode);
}

// 浣跨敤onMount纭繚鍦ㄧ粍浠舵寕杞藉悗姝ｇ‘鍒濆鍖?
onMount(() => {
	// 绔嬪嵆鑾峰彇骞惰缃纭殑涓婚
	const storedTheme = getStoredTheme();
	currentMode = storedTheme;

	// 纭繚DOM鐘舵€佷笌瀛樺偍鐨勪富棰樹竴鑷?
	applyThemeToDocument(currentMode);

	// 娣诲姞Swup鐩戝惉
	const handleContentReplace = () => {
		const newTheme = getStoredTheme();
		currentMode = newTheme;
	};

	// 妫€鏌wup鏄惁宸茬粡鍔犺浇
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

	// 鐩戝惉涓婚鍙樺寲浜嬩欢
	const handleThemeChange = () => {
		const newTheme = getStoredTheme();
		currentMode = newTheme;
	};

	window.addEventListener("theme-change", handleThemeChange);

	// 娓呯悊鍑芥暟
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


