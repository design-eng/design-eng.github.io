import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import browserTile from '../../assets/browser-tile.png';
import phoneTile from '../../assets/phone-tile.png';
import watchTile from '../../assets/watch-tile.png';

type AnimatedExperienceTokenProps = {
  variant?: 'desktop' | 'mobile';
};

export function AnimatedExperienceToken({
  variant = 'desktop'
}: AnimatedExperienceTokenProps) {
  const tileSize = variant === 'mobile' ? 36 : 46;
  const tileGap = variant === 'mobile' ? 8 : 10;
  const finalWidth = tileSize * 3 + tileGap * 2;
  const finalMarginLeft = variant === 'mobile' ? 7 : 15;
  const finalMarginRight = variant === 'mobile' ? 8 : 18;
  const tilePillHeight = variant === 'mobile' ? 12 : 15;
  const tilePillTop = (tileSize - tilePillHeight) / 2;
  const tokenRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const phoneRef = useRef<HTMLSpanElement>(null);
  const browserRef = useRef<HTMLSpanElement>(null);
  const watchRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const token = tokenRef.current;
    const word = wordRef.current;
    const phone = phoneRef.current;
    const browser = browserRef.current;
    const watch = watchRef.current;

    if (!token || !word || !phone || !browser || !watch) {
      return;
    }

    const context = gsap.context(() => {
      const initialWidth = Math.ceil(word.getBoundingClientRect().width);
      const tileElements = [phone, browser, watch];
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      gsap.set(token, { marginLeft: 0, marginRight: 0, width: initialWidth });

      if (reducedMotion) {
        gsap.set(token, {
          marginLeft: finalMarginLeft,
          marginRight: finalMarginRight,
          width: finalWidth
        });
        gsap.set(word, { autoAlpha: 0, clipPath: 'inset(0 100% 0 0)' });
        gsap.set(tileElements, {
          borderRadius: 10,
          height: tileSize,
          top: 0,
          visibility: 'visible'
        });
        return;
      }

      gsap.set(tileElements, {
        borderRadius: tileSize / 2,
        height: tilePillHeight,
        top: tilePillTop,
        visibility: 'hidden'
      });

      const timeline = gsap.timeline({
        delay: 1.1,
        repeat: -1,
        repeatDelay: 1.6
      });

      timeline
        .to(
          word,
          {
            autoAlpha: 0,
            clipPath: 'inset(0 100% 0 0)',
            duration: 0.58,
            ease: 'power2.inOut'
          },
          0
        )
        .to(
          token,
          {
            marginLeft: finalMarginLeft,
            marginRight: finalMarginRight,
            width: finalWidth,
            duration: 1.05,
            ease: 'power3.inOut'
          },
          0.16
        )
        .set(watch, { visibility: 'visible' }, 0.42)
        .to(
          watch,
          {
            borderRadius: 10,
            height: tileSize,
            top: 0,
            duration: 0.68,
            ease: 'power3.out'
          },
          0.42
        )
        .set(browser, { visibility: 'visible' }, 0.54)
        .to(
          browser,
          {
            borderRadius: 10,
            height: tileSize,
            top: 0,
            duration: 0.72,
            ease: 'power3.out'
          },
          0.54
        )
        .set(phone, { visibility: 'visible' }, 0.66)
        .to(
          phone,
          {
            borderRadius: 10,
            height: tileSize,
            top: 0,
            duration: 0.76,
            ease: 'power3.out'
          },
          0.82
        )
        .to(
          phone,
          {
            borderRadius: tileSize / 2,
            height: tilePillHeight,
            top: tilePillTop,
            duration: 0.62,
            ease: 'power3.inOut'
          },
          4.05
        )
        .to(
          browser,
          {
            borderRadius: tileSize / 2,
            height: tilePillHeight,
            top: tilePillTop,
            duration: 0.62,
            ease: 'power3.inOut'
          },
          4.25
        )
        .to(
          watch,
          {
            borderRadius: tileSize / 2,
            height: tilePillHeight,
            top: tilePillTop,
            duration: 0.62,
            ease: 'power3.inOut'
          },
          4.45
        )
        .to(
          token,
          {
            marginLeft: 0,
            marginRight: 0,
            width: initialWidth,
            duration: 1.05,
            ease: 'power3.inOut'
          },
          4.08
        )
        .to(
          word,
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.62,
            ease: 'power2.inOut'
          },
          5.07
        )
        .set(word, { autoAlpha: 1 }, 5.07)
        .set(tileElements, { visibility: 'hidden' }, 5.07);
    }, token);

    return () => context.revert();
  }, [finalMarginLeft, finalMarginRight, finalWidth, tilePillHeight, tilePillTop, tileSize]);

  return (
    <span
      ref={tokenRef}
      className={`experience-token experience-token--${variant}`}
    >
      <span ref={wordRef} className="experience-token__word">
        experience
      </span>
      <span className="experience-token__tiles" aria-hidden="true">
        <span
          ref={phoneRef}
          className="experience-token__tile experience-token__tile--phone"
        >
          <img src={phoneTile} alt="" />
        </span>
        <span
          ref={browserRef}
          className="experience-token__tile experience-token__tile--browser"
        >
          <img src={browserTile} alt="" />
        </span>
        <span
          ref={watchRef}
          className="experience-token__tile experience-token__tile--watch"
        >
          <img src={watchTile} alt="" />
        </span>
      </span>
    </span>
  );
}
