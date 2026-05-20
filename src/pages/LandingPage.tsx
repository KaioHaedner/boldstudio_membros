import { Link } from 'react-router-dom'
import { SplashScreen } from '@/components/SplashScreen'

const LANDING_SPLASH_KEY = 'bold:landing-splash-shown'

export function LandingPage() {
  return (
    <>
      <SplashScreen storageKey={LANDING_SPLASH_KEY} durationMs={5000} />
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center bg-bold-black text-bold-white">
        <img
          src="/brand/logo-primary.png"
          alt="bold."
          className="w-64 md:w-80 mb-10 select-none"
          draggable={false}
        />

        <h1 className="font-sans text-4xl md:text-6xl font-extrabold tracking-tight">
          Plataforma <span className="text-bold-yellow">BOLD</span>.
        </h1>
        <p className="mt-4 max-w-xl text-bold-white/70 text-base md:text-lg">
          Audiovisual do basico ao avancado. Captacao, equipamento, proposta,
          negociacao e vendas — em videos diretos ao ponto.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            to="/cadastro"
            className="px-6 py-3 rounded-md bg-bold-yellow text-bold-black font-semibold hover:opacity-90 transition"
          >
            Criar conta
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-md border border-bold-white/20 text-bold-white hover:border-bold-yellow hover:text-bold-yellow transition"
          >
            Ja sou aluno
          </Link>
        </div>

        <p className="mt-16 text-xs text-bold-white/40 uppercase tracking-widest">
          Em construcao — preview
        </p>
      </main>
    </>
  )
}
