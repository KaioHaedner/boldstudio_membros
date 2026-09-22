import { useRef, type CSSProperties } from 'react'
import { User } from 'lucide-react'
import { ShinyButton } from '@/components/ShinyButton'
import { useCardSwap } from '@/hooks/useCardSwap'
import { useI18n } from '@/i18n/I18nContext'

// Fotos do crew servidas pelo proprio site, em WebP de 720px. Antes vinham do
// Supabase como PNG de 900x1350, 15,6 MB no total: cada uma custa 4,9 MB de
// bitmap decodificado, e com a copia desfocada davam 84 MB so nesta secao. Era
// isso que esquentava o celular e fazia os cards ficarem pretos no meio do uso,
// porque o navegador descartava as imagens por falta de memoria.
//
// A bruma usa uma copia de 48px de largura: ela e desfocada de qualquer jeito,
// entao resolucao ali e desperdicio puro (1 KB no lugar de 2 MB).
const CREW = ([
  { id: 'pedro-garcia', nome: 'Pedro Garcia Jr.' },
  { id: 'miguel', nome: 'Miguel Souza' },
  { id: 'bruno', nome: 'Bruno Cavedon' },
  { id: 'william', nome: 'William Ferruda' },
  { id: 'rafaela', nome: 'Rafaela Souza' },
  { id: 'nathalia', nome: 'Nathalia Umburanas' },
  { id: 'caroline', nome: 'Caroline Ventura' },
  { id: 'germano', nome: 'Germano Pagliari' },
  { id: 'pedro-neto', nome: 'Pedro Garcia Neto' },
] as const).map((m) => ({ ...m, foto: `/crew/${m.id}.webp`, bruma: `/crew/${m.id}-bruma.webp` }))

// Stack de cards em perspectiva 3D que troca sozinho (efeito "Card Swap"),
// substituindo o sticky com portao de scroll: o cliente nao queria mais o
// scroll travado ate acabar de ver o time inteiro, entao aqui a secao fica no
// fluxo normal da pagina e os cards giram por conta propria (ver useCardSwap).
export function CrewSticky() {
  const { t } = useI18n()
  const stageRef = useRef<HTMLDivElement>(null)

  // 12s entre as trocas automaticas. Com 4s, quem passava o card com o dedo
  // via a troca seguinte entrar quase junto e parecia que tinha pulado dois.
  useCardSwap(stageRef, { delay: 12000, skewAmount: 2 })

  return (
    <section id="crew" className="relative overflow-hidden bg-bold-black py-24 scroll-mt-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="crew-swap-grid">
          {/* No celular a ordem vira titulo, cards e so entao o botao: o CTA
              em cima da pilha deixava o botao longe do card que ele fecha. */}
          <div className="crew-cta">
            <p className="crew-cta__texto max-w-[16ch] text-4xl font-black uppercase leading-[0.95] tracking-[-0.03em] text-bold-white sm:text-6xl">
              {t.crew.ctaTextA}
              <span className="text-bold-yellow">{t.crew.ctaTextHighlight}</span>
              {t.crew.ctaTextB}
            </p>
            <div className="crew-cta__botao">
              <ShinyButton
                onClick={() =>
                  document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              >
                {t.crew.ctaButton}
              </ShinyButton>
            </div>
          </div>

          <div
            ref={stageRef}
            className="crew-swap-stage"
            style={{ '--crew-count': CREW.length } as CSSProperties}
          >
            {CREW.map((m, i) => {
              const info = t.crew.members[m.id]
              return (
                <article key={m.id} className="crew-card" style={{ zIndex: CREW.length - i }}>
                  {m.foto ? (
                    <img
                      className="crew-card__foto"
                      src={m.foto}
                      alt={m.nome}
                      loading="lazy"
                      decoding="async"
                      /* imagem e arrastavel por padrao: o drag nativo do
                         navegador roubava o gesto e ainda rolava a pagina
                         sozinho, entao so pegava no preto ao lado da foto */
                      draggable={false}
                    />
                  ) : (
                    <span className="crew-card__foto crew-card__foto--vazia">
                      <User size={64} className="text-bold-white/20" aria-hidden="true" />
                    </span>
                  )}
                  {/* A bruma e uma copia minuscula da foto, esticada e
                      desfocada, com mascara de degrade. Feita com
                      backdrop-filter, o Chrome ignorava a mascara e cortava
                      reto no meio do peito. */}
                  {m.bruma && (
                    <img
                      className="crew-card__bruma"
                      src={m.bruma}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  )}
                  <div className="crew-card__info">
                    <span className="crew-card__bar" aria-hidden="true" />
                    <h3 className="crew-card__name">{m.nome}</h3>
                    <p className="crew-card__role">{info.role}</p>
                    <p className="crew-card__desc">{info.desc}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0">
        <span className="sticker-amarelo inline-block rounded-r-2xl py-2.5 pl-5 pr-8 text-[clamp(1.55rem,4vw,3rem)] font-black italic leading-none tracking-[-0.055em] text-bold-black sm:pr-10">
          BoldCrew
        </span>
      </div>
    </section>
  )
}
