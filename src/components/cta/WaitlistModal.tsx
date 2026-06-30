import * as Dialog from '@radix-ui/react-dialog';
import type { CSSProperties } from 'react';
import tactileManifestLogo from '../../assets/tactile-manifest-logo.png';
import tactileManifestLogoDark from '../../assets/tactile-manifest-logo-dark.svg';
import posterBlue from '../../assets/poster-one.png';
import posterOrange from '../../assets/poster-two.png';
import posterYellow from '../../assets/poster-six.png';
import zigzagDarkImage from '../../assets/zigzag-dark.png';
import zigzagImage from '../../assets/zigzag.png';
import { WaitlistButton } from './WaitlistButton';

type WaitlistModalProps = {
  desktopOverlayContainer?: HTMLElement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: 'light' | 'dark';
};

const modalPosters = [
  {
    id: 'blue',
    imageSrc: posterBlue,
    className: 'waitlist-modal__poster waitlist-modal__poster--blue'
  },
  {
    id: 'orange',
    imageSrc: posterOrange,
    className: 'waitlist-modal__poster waitlist-modal__poster--orange'
  },
  {
    id: 'yellow',
    imageSrc: posterYellow,
    className: 'waitlist-modal__poster waitlist-modal__poster--yellow'
  }
] as const;

export function WaitlistModal({
  desktopOverlayContainer,
  open,
  onOpenChange,
  theme
}: WaitlistModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal container={desktopOverlayContainer ?? undefined}>
        <Dialog.Overlay className="waitlist-modal__overlay" />
      </Dialog.Portal>

      <Dialog.Portal>
        <Dialog.Content className="waitlist-modal__content">
          <div
            className="waitlist-modal__shell"
            style={
              {
                '--waitlist-modal-zigzag': `url(${
                  theme === 'dark' ? zigzagDarkImage : zigzagImage
                })`
              } as CSSProperties
            }
          >
            <div className="waitlist-modal__header">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="waitlist-modal__close"
                  aria-label="Close waitlist modal"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </Dialog.Close>

              <img
                className="waitlist-modal__brand"
                src={theme === 'dark' ? tactileManifestLogoDark : tactileManifestLogo}
                alt="Tactile Manifesto beta"
              />
            </div>

            <div className="waitlist-modal__posters" aria-hidden="true">
              {modalPosters.map((poster) => (
                <figure key={poster.id} className={poster.className}>
                  <img
                    className="waitlist-modal__poster-image"
                    src={poster.imageSrc}
                    alt=""
                  />
                  {/* <img
                    className="waitlist-modal__poster-zigzag"
                    src={zigzagImage}
                    alt=""
                  /> */}
                </figure>
              ))}
            </div>

            <div className="waitlist-modal__intro">
              <Dialog.Title className="waitlist-modal__title">
                Join our waitlist
              </Dialog.Title>
              <Dialog.Description className="waitlist-modal__description">
                Let&apos;s take you on this journey with us.
              </Dialog.Description>
            </div>

            <form
              className="waitlist-modal__form"
              onSubmit={(event) => event.preventDefault()}
            >
              <label className="waitlist-modal__field">
                <span className="sr-only">Full name</span>
                <input
                  className="waitlist-modal__input"
                  type="text"
                  name="name"
                  defaultValue="Maersk David"
                />
              </label>

              <label className="waitlist-modal__field waitlist-modal__field--valid">
                <span className="sr-only">Email address</span>
                <input
                  className="waitlist-modal__input"
                  type="email"
                  name="email"
                  defaultValue="groupwork@tactile.so"
                />
                <span
                  className="waitlist-modal__field-check"
                  aria-hidden="true"
                >
                  ✓
                </span>
              </label>

              <label className="waitlist-modal__checkbox-row">
                <input
                  className="waitlist-modal__checkbox"
                  type="checkbox"
                  defaultChecked
                />
                <span>Send me the welcome bundle</span>
              </label>

              <button
                type="button"
                className="waitlist-modal__cancel"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </button>

              <WaitlistButton
                variant="signature"
                className="waitlist-modal__submit"
              />
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
