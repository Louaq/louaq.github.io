import type {
	DARK_MODE,
	LIGHT_MODE,
	WALLPAPER_BANNER,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "../constants/constants";

export type SiteConfig = {
	title: string;
	subtitle: string;
	site_url: string;
	description?: string; // 缃戠珯鎻忚堪锛岀敤浜庣敓鎴?<meta name="description">
	keywords?: string[]; // 绔欑偣鍏抽敭璇嶏紝鐢ㄤ簬鐢熸垚 <meta name="keywords">

	lang: "en" | "zh_CN" | "zh_TW" | "ja" | "ru";

	themeColor: {
		hue: number;
		fixed: boolean; // 鏄惁闅愯棌涓婚鑹查€夋嫨鍣紙璋冭壊鐩樻寜閽強闈㈡澘鍐呬富棰樿壊婊戝潡锛?
		showModeSwitch?: boolean; // 鏄惁鏄剧ず鏄庢殫/璺熼殢绯荤粺妯″紡鍒囨崲鎸夐挳锛岄粯璁?true
		defaultMode?: LIGHT_DARK_MODE; // 榛樿妯″紡锛氭祬鑹层€佹繁鑹叉垨璺熼殢绯荤粺
	};

	// 鍗＄墖鏍峰紡閰嶇疆
	card: {
		// 鏄惁寮€鍚崱鐗囪竟妗嗗拰闃村奖绔嬩綋鏁堟灉
		border: boolean;
	};

	// 瀛椾綋閰嶇疆
	font: FontConfig;

	// 绔欑偣寮€濮嬫棩鏈燂紝鐢ㄤ簬璁＄畻杩愯澶╂暟
	siteStartDate?: string; // 鏍煎紡: "YYYY-MM-DD"

	// 鍙€夛細绔欑偣鏃跺尯锛屼娇鐢?IANA 鏃跺尯鏍囪瘑锛屼緥濡?"Asia/Shanghai"銆?UTC"
	timezone?: string;

	// RSS 杈撳嚭閰嶇疆
	rss?: {
		// 杈撳嚭妯″紡锛歠ull=杈撳嚭鍏ㄦ枃锛堝寘鍚?content锛夛紝summary=浠呰緭鍑烘憳瑕侊紙浠?description锛?
		mode: "full" | "summary";
	};

	// 鎻愰啋妗嗛厤缃?
	rehypeCallouts: {
		theme: "github" | "obsidian" | "vitepress";
	};

	// 娣诲姞bangumi閰嶇疆
	bangumi?: {
		userId?: string; // Bangumi鐢ㄦ埛ID
	};

	generateOgImages: boolean;
	favicon: Array<{
		src: string;
		theme?: "light" | "dark";
		sizes?: string;
	}>;

	navbar: {
		/** 瀵艰埅鏍廘ogo鍥炬爣锛屽彲閫夌被鍨嬶細icon搴撱€佹湰鍦板浘鐗囥€佺綉缁滃浘鐗囬摼鎺?*/
		logo?: {
			type: "icon" | "image" | "url";
			value: string; // icon鍚嶃€佹湰鍦板浘鐗囪矾寰勬垨缃戠粶鍥剧墖url
			alt?: string; // 鍥剧墖alt鏂囨湰
		};
		title?: string; // 瀵艰埅鏍忔爣棰橈紝濡傛灉涓嶈缃垯浣跨敤 title
		followTheme?: boolean; // 瀵艰埅鏍忓浘鏍囧拰鏍囬鏄惁璺熼殢涓婚鑹?
	};

	// 鎼滅储寮曟搸閰嶇疆
	search?: {
		engine: "algolia" | "milisearch"; // 鎼滅储寮曟搸锛欰lgolia / Milisearch(Meilisearch)
	};

	showLastModified: boolean; // 鎺у埗鏂囩珷椤靛厓淇℃伅涓殑鏇存柊鏃ユ湡涓庢鏂囧墠杩囨湡鎻愰啋鍗＄墖
	outdatedThreshold?: number; // 杩囨湡鎻愰啋鍗＄墖锛氳窛涓婃缂栬緫瓒呰繃璇ュぉ鏁版墠鏄剧ず锛堝厓淇℃伅鏇存柊鏃ユ湡涓嶅彈姝ら檺鍒讹級
	showPostPrevNext?: boolean; // 鏂囩珷椤垫槸鍚︽樉绀轰笂涓€绡?涓嬩竴绡囧鑸?

	/**
	 * 鏂囩珷 /posts/ 璺緞绛栫暐锛坒rontmatter 鐨?slug 浠嶄紭鍏堜簬鏈」锛夈€?
	 * - hash锛氱敱婧愭枃浠?id锛堢ǔ瀹氾級娲剧敓鐭崄鍏繘鍒舵锛屾棤闇€鎵嬪啓
	 * - legacy锛氭部鐢ㄣ€宨d 鍘绘墿灞曞悕銆嶏紙鏃х増闀胯矾寰勶級
	 */
	postPathMode?: "hash" | "legacy";

	// 椤甸潰寮€鍏抽厤缃?
	pages: {
		friends: boolean; // 鍙嬮摼椤甸潰寮€鍏?
		sponsor: boolean; // 璧炲姪椤甸潰寮€鍏?
		guestbook: boolean; // 鐣欒█鏉块〉闈㈠紑鍏?
		bangumi: boolean; // 鐣粍璁″垝椤甸潰寮€鍏?
		watchlist: boolean; // 瑙傚奖娓呭崟椤甸潰寮€鍏?
	};

	// 鏂囩珷鍒楄〃甯冨眬閰嶇疆
	postListLayout: {
		defaultMode: "list" | "grid"; // 榛樿甯冨眬妯″紡锛歭ist=鍒楄〃妯″紡锛実rid=缃戞牸妯″紡
		allowSwitch: boolean; // 鏄惁鍏佽鐢ㄦ埛鍒囨崲甯冨眬
		grid: {
			// 缃戞牸甯冨眬閰嶇疆锛屼粎鍦?defaultMode 涓?"grid" 鎴栧厑璁稿垏鎹㈠竷灞€鏃剁敓鏁?
			// 鏄惁寮€鍚€戝竷娴佸竷灞€
			masonry: boolean;
			// 缃戞牸妯″紡鍒楁暟锛? 鎴?3锛岄粯璁や负 2銆傛敞鎰忥細3鍒楁ā寮忎粎鍦ㄥ崟渚ц竟鏍忥紙鎴栨棤渚ц竟鏍忥級涓斿睆骞曞搴﹁冻澶熸椂鐢熸晥
			columns?: 2 | 3;
		};
	};

	// 鍒嗛〉閰嶇疆
	pagination: {
		/** 棣栭〉绛夊垪琛ㄦ瘡椤垫枃绔犳暟锛涘綊妗ｆ湭鍗曠嫭璁剧疆鏃朵笌鍏剁浉鍚?*/
		postsPerPage: number;
		/** 浠呭綊妗ｉ〉锛涗笉璁惧垯鐢?postsPerPage */
		archivePostsPerPage?: number;
	};

	// 鏂囩珷瀵嗙爜淇濇姢閰嶇疆
	postPassword?: string; // 褰撴枃绔犵殑 password 瀛楁璁剧疆涓?true 鏃朵娇鐢ㄧ殑榛樿瀵嗙爜
	postPasswordHint?: string; // 瀵嗙爜鎻愮ず鏂囨锛屽 "绀轰緥鏂囩珷瀵嗙爜123456"

	// 鍏ㄧ珯鍙樼伆閰嶇疆
	grayscale?: {
		enable: boolean; // 鏄惁鍚敤鍏ㄧ珯鍙樼伆鏁堟灉
	};
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
	Friends = 3,
	Sponsor = 4,
	Guestbook = 5,
	Bangumi = 6,
	Watchlist = 7,
	Categories = 8,
	Tags = 9,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
	icon?: string; // 鑿滃崟椤瑰浘鏍?
	children?: (NavBarLink | LinkPreset)[]; // 鏀寔瀛愯彍鍗曪紝鍙互鏄疦avBarLink鎴朙inkPreset
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

export type ProfileLinkItem = {
	name: string;
	url: string;
	icon: string;
	showName?: boolean;
};

/** 璧勬枡鍗℃瑕佹爣绛撅紙濡傘€屼紭绉€浣滆€呫€嶏級锛屾牱寮忔帴杩戞帢閲戜晶杈规爮鑺墖 */
export type ProfileBadgeItem = {
	text: string;
	/** 绔欏唴璺緞鎴栧閾撅紱涓嶅啓鍒欎负绾枃鏈?*/
	href?: string;
	icon?: string;
};

/** 璧勬枡鍗″崟鍒楃粺璁＄殑鏉ユ簮 */
export type ProfileStatValueMode =
	| "literal"
	| "postCount"
	| "randomReads"
	| "randomFollowers";

/** 璧勬枡鍗″簳閮ㄦ暟鎹垪锛堝ぇ瀛?+ 鐏拌壊璇存槑锛?*/
export type ProfileStatItem = {
	label: string;
	/** valueMode 涓?literal锛堥粯璁わ級鏃朵娇鐢紱鍙渷鐣ュ垯鐢ㄣ€屸€斻€?*/
	value?: string;
	href?: string;
	/** 榛樿 literal锛沺ostCount / random* 鏃朵笉浣跨敤 value */
	valueMode?: ProfileStatValueMode;
	/** randomReads / randomFollowers 鏃跺湪闂尯闂村唴闅忔満锛堟暣鏁帮級锛屼笉鍐欏垯鐢ㄥ唴缃粯璁ゅ尯闂?*/
	randomMin?: number;
	randomMax?: number;
};

export type ProfileConfig = {
	avatar?: string;
	/** 璧勬枡鍗￠《閮ㄥ皝闈㈠浘锛堜晶鏍忓ご鍥撅級 */
	cover?: string;
	/** 澶村儚鍙充笅瑙掕璇佽鏍?*/
	verified?: boolean;
	/** 灏侀潰鍙充笂銆屸嫰銆嶈烦杞紝榛樿 /about/ */
	menuHref?: string;
	name: string;
	bio?: string;
	/** 鏄电О鍙充晶绛夌骇鏂囨锛屽 "LV.5"锛涚暀绌哄垯涓嶆樉绀?*/
	level?: string;
	/** 绠€浠嬩笅鏂规爣绛捐 */
	badges?: ProfileBadgeItem[];
	/** 搴曟爮鏁版嵁锛堟枃绔?/ 闃呰 / 绮変笣绛夛級锛岀暀绌哄垯鏁村潡涓嶆覆鏌?*/
	stats?: ProfileStatItem[];
	links: ProfileLinkItem[];
};

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};
// 璇勮閰嶇疆

export type CommentConfig = {
	/**
	 * 褰撳墠鍚敤鐨勮瘎璁虹郴缁熺被鍨?
	 * "none" | "twikoo" | "waline" | "giscus" | "disqus" | 'artalk'
	 */
	type: "none" | "twikoo" | "waline" | "giscus" | "disqus" | "artalk";
	twikoo?: {
		envId: string;
		region?: string;
		lang?: string;
		visitorCount?: boolean;
	};
	waline?: {
		serverURL: string;
		lang?: string;
		login?: "enable" | "force" | "disable";
		visitorCount?: boolean; // 鏄惁缁熻璁块棶閲忥紝true 鍚敤璁块棶閲忥紝false 鍏抽棴
	};
	artalk?: {
		// 鍚庣绋嬪簭 API 鍦板潃
		server: string;
		/**
		 * 璇█锛屾敮鎸佽瑷€濡備笅锛?
		 * - "en" (English)
		 * - "zh-CN" (绠€浣撲腑鏂?
		 * - "zh-TW" (绻佷綋涓枃)
		 * - "ja" (鏃ユ湰瑾?
		 * - "ko" (頃滉淡鞏?
		 * - "fr" (Fran莽ais)
		 * - "ru" (袪褍褋褋泻懈泄)
		 * */
		locale: string | "auto";
		// 鏄惁缁熻璁块棶閲忥紝true 鍚敤璁块棶閲忥紝false 鍏抽棴
		visitorCount?: boolean;
	};
	giscus?: {
		repo: string;
		repoId: string;
		category: string;
		categoryId: string;
		mapping: string;
		strict: string;
		reactionsEnabled: string;
		emitMetadata: string;
		inputPosition: string;
		lang: string;
		loading: string;
	};
	disqus?: {
		shortname: string;
	};
};

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE;

export type WALLPAPER_MODE =
	| typeof WALLPAPER_BANNER
	| typeof WALLPAPER_OVERLAY
	| typeof WALLPAPER_NONE;

export type BlogPostData = {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	pinned?: boolean;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
};

export type ExpressiveCodeConfig = {
	/** @deprecated 浣跨敤 darkTheme 鍜?lightTheme 浠ｆ浛 */
	theme?: string;
	/** 鏆楄壊涓婚鍚嶇О锛堢敤浜庢殫鑹叉ā寮忥級 */
	darkTheme: string;
	/** 浜壊涓婚鍚嶇О锛堢敤浜庝寒鑹叉ā寮忥級 */
	lightTheme: string;
	/** 浠ｇ爜鍧楁姌鍙犳彃浠堕厤缃?*/
	pluginCollapsible?: PluginCollapsibleConfig;
	/** 璇█寰界珷鎻掍欢閰嶇疆 */
	pluginLanguageBadge?: PluginLanguageBadgeConfig;
};

export type PluginLanguageBadgeConfig = {
	enable: boolean; // 鏄惁鍚敤璇█寰界珷
};

export type PluginCollapsibleConfig = {
	enable: boolean; // 鏄惁鍚敤浠ｇ爜鍧楁姌鍙犲姛鑳?
	lineThreshold: number; // 瑙﹀彂鎶樺彔鐨勮鏁伴槇鍊?
	previewLines: number; // 鎶樺彔鏃舵樉绀虹殑棰勮琛屾暟
	defaultCollapsed: boolean; // 榛樿鏄惁鎶樺彔
};

export type AnnouncementConfig = {
	// enable灞炴€у凡绉婚櫎锛岀幇鍦ㄩ€氳繃sidebarLayoutConfig缁熶竴鎺у埗
	title?: string; // 鍏憡鏍忔爣棰?
	content: string; // 鍏憡鏍忓唴瀹?
	icon?: string; // 鍏憡鏍忓浘鏍?
	type?: "info" | "warning" | "success" | "error"; // 鍏憡绫诲瀷
	closable?: boolean; // 鏄惁鍙叧闂?
	link?: {
		enable: boolean; // 鏄惁鍚敤閾炬帴
		text: string; // 閾炬帴鏂囧瓧
		url: string; // 閾炬帴鍦板潃
		external?: boolean; // 鏄惁澶栭儴閾炬帴
	};
};

/** 鍗曟潯棣栭〉椤堕儴閫氱煡锛涙鏂?content 鍙惈瀹夊叏 HTML锛堜粨搴撳唴閰嶇疆锛夛紝濡?<a href="/x">璇存槑</a> */
export type HomeTopNoticeItem = {
	title?: string;
	/** 鍙笌绾枃鏈贩鎺掔殑 HTML 瀛楃涓诧紝甯哥敤 <a href>銆?strong> 绛?*/
	content: string;
	icon?: string;
	link?: {
		enable: boolean;
		text: string;
		url: string;
		external?: boolean;
	};
};

/** 棣栭〉椤堕儴閲嶈閫氱煡锛堜富鏍忛《閮級锛屼笌渚ц竟鏍忓叕鍛婄嫭绔嬮厤缃?
 *  - 澶氭潯閫氱煡缁熶竴閫氳繃 items 鏁扮粍閰嶇疆锛岃嚜涓婅€屼笅鎺掑垪銆?*/
export type HomeTopNoticeConfig = {
	enable: boolean;
	items: HomeTopNoticeItem[];
};

// 鍗曚釜瀛椾綋閰嶇疆
export type FontItem = {
	id: string; // 瀛椾綋鍞竴鏍囪瘑绗?
	name: string; // 瀛椾綋鏄剧ず鍚嶇О
	src: string; // 瀛椾綋鏂囦欢璺緞鎴朥RL閾炬帴
	family: string; // CSS font-family 鍚嶇О
	weight?: string | number; // 瀛椾綋绮楃粏锛屽 "normal", "bold", 400, 700 绛?
	style?: "normal" | "italic" | "oblique"; // 瀛椾綋鏍峰紡
	display?: "auto" | "block" | "swap" | "fallback" | "optional"; // font-display 灞炴€?
	unicodeRange?: string; // Unicode 鑼冨洿锛岀敤浜庡瓧浣撳瓙闆嗗寲
	format?:
		| "woff"
		| "woff2"
		| "truetype"
		| "opentype"
		| "embedded-opentype"
		| "svg"; // 瀛椾綋鏍煎紡锛屼粎褰?src 涓烘湰鍦版枃浠舵椂闇€瑕?
};

// 瀛椾綋閰嶇疆
export type FontConfig = {
	enable: boolean; // 鏄惁鍚敤鑷畾涔夊瓧浣撳姛鑳?
	selected: string | string[]; // 褰撳墠閫夋嫨鐨勫瓧浣揑D锛屾敮鎸佸崟涓垨澶氫釜瀛椾綋缁勫悎
	fonts: Record<string, FontItem>; // 瀛椾綋搴擄紝浠D涓洪敭鐨勫璞?
	fallback?: string[]; // 鍏ㄥ眬瀛椾綋鍥為€€鍒楄〃
	monoFallback?: string[]; // 浠ｇ爜瀛椾綋鍥為€€鍒楄〃
	preload?: boolean; // 鏄惁棰勫姞杞藉瓧浣撴枃浠朵互鎻愰珮鎬ц兘
	og?: {
		family: string; // OpenGraph 浣跨敤鐨勫瓧浣撴棌
		cssUrl: string; // OpenGraph 鑾峰彇瀛椾綋鐨?CSS 鍦板潃
		weights: {
			regular: number;
			bold: number;
		};
		fallback: string[];
	};
};

export type FooterConfig = {
	enable: boolean; // 鏄惁鍚敤Footer HTML娉ㄥ叆鍔熻兘
	customHtml?: string; // 鑷畾涔塇TML鍐呭锛岀敤浜庢坊鍔犲妗堝彿绛変俊鎭?
};

export type CoverImageConfig = {
	enableInPost: boolean; // 鏄惁鍦ㄦ枃绔犺鎯呴〉鏄剧ず灏侀潰鍥?
	randomCoverImage: {
		enable: boolean; // 鏄惁鍚敤闅忔満鍥惧姛鑳?
		apis: string[]; // 闅忔満鍥続PI鍒楄〃锛屾敮鎸?{seed} 鍗犱綅绗︼紝浼氭浛鎹负鏂囩珷slug鎴栨椂闂存埑
		fallback?: string; // 褰揂PI璇锋眰澶辫触鏃剁殑澶囩敤鍥剧墖璺緞
		// 鍔犺浇鎸囩ず鍣ㄩ厤缃?
		loading?: {
			// 鍔犺浇鎸囩ず鍣ㄥ紑鍏?
			enable: boolean;
			image?: string; // 鑷畾涔夊姞杞藉浘鐗囪矾寰勶紙鐩稿浜巔ublic鐩綍锛夛紝榛樿 "/assets/images/loading.gif"
			backgroundColor?: string; // 鍔犺浇鎸囩ず鍣ㄨ儗鏅鑹诧紝榛樿涓巐oading.gif鑳屾櫙鑹蹭竴鑷?(#fefefe)
		};
		watermark?: {
			enable: boolean; // 鏄惁鏄剧ず姘村嵃
			text?: string; // 姘村嵃鏂囨湰锛岄粯璁や负"闅忔満鍥?
			position?:
				| "top-left"
				| "top-right"
				| "bottom-left"
				| "bottom-right"
				| "center"; // 姘村嵃浣嶇疆
			opacity?: number; // 姘村嵃閫忔槑搴?0-1锛岄粯璁?.6
			fontSize?: string; // 瀛椾綋澶у皬锛岄粯璁?0.75rem"
			color?: string; // 鏂囧瓧棰滆壊锛岄粯璁や负鐧借壊
			backgroundColor?: string; // 鑳屾櫙棰滆壊锛岄粯璁や负鍗婇€忔槑榛戣壊
		};
	};
};

// 缁勪欢閰嶇疆绫诲瀷瀹氫箟
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "sidebarToc"
	| "advertisement"
	| "stats"
	| "calendar"
	| "countdown"
	| "douyinHot";

export type WidgetComponentConfig = {
	type: WidgetComponentType; // 缁勪欢绫诲瀷
	enable: boolean; // 鏄惁鍚敤璇ョ粍浠?
	position: "top" | "sticky"; // 缁勪欢浣嶇疆锛歵op=鍥哄畾鍦ㄩ《閮紝sticky=绮樻€у畾浣嶏紙鍙粴鍔級
	order?: number; // 缁勪欢鏄剧ず椤哄簭锛堟暟瀛楄秺灏忚秺闈犲墠锛?
	class?: string; // CSS 绫诲悕锛岀敤浜庡簲鐢ㄦ牱寮忓拰鍔ㄧ敾
	animationDelay?: number; // 鍔ㄧ敾寤惰繜鏃堕棿锛堟绉掞級锛岀敤浜庨敊寮€鍔ㄧ敾鏁堟灉
	style?: string; // 鑷畾涔夊唴鑱旀牱寮?
	configId?: string; // 閰嶇疆ID锛岀敤浜庡箍鍛婄粍浠舵寚瀹氫娇鐢ㄥ摢涓厤缃?
	showOnPostPage?: boolean; // 鏄惁鍦ㄦ枃绔犺鎯呴〉鏄剧ず
	showOnNonPostPage?: boolean; // 鏄惁鍦ㄩ潪鏂囩珷璇︽儏椤垫樉绀?
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // 鍦ㄦ寚瀹氳澶囦笂闅愯棌
		collapseThreshold?: number; // 鎶樺彔闃堝€?
	};
	customProps?: Record<string, unknown>; // 鑷畾涔夊睘鎬э紝鐢ㄤ簬鎵╁睍缁勪欢鍔熻兘
};

