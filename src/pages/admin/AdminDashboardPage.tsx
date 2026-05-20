import { useEffect, useState } from 'react'
import { BookOpen, CheckCircle, MessageSquare, PlayCircle, ShoppingCart, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Loader } from '@/components/Loader'

interface Stats {
  modulos: number
  aulas: number
  alunos: number
  vendasAprovadas: number
  comentariosPendentes: number
  aulasConcluidasTotal: number
}

export function AdminDashboardPage() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([
      supabase.from('modules').select('id', { count: 'exact', head: true }),
      supabase.from('lessons').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
      supabase.from('purchases').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('comments').select('id', { count: 'exact', head: true }).eq('approved', false),
      supabase.from('lesson_progress').select('user_id', { count: 'exact', head: true }).eq('watched', true),
    ]).then(([modulos, aulas, alunos, vendas, coments, progress]) => {
      if (!active) return
      setStats({
        modulos: modulos.count ?? 0,
        aulas: aulas.count ?? 0,
        alunos: alunos.count ?? 0,
        vendasAprovadas: vendas.count ?? 0,
        comentariosPendentes: coments.count ?? 0,
        aulasConcluidasTotal: progress.count ?? 0,
      })
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  if (loading || !stats) return <Loader label="Carregando métricas..." />

  const cards = [
    { icon: BookOpen, label: 'Módulos', value: stats.modulos, color: 'text-bold-yellow', to: '/admin/modulos' },
    { icon: PlayCircle, label: 'Aulas', value: stats.aulas, color: 'text-bold-yellow', to: '/admin/modulos' },
    { icon: Users, label: 'Alunos cadastrados', value: stats.alunos, color: 'text-blue-400', to: '/admin/alunos' },
    { icon: ShoppingCart, label: 'Compras aprovadas', value: stats.vendasAprovadas, color: 'text-green-400', to: '/admin/alunos' },
    { icon: MessageSquare, label: 'Comentários pendentes', value: stats.comentariosPendentes, color: 'text-amber-400', to: '/admin/comentarios' },
    { icon: CheckCircle, label: 'Aulas concluídas (total)', value: stats.aulasConcluidasTotal, color: 'text-green-400' },
  ]

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs text-bold-yellow uppercase tracking-widest">Admin</p>
        <h1 className="text-2xl md:text-3xl font-extrabold mt-1.5">
          Olá, {profile?.full_name?.split(' ')[0] ?? 'admin'}
        </h1>
        <p className="mt-2 text-sm text-bold-white/60">
          Visão geral da plataforma BOLDSTUDIO.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((card) => {
          const Inner = (
            <div className="rounded-lg border border-bold-white/10 bg-bold-gray/60 p-4 hover:border-bold-yellow/40 transition">
              <card.icon className={`mb-2 ${card.color}`} size={22} />
              <p className="text-3xl font-extrabold tabular-nums">{card.value}</p>
              <p className="text-xs text-bold-white/60 mt-1">{card.label}</p>
            </div>
          )
          return card.to ? (
            <Link key={card.label} to={card.to}>{Inner}</Link>
          ) : (
            <div key={card.label}>{Inner}</div>
          )
        })}
      </div>

      <section className="rounded-lg border border-bold-white/10 bg-bold-gray/60 p-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-bold-yellow mb-3">Atalhos</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/modulos"
            className="px-4 py-2 rounded-md bg-bold-yellow text-bold-black text-sm font-semibold hover:opacity-90 transition"
          >
            + Novo módulo
          </Link>
          <Link
            to="/admin/alunos"
            className="px-4 py-2 rounded-md border border-bold-white/15 text-sm hover:border-bold-yellow hover:text-bold-yellow transition"
          >
            Gerenciar alunos
          </Link>
          <Link
            to="/admin/comentarios"
            className="px-4 py-2 rounded-md border border-bold-white/15 text-sm hover:border-bold-yellow hover:text-bold-yellow transition"
          >
            Moderar comentários
          </Link>
        </div>
      </section>
    </div>
  )
}
