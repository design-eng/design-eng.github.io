import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import HTMLFlipBook from 'react-pageflip-enhanced';
import { HeroCopy } from '../components/hero/HeroCopy';
import { TopBar } from '../components/layout/TopBar';
import { PosterStack } from '../components/posters/PosterStack';
import { SignatureBlock } from '../components/signature/SignatureBlock';
import { WaitlistButton } from '../components/cta/WaitlistButton';
import { WaitlistModal } from '../components/cta/WaitlistModal';
import { VinylPlayer } from '../components/audio/VinylPlayer';
import { useLandingStore } from '../state/useLandingStore';
import { createAudioController } from '../lib/audio/audioController';
import birdAudio from '../assets/bird-audio.wav';
import handleImage from '../assets/handle.png';
import handleImageDark from '../assets/handle-dark.png';
import posterBlue from '../assets/poster-one.png';
import posterOrange from '../assets/poster-two.png';
import posterBlack from '../assets/poster-five.png';
import posterYellow from '../assets/poster-six.png';
import posterGreen from '../assets/poster-seven.png';
import tactileManifestLogo from '../assets/tactile-manifest-logo.png';
import tactileManifestLogoDark from '../assets/tactile-manifest-logo-dark.svg';

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

const stackItems = [
  {
    id: 'black-poster',
    label: 'Widerständigen zählen',
    imageSrc: posterBlack
  },
  {
    id: 'blue-cover',
    label: '21 August',
    imageSrc: posterBlue
  },
  {
    id: 'orange-sheet',
    label: 'Brasa',
    imageSrc: posterOrange
  },
  {
    id: 'yellow-poster',
    label: 'April + Mai 2024',
    imageSrc: posterYellow
  },
  {
    id: 'green-poster',
    label: 'RoztoCza',
    imageSrc: posterGreen
  }
] as const;

const THEME_STORAGE_KEY = 'tactile-landing-theme';

type ThemeMode = 'light' | 'dark';
type MobilePanelFocus = 'copy' | 'balanced' | 'poster';
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

const MOBILE_PANEL_SHIFTS: Record<MobilePanelFocus, number> = {
  copy: 96,
  balanced: 0,
  poster: -120
};

