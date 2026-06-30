import type { ReactNode } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import heroHoverImage from '../../assets/hover-image.png';

type HeroCopyProps = {
  eyebrow: {
    left: string;
    right: string;
  };
  paragraphs: ReactNode[];
  titleId?: string;
};

export function HeroTooltipTerm({ children }: { children: ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button type="button" className="manifesto-body__term">
            {children}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="manifesto-body__tooltip"
            side="bottom"
            align="center"
            sideOffset={14}
          >
            <span className="manifesto-body__tooltip-label">
              www.tactile.so
            </span>
            <span className="manifesto-body__tooltip-image-wrap">
              <img
                className="manifesto-body__tooltip-image"
                src={heroHoverImage}
                alt="Typographic print preview"
              />
            </span>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export function HeroCopy({
  eyebrow,
  paragraphs,
  titleId = 'manifesto-title'
}: HeroCopyProps) {
  return (
    <section className="hero-copy">
      <h1 id={titleId} className="hero-title">
        <span className="hero-title__accent">
          Quod maxime placeat facere possimus, omnis <br /> dolorum fuga
          expedita distinctio.
        </span>
      </h1>

      <p className="eyebrow-row">
        <span>{eyebrow.left}</span>
        <span>{eyebrow.right}</span>
      </p>

      <div className="manifesto-body">
        {paragraphs.map((paragraph, index) => (
          <div key={index} className="manifesto-body__row">
            <span className="manifesto-body__shortcut">
              {String(index + 1).padStart(3, '0')}
            </span>
            <p>{paragraph}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
