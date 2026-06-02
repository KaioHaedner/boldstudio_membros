import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { LogOut, User as UserIcon, Clapperboard, GraduationCap, Route, Package, Trophy, TrendingUp } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { SplashScreen } from '@/components/SplashScreen'
import { Footer } from '@/components/Footer'
import { cn } from '@/lib/utils'

const APP_SPLASH_KEY = 'bold:app-splash-shown'

const NAV = [
  { to: '/dashboard', label: 'Set', icon: Clapperboard },
  { to: '/trilhas', label: 'Trilhas', icon: GraduationCap },
  { to: '/rota', label: 'Rota', icon: Route },
  { to: '/arsenal', label: 'Arsenal', icon: Package },
  { to: '/conquistas', label: 'Conquistas', icon: Trophy },
  { to: '/evolucao', label: 'Evolução', icon: TrendingUp },
  { to: '/perfil', label: 'Perfil', icon: UserIcon },
]

export function AppLayout() {
  const { profile, signOut, user } = useAuth()
  const location = useLocation()
  const splashShownThisSession = typeof window !== 'undefined' && sessionStorage.getItem(APP_SPLASH_KEY) === '1'

  return (
    <div className="min-h-screen bg-bold-black text-bold-white">
      {!splashShownThisSession && <SplashScreen storageKey={APP_SPLASH_KEY} durationMs={5000} />}

      <header className="sticky top-0 z-30 border-b border-bold-white/10 bg-bold-black/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <img src="/brand/logo-primary.png" alt="bold." className="h-7 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {NAV.map((item) => (
              <NavItem key={item.to} to={item.to} icon={<item.icon size={15} />}>
                {item.label}
              </NavItem>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden lg:inline text-sm text-bold-white/60 max-w-[140px] truncate">
              {profile?.full_name ?? user?.email}
            </span>
            <button
              type="button"
              onClick={() => signOut()}
              className="flex items-center gap-1.5 text-sm text-bold-white/70 hover:text-bold-yellow transition"
              aria-label="Sair"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Mobile: nav rolavel horizontal */}
        <nav className="md:hidden flex items-center gap-1 border-t border-bold-white/10 px-2 py-2 overflow-x-auto">
          {NAV.map((item) => (
            <NavItem key={item.to} to={item.to} icon={<item.icon size={15} />} small>
              {item.label}
            </NavItem>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 min-h-[calc(100vh-12rem)]" key={location.pathname}>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

function NavItem({ to, icon, children, small }: { to: string; icon: React.ReactNode; children: React.ReactNode; small?: boolean }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition whitespace-nowrap',
          small ? 'shrink-0' : '',
          isActive ? 'bg-bold-yellow text-bold-black font-semibold' : 'text-bold-white/70 hover:bg-bold-white/5 hover:text-bold-white'
        )
      }
    >
      {icon}
      {children}
    </NavLink>
  )
}
