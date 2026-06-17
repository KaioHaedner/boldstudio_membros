import { useEffect, useRef, useState } from 'react'
import { MapPin, Phone, Play, Video, X } from 'lucide-react'
import { ScrollTrigger } from '@/lib/gsap'
import { ShinyButton } from '@/components/ShinyButton'

// Galeria "Scroll Wave" (GSAP) portada para a secao Clientes. Cada logo ondula
// horizontalmente conforme o scroll; clicar abre um popup com os dados da empresa.
// Dados e logos sao placeholder ate ter os clientes reais (depois: tabela clientes
// no Supabase com nome/area/telefone/video).
type Cliente = { nome: string; area: string; telefone: string; video: string; preview?: string }

const CLIENTES: Cliente[] = [
  { nome: 'Empresa Exemplo 01', area: 'Varejo', telefone: '(66) 99999-0001', video: '#' },
  { nome: 'Empresa Exemplo 02', area: 'Imobiliária', telefone: '(66) 99999-0002', video: '#' },
  { nome: 'Empresa Exemplo 03', area: 'Agronegócio', telefone: '(66) 99999-0003', video: '#' },
  { nome: 'Empresa Exemplo 04', area: 'Moda', telefone: '(66) 99999-0004', video: '#' },
  { nome: 'Empresa Exemplo 05', area: 'Gastronomia', telefone: '(66) 99999-0005', video: '#' },
  { nome: 'Empresa Exemplo 06', area: 'Academia', telefone: '(66) 99999-0006', video: '#' },
  { nome: 'Empresa Exemplo 07', area: 'Saúde', telefone: '(66) 99999-0007', video: '#' },
  { nome: 'Empresa Exemplo 08', area: 'Educação', telefone: '(66) 99999-0008', video: '#' },
  { nome: 'Empresa Exemplo 09', area: 'Construção', telefone: '(66) 99999-0009', video: '#' },
  { nome: 'Empresa Exemplo 10', area: 'Automotivo', telefone: '(66) 99999-0010', video: '#' },
  { nome: 'Empresa Exemplo 11', area: 'Tecnologia', telefone: '(66) 99999-0011', video: '#' },
  { nome: 'Empresa Exemplo 12', area: 'Eventos', telefone: '(66) 99999-0012', video: '#' },
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
          item.style.clipPath = `inset(0 ${clipAmount}% 0 ${clipAmount}% round 0.9rem)`
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
        <p className="text-xs font-bold tracking-wider text-bold-yellow">Clientes</p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">Marcas que a BoldStudio já atendeu</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-bold-white/60">
          Clique numa logo para ver os detalhes da empresa.
        </p>
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
            <img src="/brand/logo-boldstudio.webp" alt={c.nome} />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-5 px-6 pb-24 pt-2 text-center">
        <p className="text-xl font-bold text-bold-white md:text-2xl">Quer ser a próxima marca por aqui?</p>
        <ShinyButton
          onClick={() =>
            document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        >
          Bora gravar com a Bold
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
            className="relative w-full max-w-md rounded-3xl border border-bold-yellow/20 bg-bold-gray p-6 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
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
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-bold-black/50">
              {selected.preview ? (
                <video
                  src={selected.preview}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-bold-white/40">
                  <Play size={30} className="text-bold-yellow/70" />
                  <span className="text-xs">Preview em breve</span>
                </div>
              )}
            </div>

            <h3 className="mt-5 text-xl font-bold text-bold-white">{selected.nome}</h3>

            <div className="mt-3 flex flex-col items-center gap-2 text-sm text-bold-white/80">
              <p className="flex items-center justify-center gap-2">
                <MapPin size={16} className="shrink-0 text-bold-yellow" /> {selected.area}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Phone size={16} className="shrink-0 text-bold-yellow" /> {selected.telefone}
              </p>
            </div>

            <a
              href={selected.video}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-bold-yellow px-5 py-2.5 text-sm font-bold text-bold-black transition-transform hover:scale-[1.02]"
            >
              <Video size={16} /> Ver vídeo do case
            </a>
          </div>
        </div>
      )}
    </section>
  )
}
