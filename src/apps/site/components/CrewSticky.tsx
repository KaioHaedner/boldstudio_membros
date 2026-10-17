import { ShinyButton } from '@/shared/components/ShinyButton'
import { StackedCarousel } from '@/shared/components/ui/StackedCarousel'
import { useI18n } from '@/apps/site/i18n/I18nContext'

// Preserva as fotos originais do time, otimizadas em WebP local de 720px.
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
] as const).map((m) => ({ ...m, label: m.nome, foto: `/crew/${m.id}.webp` }))

// Pilha horizontal compacta, sem arco/rotacao e sem troca automatica.
// Usa as fotos locais otimizadas, sem duplicar bitmaps para uma camada de blur.
export function CrewSticky() {
  const { t, lang } = useI18n()
  const labels = {
    pt: { carousel: 'Equipe da Bold Studio', previous: 'Integrante anterior', next: 'Próximo integrante', position: (index: number, total: number) => `${index} de ${total}` },
    en: { carousel: 'Bold Studio team', previous: 'Previous team member', next: 'Next team member', position: (index: number, total: number) => `${index} of ${total}` },
    es: { carousel: 'Equipo de Bold Studio', previous: 'Integrante anterior', next: 'Siguiente integrante', position: (index: number, total: number) => `${index} de ${total}` },
  }[lang]

  return (
    <section id="crew" className="crew-section relative overflow-hidden scroll-mt-24 pt-[var(--espaco-secao)] pb-[calc(var(--espaco-secao)+var(--espaco-etiqueta))]">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
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

          <StackedCarousel slides={CREW} labels={labels} renderSlide={m => {
            const info = t.crew.members[m.id]
            return <>
              <img
                className="crew-card__foto"
                src={m.foto}
                alt={m.nome}
                loading="lazy"
                decoding="async"
                draggable={false}
                width={720} height={1080}
              />
              <div className="crew-card__info">
                <span className="crew-card__bar" aria-hidden="true" />
                <h3 className="crew-card__name">{m.nome}</h3>
                <p className="crew-card__role">{info.role}</p>
                <p className="crew-card__desc">{info.desc}</p>
              </div>
            </>
          }} />
        </div>
      </div>

      <div className="crew-sticker absolute bottom-8 left-0">
        <span className="sticker-amarelo inline-block rounded-r-2xl py-2.5 pl-5 pr-8 text-[clamp(1.55rem,4vw,3rem)] font-black italic leading-none tracking-[-0.055em] text-bold-black sm:pr-10">
          BoldCrew
        </span>
      </div>
    </section>
  )
}
