export type MetricsState = {
  views: number
  likes: number
  likedSessions: Set<string>
  viewedSessions: Set<string>
}

const store = new Map<string, MetricsState>()

function ensureState(key: string): MetricsState {
  const current = store.get(key)
  if (current) return current
  const created: MetricsState = {
    views: 0,
    likes: 0,
    likedSessions: new Set<string>(),
    viewedSessions: new Set<string>(),
  }
  store.set(key, created)
  return created
}

export function readMetrics(key: string) {
  const state = ensureState(key)
  return { views: state.views, likes: state.likes }
}

export function recordView(key: string, sessionId: string) {
  const state = ensureState(key)
  if (!state.viewedSessions.has(sessionId)) {
    state.viewedSessions.add(sessionId)
    state.views += 1
  }
  return { views: state.views, likes: state.likes }
}

export function toggleLikeState(key: string, sessionId: string) {
  const state = ensureState(key)
  const alreadyLiked = state.likedSessions.has(sessionId)
  if (alreadyLiked) {
    state.likedSessions.delete(sessionId)
    state.likes = Math.max(0, state.likes - 1)
  } else {
    state.likedSessions.add(sessionId)
    state.likes += 1
  }
  return { views: state.views, likes: state.likes, liked: !alreadyLiked }
}
