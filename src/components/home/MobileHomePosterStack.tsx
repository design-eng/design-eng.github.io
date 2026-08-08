import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import posterPurple from '../../assets/home-poster-sign-work-mobile.avif';
import posterOrange from '../../assets/home-poster-help-dreamers-mobile.avif';
import posterBlue from '../../assets/home-poster-take-back-process-mobile.avif';
import posterGreen from '../../assets/home-poster-demo-green-mobile.avif';
import { usePosterController } from '../posters/usePosterController';
import { PeelPosterCanvas } from './PeelPosterCanvas';
import type { HomePosterId } from './HomePosterStack';
import { useInstantPosterSequence } from './useInstantPosterSequence';

type MobileHomePosterStackProps = {
  activeId: HomePosterId;
  onActiveChange: (id: HomePosterId) => void;
};

const mobilePosters = [
  { id: 'purple', label: 'Sign your work', imageSrc: posterPurple },
  { id: 'orange', label: 'We are here to help dreamers dream', imageSrc: posterOrange },
  { id: 'blue', label: 'Take back the process', imageSrc: posterBlue },
  { id: 'green', label: 'Tactile animation demo', imageSrc: posterGreen }
] as const;

const initialSlots: Record<HomePosterId, number> = {
  purple: 0,
  orange: 1,
  blue: 2,
  green: 3
};

const instantPosterSequence: readonly HomePosterId[] = [
  'purple',
  'blue',
  'orange',
  'green'
];

export function MobileHomePosterStack({
  activeId,
  onActiveChange
}: MobileHomePosterStackProps) {
  const activePosterRef = useRef<HTMLElement | null>(null);
  const [isPeeling, setIsPeeling] = useState(false);
  const [posterSize, setPosterSize] = useState({ width: 270, height: 382.5 });
  const [slots, setSlots] =
    useState<Record<HomePosterId, number>>(initialSlots);
  const [isResponsivePosterLayout, setIsResponsivePosterLayout] = useState(() =>
    window.matchMedia('(max-width: 900px)').matches
  );

  const handleActiveChange = useCallback(
    (nextId: HomePosterId) => {
      if (nextId === activeId) return;

      setSlots((currentSlots) => ({
        ...currentSlots,
        [activeId]: currentSlots[nextId],
        [nextId]: 0
      }));
      onActiveChange(nextId);
    },
    [activeId, onActiveChange]
  );
  const handleInstantActiveChange = useCallback(
    (nextId: HomePosterId) => {
      if (nextId === 'purple') {
        setSlots(initialSlots);
      }

      onActiveChange(nextId);
    },
    [onActiveChange]
  );

  const { activeItem, next, handleKeyDown } = usePosterController({
    items: mobilePosters,
    activeId,
    onActiveChange: handleActiveChange
  });
  const { reveal, revealedIds } = useInstantPosterSequence(
    mobilePosters,
    instantPosterSequence,
    activeId,
    handleInstantActiveChange,
    isResponsivePosterLayout && !isPeeling
  );
  useEffect(() => {
    const responsiveQuery = window.matchMedia('(max-width: 900px)');
    const handleResponsiveChange = () =>
      setIsResponsivePosterLayout(responsiveQuery.matches);

    responsiveQuery.addEventListener('change', handleResponsiveChange);
    return () =>
      responsiveQuery.removeEventListener('change', handleResponsiveChange);
  }, []);

  useLayoutEffect(() => {
    const poster = activePosterRef.current;
    if (!poster) return;

    const updateSize = () => {
      const bounds = poster.getBoundingClientRect();
      setPosterSize({ width: bounds.width, height: bounds.height });
    };
    const observer = new ResizeObserver(updateSize);

    updateSize();
    observer.observe(poster);
    return () => observer.disconnect();
  }, [activeId, isResponsivePosterLayout]);

  if (!isResponsivePosterLayout) return null;

  return (
    <section
      className={`home-mobile-poster-showcase${isPeeling ? ' is-peeling' : ''}`}
      aria-label="Tactile poster collection"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <span className="sr-only" aria-live="polite">
        Current poster: {activeItem.label}
      </span>

      {mobilePosters.map((poster) => {
        if (!revealedIds.has(poster.id)) return null;

        const slot = slots[poster.id];
        const isActive = poster.id === activeId;

        return (
          <article
            ref={isActive ? activePosterRef : undefined}
            key={poster.id}
            className={`home-mobile-poster home-mobile-poster--slot-${slot}${
              isActive ? ' home-mobile-poster--active' : ''
            }`}
            style={{
              zIndex: instantPosterSequence.indexOf(poster.id) + 1,
              transition: 'none'
            }}
            aria-hidden={isActive ? undefined : true}
            aria-label={
              isActive
                ? `Peel current poster: ${poster.label}. Drag from its left edge to reveal the next poster.`
                : undefined
            }
          >
            <img
              className={
                isActive ? 'home-mobile-poster__active-image' : undefined
              }
              src={poster.imageSrc}
              alt=""
              decoding="async"
              fetchPriority={isActive ? 'high' : 'auto'}
              draggable={false}
              aria-hidden="true"
            />
            {isActive ? (
              <div className="home-mobile-poster__peel" aria-hidden="true">
                <PeelPosterCanvas
                  imageSrc={poster.imageSrc}
                  width={posterSize.width}
                  height={posterSize.height}
                  interactionMode="touch"
                  onComplete={() => {
                    const activeIndex = mobilePosters.findIndex(
                      (item) => item.id === activeId
                    );
                    const nextPoster =
                      mobilePosters[(activeIndex + 1) % mobilePosters.length];
                    reveal(nextPoster.id);
                    next();
                  }}
                  onPeelingChange={setIsPeeling}
                />
              </div>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}
