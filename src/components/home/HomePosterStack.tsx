import {
  type CSSProperties,
  useEffect,
  useState
} from 'react';
import posterPurple from '../../assets/home-poster-sign-work-web.avif';
import posterOrange from '../../assets/home-poster-help-dreamers-web.avif';
import posterBlue from '../../assets/home-poster-take-back-process-web.avif';
import posterGreen from '../../assets/home-poster-demo-green-web.avif';
import { usePosterController } from '../posters/usePosterController';
import { PeelPosterCanvas } from './PeelPosterCanvas';
import { useProgressivePosterImages } from './useProgressivePosterImages';

export type HomePosterId = 'purple' | 'orange' | 'blue' | 'green';

type HomePoster = {
  id: HomePosterId;
  label: string;
  imageSrc: string;
  slot: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotate: number;
    baseZIndex: number;
    inactiveOffset?: {
      x: number;
      y: number;
    };
  };
};

type HomePosterStackProps = {
  activeId: HomePosterId;
  onActiveChange: (id: HomePosterId) => void;
  placement?: 'home' | 'manifesto';
};

const manifestoPosterSlots: Record<HomePosterId, HomePoster['slot']> = {
  purple: {
    x: 139,
    y: 182,
    width: 420,
    height: 595,
    rotate: 0,
    baseZIndex: 1,
    inactiveOffset: {
      x: 13,
      y: 57
    }
  },
  orange: {
    x: 42,
    y: 224,
    width: 420,
    height: 595,
    rotate: -4,
    baseZIndex: 2
  },
  blue: {
    x: 244,
    y: 190,
    width: 420,
    height: 595,
    rotate: 4,
    baseZIndex: 4
  },
  green: {
    x: 185,
    y: 124,
    width: 420,
    height: 596,
    rotate: 0,
    baseZIndex: 3
  }
};

const homePosters: readonly HomePoster[] = [
  {
    id: 'purple',
    label: 'Sign your work',
    imageSrc: posterPurple,
    slot: {
      x: 139,
      y: 182,
      width: 420,
      height: 595,
      rotate: 0,
      baseZIndex: 1,
      inactiveOffset: {
        x: 13,
        y: 57
      }
    }
  },
  {
    id: 'orange',
    label: 'We are here to help dreamers dream',
    imageSrc: posterOrange,
    slot: {
      x: 42,
      y: 224,
      width: 420,
      height: 595,
      rotate: -4,
      baseZIndex: 2
    }
  },
  {
    id: 'blue',
    label: 'Take back the process',
    imageSrc: posterBlue,
    slot: {
      x: 244,
      y: 190,
      width: 420,
      height: 595,
      rotate: 4,
      baseZIndex: 4
    }
  },
  {
    id: 'green',
    label: 'Tactile animation demo',
    imageSrc: posterGreen,
    slot: {
      x: 185,
      y: 124,
      width: 420,
      height: 596,
      rotate: 0,
      baseZIndex: 3
    }
  }
] as const;

export function HomePosterStack({
  activeId,
  onActiveChange,
  placement = 'home'
}: HomePosterStackProps) {
  const [isPeeling, setIsPeeling] = useState(false);
  const [isDesktopPosterStage, setIsDesktopPosterStage] = useState(() =>
    window.matchMedia('(min-width: 901px)').matches
  );
  const { activeIndex, activeItem, next, handleKeyDown } = usePosterController({
    items: homePosters,
    activeId,
    onActiveChange
  });
  const activePosterSlot = getPosterSlot(activeItem, placement);
  const readyPosterIds = useProgressivePosterImages(
    homePosters,
    activeId,
    isDesktopPosterStage
  );

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 901px)');
    const handleDesktopChange = () => {
      setIsDesktopPosterStage(desktopQuery.matches);
    };

    desktopQuery.addEventListener('change', handleDesktopChange);

    return () => {
      desktopQuery.removeEventListener('change', handleDesktopChange);
    };
  }, []);

  if (!isDesktopPosterStage) return null;

  return (
    <section
      className={`home-poster-stage home-poster-stage--${placement}${
        isPeeling ? ' is-peeling' : ''
      }`}
      aria-label="Tactile poster collection"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <span className="home-poster-status" aria-live="polite">
        Current poster: {activeItem.label}
      </span>

      {homePosters.map((poster, posterIndex) => {
        const isActive = poster.id === activeId;
        const distanceFromActive =
          isActive
            ? 0
            : (posterIndex - activeIndex + homePosters.length) %
              homePosters.length;

        return (
          <article
            key={poster.id}
            className={`home-poster home-poster--${
              isActive ? 'active' : 'stacked'
            }`}
            style={createPosterStyle(
              poster,
              isActive,
              20 - distanceFromActive,
              !isActive && distanceFromActive === 1,
              placement
            )}
            data-poster-id={poster.id}
            data-poster-index={isActive ? activeIndex : undefined}
            aria-hidden={isActive ? undefined : true}
            aria-label={
              isActive
                ? `Peel current poster: ${poster.label}. Drag its left edge to reveal the next poster.`
                : undefined
            }
          >
            {isActive || readyPosterIds.has(poster.id) ? (
              <img
                className={isActive ? 'home-poster-active-image' : undefined}
                src={poster.imageSrc}
                alt=""
                decoding="async"
                fetchPriority={isActive ? 'high' : 'low'}
                draggable={false}
                aria-hidden="true"
              />
            ) : null}

            {isActive && isDesktopPosterStage ? (
              <div className="home-poster-peel" aria-hidden="true">
                <PeelPosterCanvas
                  imageSrc={poster.imageSrc}
                  width={activePosterSlot.width}
                  height={activePosterSlot.height}
                  onComplete={next}
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

function createPosterStyle(
  poster: HomePoster,
  isActive: boolean,
  zIndex = poster.slot.baseZIndex,
  preserveActiveSlot = false,
  placement: NonNullable<HomePosterStackProps['placement']> = 'home'
) {
  const slot = getPosterSlot(poster, placement);
  const inactiveOffset =
    isActive || preserveActiveSlot ? undefined : slot.inactiveOffset;

  return {
    '--home-poster-x': `${slot.x + (inactiveOffset?.x ?? 0)}px`,
    '--home-poster-y': `${slot.y + (inactiveOffset?.y ?? 0)}px`,
    '--home-poster-width': `${slot.width}px`,
    '--home-poster-height': `${slot.height}px`,
    '--home-poster-rotation': `${slot.rotate}deg`,
    '--home-poster-z':
      isActive ? 20 : zIndex
  } as CSSProperties;
}

function getPosterSlot(
  poster: HomePoster,
  placement: NonNullable<HomePosterStackProps['placement']>
) {
  if (placement !== 'manifesto') {
    return poster.slot;
  }

  return manifestoPosterSlots[poster.id];
}
