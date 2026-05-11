import { getSortedPosts } from "@/utils/content-utils";
import { formatDateToYYYYMMDD } from "@/utils/date-utils";
import { getResolvedPostPath } from "@/utils/url-utils";

export async function GET() {
	const posts = await getSortedPosts();

	const allPostsData = posts.map((post) => ({
		id: post.id,
		pathSlug: getResolvedPostPath(post.id, post.data),
		title: post.data.title,
		published: formatDateToYYYYMMDD(post.data.published),
	}));

	return new Response(JSON.stringify(allPostsData));
}
