import { useEffect } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ActionArrow as ArrowLeft, ActionArrow as ArrowRight } from '@/shared/components/ActionArrow'
import { Header } from '@/apps/site/components/Header'
import { Footer } from '@/shared/components/Footer'
import { ShinyButton } from '@/shared/components/ShinyButton'
import { CLIENTES } from '@/apps/site/data/clientes'
import { SERVICO_SLUGS, isServicoSlug, type ServicoSlug } from '@/apps/site/data/servicos'
import { I18nProvider, useI18n } from '@/apps/site/i18n/I18nContext'
import { videoPreview } from '@/shared/lib/video-preview'
import { ServiceShowcase, type ServiceFilm } from '@/apps/site/components/ServiceShowcase'
import vtFilms from '@/apps/site/data/vt-films.json'
import serviceFilms from '@/apps/site/data/service-films.json'
import serviceSeo from '@/apps/site/data/service-seo.json'

const HOME = '/home-bold-studio-sinop-brasil'
const machadoLogo = CLIENTES.find(cliente => cliente.slug === 'machado-supermercados')?.logo
const unimedLogo = CLIENTES.find(cliente => cliente.slug === 'unimed')?.logo
const logoFor = (slug: string) => CLIENTES.find(cliente => cliente.slug === slug)?.logo
const paired = (film: Omit<ServiceFilm, 'format'>): ServiceFilm[] => [
  { ...film, format: 'vertical' }, { ...film, format: 'horizontal' },
]
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
  institucionais: [
    ...paired({ ...serviceFilms['agrobaggio-institucional'], logo: logoFor('agro-baggio-john-deere') }),
    ...paired(serviceFilms['fazcarnes-institucional']),
    ...paired(serviceFilms['mascarello-guerra-institucional']),
  ],
  eventos: [
    ...paired({ ...serviceFilms['exponorte-2026-aftermovie'], logo: logoFor('exponorte') }),
    ...paired({ ...serviceFilms['agrobaggio-confraternizacao-sorriso'], logo: logoFor('agro-baggio-john-deere'), caption: 'Confraternização em Sorriso' }),
    ...paired({ ...serviceFilms['agrobaggio-resumo-feira-dia-5'], logo: logoFor('agro-baggio-john-deere'), caption: 'Resumo da feira' }),
  ],
  'food-produto': [
    ...paired({ ...serviceFilms['forteza-filme-produto'], logo: logoFor('forteza') }),
    ...paired(serviceFilms['louvada-weis-filme-produto']),
    ...paired(serviceFilms['mangut-fit-batata-doce']),
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
  useEffect(() => {
    if (!isServicoSlug(slug)) return
    const seo = serviceSeo[slug]
    const previousTitle = document.title
    const oldDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const oldCanonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const description = oldDescription ?? document.createElement('meta')
    const canonical = oldCanonical ?? document.createElement('link')
    const previousDescription = description.content
    const previousCanonical = canonical.getAttribute('href')
    const directServiceEntry = previousCanonical?.startsWith('https://boldstudiobrasil.com/servico/')
    // Static HTML supplies metadata before JS; the mounted player supplies the live schema.
    document.head.querySelector('script[data-service-videos]')?.remove()
    description.name = 'description'; canonical.rel = 'canonical'
    description.content = seo.description
    canonical.href = `https://boldstudiobrasil.com/servico/${slug}`
    document.title = seo.title
    if (!oldDescription) document.head.append(description)
    if (!oldCanonical) document.head.append(canonical)
    return () => {
      document.title = directServiceEntry ? 'Bold Studio Brasil, produtora audiovisual em Sinop MT' : previousTitle
      if (oldDescription) description.content = directServiceEntry ? 'Produtora audiovisual em Sinop, Mato Grosso, nascida no agro e na indústria para transformar vídeo institucional e evento em resultado para a sua marca.' : previousDescription; else description.remove()
      if (oldCanonical && previousCanonical) canonical.setAttribute('href',directServiceEntry ? 'https://boldstudiobrasil.com/home-bold-studio-sinop-brasil' : previousCanonical); else canonical.remove()
    }
  }, [slug])
  if (!isServicoSlug(slug)) return <Navigate to={HOME} replace />
  const produto = t.servicos.produtos[SERVICO_SLUGS.indexOf(slug)]
  const pagina = t.servicoPaginas
  const conteudo = pagina.itens[slug]
  const cta = lang === 'pt' ? 'Vem gravar com a Bold' : lang === 'en' ? 'Come shoot with Bold' : 'Ven a grabar con Bold'
  return <div className="bold-editorial bold-editorial--service min-h-screen bg-bold-black text-bold-white">
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
      <ServiceShowcase key={slug} films={SERVICE_FILMS[slug] ?? EXISTING_EXAMPLES} title={pagina.exemplosTitulo} pageUrl={`https://boldstudiobrasil.com/servico/${slug}`} />
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
