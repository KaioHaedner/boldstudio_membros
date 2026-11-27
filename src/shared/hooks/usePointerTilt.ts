import { useEffect, useRef } from 'react'

/** Pointer-only tilt on a stable hit area; no captured gestures or idle loop. */
export function usePointerTilt() {
  const surface = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = surface.current
    if (!element) return
    const media = matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let frame = 0
    let x = 0
    let y = 0
    const reset = () => {
      cancelAnimationFrame(frame)
      frame = 0
      element.style.setProperty('--photo-rotate-x', '0deg')
      element.style.setProperty('--photo-rotate-y', '0deg')
      delete element.dataset.tilting
    }
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== 'mouse') return
      x = event.clientX
      y = event.clientY
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const bounds = element.getBoundingClientRect()
        const nx = Math.max(-1, Math.min(1, (x - bounds.left) / bounds.width * 2 - 1))
        const ny = Math.max(-1, Math.min(1, (y - bounds.top) / bounds.height * 2 - 1))
        element.style.setProperty('--photo-rotate-x', `${-ny * 6}deg`)
        element.style.setProperty('--photo-rotate-y', `${nx * 6}deg`)
        element.dataset.tilting = 'true'
      })
    }
    const visibility = () => { if (document.hidden) reset() }
    element.addEventListener('pointermove', move, { passive: true })
    element.addEventListener('pointerleave', reset)
    element.addEventListener('pointercancel', reset)
    media.addEventListener('change', reset)
    window.addEventListener('blur', reset)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      reset()
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', reset)
      element.removeEventListener('pointercancel', reset)
      media.removeEventListener('change', reset)
      window.removeEventListener('blur', reset)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])
  return surface
}
