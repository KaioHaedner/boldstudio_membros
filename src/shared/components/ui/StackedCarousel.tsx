import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { bindCardSwipe } from '@/apps/site/hooks/card-swipe'
import { slideAppearance, slideIndex, slideOffset, swipeTarget } from '@/shared/lib/stacked-carousel'

type Slide = { id: string; label: string }
type Labels = { carousel: string; previous: string; next: string; position: (index: number, total: number) => string }
type Props<T extends Slide> = { slides: readonly T[]; renderSlide: (slide: T, index: number) => ReactNode; labels: Labels }

function StackedCard({ index, total, progress, active, label, children }: {
  index: number; total: number; progress: MotionValue<number>; active: boolean; label: string; children: ReactNode
}) {
  const offset = useTransform(progress, value => slideOffset(index, value, total))
  const transform = useTransform(offset, value => {
    const { scale } = slideAppearance(value)
    // All card centers stay on one horizontal line: no fan, arc, tilt or 3D.
    return `translate(-50%, -50%) translateX(calc(${value} * var(--crew-peek))) scale(${scale})`
  })
  const opacity = useTransform(offset, value => slideAppearance(value).opacity)
  const zIndex = useTransform(offset, value => slideAppearance(value).zIndex)

  return <motion.article
    className="crew-card stacked-carousel__card"
    role="group" aria-roledescription="slide" aria-label={label}
    aria-hidden={!active} data-active={active}
    style={{ transform, opacity, zIndex }}
  >{children}</motion.article>
}

/** Adapted from the supplied stacked carousel, using the project's Motion package.
 * A stable pointer surface keeps native vertical scrolling and pinch zoom intact.
 * Progress updates outside React; only a completed selection updates React state.
 */
export function StackedCarousel<T extends Slide>({ slides, renderSlide, labels }: Props<T>) {
  const stage = useRef<HTMLDivElement>(null)
  const progress = useMotionValue(0)
  const reducedMotion = useReducedMotion()
  const animation = useRef<ReturnType<typeof animate> | null>(null)
  const selected = useRef(0)
  const [active, setActive] = useState(0)
  const total = slides.length

  const settle = useCallback((target: number, immediate = false) => {
    animation.current?.stop()
    selected.current = Math.round(target)
    setActive(slideIndex(target, total))
    if (reducedMotion || immediate) progress.set(Math.round(target))
    else animation.current = animate(progress, Math.round(target), {
      type: 'spring', stiffness: 240, damping: 32, mass: 0.85,
      restDelta: 0.001, restSpeed: 0.01,
    })
  }, [progress, reducedMotion, total])

  const step = useCallback((direction: number) => {
    if (total > 1) settle(selected.current + direction)
  }, [settle, total])

  useEffect(() => {
    const element = stage.current
    if (!element || total < 2) return
    let start = 0
    let distance = 0
    const width = () => element.querySelector<HTMLElement>('.crew-card')?.offsetWidth || element.clientWidth
    const unbind = bindCardSwipe(element, {
      begin: () => {
        animation.current?.stop()
        // A new gesture owns the last committed card, even during a spring.
        // Otherwise rapid swipes can round back to the previous selection.
        start = selected.current
        progress.set(start)
        distance = 0
      },
      width,
      move: value => {
        distance = value
        const fraction = Math.max(-1, Math.min(1, value / (width() * 0.55)))
        progress.set(start - fraction)
      },
      finish: advance => settle(swipeTarget(start, distance, advance)),
    })
    const finishOffscreen = () => settle(selected.current, true)
    const visibility = () => { if (document.hidden) finishOffscreen() }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) finishOffscreen()
    }, { threshold: 0 })
    observer.observe(element)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      unbind()
      observer.disconnect()
      document.removeEventListener('visibilitychange', visibility)
      animation.current?.stop()
    }
  }, [progress, settle, total])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      step(event.key === 'ArrowRight' ? 1 : -1)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      settle(event.key === 'Home' ? 0 : total - 1)
    }
  }

  if (!total) return null
  return <div className="crew-carousel" role="region" aria-roledescription="carrossel" aria-label={labels.carousel}>
    <div ref={stage} className="crew-swap-stage stacked-carousel__stage" tabIndex={0} aria-label={labels.carousel} onKeyDown={onKeyDown}>
      {slides.map((slide, index) => <StackedCard
        key={slide.id} index={index} total={total} progress={progress}
        active={active === index} label={`${labels.position(index + 1, total)} — ${slide.label}`}
      >{renderSlide(slide, index)}</StackedCard>)}
    </div>
    <div className="crew-carousel__controls">
      <button type="button" onClick={() => step(-1)} disabled={total < 2} aria-label={labels.previous}><ChevronLeft size={20} aria-hidden="true" /></button>
      <span aria-hidden="true">{String(active + 1).padStart(2, '0')} <span>/ {String(total).padStart(2, '0')}</span></span>
      <button type="button" onClick={() => step(1)} disabled={total < 2} aria-label={labels.next}><ChevronRight size={20} aria-hidden="true" /></button>
    </div>
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{labels.position(active + 1, total)} — {slides[active].label}</p>
  </div>
}
