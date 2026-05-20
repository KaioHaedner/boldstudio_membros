import { Link } from 'react-router-dom'
import { Award, Lock } from 'lucide-react'

export function CertificadoPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs text-bold-yellow uppercase tracking-widest">Certificado</p>
        <h1 className="text-2xl md:text-3xl font-extrabold mt-1.5">Em breve</h1>
      </header>

      <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 p-8 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-bold-yellow/10 text-bold-yellow mx-auto relative">
          <Award size={40} />
          <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-bold-black border-2 border-bold-yellow flex items-center justify-center">
            <Lock size={12} className="text-bold-yellow" />
          </span>
        </div>

        <h2 className="text-lg font-bold">Certificado em desenvolvimento</h2>
        <p className="text-sm text-bold-white/60 max-w-md mx-auto">
          Assim que você concluir 100% das aulas, o certificado fica disponível para download aqui
          (PDF assinado digitalmente com seu nome, código único e data de conclusão).
        </p>

        <p className="text-[11px] text-bold-white/40">
          Esta funcionalidade chega numa próxima versão da plataforma.
        </p>

        <div className="pt-4">
          <Link
            to="/dashboard"
            className="inline-block px-5 py-2.5 rounded-md border border-bold-white/15 text-sm text-bold-white hover:border-bold-yellow hover:text-bold-yellow transition"
          >
            Voltar ao dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
