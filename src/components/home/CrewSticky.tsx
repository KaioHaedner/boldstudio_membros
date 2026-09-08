import { useRef, type CSSProperties } from 'react'
import { User } from 'lucide-react'
import { ShinyButton } from '@/components/ShinyButton'
import { useCardSwap } from '@/hooks/useCardSwap'
import { useI18n } from '@/i18n/I18nContext'

// Fotos coloridas do crew: uma unica imagem por membro evita baixar duas
// versoes do Supabase para cada card e reduz o tempo de carregamento da home.
const COLOR_BASE = 'https://erhtqgaxibncpondscna.supabase.co/storage/v1/object/public/Fotos_CREW_COLORIDAS/'

const CREW = [
  { id: 'pedro-garcia', nome: 'Pedro Garcia Jr.', color: `${COLOR_BASE}PEDRAO_BOLD_IMG_CREW.png` },
  { id: 'miguel', nome: 'Miguel Souza', color: `${COLOR_BASE}MIGUEL_BOLD_IMG_CREW.png` },
  { id: 'bruno', nome: 'Bruno Cavedon', color: `${COLOR_BASE}CAVEDON_BOLD_IMG_CREW.png` },
  { id: 'william', nome: 'William Ferruda', color: `${COLOR_BASE}IMG_1088.JPG%201.png` },
  { id: 'rafaela', nome: 'Rafaela Souza', color: `${COLOR_BASE}RAFAELA_BOLD_IMG_CREW.png` },
  { id: 'nathalia', nome: 'Nathalia Umburanas', color: `${COLOR_BASE}NATHALIA_BOLD_IMG_CREW.webp` },
  { id: 'caroline', nome: 'Caroline Ventura', color: `${COLOR_BASE}MULHER_MIGUEL_BOLD_IMG_CREW.png` },
  { id: 'germano', nome: 'Germano Pagliari', color: `${COLOR_BASE}GERMANO_BOLD_IMG_CREW.png` },
  { id: 'pedro-neto', nome: 'Pedro Garcia Neto', color: `${COLOR_BASE}juninho_BOLD_IMG_CREW.png` },
] as const

// Stack de cards em perspectiva 3D que troca sozinho (efeito "Card Swap"),
// substituindo o sticky com portao de scroll: o cliente nao queria mais o
// scroll travado ate acabar de ver o time inteiro, entao aqui a secao fica no
// fluxo normal da pagina e os cards giram por conta propria (ver useCardSwap).
export function CrewSticky() {
  const { t } = useI18n()
  const stageRef = useRef<HTMLDivElement>(null)

  useCardSwap(stageRef, { delay: 4000, skewAmount: 2 })

  return (
    <section id="crew" className="relative overflow-hidden bg-bold-black py-24 scroll-mt-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="crew-swap-grid">
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <p className="max-w-[16ch] text-4xl font-black uppercase leading-[0.95] tracking-[-0.03em] text-bold-white sm:text-6xl">
              {t.crew.ctaTextA}
              <span className="text-bold-yellow">{t.crew.ctaTextHighlight}</span>
              {t.crew.ctaTextB}
            </p>
            <ShinyButton
              onClick={() =>
                document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            >
              {t.crew.ctaButton}
            </ShinyButton>
          </div>

          <div
            ref={stageRef}
            className="crew-swap-stage"
            style={{ '--crew-count': CREW.length } as CSSProperties}
          >
            {CREW.map((m, i) => {
              const info = t.crew.members[m.id]
              const hasPhoto = 'color' in m
              return (
                <article key={m.id} className="crew-card" style={{ zIndex: CREW.length - i }}>
                  <div className="crew-card__info">
                    <span className="crew-card__bar" aria-hidden="true" />
                    <div>
                      <h3 className="crew-card__name">{m.nome}</h3>
                      <div className="crew-card__roles">
                        <p className="crew-card__role">{info.role}</p>
                      </div>
                      <p className="crew-card__desc">{info.desc}</p>
                    </div>
                  </div>
                  {hasPhoto ? (
                    <div className="crew-card__photo">
                      <img
                        className="crew-photo"
                        src={m.color}
                        alt={m.nome}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : (
                    <div className="crew-card__photo crew-card__photo--empty">
                      <User size={64} className="text-bold-white/20" aria-hidden="true" />
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0">
        <span className="live-yellow inline-block rounded-r-2xl py-2.5 pl-5 pr-8 text-[clamp(1.55rem,4vw,3rem)] font-black italic leading-none tracking-[-0.055em] text-bold-black sm:pr-10">
          BoldCrew
        </span>
      </div>
    </section>
  )
}
