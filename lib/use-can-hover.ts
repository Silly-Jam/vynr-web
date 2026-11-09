import { useSyncExternalStore } from 'react';

const HOVER_QUERY = '(hover: hover)';

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(HOVER_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/**
 * Whether the primary pointer can hover. False during server rendering and
 * hydration, then the live media-query value, so hover-only UI such as
 * treemap tooltips never appears on touch screens.
 */
export function useCanHover(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(HOVER_QUERY).matches,
    () => false,
  );
}
