import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CLIENTES } from '@/apps/site/data/clientes'
import { ShinyButton } from '@/shared/components/ShinyButton'
import { useI18n } from '@/apps/site/i18n/I18nContext'
import { BudgetVideo } from '@/shared/components/BudgetVideo'
import { videoPreview, isRecoveredCasePreview } from '@/shared/lib/video-preview'
import { SolucoesParallax } from './SolucoesParallax'
import { CoinDecor } from './CoinDecor'
import { Volume2, VolumeX } from 'lucide-react'
import previewAudio from '@/shared/lib/preview-audio.json'

// Só as marcas que têm vídeo demoreel entram nos cases.
const CASES = CLIENTES.filter((c) => c.videos.length > 0)

// Cases: um palco grande (perto de 80% da tela) com o vídeo do case aberto
// desde o início, a logo da marca dentro do próprio vídeo e um seletor de
// marcas no canto. Substituiu o accordion de lâminas, que obrigava a passar o
// mouse pra abrir e ficava difícil de usar no celular.
export function CasesCarrossel() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)

  // Volta da página do projeto (?case=slug): já abre naquele case.
  const [atual, setAtual] = useState(() => {
    const slug = new URLSearchParams(window.location.search).get('case')
    const indice = slug ? CASES.findIndex((c) => c.slug === slug) : -1
    return indice < 0 ? 0 : indice
  })
  const [falhou, setFalhou] = useState<Record<string, boolean>>({})
  const [previewEnded, setPreviewEnded] = useState(false)
  const [muted, setMuted] = useState(true)

  const caso = CASES[atual]
  const semVideo = falhou[caso.slug]
  const preview = videoPreview(caso.videos[0])
  const hasAudio = Boolean(preview && (previewAudio as Record<string, boolean>)[preview])
  const centeredProject = previewEnded || !preview || Boolean(semVideo)
  const audioLabels = lang === 'en' ? ['Enable sound', 'Mute sound', 'Preview without audio'] : lang === 'es' ? ['Activar sonido', 'Silenciar', 'Vista previa sin audio'] : ['Ativar áudio', 'Silenciar áudio', 'Prévia sem áudio']
  // Selecting a case is explicit: no timer cycles through large full movies.

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
      <SolucoesParallax indices={[5]} layout="right" className="section-backdrop--cases" />
      <div className="cases-palco">
        {preview && !semVideo && (
          <BudgetVideo
            key={caso.slug}
            className="cases-palco__video"
            src={preview}
            poster={caso.logo}
            autoPlay={!previewEnded}
            muted={muted}
            playsInline
            onTimeUpdate={(event) => {
              if (event.currentTarget.currentTime >= 10) {
                event.currentTarget.pause()
                setPreviewEnded(true)
              }
            }}
            onEnded={() => setPreviewEnded(true)}
            onError={() =>
              setFalhou((atuais) => (atuais[caso.slug] ? atuais : { ...atuais, [caso.slug]: true }))
            }
          />
        )}

        {/* Enquanto o vídeo não carrega (hoje a cota do Supabase novo está
            estourada), o palco mostra a marca em vez de um retângulo preto. */}
        {(!preview || semVideo) && (
          <span className="cases-palco__vazio flex-col gap-4" role="status">
            <img src={caso.logo} alt="" loading="lazy" />
            {semVideo && <span className="px-6 text-center text-sm text-white/70">{t.cases.unavailable}</span>}
          </span>
        )}

        <span className="cases-palco__sombra" aria-hidden="true" />
        {preview && !semVideo && <button
          type="button"
          className="cases-palco__audio"
          disabled={!hasAudio}
          aria-label={!hasAudio ? audioLabels[2] : muted ? audioLabels[0] : audioLabels[1]}
          title={!hasAudio ? audioLabels[2] : muted ? audioLabels[0] : audioLabels[1]}
          onClick={() => {
            const video = sectionRef.current?.querySelector('video')
            if (!video) return
            const nextMuted = !muted
            video.muted = nextMuted
            setMuted(nextMuted)
            if (video.ended || previewEnded) {
              video.currentTime = 0
              setPreviewEnded(false)
            }
            void video.play().catch(() => { video.muted = true; setMuted(true) })
          }}
        >
          {muted || !hasAudio ? <VolumeX size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}
          <span>{!hasAudio ? audioLabels[2] : muted ? audioLabels[0] : audioLabels[1]}</span>
        </button>}

        {centeredProject && (
          <div className="cases-palco__final">
            {previewEnded && <p role="status">{t.cases.previewFinished}</p>}
          </div>
        )}

        {/* Logo DENTRO do card, como o cliente pediu */}
        <div className="cases-palco__project">
          <span className="cases-palco__marca">
            <img src={caso.logo} alt={caso.nome} loading="lazy" />
          </span>
        </div>
        {/* One persistent CTA slides from below the logo to the stage center. */}
        <div className="cases-palco__cta" data-centered={centeredProject}>
          <ShinyButton className="cases-palco__project-button" onClick={() => navigate(`/projeto-${caso.slug}`)}>
            {t.clientes.viewProject}
          </ShinyButton>
        </div>

        {/* Seletor no canto: as marcas ficam disponíveis pra escolher qual ver */}
        <div className="cases-seletor" role="tablist" aria-label={t.cases.label}>
          <div className="cases-seletor__track">
          {CASES.map((cliente, indice) => (
            <button
              key={cliente.slug}
              type="button"
              role="tab"
              aria-selected={indice === atual}
              aria-label={cliente.nome}
              className="cases-seletor__item"
              data-ativo={indice === atual}
              onClick={() => {
                setAtual(indice)
                setPreviewEnded(false)
                setMuted(true)
              }}
            >
              <img src={cliente.logo} alt="" loading="lazy" />
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* Embaixo do vídeo: nome, área e o botão do projeto */}
      <div key={caso.slug} className="cases-legenda">
        <div className="min-w-0">
          <h3 className="cases-legenda__nome">{caso.nome}</h3>
          {caso.area && <p className="cases-legenda__area">{caso.area}</p>}
          {preview && isRecoveredCasePreview(caso.videos[0]) && (
            <p className="mt-2 text-xs text-white/50">{t.cases.recoveredPreview}</p>
          )}
        </div>
      </div>

      <div className="cases-etiqueta">
        <span className="sticker-amarelo inline-block rounded-r-2xl py-2.5 pl-5 pr-8 text-[clamp(1.55rem,4vw,3rem)] font-black italic leading-none tracking-[-0.055em] text-bold-black sm:pr-10">
          {t.cases.label}
        </span>
        <CoinDecor className="cases-coin w-20 opacity-30" rotate={-14} />
      </div>
    </section>
  )
}
