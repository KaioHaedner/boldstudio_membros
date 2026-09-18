import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useI18n } from '@/i18n/I18nContext'

const IMG_BASE = 'https://api.boldstudiobrasil.com/api/media?b=PROCESSO&f='

// Peças de caminho (as imagens já trazem linha, pontos, ícones e rótulos).
const PARTS = [
  { path: `${IMG_BASE}timeline-part1.webp`, ratio: 1154 / 181 },
  { path: `${IMG_BASE}timeline-part2.webp`, ratio: 1154 / 179 },
  { path: `${IMG_BASE}timeline-part3.webp`, ratio: 1154 / 150 },
]

const REUNIOES = [
  { src: `${IMG_BASE}reuniao-1.webp`, alt: 'Equipe da Bold Studio em reunião' },
  { src: `${IMG_BASE}reuniao-2.webp`, alt: 'Equipe da Bold Studio em reunião de projeto' },
]

type Counter = { prefix?: string; value: number; suffix?: string; label: string }
const COUNTERS: Counter[] = [
  { prefix: '+', value: 120, label: 'Marcas atendidas' },
  { prefix: '+', value: 500, label: 'Projetos entregues' },
  { value: 19, label: 'Reconhecimentos' },
  { value: 95, suffix: '%', label: 'Clientes satisfeitos' },
]

// NAO chamar ScrollTrigger.refresh() no onLoad das imgs: no mobile elas chegam
// do Supabase ENQUANTO o usuario ja scrolla dentro do pin, e cada refresh no
// meio do scroll trava e reposiciona a pagina sozinha. O layout ja e reservado
// antes do load (aspect-ratio nas pecas, altura fixa nos frames), entao o load
// nao muda as medidas — o refresh do window 'load'/fonts.ready basta.

function TimelinePiece({ path, ratio }: { path: string; ratio: number }) {
  return (
    <img
      className="tl-piece__path"
      style={{ aspectRatio: String(ratio) }}
      src={path}
      alt=""
      aria-hidden="true"
      loading="eager"
      decoding="async"
    />
  )
}

// Foto com frame preto (dentro do pin; o movimento vem do sticky).
function Frame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="processo-frame">
      <img src={src} alt={alt} className="processo-frame__img" loading="eager" decoding="async" />
      <span className="processo-frame__overlay" aria-hidden="true" />
    </div>
  )
}

const AURA_VERTEX_SHADER = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const AURA_FRAGMENT_SHADER = `
  uniform float u_time;
  uniform float u_phase;
  uniform vec2 u_resolution;
  uniform vec3 u_corFundo;
  uniform vec3 u_corA;
  uniform vec3 u_corB;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= u_resolution.x / u_resolution.y;
    vec2 st = uv * 0.72;
    float t = u_time + u_phase;
    st += vec2(snoise(st + t * 0.05), snoise(st - t * 0.05)) * 0.3;
    float beam = smoothstep(0.08, 0.82, snoise(vec2(st.x + st.y * 1.5 - t * 0.15, t * 0.02)));
    vec3 glow = mix(u_corA, u_corB, snoise(uv * 1.5 + t * 0.1) * 0.5 + 0.5);
    gl_FragColor = vec4(u_corFundo + glow * beam * 0.72, 1.0);
  }
`

function FluidAura({ phase }: { phase: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false })
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
    const clock = new THREE.Clock()
    let visible = true
    let raf = 0
    const render = () => {
      uniforms.u_time.value = reduceMotion ? 4 : clock.getElapsedTime() * 0.72
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
    render()

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

export function ProcessoTimeline() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const stack = stackRef.current
    if (!section || !stage || !stack) return

    const items = Array.from(stack.children) as HTMLElement[]
    let overflow = 0

    const measure = () => {
      overflow = Math.max(0, stack.scrollHeight - stage.clientHeight)
    }
    measure()

    const apply = (progress: number) => {
      const y = -overflow * progress
      gsap.set(stack, { y })
      const stageH = stage.clientHeight
      // Cada peça "monta" (surge) conforme entra na tela travada.
      items.forEach((it) => {
        const top = it.offsetTop + y
        const p = gsap.utils.clamp(0, 1, (stageH * 0.92 - top) / (it.offsetHeight * 0.5 + 1))
        it.style.opacity = String(gsap.utils.interpolate(0.12, 1, p))
        it.style.transform = `translateY(${gsap.utils.interpolate(28, 0, p)}px)`
      })
    }

    const st = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: () => '+=' + Math.max(1, overflow),
      pin: stage,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: (self) => {
        measure()
        apply(self.progress)
      },
      onUpdate: (self) => apply(self.progress),
    })

    apply(0)
    const refresh = () => ScrollTrigger.refresh()
    const raf = requestAnimationFrame(refresh)
    window.addEventListener('load', refresh)
    if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {})

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('load', refresh)
      // kill(true) reverte o pin-spacer no unmount (ver comentario no CrewSticky).
      st.kill(true)
    }
  }, [])

  return (
    <section ref={sectionRef} id="processo" className="processo scroll-mt-24">
      <div className="processo__intro" data-reveal>
        <h2 className="processo__title">
          {t.processo.titleA}
          <br />
          {t.processo.titleB}{' '}
          <img className="processo__logo" src="/brand/logo-boldstudio.webp" alt="bold." />{' '}
          {t.processo.titleC}
        </h2>
      </div>

      {/* Palco travado (sticky) — as peças do quebra-cabeça montam dentro dele */}
      <div ref={stageRef} className="processo__stage">
        <div ref={stackRef} className="processo__stack">
          <TimelinePiece path={PARTS[0].path} ratio={PARTS[0].ratio} />
          <Frame src={REUNIOES[0].src} alt={t.processo.reuniaoAlt1} />
          <TimelinePiece path={PARTS[1].path} ratio={PARTS[1].ratio} />
          <Frame src={REUNIOES[1].src} alt={t.processo.reuniaoAlt2} />
          <TimelinePiece path={PARTS[2].path} ratio={PARTS[2].ratio} />
        </div>
      </div>

      <p className="processo__frase" data-reveal>
        {t.processo.frase}<span className="processo__frase-hi">{t.processo.fraseHi}</span>
      </p>

      <Counters />
    </section>
  )
}
