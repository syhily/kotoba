import { queryPostsByCategory } from '../../../../query/content.ts'

export async function GET(context: { params: Record<string, string | undefined> }) {
  const slug = context.params.slug
  if (!slug) return new Response('Missing slug', { status: 400 })
  const posts = await queryPostsByCategory(slug)
  const items = posts
    .map((post) => {
      const title = typeof post.data.title === 'string' ? post.data.title : post.id
      return `<item><title>${escapeXml(title)}</title></item>`
    })
    .join('')
  const rss = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Category ${escapeXml(slug)}</title>${items}</channel></rss>`
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
