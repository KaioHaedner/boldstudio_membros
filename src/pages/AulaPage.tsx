import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Download, Film } from 'lucide-react'
import { useLesson, useLessons } from '@/hooks/useLessons'
import { useLessonProgress } from '@/hooks/useLessonProgress'
import { Loader } from '@/components/Loader'
import { cn } from '@/lib/utils'

export function AulaPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { lesson, loading: loadingLesson } = useLesson(id)
  const { lessons } = useLessons(lesson?.module_id)
  const { progress, markWatched } = useLessonProgress(id)

  const { prev, next } = useMemo(() => {
    if (!lesson || lessons.length === 0) return { prev: null, next: null }
    const idx = lessons.findIndex((l) => l.id === lesson.id)
    return {
      prev: idx > 0 ? lessons[idx - 1] : null,
      next: idx < lessons.length - 1 ? lessons[idx + 1] : null,
    }
  }, [lesson, lessons])

  if (loadingLesson) return <Loader label="Carregando aula..." />

  if (!lesson) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold">Aula não encontrada</h1>
        <Link to="/dashboard" className="mt-4 inline-block text-bold-yellow hover:underline">
          Voltar para o dashboard
        </Link>
      </div>
    )
  }

  const watched = progress?.watched ?? false

  return (
    <div className="space-y-6">
      <Link
        to={`/modulo/${lesson.module_id}`}
        className="inline-flex items-center gap-1 text-sm text-bold-white/60 hover:text-bold-yellow"
      >
        <ArrowLeft size={14} /> Voltar para o módulo
      </Link>

      <div className="aspect-video w-full overflow-hidden rounded-lg border border-bold-white/10 bg-bold-gray relative">
        {lesson.panda_video_id ? (
          <iframe
            title={lesson.title}
            src={`https://player-vz-${lesson.panda_video_id}.tv.pandavideo.com.br/embed/?v=${lesson.panda_video_id}`}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <PandaPlaceholder />
        )}
      </div>

      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-bold-white/60 leading-relaxed">{lesson.description}</p>
        )}
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => markWatched()}
          disabled={watched}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-semibold transition',
            watched
              ? 'bg-bold-yellow/10 text-bold-yellow border border-bold-yellow/30'
              : 'bg-bold-yellow text-bold-black hover:opacity-90'
          )}
        >
          <CheckCircle2 size={16} />
          {watched ? 'Aula concluída' : 'Marcar como vista'}
        </button>

        {next && (
          <button
            type="button"
            onClick={() => navigate(`/aula/${next.id}`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-bold-white/15 text-bold-white hover:border-bold-yellow hover:text-bold-yellow transition"
          >
            Próxima aula <ArrowRight size={16} />
          </button>
        )}
      </div>

      {lesson.materials && lesson.materials.length > 0 && (
        <section className="rounded-lg border border-bold-white/10 bg-bold-gray p-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-bold-yellow mb-3">
            Materiais
          </h2>
          <ul className="space-y-2">
            {lesson.materials.map((mat, i) => (
              <li key={i}>
                <a
                  href={mat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-bold-white hover:text-bold-yellow transition"
                >
                  <Download size={14} />
                  {mat.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="flex items-center justify-between pt-4 border-t border-bold-white/10 text-sm">
        {prev ? (
          <Link
            to={`/aula/${prev.id}`}
            className="inline-flex items-center gap-1 text-bold-white/60 hover:text-bold-yellow"
          >
            <ArrowLeft size={14} /> {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            to={`/aula/${next.id}`}
            className="inline-flex items-center gap-1 text-bold-white/60 hover:text-bold-yellow text-right"
          >
            {next.title} <ArrowRight size={14} />
          </Link>
        )}
      </nav>
    </div>
  )
}

function PandaPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-bold-white/30">
      <Film size={48} />
      <p className="text-sm">Aula aguardando upload no Panda Video</p>
      <p className="text-xs text-bold-white/20">
        Quando o vídeo for publicado, ele aparece aqui automaticamente.
      </p>
    </div>
  )
}
