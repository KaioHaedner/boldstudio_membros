import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useModules } from '@/hooks/useModules'
import { Loader } from '@/components/Loader'

export function DashboardPage() {
  const { profile } = useAuth()
  const { modules, loading, error } = useModules()

  const primeiroNome = profile?.full_name?.split(' ')[0] ?? 'aluno'

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-bold-yellow uppercase tracking-widest">Bem-vindo</p>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Ola, {primeiroNome}.</h1>
        <p className="mt-2 text-bold-white/60 max-w-xl">
          Escolha um modulo abaixo para comecar ou continuar de onde parou.
        </p>
      </header>

      {loading && <Loader label="Carregando modulos..." />}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          Erro ao carregar modulos: {error}
        </div>
      )}

      {!loading && !error && modules.length === 0 && (
        <EmptyState />
      )}

      {!loading && modules.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m) => (
            <Link
              key={m.id}
              to={`/modulo/${m.id}`}
              className="group rounded-lg border border-bold-white/10 bg-bold-gray overflow-hidden hover:border-bold-yellow transition flex flex-col"
            >
              <div className="aspect-video bg-bold-black overflow-hidden">
                {m.cover_url ? (
                  <img
                    src={m.cover_url}
                    alt={m.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-bold-white/20">
                    <BookOpen size={48} />
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <p className="text-xs text-bold-yellow uppercase tracking-widest">
                  Modulo {m.display_order || '—'}
                </p>
                <h2 className="text-lg font-bold leading-tight">{m.title}</h2>
                {m.description && (
                  <p className="text-sm text-bold-white/60 line-clamp-2">{m.description}</p>
                )}
                <div className="mt-auto pt-2 flex items-center gap-2 text-sm text-bold-yellow font-semibold">
                  Acessar <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-bold-white/10 bg-bold-gray p-8 text-center">
      <BookOpen size={40} className="mx-auto mb-4 text-bold-yellow" />
      <h2 className="text-lg font-bold">Nenhum modulo disponivel ainda</h2>
      <p className="mt-2 text-sm text-bold-white/60 max-w-md mx-auto">
        Os modulos do curso vao aparecer aqui assim que estiverem publicados. Volte em breve.
      </p>
    </div>
  )
}
