import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'devices.css/dist/devices.min.css'
import './shared/styles/global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
