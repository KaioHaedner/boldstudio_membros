import { useEffect, useRef, useState } from 'react'
import { MapPin, Phone, Play, Video, X } from 'lucide-react'
import { ScrollTrigger } from '@/lib/gsap'
import { ShinyButton } from '@/components/ShinyButton'
import { useI18n } from '@/i18n/I18nContext'

// Galeria "Scroll Wave" (GSAP) portada para a secao Clientes. Cada logo ondula
// horizontalmente conforme o scroll; clicar abre um popup com os dados da empresa.
// Dados e logos sao placeholder ate ter os clientes reais (depois: tabela clientes
// no Supabase com nome/area/telefone/video).
// slug -> futura pagina /projeto-:slug (Etapa 2). area/telefone ficam opcionais:
// so renderizamos quando o dado real existir (sem inventar info em cliente real).
type Cliente = { nome: string; slug: string; logo: string; area?: string; telefone?: string; video?: string; preview?: string }

const LOGO = 'https://erhtqgaxibncpondscna.supabase.co/storage/v1/object/public/CLIENTES_CONTEINER/'
const VID = 'https://erhtqgaxibncpondscna.supabase.co/storage/v1/object/public/CLIENTES_CONTEINER_PREVIA_VD/'

const CLIENTES: Cliente[] = [
  { nome: 'Shopping Sinop', slug: 'shopping-sinop', logo: `${LOGO}SHOPPING_SINOP_LOGO_CLIENTES.png`, area: 'Shopping Center' },
  { nome: 'Frialto', slug: 'frialto', logo: `${LOGO}FRIALTO_LOGO_CLIENTES.png`, area: 'Frigorífico' },
  { nome: 'Forteza', slug: 'forteza', logo: `${LOGO}FORTEZA_LOGO_CLIENTES.png`, video: `${VID}FORTEZA_.mp4`, preview: `${VID}FORTEZA_.mp4` },
  { nome: 'JMD Urbanismo', slug: 'jmd-urbanismo', logo: `${LOGO}JMD_LOGO_CLIENTES.png`, area: 'Urbanismo' },
  { nome: 'Fobel', slug: 'fobel', logo: `${LOGO}FOBEL_LOGO_CLIENTES.png` },
  { nome: 'Biancon', slug: 'biancon', logo: `${LOGO}BIANCON_LOGO_CLIENTES.png` },
  { nome: 'Embrapa', slug: 'embrapa', logo: `${LOGO}EMBRAPA_LOGO_CLEINTES.png`, area: 'Pesquisa Agropecuária' },
  { nome: 'Machado Supermercados', slug: 'machado-supermercados', logo: `${LOGO}GRUPOMACHADO_LOGO_CLEINTES.png`, area: 'Supermercados', video: `${VID}MACHADO_.mp4`, preview: `${VID}MACHADO_.mp4` },
  { nome: 'Madô Burguer', slug: 'mado-burguer', logo: `${LOGO}MADO%20BURGUER_CLEINTES.png`, area: 'Hamburgueria', video: `${VID}MADO_BURGUER_.mp4`, preview: `${VID}MADO_BURGUER_.mp4` },
  { nome: 'John Deere · Agro Baggio', slug: 'agro-baggio-john-deere', logo: `${LOGO}AGROBAGGIO_JHONDEERE_LOGO_CLIENTES.png`, area: 'Máquinas Agrícolas', video: `${VID}AGRO_BAGGIO_JHON_DEERE_.mp4`, preview: `${VID}AGRO_BAGGIO_JHON_DEERE_.mp4` },
  { nome: 'Parrilla do Campo', slug: 'parrilla-do-campo', logo: `${LOGO}PARRILHA_DO_CAMPO_LOGO_CLIENTES.png`, area: 'Gastronomia' },
  { nome: 'Exponorte', slug: 'exponorte', logo: `${LOGO}EXPORNORTE_LOGO_CLIENTES.png`, area: 'Feira · Agronegócio', video: `${VID}EXPORNORTE_.mp4`, preview: `${VID}EXPORNORTE_.mp4` },
  { nome: 'Grupo Sinop', slug: 'grupo-sinop', logo: `${LOGO}GRUPOSINOP_LOGO_CLIENTES.png`, area: 'Agronegócio', video: `${VID}GRUPOSINOP_.mp4`, preview: `${VID}GRUPOSINOP_.mp4` },
  { nome: 'Paiol Agrícola', slug: 'paiol-agricola', logo: `${LOGO}PAIOL_LOGO_CLIENTES.png`, area: 'Agronegócio', video: `${VID}PAIOL_AGRICOLA_.mp4`, preview: `${VID}PAIOL_AGRICOLA_.mp4` },
]

const WAVES = {
  base: { amp: 0.1, freq: 1.0, speed: 1.0, phase: 5.0 },
  flow: { amp: 0.15, freq: 5.0, speed: 5.0, phase: 10.0 },
  detail: { amp: 0.025, freq: 5.0, speed: 1.5, phase: 2.5 },
}
const CLIP_MAX = 20
const CLIP_POWER = 2
const IMAGE_BASE_HEIGHT = 375
const ASPECT_RATIOS = ['3/2', '4/3', '5/4', '7/5']

