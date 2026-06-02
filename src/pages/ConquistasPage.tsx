import { useEffect, useState } from 'react'
import { Trophy, Lock, Award } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Loader } from '@/components/Loader'

export function ConquistasPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    ;(async () => {
      const { count: total } = await supabase.from('lessons').select('*', { count: 'exact', head: true }).eq('active', true)
      const { count: watched } = await supabase
        .from('lesson_progress').select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id ?? '').eq('watched', true)
      setPct(total && total > 0 ? Math.round(((watched ?? 0) / total) * 100) : 0)
      setLoading(false)
    })()
  }, [user?.id])

  const concluido = pct === 100

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs text-bold-yellow uppercase tracking-widest flex items-center gap-1.5">
          <Trophy size={14} /> Conquistas
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-1.5">Seus certificados</h1>
        <p className="mt-2 text-bold-white/60">Conclua as trilhas e desbloqueie seu certificado BOLD.</p>
      </header>

      {loading ? (
        <Loader label="Verificando suas conquistas..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`rounded-2xl border p-6 text-center ${concluido ? 'border-bold-yellow/50 bg-bold-yellow/5' : 'border-bold-white/10 bg-bold-gray/40'}`}>
            <div className={`mx-auto h-14 w-14 rounded-full flex items-center justify-center mb-3 ${concluido ? 'bg-bold-yellow/20 text-bold-yellow' : 'bg-bold-black/60 text-bold-white/30'}`}>
              {concluido ? <Award size={26} /> : <Lock size={22} />}
            </div>
            <h3 className="font-bold">Certificado de Conclusão</h3>
            <p className="text-sm text-bold-white/55 mt-1">
              {concluido ? 'Liberado! Você concluiu o curso.' : `Conclua 100% das aulas (${pct}% feito) para liberar.`}
            </p>
            {concluido && (
              <a href="/certificado" className="inline-block mt-4 px-5 py-2 rounded-md bg-bold-yellow text-bold-black font-semibold text-sm">
                Ver certificado
              </a>
            )}
          </div>

          <div className="rounded-2xl border border-bold-white/10 bg-bold-gray/40 p-6 text-center opacity-70">
            <div className="mx-auto h-14 w-14 rounded-full bg-bold-black/60 text-bold-white/30 flex items-center justify-center mb-3">
              <Lock size={22} />
            </div>
            <h3 className="font-bold">Selo Equipe Bold</h3>
            <p className="text-sm text-bold-white/55 mt-1">Conquista especial pra quem se destaca. Em breve.</p>
          </div>
        </div>
      )}
    </div>
  )
}
