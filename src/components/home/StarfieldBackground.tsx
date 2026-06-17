import { useEffect, useRef } from 'react'

type Star = {
  x: number
  y: number
  radius: number
  depth: number
  baseOpacity: number
  twinkleSpeed: number
  twinklePhase: number
}

const LAYER_DEPTHS = [0.15, 0.4, 0.85]
const STARS_PER_LAYER = 150

function buildStars(width: number, height: number): Star[] {
  const stars: Star[] = []
  for (const depth of LAYER_DEPTHS) {
    for (let i = 0; i < STARS_PER_LAYER; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: depth * 2.2 + Math.random() * 1,
        depth,
        baseOpacity: 0.45 + Math.random() * 0.55,
        twinkleSpeed: 0.5 + Math.random() * 1.5,
        twinklePhase: Math.random() * Math.PI * 2,
      })
    }
  }
  return stars
}

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = window.innerWidth
    let height = window.innerHeight
    let stars = buildStars(width, height)
    let targetOffsetX = 0
    let targetOffsetY = 0
    let offsetX = 0
    let offsetY = 0
    let rafId = 0

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = window.devicePixelRatio || 1
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.scale(dpr, dpr)
      stars = buildStars(width, height)
      // Com movimento reduzido nao ha loop: redesenha um frame estatico a cada resize.
      if (reduceMotion) drawStatic()
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, width, height)
      const nebula = ctx!.createRadialGradient(
        width * 0.5, height * 0.35, 0,
        width * 0.5, height * 0.35, Math.max(width, height) * 0.6
      )
      nebula.addColorStop(0, 'rgba(255, 215, 18, 0.11)')
      nebula.addColorStop(0.45, 'rgba(255, 215, 18, 0.04)')
      nebula.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx!.fillStyle = nebula
      ctx!.fillRect(0, 0, width, height)
      for (const star of stars) {
        ctx!.beginPath()
        ctx!.fillStyle = `rgba(255, 255, 255, ${star.baseOpacity})`
        ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function onMouseMove(e: MouseEvent) {
      targetOffsetX = (e.clientX / width - 0.5) * 2
      targetOffsetY = (e.clientY / height - 0.5) * 2
    }

    function draw(time: number) {
      offsetX += (targetOffsetX - offsetX) * 0.04
      offsetY += (targetOffsetY - offsetY) * 0.04

      ctx!.clearRect(0, 0, width, height)

      // Nebulosa principal (centro-alto) + segunda mancha pra dar profundidade.
      const nebula = ctx!.createRadialGradient(
        width * 0.5, height * 0.32, 0,
        width * 0.5, height * 0.32, Math.max(width, height) * 0.62
      )
      nebula.addColorStop(0, 'rgba(255, 215, 18, 0.11)')
      nebula.addColorStop(0.45, 'rgba(255, 215, 18, 0.04)')
      nebula.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx!.fillStyle = nebula
      ctx!.fillRect(0, 0, width, height)

      const nebula2 = ctx!.createRadialGradient(
        width * 0.78, height * 0.7, 0,
        width * 0.78, height * 0.7, Math.max(width, height) * 0.45
      )
      nebula2.addColorStop(0, 'rgba(255, 215, 18, 0.05)')
      nebula2.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx!.fillStyle = nebula2
      ctx!.fillRect(0, 0, width, height)

      for (const star of stars) {
        const parallaxX = offsetX * star.depth * -28
        const parallaxY = offsetY * star.depth * -28
        const twinkle = 0.6 + 0.4 * Math.sin(time * 0.001 * star.twinkleSpeed + star.twinklePhase)
        // Estrelas maiores (camada proxima) ganham um leve halo amarelado.
        ctx!.shadowBlur = star.radius > 2 ? 6 : 0
        ctx!.shadowColor = 'rgba(255, 215, 18, 0.6)'
        ctx!.beginPath()
        ctx!.fillStyle = `rgba(255, 255, 255, ${star.baseOpacity * twinkle})`
        ctx!.arc(star.x + parallaxX, star.y + parallaxY, star.radius, 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.shadowBlur = 0

      rafId = requestAnimationFrame(draw)
    }

    function onVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(rafId)
        rafId = 0
      } else if (!rafId) {
        rafId = requestAnimationFrame(draw)
      }
    }

    resize()
    window.addEventListener('resize', resize)

    if (reduceMotion) {
      // Sem animacao: um frame estatico, sem loop nem parallax do mouse.
      drawStatic()
    } else {
      window.addEventListener('mousemove', onMouseMove)
      document.addEventListener('visibilitychange', onVisibilityChange)
      rafId = requestAnimationFrame(draw)
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 bg-bold-black"
      aria-hidden="true"
    />
  )
}
