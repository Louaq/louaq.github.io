/**
 * 阿里云 OSS 图片处理参数注入。
 *
 * 站点正文/封面图托管在两处外部 CDN：
 * - 阿里云 OSS（`*.aliyuncs.com`）：支持 `?x-oss-process=image/...` 服务端转码
 * - imgdb（`pic1.imgdb.cn`）：不支持任何 URL 缩放参数
 *
 * 这里只处理前者。原图基本是未压缩的 PNG 截图（抽样均值 ~425KB/张，最大一张
 * 6MB），转成限宽 webp 后通常能掉 70~90%。
 *
 * **刻意做成构建期 URL 改写，而不是批量改写 markdown 源文件**：内容目录里有
 * 400+ 条外链，脚本化改写过一次并出过覆盖事故；改写发生在渲染管线里则完全
 * 不碰源文件，删掉调用即可回滚，且对以后新写的文章自动生效。
 */

/** 支持 x-oss-process 的主机名后缀 */
const OSS_HOST_SUFFIX = ".aliyuncs.com";

/** 只对这些扩展名做转码；其余（含 .pdf / .svg / .gif）原样放行 */
const TRANSFORMABLE = /\.(png|jpe?g|webp|bmp|tiff?)$/i;

export interface OssImageOptions {
	/** 最大宽度（px）。OSS 的 resize 默认 limit_1，不会放大小图 */
	width: number;
	/** webp 质量，1-100 */
	quality?: number;
}

/**
 * 给阿里云 OSS 图片 URL 追加限宽 + webp 转码参数。
 * 非 OSS、非图片、已带 x-oss-process 的 URL 原样返回（幂等）。
 */
export function withOssImageProcess(
	src: string | undefined | null,
	options: OssImageOptions,
): string {
	if (!src) return "";
	if (!/^https?:\/\//i.test(src)) return src;

	let parsed: URL;
	try {
		parsed = new URL(src);
	} catch {
		return src;
	}

	if (!parsed.hostname.endsWith(OSS_HOST_SUFFIX)) return src;
	// 已经手工带了处理参数就别覆盖作者的意图
	if (parsed.searchParams.has("x-oss-process")) return src;
	if (!TRANSFORMABLE.test(parsed.pathname)) return src;

	const quality = options.quality ?? 80;
	const process = `image/resize,w_${options.width}/format,webp/quality,q_${quality}`;
	// 手工拼接而不用 searchParams.set：后者会把 `/` `,` 转义成 %2F/%2C。
	// OSS 两种写法都认，但未转义的可读性好得多（出问题时能直接复制到浏览器里试）。
	const separator = parsed.search ? "&" : "?";
	return `${parsed.href}${separator}x-oss-process=${process}`;
}
