import { useNavigate } from 'react-router-dom'
import { Camera, Video, GraduationCap, Clapperboard, Aperture, Film, Monitor, Radio } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ShinyButton } from '@/components/ShinyButton'

// =====================================================================
// Academy — única seção clara do site (branco da marca).
// Fundo branco + shaders amarelos 15% + ícones "vindo do fundo pro perto"
// (scale 0 -> tamanho final, some ao chegar) + marquee "Bold Academy •".
//
// TODO(Kaio): trocar os ícones placeholder (lucide) pelos SVGs reais de
// filmagem / estudos / rec / câmera / tripé assim que chegarem. Basta
// editar ICON_FIELD. O favicon da Bold já entra no mesmo efeito.
// Trocar tb o vídeo central (placeholder 1:1) pelo arquivo real.
// =====================================================================

const BOLD_FAVICON = '/brand/favicon-boldstudio.svg'

type IconSpot = {
  /** ícone lucide OU caminho de imagem (favicon da Bold) */
  Icon?: LucideIcon
  img?: string
  top: string
  left: string
  /** atraso do loop, s */
  delay: number
  /** duração de cada ciclo, s */
  dur: number
  /** tamanho final do ícone (o "perto") */
  size: string
}

// Ícones SÓ nas laterais (esquerda/direita), fora da faixa central onde
// ficam a logo, o headline e o vídeo. Posições/tempos variados pra dar
// sensação de profundidade contínua (uns surgindo, outros sumindo).
const ICON_FIELD: IconSpot[] = [
  // --- coluna esquerda ---
  { Icon: Camera,       top: '14%', left: '6%',  delay: 0.0, dur: 6.5, size: '3vw' },
  { Icon: Video,        top: '40%', left: '11%', delay: 1.8, dur: 7.2, size: '2.6vw' },
  { Icon: Film,         top: '64%', left: '5%',  delay: 4.0, dur: 7.0, size: '2.5vw' },
  { img: BOLD_FAVICON,  top: '86%', left: '10%', delay: 3.0, dur: 6.9, size: '3vw' },
  { Icon: Clapperboard, top: '52%', left: '3%',  delay: 5.6, dur: 7.8, size: '2.4vw' },
  { img: BOLD_FAVICON,  top: '26%', left: '13%', delay: 4.6, dur: 6.3, size: '3.2vw' },
  // --- coluna direita ---
  { Icon: GraduationCap,top: '18%', left: '88%', delay: 0.9, dur: 6.0, size: '3.2vw' },
  { Icon: Radio,        top: '46%', left: '93%', delay: 2.6, dur: 6.8, size: '2.4vw' },
  { Icon: Aperture,     top: '72%', left: '87%', delay: 1.2, dur: 6.4, size: '3vw' },
  { Icon: Monitor,      top: '34%', left: '95%', delay: 2.1, dur: 6.6, size: '2.7vw' },
  { img: BOLD_FAVICON,  top: '60%', left: '96%', delay: 5.0, dur: 7.4, size: '3.4vw' },
  { Icon: Camera,       top: '88%', left: '90%', delay: 3.4, dur: 7.6, size: '2.8vw' },
]