const MOBILE_POSTER_ITEMS = [stackItems[1], stackItems[2], stackItems[3]];
const MOBILE_POSTER_QUOTES = [
  'Imagine if you interacted with products built with a little more intention everyday.',
  'The prompt slot machine could not be enough. Substance is still the foundation of the creative spirit.',
  'Let those who dream be empowered to dream more.'
] as const;
const MOBILE_POSTER_FLIP_TIME_MS = 1080;

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function App() {
  const setAudioController = useLandingStore(
    (state) => state.setAudioController
  );
  const setAudioStatus = useLandingStore((state) => state.setAudioStatus);
  const setMuted = useLandingStore((state) => state.setMuted);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [mobilePanelFocus, setMobilePanelFocus] =
    useState<MobilePanelFocus>('copy');
  const [mobilePanelShift, setMobilePanelShift] = useState(
    MOBILE_PANEL_SHIFTS.copy
  );
  const [activeMobilePosterIndex, setActiveMobilePosterIndex] = useState(0);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [desktopPosterOverlayContainer, setDesktopPosterOverlayContainer] =
    useState<HTMLDivElement | null>(null);
  const [renderMobilePosterTray, setRenderMobilePosterTray] = useState(true);
  const [renderMobilePosterDetail, setRenderMobilePosterDetail] =
    useState(false);
  const [
    isMobilePosterPanelTransitioning,
    setIsMobilePosterPanelTransitioning
  ] = useState(false);
  const [isMobilePosterFlipping, setIsMobilePosterFlipping] = useState(false);
  const mobileDividerDragRef = useRef<{
    pointerId: number;
    startY: number;
    startShift: number;
  } | null>(null);
  const mobilePosterFlipBookRef = useRef<FlipBookHandle | null>(null);
  const pendingMobilePosterLoopResetRef = useRef<number | null>(null);

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
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.dataset.theme = nextTheme;
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);

      return nextTheme;
    });
  };

  const handleOpenWaitlistModal = () => {
    setIsWaitlistModalOpen(true);
  };

  const snapMobilePanelFocus = (shift: number) => {
    const nearestFocus = (
      Object.entries(MOBILE_PANEL_SHIFTS) as [MobilePanelFocus, number][]
    ).reduce(
      (closest, [focus, candidateShift]) =>
        Math.abs(candidateShift - shift) < Math.abs(closest.shift - shift)
          ? { focus, shift: candidateShift }
          : closest,
      {
        focus: 'balanced' as MobilePanelFocus,
        shift: MOBILE_PANEL_SHIFTS.balanced
      }
    );

    setMobilePanelFocus(nearestFocus.focus);
    setMobilePanelShift(nearestFocus.shift);
  };

  const handleMobileDividerPointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>
  ) => {
    mobileDividerDragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startShift: mobilePanelShift
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleMobileDividerPointerMove = (
    event: ReactPointerEvent<HTMLButtonElement>
  ) => {
    const dragState = mobileDividerDragRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const nextShift = clamp(
      dragState.startShift + (event.clientY - dragState.startY),
      MOBILE_PANEL_SHIFTS.poster,
      MOBILE_PANEL_SHIFTS.copy
    );

    setMobilePanelShift(nextShift);
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

    mobileDividerDragRef.current = null;
    snapMobilePanelFocus(mobilePanelShift);
  };

  const handleMobileDividerPointerCancel = (
    event: ReactPointerEvent<HTMLButtonElement>
  ) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    mobileDividerDragRef.current = null;
    setMobilePanelShift(MOBILE_PANEL_SHIFTS[mobilePanelFocus]);
  };

  const mobilePosterProgress =
    (MOBILE_PANEL_SHIFTS.copy - mobilePanelShift) /
    (MOBILE_PANEL_SHIFTS.copy - MOBILE_PANEL_SHIFTS.poster);
  const clampedMobilePosterProgress = clamp(mobilePosterProgress, 0, 1);
  const activeHandleImage =
    theme === 'dark' ? handleImageDark : handleImage;
  const mobileStageStyle = {
    ['--mobile-panel-shift' as const]: `${mobilePanelShift}px`,
    ['--mobile-poster-progress' as const]: clampedMobilePosterProgress
  } as CSSProperties;
  const showMobilePosterFooter =
    mobilePanelFocus !== 'copy' ||
    Math.abs(mobilePanelShift - MOBILE_PANEL_SHIFTS.copy) > 1;
  const activeMobilePoster = MOBILE_POSTER_ITEMS[activeMobilePosterIndex];
  const activeMobilePosterQuote =
    MOBILE_POSTER_QUOTES[activeMobilePosterIndex] ?? MOBILE_POSTER_QUOTES[0];
  const mobilePosterPages = useMemo(() => {
    if (!MOBILE_POSTER_ITEMS.length) {
      return [];
    }

    const firstPoster = MOBILE_POSTER_ITEMS[0];
    const lastPoster = MOBILE_POSTER_ITEMS[MOBILE_POSTER_ITEMS.length - 1];

    return [lastPoster, ...MOBILE_POSTER_ITEMS, firstPoster];
  }, []);
  const mobileRenderedPosterPages = useMemo(
    () =>
      mobilePosterPages.map((item, index) => (
        <div key={`${item.id}-${index}`} className="mobile-stage__poster-page">
          <div className="mobile-stage__poster-page-sheet">
            <img
              className="mobile-stage__poster-page-image"
              src={item.imageSrc}
              alt={item.label}
              draggable={false}
            />
          </div>
        </div>
      )),
    [mobilePosterPages]
  );

  useEffect(() => {
    if (showMobilePosterFooter) {
      const startTimeoutId = window.setTimeout(() => {
        setRenderMobilePosterDetail(true);
        setIsMobilePosterPanelTransitioning(true);
      }, 0);

      const endTimeoutId = window.setTimeout(() => {
        setRenderMobilePosterTray(false);
        setIsMobilePosterPanelTransitioning(false);
      }, 280);

      return () => {
        window.clearTimeout(startTimeoutId);
        window.clearTimeout(endTimeoutId);
      };
    }

    const startTimeoutId = window.setTimeout(() => {
      setRenderMobilePosterTray(true);
      setIsMobilePosterPanelTransitioning(true);
    }, 0);

    const endTimeoutId = window.setTimeout(() => {
      setRenderMobilePosterDetail(false);
      setIsMobilePosterPanelTransitioning(false);
    }, 280);

    return () => {
      window.clearTimeout(startTimeoutId);
      window.clearTimeout(endTimeoutId);
    };
  }, [showMobilePosterFooter]);

  useEffect(() => {
    const flipApi = mobilePosterFlipBookRef.current?.pageFlip();

    if (!flipApi || pendingMobilePosterLoopResetRef.current !== null) {
      return;
    }

    const expectedPage = activeMobilePosterIndex + 1;

    if (flipApi.getCurrentPageIndex() !== expectedPage) {
      flipApi.turnToPage(expectedPage);
    }
  }, [activeMobilePosterIndex]);

  const handleMobilePosterFlip = (event: FlipEvent) => {
    const pageIndex = event.data;
    const lastSentinelPage = MOBILE_POSTER_ITEMS.length + 1;

    if (pageIndex === 0) {
      pendingMobilePosterLoopResetRef.current = MOBILE_POSTER_ITEMS.length;
      setActiveMobilePosterIndex(MOBILE_POSTER_ITEMS.length - 1);
      return;
    }

    if (pageIndex === lastSentinelPage) {
      pendingMobilePosterLoopResetRef.current = 1;
      setActiveMobilePosterIndex(0);
      return;
    }

    pendingMobilePosterLoopResetRef.current = null;
    setActiveMobilePosterIndex(pageIndex - 1);
  };

  const handleMobilePosterFlipStateChange = (event: FlipStateEvent) => {
    setIsMobilePosterFlipping(event.data === 'flipping');

    if (
      event.data !== 'read' ||
      pendingMobilePosterLoopResetRef.current === null
    ) {
      return;
    }

    const resetPage = pendingMobilePosterLoopResetRef.current;
    pendingMobilePosterLoopResetRef.current = null;

    window.setTimeout(() => {
      mobilePosterFlipBookRef.current?.pageFlip().turnToPage(resetPage);
    }, 34);
  };

  const handleSelectPreviousMobilePoster = () => {
    if (isMobilePosterFlipping) {
      return;
    }

    mobilePosterFlipBookRef.current?.pageFlip().flipPrev('top');
  };

  const handleSelectNextMobilePoster = () => {
    if (isMobilePosterFlipping) {
      return;
    }

    mobilePosterFlipBookRef.current?.pageFlip().flipNext('top');
  };

  return (
    <>
      <main className="landing-shell landing-shell--desktop">
        <section className="hero-grid" aria-labelledby="manifesto-title">
          <div className="hero-copy-pane">
            <TopBar
              side="left"
              theme={theme}
              onToggleTheme={handleToggleTheme}
              onOpenWaitlist={handleOpenWaitlistModal}
            />

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
                  eyebrow={{ left: '12 MAY 2026', right: 'K10 PANEL' }}
                  paragraphs={manifestoParagraphs}
                  titleId="manifesto-title"
                />
                <SignatureBlock />
              </div>
            </div>
          </div>

          <aside className="hero-art-column" aria-label="Interactive media">
            <div
              ref={setDesktopPosterOverlayContainer}
              className="hero-art-column__sticky"
            >
              <TopBar side="right" theme={theme} />
              <PosterStack items={stackItems} />
              <div className="landing-footer-bar">
                <WaitlistButton
                  variant="signature"
                  onClick={handleOpenWaitlistModal}
                />
                <p className="footer-mark">©2026 Tactile Labs Inc.</p>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <section
        className={`landing-shell-mobile landing-shell-mobile--${mobilePanelFocus}`}
      >
        <div
          className={`mobile-stage${
            showMobilePosterFooter ? ' mobile-stage--poster-detail' : ''
          }`}
          style={mobileStageStyle}
        >
          <header className="mobile-stage__header">
            <div className="mobile-stage__header-row">
              <img
                className="mobile-stage__brand"
                src={
                  theme === 'dark'
                    ? tactileManifestLogoDark
                    : tactileManifestLogo
                }
                alt="Tactile Manifesto beta"
              />
              <div className="mobile-stage__player">
                <VinylPlayer compact />
              </div>
            </div>

            <div className="mobile-stage__actions">
              <img
                className="hero-rail__dot mobile-stage__actions-dot"
                src={activeHandleImage}
                alt=""
                aria-hidden="true"
              />

              <div className="mobile-stage__actions-group">
                <button
                  type="button"
                  className="theme-toggle mobile-stage__theme-toggle"
                  onClick={handleToggleTheme}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </button>

                <WaitlistButton
                  variant="topbar"
                  onClick={handleOpenWaitlistModal}
                />
              </div>
            </div>
          </header>

          <div className="mobile-stage__panel-stack">
            <section
              className="mobile-stage__copy-panel"
              aria-labelledby="manifesto-title-mobile"
            >
              <div className="mobile-stage__copy-scroll">
                <HeroCopy
                  eyebrow={{ left: '12 MAY 2026', right: 'K10 PANEL' }}
                  paragraphs={manifestoParagraphs}
                  titleId="manifesto-title-mobile"
                />
              </div>
            </section>

            <button
              type="button"
              className="mobile-stage__divider"
              aria-label="Drag to resize copy and poster panels"
              onPointerDown={handleMobileDividerPointerDown}
              onPointerMove={handleMobileDividerPointerMove}
              onPointerUp={handleMobileDividerPointerUp}
              onPointerCancel={handleMobileDividerPointerCancel}
            >
              <span className="mobile-stage__divider-handle" />
            </button>

            <section
              className={`mobile-stage__poster-panel${
                showMobilePosterFooter
                  ? ' mobile-stage__poster-panel--detail'
                  : ' mobile-stage__poster-panel--initial'
              }${
                isMobilePosterPanelTransitioning
                  ? ' mobile-stage__poster-panel--transitioning'
                  : ''
              }`}
              aria-label="Poster tray"
            >
              {renderMobilePosterTray ? (
                <>
                  <div className="mobile-stage__poster-row">
                    {MOBILE_POSTER_ITEMS.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`mobile-stage__poster-card${
                          index === activeMobilePosterIndex ? ' is-active' : ''
                        }`}
                        aria-label={item.label}
                        onClick={() => setActiveMobilePosterIndex(index)}
                      >
                        <img src={item.imageSrc} alt="" aria-hidden="true" />
                      </button>
                    ))}
                  </div>

                  <span
                    className="mobile-stage__poster-indicator"
                    aria-hidden="true"
                  />
                </>
              ) : null}

              {renderMobilePosterDetail ? (
                <div
                  className="mobile-stage__poster-detail"
                  aria-hidden={!showMobilePosterFooter}
                >
                  <div className="mobile-stage__poster-hero">
                    <button
                      type="button"
                      className="mobile-stage__poster-nav mobile-stage__poster-nav--prev"
                      aria-label="Show previous poster"
                      onClick={handleSelectPreviousMobilePoster}
                    >
                      <span aria-hidden="true">←</span>
                    </button>

                    <figure className="mobile-stage__poster-figure">
                      <article
                        className={`mobile-stage__poster-active${
                          isMobilePosterFlipping
                            ? ' mobile-stage__poster-active--flipping'
                            : ''
                        }`}
                        aria-label={`${activeMobilePoster.label} poster`}
                      >
                        <div className="mobile-stage__poster-flip-shell">
                          <HTMLFlipBook
                            ref={mobilePosterFlipBookRef}
                            className="mobile-stage__poster-flipbook"
                            width={152}
                            height={220}
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
                            flippingTime={MOBILE_POSTER_FLIP_TIME_MS}
                            startPage={activeMobilePosterIndex + 1}
                            clickEventForward={false}
                            disableFlipByClick
                            onChangeState={handleMobilePosterFlipStateChange}
                            onFlip={handleMobilePosterFlip}
                            renderOnlyPageLengthChange
                          >
                            {mobileRenderedPosterPages}
                          </HTMLFlipBook>
                        </div>
                      </article>
                    </figure>

                    <button
                      type="button"
                      className="mobile-stage__poster-nav mobile-stage__poster-nav--next"
                      aria-label="Show next poster"
                      onClick={handleSelectNextMobilePoster}
                    >
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>

                  <p className="mobile-stage__poster-quote">
                    {activeMobilePosterQuote}
                  </p>

                  <WaitlistButton
                    variant="signature"
                    onClick={handleOpenWaitlistModal}
                  />
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </section>

      <WaitlistModal
        desktopOverlayContainer={desktopPosterOverlayContainer}
        open={isWaitlistModalOpen}
        onOpenChange={setIsWaitlistModalOpen}
        theme={theme}
      />
    </>
  );
}
