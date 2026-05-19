import { SplashScreen } from '@/components/SplashScreen'

function App() {
  return (
    <>
      <SplashScreen />
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
        <img
          src="/brand/logo-primary.png"
          alt="bold."
          className="w-64 md:w-80 mb-10 select-none"
          draggable={false}
        />

        <h1 className="font-sans text-4xl md:text-6xl font-extrabold tracking-tight text-bold-white">
          Plataforma <span className="text-bold-yellow">BOLD</span>.
        </h1>
        <p className="mt-4 max-w-xl text-bold-white/70 text-base md:text-lg">
          Audiovisual do basico ao avancado. Captacao, equipamento, proposta,
          negociacao e vendas — em videos diretos ao ponto.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <a
            href="#curso"
            className="px-6 py-3 rounded-md bg-bold-yellow text-bold-black font-semibold hover:opacity-90 transition"
          >
            Conhecer o curso
          </a>
          <a
            href="#login"
            className="px-6 py-3 rounded-md border border-bold-white/20 text-bold-white hover:border-bold-yellow hover:text-bold-yellow transition"
          >
            Ja sou aluno
          </a>
        </div>

        <p className="mt-16 text-xs text-bold-white/40 uppercase tracking-widest">
          Em construcao — preview
        </p>
      </main>
    </>
  )
}

export default App
