/**
 * 抖音热搜 API 代理 - 解决跨域 CORS 问题
 * 客户端请求同源接口，由服务端转发到 newsnow.louaq.com
 */
const SOURCE_URL = "https://newsnow.louaq.com/api/s?id=douyin";

export async function GET({ request }: { request: Request }) {
	try {
		const url = new URL(request.url);
		// 支持 _t 防缓存参数透传
		const sourceUrl = url.searchParams.has("_t")
			? `${SOURCE_URL}&_t=${url.searchParams.get("_t")}`
			: SOURCE_URL;

		const res = await fetch(sourceUrl, {
			method: "GET",
			headers: {
				Accept: "application/json",
			},
			cache: "default",
		});

		if (!res.ok) {
			return new Response(
				JSON.stringify({ status: "error", message: `上游请求失败: ${res.status}` }),
				{
					status: res.status,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const data = await res.json();
		return new Response(JSON.stringify(data), {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (err) {
		console.error("[api/douyin] 代理请求失败:", err);
		return new Response(
			JSON.stringify({
				status: "error",
				message: err instanceof Error ? err.message : "代理请求失败",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
