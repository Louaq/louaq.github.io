/**
 * 确定性字符串哈希（djb2 变体：h * 33 - h + c，截断为 32 位有符号整数）。
 *
 * 用于需要「同一输入每次构建都得到同一结果」的场景：随机封面图的 API 查询参数、
 * 兜底封面图的稳定选取等。非加密用途。
 *
 * 注意：这里刻意与 `url-utils.ts` 的 `getStablePostPathId` 保持独立——后者是
 * djb2-xor + FNV-1a 的组合，其输出直接构成文章 URL，改动会导致所有哈希模式的
 * 文章链接失效，因此不参与本函数的统一。
 */
export function stableHash(seed: string): number {
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
	}
	return hash;
}

/** 由种子稳定地取一个 `[0, length)` 区间内的下标 */
export function stableIndex(seed: string, length: number): number {
	return Math.abs(stableHash(seed)) % length;
}