export type MobileBottomComponentConfig = {
	type: WidgetComponentType; // 缁勪欢绫诲瀷
	enable: boolean; // 鏄惁鍚敤璇ョ粍浠?
	configId?: string; // 閰嶇疆ID锛岀敤浜庡箍鍛婄粍浠舵寚瀹氫娇鐢ㄥ摢涓厤缃?
	showOnPostPage?: boolean; // 鏄惁鍦ㄦ枃绔犺鎯呴〉鏄剧ず
	showOnNonPostPage?: boolean; // 鏄惁鍦ㄩ潪鏂囩珷璇︽儏椤垫樉绀?
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // 鍦ㄦ寚瀹氳澶囦笂闅愯棌
		collapseThreshold?: number; // 鎶樺彔闃堝€?
	};
	customProps?: Record<string, unknown>; // 鑷畾涔夊睘鎬э紝鐢ㄤ簬鎵╁睍缁勪欢鍔熻兘
};

export type SidebarLayoutConfig = {
	enable: boolean; // 鏄惁鍚敤渚ц竟鏍?
	position: "left" | "both"; // 渚ц竟鏍忎綅缃細宸︿晶鎴栧弻渚?
	showRightSidebarOnPostPage?: boolean; // 褰損osition涓簂eft鏃讹紝鏄惁鍦ㄦ枃绔犺鎯呴〉鏄剧ず鍙充晶杈规爮
	leftComponents: WidgetComponentConfig[]; // 宸︿晶杈规爮缁勪欢閰嶇疆鍒楄〃
	rightComponents: WidgetComponentConfig[]; // 鍙充晶杈规爮缁勪欢閰嶇疆鍒楄〃
	mobileBottomComponents?: MobileBottomComponentConfig[]; // 绉诲姩绔簳閮ㄧ粍浠堕厤缃垪琛紙<768px鏄剧ず锛?
	defaultAnimation?: {
		enable: boolean; // 鏄惁鍚敤榛樿鍔ㄧ敾
		baseDelay: number; // 鍩虹寤惰繜鏃堕棿锛堟绉掞級
		increment: number; // 閫掑寤惰繜鏃堕棿锛堟绉掞級锛屾瘡涓粍浠朵緷娆″鍔犵殑寤惰繜
	};
	responsive?: {
		layout: {
			mobile: "hidden" | "drawer" | "sidebar"; // 绉诲姩绔竷灞€妯″紡锛歨idden=涓嶆樉绀轰晶杈规爮锛宒rawer=鎶藉眽妯″紡锛宻idebar=鏄剧ず渚ц竟鏍?
			tablet: "hidden" | "drawer" | "sidebar"; // 骞虫澘绔竷灞€妯″紡
			desktop: "hidden" | "drawer" | "sidebar"; // 妗岄潰绔竷灞€妯″紡
		};
	};
};

