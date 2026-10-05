import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'devices.css/dist/devices.min.css'
import './shared/styles/global.css'

async function boot() {
  const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)
  // O laboratório é excluído do build de produção e não carrega o AuthProvider antigo.
  const Page = import.meta.env.DEV && isLocal && window.location.pathname === '/firebase-setup'
    ? (await import('./shared/firebase/FirebaseSetupPage')).default
    : (await import('./App.tsx')).default
  createRoot(document.getElementById('root')!).render(<StrictMode><Page /></StrictMode>)
}

void boot()
