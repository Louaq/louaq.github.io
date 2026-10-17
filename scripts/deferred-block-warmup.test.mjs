import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(
	new URL("../src/utils/deferred-block-warmup.ts", import.meta.url),
	"utf8",
);
const { outputText } = ts.transpileModule(source, {
	compilerOptions: { module: ts.ModuleKind.CommonJS },
});

test("不支持空闲回调的浏览器仍可完成初始化并预热正文", async () => {
	const timers = new Map();
	const frames = [];
	const listeners = new Map();
	const block = { style: { contentVisibility: "" } };
	let nextTimer = 0;
	const window = {
		innerWidth: 1180,
		setTimeout(callback) {
			timers.set(++nextTimer, callback);
			return nextTimer;
		},
		clearTimeout(id) {
			timers.delete(id);
		},
		addEventListener(name, callback) {
			listeners.set(name, callback);
		},
	};
	const exports = {};
	runInNewContext(outputText, {
		exports,
		window,
		document: {
			fonts: { ready: Promise.resolve() },
			querySelectorAll: () => [block],
		},
		requestAnimationFrame: (callback) => frames.push(callback),
	});

	// 这里的异常会中断 Layout.astro 后续的 Swup 布局钩子注册。
	assert.doesNotThrow(() => exports.warmUpDeferredBlocks());
	assert.equal(listeners.has("resize"), true);
	// 连续换页应取消上一批预热，只处理最新页面。
	assert.doesNotThrow(() => exports.warmUpDeferredBlocks());
	assert.equal(timers.size, 1);
	const [callback] = timers.values();
	callback();
	await Promise.resolve();
	assert.equal(block.style.contentVisibility, "visible");
	frames.shift()();
	frames.shift()();
	assert.equal(block.style.contentVisibility, "");
});
