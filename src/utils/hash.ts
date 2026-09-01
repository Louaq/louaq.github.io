import { createHash } from "node:crypto";

/**
 * 由种子稳定地取一个 `[0, length)` 区间内的下标。
 *
 * 用于需要「同一输入每次构建都得到同一结果」的场景，目前是 PostCard 从兜底图池中
 * 按文章 id 稳定选取封面图。只在构建期（服务端）调用，非加密用途。
 *
 * 注意：与 `url-utils.ts` 的 `getStablePostPathId` 刻意保持独立——后者的输出直接
 * 构成文章 URL，且必须在浏览器里也能算，改动会导致所有哈希模式的文章链接失效。
 */
export function stableIndex(seed: string, length: number): number {
	return createHash("md5").update(seed).digest().readUInt32BE(0) % length;
}
