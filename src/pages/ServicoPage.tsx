import { useEffect } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/home/Header'
import { Footer } from '@/components/home/Footer'
import { ShinyButton } from '@/components/ShinyButton'
import { CLIENTES } from '@/data/clientes'
import { SERVICO_SLUGS, isServicoSlug } from '@/data/servicos'
import { I18nProvider, useI18n } from '@/i18n/I18nContext'

const HOME = '/home-bold-studio-sinop-brasil'

// Página de um serviço da seção Soluções (/servico/:slug). Explica a linha de
// trabalho e mostra exemplos. Os exemplos hoje reaproveitam os cases que já
// têm vídeo; quando o cliente mandar material específico por serviço, é só
// trocar a origem dessa lista.
const EXEMPLOS = CLIENTES.filter((c) => c.videos.length > 0).slice(0, 3)

function ServicoConteudo() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useI18n()
  const navigate = useNavigate()

  // Página nova sempre abre no topo: sem isso o React Router mantém a posição
  // de scroll de quem veio da home.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!isServicoSlug(slug)) return <Navigate to={HOME} replace />

  const indice = SERVICO_SLUGS.indexOf(slug)
  const produto = t.servicos.produtos[indice]
  const pagina = t.servicoPaginas
  const conteudo = pagina.itens[slug]

  return (
    <div className="min-h-screen bg-bold-black text-bold-white">
      <Header />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-32 sm:pt-40">
        <Link
          to={HOME}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-bold-white/50 transition-colors hover:text-bold-yellow"
        >
          <ArrowLeft size={16} />
          {pagina.voltar}
        </Link>

        <p className="mt-10 text-xs font-bold uppercase tracking-[0.3em] text-bold-yellow">
          {t.servicos.eyebrow}
        </p>
        <h1 className="mt-3 text-[clamp(2.2rem,7vw,4.5rem)] font-black uppercase leading-[0.95] tracking-[-0.03em]">
          {produto.nome}
        </h1>
        <p className="mt-5 max-w-3xl text-[clamp(1.1rem,2.6vw,1.75rem)] font-black uppercase leading-[1.1] tracking-tight text-bold-yellow">
          {conteudo.chamada}
        </p>

        <div className="mt-10 max-w-3xl space-y-5">
          {conteudo.paragrafos.map((paragrafo) => (
            <p key={paragrafo} className="text-base leading-relaxed text-bold-white/70 sm:text-lg">
              {paragrafo}
            </p>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-bold-white/50">
            {pagina.entregaTitulo}
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {conteudo.entregaveis.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-xl border border-bold-yellow/20 bg-bold-gray/40 px-5 py-4 text-sm font-semibold text-bold-white sm:text-base"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-bold-yellow" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-bold-white/50">
            {pagina.exemplosTitulo}
          </h2>
          {EXEMPLOS.length === 0 ? (
            <p className="mt-6 text-base text-bold-white/60">{pagina.exemplosVazio}</p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {EXEMPLOS.map((cliente) => (
                <button
                  key={cliente.slug}
                  type="button"
                  onClick={() => navigate(`/projeto-${cliente.slug}`)}
                  className="group overflow-hidden rounded-2xl border border-bold-yellow/15 bg-bold-gray/40 text-left transition-colors hover:border-bold-yellow/50"
                >
                  <span className="flex h-40 items-center justify-center bg-black/40 p-6">
                    <img
                      src={cliente.logo}
                      alt={cliente.nome}
                      loading="lazy"
                      className="max-h-16 w-auto max-w-[70%] object-contain opacity-70 transition-opacity group-hover:opacity-100"
                    />
                  </span>
                  <span className="block px-5 py-4">
                    <span className="block text-sm font-black uppercase leading-tight text-bold-white">
                      {cliente.nome}
                    </span>
                    {cliente.area && (
                      <span className="mt-1 block text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-bold-white/45">
                        {cliente.area}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="mt-20 flex flex-col items-start gap-6 border-t border-bold-white/10 pt-12">
          <p className="max-w-[18ch] text-[clamp(1.8rem,5vw,3rem)] font-black uppercase leading-[0.95] tracking-[-0.03em]">
            {pagina.ctaTexto}
          </p>
          <ShinyButton onClick={() => navigate(`${HOME}#contato`)}>{pagina.ctaBotao}</ShinyButton>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export function ServicoPage() {
  return (
    <I18nProvider>
      <ServicoConteudo />
    </I18nProvider>
  )
}