export type SakuraConfig = {
	enable: boolean; // 鏄惁鍚敤妯辫姳鐗规晥
	sakuraNum: number; // 妯辫姳鏁伴噺锛岄粯璁?1
	limitTimes: number; // 妯辫姳瓒婄晫闄愬埗娆℃暟锛?1涓烘棤闄愬惊鐜?
	size: {
		min: number; // 妯辫姳鏈€灏忓昂瀵稿€嶆暟
		max: number; // 妯辫姳鏈€澶у昂瀵稿€嶆暟
	};
	opacity: {
		min: number; // 妯辫姳鏈€灏忎笉閫忔槑搴?
		max: number; // 妯辫姳鏈€澶т笉閫忔槑搴?
	};
	speed: {
		horizontal: {
			min: number; // 姘村钩绉诲姩閫熷害鏈€灏忓€?
			max: number; // 姘村钩绉诲姩閫熷害鏈€澶у€?
		};
		vertical: {
			min: number; // 鍨傜洿绉诲姩閫熷害鏈€灏忓€?
			max: number; // 鍨傜洿绉诲姩閫熷害鏈€澶у€?
		};
		rotation: number; // 鏃嬭浆閫熷害
		fadeSpeed: number; // 娑堝け閫熷害锛屼笉搴斿ぇ浜庢渶灏忎笉閫忔槑搴?
	};
	zIndex: number; // 灞傜骇锛岀‘淇濇ū鑺卞湪鍚堥€傜殑灞傜骇鏄剧ず
};

