import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { I18nProvider, useI18n } from '@/i18n/I18nContext'
import { IntroBold } from '@/components/IntroBold'
import { StudioVideoBg } from '@/components/StudioVideoBg'
import { ShinyButton } from '@/components/ShinyButton'
import { Header } from '@/components/home/Header'
import { SobreAboutUs } from '@/components/home/SobreAboutUs'
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
        <section id="home" className="home-hero relative flex min-h-screen scroll-mt-24 items-center overflow-hidden px-5 pb-12 pt-28 sm:px-8 sm:pb-16 md:items-stretch md:pb-40 lg:px-12">
          <StudioVideoBg className="home-hero__video" />
          <div className="home-hero__overlay absolute inset-0" aria-hidden="true" />
          <CoinDecor className="left-6 top-1/3 z-[1] w-20 opacity-15 sm:left-12 sm:w-28" rotate={-14} floatDuration={8} />

          <div className="relative z-10 flex w-full flex-col -translate-y-[5svh] text-center md:translate-y-0 md:text-right">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-bold-yellow md:text-sm">{t.hero.eyebrow}</p>
              <h1 className="mx-auto mt-4 max-w-6xl text-[clamp(2rem,4.2vw,4.2rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] md:mr-0">
                {t.hero.titleA}
                <br />
                <span className="text-bold-yellow">{t.hero.titleHighlight}</span>
                <br />
                {t.hero.titleB}
              </h1>
            </div>
            <div className="mt-7 flex justify-center md:mt-auto md:justify-end">
              <p className="max-w-md rounded-xl border border-white/10 bg-black/45 px-4 py-3 text-xs font-medium text-bold-white backdrop-blur-md sm:text-sm">{t.hero.subtitle}</p>
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
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-bold-white transition-colors hover:text-bold-yellow"
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
                Sua marca merece <span className="text-bold-yellow">resultado</span>.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-bold-white/75 lg:mx-0">
                Toda marca carrega uma história pronta pra virar resultado e o audiovisual
                certo é o que faz isso acontecer, então preenche seus dados{' '}
                <span className="lg:hidden">aqui embaixo</span>
                <span className="hidden lg:inline">aqui do lado</span> e se quiser manda um
                áudio contando seu projeto que a nossa IA transcreve pra você
              </p>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-bold-white/60">
                <MapPin size={16} className="text-bold-yellow" /> Sinop, MT · Produtora Audiovisual
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
