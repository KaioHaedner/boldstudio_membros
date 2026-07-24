import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { I18nProvider, useI18n } from '@/i18n/I18nContext'
import { IntroBold } from '@/components/IntroBold'
import { StudioVideoBg } from '@/components/StudioVideoBg'
import { ShinyButton } from '@/components/ShinyButton'
import { Header } from '@/components/home/Header'
import { SobreAboutUs, renderHighlighted } from '@/components/home/SobreAboutUs'
import { SolucoesSticky } from '@/components/home/SolucoesSticky'
import { ProcessoTimeline } from '@/components/home/ProcessoTimeline'
import { CoinDecor } from '@/components/home/CoinDecor'
import { Footer } from '@/components/home/Footer'
import { CrewSticky } from '@/components/home/CrewSticky'
import { ClientesWave } from '@/components/home/ClientesWave'
import { CasesAbertura } from '@/components/home/CasesAbertura'
import { AcademySection } from '@/components/home/AcademySection'
import { CasesCarrossel } from '@/components/home/CasesCarrossel'
import { ContactForm } from '@/components/home/ContactForm'
import { RecIAWidget } from '@/components/home/RecIAWidget'
import { QuickNav } from '@/components/home/QuickNav'

function HomeContent() {
  const { t } = useI18n()
  const rootRef = useRef<HTMLDivElement>(null)
  // A intro toca na primeira visita da sessao. So nesse caso o conteudo entra
  // com slide-up ao final dela; em navegacoes seguintes a home aparece direto.
  const [introAtiva] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return !sessionStorage.getItem('bold_intro_exibida')
    } catch {
      return false
    }
  })
  const [revelar, setRevelar] = useState(!introAtiva)

  const mainClass = !introAtiva
    ? 'relative z-10'
    : revelar
      ? 'relative z-10 home-revelar'
      : 'relative z-10 home-oculto'

  useEffect(() => {
    const sections = rootRef.current?.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!sections) return

    const triggers = Array.from(sections).map((section) =>
      gsap.fromTo(
        section,
        { autoAlpha: 0, y: 48 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          },
        }
      )
    )

    return () => {
      triggers.forEach((tween) => tween.scrollTrigger?.kill())
      ScrollTrigger.refresh()
    }
  }, [])

  // Quando a intro termina e o conteudo e revelado (slide-up de 900ms), o layout
  // final so fica estavel ao fim da animacao. Recalcula todos os ScrollTriggers
  // (pin do Crew etc.) pra nao ficarem com medidas antigas — era o bug que
  // exigia refresh manual na primeira carga.
  useEffect(() => {
    if (!revelar) return
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 1000)
    return () => window.clearTimeout(id)
  }, [revelar])

  return (
    <div ref={rootRef} className="relative isolate min-h-screen bg-bold-black text-bold-white">
      <IntroBold onFinish={() => setRevelar(true)} />
      <Header />

      <main className={mainClass}>
        <section id="home" className="home-hero relative flex min-h-screen scroll-mt-24 items-stretch overflow-hidden px-5 pb-12 pt-28 sm:px-8 sm:pb-16 md:pb-40 lg:px-12">
          <StudioVideoBg className="home-hero__video" />
          <div className="home-hero__overlay absolute inset-0" aria-hidden="true" />
          <CoinDecor className="left-6 top-1/3 z-[1] w-20 opacity-15 sm:left-12 sm:w-28" rotate={-14} floatDuration={8} />

          <div className="relative z-10 flex w-full flex-col text-center md:text-right">
            <div>
              {/* Eyebrow "SINOP, MT · ..." fica so no desktop (no mobile o titulo vai colado no topo) */}
              <p className="hidden text-xs font-bold uppercase tracking-[0.3em] text-bold-yellow md:block md:text-sm">{t.hero.eyebrow}</p>
              <h1 className="mx-auto mt-0 max-w-6xl text-[6.2vw] font-black uppercase leading-[0.9] tracking-[-0.03em] md:mr-0 md:mt-4 md:text-[clamp(2rem,4.2vw,4.2rem)]">
                {t.hero.titleA}
                {/* No mobile "Entregamos resultados" fica na mesma linha; no desktop mantem 3 linhas */}
                <br className="hidden md:block" />
                <span className="text-bold-yellow">{t.hero.titleHighlight}</span>
                <br />
                {t.hero.titleB}
              </h1>
            </div>
            {/* Texto de apoio: no mobile desce pro fim (mt-auto) perto dos CTAs, com efeito da marca */}
            <div className="mt-auto mb-20 flex justify-center md:mb-0 md:justify-end">
              <p className="max-w-md rounded-xl border border-bold-yellow/25 bg-black/50 px-4 py-3 text-[11px] font-medium leading-relaxed text-bold-white shadow-[0_0_25px_-10px_rgba(255,215,18,0.55)] backdrop-blur-md md:text-sm">
                {renderHighlighted(t.hero.subtitle)}
              </p>
            </div>
          </div>

          {/* CTAs colados na base, canto inferior esquerdo */}
          <div className="absolute bottom-7 left-5 z-[90] flex flex-wrap items-center gap-x-7 gap-y-4 sm:left-8 lg:left-12">
            <ShinyButton onClick={() => document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
              {t.hero.ctaPrimary}
            </ShinyButton>
            <button
              type="button"
              onClick={() => document.querySelector('#clientes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="group hidden items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-bold-white transition-colors hover:text-bold-yellow md:inline-flex"
            >
              {t.hero.ctaSecondary}
              <span className="text-bold-yellow transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </button>
          </div>
        </section>

        <SobreAboutUs />

        <SolucoesSticky />

        <CrewSticky />

        <CasesAbertura />

        <CasesCarrossel />

        <ClientesWave />

        <ProcessoTimeline />

        {/* Statement — "Nascida para ganhar o Brasil" em seção própria */}
        <section
          id="nascida-brasil"
          data-reveal
          className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-bold-black px-6 pb-44 pt-24 text-center"
        >
          <CoinDecor className="left-8 top-16 z-[1] w-20 opacity-15 sm:w-28" rotate={-14} floatDuration={8} />
          <CoinDecor className="right-8 bottom-20 z-[1] hidden w-16 opacity-15 sm:block sm:w-24" rotate={16} floatDuration={6} />

          <h2 className="relative z-10 text-[45px] font-extrabold leading-[0.95] text-bold-white sm:text-[54px] md:text-[72px] lg:text-[96px]">
            {t.nascida.lineA}
          </h2>
          <span className="live-yellow relative z-10 mt-4 inline-block rounded-xl px-5 py-1.5 text-6xl font-black italic tracking-[-0.03em] text-bold-black sm:text-7xl md:text-8xl lg:text-9xl">
            {t.nascida.highlight}
          </span>
        </section>

        <AcademySection />

        <section id="contato" data-reveal className="relative scroll-mt-24 px-6">
          {/* Fundo: foto de bastidor + overlay pra legibilidade */}
          <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
            <img
              src="/brand/boldstudio-bg.webp"
              alt=""
              className="h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bold-black via-bold-black/85 to-bold-black/45" />
            <div className="absolute inset-0 bg-bold-black/40 md:hidden" />
          </div>

          {/* Coins da marca */}
          <CoinDecor className="right-6 top-12 z-[1] w-20 opacity-25 sm:right-16 sm:w-28" rotate={16} floatDuration={8} />
          <CoinDecor className="left-6 bottom-16 z-[1] hidden w-16 opacity-20 sm:block sm:w-24" rotate={-12} floatDuration={6} />

          {/* Área de conteúdo (altura da tela) */}
          <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 pb-24 pt-32 lg:grid-cols-2 lg:gap-16">
            {/* Esquerda: chamada + apoio */}
            <div className="text-center lg:text-left">
              <h2 className="text-5xl font-bold leading-[1] md:text-6xl">
                {t.contato.headlineA}<span className="text-bold-yellow">{t.contato.headlineHi}</span>.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-bold-white lg:mx-0">
                {t.contato.supportA}
                <span className="lg:hidden">{t.contato.hereMobile}</span>
                <span className="hidden lg:inline">{t.contato.hereDesktop}</span>
                {t.contato.supportB}
              </p>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-bold-white">
                <MapPin size={16} className="text-bold-yellow" /> {t.contato.location}
              </p>
            </div>

            {/* Direita: formulário em glass */}
            <div className="flex justify-center lg:justify-end">
              <ContactForm />
            </div>
          </div>

          {/* Etiqueta amarela sticky com gradiente vivo (estilo BoldCrew/Soluções) */}
          <div className="pointer-events-none sticky bottom-6 z-10 -ml-6">
            <span className="live-yellow inline-block rounded-r-2xl py-2.5 pl-5 pr-8 text-[clamp(1.55rem,4vw,3rem)] font-black italic leading-none tracking-[-0.055em] text-bold-black sm:pr-10">
              {t.contato.eyebrow}
            </span>
          </div>
        </section>
      </main>

      <Footer />
      <RecIAWidget />
      <QuickNav />
    </div>
  )
}

export function HomeInstitucionalPage() {
  return (
    <I18nProvider>
      <HomeContent />
    </I18nProvider>
  )
}
