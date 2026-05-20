import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock, PlayCircle } from 'lucide-react'
import { useModule } from '@/hooks/useModules'
import { useLessons } from '@/hooks/useLessons'
import { useModuleProgress } from '@/hooks/useLessonProgress'
import { Loader } from '@/components/Loader'

export function ModuloPage() {
  const { id } = useParams<{ id: string }>()
  const { module, loading: loadingModule } = useModule(id)
  const { lessons, loading: loadingLessons } = useLessons(id)
  const { progressByLessonId } = useModuleProgress(id)

  const totalLessons = lessons.length
  const watchedLessons = lessons.filter((l) => progressByLessonId[l.id]?.watched).length
  const percent = totalLessons > 0 ? Math.round((watchedLessons / totalLessons) * 100) : 0

  if (loadingModule || loadingLessons) return <Loader label="Carregando módulo..." />

  if (!module) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold">Módulo não encontrado</h1>
        <Link to="/dashboard" className="mt-4 inline-block text-bold-yellow hover:underline">
          Voltar para o dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-bold-white/60 hover:text-bold-yellow"
      >
        <ArrowLeft size={14} /> Todos os módulos
      </Link>

      <header className="space-y-4">
        <p className="text-sm text-bold-yellow uppercase tracking-widest">
          Módulo {module.display_order || '.'}
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{module.title}</h1>
        {module.description && (
          <p className="text-bold-white/60 max-w-2xl leading-relaxed">{module.description}</p>
        )}

        <div className="flex items-center gap-4 pt-2">
          <div className="flex-1 max-w-md">
            <div className="flex justify-between text-xs text-bold-white/60 mb-1">
              <span>Progresso</span>
              <span>{watchedLessons}/{totalLessons} aulas</span>
            </div>
            <div className="h-2 rounded-full bg-bold-white/10 overflow-hidden">
              <div
                className="h-full bg-bold-yellow transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-bold-yellow tabular-nums">{percent}%</span>
        </div>
      </header>

      <section className="rounded-lg border border-bold-white/10 bg-bold-gray divide-y divide-bold-white/10">
        {lessons.length === 0 && (
          <div className="p-8 text-center text-sm text-bold-white/60">
            Nenhuma aula publicada neste módulo ainda.
          </div>
        )}
        {lessons.map((lesson, idx) => {
          const p = progressByLessonId[lesson.id]
          const watched = p?.watched ?? false
          return (
            <Link
              key={lesson.id}
              to={`/aula/${lesson.id}`}
              className="flex items-center gap-4 p-4 hover:bg-bold-white/5 transition group"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-bold-black text-bold-white/60 text-xs font-bold shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{lesson.title}</p>
                {lesson.description && (
                  <p className="text-sm text-bold-white/50 truncate">{lesson.description}</p>
                )}
                <div className="mt-1 flex items-center gap-3 text-xs text-bold-white/40">
                  {lesson.duration_sec && (
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {formatDuration(lesson.duration_sec)}
                    </span>
                  )}
                  {watched && (
                    <span className="inline-flex items-center gap-1 text-bold-yellow">
                      <CheckCircle2 size={12} /> Concluída
                    </span>
                  )}
                </div>
              </div>
              <PlayCircle
                size={24}
                className="text-bold-white/30 group-hover:text-bold-yellow transition shrink-0"
              />
            </Link>
          )
        })}
      </section>
    </div>
  )
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}m ${s.toString().padStart(2, '0')}s`
}
