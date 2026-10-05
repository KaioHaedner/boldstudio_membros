import { useEffect, useRef } from 'react'
import backgrounds from '@/apps/site/data/backgrounds.json'
import { media } from '@/shared/lib/media'

// Independent scroll-linked implementation inspired by the supplied
// Império WEB Codes Store demo. No wheel/touch interception or full-page lock.
const DEFAULT_PHOTOS = [0, 2, 1]
export function SolucoesParallax({ indices = DEFAULT_PHOTOS, className = '', layout = 'solutions' }: { indices?: number[]; className?: string; layout?: 'solutions' | 'right' }) {
  const layer = useRef<HTMLDivElement>(null)
  const photoKey = indices.join(',')

  useEffect(() => {
    const element = layer.current
    const section = element?.closest('section')
    if (!element || !section) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const photos = Array.from(element.querySelectorAll<HTMLElement>('[data-depth]'))
    let frame = 0
    let visible = false
    let current: number | null = null
    let lastTime = 0
    const render = (time: number) => {
      frame = 0
      if (!visible || document.hidden) return
      const rect = section.getBoundingClientRect()
      const progress = Math.max(-1, Math.min(1,
        (window.innerHeight / 2 - rect.top - rect.height / 2) / ((window.innerHeight + rect.height) / 2)))
      // Time-based easing avoids stepping at wheel-event frequency. Stop RAF
      // after settling; no permanent render loop while the page is idle.
      const dt = Math.min(64, Math.max(1, time - (lastTime || time - 16)))
      lastTime = time
      current = current === null || reducedMotion.matches ? progress : current + (progress - current) * (1 - Math.exp(-dt / 85))
      const distance = window.innerWidth < 640 ? 38 : 100
      for (const photo of photos) {
        const offset = reducedMotion.matches ? 0 : current * distance * Number(photo.dataset.depth)
        photo.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`
      }
      if (!reducedMotion.matches && Math.abs(progress - current) > .0005) frame = requestAnimationFrame(render)
    }
    const schedule = () => {
      if (visible && !document.hidden && !frame) frame = requestAnimationFrame(render)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      photos.forEach(photo => { photo.style.willChange = visible && !reducedMotion.matches ? 'transform' : 'auto' })
      if (!visible) { cancelAnimationFrame(frame); frame = 0; current = null; lastTime = 0 }
      schedule()
    }, { rootMargin: '120px' })
    observer.observe(section)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    document.addEventListener('visibilitychange', schedule)
    reducedMotion.addEventListener('change', schedule)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('visibilitychange', schedule)
      reducedMotion.removeEventListener('change', schedule)
    }
  }, [photoKey])

  return <div ref={layer} className={`solucoes-parallax ${className}`} aria-hidden="true">
    {indices.map((photoIndex, index) => <div
      key={backgrounds[photoIndex]}
      className={`solucoes-parallax__photo solucoes-parallax__photo--${layout === 'right' || index === 2 ? 'right' : 'left'} solucoes-parallax__photo--${layout === 'right' || index === 2 ? 'center' : index === 0 ? 'upper' : 'lower'}`}
      data-depth={[1, .55, -.65][index]}
    >
      <img src={import.meta.env.DEV ? `/media/backgrounds/${backgrounds[photoIndex]}` : media('brand', `backgrounds-20261005/${backgrounds[photoIndex]}`)}
        alt="" loading="lazy" decoding="async" draggable={false} />
    </div>)}
  </div>
}
