import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { LinkPreset, type NavBarLink } from "@/types/config";

export const LinkPresets: { [key in LinkPreset]: NavBarLink } = {
	[LinkPreset.Home]: {
		name: i18n(I18nKey.home),
		url: "/",
		icon: "fluent-emoji-flat:house",
	},
	[LinkPreset.About]: {
		name: i18n(I18nKey.about),
		url: "/about/",
		icon: "fluent-emoji-flat:bust-in-silhouette",
	},
	[LinkPreset.Archive]: {
		name: i18n(I18nKey.archive),
		url: "/archive/",
		icon: "fluent-emoji-flat:file-folder",
	},
	[LinkPreset.Friends]: {
		name: i18n(I18nKey.friends),
		url: "/friends/",
		icon: "fluent-emoji-flat:handshake",
	},
	[LinkPreset.Sponsor]: {
		name: i18n(I18nKey.sponsor),
		url: "/sponsor/",
		icon: "fluent-emoji-flat:red-heart",
	},
	[LinkPreset.Guestbook]: {
		name: i18n(I18nKey.guestbook),
		url: "/guestbook/",
		icon: "fluent-emoji-flat:speech-balloon",
	},
	[LinkPreset.Bangumi]: {
		name: i18n(I18nKey.bangumi),
		url: "/bangumi/",
		icon: "fluent-emoji-flat:television",
	},
	[LinkPreset.Watchlist]: {
		name: i18n(I18nKey.watchlist),
		url: "/watchlist/",
		icon: "fluent-emoji-flat:clapper-board",
	},
	[LinkPreset.Categories]: {
		name: i18n(I18nKey.categories),
		url: "/categories/",
		icon: "fluent-emoji-flat:open-file-folder",
	},
	[LinkPreset.Tags]: {
		name: i18n(I18nKey.tags),
		url: "/tags/",
		icon: "fluent-emoji-flat:label",
	},
};
