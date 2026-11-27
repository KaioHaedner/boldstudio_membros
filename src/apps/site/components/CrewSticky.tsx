import { CrewRail } from '@/shared/components/ui/CrewRail'
import { ArrowRight } from 'lucide-react'
import { DragHint } from './DragHint'
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

// Mouse drag on desktop and native horizontal touch on mobile.
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
            <h2 className="crew-horizontal__title" aria-label={lang === 'pt' ? 'Conheça o Crew da Bold' : lang === 'en' ? 'Meet the Crew at Bold' : 'Conoce al Crew de Bold'}>
              <span className="crew-horizontal__title-line">{lang === 'pt' ? 'Conheça o' : lang === 'en' ? 'Meet the' : 'Conoce al'}</span>
              <span className="crew-horizontal__title-line"><span className="text-bold-yellow">Crew</span>{' '}<span>{lang === 'pt' ? 'da' : lang === 'en' ? 'at' : 'de'}</span>{' '}<img src="/brand/logo-boldstudio.webp" alt="Bold" className="crew-horizontal__title-logo" width={600} height={220} /></span>
            </h2>
            <p className="crew-horizontal__support">{lang === 'pt' ? 'Um time que transforma ideias em histórias.' : lang === 'en' ? 'One team turning ideas into stories.' : 'Un equipo que convierte ideas en historias.'}</p>
            <span className="crew-horizontal__hint">{lang === 'pt' ? 'Conheça quem faz acontecer' : lang === 'en' ? 'Meet the team' : 'Conoce al equipo'} <ArrowRight aria-hidden="true" /></span>
            </div>
            <DragHint label={lang === 'pt' ? 'Deslize para o lado ou clique e arraste com o mouse para conhecer a equipe' : lang === 'en' ? 'Swipe sideways or click and drag to meet the team' : 'Desliza hacia un lado o haz clic y arrastra para conocer al equipo'} />
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
