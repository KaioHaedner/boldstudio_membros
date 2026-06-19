import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/I18nContext'
import { LanguageSwitcher } from '@/components/home/LanguageSwitcher'

const NAV_LINKS = [
  { href: '#home', key: 'home' },
  { href: '#sobre', key: 'sobre' },
  { href: '#servicos', key: 'servicos' },
  { href: '#crew', key: 'crew' },
  { href: '#clientes', key: 'clientes' },
  { href: '#reels', key: 'reels' },
  { href: '#contato', key: 'contato' },
] as const

function scrollToAnchor(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Header() {
  const { t } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        aria-label="Navegacao principal"
        className={cn(
          'flex w-full max-w-4xl items-center justify-between gap-6 rounded-[70px] border border-white/10 px-5 py-2.5 transition-all duration-500',
          'backdrop-blur-2xl backdrop-saturate-150',
          scrolled ? 'bg-bold-gray/55 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]' : 'bg-bold-gray/25'
        )}
      >
        <a href="#home" onClick={(e) => { e.preventDefault(); scrollToAnchor('#home') }} className="flex items-center gap-2">
          <img src="/brand/logo-boldstudio.webp" alt="Bold Studio Brasil" className="h-7 w-auto object-contain" />
        </a>

        <ul className="hidden items-center gap-7 text-sm font-medium text-bold-white/85 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToAnchor(link.href) }}
                className="inline-block origin-center transition-all duration-200 hover:scale-110 hover:text-bold-yellow"
              >
                {t.nav[link.key]}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href="#contato"
            onClick={(e) => { e.preventDefault(); scrollToAnchor('#contato') }}
            className="hidden rounded-lg bg-bold-yellow px-5 py-2 text-sm font-bold text-bold-black transition-transform hover:scale-105 md:inline-block"
          >
            {t.nav.cta}
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="text-bold-white md:hidden"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            aria-controls="home-mobile-menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div id="home-mobile-menu" className="absolute left-4 right-4 top-[calc(100%+0.5rem)] rounded-xl border border-white/10 bg-bold-gray/90 p-4 backdrop-blur-2xl md:hidden">
          <ul className="flex flex-col gap-3 text-sm font-medium text-bold-white/85">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToAnchor(link.href)
                    setMobileOpen(false)
                  }}
                  className="block py-1 transition-colors hover:text-bold-yellow"
                >
                  {t.nav[link.key]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
