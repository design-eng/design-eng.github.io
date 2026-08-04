import * as Dialog from '@radix-ui/react-dialog';
import { CheckIcon } from '@radix-ui/react-icons';
import {
  type CSSProperties,
  type FormEvent,
  type RefObject,
  useEffect,
  useState
} from 'react';

type WaitlistModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
  theme: 'light' | 'dark';
};

type SubmitState = 'idle' | 'submitting' | 'success';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WaitlistModal({
  open,
  onOpenChange,
  returnFocusRef
}: WaitlistModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [welcomeBundle, setWelcomeBundle] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [popoverPosition, setPopoverPosition] = useState<CSSProperties>();

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const isNameValid = trimmedName.length > 1;
  const isEmailValid = emailPattern.test(trimmedEmail);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const trigger = returnFocusRef?.current;
      if (!trigger || window.innerWidth <= 640) {
        setPopoverPosition(undefined);
        return;
      }

      const bounds = trigger.getBoundingClientRect();
      const popoverWidth = Math.min(420, window.innerWidth - 28);
      const triggerCenter = bounds.left + bounds.width / 2;
      const popoverLeft = Math.min(
        window.innerWidth - 14 - popoverWidth,
        Math.max(14, bounds.left)
      );
      const popoverCenter = popoverLeft + popoverWidth / 2;
      const caretLeft = Math.min(
        popoverWidth - 18,
        Math.max(18, triggerCenter - (popoverCenter - popoverWidth / 2))
      );

      setPopoverPosition({
        '--waitlist-popover-left': `${popoverCenter}px`,
        '--waitlist-popover-top': `${bounds.bottom + 19}px`,
        '--waitlist-caret-left': `${caretLeft}px`
      } as CSSProperties);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, returnFocusRef]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (!isNameValid || !isEmailValid || submitState === 'submitting') return;

    setSubmitState('submitting');
    window.setTimeout(() => setSubmitState('success'), 650);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setHasSubmitted(false);
      setSubmitState('idle');
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="waitlist-modal__overlay" />
      </Dialog.Portal>

      <Dialog.Portal>
        <Dialog.Content
          className="waitlist-modal__content"
          style={popoverPosition}
          onCloseAutoFocus={(event) => {
            if (!returnFocusRef?.current) return;
            event.preventDefault();
            returnFocusRef.current.focus();
          }}
        >
          <div className="waitlist-modal__caret" aria-hidden="true" />
          <div className="waitlist-modal__shell">
            <div className="waitlist-modal__intro">
              <Dialog.Title className="waitlist-modal__title">
                {submitState === 'success' ? 'You’re on the list' : 'Join our waitlist'}
              </Dialog.Title>
              <Dialog.Description className="waitlist-modal__description">
                {submitState === 'success'
                  ? 'We’ll keep you posted on what comes next.'
                  : 'Let’s take you on this journey with us.'}
              </Dialog.Description>
            </div>

            {submitState === 'success' ? (
              <div className="waitlist-modal__success" role="status">
                <span className="waitlist-modal__success-icon" aria-hidden="true">
                  <CheckIcon />
                </span>
                <p>Thanks, {trimmedName}. Your place is saved.</p>
                <Dialog.Close className="waitlist-modal__done" type="button">
                  Done
                </Dialog.Close>
              </div>
            ) : (
              <form className="waitlist-modal__form" noValidate onSubmit={handleSubmit}>
                <label className="waitlist-modal__field">
                  <span className="sr-only">Full name</span>
                  <input
                    className="waitlist-modal__input"
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Full name"
                    value={name}
                    aria-invalid={hasSubmitted && !isNameValid}
                    onChange={(event) => setName(event.target.value)}
                  />
                </label>

                <label
                  className={`waitlist-modal__field${
                    isEmailValid ? ' waitlist-modal__field--valid' : ''
                  }`}
                >
                  <span className="sr-only">Email address</span>
                  <input
                    className="waitlist-modal__input"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Email address"
                    value={email}
                    aria-invalid={hasSubmitted && !isEmailValid}
                    aria-describedby={
                      hasSubmitted && (!isNameValid || !isEmailValid)
                        ? 'waitlist-form-error'
                        : undefined
                    }
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  {isEmailValid ? (
                    <span className="waitlist-modal__field-check" aria-hidden="true">
                      <CheckIcon />
                    </span>
                  ) : null}
                </label>

                <label className="waitlist-modal__checkbox-row">
                  <input
                    className="waitlist-modal__checkbox"
                    type="checkbox"
                    checked={welcomeBundle}
                    onChange={(event) => setWelcomeBundle(event.target.checked)}
                  />
                  <span>Send me the welcome bundle</span>
                </label>

                <p
                  id="waitlist-form-error"
                  className="waitlist-modal__error"
                  aria-live="polite"
                >
                  {hasSubmitted && (!isNameValid || !isEmailValid)
                    ? 'Enter your full name and a valid email address.'
                    : ''}
                </p>

                <button
                  type="submit"
                  className="waitlist-modal__submit"
                  disabled={submitState === 'submitting'}
                >
                  {submitState === 'submitting' ? 'Joining…' : 'Join the waitlist'}
                </button>
              </form>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
