import { gsap } from 'gsap'

export function createLandingTimeline(root: HTMLElement) {
  return gsap
    .timeline({ defaults: { ease: 'power2.out', duration: 0.8 } })
    .from(root.querySelector('.top-bar'), { y: -24, opacity: 0 })
    .from(root.querySelector('.hero-copy-column'), { y: 32, opacity: 0 }, '-=0.45')
    .from(root.querySelector('.hero-art-column'), { x: 42, opacity: 0 }, '-=0.55')
}
