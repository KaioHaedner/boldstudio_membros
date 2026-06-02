import { useEffect, useState } from 'react'
import { TrendingUp, CheckCircle2, Flame } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Loader } from '@/components/Loader'

export function EvolucaoPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [vistas, setVistas] = useState(0)

  useEffect(() => {
    ;(async () => {
      const { count: totalLessons } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('active', true)
      const { count: watched } = await supabase
        .from('lesson_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id ?? '')
        .eq('watched', true)
      setTotal(totalLessons ?? 0)
      setVistas(watched ?? 0)
      setLoading(false)
    })()
  }, [user?.id])

  const pct = total > 0 ? Math.round((vistas / total) * 100) : 0

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs text-bold-yellow uppercase tracking-widest flex items-center gap-1.5">
          <TrendingUp size={14} /> Evolução
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-1.5">Seu progresso</h1>
        <p className="mt-2 text-bold-white/60">Cada aula concluída te aproxima do próximo nível.</p>
      </header>

      {loading ? (
        <Loader label="Calculando sua evolução..." />
      ) : (
        <>
          {/* Anel/barra de progresso geral */}
          <div className="rounded-2xl border border-bold-yellow/30 bg-bold-gray/40 p-6">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-sm text-bold-white/60">Progresso geral</p>
                <p className="text-5xl font-extrabold text-bold-yellow mt-1">{pct}%</p>
              </div>
              <p className="text-sm text-bold-white/60">
                {vistas} de {total} aulas
              </p>
            </div>
            <div className="h-3 rounded-full bg-bold-black/60 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-bold-yellow to-amber-400 transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Cards de stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={<CheckCircle2 className="text-green-400" size={20} />} valor={vistas} label="Aulas concluídas" />
            <StatCard icon={<TrendingUp className="text-bold-yellow" size={20} />} valor={`${pct}%`} label="Do curso completo" />
            <StatCard icon={<Flame className="text-amber-400" size={20} />} valor={total - vistas} label="Aulas restantes" />
          </div>

          {pct === 100 && total > 0 && (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-center">
              <p className="font-bold text-green-300">Você concluiu tudo! 🎬</p>
              <p className="text-sm text-bold-white/60 mt-1">Seu certificado está em Conquistas.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function StatCard({ icon, valor, label }: { icon: React.ReactNode; valor: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-bold-white/10 bg-bold-gray/40 p-5">
      <div className="mb-2">{icon}</div>
      <p className="text-3xl font-extrabold">{valor}</p>
      <p className="text-sm text-bold-white/50 mt-0.5">{label}</p>
    </div>
  )
}
