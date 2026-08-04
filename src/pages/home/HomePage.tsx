import {
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useId,
  useRef,
  useState
} from 'react';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import tactileLogo from '../../assets/tactile-logo.png';
import tactilePexelsPurple from '../../assets/tactile-pexels-purple.png';
import tactilePexelsOrange from '../../assets/tactile-pexels-orange.png';
import tactilePexelsBlue from '../../assets/tactile-pexels-blue.png';
import tactilePexelsGreen from '../../assets/tactile-pexels-green.png';
import tactilePexelsMobile from '../../assets/tactile-pexels.png';
import tactilePexelsPurpleDark from '../../assets/tactile-pexels-purple-dark.png';
import tactilePexelsOrangeDark from '../../assets/tactile-pexels-orange-dark.png';
import tactilePexelsBlueDark from '../../assets/tactile-pexels-blue-dark.png';
import tactilePexelsGreenDark from '../../assets/tactile-pexels-green-dark.png';
import tactilePexelsPurpleDesktopDark from '../../assets/tactile-pexels-purple-desktop-dark.png';
import tactilePexelsOrangeDesktopDark from '../../assets/tactile-pexels-orange-desktop-dark.png';
import tactilePexelsBlueDesktopDark from '../../assets/tactile-pexels-blue-desktop-dark.png';
import tactilePexelsGreenDesktopDark from '../../assets/tactile-pexels-green-desktop-dark.png';
import { WaitlistModal } from '../../components/cta/WaitlistModal';
import { AnimatedExperienceToken } from '../../components/home/AnimatedExperienceToken';
// import { HomeDemo } from '../../components/home/HomeDemo';
import { MobileHomePosterStack } from '../../components/home/MobileHomePosterStack';
import {
  HomePosterStack,
  type HomePosterId
} from '../../components/home/HomePosterStack';

const manifestPreviewSlides = [
  [
    'Today, we have heard over and over again how modern software lacks soul and taste.',
    'The creative tools, solutions and social infrastructure of today haven’t been built to allow for the growth of either of these.'
  ],
  [
    'Intelligent as it may be, it is a creation born out of the creative’s passion to be precise: a product of craftsmanship and obsession.',
    'We didn’t call it the game changer. It is, however, the enabler of game-changing work.'
  ],
  [
    'Tactile means relating to the sense of touch; perceptible by touch or apparently so; tangible.',
    'We are making software much more than what’s seen but what’s felt.'
  ],
  [
    'Design tools today are still solving yesterday’s problem: “How do we make it look good?”',
    'With Tactile, we probe further to ask: “How do we make it feel great?”'
  ]
] as const;

const MANIFEST_CAROUSEL_INTERVAL_MS = 6000;
const THEME_STORAGE_KEY = 'tactile-landing-theme';

type ThemeMode = 'light' | 'dark';

