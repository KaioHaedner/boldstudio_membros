import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from '@/shared/lib/gsap'
import { ShinyButton } from '@/shared/components/ShinyButton'
import { useI18n } from '@/apps/site/i18n/I18nContext'
import { ProcessoJornada } from '@/apps/site/components/ProcessoJornada'
import { AURA_VERTEX_SHADER, AURA_FRAGMENT_SHADER } from '@/shared/lib/fluid-aura-shaders'
type Counter = { prefix?: string; value: number; suffix?: string; label: string }
const COUNTERS: Counter[] = [
  { prefix: '+', value: 120, label: 'Marcas atendidas' },
  { prefix: '+', value: 500, label: 'Projetos entregues' },
  { value: 19, label: 'Reconhecimentos' },
  { value: 95, suffix: '%', label: 'Clientes satisfeitos' },
]

function FluidAura({ phase }: { phase: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Four decorative WebGL contexts are unnecessary on mobile and can fail
    // under GPU/memory pressure. Keep a CSS glow; never tear down the page.
    canvas.style.background = 'radial-gradient(ellipse at 45% 55%, #6b570d 0%, #191402 45%, #020202 75%)'
    if (window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)').matches) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const geometry = new THREE.PlaneGeometry(2, 2)
    const uniforms = {
      u_time: { value: 0 },
      u_phase: { value: phase },
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_corFundo: { value: new THREE.Color('#020202') },
      u_corA: { value: new THREE.Color('#ffd712') },
      u_corB: { value: new THREE.Color('#fff3b0') },
    }
    const material = new THREE.ShaderMaterial({
      vertexShader: AURA_VERTEX_SHADER,
      fragmentShader: AURA_FRAGMENT_SHADER,
      uniforms,
    })
    scene.add(new THREE.Mesh(geometry, material))

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, rect.width)
      const height = Math.max(1, rect.height)
      renderer.setSize(width, height, false)
      uniforms.u_resolution.value.set(width, height)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    resize()

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const startTime = performance.now()
    let visible = false
    let raf = 0
    const render = () => {
      uniforms.u_time.value = reduceMotion ? 4 : (performance.now() - startTime) / 1000 * 0.72
      renderer.render(scene, camera)
      if (!reduceMotion && visible) raf = window.requestAnimationFrame(render)
    }
    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible
      visible = entry.isIntersecting
      if (visible && !wasVisible && !reduceMotion) render()
      if (!visible && raf) window.cancelAnimationFrame(raf)
    }, { threshold: 0.05 })
    observer.observe(canvas)

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      if (raf) window.cancelAnimationFrame(raf)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [phase])

  return <canvas ref={canvasRef} className="processo-counter__aura" aria-hidden="true" />
}

function Counters() {
  const { t } = useI18n()
  const gridRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const nums = Array.from(grid.querySelectorAll<HTMLElement>('[data-count]'))

    let started = false
    const run = () => {
      if (started) return
      started = true
      nums.forEach((el) => {
        const target = Number(el.dataset.count)
        // So zera quando a contagem realmente vai comecar. Se o observer for
        // interrompido, o HTML continua mostrando os valores finais corretos.
        el.textContent = '0'
        const obj = { v: 0 }
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toLocaleString('pt-BR')
          },
        })
      })
    }

    // IntersectionObserver é imune ao recálculo dos pins do ScrollTrigger.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          run()
        }
      },
      { threshold: 0.35 }
    )
    io.observe(grid)
    return () => io.disconnect()
  }, [])

  return (
    <div className="processo-counters" data-reveal>
      <div ref={gridRef} className="processo-counters__grid">
        {COUNTERS.map((c, i) => (
          <div key={i} className="processo-counter">
            <FluidAura phase={i * 2.35} />
            <div className="processo-counter__value">
              {c.prefix}
              <span data-count={c.value}>{c.value}</span>
              {c.suffix}
            </div>
            <p className="processo-counter__label">{t.processo.counters[i]}</p>
          </div>
        ))}
      </div>

      <p className="processo-counters__note">{t.processo.note}</p>
    </div>
  )
}

// A seção não usa mais pin de ScrollTrigger: as peças fixas viraram a jornada
// em SVG, que se anima sozinha ao entrar na tela. Sem o palco travado a seção
// ficou bem mais curta e saiu um pin da home, que nesse projeto já tem
// histórico de bug (ver comentários em src/lib/gsap.ts).
export function ProcessoTimeline() {
  const { t } = useI18n()

  return (
    <section id="processo" className="processo scroll-mt-24">
      <div className="processo__intro" data-reveal>
        <h2 className="processo__title">
          {t.processo.titleA}
          <br />
          {t.processo.titleB}{' '}
          <img className="processo__logo" src="/brand/logo-boldstudio.webp" alt="bold." />{' '}
          {t.processo.titleC}
        </h2>
      </div>

      {/* Jornada do cliente: caminho em S que se desenha acendendo etapa por
          etapa. Substituiu as três imagens da linha do tempo e as duas fotos
          de reunião, a pedido do cliente. */}
      <div className="processo__journey-scene">
        <div className="clientes-lateral processo__journey-photo processo__journey-photo--start" aria-hidden="true">
          <img src="/media/backgrounds/boldstudio_lateral_linha_do_tempo_01-d41a90324c5d.webp" alt="" width="500" height="333" loading="lazy" decoding="async" />
        </div>
        <div className="clientes-lateral processo__journey-photo processo__journey-photo--end" aria-hidden="true">
          <img src="/media/backgrounds/boldstudio_lateral_linha_do_tempo_02-d75bf77e37fc.webp" alt="" width="500" height="333" loading="lazy" decoding="async" />
        </div>
        <ProcessoJornada etapas={t.processo.etapas} />
      </div>

      <p className="processo__frase" data-reveal>
        {t.processo.frase}<span className="processo__frase-hi">{t.processo.fraseHi}</span>
      </p>

      <div className="processo__cta" data-reveal>
        <ShinyButton
          onClick={() =>
            document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        >
          {t.processo.ctaButton}
        </ShinyButton>
      </div>

      <Counters />
    </section>
  )
}
