import {
  readMetrics,
  recordView,
  toggleLikeState,
} from "../../../emdash-theme-kotoba-plugin-metrics/src/store.ts";

export function getMetrics(key: string) {
  return readMetrics(key);
}

export function trackView(key: string, sessionId: string) {
  return recordView(key, sessionId);
}

export function toggleLike(key: string, sessionId: string) {
  return toggleLikeState(key, sessionId);
}