export type BackgroundWallpaperConfig = {
	mode: "banner" | "overlay" | "none"; // 澹佺焊妯″紡锛歜anner妯箙妯″紡銆乷verlay鍏ㄥ睆閫忔槑瑕嗙洊妯″紡鎴杗one绾壊鑳屾櫙
	switchable?: boolean; // 鏄惁鍏佽鐢ㄦ埛閫氳繃瀵艰埅鏍忓垏鎹㈠绾告ā寮忥紝榛樿true
	src:
		| string
		| string[]
		| {
				desktop?: string | string[];
				mobile?: string | string[];
		  }; // 鏀寔鍗曚釜鍥剧墖銆佸浘鐗囨暟缁勬垨鍒嗗埆璁剧疆妗岄潰绔拰绉诲姩绔浘鐗?

	// Banner妯″紡鐗规湁閰嶇疆
	banner?: {
		position?:
			| "top"
			| "center"
			| "bottom"
			| "top left"
			| "top center"
			| "top right"
			| "center left"
			| "center center"
			| "center right"
			| "bottom left"
			| "bottom center"
			| "bottom right"
			| "left top"
			| "left center"
			| "left bottom"
			| "right top"
			| "right center"
			| "right bottom"
			| string; // 澹佺焊浣嶇疆锛屾敮鎸丆SS object-position鐨勬墍鏈夊€硷紝鍖呮嫭鐧惧垎姣斿拰鍍忕礌鍊?
		homeText?: {
			enable: boolean; // 鏄惁鍦ㄩ椤垫樉绀鸿嚜瀹氫箟鏂囧瓧锛堝叏灞€寮€鍏筹級
			switchable?: boolean; // 鏄惁鍏佽鐢ㄦ埛閫氳繃鎺у埗闈㈡澘鍒囨崲妯箙鏍囬鏄剧ず
			title?: string; // 涓绘爣棰?
			subtitle?: string | string[]; // 鍓爣棰橈紝鏀寔鍗曚釜瀛楃涓叉垨瀛楃涓叉暟缁?
			titleSize?: string; // 涓绘爣棰樺瓧浣撳ぇ灏忥紝濡?"3.5rem"
			subtitleSize?: string; // 鍓爣棰樺瓧浣撳ぇ灏忥紝濡?"1.5rem"
			typewriter?: {
				enable: boolean; // 鏄惁鍚敤鎵撳瓧鏈烘晥鏋?
				speed: number; // 鎵撳瓧閫熷害锛堟绉掞級
				deleteSpeed: number; // 鍒犻櫎閫熷害锛堟绉掞級
				pauseTime: number; // 瀹屾暣鏄剧ず鍚庣殑鏆傚仠鏃堕棿锛堟绉掞級
			};
		};
		credit?: {
			enable:
				| boolean
				| {
						desktop: boolean; // 妗岄潰绔槸鍚︽樉绀烘í骞呭浘鐗囨潵婧愭枃鏈?
						mobile: boolean; // 绉诲姩绔槸鍚︽樉绀烘í骞呭浘鐗囨潵婧愭枃鏈?
				  }; // 鏄惁鏄剧ず妯箙鍥剧墖鏉ユ簮鏂囨湰锛屾敮鎸佸竷灏斿€兼垨鍒嗗埆璁剧疆妗岄潰绔拰绉诲姩绔?
			text:
				| string
				| {
						desktop: string; // 妗岄潰绔樉绀虹殑鏉ユ簮鏂囨湰
						mobile: string; // 绉诲姩绔樉绀虹殑鏉ユ簮鏂囨湰
				  }; // 妯箙鍥剧墖鏉ユ簮鏂囨湰锛屾敮鎸佸瓧绗︿覆鎴栧垎鍒缃闈㈢鍜岀Щ鍔ㄧ
			url?:
				| string
				| {
						desktop: string; // 妗岄潰绔師濮嬭壓鏈搧鎴栬壓鏈椤甸潰鐨?URL 閾炬帴
						mobile: string; // 绉诲姩绔師濮嬭壓鏈搧鎴栬壓鏈椤甸潰鐨?URL 閾炬帴
				  }; // 鍘熷鑹烘湳鍝佹垨鑹烘湳瀹堕〉闈㈢殑 URL 閾炬帴锛屾敮鎸佸瓧绗︿覆鎴栧垎鍒缃闈㈢鍜岀Щ鍔ㄧ
		};
		navbar?: {
			transparentMode?: "semi" | "full" | "semifull"; // 瀵艰埅鏍忛€忔槑妯″紡
			enableBlur?: boolean; // 鏄惁寮€鍚瘺鐜荤拑妯＄硦鏁堟灉
			blur?: number; // 姣涚幓鐠冩ā绯婂害
		};
		waves?: {
			enable:
				| boolean
				| {
					desktop: boolean; // 妗岄潰绔槸鍚﹀惎鐢ㄦ按娉㈢汗鍔ㄧ敾鏁堟灉
					mobile: boolean; // 绉诲姩绔槸鍚﹀惎鐢ㄦ按娉㈢汗鍔ㄧ敾鏁堟灉
			  }; // 鏄惁鍚敤姘存尝绾瑰姩鐢绘晥鏋滐紝鏀寔甯冨皵鍊兼垨鍒嗗埆璁剧疆妗岄潰绔拰绉诲姩绔?
		switchable?: boolean; // 鏄惁鍏佽鐢ㄦ埛閫氳繃鎺у埗闈㈡澘鍒囨崲姘存尝绾瑰姩鐢?
		};
	};
	// 鍏ㄥ睆閫忔槑瑕嗙洊妯″紡鐗规湁閰嶇疆
	overlay?: {
		zIndex?: number; // 灞傜骇锛岀‘淇濆绾稿湪鍚堥€傜殑灞傜骇鏄剧ず
		opacity?: number; // 澹佺焊閫忔槑搴︼紝0-1涔嬮棿
		blur?: number; // 鑳屾櫙妯＄硦绋嬪害锛屽崟浣峱x
	};
};

