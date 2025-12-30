import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
	try {
		const response = await fetch('https://newsnow.louaq.com/api/s?id=douyin', {
			method: 'GET',
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
				'Cache-Control': 'public, max-age=300', // 缓存5分钟
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

