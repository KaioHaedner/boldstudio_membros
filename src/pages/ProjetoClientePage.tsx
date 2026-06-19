import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Globe, Phone, Play } from 'lucide-react'
import { I18nProvider, useI18n } from '@/i18n/I18nContext'
import { LanguageSwitcher } from '@/components/home/LanguageSwitcher'
import { StarfieldBackground } from '@/components/home/StarfieldBackground'
import { getClienteBySlug, type Cliente } from '@/data/clientes'

// Mockup de celular com um reel rodando em loop cortado em 10s.
function PhoneReel({ src }: { src: string }) {
  return (
    <div className="relative aspect-[9/19] w-[160px] shrink-0 overflow-hidden rounded-[1.8rem] border-[5px] border-bold-gray bg-black shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] sm:w-[180px]">
      <div className="absolute left-1/2 top-2 z-10 h-3.5 w-16 -translate-x-1/2 rounded-full bg-bold-gray" aria-hidden="true" />
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        onTimeUpdate={(e) => {
          if (e.currentTarget.currentTime >= 10) e.currentTarget.currentTime = 0
        }}
        className="h-full w-full object-cover"
      />
    </div>
  )
}

function ProjetoContent({ cliente }: { cliente: Cliente }) {
  const { t } = useI18n()

  return (
    <div className="relative isolate min-h-screen text-bold-white">
      <StarfieldBackground />

      {/* topo: voltar + seletor de idioma */}
      <header className="fixed inset-x-0 top-4 z-50 mx-auto flex max-w-5xl items-center justify-between px-4">
        <Link
          to="/home-bold-studio-sinop-brasil"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-bold-gray/40 px-3.5 py-2 text-sm font-medium text-bold-white/85 backdrop-blur-xl transition-colors hover:border-bold-yellow/50 hover:text-bold-yellow"
        >
          <ArrowLeft size={16} /> {t.projeto.back}
        </Link>
        <LanguageSwitcher />
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-28 pt-32">
        {/* hero: logo + nome + segmento + contato */}
        <section className="flex flex-col items-center text-center">
          <div className="flex h-28 w-64 items-center justify-center">
            <img src={cliente.logo} alt={cliente.nome} className="max-h-full max-w-full object-contain" />
          </div>
          <h1 className="mt-8 text-4xl font-black uppercase tracking-tight md:text-6xl">{cliente.nome}</h1>
          {cliente.area && (
            <h2 className="mt-3 text-sm font-bold uppercase tracking-[0.25em] text-bold-yellow md:text-base">
              {cliente.area}
            </h2>
          )}

          {(cliente.telefone || cliente.site) && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {cliente.telefone && (
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-bold-white/80">
                  <Phone size={15} className="text-bold-yellow" /> {cliente.telefone}
                </span>
              )}
              {cliente.site && (
                <a
                  href={cliente.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-bold-white/80 transition-colors hover:border-bold-yellow/60 hover:text-bold-yellow"
                >
                  <Globe size={15} className="text-bold-yellow" /> {t.projeto.visitSite}
                </a>
              )}
            </div>
          )}
        </section>

        {/* demoreel: video em destaque, player dentro do site */}
        {cliente.videos[0] && (
          <section className="mt-20">
            <p className="text-xs font-bold uppercase tracking-wider text-bold-yellow">{t.projeto.demoreelTitle}</p>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/60">
              <video
                src={cliente.videos[0]}
                controls
                playsInline
                poster=""
                className="aspect-video w-full object-cover"
              />
            </div>
          </section>
        )}

        {/* reels do projeto em mockups de celular */}
        <section className="mt-20">
          <p className="text-xs font-bold uppercase tracking-wider text-bold-yellow">{t.projeto.reelsTitle}</p>
          {cliente.videos.length > 0 ? (
            <div className="mt-6 flex flex-wrap justify-center gap-6">
              {cliente.videos.map((v) => (
                <PhoneReel key={v} src={v} />
              ))}
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] py-16 text-bold-white/40">
              <Play size={28} className="text-bold-yellow/60" />
              <span className="text-sm">{t.projeto.reelsSoon}</span>
            </div>
          )}
        </section>

        {/* depoimento */}
        {cliente.depoimento && (
          <section className="mt-20">
            <p className="text-xs font-bold uppercase tracking-wider text-bold-yellow">{t.projeto.testimonialTitle}</p>
            <blockquote className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-7 md:p-9">
              <p className="text-lg font-medium leading-relaxed text-bold-white/90 md:text-xl">
                “{cliente.depoimento.texto}”
              </p>
              <footer className="mt-5 text-sm font-bold text-bold-yellow">— {cliente.depoimento.autor}</footer>
            </blockquote>
          </section>
        )}

        {/* galeria de eventos com hover bold */}
        <section className="mt-20">
          <p className="text-xs font-bold uppercase tracking-wider text-bold-yellow">{t.projeto.eventsTitle}</p>
          {cliente.eventos && cliente.eventos.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cliente.eventos.map((img, i) => (
                <div key={img} className="group relative aspect-[4/5] overflow-hidden rounded-lg">
                  <img
                    src={img}
                    alt={`${cliente.nome} — ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-lg font-black uppercase tracking-tight text-bold-white">{cliente.nome}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 flex items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] py-16 text-sm text-bold-white/40">
              {t.projeto.eventsSoon}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="mt-24 flex flex-col items-center gap-5 text-center">
          <p className="max-w-md text-2xl font-bold md:text-3xl">{t.projeto.ctaText}</p>
          <Link
            to="/home-bold-studio-sinop-brasil#contato"
            className="inline-flex items-center gap-2 rounded-lg bg-bold-yellow px-7 py-3 text-sm font-bold text-bold-black transition-transform hover:scale-105"
          >
            {t.projeto.ctaButton} <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    </div>
  )
}

function ProjetoNotFound() {
  const { t } = useI18n()
  return (
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center px-6 text-center text-bold-white">
      <StarfieldBackground />
      <h1 className="relative z-10 text-3xl font-black uppercase md:text-5xl">{t.projeto.notFoundTitle}</h1>
      <p className="relative z-10 mt-4 text-bold-white/60">{t.projeto.notFoundText}</p>
      <Link
        to="/home-bold-studio-sinop-brasil#clientes"
        className="relative z-10 mt-8 inline-flex items-center gap-2 rounded-lg bg-bold-yellow px-6 py-3 text-sm font-bold text-bold-black transition-transform hover:scale-105"
      >
        <ArrowLeft size={16} /> {t.projeto.notFoundBack}
      </Link>
    </div>
  )
}

export function ProjetoClientePage() {
  const { projetoSlug } = useParams()
  const slug = projetoSlug?.startsWith('projeto-') ? projetoSlug.slice('projeto-'.length) : undefined
  const cliente = slug ? getClienteBySlug(slug) : undefined

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [projetoSlug])

  return (
    <I18nProvider>{cliente ? <ProjetoContent cliente={cliente} /> : <ProjetoNotFound />}</I18nProvider>
  )
}
