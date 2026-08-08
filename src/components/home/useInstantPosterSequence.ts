import { useCallback, useEffect, useState } from 'react';

type SequencedPoster<T extends string> = {
  id: T;
  imageSrc: string;
};

const POSTER_REVEAL_DELAYS_MS = [500, 567, 566, 500] as const;

export function useInstantPosterSequence<T extends string>(
  posters: readonly SequencedPoster<T>[],
  sequence: readonly T[],
  activeId: T,
  onActiveChange: (id: T) => void,
  enabled = true
) {
  const [revealedIds, setRevealedIds] = useState<ReadonlySet<T>>(
    () => new Set(sequence.slice(0, 1))
  );
  const [imagesReady, setImagesReady] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    () => document.visibilityState === 'visible'
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    const preloaders = posters.map((poster) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = poster.imageSrc;

      return image.decode?.().catch(() => undefined) ?? Promise.resolve();
    });

    Promise.all(preloaders).then(() => {
      if (!cancelled) setImagesReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, posters]);

  useEffect(() => {
    if (
      !enabled ||
      !imagesReady ||
      !isDocumentVisible ||
      sequence.length < 2
    ) {
      return;
    }

    const currentIndex = Math.max(sequence.indexOf(activeId), 0);
    const revealDelay =
      POSTER_REVEAL_DELAYS_MS[
        currentIndex % POSTER_REVEAL_DELAYS_MS.length
      ];
    const timeoutId = window.setTimeout(() => {
      const nextIndex = (currentIndex + 1) % sequence.length;
      const nextId = sequence[nextIndex];

      setRevealedIds((currentIds) =>
        nextIndex === 0
          ? new Set([nextId])
          : new Set([...currentIds, nextId])
      );
      onActiveChange(nextId);
    }, revealDelay);

    return () => window.clearTimeout(timeoutId);
  }, [
    activeId,
    enabled,
    imagesReady,
    isDocumentVisible,
    onActiveChange,
    sequence
  ]);

  const reveal = useCallback((id: T) => {
    setRevealedIds((currentIds) => new Set([...currentIds, id]));
  }, []);

  return { reveal, revealedIds };
}
