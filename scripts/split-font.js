#!/usr/bin/env node
/* 把正文 CJK 字体按「站点用字分层」切成两个 woff2，让列表页不必下载只有正文才用到的字。
 *
 * 顺序：pnpm subset-font  →  pnpm build  →  pnpm split-font  →  提交产物
 *
 * 需要先 build：分层依据是「哪些字真的被渲染到了哪类页面上」，只能从 dist/ 的
 * HTML 里数。早先试过直接扫 src/ 源码，结果 Tier A 反而涨到 339KB——因为这个
 * 仓库的注释里有大量中文，而它们一个都不会显示出来。
 *
 * 和 subset-font 一样是**手动步骤、产物入库**，不进 CI：pyftsubset 依赖 Python
 * fonttools，不能假设部署环境有。新文章若用到两层都没有的字，会优雅回退到系统
 * 字体（不破版），重跑这套流程即可补齐。
 *
 * ── 为什么不是常见的 unicode-range 分片 ─────────────────────────────────
 * 通用做法（cn-font-split 之类）是把字体按码位切成几十上百片，靠 unicode-range
 * 让浏览器按需取。那套办法的前提是**源字体覆盖上万汉字**，单页只用到其中很小
 * 且相对集中的一块。
 *
 * 本站不满足这个前提：subset-font 已经把字体裁到「全站真正用到的 ~2000 字」，
 * 而单页用到的一两百字**散布在整个码位空间**。实测（chunkSize 4/8/16/40/80KB）
 * 每种切法都更差——最好的一档是「360KB / 102 个请求」，仍不如整包的
 * 「454KB / 1 个请求」，其余各档在体积和请求数上双输。已放弃该方案。
 *
 * ── 实际采用的分层 ────────────────────────────────────────────────────
 * 按「这个字会不会出现在非文章页」分两层，各自带精确的 unicode-range：
 *   Tier A = 所有非 /posts/ 页面（首页/归档/分类/标签/关于…）渲染出来的字，
 *            天然包含站点 UI 与文章标题、摘要、标签、分类
 *   Tier B = 只在文章正文里出现的字
 * 列表页只会命中 Tier A，文章页两层都要。
 *
 * 输入是 subset-font 的产物（8MB 原始 TTF 没进仓库）。
 */

import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SRC = path.join(root, "font-src/HarmonyOS_Sans_SC-subset.woff2");
const OUT_DIR = path.join(root, "public/font/harmony");
const CSS_FILE = path.join(OUT_DIR, "result.css");
// tier 名 → 实际（带内容哈希的）文件名，供 FontSetup.astro 生成 preload 链接
const MANIFEST_FILE = path.join(OUT_DIR, "manifest.json");

// 必须与 fontConfig.body.family 一致，否则 CSS 变量指向的族名匹配不上
const FONT_FAMILY = "HarmonyOS Sans SC";

const DIST = path.join(root, "dist");

// ASCII + 常用中英标点：任何页面都可能出现（含运行时拼出的日期/数字），恒入 Tier A
const BASE_CHARS =
	" \t\r\n" +
	Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join("") +
	"，。、；：？！“”‘’（）【】《》…—·～「」『』〈〉﹏﹍﹎";

function walkHtml(dir, files = []) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) walkHtml(full, files);
		else if (entry.name.endsWith(".html")) files.push(full);
	}
	return files;
}

/** 取页面上真正会被渲染的文字：去掉标签本身，以及 script/style 的内容 */
function renderedText(file) {
	return fs
		.readFileSync(file, "utf-8")
		.replace(/<script[\s\S]*?<\/script>/g, " ")
		.replace(/<style[\s\S]*?<\/style>/g, " ")
		.replace(/<[^>]+>/g, " ");
}

if (!fs.existsSync(DIST)) {
	console.error(
		`dist/ 不存在：${DIST}\n分层依据是构建产物里的 HTML，请先运行 \`pnpm build\`。`,
	);
	process.exit(1);
}

const pages = walkHtml(DIST);
const postPrefix = `${path.sep}posts${path.sep}`;

const tierA = new Set(BASE_CHARS);
const allChars = new Set(BASE_CHARS);

for (const page of pages) {
	const isPost = page.includes(postPrefix);
	for (const ch of renderedText(page)) {
		allChars.add(ch);
		if (!isPost) tierA.add(ch);
	}
}

const tierB = new Set([...allChars].filter((ch) => !tierA.has(ch)));

const postCount = pages.filter((p) => p.includes(postPrefix)).length;
console.log(
	`扫描 ${pages.length} 个页面（其中文章页 ${postCount}）\n` +
		`Tier A (非文章页渲染用字): ${tierA.size} 字符\n` +
		`Tier B (仅正文出现): ${tierB.size} 字符`,
);

