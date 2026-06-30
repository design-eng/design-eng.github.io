import {
  type CSSProperties,
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode
} from 'react';
import HTMLFlipBook from 'react-pageflip-enhanced';
import marksImage from '../../assets/marks.png';
import { useLandingStore } from '../../state/useLandingStore';
import { PosterCard } from './PosterCard';

type PosterStackItem = {
  id: string;
  label: string;
  imageSrc: string;
};

type PosterStackProps = {
  items: readonly PosterStackItem[];
};

type FlipEvent = {
  data: number;
};

type FlipStateEvent = {
  data: 'user_fold' | 'fold_corner' | 'flipping' | 'read';
};

type FlipBookHandle = {
  pageFlip: () => {
    flipNext: (corner?: 'top' | 'bottom') => void;
    flipPrev: (corner?: 'top' | 'bottom') => void;
    getCurrentPageIndex: () => number;
    turnToPage: (page: number) => void;
  };
};

type PointerStart = {
  id: number;
  x: number;
  y: number;
  directionHint: 'next' | 'prev' | null;
  corner: 'top' | 'bottom';
};

type DragPreview = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
};

const STACK_PRESETS = [
  { x: 0, y: 0, rotate: 0 },
  { x: -56, y: 56, rotate: -7 },
  { x: 44, y: 34, rotate: 4 },
  { x: 86, y: 58, rotate: 7 },
  { x: 34, y: 102, rotate: 3 }
] as const;

const FlipPosterPage = forwardRef<
  HTMLDivElement,
  { className?: string; children: ReactNode }
>(function FlipPosterPage({ className = '', children }, ref) {
  return (
    <div ref={ref} className={`poster-page ${className}`.trim()}>
      {children}
    </div>
  );
});

function movePosterToFront(
  items: readonly PosterStackItem[],
  preferredPosterId?: string
) {
  const frontPoster =
    items.find((item) => item.id === preferredPosterId) ??
    items.find((item) => item.id === 'blue-cover') ??
    items[0];
  const rest = items.filter((item) => item.id !== frontPoster.id);

  return [frontPoster, ...rest];
}

