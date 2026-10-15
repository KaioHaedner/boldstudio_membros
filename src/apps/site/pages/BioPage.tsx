import { useEffect, useState } from 'react'
import { ArrowUpRight, Clapperboard, Mail } from 'lucide-react'
import clientLogos from '@/apps/site/data/client-logos.json'
import { FooterWordmark } from '@/apps/site/components/FooterWordmark'
import { BOLD_WHATSAPP } from '@/shared/lib/whatsapp'

const BIO_URL = window.location.hostname === 'bio.boldstudiobrasil.com'
  ? 'https://bio.boldstudiobrasil.com/'
  : `${window.location.origin}/bio`
const SITE = 'https://boldstudiobrasil.com/home-bold-studio-sinop-brasil'
const WHATSAPP = `https://wa.me/${BOLD_WHATSAPP}?text=${encodeURIComponent('Olá, Bold Studio! Vim pelo link da bio e quero gravar com a Bold.')}`
const FEATURED = ['unimed', 'paiol-agricola', 'machado-supermercados', 'exponorte', 'grupo-sinop', 'mado-burguer'] as const
const LOGOS = FEATURED.map((id) => ({ id, src: clientLogos[id].src, alt: id.replaceAll('-', ' ') }))
const LINKS = [
  { label: 'Bora gravar com a Bold?', href: WHATSAPP, kind: 'whatsapp' },
  { label: 'Nosso site oficial', href: SITE, kind: 'site' },
  { label: 'Portfólio', href: `${SITE}#cases`, kind: 'portfolio' },
  { label: 'Nos contrate pelo e-mail', href: 'mailto:bold@boldstudiobrasil.com', kind: 'email' },
] as const
const LEGAL_LINKS = [
  { label: 'Termos de uso', href: 'https://boldstudiobrasil.com/termos' },
  { label: 'Privacidade', href: 'https://boldstudiobrasil.com/privacidade' },
  { label: 'Cookies', href: 'https://boldstudiobrasil.com/cookies' },
  { label: 'Uso da IA', href: 'https://boldstudiobrasil.com/uso-da-ia' },
] as const

function WhatsAppIcon() {
  return <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 .7C7.6.7.8 7.5.8 15.9c0 2.7.7 5.2 2 7.5L.7 31.3l8.1-2.1c2.2 1.2 4.7 1.8 7.2 1.8 8.4 0 15.2-6.8 15.2-15.1S24.4.7 16 .7Zm0 27.5c-2.2 0-4.4-.6-6.3-1.7l-.5-.3-4.8 1.3 1.3-4.7-.3-.5a12.2 12.2 0 0 1-1.9-6.4C3.5 9 9.1 3.4 16 3.4S28.5 9 28.5 15.9 22.9 28.2 16 28.2Zm6.8-9.2c-.4-.2-2.2-1.1-2.6-1.2-.3-.1-.6-.2-.8.2-.3.4-1 1.2-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9a11.7 11.7 0 0 1-2.2-2.7c-.2-.4 0-.6.2-.8l.6-.7.4-.6c.1-.2 0-.5 0-.7l-1.2-2.8c-.3-.7-.6-.6-.8-.6h-.7c-.3 0-.7.1-1 .4-.4.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.2 2.5 4 6.1 5.5.9.4 1.6.6 2.1.8.9.3 1.8.2 2.4.2.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.7-.5Z"/></svg>
}

export function BioPage() {
  const [logoIndex, setLogoIndex] = useState(0)

  useEffect(() => {
    const previousTitle = document.title
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const previousCanonical = canonical?.href
    document.title = 'Bold Studio Brasil | Links oficiais'
    canonical?.setAttribute('href', BIO_URL)
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const timer = window.setInterval(() => {
      if (!document.hidden && !media.matches) setLogoIndex((index) => (index + 1) % LOGOS.length)
    }, 3500)
    return () => {
      window.clearInterval(timer)
      document.title = previousTitle
      if (canonical && previousCanonical) canonical.href = previousCanonical
    }
  }, [])

  return <main className="bio-page">
    <section className="bio-page__main" aria-label="Links da Bold Studio Brasil">
      <div className="bio-page__photo" aria-hidden="true" />
      <div className="bio-page__content">
        <header className="bio-page__intro">
          <a href={SITE} aria-label="Ir para o site da Bold Studio Brasil" className="bio-page__logo-link"><img src="/brand/logo-boldstudio.webp" alt="Bold Studio Brasil" width="220" height="79" /></a>
          <p className="bio-page__eyebrow">PRODUTORA AUDIOVISUAL · SINOP, MT</p>
          <h1>Histórias que fazem sua marca acontecer.</h1>
          <p className="bio-page__support">Escolha por onde começar. O próximo grande projeto pode ser o seu.</p>
        </header>
        <div className="bio-page__actions">
          <nav aria-label="Links oficiais da Bold Studio Brasil" className="bio-page__links">
            {LINKS.map(({ label, href, kind }) => <a key={kind} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className={`shiny-cta bio-page__link bio-page__link--${kind}`}>
              <div className="bio-page__link-icon" aria-hidden="true">{kind === 'whatsapp' ? <WhatsAppIcon /> : kind === 'portfolio' ? <Clapperboard size={23} /> : kind === 'email' ? <Mail size={23} /> : <ArrowUpRight size={25} />}</div>
              <span>{label}</span><ArrowUpRight size={20} className="bio-page__link-arrow" aria-hidden="true" />
            </a>)}
          </nav>
          <aside className="bio-page__desktop-qr" aria-label="Acesse a Bio no celular">
            <span className="bio-page__qr-label">LEVE A BOLD COM VOCÊ</span>
            <div className="bio-page__qr-image"><img src="/brand/bio-boldstudio-qr.png" alt={`QR code para ${new URL(BIO_URL).host}`} width="188" height="188" /></div>
            <p>Aponte a câmera do celular e acesse nossos links.</p>
            <span className="bio-page__qr-url">{new URL(BIO_URL).host}</span>
          </aside>
        </div>
        <div className="bio-page__clients" aria-label="Marcas atendidas pela Bold Studio Brasil">
          <span>CRIAMOS COM MARCAS COMO</span>
          <div className="bio-page__client-logo" key={LOGOS[logoIndex].id}><img src={LOGOS[logoIndex].src} alt={LOGOS[logoIndex].alt} width="180" height="80" decoding="async" /></div>
        </div>
      </div>
    </section>
    <footer className="bio-page__footer">
      <nav className="bio-page__legal" aria-label="Páginas essenciais">
        {LEGAL_LINKS.map(({ label, href }) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <div className="bio-page__credits"><p>© {new Date().getFullYear()} Bold Studio Brasil. Todos os direitos reservados.</p><p>Powered by <span>Kaio Haedner</span></p></div>
      <FooterWordmark />
    </footer>
  </main>
}
