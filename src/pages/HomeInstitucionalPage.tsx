import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { Header } from '@/components/home/Header'
import { Footer } from '@/components/home/Footer'
import { StarfieldBackground } from '@/components/home/StarfieldBackground'
import { ContactForm } from '@/components/home/ContactForm'
import { RecIAWidget } from '@/components/home/RecIAWidget'

export function HomeInstitucionalPage() {
  const rootRef = useRef<HTMLDivElement>(null)

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
    <div ref={rootRef} className="relative min-h-screen text-bold-white">
      <StarfieldBackground />
      <Header />

      <main className="relative z-10">
        <section id="home" className="flex min-h-screen scroll-mt-24 flex-col items-center justify-center px-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-bold-yellow">Sinop, MT</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Hero em construção: intro 3-2-1 + loadbar entram na próxima etapa
          </h1>
          <p className="mt-6 max-w-xl text-bold-white/60">
            Estrutura, navegação e efeitos de base já no lugar. Conteúdo real (fotos, vídeos e textos do estúdio) entra nas próximas fases.
          </p>
        </section>

        <section id="sobre" data-reveal className="mx-auto max-w-4xl scroll-mt-24 px-6 py-32 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-bold-yellow">Sobre o estúdio</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Quem é a BoldStudio</h2>
          <p className="mx-auto mt-5 max-w-2xl text-bold-white/60">
            Espaço reservado pro texto institucional real do estúdio (equipamento, história, diferencial em Sinop).
          </p>
        </section>

        <section id="servicos" data-reveal className="mx-auto max-w-5xl scroll-mt-24 px-6 py-32 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-bold-yellow">Serviços</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">O que o estúdio oferece</h2>
          <p className="mx-auto mt-5 max-w-2xl text-bold-white/60">
            Aqui entra o scroll horizontal com demo reel e logos de empresas/clientes (fase seguinte).
          </p>
        </section>

        <section id="crew" data-reveal className="mx-auto max-w-5xl scroll-mt-24 px-6 py-32 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-bold-yellow">Crew</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Quem faz a BoldStudio acontecer</h2>
          <p className="mx-auto mt-5 max-w-2xl text-bold-white/60">
            Aqui entra a galeria com efeito de hover/reveal por cima das imagens (depende de fotos reais da equipe).
          </p>
        </section>

        <section id="clientes" data-reveal className="mx-auto max-w-5xl scroll-mt-24 px-6 py-32 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-bold-yellow">Clientes</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Marcas que a BoldStudio já atendeu</h2>
          <p className="mx-auto mt-5 max-w-2xl text-bold-white/60">
            Aqui entra o efeito 3D em colmeia/cone com Three.js (depende dos vídeos/cases reais).
          </p>
        </section>

        <section id="contato" data-reveal className="flex scroll-mt-24 flex-col items-center px-6 py-32">
          <p className="text-xs font-bold uppercase tracking-wider text-bold-yellow">Contato</p>
          <h2 className="mt-3 text-center text-3xl font-bold md:text-4xl">Vamos gravar algo bold?</h2>
          <div className="mt-10">
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
      <RecIAWidget />
    </div>
  )
}
