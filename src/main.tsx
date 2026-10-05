import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'devices.css/dist/devices.min.css'
import './shared/styles/global.css'
import { PageErrorBoundary } from './shared/components/PageErrorBoundary'

async function boot() {
  const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)
  // O laboratório é excluído do build de produção e não carrega o AuthProvider antigo.
  const Page = import.meta.env.DEV && isLocal && window.location.pathname === '/firebase-setup'
    ? (await import('./shared/firebase/FirebaseSetupPage')).default
    : (await import('./App.tsx')).default
  createRoot(document.getElementById('root')!).render(<StrictMode><PageErrorBoundary><Page /></PageErrorBoundary></StrictMode>)
}

void boot().catch((error: unknown) => {
  // Import/config/chunk failures occur before React mounts. Give the visitor
  // an actionable fallback instead of the black #root background.
  console.error('[Boot] Falha ao inicializar o aplicativo', error)
  const root = document.getElementById('root')
  if (!root) return
  const panel = document.createElement('main')
  panel.setAttribute('role', 'alert')
  panel.className = 'min-h-screen flex flex-col items-center justify-center gap-5 bg-black px-6 text-center text-white'
  const title = document.createElement('h1')
  title.textContent = 'Não conseguimos carregar o site.'
  const text = document.createElement('p')
  text.textContent = 'Tente novamente. Se continuar, avise a equipe Bold.'
  const retry = document.createElement('button')
  retry.type = 'button'
  retry.textContent = 'Tentar novamente'
  retry.className = 'rounded-xl bg-bold-yellow px-6 py-3 font-bold text-black'
  retry.addEventListener('click', () => window.location.reload())
  panel.append(title, text, retry)
  root.replaceChildren(panel)
})
