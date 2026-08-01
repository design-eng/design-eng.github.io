import {
  type CSSProperties,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState
} from 'react';
import { HeroCopy } from '../../components/hero/HeroCopy';
import {
  HomePosterStack,
  type HomePosterId
} from '../../components/home/HomePosterStack';
import { PeelPosterCanvas } from '../../components/home/PeelPosterCanvas';
import { SignatureBlock } from '../../components/signature/SignatureBlock';
import { WaitlistModal } from '../../components/cta/WaitlistModal';
import { useLandingStore } from '../../state/useLandingStore';
import { createAudioController } from '../../lib/audio/audioController';
import birdAudio from '../../assets/bird-audio.wav';
import handleImage from '../../assets/handle.png';
import handleImageDark from '../../assets/handle-dark.png';
import posterDreamers from '../../assets/home-poster-help-dreamers-web.png';
import posterDemo from '../../assets/home-poster-demo-green-web.png';
import posterProcess from '../../assets/home-poster-take-back-process-web.png';
import posterSign from '../../assets/home-poster-sign-work-web.png';
import tactileLogo from '../../assets/tactile-logo.png';

const manifestoParagraphs = [
  <>
    Never has the software design industry been in so much disarray over what
    comes next. Even though today, there’s been a plethora of ways to create,
    the ceiling remains untouched while the floor keeps rising. Up until now, it
    never seemed like designers could contribute to the product design life
    cycle beyond “pushing pixels.” Today, the conversation has been on declaring
    designers as the guardians of the user interface. “Designers can now build”,
    they’d say. Yes, we nodded in agreement. Even beyond that, we have always
    maintained that:
  </>,
  <>
    “Designers should push to production.”
    <br />
    <br />
    But we will ask. Push what? Build what? In what way?
    <br />
    <br />
    These are more honest questions that no one has bothered to provide strong
    answers to. The answers to these questions have become the underlying theme
    in all of the industry’s stagnating progress in recent times. If you paid
    attention to the dying breed of talent desperately seeking answers, you will
    consider this to be true. A generation of the few skilled design prodigies
    and guardians, waiting for this question to be answered. The AI hype train
    took no recourse to their creative well being. These stars refuse to be
    dimmed or blindfolded. The prompt slot machine couldn’t be enough.
    Substance, which is the foundation of the divinely driven creative spirit,
    was lacking in these banal solutions.
    <br />
    <br />
    There are only a few humans on the planet who care about this problem as
    much as we do. So, we set out to plant out conviction into the ground,
    calling you to be a witness.{' '}
    {/* <HeroTooltipTerm>Temporibus</HeroTooltipTerm> */}
  </>,
  <>
    <b> Today.</b>
    <br />
    We have heard over and over again how modern software lacks soul and taste.
    The creative tools, solutions and social infrastructure of today haven’t
    been built to allow for the growth of either of these. What we have gotten,
    however, is a cosplay of these truths. That taste and soul are both
    commodities. There is a place for plain and soulless software; those already
    have the tools of today to thank for that. What we refer to is the software
    created by individuals and communities with a spirit beyond theirs only.
    These do not exist in measurable quantities. This has led to the ecosystem
    regurgitating its own exhaust fumes of lifelessness. As you may have
    reckoned, it’s an unending cycle.
  </>,
  <>
    <b> The Future.</b>
    <br />
    If this is what today currently looks like, what does tomorrow even hold?
    There’s never been so much prediction of the future than what we have now.
    Yet, all of those predictions keep falling flat on their faces; they are
    visions put together by people who have no gift for it. You can’t give what
    you don’t have. Let those who dream be empowered to dream more. As you all
    will see in this manifesto, our role will not be regarded as visionaries but
    as enablers.
  </>,
  <>
    <b>Tactile.</b>
    <br />
    Meaning: relating to the sense of touch; perceptible by touch or apparently
    so; tangible. <br />
    We are making software much more than what’s seen but what’s felt. <br />
    Design tools today are still solving yesterday’s problem. Which is: “how do
    we make it look good.” With Tactile, we probe further to ask “How do we make
    it feel great?”.
  </>,
  <>
    <b>What is our promise?</b>
    <br />
    The current overlords say: “Do this or be left behind”. Well, to the
    visionaries who were left behind, this is your new home. While the world
    rushes into its endless fumes, you will sit with your craft and do wonders
    with them.
    <br />
    <br />
    Tactile is the new home for every fanatic of software design with care for
    their craft. This is your last stop, dreamer. All of that journey to find
    the right space to create is over now. We will not goad you into joining
    this train. You will join us in the time that suits you and you will find
    reason to be here because what happens here matters and rings till eternity.
    <br />
    <br />
    But you may ask: “Are all of these think pieces too much for software?”
    <br />
    <br />
    Well, think about it. Software has likely affected you in more ways today
    than you could imagine. Imagine if you interacted with products built with a
    little more intention everyday. What inspiration would’ve resulted from
    this? We have put so much effort into writing this. Imagine how much more
    care we believe you can put into your work and how we believe this can
    happen. All of the sweat you’ve watered the details with will be magnified
    here.
  </>,
  <>
    <b>Tactile, today.</b>
    <br />
    We wish to enable the creative class in software. The soul and taste that
    has been spoken about won’t be found in a skill.md file. All of those are
    fleeting pretenses. Software of today will have more and be more. Software
    can be art. The science of engineering great software can be an art form
    too. Beyond just being guardians of the visual interface, designers will
    also be responsible for how products feel. We will usher in a new era of
    software product design.
    <br />
    <br />
    This is why to those who will join us, you may have been told that “design
    is dead” and that your job is done, we’re here to tell you, in all honesty
    and conviction, that design has just gotten started and your job has never
    been more than it is, now. Dear designer, you have more to do with Tactile.
    You will put your imagination to the test and create software for the future
    you imagine, not the one created for you by the design oligarchs.
  </>,
  <>
    <b>Tactile, in the future.</b>
    <br />
    There’s a race to determine what form of delightful hardware and software
    will permeate the future. One thing about the future is its
    unpredictability. Those who influence the future the most rarely plan to do
    so. It comes by as you go about your craft. Our pledge is that we will
    enable you to wander and wherever the future goes, you will already be
    there. We told you this will be your last stop for software. Yes, it is.
    Because regardless of what the software of the future is, it will still be
    designed. It will still be written in code. All you have to do is stick with
    us on this and “you will be water”. Water changes form and moves through
    every crack. This is what you’ll become. An undefeated, unbroken oasis of
    life speaking itself into endless existence through design. Whatever the
    software the future uses, you will create them in Tactile for the world to
    witness and laud what it once ignored since it had no way to perceive it.
    <br />
    <br />
    This is our promise.
    <br />
    <br />
    So, are you ready?
  </>
];

