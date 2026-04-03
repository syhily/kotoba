export async function GET(context: { params: Record<string, string | undefined> }) {
  const slug = context.params.slug ?? "untitled";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#111827"/><text x="64" y="280" font-size="56" fill="#f9fafb" font-family="sans-serif">Kotoba</text><text x="64" y="360" font-size="36" fill="#d1d5db" font-family="sans-serif">${escapeXml(slug)}</text></svg>`;
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
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
