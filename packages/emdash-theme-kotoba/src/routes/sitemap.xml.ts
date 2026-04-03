import { queryPagesForSitemap } from "../query/sitemap.ts";

export async function GET(context: { site?: URL }) {
  const site = context.site?.origin ?? "";
  const urls = await queryPagesForSitemap();
  const body = urls.map((path) => `<url><loc>${escapeXml(`${site}${path}`)}</loc></url>`).join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
}

function escapeXml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
