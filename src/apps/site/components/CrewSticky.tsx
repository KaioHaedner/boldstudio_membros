import { CrewRail } from '@/shared/components/ui/CrewRail'
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

// Desktop percorre a equipe pelo scroll; mobile usa uma faixa nativa.
export function CrewSticky() {
  const { t, lang } = useI18n()
  const labels = {
    pt: { carousel: 'Equipe da Bold Studio', previous: 'Integrante anterior', next: 'Próximo integrante', position: (index: number, total: number) => `${index} de ${total}` },
    en: { carousel: 'Bold Studio team', previous: 'Previous team member', next: 'Next team member', position: (index: number, total: number) => `${index} of ${total}` },
    es: { carousel: 'Equipo de Bold Studio', previous: 'Integrante anterior', next: 'Siguiente integrante', position: (index: number, total: number) => `${index} de ${total}` },
  }[lang]

  return (
    <section id="crew" className="crew-section crew-section--horizontal relative scroll-mt-24">
      <CrewRail label={labels.carousel} heading={
          <div className="crew-horizontal__heading">
            <div className="crew-horizontal__banner" aria-hidden="true">TIME BOLD</div>
            <div className="crew-horizontal__intro">
            <h2>
              {t.crew.ctaTextA}
              <span className="text-bold-yellow">{t.crew.ctaTextHighlight}</span>
              {t.crew.ctaTextB}
            </h2>
            <p>{lang === 'pt' ? 'Diferentes olhares. Um time que transforma ideias em histórias.' : lang === 'en' ? 'Different perspectives. One team turning ideas into stories.' : 'Diferentes miradas. Un equipo que convierte ideas en historias.'}</p>
            <span className="crew-horizontal__hint" aria-hidden="true">{lang === 'pt' ? 'Conheça quem faz acontecer' : lang === 'en' ? 'Meet the team' : 'Conoce al equipo'} →</span>
            </div>
          </div>
      }>
          {CREW.map(m => {
            const info = t.crew.members[m.id]
            return <article key={m.id} className="crew-card crew-horizontal__card" tabIndex={0}>
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
            </article>
          })}
      </CrewRail>
    </section>
  )
}
