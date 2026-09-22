import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CLIENTES } from '@/data/clientes'
import { ShinyButton } from '@/components/ShinyButton'
import { useI18n } from '@/i18n/I18nContext'

// Só as marcas que têm vídeo demoreel entram nos cases.
const CASES = CLIENTES.filter((c) => c.videos.length > 0)

const TROCA_AUTOMATICA_MS = 5000

// Cases: um palco grande (perto de 80% da tela) com o vídeo do case aberto
// desde o início, a logo da marca dentro do próprio vídeo e um seletor de
// marcas no canto. Substituiu o accordion de lâminas, que obrigava a passar o
// mouse pra abrir e ficava difícil de usar no celular.
export function CasesCarrossel() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Volta da página do projeto (?case=slug): já abre naquele case.
  const [atual, setAtual] = useState(() => {
    const slug = new URLSearchParams(window.location.search).get('case')
    const indice = slug ? CASES.findIndex((c) => c.slug === slug) : -1
    return indice < 0 ? 0 : indice
  })
  const [pausado, setPausado] = useState(false)
  const [falhou, setFalhou] = useState<Record<string, boolean>>({})

  const indiceAtual = useRef(atual)
  const selecionar = useCallback((indice: number) => {
    indiceAtual.current = indice
    setAtual(indice)
  }, [])

  const caso = CASES[atual]
  const semVideo = falhou[caso.slug]

  // Só existe um <video> no palco e ele troca de src conforme o case, então
  // nunca há mais de um vídeo baixando ao mesmo tempo. Isso importa porque a
  // cota do Supabase novo já estourou uma vez com dez vídeos simultâneos.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    void video.play().catch(() => {})
  }, [atual])

  useEffect(() => {
    const secao = sectionRef.current
    if (!secao) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let intervalo: number | null = null
    const parar = () => {
      if (intervalo) window.clearInterval(intervalo)
      intervalo = null
    }
    const comecar = () => {
      if (intervalo || pausado) return
      intervalo = window.setInterval(() => {
        selecionar((indiceAtual.current + 1) % CASES.length)
      }, TROCA_AUTOMATICA_MS)
    }

    const io = new IntersectionObserver(
      ([entrada]) => (entrada.isIntersecting ? comecar() : parar()),
      { threshold: 0.25 }
    )
    io.observe(secao)

    return () => {
      io.disconnect()
      parar()
    }
  }, [pausado, selecionar])

  // Rola até a seção quando veio de ?case=slug.
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

  return (
    <section ref={sectionRef} id="cases" className="cases-secao scroll-mt-24">
      <div
        className="cases-palco"
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => setPausado(false)}
      >
        <video
          ref={videoRef}
          key={caso.slug}
          className="cases-palco__video"
          src={caso.videos[0]}
          loop
          muted
          playsInline
          preload="auto"
          onError={() =>
            setFalhou((atuais) => (atuais[caso.slug] ? atuais : { ...atuais, [caso.slug]: true }))
          }
        />

        {/* Enquanto o vídeo não carrega (hoje a cota do Supabase novo está
            estourada), o palco mostra a marca em vez de um retângulo preto. */}
        {semVideo && (
          <span className="cases-palco__vazio">
            <img src={caso.logo} alt="" loading="lazy" />
          </span>
        )}

        <span className="cases-palco__sombra" aria-hidden="true" />

        {/* Logo DENTRO do card, como o cliente pediu */}
        <span className="cases-palco__marca">
          <img src={caso.logo} alt={caso.nome} loading="lazy" />
        </span>

        {/* Seletor no canto: as marcas ficam disponíveis pra escolher qual ver */}
        <div className="cases-seletor" role="tablist" aria-label={t.cases.label}>
          {CASES.map((cliente, indice) => (
            <button
              key={cliente.slug}
              type="button"
              role="tab"
              aria-selected={indice === atual}
              aria-label={cliente.nome}
              className="cases-seletor__item"
              data-ativo={indice === atual}
              onClick={() => selecionar(indice)}
            >
              <img src={cliente.logo} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {/* Embaixo do vídeo: nome, área e o botão do projeto */}
      <div key={caso.slug} className="cases-legenda">
        <div className="min-w-0">
          <h3 className="cases-legenda__nome">{caso.nome}</h3>
          {caso.area && <p className="cases-legenda__area">{caso.area}</p>}
        </div>
        <ShinyButton onClick={() => navigate(`/projeto-${caso.slug}`)}>
          {t.clientes.viewProject}
        </ShinyButton>
      </div>

      <div className="cases-cta">
        <ShinyButton
          onClick={() =>
                document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
        >
          {t.cases.ctaButton}
        </ShinyButton>
      </div>

      <div className="cases-etiqueta">
        <span className="sticker-amarelo inline-block rounded-r-2xl py-2.5 pl-5 pr-8 text-[clamp(1.55rem,4vw,3rem)] font-black italic leading-none tracking-[-0.055em] text-bold-black sm:pr-10">
          {t.cases.label}
        </span>
      </div>
    </section>
  )
}
