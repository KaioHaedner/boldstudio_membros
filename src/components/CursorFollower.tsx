import { useEffect, useRef, useState } from 'react'

const HOVER_SELECTOR =
  'a, button, input, textarea, select, [role="button"], [data-cursor-hover], label, summary'

export function CursorFollower() {
  const innerRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setEnabled(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!enabled) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let ix = mx
    let iy = my
    let ox = mx
    let oy = my
    let lastT = performance.now()
    let vx = 0
    let vy = 0
    let hover = false
    let pressed = false
    let raf = 0

    const handleMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    const handleOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      hover = !!(t && t.closest(HOVER_SELECTOR))
    }
    const handleDown = () => {
      pressed = true
    }
    const handleUp = () => {
      pressed = false
    }
    const handleLeave = () => {
      if (innerRef.current) innerRef.current.style.opacity = '0'
      if (outerRef.current) outerRef.current.style.opacity = '0'
    }
    const handleEnter = () => {
      if (innerRef.current) innerRef.current.style.opacity = '1'
      if (outerRef.current) outerRef.current.style.opacity = hover ? '0.9' : '0.55'
    }

    const tick = () => {
      const now = performance.now()
      const dt = Math.max(1, now - lastT)
      lastT = now

      const prevOx = ox
      const prevOy = oy

      // inner: rapido (cola no mouse)
      ix += (mx - ix) * 0.45
      iy += (my - iy) * 0.45

      // outer: suave (efeito follow 3D)
      ox += (mx - ox) * 0.16
      oy += (my - oy) * 0.16

      // velocidade pra rotacao 3D do outer
      vx = (ox - prevOx) / dt
      vy = (oy - prevOy) / dt
      const tiltX = Math.max(-18, Math.min(18, -vy * 80))
      const tiltY = Math.max(-18, Math.min(18, vx * 80))

      if (innerRef.current) {
        const scale = pressed ? 0.7 : 1
        innerRef.current.style.transform =
          `translate3d(${ix - 4}px, ${iy - 4}px, 0) scale(${scale})`
      }
      if (outerRef.current) {
        const scale = pressed ? 0.85 : hover ? 1.6 : 1
        outerRef.current.style.transform =
          `translate3d(${ox - 22}px, ${oy - 22}px, 0) perspective(200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`
        outerRef.current.style.opacity = hover ? '0.9' : '0.55'
        outerRef.current.style.borderWidth = hover ? '2px' : '1.5px'
      }

      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mouseover', handleOver, { passive: true })
    window.addEventListener('mousedown', handleDown, { passive: true })
    window.addEventListener('mouseup', handleUp, { passive: true })
    document.body.addEventListener('mouseleave', handleLeave)
    document.body.addEventListener('mouseenter', handleEnter)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', handleOver)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
      document.body.removeEventListener('mouseleave', handleLeave)
      document.body.removeEventListener('mouseenter', handleEnter)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div
        ref={outerRef}
        aria-hidden
        className="fixed top-0 left-0 w-11 h-11 rounded-full border-bold-yellow pointer-events-none z-[9998] will-change-transform transition-[opacity,border-width] duration-200"
        style={{
          borderStyle: 'solid',
          borderWidth: '1.5px',
          boxShadow:
            '0 0 24px rgba(255,215,18,0.45), 0 0 60px rgba(255,215,18,0.15), inset 0 0 10px rgba(255,215,18,0.18)',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      />
      <div
        ref={innerRef}
        aria-hidden
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-bold-yellow pointer-events-none z-[9999] will-change-transform"
        style={{
          mixBlendMode: 'difference',
          boxShadow: '0 0 8px rgba(255,215,18,0.9)',
        }}
      />
    </>
  )
}
