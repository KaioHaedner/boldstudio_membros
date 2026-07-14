import { lazy, Suspense, useEffect, useRef } from 'react'

const BoldShaderGradientScene = lazy(() => import('./BoldShaderGradientScene'))

export function StarfieldBackground() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = layerRef.current
    if (!layer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let targetX = 0
    let targetY = 0
    let targetScroll = 0
    let currentX = 0
    let currentY = 0
    let currentScroll = 0
    let rafId = 0

    const render = () => {
      currentX += (targetX - currentX) * 0.075
      currentY += (targetY - currentY) * 0.075
      currentScroll += (targetScroll - currentScroll) * 0.06
      layer.style.transform = `translate3d(${currentX * -24}px, ${currentY * -18 + currentScroll}px, 0) scale(1.08)`

      const moving =
        Math.abs(targetX - currentX) > 0.001 ||
        Math.abs(targetY - currentY) > 0.001 ||
        Math.abs(targetScroll - currentScroll) > 0.01
      rafId = moving ? requestAnimationFrame(render) : 0
    }

    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(render)
    }

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth - 0.5
      targetY = event.clientY / window.innerHeight - 0.5
      schedule()
    }

    const onScroll = () => {
      targetScroll = Math.sin(window.scrollY * 0.0012) * 18
      schedule()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bold-black"
      style={{ background: 'linear-gradient(145deg, #000000 0%, #212121 52%, #000000 100%)' }}
      aria-hidden="true"
    >
      <div
        ref={layerRef}
        className="absolute -inset-[5%] will-change-transform"
        style={{ transform: 'scale(1.08)' }}
      >
        <Suspense fallback={null}>
          <BoldShaderGradientScene />
        </Suspense>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_44%,rgba(0,0,0,0.22)_100%)]" />
    </div>
  )
}
