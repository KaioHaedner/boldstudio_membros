import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { SplashScreen } from '@/components/SplashScreen'
import { cn } from '@/lib/utils'

const APP_SPLASH_KEY = 'bold:app-splash-shown'

export function AppLayout() {
  const { profile, signOut, user } = useAuth()
  const location = useLocation()

  const splashShownThisSession = typeof window !== 'undefined' && sessionStorage.getItem(APP_SPLASH_KEY) === '1'

  return (
    <div className="min-h-screen bg-bold-black text-bold-white">
      {!splashShownThisSession && (
        <SplashScreen
          storageKey={APP_SPLASH_KEY}
          durationMs={5000}
        />
      )}

      <header className="sticky top-0 z-30 border-b border-bold-white/10 bg-bold-black/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="/brand/logo-primary.png" alt="bold." className="h-7 w-auto" />
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <NavItem to="/dashboard" icon={<LayoutDashboard size={16} />}>
              Aulas
            </NavItem>
            <NavItem to="/perfil" icon={<UserIcon size={16} />}>
              Perfil
            </NavItem>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-sm text-bold-white/60">
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

        <nav className="sm:hidden flex items-center justify-around border-t border-bold-white/10 px-2 py-2">
          <NavItem to="/dashboard" icon={<LayoutDashboard size={16} />} small>
            Aulas
          </NavItem>
          <NavItem to="/perfil" icon={<UserIcon size={16} />} small>
            Perfil
          </NavItem>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8" key={location.pathname}>
        <Outlet />
      </main>
    </div>
  )
}

function NavItem({
  to,
  icon,
  children,
  small,
}: {
  to: string
  icon: React.ReactNode
  children: React.ReactNode
  small?: boolean
}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition',
          small ? 'flex-1 justify-center' : '',
          isActive
            ? 'bg-bold-yellow text-bold-black font-semibold'
            : 'text-bold-white/70 hover:bg-bold-white/5 hover:text-bold-white'
        )
      }
    >
      {icon}
      {children}
    </NavLink>
  )
}
