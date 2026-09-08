import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CLIENTES } from '@/data/clientes'
import { ShinyButton } from '@/components/ShinyButton'
import { useI18n } from '@/i18n/I18nContext'

// Só as marcas que têm vídeo demoreel entram no carrossel.
const CASES = CLIENTES.filter((c) => c.videos.length > 0)

const AUTO_ADVANCE_MS = 5000

// "Accordion Frames Spotlight": os cases viram lâminas verticais lado a lado; a
// lâmina em foco abre e mostra o vídeo, as outras ficam finas (o vídeo mantém a
// largura aberta, então a lâmina fina funciona como um recorte dele).
// Substitui o carrossel fullscreen pinado — o cliente não queria mais o scroll
// travado até acabarem os cases, então a seção fica no fluxo normal (60% da
// tela) e o foco anda sozinho de 5 em 5 segundos.
export function CasesCarrossel() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)
  const videosRef = useRef<(HTMLVideoElement | null)[]>([])
  // Volta da página do projeto (?case=slug): já monta com a lâmina daquele case
  // aberta, em vez de piscar o primeiro antes de trocar.
  const [focused, setFocused] = useState(() => {
    const slug = new URLSearchParams(window.location.search).get('case')
    const index = slug ? CASES.findIndex((client) => client.slug === slug) : -1
    return index < 0 ? 0 : index
  })
  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState<Record<string, boolean>>({})

  // Só o case em foco roda o vídeo; os outros ficam no frame parado (a lâmina
  // fina não justifica manter 10 vídeos decodificando ao mesmo tempo).
  useEffect(() => {
    videosRef.current.forEach((video, index) => {
      if (!video) return
      if (index === focused) void video.play().catch(() => {})
      else video.pause()
    })
  }, [focused])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let interval: number | null = null

    const stop = () => {
      if (interval) window.clearInterval(interval)
      interval = null
    }

    const start = () => {
      if (interval || paused) return
      interval = window.setInterval(() => {
        setFocused((current) => (current + 1) % CASES.length)
      }, AUTO_ADVANCE_MS)
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.25 }
    )
    io.observe(section)

    return () => {
      io.disconnect()
      stop()
    }
  }, [paused])

  // Rola até a seção quando veio de ?case=slug. O timeout dá um frame pro
  // layout assentar antes de medir a posição.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).get('case')) return

    const timeout = window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' })
      const url = new URL(window.location.href)
      url.searchParams.delete('case')
      window.history.replaceState(null, '', url.pathname + url.hash)
    }, 150)

    return () => window.clearTimeout(timeout)
  }, [])

  const active = CASES[focused]

  return (
    <section
      ref={sectionRef}
      id="cases"
      className="relative flex min-h-[60svh] flex-col items-center justify-center overflow-hidden bg-bold-black pb-16 pt-6 scroll-mt-24 sm:pb-28 sm:pt-16"
    >
      <div
        className="cases-accordion"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {CASES.map((client, index) => (
          <button
            key={client.slug}
            type="button"
            className="cases-accordion__panel"
            data-open={index === focused}
            aria-label={client.nome}
            aria-current={index === focused}
            onMouseEnter={() => setFocused(index)}
            onClick={() =>
              index === focused ? navigate(`/projeto-${client.slug}`) : setFocused(index)
            }
          >
            <video
              ref={(element) => {
                videosRef.current[index] = element
              }}
              // O fragmento #t garante que a lâmina fechada mostre um frame do
              // vídeo em vez de um retângulo preto, sem baixar o arquivo todo.
              src={`${client.videos[0]}#t=0.1`}
              loop
              muted
              playsInline
              preload="metadata"
              onError={() => setFailed((current) => ({ ...current, [client.slug]: true }))}
            />
            {/* Vídeo fora do ar (hoje: cota do Supabase novo estourada) cai na
                logo da marca em vez de deixar a lâmina preta. Some sozinho
                quando o vídeo voltar a carregar. */}
            {failed[client.slug] && (
              <span className="cases-accordion__fallback">
                <img src={client.logo} alt="" loading="lazy" />
              </span>
            )}
            {index === focused && <span className="cases-accordion__frame" aria-hidden="true" />}
          </button>
        ))}
      </div>

      <div key={active.slug} className="cases-caption">
        <span className="flex h-14 shrink-0 items-center justify-center rounded-lg bg-white px-3 sm:h-20">
          <img
            src={active.logo}
            alt={active.nome}
            loading="lazy"
            className="h-full max-h-10 w-auto max-w-[110px] object-contain sm:max-h-14"
          />
        </span>

        <div className="min-w-0">
          <h3 className="text-[clamp(1.5rem,3.4vw,2.75rem)] font-black uppercase leading-[0.95] tracking-[-0.02em] text-bold-white">
            {active.nome}
            <span className="ml-3 text-bold-yellow">{String(focused + 1).padStart(2, '0')}</span>
          </h3>
          {active.area && (
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-bold-white/50 sm:text-sm">
              {active.area}
            </p>
          )}
        </div>

        <ShinyButton onClick={() => navigate(`/projeto-${active.slug}`)}>
          {t.clientes.viewProject}
        </ShinyButton>
      </div>

      {/* Etiqueta sticky (mesmo mecanismo do Academy/Contato): acompanha o
          scroll e estaciona na divisa com Clientes. Presa a ESTA seção, não a
          um wrapper que inclua a abertura — senão ela já apareceria no rodapé
          enquanto a etiqueta BoldCrew ainda passa pelo mesmo canto, e as duas
          se sobrepunham. */}
      <div className="cases-etiqueta">
        <span className="live-yellow inline-block rounded-r-2xl py-2.5 pl-5 pr-8 text-[clamp(1.55rem,4vw,3rem)] font-black italic leading-none tracking-[-0.055em] text-bold-black sm:pr-10">
          {t.cases.label}
        </span>
      </div>
    </section>
  )
}
