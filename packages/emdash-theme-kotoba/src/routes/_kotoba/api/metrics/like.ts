import { getMetrics, toggleLike } from '../../../../query/metrics.ts'

export async function GET(context: { url: URL }) {
  const key = context.url.searchParams.get('key')
  if (!key) return Response.json({ error: 'key required' }, { status: 400 })
  return Response.json(getMetrics(key))
}

export async function POST(context: { request: Request }) {
  const payload = (await context.request.json().catch(() => ({}))) as {
    key?: string
    sessionId?: string
  }
  if (!payload.key || !payload.sessionId) {
    return Response.json({ error: 'key and sessionId required' }, { status: 400 })
  }
  return Response.json(toggleLike(payload.key, payload.sessionId))
}
