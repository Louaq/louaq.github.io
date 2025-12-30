import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
	try {
		const url = new URL(request.url);
		// 只要带了 ts 参数，就认为是“手动强制刷新”，不走缓存
		const force = url.searchParams.has('ts');
		const ts = url.searchParams.get('ts') || '';

		const upstreamUrl = force
			? `https://newsnow.louaq.com/api/s?id=douyin&ts=${encodeURIComponent(ts)}`
			: 'https://newsnow.louaq.com/api/s?id=douyin';

		const response = await fetch(upstreamUrl, {
			method: 'GET',
			// 尽量避免服务端 fetch 复用缓存（不同运行时支持不同；不支持也没关系）
			cache: force ? 'no-store' : 'default',
			headers: {
				'Accept': 'application/json',
			},
		});

		if (!response.ok) {
			return new Response(
				JSON.stringify({
					error: `HTTP ${response.status}: ${response.statusText}`,
				}),
				{
					status: response.status,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		}

		const data = await response.json();

		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': force ? 'no-store' : 'public, max-age=300', // 手动刷新不缓存；自动刷新缓存5分钟
			},
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				error: error instanceof Error ? error.message : '请求失败',
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
};