// 骞垮憡鏍忛厤缃?
export type AdConfig = {
	title?: string; // 骞垮憡鏍忔爣棰?
	content?: string; // 骞垮憡鏍忔枃鏈唴瀹?
	image?: {
		src: string; // 鍥剧墖鍦板潃
		alt?: string; // 鍥剧墖鎻忚堪
		link?: string; // 鍥剧墖鐐瑰嚮閾炬帴
		external?: boolean; // 鏄惁澶栭儴閾炬帴
	};
	link?: {
		text: string; // 閾炬帴鏂囨湰
		url: string; // 閾炬帴鍦板潃
		external?: boolean; // 鏄惁澶栭儴閾炬帴
	};
	padding?: {
		top?: string; // 涓婅竟璺濓紝濡?"0", "1rem", "16px"
		right?: string; // 鍙宠竟璺?
		bottom?: string; // 涓嬭竟璺?
		left?: string; // 宸﹁竟璺?
		all?: string; // 缁熶竴杈硅窛锛屼細瑕嗙洊鍗曠嫭璁剧疆
	};
	closable?: boolean; // 鏄惁鍙叧闂?
	displayCount?: number; // 鏄剧ず娆℃暟闄愬埗锛?1涓烘棤闄愬埗
	expireDate?: string; // 杩囨湡鏃堕棿 (ISO 8601 鏍煎紡)
};

