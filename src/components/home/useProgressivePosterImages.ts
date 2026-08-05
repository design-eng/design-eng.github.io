import { useEffect, useState } from 'react';

type PosterImage<T extends string> = {
  id: T;
  imageSrc: string;
};

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number }
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function useProgressivePosterImages<T extends string>(
  posters: readonly PosterImage<T>[],
  activeId: T,
  enabled = true
) {
  const [readyIds, setReadyIds] = useState<ReadonlySet<T>>(
    () => new Set([activeId])
  );

  useEffect(() => {
    if (!enabled) return;

    const idleWindow = window as IdleWindow;
    const activeIndex = posters.findIndex((poster) => poster.id === activeId);
    const preloadOrder = posters.filter(
      (_, index) => index !== activeIndex
    );
    let cancelled = false;
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;

    const loadPoster = (index: number) => {
      if (cancelled || index >= preloadOrder.length) return;

      const poster = preloadOrder[index];
      const image = new Image();
      image.decoding = 'async';
      image.fetchPriority = 'low';

      const continueLoading = () => {
        if (cancelled) return;
        setReadyIds((currentIds) => new Set([...currentIds, poster.id]));
        timeoutHandle = window.setTimeout(() => loadPoster(index + 1), 120);
      };

      image.addEventListener('load', continueLoading, { once: true });
      image.addEventListener('error', continueLoading, { once: true });
      image.src = poster.imageSrc;
    };

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(() => loadPoster(0), {
        timeout: 700
      });
    } else {
      timeoutHandle = window.setTimeout(() => loadPoster(0), 250);
    }

    return () => {
      cancelled = true;
      if (idleHandle !== undefined) {
        idleWindow.cancelIdleCallback?.(idleHandle);
      }
      if (timeoutHandle !== undefined) {
        window.clearTimeout(timeoutHandle);
      }
    };
  }, [activeId, enabled, posters]);

  return readyIds;
}
