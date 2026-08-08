#!/usr/bin/env node

/**
 * 裁剪 public/pdfjs/ 里用不到的 pdf.js viewer 资源。
 *
 * 背景：全站只有一篇文章用 `::pdf{...}` 内嵌 viewer，但 pdf.js 官方发行包自带
 * 111 种界面语言、169 个 CJK CMap、以及只有「PDF 内嵌 JavaScript 表单」才会
 * 用到的 sandbox bundle。这些都是纯部署体积（运行时按需请求，用不到就不下载），
 * 但会让仓库和部署包白白多出好几 MB。
 *
 * 这个脚本是**幂等**的：已经删掉的会被跳过，可以在升级 pdf.js 后重复运行。
 * 用法：node scripts/prune-pdfjs.js  [--dry-run]
 *
 * 注意：升级 pdf.js 后除了重跑本脚本，还要重新把 viewer.mjs 里
 * `enableScripting` 的默认值改回 false（见下方 SCRIPTING 说明）。
 */

import { existsSync } from "node:fs";
import { readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PDFJS = path.join(ROOT, "public", "pdfjs");
const DRY_RUN = process.argv.includes("--dry-run");

/** 保留的 viewer 界面语言（其余语言会回退到 en-US） */
const KEEP_LOCALES = new Set(["en-US", "zh-CN", "zh-TW"]);

/**
 * 保留的 CMap 前缀：只留中文（GB = 简体，CNS/B5/ETen/HK = 繁体）。
 * 日文（Adobe-Japan1 / RKSJ / UniJIS / EUC / Ext / 78* / 83* / 90* / Add / NWP /
 * Hiragana / Katakana / Hankaku / Roman / H / V）与韩文（Adobe-Korea1 / KSC /
 * UniKS）在本站不可能出现，删掉。
 *
 * CMap 只有在 PDF 使用「预定义 CMap 的 CID 字体」时才会被请求；即便真的碰上
 * 日韩 PDF，也只影响该 PDF 的字形映射，不会让 viewer 崩溃。
 */
const KEEP_CMAP_PREFIXES = [
	"Adobe-CNS1-",
	"Adobe-GB1-",
	"Adobe-Identity-",
	"B5",
	"CNS",
	"ETHK-",
	"ETen",
	"GB",
	"HK",
	"UniCNS-",
	"UniGB-",
];
const KEEP_CMAP_EXACT = new Set(["LICENSE"]);

/**
 * SCRIPTING：pdf.sandbox.mjs 只服务于 PDF 内嵌 JavaScript（AcroForm 脚本）。
 * 博客里内嵌的是静态论文 PDF，永远用不到。删掉文件的同时必须把 viewer 的
 * `enableScripting` 默认值改成 false，否则遇到带脚本的 PDF 会去请求一个 404。
 */
const SANDBOX_FILE = path.join(PDFJS, "build", "pdf.sandbox.mjs");
const VIEWER_MJS = path.join(PDFJS, "web", "viewer.mjs");

let removedBytes = 0;
let removedCount = 0;

async function remove(target, label) {
	if (!existsSync(target)) return;
	const size = await dirSize(target);
	if (DRY_RUN) {
		console.log(`  [dry-run] would remove ${label} (${kb(size)})`);
	} else {
		await rm(target, { recursive: true, force: true });
		console.log(`  removed ${label} (${kb(size)})`);
	}
	removedBytes += size;
	removedCount += 1;
}

async function dirSize(target) {
	const info = await stat(target);
	if (!info.isDirectory()) return info.size;
	let total = 0;
	for (const entry of await readdir(target, { withFileTypes: true })) {
		total += await dirSize(path.join(target, entry.name));
	}
	return total;
}

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function pruneLocales() {
	const localeDir = path.join(PDFJS, "web", "locale");
	if (!existsSync(localeDir)) return;
	console.log("locale/");

	const entries = await readdir(localeDir, { withFileTypes: true });
	for (const entry of entries) {
		if (!entry.isDirectory() || KEEP_LOCALES.has(entry.name)) continue;
		await remove(path.join(localeDir, entry.name), `locale/${entry.name}`);
	}

	// locale.json 是 viewer 的语言清单，必须与实际保留的目录一致。
	// 注意它的 key 是小写 BCP-47（"zh-cn"），而 value/目录名保留原始大小写
	// （"zh-CN/viewer.ftl"），所以这里按 value 指向的目录来判断保留与否。
	const manifest = path.join(localeDir, "locale.json");
	if (!existsSync(manifest)) return;
	const current = JSON.parse(await readFile(manifest, "utf-8"));
	const next = Object.fromEntries(
		Object.entries(current).filter(([, file]) =>
			KEEP_LOCALES.has(String(file).split("/")[0]),
		),
	);
	if (Object.keys(next).length === Object.keys(current).length) return;
	if (DRY_RUN) {
		console.log(
			`  [dry-run] would rewrite locale.json: ${Object.keys(current).length} -> ${Object.keys(next).length} entries`,
		);
	} else {
		await writeFile(manifest, `${JSON.stringify(next)}\n`, "utf-8");
		console.log(
			`  rewrote locale.json: ${Object.keys(current).length} -> ${Object.keys(next).length} entries`,
		);
	}
}

async function pruneCmaps() {
	const cmapDir = path.join(PDFJS, "web", "cmaps");
	if (!existsSync(cmapDir)) return;
	console.log("cmaps/");

	const keep = (name) =>
		KEEP_CMAP_EXACT.has(name) ||
		KEEP_CMAP_PREFIXES.some((prefix) => name.startsWith(prefix));

	for (const name of await readdir(cmapDir)) {
		if (keep(name)) continue;
		await remove(path.join(cmapDir, name), `cmaps/${name}`);
	}
}

async function pruneSandbox() {
	console.log("build/");
	await remove(SANDBOX_FILE, "build/pdf.sandbox.mjs");

	if (!existsSync(VIEWER_MJS)) return;
	const source = await readFile(VIEWER_MJS, "utf-8");
	// AppOptions 里的 `enableScripting: { value: true, ... }`（对行尾/缩进不敏感）
	const pattern = /(enableScripting:\s*\{\s*value:\s*)true/;
	if (!pattern.test(source)) {
		if (/enableScripting:\s*\{\s*value:\s*false/.test(source)) {
			console.log("  viewer.mjs: enableScripting already disabled");
		} else {
			console.warn(
				"  ⚠ viewer.mjs: 找不到 enableScripting 默认值，请手动确认（pdf.js 可能已升级）",
			);
		}
		return;
	}
	if (DRY_RUN) {
		console.log("  [dry-run] would set viewer.mjs enableScripting -> false");
		return;
	}
	await writeFile(VIEWER_MJS, source.replace(pattern, "$1false"), "utf-8");
	console.log("  viewer.mjs: enableScripting -> false");
}

if (!existsSync(PDFJS)) {
	console.error(`public/pdfjs 不存在：${PDFJS}`);
	process.exit(1);
}

console.log(`Pruning pdf.js assets${DRY_RUN ? " (dry run)" : ""}\n`);
await pruneLocales();
await pruneCmaps();
await pruneSandbox();
console.log(
	`\n${DRY_RUN ? "Would remove" : "Removed"} ${removedCount} item(s), ${(removedBytes / 1024 / 1024).toFixed(2)} MB`,
);
