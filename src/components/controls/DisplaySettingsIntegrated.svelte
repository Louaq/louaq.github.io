<script lang="ts">
import Icon from "@iconify/svelte";
import { getDefaultHue, getHue, setHue } from "@utils/setting-utils";
import { onMount } from "svelte";
import { siteConfig } from "@/config";

/**
 * 文案由 Navbar.astro 在服务端解析好后传进来，而不是在组件里 import
 * `@i18n/translation`：那个模块静态引用了全部 5 种语言（打包后 ~44KB），
 * 而本组件是 client:only，等于让每个页面都白背这 44KB。
 */
export interface DisplaySettingsLabels {
	themeColor: string;
	postListLayout: string;
	postListLayoutList: string;
	postListLayoutGrid: string;
}

interface Props {
	labels: DisplaySettingsLabels;
}

let { labels }: Props = $props();

// 重要：避免在客户端初始化阶段读取 localStorage/window 导致 SSR/CSR DOM 不一致，影响 hydrate
let hue = $state(getDefaultHue());
const defaultHue = getDefaultHue();
let currentLayout: "list" | "grid" = $state("list");
const defaultLayout = siteConfig.postListLayout.defaultMode;
let mounted = $state(false);
let isSmallScreen = $state(false);
let isSwitching = $state(false);

const allowLayoutSwitch = siteConfig.postListLayout.allowSwitch;
// 是否显示主题色设置（与 siteConfig.themeColor.fixed 相反）
const showThemeColor = !siteConfig.themeColor.fixed;

function resetHue() {
	hue = getDefaultHue();
	setHue(hue);
}

function resetLayout() {
	currentLayout = defaultLayout;
	localStorage.setItem("postListLayout", defaultLayout);

	// 触发自定义事件，通知页面布局已改变
	const event = new CustomEvent("layoutChange", {
		detail: { layout: defaultLayout },
	});
	window.dispatchEvent(event);
}

function checkScreenSize() {
	isSmallScreen = window.innerWidth < 1200;
	if (isSmallScreen) {
		currentLayout = "list";
	}
}

function switchLayout() {
	if (!mounted || isSmallScreen || isSwitching) return;

	isSwitching = true;
	currentLayout = currentLayout === "list" ? "grid" : "list";
	localStorage.setItem("postListLayout", currentLayout);

	// 触发自定义事件，通知页面布局已改变
	const event = new CustomEvent("layoutChange", {
		detail: { layout: currentLayout },
	});
	window.dispatchEvent(event);

	// 动画完成后重置状态
	setTimeout(() => {
		isSwitching = false;
	}, 500);
}

onMount(() => {
	mounted = true;
	checkScreenSize();

	// 只在 mount 后读取本地偏好，避免 hydration mismatch
	hue = getHue();
	setHue(hue);

	// 从localStorage读取用户偏好布局
	const savedLayout = localStorage.getItem("postListLayout");
	if (savedLayout && (savedLayout === "list" || savedLayout === "grid")) {
		currentLayout = savedLayout;
	} else {
		currentLayout = siteConfig.postListLayout.defaultMode;
	}

	const handleCustomEvent = (event: Event) => {
		const customEvent = event as CustomEvent<{ layout: "list" | "grid" }>;
		currentLayout = customEvent.detail.layout;
	};

	window.addEventListener("resize", checkScreenSize);
	window.addEventListener("layoutChange", handleCustomEvent);

	return () => {
		window.removeEventListener("resize", checkScreenSize);
		window.removeEventListener("layoutChange", handleCustomEvent);
	};
});
</script>

<div id="display-setting" class="float-panel float-panel-closed absolute left-auto top-full right-0 z-60 mt-1.5 w-80 max-w-[calc(100vw-2rem)] translate-x-0 px-4 py-4 transition-[opacity,transform]">
    <!-- Theme Color Section -->
    {#if showThemeColor}
        <div class="flex flex-row gap-2 mb-2 items-center justify-between">
            <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 relative ml-3
                before:w-1 before:h-4 before:rounded-md before:bg-(--primary)
                before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
            >
                {labels.themeColor}
                <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md  active:scale-90"
                        class:opacity-0={hue === defaultHue} class:pointer-events-none={hue === defaultHue} onclick={resetHue}>
                    <span class="text-(--btn-content)">
                        <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                    </span>
                </button>
            </div>
            <div class="flex gap-1">
                <div id="hueValue" class="bg-(--btn-regular-bg) w-10 h-7 rounded-md flex justify-center
                font-bold text-sm items-center text-(--btn-content)">
                    {hue}
                </div>
            </div>
        </div>
        <div class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded-sm select-none">
            <input aria-label={labels.themeColor} type="range" min="0" max="360" bind:value={hue}
                   class="slider" id="colorSlider" step="5" style="width: 100%"
                   oninput={() => setHue(hue)}>
        </div>
    {/if}

    <!-- Layout Switch Section -->
    {#if allowLayoutSwitch && !isSmallScreen}
        <div class="px-1 mt-2">
            <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 relative ml-3 mb-2
                before:w-1 before:h-4 before:rounded-md before:bg-(--primary)
                before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
            >
                {labels.postListLayout}
                <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md  active:scale-90"
                        class:opacity-0={currentLayout === defaultLayout} class:pointer-events-none={currentLayout === defaultLayout} onclick={resetLayout}>
                    <span class="text-(--btn-content)">
                        <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                    </span>
                </button>
            </div>
            <div class="flex gap-2">
                <button
                    aria-label={labels.postListLayoutList}
                    class="flex-1 btn-regular rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-transform relative overflow-hidden"
                    class:ring-1={currentLayout === 'list'}
                    class:ring-[var(--primary)]={currentLayout === 'list'}
                    class:opacity-60={currentLayout !== 'list'}
                    disabled={isSwitching}
                    onclick={switchLayout}
                    title={labels.postListLayoutList}
                >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                    </svg>
                    <span class="text-xs font-medium">{labels.postListLayoutList}</span>
                    {#if currentLayout === 'list'}
                        <Icon icon="material-symbols:check-circle" class="text-[1rem] shrink-0 text-(--primary)"></Icon>
                    {/if}
                </button>
                <button
                    aria-label={labels.postListLayoutGrid}
                    class="flex-1 btn-regular rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-transform relative overflow-hidden"
                    class:ring-1={currentLayout === 'grid'}
                    class:ring-[var(--primary)]={currentLayout === 'grid'}
                    class:opacity-60={currentLayout !== 'grid'}
                    disabled={isSwitching}
                    onclick={switchLayout}
                    title={labels.postListLayoutGrid}
                >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
                    </svg>
                    <span class="text-xs font-medium">{labels.postListLayoutGrid}</span>
                    {#if currentLayout === 'grid'}
                        <Icon icon="material-symbols:check-circle" class="text-[1rem] shrink-0 text-(--primary)"></Icon>
                    {/if}
                </button>
            </div>
        </div>
    {/if}
</div>


<style lang="stylus">
    /* 覆盖 .float-panel 的 top-4，改为紧贴触发按钮所在行底部 */
    #display-setting
      top 100% !important
      max-height calc(100vh - 6rem)
      overflow-y auto
      input[type="range"]
        -webkit-appearance none
        height 1.5rem
        background-image var(--color-selection-bar)
        transition background-image 0.15s ease-in-out

        /* Input Thumb */
        &::-webkit-slider-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-moz-range-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          border-width 0
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-ms-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

</style>
