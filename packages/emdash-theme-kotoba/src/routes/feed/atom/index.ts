import { queryPosts } from "../../../query/content.ts";

export async function GET() {
  const posts = await queryPosts(20);
  const entries = posts
    .map(
      (post) =>
        `<entry><title>${escapeXml(String(post.data.title ?? post.id))}</title><id>/posts/${post.id}</id><link href="/posts/${post.id}" /></entry>`,
    )
    .join("");
  const atom = `<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>Kotoba</title>${entries}</feed>`;
  return new Response(atom, {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });
}

function escapeXml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
