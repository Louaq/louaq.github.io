/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare global {
	interface ImportMetaEnv {
		readonly MEILI_MASTER_KEY: string;
	}

	interface ITOCManager {
		init: () => void;
		cleanup: () => void;
	}

	interface Window {
		FloatingTOC: {
			btn: HTMLElement | null;
			panel: HTMLElement | null;
			manager: ITOCManager | null;
			isPostPage: () => boolean;
		};
		toggleFloatingTOC: () => void;
		backToTop: () => void;
		tocInternalNavigation: boolean;
		// swup is defined in global.d.ts
		closeAnnouncement: () => void;
	}
}

export {};
