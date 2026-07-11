import type { ButtonHTMLAttributes } from 'react';
import posterOrange from '../../assets/poster-two.png';
import posterYellow from '../../assets/poster-six.png';
import posterGreen from '../../assets/poster-seven.png';

type WaitlistButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'topbar' | 'signature';
};

export function WaitlistButton({
  variant = 'signature',
  className,
  ...buttonProps
}: WaitlistButtonProps) {
  const isTopbar = variant === 'topbar';

  return (
    <button
      type={buttonProps.type ?? 'button'}
      className={`waitlist-button waitlist-button--${variant}${
        className ? ` ${className}` : ''
      }`}
      {...buttonProps}
    >
      <span className="waitlist-button__label">
        {isTopbar ? 'Join' : 'Join waitlist'}
      </span>
      {!isTopbar ? (
        <span className="waitlist-button__poster-stack" aria-hidden="true">
          <img
            className="waitlist-button__poster waitlist-button__poster--orange"
            src={posterOrange}
            alt=""
          />
          <img
            className="waitlist-button__poster waitlist-button__poster--yellow"
            src={posterYellow}
            alt=""
          />
          <img
            className="waitlist-button__poster waitlist-button__poster--green"
            src={posterGreen}
            alt=""
          />
        </span>
      ) : null}
    </button>
  );
}
