import { type KeyboardEvent, useCallback, useMemo } from 'react';

type PosterControllerItem = {
  id: string;
};

type UsePosterControllerOptions<T extends PosterControllerItem> = {
  items: readonly T[];
  activeId: T['id'];
  onActiveChange: (id: T['id']) => void;
  loop?: boolean;
};

export function usePosterController<T extends PosterControllerItem>({
  items,
  activeId,
  onActiveChange,
  loop = true
}: UsePosterControllerOptions<T>) {
  const activeIndex = Math.max(
    items.findIndex((item) => item.id === activeId),
    0
  );
  const activeItem = items[activeIndex] ?? items[0];

  const select = useCallback(
    (id: T['id']) => {
      if (items.some((item) => item.id === id)) {
        onActiveChange(id);
      }
    },
    [items, onActiveChange]
  );

  const selectByOffset = useCallback(
    (offset: number) => {
      if (!items.length) {
        return;
      }

      const nextIndex = activeIndex + offset;
      const resolvedIndex = loop
        ? (nextIndex + items.length) % items.length
        : Math.min(Math.max(nextIndex, 0), items.length - 1);

      onActiveChange(items[resolvedIndex].id);
    },
    [activeIndex, items, loop, onActiveChange]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        selectByOffset(1);
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        selectByOffset(-1);
      } else if (event.key === 'Home' && items[0]) {
        event.preventDefault();
        onActiveChange(items[0].id);
      } else if (event.key === 'End' && items.at(-1)) {
        event.preventDefault();
        onActiveChange(items.at(-1)!.id);
      }
    },
    [items, onActiveChange, selectByOffset]
  );

  return useMemo(
    () => ({
      activeIndex,
      activeItem,
      select,
      next: () => selectByOffset(1),
      previous: () => selectByOffset(-1),
      handleKeyDown
    }),
    [activeIndex, activeItem, handleKeyDown, select, selectByOffset]
  );
}