const mobilePosters = [
  { id: 'dreamers', label: "We're here to help dreamers dream", imageSrc: posterDreamers },
  { id: 'demo', label: 'FRRR? product canvas', imageSrc: posterDemo },
  { id: 'process', label: 'Take back the process', imageSrc: posterProcess },
  { id: 'sign', label: 'Sign your work', imageSrc: posterSign }
] as const;

const manifestoTitle = (
  <>
    The true experience design software:<br />
    precision for an era of guesswork. All in code.
  </>
);

const mobileManifestoTitle = (
  <>
    The true experience<br />
    design software:<br />
    precision for an era of<br />
    guesswork. All in code.
  </>
);

const THEME_STORAGE_KEY = 'tactile-landing-theme';

type ThemeMode = 'light' | 'dark';

const manifestoPosterBackgrounds = {
  purple: {
    light: '#f5e4fb',
    dark: '#463251'
  },
  orange: {
    light: '#fff4ef',
    dark: '#563a34'
  },
  blue: {
    light: '#d6f3fd',
    dark: '#263c51'
  },
  green: {
    light: '#f1fce6',
    dark: '#3c4f2e'
  }
} satisfies Record<HomePosterId, Record<ThemeMode, string>>;

const MOBILE_HEADER_HEIGHT = 97;
const MOBILE_DIVIDER_HEIGHT = 32;
const MOBILE_COPY_MIN_HEIGHT = 291;
const MOBILE_POSTER_MIN_HEIGHT = 214;

