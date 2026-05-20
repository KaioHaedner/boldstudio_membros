import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  ArrowLeftCircle,
  BookOpen,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Users,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { APP_VERSION } from '@/lib/version'
import { cn } from '@/lib/utils'

const ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/modulos', icon: BookOpen, label: 'Modulos' },
  { to: '/admin/alunos', icon: Users, label: 'Alunos' },
  { to: '/admin/comentarios', icon: MessageSquare, label: 'Comentarios' },
]

export function AdminLayout() {
  const { profile, signOut } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-bold-black text-bold-white flex">
      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-bold-white/10 bg-bold-black sticky top-0 h-screen">
        <Link to="/admin" className="flex items-center gap-2 px-5 h-16 border-b border-bold-white/10">
          <img src="/brand/logo-primary.png" alt="bold." className="h-7 w-auto" />
          <span className="text-[10px] uppercase tracking-widest text-bold-yellow font-bold">admin</span>
        </Link>

        <nav className="flex-1 p-3 space-y-1">
          {ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition',
                  isActive
                    ? 'bg-bold-yellow text-bold-black font-semibold'
                    : 'text-bold-white/70 hover:bg-bold-white/5 hover:text-bold-white'
                )
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-bold-white/10 space-y-1.5">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-xs text-bold-white/60 hover:text-bold-yellow rounded-md hover:bg-bold-white/5 transition"
          >
            <ArrowLeftCircle size={14} />
            Voltar ao app
          </Link>
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-bold-white/60 hover:text-red-400 rounded-md hover:bg-red-500/5 transition"
          >
            <LogOut size={14} />
            Sair
          </button>
          <div className="pt-1 px-3">
            <p className="text-[10px] text-bold-white/30 uppercase tracking-widest">
              v{APP_VERSION}
            </p>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden fixed inset-x-0 top-0 z-30 h-14 bg-bold-black border-b border-bold-white/10 px-4 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2">
          <img src="/brand/logo-primary.png" alt="bold." className="h-6 w-auto" />
          <span className="text-[10px] uppercase tracking-widest text-bold-yellow font-bold">admin</span>
        </Link>
        <span className="text-xs text-bold-white/60 truncate max-w-[150px]">
          {profile?.full_name ?? 'Admin'}
        </span>
      </header>

      {/* MAIN */}
      <main className="flex-1 min-w-0 md:pt-0 pt-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10" key={location.pathname}>
          <Outlet />
        </div>

        {/* MOBILE BOTTOM NAV */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-bold-black border-t border-bold-white/10 flex items-center justify-around py-2">
          {ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] transition',
                  isActive ? 'text-bold-yellow' : 'text-bold-white/50'
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  )
}
