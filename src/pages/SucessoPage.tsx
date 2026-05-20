import { Link } from 'react-router-dom'
import { CheckCircle2, Mail } from 'lucide-react'
import { LoginBackground } from '@/components/LoginBackground'

export function SucessoPage() {
  return (
    <>
      <LoginBackground />
      <main className="min-h-screen flex items-center justify-center px-4 py-12 text-bold-white">
        <div className="max-w-md w-full">
          <div className="flex flex-col items-center mb-6">
            <img
              src="/brand/logo-primary.png"
              alt="bold."
              className="h-12 w-auto mb-6 drop-shadow-[0_4px_20px_rgba(255,215,18,0.3)]"
            />
          </div>

          <div className="glass-card rounded-lg p-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/15 text-green-400 mx-auto">
              <CheckCircle2 size={36} />
            </div>

            <h1 className="text-2xl font-extrabold">Compra confirmada!</h1>
            <p className="text-sm text-bold-white/70 leading-relaxed">
              Parabéns! Sua compra do <strong className="text-bold-yellow">curso BOLD</strong> foi
              aprovada. Em instantes você vai receber um e-mail com instruções para acessar a área
              de alunos.
            </p>

            <div className="rounded-md bg-bold-yellow/5 border border-bold-yellow/20 p-3 flex items-start gap-2 text-left">
              <Mail className="text-bold-yellow shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-bold-white/70">
                Não recebeu? Verifique a caixa de spam. Se em até 15 minutos nada chegar, fala com o
                suporte BOLD.
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <Link
                to="/login"
                className="block w-full py-3 rounded-md bg-bold-yellow text-bold-black font-semibold hover:opacity-90 transition"
              >
                Acessar minha conta
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
