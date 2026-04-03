import { trackView } from "../../../../query/metrics.ts";

export async function POST(context: { request: Request }) {
  const payload = (await context.request.json().catch(() => ({}))) as {
    key?: string;
    sessionId?: string;
  };
  if (!payload.key || !payload.sessionId) {
    return Response.json({ error: "key and sessionId required" }, { status: 400 });
  }
  return Response.json(trackView(payload.key, payload.sessionId));
}
