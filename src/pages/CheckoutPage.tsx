import { Link } from 'react-router-dom'
import { Clock, ShoppingCart } from 'lucide-react'
import { LoginBackground } from '@/components/LoginBackground'
import { Footer } from '@/components/Footer'
import { APP_VERSION } from '@/lib/version'

export function CheckoutPage() {
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
            <h1 className="text-2xl font-extrabold">Checkout</h1>
          </div>

          <div className="glass-card rounded-lg p-6 space-y-4 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-bold-yellow/10 text-bold-yellow mx-auto mb-2">
              <ShoppingCart size={26} />
            </div>

            <h2 className="text-lg font-bold">Em breve</h2>
            <p className="text-sm text-bold-white/60 leading-relaxed">
              O gateway de pagamento está sendo definido. Em breve você vai poder comprar acesso ao
              curso BOLD por aqui (PIX, cartão ou parcelado).
            </p>

            <div className="rounded-md bg-bold-yellow/5 border border-bold-yellow/20 p-3 text-left">
              <p className="text-[11px] uppercase tracking-widest text-bold-yellow font-bold mb-1.5">
                <Clock className="inline mr-1.5" size={11} />
                Enquanto isso
              </p>
              <p className="text-xs text-bold-white/70">
                Caso você já tenha contratado com o time BOLD por outro canal, peça para eles liberarem
                seu acesso manual. Depois é só logar normalmente.
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <Link
                to="/login"
                className="block w-full py-3 rounded-md bg-bold-yellow text-bold-black font-semibold hover:opacity-90 transition"
              >
                Ir para login
              </Link>
              <Link
                to="/"
                className="block w-full py-2 text-xs text-bold-white/60 hover:text-bold-yellow transition"
              >
                Voltar ao início
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-[10px] text-bold-white/30 uppercase tracking-widest">
            bold. v{APP_VERSION}
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