export function ClientesWave() {
  const { t } = useI18n()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<Cliente | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const items = Array.from(wrap.querySelectorAll<HTMLElement>('.spotlight-image'))
    const total = items.length
    if (total === 0) return
    const shrinkStart = Math.floor(total * 0.75)

    function updateSizes() {
      const sizeFactor = Math.min(window.innerWidth / 750, 1)
      items.forEach((item, i) => {
        const shrink = i >= shrinkStart ? (i - shrinkStart + 1) / (total - shrinkStart) : 0
        const h = IMAGE_BASE_HEIGHT * sizeFactor * (1 - shrink * 0.5)
        item.style.height = `${Math.round(h)}px`
      })
    }
    updateSizes()

    const triggers = items.map((item, index) => {
      const normalizedIndex = index / (total - 1)
      return ScrollTrigger.create({
        trigger: item,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: ({ progress }) => {
          const vw = window.innerWidth
          const baseWave = Math.sin(
            normalizedIndex * WAVES.base.freq + (1 - progress) * WAVES.base.speed + WAVES.base.phase
          )
          const flowWave =
            0.5 + Math.sin(normalizedIndex * WAVES.flow.freq + WAVES.flow.phase + progress * WAVES.flow.speed)
          const detailWave =
            0.5 +
            Math.sin(normalizedIndex * WAVES.detail.freq + WAVES.detail.phase + progress * WAVES.detail.speed)

          const translateX =
            (vw - item.offsetWidth) / 2 -
            vw * 0.1 +
            baseWave * vw * WAVES.base.amp +
            flowWave * vw * WAVES.flow.amp +
            detailWave * vw * WAVES.detail.amp

          const centerOffset = Math.abs(progress - 0.5) * 2
          const clipAmount = Math.pow(centerOffset, CLIP_POWER) * CLIP_MAX

          item.style.translate = `${translateX}px`
          item.style.clipPath = `inset(0 ${clipAmount}% 0 ${clipAmount}% round 0.5rem)`
        },
      })
    })

    // So recalcula quando a LARGURA muda. No mobile, rolar nos extremos faz a
    // barra de endereco aparecer/sumir (muda so a altura) e disparava um
    // ScrollTrigger.refresh() pesado a cada vez — causando a travadinha.
    let lastWidth = window.innerWidth
    function onResize() {
      if (window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      updateSizes()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)

    return () => {
      triggers.forEach((t) => t.kill())
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section id="clientes" className="clientes-wave scroll-mt-24">
      <div className="px-6 pt-24 pb-4 text-center">
        <p className="text-xs font-bold tracking-wider text-bold-yellow">{t.clientes.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">{t.clientes.title}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-bold-white/60">{t.clientes.helper}</p>
      </div>

      <div ref={wrapRef} className="spotlight-images">
        {CLIENTES.map((c, i) => (
          <div
            key={c.nome}
            className="spotlight-image"
            style={{ aspectRatio: ASPECT_RATIOS[i % ASPECT_RATIOS.length] }}
            role="button"
            tabIndex={0}
            aria-label={`Ver detalhes de ${c.nome}`}
            onClick={() => setSelected(c)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSelected(c)
              }
            }}
          >
            <img src={c.logo} alt={c.nome} loading="lazy" />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-5 px-6 pb-24 pt-2 text-center">
        <p className="text-xl font-bold text-bold-white md:text-2xl">{t.clientes.ctaText}</p>
        <ShinyButton
          onClick={() =>
            document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        >
          {t.clientes.ctaButton}
        </ShinyButton>
      </div>

      {selected && (
        <div
          role="presentation"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes de ${selected.nome}`}
            className="relative w-full max-w-md rounded-xl border border-bold-yellow/20 bg-bold-gray p-6 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Fechar"
              className="absolute right-4 top-4 z-10 text-bold-white/60 transition-colors hover:text-bold-white"
            >
              <X size={20} />
            </button>

            {/* Preview animado (GIF/video em loop). Placeholder ate ter o real. */}
            <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-bold-black/50">
              {selected.preview ? (
                <video
                  src={selected.preview}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onTimeUpdate={(e) => {
                    // corta o preview nos primeiros 10s, em loop
                    if (e.currentTarget.currentTime >= 10) e.currentTarget.currentTime = 0
                  }}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-bold-white/40">
                  <Play size={30} className="text-bold-yellow/70" />
                  <span className="text-xs">{t.clientes.previewSoon}</span>
                </div>
              )}
            </div>

            <h3 className="mt-5 text-xl font-bold text-bold-white">{selected.nome}</h3>

            {(selected.area || selected.telefone) && (
              <div className="mt-3 flex flex-col items-center gap-2 text-sm text-bold-white/80">
                {selected.area && (
                  <p className="flex items-center justify-center gap-2">
                    <MapPin size={16} className="shrink-0 text-bold-yellow" /> {selected.area}
                  </p>
                )}
                {selected.telefone && (
                  <p className="flex items-center justify-center gap-2">
                    <Phone size={16} className="shrink-0 text-bold-yellow" /> {selected.telefone}
                  </p>
                )}
              </div>
            )}

            {selected.video && (
              <a
                href={selected.video}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-bold-yellow px-5 py-2.5 text-sm font-bold text-bold-black transition-transform hover:scale-[1.02]"
              >
                <Video size={16} /> {t.clientes.watchCase}
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