export function AcademySection() {
  const navigate = useNavigate()

  return (
    <div className="relative">
      {/* Pontas: meia-lua (arco). Esquerda faz cúpula pra CIMA (no preto),
          direita faz cúpula pra BAIXO (no branco); lado reto na linha. */}
      <div className="absolute left-8 top-0 z-30 -translate-y-full sm:left-12">
        <div className="flex h-[108px] w-[216px] items-end justify-center rounded-t-full border-2 border-b-0 border-bold-yellow bg-bold-black pb-5 shadow-[0_0_24px_rgba(255,215,18,0.3)]">
          <Camera className="text-bold-yellow" size={30} strokeWidth={2} />
        </div>
      </div>
      <div className="absolute right-8 top-0 z-30 sm:right-12">
        <div className="flex h-[108px] w-[216px] items-start justify-center rounded-b-full border-2 border-t-0 border-bold-yellow bg-bold-black pt-5 shadow-[0_0_24px_rgba(255,215,18,0.3)]">
          <Clapperboard className="text-bold-yellow" size={30} strokeWidth={2} />
        </div>
      </div>

      {/* Divisor: pílula na linha; UMA palavra por vez desliza da esquerda em loop */}
      <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-center justify-center rounded-full border-2 border-bold-yellow bg-bold-black px-4 py-1.5 shadow-[0_0_30px_rgba(255,215,18,0.35)]">
          <div className="relative h-7 min-w-[104px] overflow-hidden text-[20px] font-black uppercase tracking-[0.15em] text-bold-white">
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="animate-rec-word inline-block" style={{ animationDelay: '0s' }}>
                Solta
              </span>
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="animate-rec-word inline-block" style={{ animationDelay: '1.2s' }}>
                O
              </span>
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              <span
                className="animate-rec-word inline-flex items-center gap-2"
                style={{ animationDelay: '2.4s' }}
              >
                Rec
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.9)]" />
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>

      <section
        id="academy"
        data-reveal
        className="relative scroll-mt-24 border-t-2 border-bold-yellow bg-bold-white pb-24 pt-24 md:pb-32 md:pt-28"
      >
      {/* Shaders amarelos (opacidade ~15%), só neste container */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob-1 absolute -left-[10%] top-[8%] h-[45vw] w-[45vw] rounded-full bg-bold-yellow/15 blur-[90px]" />
        <div className="animate-blob-2 absolute -right-[8%] top-[30%] h-[38vw] w-[38vw] rounded-full bg-bold-yellow/15 blur-[100px]" />
        <div className="animate-blob-3 absolute bottom-[4%] left-[40%] h-[32vw] w-[32vw] rounded-full bg-bold-yellow/15 blur-[80px]" />
      </div>

      {/* Marquee gigante "Bold Academy •" ao fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex overflow-hidden"
      >
        <div className="academy-marquee flex shrink-0 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <span
              key={copy}
              className="select-none pr-8 text-[16vw] font-black uppercase leading-none tracking-tight text-bold-black/10"
            >
              Bold&nbsp;Academy&nbsp;&middot;&nbsp;Bold&nbsp;Academy&nbsp;&middot;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Campo de ícones vindo do fundo pro perto (inclui o favicon da Bold) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
        {ICON_FIELD.map((spot, i) => (
          <span
            key={i}
            className="academy-icon text-bold-yellow"
            style={
              {
                top: spot.top,
                left: spot.left,
                '--acad-delay': `${spot.delay}s`,
                '--acad-dur': `${spot.dur}s`,
                '--acad-size': spot.size,
              } as React.CSSProperties
            }
          >
            {spot.img ? (
              <img src={spot.img} alt="" className="h-full w-full object-contain" />
            ) : (
              spot.Icon && <spot.Icon strokeWidth={1.6} />
            )}
          </span>
        ))}
      </div>

      {/* Conteúdo central */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        {/* Logo da Bold (versão preta, pro fundo claro) */}
        <img src="/brand/logo-black.png" alt="Bold Studio" className="h-11 w-auto md:h-14" />

        {/* Título — 2 linhas, mescla preto + amarelo da marca */}
        <h2 className="mt-8 text-3xl font-bold leading-[1.15] text-bold-black sm:text-4xl md:text-[2.6rem]">
          Do <span className="text-bold-yellow">amador</span> ao profissional que
          <br />
          vive de <span className="text-bold-yellow">audiovisual</span>
        </h2>

        {/* Vídeo central — placeholder QUADRADO */}
        <div className="mt-10 aspect-square w-full max-w-md overflow-hidden rounded-xl border border-bold-black/10 bg-bold-black/[0.04] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.35)]">
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-bold-black/35">
            <Video size={40} className="text-bold-yellow" />
            <span className="text-xs font-semibold uppercase tracking-widest">Vídeo Academy</span>
            <span className="text-[10px] text-bold-black/30">placeholder 1:1</span>
          </div>
        </div>

        <div className="mt-10">
          <ShinyButton onClick={() => navigate('/academy')}>Conhecer Academy</ShinyButton>
        </div>
      </div>

      {/* Etiqueta amarela sticky com gradiente vivo (estilo Soluções/Contato) */}
      <div className="pointer-events-none sticky bottom-6 z-20 mt-16">
        <span className="live-yellow inline-block rounded-r-2xl py-2.5 pl-5 pr-8 text-[clamp(1.55rem,4vw,3rem)] font-black italic leading-none tracking-[-0.055em] text-bold-black shadow-[0_12px_30px_-8px_rgba(0,0,0,0.45)] sm:pr-10">
          Academy
        </span>
      </div>
      </section>
    </div>
  )
}
