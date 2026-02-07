import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

// 截断文本到指定字节大小
function truncateToBytes(str: string, maxBytes: number): string {
  const encoder = new TextEncoder();
  let bytes = encoder.encode(str);
  
  if (bytes.length <= maxBytes) {
    return str;
  }
  
  // 截断到安全字节数
  let truncated = str;
  while (encoder.encode(truncated).length > maxBytes) {
    truncated = truncated.slice(0, Math.floor(truncated.length * 0.9));
  }
  
  return truncated + '...';
}

// 估算对象的字节大小
function estimateObjectSize(obj: any): number {
  return new TextEncoder().encode(JSON.stringify(obj)).length;
}

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts');
  
  // 过滤掉草稿和未发布的文章
  const publishedPosts = posts.filter(post => !post.data.draft);
  
  const algoliaData = publishedPosts.map((post) => {
    // Algolia 限制每条记录最大 10KB (10000 bytes)
    // 预留 2KB 给其他字段,内容最多 8KB
    const maxContentBytes = 8000;
    
    // 截断内容
    const body = post.body ?? "";
    const truncatedContent = truncateToBytes(body, maxContentBytes);
    
    const record = {
      objectID: post.id,
      title: post.data.title,
      description: post.data.description || '',
      content: truncatedContent,
      published: post.data.published.toISOString(),
      updated: post.data.updated?.toISOString() || post.data.published.toISOString(),
      tags: post.data.tags || [],
      category: post.data.category || '',
      author: post.data.author || '',
      url: `/posts/${post.id}/`,
    };
    
    // 如果记录仍然太大,进一步缩减内容
    let recordSize = estimateObjectSize(record);
    while (recordSize > 9500) { // 留500字节缓冲
      record.content = truncateToBytes(record.content, Math.floor(record.content.length * 0.8));
      recordSize = estimateObjectSize(record);
    }
    
    return record;
  });

  return new Response(
    JSON.stringify(algoliaData, null, 2),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};