// 鍙嬮摼閰嶇疆
export type FriendLink = {
	title: string; // 鍙嬮摼鏍囬
	imgurl: string; // 澶村儚鍥剧墖URL
	desc: string; // 鍙嬮摼鎻忚堪
	siteurl: string; // 鍙嬮摼鍦板潃
	tags?: string[]; // 鏍囩鏁扮粍
	weight: number; // 鏉冮噸锛屾暟瀛楄秺澶ф帓搴忚秺闈犲墠
	enabled: boolean; // 鏄惁鍚敤
};

export type FriendsPageConfig = {
	title?: string; // 椤甸潰鏍囬锛岀暀绌哄垯浣跨敤 i18n 涓殑缈昏瘧
	description?: string; // 椤甸潰鎻忚堪锛岀暀绌哄垯浣跨敤 i18n 涓殑缈昏瘧
	showCustomContent?: boolean; // 鏄惁鏄剧ず鑷畾涔夊唴瀹癸紙friends.mdx锛?
	showComment?: boolean; // 鏄惁鏄剧ず璇勮鍖猴紝榛樿 true
	randomizeSort?: boolean; // 鏄惁鎵撲贡鎺掑簭锛屽鏋滀负 true锛屽皢蹇界暐 weight锛岄殢鏈烘帓搴?
};

