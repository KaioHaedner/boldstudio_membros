import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useI18n } from '@/i18n/I18nContext'

const IMG_BASE =
  'https://erhtqgaxibncpondscna.supabase.co/storage/v1/object/public/PROCESSO/'

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

function Counters() {
  const { t } = useI18n()
  const gridRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const nums = Array.from(grid.querySelectorAll<HTMLElement>('[data-count]'))
    // Garante que começam zerados até a grade entrar na tela.
    nums.forEach((el) => (el.textContent = '0'))

    let started = false
    const run = () => {
      if (started) return
      started = true
      nums.forEach((el) => {
        const target = Number(el.dataset.count)
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
            <div className="processo-counter__value">
              {c.prefix}
              <span data-count={c.value}>0</span>
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