function getInitialTheme(): ThemeMode {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

const homePosterThemes = {
  purple: {
    paneColor: '#f8e7ff',
    surfaceColor: '#f8e7ff',
    darkPaneColor: '#463251',
    darkSurfaceColor: '#4c3458',
    pexelsSrc: tactilePexelsPurple,
    darkDesktopPexelsSrc: tactilePexelsPurpleDesktopDark,
    mobilePexelsSrc: tactilePexelsMobile,
    darkMobilePexelsSrc: tactilePexelsPurpleDark
  },
  orange: {
    paneColor: '#fff4ef',
    surfaceColor: '#fff4ef',
    darkPaneColor: '#563a34',
    darkSurfaceColor: '#60403a',
    pexelsSrc: tactilePexelsOrange,
    darkDesktopPexelsSrc: tactilePexelsOrangeDesktopDark,
    mobilePexelsSrc: tactilePexelsOrange,
    darkMobilePexelsSrc: tactilePexelsOrangeDark
  },
  blue: {
    paneColor: '#d6f3fd',
    surfaceColor: '#dafaff',
    darkPaneColor: '#263c51',
    darkSurfaceColor: '#273f58',
    pexelsSrc: tactilePexelsBlue,
    darkDesktopPexelsSrc: tactilePexelsBlueDesktopDark,
    mobilePexelsSrc: tactilePexelsBlue,
    darkMobilePexelsSrc: tactilePexelsBlueDark
  },
  green: {
    paneColor: '#f1fce6',
    surfaceColor: '#f1fce6',
    darkPaneColor: '#3c4f2e',
    darkSurfaceColor: '#3f562f',
    pexelsSrc: tactilePexelsGreen,
    darkDesktopPexelsSrc: tactilePexelsGreenDesktopDark,
    mobilePexelsSrc: tactilePexelsGreen,
    darkMobilePexelsSrc: tactilePexelsGreenDark
  }
} satisfies Record<
  HomePosterId,
  {
    paneColor: string;
    surfaceColor: string;
    darkPaneColor: string;
    darkSurfaceColor: string;
    pexelsSrc: string;
    darkDesktopPexelsSrc: string;
    mobilePexelsSrc: string;
    darkMobilePexelsSrc: string;
  }
>;

export function HomePage() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [isMobileViewport, setIsMobileViewport] = useState(
    () => window.matchMedia('(max-width: 620px)').matches
  );
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const waitlistReturnFocusRef = useRef<HTMLElement | null>(null);

  const handleWaitlistOpen = (event: MouseEvent<HTMLButtonElement>) => {
    waitlistReturnFocusRef.current = event.currentTarget;
    setIsWaitlistModalOpen(true);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHomePoster, setActiveHomePoster] =
    useState<HomePosterId>('purple');
  const [activeManifestSlide, setActiveManifestSlide] = useState(1);
  const [
    isManifestCarouselManuallyPaused,
    setIsManifestCarouselManuallyPaused
  ] = useState(false);
  const [isManifestCarouselInteracting, setIsManifestCarouselInteracting] =
    useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const manifestCarouselId = useId();
  const mobileMenuId = useId();
  const discordInviteUrl =
    import.meta.env.VITE_DISCORD_INVITE_URL ?? 'https://discord.com/';
  const isManifestCarouselPaused =
    isManifestCarouselManuallyPaused || isManifestCarouselInteracting;
  const activeHomeTheme = homePosterThemes[activeHomePoster];
  const homePageStyle = {
    '--home-pane-light-color': activeHomeTheme.paneColor,
    '--home-surface-light-color': activeHomeTheme.surfaceColor,
    '--home-pane-dark-color': activeHomeTheme.darkPaneColor,
    '--home-surface-dark-color': activeHomeTheme.darkSurfaceColor
  } as CSSProperties;

  useEffect(() => {
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const mobileQuery = window.matchMedia('(max-width: 620px)');
    const applyStoredOrSystemTheme = () => setTheme(getInitialTheme());
    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) applyStoredOrSystemTheme();
    };
    const handleMobileChange = () => setIsMobileViewport(mobileQuery.matches);

    document.documentElement.dataset.theme = theme;
    colorSchemeQuery.addEventListener('change', applyStoredOrSystemTheme);
    mobileQuery.addEventListener('change', handleMobileChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      colorSchemeQuery.removeEventListener('change', applyStoredOrSystemTheme);
      mobileQuery.removeEventListener('change', handleMobileChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, [theme]);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );
    const handleReducedMotionChange = () => {
      setPrefersReducedMotion(reducedMotionQuery.matches);
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      reducedMotionQuery.removeEventListener(
        'change',
        handleReducedMotionChange
      );
    };
  }, []);

  useEffect(() => {
    if (isManifestCarouselPaused || prefersReducedMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveManifestSlide(
        (currentSlide) => (currentSlide + 1) % manifestPreviewSlides.length
      );
    }, MANIFEST_CAROUSEL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isManifestCarouselPaused, prefersReducedMotion]);

  const selectManifestSlide = (index: number, pauseRotation = true) => {
    const slideCount = manifestPreviewSlides.length;
    setActiveManifestSlide((index + slideCount) % slideCount);

    if (pauseRotation) {
      setIsManifestCarouselManuallyPaused(true);
    }
  };

  const handleManifestPaginationClick = (index: number) => {
    if (index === activeManifestSlide) {
      setIsManifestCarouselManuallyPaused((isPaused) => !isPaused);
      return;
    }

    selectManifestSlide(index);
  };

  const handleManifestPaginationKeyDown = (
    event: KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectManifestSlide(activeManifestSlide + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectManifestSlide(activeManifestSlide - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      selectManifestSlide(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      selectManifestSlide(manifestPreviewSlides.length - 1);
    }
  };

  const handleManifestCarouselBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (
      !event.relatedTarget ||
      !event.currentTarget.contains(event.relatedTarget)
    ) {
      setIsManifestCarouselInteracting(false);
    }
  };

  return (
    <>
      <main
        className="home-page"
        data-active-poster={activeHomePoster}
        style={homePageStyle}
      >
        <header className="home-header">
          <div className="home-header__identity">
            <Link className="home-brand" to="/" aria-label="Tactile HCI home">
              <span className="home-brand__mark-surface" aria-hidden="true">
                <img className="home-brand__mark" src={tactileLogo} alt="" />
              </span>
              <span className="home-brand__name">Tactile HCI®</span>
            </Link>

            <a
              className="home-header__discord"
              href={discordInviteUrl}
              target="_blank"
              rel="noreferrer"
            >
              Join our Discord server
            </a>
          </div>

          <nav className="home-header__actions" aria-label="Primary navigation">
            <Link
              className="home-button home-button--secondary"
              to="/manifesto"
            >
              Read our manifest
            </Link>
            <button
              type="button"
              className="home-button home-button--primary"
              onClick={handleWaitlistOpen}
            >
              Join the waitlist
            </button>
          </nav>

          <div
            className="home-mobile-menu"
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setIsMobileMenuOpen(false);
              }
            }}
          >
            <button
              type="button"
              className="home-mobile-menu__button home-button home-button--secondary"
              aria-expanded={isMobileMenuOpen}
              aria-controls={mobileMenuId}
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            >
              Menu
            </button>

            {isMobileMenuOpen ? (
              <nav
                id={mobileMenuId}
                className="home-mobile-menu__popover"
                aria-label="Mobile navigation"
              >
                <Link
                  to="/manifesto"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Read our manifest
                </Link>
                <a
                  href={discordInviteUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join our Discord server
                </a>
                <button
                  type="button"
                  onClick={(event) => {
                    setIsMobileMenuOpen(false);
                    waitlistReturnFocusRef.current = event.currentTarget;
                    setIsWaitlistModalOpen(true);
                  }}
                >
                  Join the waitlist
                </button>
              </nav>
            ) : null}
          </div>
        </header>

        <div className="home-sticky-pane">
          <div className="home-sticky-pane__inner">
            <HomePosterStack
              activeId={activeHomePoster}
              onActiveChange={setActiveHomePoster}
            />
          </div>
        </div>

        <div className="home-layout">
          <section className="home-hero-copy" aria-labelledby="home-title">
            <h1 id="home-title">
              <span className="home-title__desktop-sr sr-only">
                The true experience design software: precision for an era of
                guesswork. All in code, of course
              </span>
              <span className="home-title__desktop" aria-hidden="true">
                The true <AnimatedExperienceToken /> design software: precision
                for an era of guesswork. All in code, of course
              </span>
              <span className="home-title__mobile-sr sr-only">
                The true experience design software: precision for an era of
                guesswork. All in code, of course.
              </span>
              <span className="home-title__mobile" aria-hidden="true">
                <span>
                  The true <AnimatedExperienceToken variant="mobile" />
                </span>
                <span>design software: precision</span>
                <span>for an era of guesswork.</span>
                <span>All in code, of course.</span>
              </span>
            </h1>

            <div className="home-hero-copy__actions">
              <button
                type="button"
                className="home-button home-button--primary"
                onClick={handleWaitlistOpen}
              >
                <span className="home-waitlist-label--desktop">
                  Join the waitlist
                </span>
                <span className="home-waitlist-label--mobile">
                  Join waitlist
                </span>
              </button>
              <Link
                className="home-button home-button--secondary"
                to="/manifesto"
              >
                Read our manifest
              </Link>
            </div>
          </section>

          <MobileHomePosterStack
            activeId={activeHomePoster}
            onActiveChange={setActiveHomePoster}
          />
          {/* 
          <div className="home-demo-region">
            <HomeDemo />
          </div> */}

          <section className="home-manifest-preview">
            <div className="home-manifest-preview__label">
              <div className="home-manifest-preview__label-heading">
                <p>Tactile Manifest</p>
                <Link
                  className="home-manifest-preview__mobile-arrow"
                  to="/manifesto"
                  aria-label="Read the Tactile Manifest"
                >
                  <ArrowRightIcon />
                </Link>
              </div>
              <Link to="/manifesto">Read all</Link>
            </div>

            <div
              id={`${manifestCarouselId}-carousel`}
              className="home-manifest-preview__copy"
              role="region"
              aria-roledescription="carousel"
              aria-label="Manifest highlights, auto-rotating"
              onMouseEnter={() => setIsManifestCarouselInteracting(true)}
              onMouseLeave={() => setIsManifestCarouselInteracting(false)}
              onFocusCapture={() => setIsManifestCarouselInteracting(true)}
              onBlurCapture={handleManifestCarouselBlur}
            >
              <div
                key={activeManifestSlide}
                className="home-manifest-preview__slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${activeManifestSlide + 1} of ${manifestPreviewSlides.length}`}
                aria-live={isManifestCarouselPaused ? 'polite' : 'off'}
              >
                {manifestPreviewSlides[activeManifestSlide].map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div
                className="home-manifest-preview__pagination"
                role="group"
                aria-label="Choose a manifest highlight"
                onKeyDown={handleManifestPaginationKeyDown}
              >
                {manifestPreviewSlides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={
                      index === activeManifestSlide ? 'is-active' : undefined
                    }
                    aria-label={
                      index === activeManifestSlide
                        ? isManifestCarouselManuallyPaused
                          ? 'Resume automatic manifest rotation'
                          : 'Pause automatic manifest rotation'
                        : `Show manifest highlight ${index + 1} and pause automatic rotation`
                    }
                    title={
                      index === activeManifestSlide
                        ? isManifestCarouselManuallyPaused
                          ? 'Resume automatic rotation'
                          : 'Pause automatic rotation'
                        : `Show manifest highlight ${index + 1}`
                    }
                    aria-controls={`${manifestCarouselId}-carousel`}
                    aria-current={
                      index === activeManifestSlide ? 'true' : undefined
                    }
                    aria-pressed={
                      index === activeManifestSlide
                        ? isManifestCarouselManuallyPaused
                        : undefined
                    }
                    onClick={() => handleManifestPaginationClick(index)}
                  />
                ))}
              </div>
            </div>
          </section>

          <img
            className="home-pexels home-pexels--desktop"
            src={
              theme === 'dark'
                ? activeHomeTheme.darkDesktopPexelsSrc
                : activeHomeTheme.pexelsSrc
            }
            alt="A Tactile selection interaction showing a cursor, handles, and dimension controls"
          />
          <img
            className="home-pexels home-pexels--mobile"
            src={
              theme === 'dark' && isMobileViewport
                ? activeHomeTheme.darkMobilePexelsSrc
                : activeHomeTheme.mobilePexelsSrc
            }
            alt="A Tactile selection interaction showing a cursor, handles, and dimension controls"
          />
        </div>

        <footer className="home-footer">
          <p>©Tactile Labs. 2026. All rights reserved.</p>
          <Link className="home-button home-button--secondary" to="/manifesto">
            Read our manifest
          </Link>
        </footer>
      </main>

      <WaitlistModal
        open={isWaitlistModalOpen}
        onOpenChange={setIsWaitlistModalOpen}
        returnFocusRef={waitlistReturnFocusRef}
        theme={theme}
      />
    </>
  );
}
