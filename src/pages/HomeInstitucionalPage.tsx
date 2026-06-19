import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
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

export function HomeInstitucionalPage() {
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

  return (
    <div ref={rootRef} className="relative isolate min-h-screen text-bold-white">
      <IntroBold onFinish={() => setRevelar(true)} />
      <StarfieldBackground />
      <Header />

      <main className={mainClass}>
        <section id="home" className="flex min-h-screen scroll-mt-24 flex-col items-center justify-center px-6 text-center">
          <p className="text-xs tracking-[0.3em] text-bold-yellow md:text-sm">SINOP, MT · PRODUTORA AUDIOVISUAL</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl">
            Entregamos <span className="text-bold-yellow">resultados</span>,
            <br className="hidden sm:block" /> não vídeos.
          </h1>
          <p className="mt-7 max-w-xl text-base text-bold-white/65 md:text-lg">
            Soluções estratégicas de foto e vídeo para empresas, eventos e marcas. Atuamos no Agro,
            na indústria, em produtos e eventos, sempre com foco em resultado e alto padrão visual.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="rounded-lg bg-bold-yellow px-7 py-3 text-sm font-bold text-bold-black transition-transform hover:scale-105"
            >
              Bora gravar com a Bold
            </button>
            <button
              type="button"
              onClick={() => document.querySelector('#clientes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="rounded-lg border border-bold-white/20 px-7 py-3 text-sm font-bold text-bold-white transition-colors hover:border-bold-yellow/60 hover:text-bold-yellow"
            >
              Ver nossos cases
            </button>
          </div>
        </section>

        <section id="sobre" data-reveal className="mx-auto max-w-4xl scroll-mt-24 px-6 py-32 text-center">
          <p className="text-xs font-bold tracking-wider text-bold-yellow">Sobre o estúdio</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Quem é a BoldStudio</h2>
          <p className="mx-auto mt-5 max-w-2xl text-bold-white/65">
            Somos uma produtora audiovisual especializada em soluções estratégicas de foto e vídeo
            para empresas, eventos e marcas. Seja no Agro, indústrias, produtos ou eventos, atuamos
            sempre com foco em resultado, eficiência de produção e alto padrão visual.
          </p>
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 text-left sm:grid-cols-2">
            {[
              'Processos claros do briefing à entrega final',
              'Equipe experiente e estrutura própria',
              'Linguagem visual alinhada à sua marca',
              'Compromisso com prazo, qualidade e previsibilidade',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-bold-yellow" aria-hidden="true" />
                <span className="text-sm text-bold-white/80">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="servicos" data-reveal className="mx-auto max-w-5xl scroll-mt-24 px-6 py-32 text-center">
          <p className="text-xs font-bold tracking-wider text-bold-yellow">O que fazemos</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Soluções de ponta a ponta</h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Vídeos publicitários',
              'Vídeos institucionais e corporativos',
              'Vídeos e fotos de produtos e food',
              'Cobertura de eventos',
              'Conteúdo para marketing e redes sociais',
            ].map((item) => (
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
          <p className="text-xs font-bold tracking-wider text-bold-yellow">Contato</p>
          <h2 className="mt-3 text-center text-3xl font-bold md:text-4xl">Vamos gravar algo bold?</h2>
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
