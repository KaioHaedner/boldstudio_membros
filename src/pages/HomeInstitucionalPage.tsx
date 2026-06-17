import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { IntroBold } from '@/components/IntroBold'
import { Header } from '@/components/home/Header'
import { Footer } from '@/components/home/Footer'
import { StarfieldBackground } from '@/components/home/StarfieldBackground'
import { CrewSticky } from '@/components/home/CrewSticky'
import { ReelsEspiral } from '@/components/home/ReelsEspiral'
import { ContactForm } from '@/components/home/ContactForm'
import { RecIAWidget } from '@/components/home/RecIAWidget'

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
          <p className="text-sm tracking-[0.3em] text-bold-yellow">Sinop, MT</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Hero em construção: intro 3-2-1 + loadbar entram na próxima etapa
          </h1>
          <p className="mt-6 max-w-xl text-bold-white/60">
            Estrutura, navegação e efeitos de base já no lugar. Conteúdo real (fotos, vídeos e textos do estúdio) entra nas próximas fases.
          </p>
        </section>

        <section id="sobre" data-reveal className="mx-auto max-w-4xl scroll-mt-24 px-6 py-32 text-center">
          <p className="text-xs font-bold tracking-wider text-bold-yellow">Sobre o estúdio</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Quem é a BoldStudio</h2>
          <p className="mx-auto mt-5 max-w-2xl text-bold-white/60">
            Espaço reservado pro texto institucional real do estúdio (equipamento, história, diferencial em Sinop).
          </p>
        </section>

        <section id="servicos" data-reveal className="mx-auto max-w-5xl scroll-mt-24 px-6 py-32 text-center">
          <p className="text-xs font-bold tracking-wider text-bold-yellow">Serviços</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">O que o estúdio oferece</h2>
          <p className="mx-auto mt-5 max-w-2xl text-bold-white/60">
            Aqui entra o scroll horizontal com demo reel e logos de empresas/clientes (fase seguinte).
          </p>
        </section>

        <CrewSticky />

        <section id="clientes" data-reveal className="mx-auto max-w-5xl scroll-mt-24 px-6 py-32 text-center">
          <p className="text-xs font-bold tracking-wider text-bold-yellow">Clientes</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Marcas que a BoldStudio já atendeu</h2>
          <p className="mx-auto mt-4 max-w-xl text-bold-white/60">
            Empresas e parceiros que já confiaram no nosso estúdio.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex aspect-[3/2] items-center justify-center rounded-xl border border-white/10 bg-bold-gray/30 text-xs font-medium uppercase tracking-wider text-bold-white/30"
              >
                Logo
              </div>
            ))}
          </div>
        </section>

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
      <RecIAWidget />
    </div>
  )
}