function getMobileCopyMaxHeight() {
  if (typeof window === 'undefined') {
    return 509;
  }

  return Math.max(
    MOBILE_COPY_MIN_HEIGHT,
    Math.min(
      509,
      window.innerHeight -
        MOBILE_HEADER_HEIGHT -
        MOBILE_DIVIDER_HEIGHT -
        MOBILE_POSTER_MIN_HEIGHT
    )
  );
}

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ManifestoPage() {
  const setAudioController = useLandingStore(
    (state) => state.setAudioController
  );
  const setAudioStatus = useLandingStore((state) => state.setAudioStatus);
  const setMuted = useLandingStore((state) => state.setMuted);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [activeDesktopPoster, setActiveDesktopPoster] =
    useState<HomePosterId>('purple');
  const [mobileCopyHeight, setMobileCopyHeight] = useState(getMobileCopyMaxHeight);
  const [isMobileDividerDragging, setIsMobileDividerDragging] = useState(false);
  const [activeMobilePosterIndex, setActiveMobilePosterIndex] = useState(1);
  const [mobileForegroundPosterIndex, setMobileForegroundPosterIndex] =
    useState(3);
  const [mobilePosterDragX, setMobilePosterDragX] = useState(0);
  const [isMobilePosterPeeling, setIsMobilePosterPeeling] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const waitlistReturnFocusRef = useRef<HTMLElement | null>(null);
  const mobileDividerDragRef = useRef<{
    pointerId: number;
    startY: number;
    startHeight: number;
    lastY: number;
    lastTime: number;
    velocityY: number;
  } | null>(null);
  const mobilePosterDragRef = useRef<{
    pointerId: number;
    startX: number;
    startTime: number;
  } | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (nextTheme: ThemeMode) => {
      root.dataset.theme = nextTheme;
      setTheme(nextTheme);
    };

    if (savedTheme === 'light' || savedTheme === 'dark') {
      applyTheme(savedTheme);
    } else {
      applyTheme(getSystemTheme());
    }

    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

      if (storedTheme === 'light' || storedTheme === 'dark') {
        return;
      }

      applyTheme(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handlePreferenceChange);

    return () => {
      mediaQuery.removeEventListener('change', handlePreferenceChange);
    };
  }, []);

  useEffect(() => {
    document.body.classList.add('manifesto-page-open');

    return () => {
      document.body.classList.remove('manifesto-page-open');
    };
  }, []);

  useEffect(() => {
    const controller = createAudioController({
      src: birdAudio,
      onStateChange: (status) => setAudioStatus(status),
      onMuteChange: (muted) => setMuted(muted)
    });

    setAudioController(controller);

    return () => {
      setAudioController(null);
      controller.dispose();
    };
  }, [setAudioController, setAudioStatus, setMuted]);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  };

  const manifestoPosterPaneStyle = {
    '--manifest-active-poster-background':
      manifestoPosterBackgrounds[activeDesktopPoster][theme]
  } as CSSProperties;

  const handleOpenWaitlistModal = (event: MouseEvent<HTMLButtonElement>) => {
    waitlistReturnFocusRef.current = event.currentTarget;
    setIsWaitlistModalOpen(true);
  };

  const handleMobileDividerPointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>
  ) => {
    const now = performance.now();
    mobileDividerDragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startHeight: mobileCopyHeight,
      lastY: event.clientY,
      lastTime: now,
      velocityY: 0
    };
    setIsMobileDividerDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleMobileDividerPointerMove = (
    event: ReactPointerEvent<HTMLButtonElement>
  ) => {
    const dragState = mobileDividerDragRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const nextHeight = clamp(
      dragState.startHeight + (event.clientY - dragState.startY),
      MOBILE_COPY_MIN_HEIGHT,
      getMobileCopyMaxHeight()
    );

    const now = performance.now();
    dragState.velocityY =
      (event.clientY - dragState.lastY) /
      Math.max(now - dragState.lastTime, 1);
    dragState.lastY = event.clientY;
    dragState.lastTime = now;
    setMobileCopyHeight(nextHeight);
  };

  const handleMobileDividerPointerUp = (
    event: ReactPointerEvent<HTMLButtonElement>
  ) => {
    const dragState = mobileDividerDragRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const velocityY = dragState.velocityY;

    mobileDividerDragRef.current = null;
    setIsMobileDividerDragging(false);
    setMobileCopyHeight((currentHeight) => {
      const maxHeight = getMobileCopyMaxHeight();
      const midpoint = (MOBILE_COPY_MIN_HEIGHT + maxHeight) / 2;

      if (velocityY < -0.35) return MOBILE_COPY_MIN_HEIGHT;
      if (velocityY > 0.35) return maxHeight;
      return currentHeight < midpoint ? MOBILE_COPY_MIN_HEIGHT : maxHeight;
    });
  };

  const handleMobileDividerPointerCancel = (
    event: ReactPointerEvent<HTMLButtonElement>
  ) => {
    const dragState = mobileDividerDragRef.current;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    mobileDividerDragRef.current = null;
    setIsMobileDividerDragging(false);

    if (dragState) {
      setMobileCopyHeight(dragState.startHeight);
    }
  };

  const activeHandleImage =
    theme === 'dark' ? handleImageDark : handleImage;
  const mobilePosterProgress = clamp(
    (getMobileCopyMaxHeight() - mobileCopyHeight) /
      (getMobileCopyMaxHeight() - MOBILE_COPY_MIN_HEIGHT || 1),
    0,
    1
  );
  const mobileStageStyle = {
    ['--mobile-copy-height' as const]: `${mobileCopyHeight}px`,
    ['--mobile-poster-progress' as const]: mobilePosterProgress,
    ['--mobile-carousel-drag-offset' as const]: `${
      mobilePosterDragX * (1 - mobilePosterProgress)
    }px`
  } as CSSProperties;
  const isMobilePosterExpanded = mobilePosterProgress >= 0.5;
  const isMobilePosterPeelEnabled = mobilePosterProgress >= 0.98;

  useEffect(() => {
    const handleResize = () => {
      setMobileCopyHeight((height) =>
        clamp(height, MOBILE_COPY_MIN_HEIGHT, getMobileCopyMaxHeight())
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMobilePosterPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (mobilePosterProgress > 0.08) return;

    mobilePosterDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startTime: performance.now()
    };
    setMobilePosterDragX(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleMobilePosterPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const dragState = mobilePosterDragRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    setMobilePosterDragX(event.clientX - dragState.startX);
  };

  const finishMobilePosterDrag = (
    event: ReactPointerEvent<HTMLDivElement>,
    cancelled = false
  ) => {
    const dragState = mobilePosterDragRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const elapsed = Math.max(performance.now() - dragState.startTime, 1);
    const velocity = mobilePosterDragX / elapsed;
    const shouldMove = Math.abs(mobilePosterDragX) > 46 || Math.abs(velocity) > 0.45;

    if (!cancelled && shouldMove) {
      setActiveMobilePosterIndex((currentIndex) =>
        clamp(currentIndex + (mobilePosterDragX < 0 ? 1 : -1), 0, mobilePosters.length - 1)
      );
    }

    mobilePosterDragRef.current = null;
    setMobilePosterDragX(0);
  };

  return (
    <>
      <main
        className="landing-shell landing-shell--desktop"
        style={manifestoPosterPaneStyle}
      >
        <section className="hero-grid" aria-labelledby="manifesto-title">
          <div
            className="hero-copy-pane"
            role="region"
            aria-label="Manifesto text"
            tabIndex={0}
          >
            <header className="manifesto-desktop-header">
              <a className="manifesto-desktop-brand" href="/" aria-label="Tactile HCI home">
                <span className="manifesto-desktop-brand__mark">
                  <img src={tactileLogo} alt="" />
                </span>
                <span>Tactile HCI®</span>
              </a>

              <div className="manifesto-desktop-header__actions">
                <button
                  type="button"
                  className="manifesto-theme-toggle"
                  onClick={handleToggleTheme}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? 'Light theme' : 'Dark theme'}
                </button>
                <button
                  type="button"
                  className="manifesto-waitlist-button"
                  onClick={handleOpenWaitlistModal}
                >
                  Join the waitlist
                </button>
              </div>
            </header>

            <div className="hero-copy-layout">
              <div className="hero-rail" aria-hidden="true">
                <img className="hero-rail__dot" src={activeHandleImage} alt="" />
                <img className="hero-rail__dot" src={activeHandleImage} alt="" />
                <img className="hero-rail__dot" src={activeHandleImage} alt="" />
                <img className="hero-rail__dot" src={activeHandleImage} alt="" />
                <img className="hero-rail__dot" src={activeHandleImage} alt="" />
                <img className="hero-rail__dot" src={activeHandleImage} alt="" />
                <img className="hero-rail__dot" src={activeHandleImage} alt="" />
              </div>

              <div className="hero-copy-column">
                <HeroCopy
                  eyebrow={{ left: 'JUNE 5, 2026', right: 'K10 PANEL' }}
                  paragraphs={manifestoParagraphs}
                  titleId="manifesto-title"
                  title={manifestoTitle}
                />
                <SignatureBlock theme={theme} />
              </div>
            </div>
          </div>

          <aside
            className={`hero-art-column hero-art-column--${activeDesktopPoster}`}
            aria-label="Interactive media"
          >
            <div className="hero-art-column__sticky">
              <HomePosterStack
                placement="manifesto"
                activeId={activeDesktopPoster}
                onActiveChange={setActiveDesktopPoster}
              />
              <div className="landing-footer-bar">
                <p className="footer-mark">©2026 Tactile Interactive. All rights reserved.</p>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <section className="landing-shell-mobile">
        <div
          className={`mobile-stage${
            isMobilePosterExpanded ? ' mobile-stage--poster-expanded' : ''
          }${
            isMobileDividerDragging ? ' mobile-stage--dragging' : ''
          }`}
          style={mobileStageStyle}
        >
          <header className="mobile-stage__header">
            <a className="mobile-stage__brand" href="/" aria-label="Tactile HCI home">
              <span className="mobile-stage__brand-mark">
                <img src={tactileLogo} alt="" />
              </span>
              <span>Tactile HCI®</span>
            </a>

            <button
              type="button"
              className="mobile-stage__waitlist"
              onClick={handleOpenWaitlistModal}
            >
              Join the waitlist
            </button>
          </header>

          <div className="mobile-stage__panel-stack">
            <section
              className="mobile-stage__copy-panel"
              aria-labelledby="manifesto-title-mobile"
            >
              <div className="mobile-stage__copy-scroll">
                <img
                  className="mobile-stage__copy-handle"
                  src={activeHandleImage}
                  alt=""
                  aria-hidden="true"
                />
                <HeroCopy
                  eyebrow={{ left: 'JUNE 5, 2026', right: 'K10 PANEL' }}
                  paragraphs={manifestoParagraphs}
                  titleId="manifesto-title-mobile"
                  title={mobileManifestoTitle}
                />
              </div>
            </section>

            <button
              type="button"
              className="mobile-stage__divider"
              role="separator"
              aria-orientation="horizontal"
              aria-label="Drag to resize copy and poster panels"
              aria-valuemin={MOBILE_COPY_MIN_HEIGHT}
              aria-valuemax={getMobileCopyMaxHeight()}
              aria-valuenow={Math.round(mobileCopyHeight)}
              aria-valuetext={
                isMobilePosterExpanded
                  ? 'Poster panel expanded'
                  : 'Reading panel expanded'
              }
              onPointerDown={handleMobileDividerPointerDown}
              onPointerMove={handleMobileDividerPointerMove}
              onPointerUp={handleMobileDividerPointerUp}
              onPointerCancel={handleMobileDividerPointerCancel}
              onKeyDown={(event) => {
                if (event.key === 'ArrowUp' || event.key === 'Home') {
                  event.preventDefault();
                  setMobileCopyHeight(MOBILE_COPY_MIN_HEIGHT);
                }

                if (event.key === 'ArrowDown' || event.key === 'End') {
                  event.preventDefault();
                  setMobileCopyHeight(getMobileCopyMaxHeight());
                }
              }}
            >
              <span className="mobile-stage__divider-handle" />
            </button>

            <section className="mobile-stage__poster-panel" aria-label="Poster carousel">
              <div
                className="mobile-stage__poster-viewport"
                onPointerDown={handleMobilePosterPointerDown}
                onPointerMove={handleMobilePosterPointerMove}
                onPointerUp={(event) => finishMobilePosterDrag(event)}
                onPointerCancel={(event) => finishMobilePosterDrag(event, true)}
              >
                <div className="mobile-stage__poster-composition">
                  {mobilePosters.map((_, slotIndex) => {
                    const itemIndex =
                      (mobileForegroundPosterIndex + 1 + slotIndex) %
                      mobilePosters.length;
                    const item = mobilePosters[itemIndex];
                    const isForeground =
                      slotIndex === mobilePosters.length - 1;

                    return (
                      <button
                        key={`${slotIndex}-${item.id}`}
                        type="button"
                        className={`mobile-stage__poster-card mobile-stage__poster-card--${
                          slotIndex + 1
                        }${isForeground ? ' is-active' : ''}${
                          isForeground && isMobilePosterPeeling
                            ? ' is-peeling'
                            : ''
                        }`}
                        aria-label={`${item.label}${
                          isForeground ? ', selected' : ''
                        }`}
                        onClick={() => {
                          setActiveMobilePosterIndex(itemIndex);
                          setMobileForegroundPosterIndex(itemIndex);
                        }}
                      >
                        <img
                          className="mobile-stage__poster-card-image"
                          src={item.imageSrc}
                          alt=""
                          aria-hidden="true"
                          draggable={false}
                        />

                        {isForeground && isMobilePosterPeelEnabled ? (
                          <div
                            className="home-poster-peel mobile-stage__poster-peel"
                            aria-hidden="true"
                          >
                            <PeelPosterCanvas
                              imageSrc={item.imageSrc}
                              width={173}
                              height={245}
                              interactionMode="touch"
                              onComplete={() => {
                                const nextPosterIndex =
                                  (mobileForegroundPosterIndex + 1) %
                                  mobilePosters.length;
                                setMobileForegroundPosterIndex(nextPosterIndex);
                                setActiveMobilePosterIndex(nextPosterIndex);
                              }}
                              onPeelingChange={setIsMobilePosterPeeling}
                            />
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mobile-stage__pagination" aria-label="Choose poster">
                {mobilePosters.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={index === activeMobilePosterIndex ? 'is-active' : ''}
                    aria-label={`Show ${item.label}`}
                    aria-current={index === activeMobilePosterIndex ? 'true' : undefined}
                    onClick={() => {
                      setActiveMobilePosterIndex(index);
                      setMobileForegroundPosterIndex(index);
                    }}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <WaitlistModal
        open={isWaitlistModalOpen}
        onOpenChange={setIsWaitlistModalOpen}
        returnFocusRef={waitlistReturnFocusRef}
        theme={theme}
      />
    </>
  );
}