if (!fs.existsSync(SRC)) {
	console.error(
		`source font not found: ${SRC}\n先运行 \`pnpm subset-font\` 生成子集 woff2。`,
	);
	process.exit(1);
}

/** 把码位集合压成紧凑的 CSS unicode-range 列表（合并连续区间） */
function toUnicodeRange(chars) {
	const cps = [...chars]
		.map((c) => c.codePointAt(0))
		// 控制字符不需要（也不应该）出现在 unicode-range 里
		.filter((cp) => cp >= 0x20)
		.sort((a, b) => a - b);

	const parts = [];
	let start = cps[0];
	let prev = cps[0];
	const hex = (n) => n.toString(16).toUpperCase().padStart(4, "0");

	for (const cp of cps.slice(1)) {
		if (cp === prev + 1) {
			prev = cp;
			continue;
		}
		parts.push(
			start === prev ? `U+${hex(start)}` : `U+${hex(start)}-${hex(prev)}`,
		);
		start = cp;
		prev = cp;
	}
	parts.push(
		start === prev ? `U+${hex(start)}` : `U+${hex(start)}-${hex(prev)}`,
	);
	return parts.join(",");
}

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const tiers = [
	{ name: "tier-a", chars: tierA },
	{ name: "tier-b", chars: tierB },
];

const faces = [];
for (const tier of tiers) {
	const charsFile = path.join(OUT_DIR, `.${tier.name}-chars.txt`);
	const tmpFile = path.join(OUT_DIR, `${tier.name}.tmp.woff2`);
	fs.writeFileSync(charsFile, [...tier.chars].join(""), "utf-8");

	try {
		execFileSync(
			"pyftsubset",
			[
				SRC,
				`--output-file=${tmpFile}`,
				`--text-file=${charsFile}`,
				"--flavor=woff2",
				"--layout-features=*",
				"--notdef-glyph",
				"--notdef-outline",
				"--recommended-glyphs",
				"--drop-tables=",
				"--desubroutinize",
			],
			{ stdio: "inherit" },
		);
	} finally {
		fs.rmSync(charsFile, { force: true });
	}

	// 文件名带内容哈希：改字体必然换名，_headers / vercel.json 才能安全地
	// 对 woff2 配 immutable。旧文件名的缓存会随 result.css（must-revalidate）
	// 更新自然失效。
	const data = fs.readFileSync(tmpFile);
	const hash = crypto.createHash("sha256").update(data).digest("hex").slice(0, 8);
	const fileName = `${tier.name}.${hash}.woff2`;
	fs.renameSync(tmpFile, path.join(OUT_DIR, fileName));

	faces.push({
		tier: tier.name,
		file: fileName,
		size: data.length,
		range: toUnicodeRange(tier.chars),
	});
}

// tier → 文件名映射，FontSetup.astro 据此给 tier-a 加 <link rel="preload">
fs.writeFileSync(
	MANIFEST_FILE,
	`${JSON.stringify(
		Object.fromEntries(faces.map((f) => [f.tier, f.file])),
		null,
		"\t",
	)}\n`,
	"utf-8",
);

// result.css 文件名固定（被 fontConfig.body.css 引用），配 must-revalidate；
// 它引用的 woff2 已带内容哈希，可以 immutable
const css = `/* Generated by scripts/split-font.js — 不要手改，重跑 \`pnpm split-font\` 即可
 * Tier A = 站点框架 + 文章 frontmatter（列表页只需要这一层）
 * Tier B = 仅出现在文章正文里的字
 */
${faces
	.map(
		(face) =>
			`@font-face{font-family:"${FONT_FAMILY}";src:local("HarmonyOS Sans SC"),local("HarmonyOS_Sans_SC"),url("./${face.file}")format("woff2");font-style:normal;font-weight:400;font-display:swap;unicode-range:${face.range}}`,
	)
	.join("\n")}
`;
fs.writeFileSync(CSS_FILE, css, "utf-8");

const srcSize = fs.statSync(SRC).size;
console.log(
	`\nDone (source ${(srcSize / 1024).toFixed(0)}KB):\n` +
		faces
			.map(
				(f) =>
					`  ${f.file.padEnd(22)} ${(f.size / 1024).toFixed(0).padStart(4)} KB`,
			)
			.join("\n") +
		`\n  ${"result.css".padEnd(22)} ${(fs.statSync(CSS_FILE).size / 1024).toFixed(0).padStart(4)} KB` +
		"\n\n列表页只下 tier-a；文章页两层都下。",
);
