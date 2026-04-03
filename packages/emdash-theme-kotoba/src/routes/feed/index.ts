import { queryPosts } from '../../query/content.ts'

export async function GET() {
  const posts = await queryPosts(20)
  const items = posts
    .map(
      (post) =>
        `<item><title>${escapeXml(String(post.data.title ?? post.id))}</title><link>/posts/${post.id}</link></item>`,
    )
    .join('')
  const rss = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Kotoba</title>${items}</channel></rss>`
  return new Response(rss, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}

function escapeXml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
