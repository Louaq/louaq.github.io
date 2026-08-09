import Key from "../i18nKey";
import type { Translation } from "../translation";

export const ja: Translation = {
	[Key.home]: "ホーム",
	[Key.about]: "について",
	[Key.archive]: "アーカイブ",
	[Key.search]: "検索",
	[Key.searchBy]: "Search by",
	[Key.searchKbdSelect]: "選択",
	[Key.searchKbdSwitch]: "移動",
	[Key.searchNoResults]: "結果が見つかりません。",
	[Key.searchLoading]: "検索中...",

	[Key.tags]: "タグ",
	[Key.categories]: "カテゴリ",
	[Key.tableOfContents]: "目次",
	[Key.tocEmpty]: "このページには目次がありません",

	// お知らせ
	[Key.announcement]: "お知らせ",
	[Key.announcementClose]: "閉じる",

	[Key.commentSection]: "コメント欄",
	[Key.commentSubtitle]: "あなたの考えを共有し、みんなと議論しましょう",
	[Key.commentNotConfigured]: "コメントシステムが設定されていません",
	[Key.guestbookCommentHint]:
		"設定ファイルでコメントシステムをまだ有効にしていません。有効にすると、訪問者がここにメッセージを残せるようになります",
	[Key.friends]: "友達",
	[Key.friendsDescription]:
		"ここは私の友達です、お互いに訪問して交流することを歓迎します",
	[Key.guestbook]: "ゲストブック",
	[Key.guestbookDescription]:
		"ここに足跡を残して、あなたの考えや提案を共有してください",
	[Key.uncategorized]: "未分類",
	[Key.noTags]: "タグなし",

	[Key.wordCount]: "語",
	[Key.wordsCount]: "語",
	[Key.minuteCount]: "分",
	[Key.minutesCount]: "分",
	[Key.postCount]: "投稿",
	[Key.postsCount]: "投稿",

	[Key.themeColor]: "テーマカラー",

	[Key.more]: "もっと",

	[Key.author]: "著者",
	[Key.publishedAt]: "公開日",
	[Key.license]: "ライセンス",
	[Key.bangumi]: "バングミ",
	[Key.watchlist]: "視聴",
	[Key.watchlistTitle]: "視聴リスト",
	[Key.watchlistSubtitle]: "最近視聴したアニメとテレビ番組を記録する",
	[Key.watchlistEmpty]: "視聴記録なし",
	[Key.watchlistEmptyReason]:
		"視聴記録がまだ追加されていません。設定ファイルに追加してください",
	[Key.watchlistLastUpdated]: "最終更新日",
	[Key.watchlistCategoryAnime]: "アニメ",
	[Key.watchlistCategoryMovie]: "映画",
	[Key.watchlistCategoryTV]: "テレビ番組",
	[Key.watchlistCategoryDocumentary]: "ドキュメンタリー",
	[Key.watchlistCategoryOther]: "その他",

	// バングミフィルターと状態文本
	[Key.bangumiSubtitle]: "私の二次元の旅を記録する",
	[Key.bangumiFilterAll]: "すべて",
	[Key.bangumiFilterWatched]: "見た",
	[Key.bangumiFilterWatching]: "視聴中",
	[Key.bangumiFilterWish]: "見たい",
	[Key.bangumiFilterOnHold]: "保留",
	[Key.bangumiFilterDropped]: "中断",
	[Key.bangumiFilterGamePlayed]: "プレイ済み",
	[Key.bangumiFilterGamePlaying]: "プレイ中",
	[Key.bangumiFilterGameWish]: "プレイしたい",
	[Key.bangumiFilterBookRead]: "読んだ",
	[Key.bangumiFilterBookReading]: "読んでいる",
	[Key.bangumiFilterBookWish]: "読みたい",
	[Key.bangumiFilterMusicListened]: "聴いた",
	[Key.bangumiFilterMusicListening]: "聴いている",
	[Key.bangumiFilterMusicWish]: "聴きたい",
	[Key.bangumiStatusWish]: "見たい",
	[Key.bangumiStatusWatched]: "見た",
	[Key.bangumiStatusWatching]: "視聴中",
	[Key.bangumiStatusOnHold]: "保留",
	[Key.bangumiStatusDropped]: "中断",
	[Key.bangumiStatusGameWish]: "プレイしたい",
	[Key.bangumiStatusGamePlayed]: "プレイ済み",
	[Key.bangumiStatusGamePlaying]: "プレイ中",
	[Key.bangumiStatusBookWish]: "読みたい",
	[Key.bangumiStatusBookRead]: "読んだ",
	[Key.bangumiStatusBookReading]: "読んでいる",
	[Key.bangumiStatusMusicWish]: "聴きたい",
	[Key.bangumiStatusMusicListened]: "聴いた",
	[Key.bangumiStatusMusicListening]: "聴いている",
	[Key.bangumiStatusUnknown]: "不明",
	[Key.bangumiNoData]: "データなし",
	[Key.bangumiNoDataDescription]: "このカテゴリに項目がありません",
	[Key.bangumiEmpty]: "データなし",
	[Key.bangumiEmptyReason]:
		"考えられる理由：ユーザー名が存在しない、ネットワーク接続の問題、またはAPI制限",

	// バングミカテゴリ
	[Key.bangumiCategoryBook]: "本",
	[Key.bangumiCategoryAnime]: "アニメ",
	[Key.bangumiCategoryMusic]: "音楽",
	[Key.bangumiCategoryGame]: "ゲーム",
	[Key.bangumiCategoryReal]: "実写",

	// バングミデータ更新
	[Key.bangumiLastUpdated]: "データ更新",

	// バナー設定
	[Key.bannerSettings]: "バナー設定",
	[Key.bannerTitle]: "バナータイトル",

	// ページネーション
	[Key.paginationPrev]: "前へ",
	[Key.paginationNext]: "次へ",
	[Key.paginationPage]: "",
	[Key.paginationJumpTo]: "ページ移動",
	[Key.paginationJumpPageUnit]: "ページ",
	[Key.paginationGo]: "移動",
	[Key.paginationJumpInvalid]: "ページ番号は数字で入力してください",

	// 404ページ
	[Key.notFound]: "404",
	[Key.notFoundTitle]: "ページが見つかりません",
	[Key.notFoundDescription]:
		"申し訳ありませんが、アクセスしたページは存在しないか、移動されています。",
	[Key.backToHome]: "ホームに戻る",

	// RSSページ
	[Key.rss]: "RSSフィード",
	[Key.rssDescription]: "最新の更新を購読する",
	[Key.rssSubtitle]: "RSSで購読して、最新の記事と更新を第一时间で取得する",
	[Key.rssLink]: "RSSリンク",
	[Key.rssCopyToReader]: "RSSリンクをリーダーにコピー",
	[Key.rssCopyLink]: "リンクをコピー",
	[Key.rssLatestPosts]: "最新の投稿",
	[Key.rssWhatIsRSS]: "RSSとは？",
	[Key.rssWhatIsRSSDescription]:
		"RSS（Really Simple Syndication）は、頻繁に更新されるコンテンツを公開するための標準形式です。RSSを使用すると：",
	[Key.rssBenefit1]:
		"手動で訪問することなく、最新のウェブサイトコンテンツを及时に取得",
	[Key.rssBenefit2]: "1か所で複数のウェブサイトの購読を管理",
	[Key.rssBenefit3]: "重要な更新や記事を見逃すことを回避",
	[Key.rssBenefit4]: "広告なしのクリーンな読書体験を楽しむ",
	[Key.rssHowToUse]:
		"Feedly、Inoreaderまたは他のRSSリーダーを使用してこのサイトを購読することを推奨します。",
	[Key.rssCopied]: "RSSリンクがクリップボードにコピーされました！",
	[Key.rssCopyFailed]: "コピーに失敗しました。手動でリンクをコピーしてください",

	// 最終更新時間カード
	[Key.lastModifiedPrefix]: "最終更新日：",
	[Key.lastModifiedOutdated]: "一部の内容が古くなっている可能性があります",
	[Key.lastModifiedDaysAgo]: "{days}日前",
	[Key.lastModifiedNoticeTitle]: "お知らせ",
	[Key.lastModifiedNoticeJoiner]: "。",
	[Key.year]: "年",

	// ページビュー統計
	[Key.pageViews]: "閲覧数",
	[Key.pageViewsLoading]: "読み込み中...",

	// 投稿リストレイアウト
	[Key.postListLayout]: "投稿リストレイアウト",
	[Key.postListLayoutList]: "リスト",
	[Key.postListLayoutGrid]: "グリッド",

	// ピン留め
	[Key.pinned]: "ピン留め",

	// 壁紙モード
	[Key.wallpaperMode]: "壁紙モード",
	[Key.wallpaperBannerMode]: "バナー壁紙",
	[Key.wallpaperOverlayMode]: "透明",
	[Key.wallpaperNoneMode]: "単色背景",

	// スポンサーページ
	[Key.sponsor]: "スポンサー",
	[Key.sponsorTitle]: "サポート",
	[Key.sponsorDescription]:
		"私のコンテンツがあなたの役に立ったなら、以下の方法で私をスポンサーしてください。あなたのサポートは私の継続的な創作の原動力です！",
	[Key.sponsorList]: "スポンサーリスト",
	[Key.sponsorEmpty]: "スポンサー記録なし",
	[Key.scanToSponsor]: "スキャンしてスポンサー",
	[Key.sponsorGoTo]: "スポンサーへ",
	[Key.sponsorButton]: "サポートと共有",
	[Key.sponsorButtonText]:
		"この記事が役に立ったなら、共有またはサポートをお願いします！",

	// サイト統計
	[Key.siteStats]: "サイト統計",
	[Key.siteStatsPostCount]: "記事",
	[Key.siteStatsCategoryCount]: "カテゴリー",
	[Key.siteStatsTagCount]: "タグ",
	[Key.siteStatsTotalWords]: "総文字数",
	[Key.siteStatsRunningDays]: "運用日数",
	[Key.siteStatsLastUpdate]: "最終活動",
	[Key.siteStatsDaysAgo]: "{days} 日前",
	[Key.siteStatsDays]: "{days} 日",
	[Key.today]: "今日",

	// サイト稼働時間
	[Key.siteRuntime]: "サイト稼働時間",
	[Key.siteRuntimeUnitDay]: "日",
	[Key.siteRuntimeUnitYear]: "年",
	[Key.siteRuntimeUnitMonth]: "ヶ月",

	// フッター訪問者カウント
	[Key.visitorSitePv]: "総閲覧数",
	[Key.visitorSiteUv]: "総訪問者数",

	// カレンダーコンポーネント
	[Key.calendarSunday]: "日",
	[Key.calendarMonday]: "月",
	[Key.calendarTuesday]: "火",
	[Key.calendarWednesday]: "水",
	[Key.calendarThursday]: "木",
	[Key.calendarFriday]: "金",
	[Key.calendarSaturday]: "土",
	[Key.calendarJanuary]: "1月",
	[Key.calendarFebruary]: "2月",
	[Key.calendarMarch]: "3月",
	[Key.calendarApril]: "4月",
	[Key.calendarMay]: "5月",
	[Key.calendarJune]: "6月",
	[Key.calendarJuly]: "7月",
	[Key.calendarAugust]: "8月",
	[Key.calendarSeptember]: "9月",
	[Key.calendarOctober]: "10月",
	[Key.calendarNovember]: "11月",
	[Key.calendarDecember]: "12月",

	// コードブロック折りたたみ設定
	[Key.codeCollapsibleShowMore]: "もっと見る",
	[Key.codeCollapsibleShowLess]: "折りたたむ",
	[Key.codeCollapsibleExpanded]: "コードブロックを展開しました",
	[Key.codeCollapsibleCollapsed]: "コードブロックを折りたたみました",
};