// 璧炲姪鏂瑰紡绫诲瀷
export type SponsorMethod = {
	name: string; // 璧炲姪鏂瑰紡鍚嶇О锛屽 "鏀粯瀹?銆?寰俊"銆?PayPal"
	icon?: string; // 鍥炬爣鍚嶇О锛圛conify 鏍煎紡锛夛紝濡?"fa6-brands:alipay"
	qrCode?: string; // 鏀舵鐮佸浘鐗囪矾寰勶紙鐩稿浜?public 鐩綍锛夛紝鍙€?
	link?: string; // 璧炲姪閾炬帴 URL锛屽彲閫夈€傚鏋滄彁渚涳紝浼氭樉绀鸿烦杞寜閽?
	description?: string; // 鎻忚堪鏂囨湰
	enabled: boolean; // 鏄惁鍚敤
};

// 璧炲姪鑰呭垪琛ㄩ」
export type SponsorItem = {
	name: string; // 璧炲姪鑰呭悕绉帮紝濡傛灉鎯虫樉绀哄尶鍚嶏紝鍙互鐩存帴璁剧疆涓?鍖垮悕"鎴栦娇鐢?i18n
	amount?: string; // 璧炲姪閲戦锛堝彲閫夛級
	date?: string; // 璧炲姪鏃ユ湡锛堝彲閫夛紝ISO 鏍煎紡锛?
	message?: string; // 鐣欒█锛堝彲閫夛級
};

// 璧炲姪閰嶇疆
export type SponsorConfig = {
	title?: string; // 椤甸潰鏍囬锛岄粯璁や娇鐢?i18n
	description?: string; // 椤甸潰鎻忚堪鏂囨湰
	usage?: string; // 璧炲姪鐢ㄩ€旇鏄?
	methods: SponsorMethod[]; // 璧炲姪鏂瑰紡鍒楄〃
	sponsors?: SponsorItem[]; // 璧炲姪鑰呭垪琛紙鍙€夛級
	showSponsorsList?: boolean; // 鏄惁鏄剧ず璧炲姪鑰呭垪琛紝榛樿 true
	showComment?: boolean; // 鏄惁鏄剧ず璇勮鍖猴紝榛樿 false
	showButtonInPost?: boolean; // 鏄惁鍦ㄦ枃绔犺鎯呴〉搴曢儴鏄剧ず璧炲姪鎸夐挳锛岄粯璁?true
};

