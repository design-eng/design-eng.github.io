import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'

const REST_ROTATIONS = [-6, 0, 4, 8, 2]
const SPREAD_ROTATIONS = [-4, -1, 3, 6, 1]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getRestX(index: number) {
  return index * 12
}

function getSpreadX(index: number) {
  return index * 14
}

function getRestRotation(index: number) {
  return REST_ROTATIONS[index] ?? (-6 + index * 2)
}

function getSpreadRotation(index: number) {
  return SPREAD_ROTATIONS[index] ?? (-4 + index * 2)
}

export function useLandingStackMotion(
  ref: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const stack = Array.from(
      node.querySelectorAll<HTMLElement>('.poster-card'),
    )

    if (!stack.length) {
      return
    }

    let isHovered = false
    let dragState:
      | {
          card: HTMLElement
          index: number
          pointerId: number
          startX: number
          startY: number
          baseX: number
          baseY: number
          baseRotate: number
        }
      | null = null

    const animateToSpread = () => {
      gsap.to(stack, {
        rotate: (index) => getSpreadRotation(index),
        y: (index) => index * 4,
        x: (index) => getSpreadX(index),
        rotateX: 0,
        rotateY: 0,
        duration: 0.45,
        stagger: 0.03,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const animateToRest = () => {
      gsap.to(stack, {
        rotate: (index) => getRestRotation(index),
        y: 0,
        x: (index) => getRestX(index),
        rotateX: 0,
        rotateY: 0,
        duration: 0.55,
        stagger: 0.02,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    const enter = () => {
      isHovered = true

      if (dragState) {
        return
      }

      animateToSpread()
    }

    const leave = () => {
      isHovered = false

      if (dragState) {
        return
      }

      animateToRest()
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return
      }

      const card = event.currentTarget as HTMLElement
      const index = stack.indexOf(card)

      if (index === -1) {
        return
      }

      dragState = {
        card,
        index,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        baseX: Number(gsap.getProperty(card, 'x')) || getSpreadX(index),
        baseY: Number(gsap.getProperty(card, 'y')) || index * 4,
        baseRotate:
          Number(gsap.getProperty(card, 'rotate')) || getSpreadRotation(index),
      }

      gsap.killTweensOf(card)
      card.classList.add('is-dragging')
      card.style.zIndex = '40'
      card.setPointerCapture(event.pointerId)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragState || event.pointerId !== dragState.pointerId) {
        return
      }

      const dx = event.clientX - dragState.startX
      const dy = event.clientY - dragState.startY
      const lift = clamp(-dy, 0, 240)
      const progress = lift / 240
      const drift = clamp(dx, -90, 90)
      const flipOpacity = clamp(progress * 1.18, 0, 1)
      const flipShiftX = `${-24 + drift * 0.16}px`
      const flipShiftY = `${18 - progress * 68}px`
      const flipRotate = `${-8 - progress * 16 + drift * 0.03}deg`
      const flipSkew = `${-4 - progress * 14}deg`
      const flipScale = 0.98 + progress * 0.08

      gsap.set(dragState.card, {
        x: dragState.baseX - progress * 2 + drift * 0.01,
        y: dragState.baseY - progress * 1.5,
        z: 0,
        rotate: dragState.baseRotate - progress * 1.8 + drift * 0.006,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        '--flip-progress': progress,
        '--flip-opacity': flipOpacity,
        '--flip-shift-x': flipShiftX,
        '--flip-shift-y': flipShiftY,
        '--flip-rotate': flipRotate,
        '--flip-skew': flipSkew,
        '--flip-scale': flipScale,
        transformOrigin: '12% 10%',
        overwrite: 'auto',
      })
    }

    const finishDrag = (event: PointerEvent) => {
      if (!dragState || event.pointerId !== dragState.pointerId) {
        return
      }

      const { card, index, pointerId } = dragState

      if (card.hasPointerCapture(pointerId)) {
        card.releasePointerCapture(pointerId)
      }

      card.classList.remove('is-dragging')

      gsap.to(card, {
        x: isHovered ? getSpreadX(index) : getRestX(index),
        y: isHovered ? index * 4 : 0,
        z: 0,
        rotate: isHovered ? getSpreadRotation(index) : getRestRotation(index),
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        '--flip-progress': 0,
        '--flip-opacity': 0,
        '--flip-shift-x': '0px',
        '--flip-shift-y': '0px',
        '--flip-rotate': '-8deg',
        '--flip-skew': '0deg',
        '--flip-scale': 0.98,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: 'auto',
        onComplete: () => {
          card.style.zIndex = `${index + 1}`
          gsap.set(card, { transformOrigin: '50% 50%' })
        },
      })

      dragState = null
    }

    node.addEventListener('pointerenter', enter)
    node.addEventListener('pointerleave', leave)
    stack.forEach((card) => {
      card.addEventListener('pointerdown', handlePointerDown)
      card.addEventListener('pointermove', handlePointerMove)
      card.addEventListener('pointerup', finishDrag)
      card.addEventListener('pointercancel', finishDrag)
    })

    return () => {
      node.removeEventListener('pointerenter', enter)
      node.removeEventListener('pointerleave', leave)
      stack.forEach((card) => {
        card.removeEventListener('pointerdown', handlePointerDown)
        card.removeEventListener('pointermove', handlePointerMove)
        card.removeEventListener('pointerup', finishDrag)
        card.removeEventListener('pointercancel', finishDrag)
      })
    }
  }, [ref])
}
