import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { I18nProvider, useI18n } from '@/i18n/I18nContext'
import { IntroBold } from '@/components/IntroBold'
import { StudioVideoBg } from '@/components/StudioVideoBg'
import { ShinyButton } from '@/components/ShinyButton'
import { Header } from '@/components/home/Header'
import { SobreAboutUs } from '@/components/home/SobreAboutUs'
import { CoinDecor } from '@/components/home/CoinDecor'
import { Footer } from '@/components/home/Footer'
import { CrewSticky } from '@/components/home/CrewSticky'
import { ClientesWave } from '@/components/home/ClientesWave'
import { ReelsEspiral } from '@/components/home/ReelsEspiral'
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

        <section id="servicos" data-reveal className="relative mx-auto max-w-5xl scroll-mt-24 overflow-hidden px-6 py-32 text-center">
          <CoinDecor className="-left-10 top-10 w-28 opacity-[0.07] sm:w-40" rotate={-18} floatDuration={9} />
          <CoinDecor className="-right-6 bottom-16 w-16 opacity-20 sm:w-20" rotate={24} floatDuration={6} />
          <p className="text-xs font-bold tracking-wider text-bold-yellow">{t.servicos.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">{t.servicos.title}</h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.servicos.items.map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-left transition-colors hover:border-bold-yellow/40">
                <span className="text-sm font-semibold text-bold-white/85">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <CrewSticky />

        <ClientesWave />

        <ReelsEspiral />

        <section id="contato" data-reveal className="relative flex scroll-mt-24 flex-col items-center overflow-hidden px-6 py-32">
          <CoinDecor className="right-4 top-16 w-20 opacity-15 sm:right-16 sm:w-28" rotate={16} floatDuration={8} />
          <CoinDecor className="left-6 bottom-24 hidden w-14 opacity-20 sm:block" rotate={-12} floatDuration={6} />
          <p className="text-xs font-bold tracking-wider text-bold-yellow">{t.contato.eyebrow}</p>
          <h2 className="mt-3 text-center text-3xl font-bold md:text-4xl">{t.contato.title}</h2>
          <div className="mt-10 w-full max-w-2xl">
            <ContactForm />
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
