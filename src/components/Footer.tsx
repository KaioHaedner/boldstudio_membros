import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

function IgIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
function YtIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  )
}

export function Footer() {
  const ano = new Date().getFullYear()
  return (
    <footer className="border-t border-bold-white/10 bg-bold-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-bold-white/50">
          <img src="/brand/logo-primary.png" alt="bold." className="h-5 w-auto" />
          <span>BOLDSTUDIO · Todos os direitos reservados © {ano}</span>
        </div>

        <nav className="flex items-center gap-4 text-xs text-bold-white/50">
          <Link to="/suporte" className="hover:text-bold-yellow transition">Suporte</Link>
          <Link to="/privacidade" className="hover:text-bold-yellow transition">Privacidade</Link>
          <Link to="/cookies" className="hover:text-bold-yellow transition">Cookies</Link>
          <Link to="/termos" className="hover:text-bold-yellow transition">Termos de Uso</Link>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://instagram.com/boldstudio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="h-8 w-8 rounded-full border border-bold-white/15 flex items-center justify-center text-bold-white/60 hover:text-bold-yellow hover:border-bold-yellow/50 transition"
          >
            <IgIcon />
          </a>
          <a
            href="https://youtube.com/@boldstudio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="h-8 w-8 rounded-full border border-bold-white/15 flex items-center justify-center text-bold-white/60 hover:text-bold-yellow hover:border-bold-yellow/50 transition"
          >
            <YtIcon />
          </a>
        </div>
      </div>

      <div className="border-t border-bold-white/5 py-3 text-center text-[11px] text-bold-white/30 flex items-center justify-center gap-1">
        Feito com <Heart size={11} className="text-bold-yellow fill-bold-yellow" /> pela equipe BoldStudios
      </div>
    </footer>
  )
}
