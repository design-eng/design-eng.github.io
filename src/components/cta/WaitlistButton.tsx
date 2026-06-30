import type { ButtonHTMLAttributes } from 'react';
import waitlistImage from '../../assets/waitlist-image.png';

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
        <img
          className="waitlist-button__image"
          src={waitlistImage}
          alt=""
          aria-hidden="true"
        />
      ) : null}
    </button>
  );
}
