import {
  type CSSProperties,
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
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

function PosterStackComponent({ items }: PosterStackProps) {
  const activePosterId = useLandingStore((state) => state.activePosterId);
  const setActivePoster = useLandingStore((state) => state.setActivePoster);
  const flipBookRef = useRef<FlipBookHandle | null>(null);
  const pendingLoopResetRef = useRef(false);
  const [isPosterFlipping, setIsPosterFlipping] = useState(false);
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
        zIndex: 30
      }) as CSSProperties,
    []
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
            <HTMLFlipBook
              ref={flipBookRef}
              className="poster-flipbook"
              width={360}
              height={520}
              size="fixed"
              drawShadow={false}
              maxShadowOpacity={0}
              singlePage
              usePortrait={false}
              autoSize={false}
              showCover={false}
              showPageCorners
              startZIndex={30}
              mobileScrollSupport={false}
              useMouseEvents
              flippingTime={920}
              startPage={activeIndex}
              clickEventForward={false}
              disableFlipByClick
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
