import {
  type FocusEvent,
  type KeyboardEvent,
  useEffect,
  useId,
  useState
} from 'react';
import { Link } from 'react-router-dom';
import tactileLogo from '../../assets/tactile-logo.png';
import tactilePexels from '../../assets/tactile-pexels.png';
import { WaitlistModal } from '../../components/cta/WaitlistModal';
import { HomeDemo } from '../../components/home/HomeDemo';

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

export function HomePage() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [activeManifestSlide, setActiveManifestSlide] = useState(1);
  const [
    isManifestCarouselManuallyPaused,
    setIsManifestCarouselManuallyPaused
  ] = useState(false);
  const [isManifestCarouselInteracting, setIsManifestCarouselInteracting] =
    useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const manifestCarouselId = useId();
  const discordInviteUrl =
    import.meta.env.VITE_DISCORD_INVITE_URL ?? 'https://discord.com/';
  const isManifestCarouselPaused =
    isManifestCarouselManuallyPaused || isManifestCarouselInteracting;

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
        (currentSlide) =>
          (currentSlide + 1) % manifestPreviewSlides.length
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
      <main className="home-page">
        <header className="home-header">
          <div className="home-header__identity">
            <Link className="home-brand" to="/" aria-label="Tactile HCI home">
              <img className="home-brand__mark" src={tactileLogo} alt="" />
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
            <Link className="home-button home-button--secondary" to="/manifesto">
              Read our manifest
            </Link>
            <button
              type="button"
              className="home-button home-button--primary"
              onClick={() => setIsWaitlistModalOpen(true)}
            >
              Join the waitlist
            </button>
          </nav>
        </header>

        <div className="home-layout">
          <section className="home-left" aria-labelledby="home-title">
            <div className="home-hero-copy">
              <h1 id="home-title">
                The true experience design software: precision for an era of
                guesswork. All in code, of course
              </h1>

              <div className="home-hero-copy__actions">
                <button
                  type="button"
                  className="home-button home-button--primary"
                  onClick={() => setIsWaitlistModalOpen(true)}
                >
                  Join the waitlist
                </button>
                <Link
                  className="home-button home-button--secondary"
                  to="/manifesto"
                >
                  Read our manifest
                </Link>
              </div>
            </div>

            <div className="home-manifest-preview">
              <div className="home-manifest-preview__label">
                <p>Tactile Manifest</p>
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
                  {manifestPreviewSlides[activeManifestSlide].map(
                    (paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    )
                  )}
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
            </div>

            <img
              className="home-pexels"
              src={tactilePexels}
              alt="A Tactile selection interaction showing a cursor, handles, and dimension controls"
            />
          </section>

          <div className="home-demo-region">
            <HomeDemo />
          </div>
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
        theme="light"
      />
    </>
  );
}
