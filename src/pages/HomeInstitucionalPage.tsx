import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { I18nProvider, useI18n } from '@/i18n/I18nContext'
import { IntroBold } from '@/components/IntroBold'
import { Header } from '@/components/home/Header'
import { Footer } from '@/components/home/Footer'
import { StarfieldBackground } from '@/components/home/StarfieldBackground'
import { CrewSticky } from '@/components/home/CrewSticky'
import { ClientesWave } from '@/components/home/ClientesWave'
import { ReelsEspiral } from '@/components/home/ReelsEspiral'
import { ContactForm } from '@/components/home/ContactForm'
import { RecIAWidget } from '@/components/home/RecIAWidget'
import { QuickNav } from '@/components/home/QuickNav'
import { BottomBlur } from '@/components/home/BottomBlur'

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
    <div ref={rootRef} className="relative isolate min-h-screen text-bold-white">
      <IntroBold onFinish={() => setRevelar(true)} />
      <StarfieldBackground />
      <Header />

      <main className={mainClass}>
        <section id="home" className="flex min-h-screen scroll-mt-24 flex-col items-center justify-center px-6 text-center">
          <p className="text-xs tracking-[0.3em] text-bold-yellow md:text-sm">{t.hero.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl">
            {t.hero.titleA}
            <span className="text-bold-yellow">{t.hero.titleHighlight}</span>
            {t.hero.titleB}
          </h1>
          <p className="mt-7 max-w-xl text-base text-bold-white/65 md:text-lg">{t.hero.subtitle}</p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="rounded-lg bg-bold-yellow px-7 py-3 text-sm font-bold text-bold-black transition-transform hover:scale-105"
            >
              {t.hero.ctaPrimary}
            </button>
            <button
              type="button"
              onClick={() => document.querySelector('#clientes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="rounded-lg border border-bold-white/20 px-7 py-3 text-sm font-bold text-bold-white transition-colors hover:border-bold-yellow/60 hover:text-bold-yellow"
            >
              {t.hero.ctaSecondary}
            </button>
          </div>
        </section>

        <section id="sobre" data-reveal className="mx-auto max-w-4xl scroll-mt-24 px-6 py-32 text-center">
          <p className="text-xs font-bold tracking-wider text-bold-yellow">{t.sobre.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">{t.sobre.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-bold-white/65">{t.sobre.body}</p>
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 text-left sm:grid-cols-2">
            {t.sobre.diffs.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-bold-yellow" aria-hidden="true" />
                <span className="text-sm text-bold-white/80">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="servicos" data-reveal className="mx-auto max-w-5xl scroll-mt-24 px-6 py-32 text-center">
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

        <section id="contato" data-reveal className="flex scroll-mt-24 flex-col items-center px-6 py-32">
          <p className="text-xs font-bold tracking-wider text-bold-yellow">{t.contato.eyebrow}</p>
          <h2 className="mt-3 text-center text-3xl font-bold md:text-4xl">{t.contato.title}</h2>
          <div className="mt-10 w-full max-w-2xl">
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
      <BottomBlur />
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
