import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import {
  CheckIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  TriangleRightIcon
} from '@radix-ui/react-icons';
import { gsap } from 'gsap';
import avatar from '../../assets/avatar.png';
import orb from '../../assets/orb.png';
import playhead from '../../assets/playhead.png';

const PLAYHEAD_START_PX = 26;
const PLAYHEAD_DISTANCE_PX = 270;

const propertyRows = [
  ['layer', '0395'],
  ['trigger', 'legacy.plybck'],
  ['shader', 'asset.0124'],
  ['property', '10884'],
  ['value', '.isMounted']
] as const;

const timeLabels = ['0.0s', '0.3s', '0.5s', '0.7s', '1.0s'] as const;

export function HomeDemo() {
  const demoRef = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLImageElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const initialMenuTimerRef = useRef<number | null>(null);
  const menuShownThisCycleRef = useRef(false);
  const choreographyReadyRef = useRef(false);
  const wasPlayingBeforeScrubRef = useRef(false);
  const isPlayingRef = useRef(true);
  const layerValueRef = useRef<HTMLSpanElement>(null);
  const propertyValueRef = useRef<HTMLElement>(null);
  const mountedValueRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRepeating, setIsRepeating] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShowcaseMenuOpen, setIsShowcaseMenuOpen] = useState(false);
  const [arePropertiesVisible, setArePropertiesVisible] = useState(true);

  const syncProgress = useCallback((progress: number) => {
    const normalizedProgress = Math.min(Math.max(progress, 0), 1);

    demoRef.current?.style.setProperty(
      '--home-demo-playhead-x',
      `${PLAYHEAD_START_PX + normalizedProgress * PLAYHEAD_DISTANCE_PX}px`
    );

    if (rangeRef.current) {
      rangeRef.current.value = String(normalizedProgress * 100);
      rangeRef.current.setAttribute(
        'aria-valuetext',
        `${normalizedProgress.toFixed(1)} seconds`
      );
    }

    if (layerValueRef.current) {
      layerValueRef.current.textContent = String(
        Math.round(128 + normalizedProgress * 267)
      ).padStart(3, '0');
    }

    if (propertyValueRef.current) {
      propertyValueRef.current.textContent = String(
        Math.round(10000 + normalizedProgress * 884)
      );
    }

    if (mountedValueRef.current) {
      mountedValueRef.current.textContent =
        normalizedProgress > 0.62
          ? '.isMounted'
          : normalizedProgress > 0.28
            ? '.opacity'
            : '.isHidden';
    }
  }, []);

  const closeMenus = useCallback(() => {
    setIsMenuOpen(false);
    setIsShowcaseMenuOpen(false);
  }, []);

  const openShowcaseMenu = useCallback(() => {
    if (window.matchMedia('(max-width: 900px)').matches) {
      return;
    }

    setIsShowcaseMenuOpen(true);
  }, []);

  const updatePlaying = useCallback((nextIsPlaying: boolean) => {
    isPlayingRef.current = nextIsPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      timelineRef.current?.play();
    } else {
      timelineRef.current?.pause();
    }
  }, []);

  const updateRepeating = useCallback((nextIsRepeating: boolean) => {
    setIsRepeating(nextIsRepeating);
    timelineRef.current?.repeat(nextIsRepeating ? -1 : 0);
  }, []);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    let initialPlayback: gsap.core.Tween | null = null;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        paused: true,
        repeat: -1,
        repeatDelay: 1.15,
        onUpdate: () => {
          const progress = timeline.progress();
          syncProgress(progress);

          if (
            choreographyReadyRef.current &&
            progress >= 0.94 &&
            !menuShownThisCycleRef.current &&
            isPlayingRef.current
          ) {
            menuShownThisCycleRef.current = true;
            openShowcaseMenu();
          }
        },
        onRepeat: () => {
          menuShownThisCycleRef.current = false;
          closeMenus();
        },
        onComplete: () => {
          if (timeline.repeat() === 0) {
            updatePlaying(false);
          }
        }
      });

      timeline
        .fromTo(
          orbRef.current,
          {
            x: -24,
            y: 10,
            scale: 0.86,
            rotation: -5,
            filter: 'saturate(0.88)'
          },
          {
            x: 17,
            y: -9,
            scale: 1.04,
            rotation: 4,
            filter: 'saturate(1.12)',
            duration: 1.6,
            ease: 'sine.inOut'
          }
        )
        .to(orbRef.current, {
          x: -6,
          y: 3,
          scale: 0.96,
          rotation: 0,
          filter: 'saturate(1)',
          duration: 1.4,
          ease: 'sine.inOut'
        })
        .to(orbRef.current, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'sine.inOut'
        });

      timeline.progress(1).pause();
      syncProgress(1);
      timelineRef.current = timeline;

      if (prefersReducedMotion) {
        isPlayingRef.current = false;
        setIsPlaying(false);
      } else {
        initialPlayback = gsap.delayedCall(1.75, () => {
          closeMenus();
          menuShownThisCycleRef.current = false;
          choreographyReadyRef.current = true;
          timeline.restart();
        });
      }
    }, demoRef);

    return () => {
      initialPlayback?.kill();
      timelineRef.current = null;
      context.revert();
    };
  }, [closeMenus, openShowcaseMenu, syncProgress, updatePlaying]);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );
    const handleReducedMotionChange = (
      event: MediaQueryListEvent
    ) => {
      if (event.matches) {
        updatePlaying(false);
        timelineRef.current?.progress(1);
        syncProgress(1);
      }
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      reducedMotionQuery.removeEventListener(
        'change',
        handleReducedMotionChange
      );
    };
  }, [syncProgress, updatePlaying]);

  useEffect(() => {
    initialMenuTimerRef.current = window.setTimeout(() => {
      menuShownThisCycleRef.current = true;
      openShowcaseMenu();
    }, 240);

    return () => {
      if (initialMenuTimerRef.current !== null) {
        window.clearTimeout(initialMenuTimerRef.current);
      }
    };
  }, [openShowcaseMenu]);

  useEffect(() => {
    const responsiveQuery = window.matchMedia('(max-width: 900px)');
    const handleResponsiveChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        closeMenus();
        menuShownThisCycleRef.current = false;
      }
    };

    responsiveQuery.addEventListener('change', handleResponsiveChange);

    return () => {
      responsiveQuery.removeEventListener('change', handleResponsiveChange);
    };
  }, [closeMenus]);

  const handleScrubStart = () => {
    wasPlayingBeforeScrubRef.current = isPlayingRef.current;
    timelineRef.current?.pause();
  };

  const handleScrub = (event: ReactPointerEvent<HTMLInputElement>) => {
    const nextProgress = Number(event.currentTarget.value) / 100;
    timelineRef.current?.progress(nextProgress);
    syncProgress(nextProgress);
  };

  const handleScrubEnd = () => {
    if (wasPlayingBeforeScrubRef.current) {
      timelineRef.current?.play();
    }
  };

  return (
    <section
      ref={demoRef}
      className="home-demo"
      aria-label="Interactive Tactile animation preview"
    >
      <div className="home-demo__status-row">
        <div className="home-demo__commit">
          <span className="home-demo__commit-icon" aria-hidden="true">
            <CheckIcon />
          </span>
          <span>last commit: 05:48 PM</span>
        </div>

        <img className="home-demo__avatar" src={avatar} alt="Tactile creator" />
      </div>

      <ContextMenu.Root
        modal={false}
        open={isMenuOpen}
        onOpenChange={(open) => {
          setIsMenuOpen(open);

          if (open) {
            setIsShowcaseMenuOpen(false);
          }
        }}
      >
        <ContextMenu.Trigger asChild>
          <div className="home-demo__panel">
            <button
              type="button"
              className="home-demo__add-property"
              aria-label={
                arePropertiesVisible
                  ? 'Hide animation properties'
                  : 'Show animation properties'
              }
              aria-expanded={arePropertiesVisible}
              onClick={() =>
                setArePropertiesVisible((areVisible) => !areVisible)
              }
            >
              <PlusIcon />
            </button>

            <div
              className={`home-demo__properties${arePropertiesVisible ? '' : ' is-collapsed'}`}
            >
              {propertyRows.map(([label, value]) => (
                <div className="home-demo__property" key={label}>
                  <span>{label}</span>
                  <strong>
                    {label === 'layer' ? (
                      <>
                        <mark>0</mark>
                        <span
                          ref={layerValueRef}
                          className="home-demo__property-value"
                        >
                          395
                        </span>
                      </>
                    ) : label === 'property' ? (
                      <span
                        ref={propertyValueRef}
                        className="home-demo__property-value"
                      >
                        {value}
                      </span>
                    ) : label === 'value' ? (
                      <span
                        ref={mountedValueRef}
                        className="home-demo__property-value"
                      >
                        {value}
                      </span>
                    ) : (
                      value
                    )}
                  </strong>
                </div>
              ))}
            </div>

            <div className="home-demo__timeline">
              <div className="home-demo__time-labels" aria-hidden="true">
                {timeLabels.map((time) => (
                  <span key={time}>{time}</span>
                ))}
              </div>

              <input
                ref={rangeRef}
                className="home-demo__range"
                type="range"
                min="0"
                max="100"
                defaultValue="100"
                aria-label="Animation timeline"
                onPointerDown={handleScrubStart}
                onPointerMove={handleScrub}
                onPointerUp={handleScrubEnd}
                onChange={(event) => {
                  const nextProgress = Number(event.currentTarget.value) / 100;
                  timelineRef.current?.progress(nextProgress);
                  syncProgress(nextProgress);
                }}
              />

              <div className="home-demo__playhead" aria-hidden="true">
                <img src={playhead} alt="" />
              </div>
            </div>

            <img ref={orbRef} className="home-demo__orb" src={orb} alt="" />

            <button
              type="button"
              className="home-demo__playback"
              aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
              onClick={() => updatePlaying(!isPlaying)}
            >
              {isPlaying ? (
                <PauseIcon className="home-demo__pause-icon" />
              ) : (
                <PlayIcon className="home-demo__play-icon" />
              )}
              <span>{isPlaying ? 'Playing...' : 'Paused'}</span>
            </button>
          </div>
        </ContextMenu.Trigger>

        <ContextMenu.Portal>
          <ContextMenu.Content
            className="home-demo-menu"
            collisionPadding={12}
            onCloseAutoFocus={(event) => event.preventDefault()}
          >
            <ContextMenu.Item className="home-demo-menu__item">
              <span>List asset</span>
              <kbd>⇧⌥A</kbd>
            </ContextMenu.Item>

            <ContextMenu.Separator className="home-demo-menu__separator" />

            <ContextMenu.Item
              className="home-demo-menu__item"
              onSelect={() => updatePlaying(!isPlaying)}
            >
              <span>{isPlaying ? 'Pause preview' : 'Resume preview'}</span>
              <kbd>⌘Space</kbd>
            </ContextMenu.Item>

            <ContextMenu.Item className="home-demo-menu__item">
              <span>View in simulator</span>
            </ContextMenu.Item>

            <ContextMenu.Sub>
              <ContextMenu.SubTrigger className="home-demo-menu__item">
                <span>Copy as</span>
                <TriangleRightIcon />
              </ContextMenu.SubTrigger>
              <ContextMenu.Portal>
                <ContextMenu.SubContent
                  className="home-demo-menu home-demo-menu--sub"
                  sideOffset={4}
                  alignOffset={-5}
                >
                  <ContextMenu.Item className="home-demo-menu__item">
                    Component
                  </ContextMenu.Item>
                  <ContextMenu.Item className="home-demo-menu__item">
                    Interaction
                  </ContextMenu.Item>
                </ContextMenu.SubContent>
              </ContextMenu.Portal>
            </ContextMenu.Sub>

            <ContextMenu.Separator className="home-demo-menu__separator" />

            <ContextMenu.Item className="home-demo-menu__item">
              <span>Manage logic</span>
            </ContextMenu.Item>

            <ContextMenu.Item className="home-demo-menu__item">
              <span>Bind</span>
              <kbd>⌘⇧R</kbd>
            </ContextMenu.Item>

            <ContextMenu.CheckboxItem
              className={`home-demo-menu__item${isRepeating ? ' is-active' : ''}`}
              checked={isRepeating}
              onCheckedChange={(checked) => updateRepeating(checked === true)}
            >
              <span>Repeat action</span>
              <kbd>⌃⌥R</kbd>
            </ContextMenu.CheckboxItem>

            <ContextMenu.Separator className="home-demo-menu__separator" />

            <ContextMenu.Item className="home-demo-menu__item">
              <span>Ungroup</span>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>

      {isShowcaseMenuOpen ? (
        <div
          className="home-demo-menu home-demo-menu--showcase"
          aria-hidden="true"
        >
          <div className="home-demo-menu__item">
            <span>List asset</span>
            <kbd>⇧⌥A</kbd>
          </div>
          <div className="home-demo-menu__separator" />
          <div className="home-demo-menu__item">
            <span>Pause preview</span>
            <kbd>⌘Space</kbd>
          </div>
          <div className="home-demo-menu__item">
            <span>View in simulator</span>
          </div>
          <div className="home-demo-menu__item">
            <span>Copy as</span>
            <TriangleRightIcon />
          </div>
          <div className="home-demo-menu__separator" />
          <div className="home-demo-menu__item">
            <span>Manage logic</span>
          </div>
          <div className="home-demo-menu__item">
            <span>Bind</span>
            <kbd>⌘⇧R</kbd>
          </div>
          <div className="home-demo-menu__item is-active">
            <span>Repeat action</span>
            <kbd>⌃⌥R</kbd>
          </div>
          <div className="home-demo-menu__separator" />
          <div className="home-demo-menu__item">
            <span>Ungroup</span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
