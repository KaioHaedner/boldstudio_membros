import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useI18n } from '@/i18n/I18nContext'
import { LanguageSwitcher } from '@/components/home/LanguageSwitcher'
import { HeaderStatus } from '@/components/home/HeaderStatus'

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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const navigate = (href: string) => {
    setMenuOpen(false)
    window.requestAnimationFrame(() => scrollToAnchor(href))
  }

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[110] bg-transparent">
        <nav
          aria-label="Navegação principal"
          className="relative flex h-20 w-full items-center justify-between px-5 sm:px-8 lg:px-12"
        >
          <HeaderStatus />
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault()
              navigate('#home')
            }}
            className="pointer-events-auto relative z-10 inline-flex items-center rounded-full border border-white/15 bg-black/35 px-5 py-3 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur-2xl backdrop-saturate-150 transition-colors hover:border-bold-yellow/40"
          >
            <img
              src="/brand/logo-boldstudio.webp"
              alt="Bold Studio Brasil"
              className="h-8 w-auto object-contain sm:h-9"
            />
          </a>

          <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/15 bg-black/35 p-1.5 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur-2xl backdrop-saturate-150">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="group inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-2 text-bold-white transition-colors hover:bg-white/10 hover:text-bold-yellow md:px-4"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              aria-controls="home-fullscreen-menu"
            >
              <span className="hidden text-sm font-bold uppercase tracking-[0.16em] md:inline">
                {menuOpen ? 'Fechar' : 'Menu +'}
              </span>
              <span className="md:hidden">{menuOpen ? <X size={27} /> : <Menu size={27} />}</span>
            </button>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div
          id="home-fullscreen-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          className="home-fullscreen-menu fixed inset-0 z-[100] overflow-y-auto bg-bold-black px-5 pb-10 pt-28 sm:px-8 lg:px-12"
        >
          <div className="mx-auto flex min-h-[calc(100svh-9rem)] max-w-[110rem] flex-col justify-between">
            <ul className="grid gap-1">
              {NAV_LINKS.map((link, index) => (
                <li key={link.href} className="border-b border-white/10">
                  <a
                    href={link.href}
                    onClick={(event) => {
                      event.preventDefault()
                      navigate(link.href)
                    }}
                    className="group flex items-center justify-between py-3 text-[clamp(2.2rem,7vw,7.5rem)] font-black uppercase leading-[0.9] tracking-[-0.05em] text-bold-white transition-colors hover:text-bold-yellow"
                  >
                    <span>{t.nav[link.key]}</span>
                    <span className="text-xs font-bold tracking-[0.2em] text-bold-yellow/70">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex items-end justify-between border-t border-white/10 pt-5 text-xs uppercase tracking-[0.2em] text-bold-white/50">
              <span>Sinop · Mato Grosso</span>
              <div className="md:hidden">
                <LanguageSwitcher />
              </div>
              <span className="hidden md:inline">BoldStudio © 2026</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
