import { Link } from 'react-router-dom'
import { Footer } from '@/components/Footer'

export function NotFoundPage() {
  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-bold-black text-bold-white px-6">
      <p className="text-7xl font-extrabold text-bold-yellow">404</p>
      <h1 className="mt-4 text-2xl font-bold">Página não encontrada</h1>
      <p className="mt-2 text-bold-white/60 max-w-md">
        O link que você abriu não existe (ou ainda não foi criado).
      </p>
      <Link
        to="/dashboard"
        className="mt-8 px-6 py-3 rounded-md bg-bold-yellow text-bold-black font-semibold hover:opacity-90 transition"
      >
        Voltar ao início
      </Link>
    </div>
    <Footer />
    </>
  )
}
