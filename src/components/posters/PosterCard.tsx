import type { CSSProperties } from 'react'

type PosterStackItem = {
  id: string
  label: string
  imageSrc: string
}

type PosterCardProps = {
  item: PosterStackItem
  depth: number
  offsetX: number
  offsetY: number
  rotation: number
}

export function PosterCard({
  item,
  depth,
  offsetX,
  offsetY,
  rotation,
}: PosterCardProps) {
  return (
    <article
      className="poster-card"
      style={
        {
          ['--poster-depth' as const]: depth,
          ['--poster-offset-x' as const]: `${offsetX}px`,
          ['--poster-offset-y' as const]: `${offsetY}px`,
          ['--poster-rotation' as const]: `${rotation}deg`,
          zIndex: 20 - depth,
        } as CSSProperties
      }
      aria-label={`${item.label} poster`}
    >
      <div className="poster-card__sheet" aria-hidden="true">
        <img
          className="poster-card__image"
          src={item.imageSrc}
          alt=""
          draggable={false}
          aria-hidden="true"
        />
      </div>
    </article>
  )
}
