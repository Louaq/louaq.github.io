import type { TOCManager } from "@/utils/tocUtils";

declare global {
	interface HTMLElementTagNameMap {
		"table-of-contents": HTMLElement & {
			init?: () => void;
		};
	}

	interface Window {
		// biome-ignore lint/suspicious/noExplicitAny: External library
		swup: any;
		floatingTOCListenersInitialized?: boolean;
		fireflyCachedSubtitle?: string;
		PostPageTOC?: {
			manager: TOCManager | null;
		};
		tocInternalNavigation?: boolean;
	}

	interface MediaQueryList {
		addListener(listener: (e: MediaQueryListEvent) => void): void;
		removeListener(listener: (e: MediaQueryListEvent) => void): void;
	}
}

export {};
