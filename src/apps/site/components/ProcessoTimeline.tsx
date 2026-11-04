import { ShinyButton } from '@/shared/components/ShinyButton'
import { useI18n } from '@/apps/site/i18n/I18nContext'
import { ProcessoJornada } from './ProcessoJornada'

export function ProcessoTimeline() {
  const { t, lang } = useI18n()
  return <section id="processo" className="processo scroll-mt-24">
    <div className="processo__intro" data-reveal>
      <h2 className="processo__title">{t.processo.titleA}<br />{t.processo.titleB}{' '}
        <img className="processo__logo" src="/brand/logo-boldstudio.webp" alt="bold." />{' '}{t.processo.titleC}
      </h2>
    </div>
    <div className="processo__journey-scene">
      <div className="clientes-lateral processo__journey-photo processo__journey-photo--start" aria-hidden="true">
        <img src="/media/backgrounds/boldstudio_lateral_linha_do_tempo_01-d41a90324c5d.webp" alt="" width="500" height="333" loading="lazy" decoding="async" />
      </div>
      <div className="clientes-lateral processo__journey-photo processo__journey-photo--end" aria-hidden="true">
        <img src="/media/backgrounds/boldstudio_lateral_linha_do_tempo_02-d75bf77e37fc.webp" alt="" width="500" height="333" loading="lazy" decoding="async" />
      </div>
      <ProcessoJornada etapas={t.processo.etapas} />
      <div className="clientes-lateral processo__journey-photo processo__journey-photo--middle-right" aria-hidden="true">
        <img src="/media/backgrounds/dsc08726-60583cadae9e.webp" alt="" loading="lazy" decoding="async" />
      </div>
      <div className="clientes-lateral processo__journey-photo processo__journey-photo--middle-left" aria-hidden="true">
        <img src="/media/backgrounds/dsc08119-88e6fb42fc10.webp" alt="" loading="lazy" decoding="async" />
      </div>
    </div>
    <p className="processo__frase" data-reveal>{t.processo.frase}<span className="processo__frase-hi">{t.processo.fraseHi}</span></p>
    <div className="processo__cta" data-reveal>
      <ShinyButton onClick={() => document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
        <span className="hidden sm:inline">{t.processo.ctaButton}</span>
        <span className="whitespace-nowrap sm:hidden">{lang === 'pt' ? 'Quero essa jornada' : lang === 'es' ? 'Quiero este recorrido' : 'I want this journey'}</span>
      </ShinyButton>
    </div>
  </section>
}
