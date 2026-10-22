import { useEffect } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Header } from '@/apps/site/components/Header'
import { Footer } from '@/shared/components/Footer'
import { ShinyButton } from '@/shared/components/ShinyButton'
import { CLIENTES } from '@/apps/site/data/clientes'
import { SERVICO_SLUGS, isServicoSlug, type ServicoSlug } from '@/apps/site/data/servicos'
import { I18nProvider, useI18n } from '@/apps/site/i18n/I18nContext'
import { videoPreview } from '@/shared/lib/video-preview'
import { ServiceShowcase, type ServiceFilm } from '@/apps/site/components/ServiceShowcase'
import vtFilms from '@/apps/site/data/vt-films.json'

const HOME = '/home-bold-studio-sinop-brasil'
const machadoLogo = CLIENTES.find(cliente => cliente.slug === 'machado-supermercados')?.logo
const unimedLogo = CLIENTES.find(cliente => cliente.slug === 'unimed')?.logo
// New service-specific films are assigned here after receiving the files.
const SERVICE_FILMS: Partial<Record<ServicoSlug, ServiceFilm[]>> = {
  'vt-comercial': [
    { ...vtFilms['machado-vertical'], logo: machadoLogo, format: 'vertical' },
    { ...vtFilms.unimed, logo: unimedLogo, format: 'vertical' },
    { ...vtFilms['mascarello-guerra'], format: 'vertical' },
    { ...vtFilms['machado-horizontal'], logo: machadoLogo, format: 'horizontal' },
    { ...vtFilms.unimed, logo: unimedLogo, format: 'horizontal' },
    { ...vtFilms['mascarello-guerra'], format: 'horizontal' },
  ],
}
// Retain the existing examples until the service's own films are supplied.
const EXISTING_EXAMPLES: ServiceFilm[] = CLIENTES.filter(c => c.videos.length > 0).slice(0, 3).flatMap(c => {
  const preview = videoPreview(c.videos[0])
  return preview ? [{ id: c.slug, title: c.nome, logo: c.logo, poster: c.logo, src: preview, format: 'horizontal' as const }] : []
})

function ServicoConteudo() {
  const { slug } = useParams<{ slug: string }>()
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  useEffect(() => { window.scrollTo(0, 0) }, [slug])
  if (!isServicoSlug(slug)) return <Navigate to={HOME} replace />
  const produto = t.servicos.produtos[SERVICO_SLUGS.indexOf(slug)]
  const pagina = t.servicoPaginas
  const conteudo = pagina.itens[slug]
  const cta = lang === 'pt' ? 'Vem gravar com a Bold' : lang === 'en' ? 'Come shoot with Bold' : 'Ven a grabar con Bold'
  return <div className="min-h-screen bg-bold-black text-bold-white">
    <Header />
    <main className="service-page">
      <div className="service-page__container">
        <Link to={`${HOME}#servicos`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-white/60 hover:text-bold-yellow">
          <ArrowLeft size={16} />{pagina.voltar}
        </Link>
        <div className="service-page__intro">
          <div>
            <h1>{produto.nome}</h1>
            <p className="service-page__tagline">{conteudo.chamada}</p>
          </div>
          <div className="service-page__description">
            {conteudo.paragrafos.map(paragrafo => <p key={paragrafo}>{paragrafo}</p>)}
          </div>
        </div>
        <section className="service-page__deliverables">
          <h2 className="text-sm font-bold uppercase tracking-[.25em]">{pagina.entregaTitulo}</h2>
          <ul>
            {conteudo.entregaveis.map(item => <li key={item}><ArrowRight size={18} strokeWidth={3} aria-hidden="true" />{item}</li>)}
          </ul>
        </section>
      </div>
      <ServiceShowcase key={slug} films={SERVICE_FILMS[slug] ?? EXISTING_EXAMPLES} title={pagina.exemplosTitulo} />
      <section className="service-page__cta">
        <p>{pagina.ctaTexto}</p>
        <ShinyButton className="shiny-cta--grande service-page__cta-button" onClick={() => navigate(`${HOME}#contato`)}>{cta}</ShinyButton>
      </section>
    </main>
    <Footer />
  </div>
}

export function ServicoPage() {
  return <I18nProvider><ServicoConteudo /></I18nProvider>
}