function getCircularPosterWindow(
  items: readonly PosterStackItem[],
  startIndex: number,
  count: number
) {
  if (!items.length || count <= 0) {
    return [];
  }

  return Array.from({ length: Math.min(count, items.length - 1) }, (_, offset) => {
    const nextIndex = (startIndex + offset + 1) % items.length;
    return items[nextIndex];
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function PosterStackComponent({ items }: PosterStackProps) {
  const activePosterId = useLandingStore((state) => state.activePosterId);
  const setActivePoster = useLandingStore((state) => state.setActivePoster);
  const flipBookRef = useRef<FlipBookHandle | null>(null);
  const gestureStartRef = useRef<PointerStart | null>(null);
  const gestureTriggeredRef = useRef(false);
  const pendingLoopResetRef = useRef(false);
  const [isPosterFlipping, setIsPosterFlipping] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [dragPreview, setDragPreview] = useState<DragPreview>({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1
  });
  const orderedItems = useMemo(
    () => movePosterToFront(items, 'blue-cover'),
    [items]
  );
  const activeIndex = Math.max(
    orderedItems.findIndex((item) => item.id === activePosterId),
    0
  );
  const loopingPages = useMemo(() => {
    if (!orderedItems.length) {
      return [];
    }

    return [...orderedItems, orderedItems[0]];
  }, [orderedItems]);
  const stackedPosters = useMemo(() => {
    const postersBehindActive = getCircularPosterWindow(
      orderedItems,
      activeIndex,
      STACK_PRESETS.length
    );

    return postersBehindActive.slice(1).reverse();
  }, [activeIndex, orderedItems]);
  const activePoster = orderedItems[activeIndex] ?? orderedItems[0];
  const renderedPages = useMemo(
    () =>
      loopingPages.map((item, index) => (
        <FlipPosterPage
          key={`${item.id}-${index === orderedItems.length ? 'loop' : index}`}
          className="poster-page--front"
        >
          <div className="poster-page__sheet">
            <img
              className="poster-page__image"
              src={item.imageSrc}
              alt={item.label}
              draggable={false}
            />
          </div>
        </FlipPosterPage>
      )),
    [loopingPages, orderedItems.length]
  );
  const activePosterStyle = useMemo(
    () =>
      ({
        ['--poster-depth' as const]: 0,
        ['--poster-offset-x' as const]: `${STACK_PRESETS[0].x}px`,
        ['--poster-offset-y' as const]: `${STACK_PRESETS[0].y}px`,
        ['--poster-rotation' as const]: `${STACK_PRESETS[0].rotate}deg`,
        ['--poster-drag-x' as const]: `${dragPreview.x}px`,
        ['--poster-drag-y' as const]: `${dragPreview.y}px`,
        ['--poster-drag-rotate' as const]: `${dragPreview.rotate}deg`,
        ['--poster-scale' as const]: `${dragPreview.scale}`,
        zIndex: 30
      }) as CSSProperties,
    [dragPreview]
  );

  useEffect(() => {
    const flipApi = flipBookRef.current?.pageFlip();

    if (!flipApi || pendingLoopResetRef.current) {
      return;
    }

    if (flipApi.getCurrentPageIndex() !== activeIndex) {
      flipApi.turnToPage(activeIndex);
    }
  }, [activeIndex]);

  const handleFlip = (event: FlipEvent) => {
    const normalizedIndex = event.data % orderedItems.length;
    const nextPoster = orderedItems[normalizedIndex];

    if (!nextPoster) {
      return;
    }

    if (nextPoster.id !== activePosterId) {
      setActivePoster(nextPoster.id);
    }

    pendingLoopResetRef.current = event.data === orderedItems.length;
  };

  const handleFlipStateChange = (event: FlipStateEvent) => {
    setIsPosterFlipping(event.data === 'flipping');

    if (event.data !== 'read' || !pendingLoopResetRef.current) {
      return;
    }

    pendingLoopResetRef.current = false;
    flipBookRef.current?.pageFlip().turnToPage(0);
  };

  const resetGesture = () => {
    gestureStartRef.current = null;
    gestureTriggeredRef.current = false;
    setIsPointerDown(false);
    setDragPreview({
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1
    });
  };

  const triggerFlipFromGesture = (
    direction: 'next' | 'prev',
    corner: 'top' | 'bottom'
  ) => {
    const flipApi = flipBookRef.current?.pageFlip();

    if (!flipApi || isPosterFlipping) {
      return;
    }

    if (direction === 'next') {
      flipApi.flipNext(corner);
    } else {
      flipApi.flipPrev(corner);
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isPosterFlipping) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const directionHint =
      relativeX < rect.width * 0.34
        ? 'prev'
        : relativeX > rect.width * 0.66
          ? 'next'
          : null;

    gestureStartRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      directionHint,
      corner: event.clientY - rect.top < rect.height / 2 ? 'top' : 'bottom'
    };
    gestureTriggeredRef.current = false;
    setIsPointerDown(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = gestureStartRef.current;

    if (!start || start.id !== event.pointerId || gestureTriggeredRef.current) {
      return;
    }

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const inferredDirection = deltaX < 0 ? 'next' : 'prev';
    const intendedDirection = start.directionHint ?? inferredDirection;
    const isDirectionValid = intendedDirection === inferredDirection;

    if (absDeltaX > 4 && isDirectionValid) {
      const previewX =
        intendedDirection === 'next'
          ? clamp(deltaX * 0.22, -26, 0)
          : clamp(deltaX * 0.22, 0, 26);
      const previewLift = -Math.min(absDeltaX * 0.04, 8);
      const previewRotate =
        intendedDirection === 'next'
          ? clamp(deltaX * 0.06, -4.5, 0)
          : clamp(deltaX * 0.06, 0, 4.5);

      setDragPreview({
        x: previewX,
        y: previewLift,
        rotate: previewRotate,
        scale: 0.992
      });
    }

    if (absDeltaX < 24 || absDeltaX <= absDeltaY * 1.15 || !isDirectionValid) {
      return;
    }

    gestureTriggeredRef.current = true;
    setDragPreview({
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1
    });
    triggerFlipFromGesture(intendedDirection, start.corner);
    event.currentTarget.releasePointerCapture(event.pointerId);
    resetGesture();
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = gestureStartRef.current;

    if (!start || start.id !== event.pointerId) {
      resetGesture();
      return;
    }

    if (!gestureTriggeredRef.current) {
      const rect = event.currentTarget.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;

      if (relativeX < rect.width * 0.25) {
        triggerFlipFromGesture('prev', start.corner);
      } else if (relativeX > rect.width * 0.75) {
        triggerFlipFromGesture('next', start.corner);
      }
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    resetGesture();
  };

  const handlePointerCancel = () => {
    resetGesture();
  };

  if (!activePoster) {
    return null;
  }

  return (
    <section className="poster-cluster" aria-label="Poster stack">
      <div className="poster-stack">
        <img
          className="poster-stack__marks"
          src={marksImage}
          alt=""
          aria-hidden="true"
        />
        <button type="button" className="autograph-chip">
          Autograph this
        </button>

        {stackedPosters.map((item, index) => {
          const depth = stackedPosters.length - index;
          const preset =
            STACK_PRESETS[depth] ?? STACK_PRESETS[STACK_PRESETS.length - 1];

          return (
            <PosterCard
              key={item.id}
              item={item}
              depth={depth}
              offsetX={preset.x}
              offsetY={preset.y}
              rotation={preset.rotate}
            />
          );
        })}

        <article
          className={`poster-card poster-card--active${
            isPosterFlipping ? ' poster-card--flipping' : ''
          }`}
          style={activePosterStyle}
          aria-label={`${activePoster.label} poster`}
        >
          <div
            className={`poster-flip-shell${
              isPosterFlipping ? ' poster-flip-shell--flipping' : ''
            }`}
          >
            <div
              className={`poster-flip-hitbox${
                isPointerDown ? ' poster-flip-hitbox--active' : ''
              }`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
            />
            <HTMLFlipBook
              ref={flipBookRef}
              className="poster-flipbook"
              width={360}
              height={520}
              size="fixed"
              drawShadow
              maxShadowOpacity={0.18}
              singlePage
              usePortrait={false}
              autoSize={false}
              showCover={false}
              showPageCorners={false}
              startZIndex={30}
              mobileScrollSupport={false}
              useMouseEvents={false}
              flippingTime={920}
              startPage={activeIndex}
              clickEventForward={false}
              disableFlipByClick={false}
              onChangeState={handleFlipStateChange}
              onFlip={handleFlip}
              renderOnlyPageLengthChange
            >
              {renderedPages}
            </HTMLFlipBook>
          </div>
        </article>
      </div>

    </section>
  );
}

export const PosterStack = memo(PosterStackComponent);
