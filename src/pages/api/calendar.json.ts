import { getSortedPosts } from "@/utils/content-utils";
import { formatDateToYYYYMMDD } from "@/utils/date-utils";

export async function GET() {
	const posts = await getSortedPosts();

	const allPostsData = posts.map((post) => ({
		id: post.id,
		title: post.data.title,
		published: formatDateToYYYYMMDD(post.data.published),
	}));

	return new Response(JSON.stringify(allPostsData));
}
