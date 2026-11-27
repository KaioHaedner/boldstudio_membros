import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastProvider } from '@/shared/components/Toast'
import { CookieBar } from '@/shared/components/CookieBar'
import { HomeInstitucionalPage } from '@/apps/site/pages/HomeInstitucionalPage'
import { ServicoPage } from '@/apps/site/pages/ServicoPage'
import { ProjetoClientePage } from '@/apps/site/pages/ProjetoClientePage'
import { TermosPage, PrivacidadePage, CookiesPage, SuportePage, UsoIAPage } from '@/shared/pages/LegalPages'
import { NotFoundPage } from '@/shared/pages/NotFoundPage'

// Build para o novo deployment institucional: nenhuma rota de Academy, Admin,
// checkout ou portal Crew. A secao publica #crew da home continua presente.
export default function InstitutionalApp() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CookieBar />
        <Routes>
          <Route path="/" element={<Navigate to="/home-bold-studio-sinop-brasil" replace />} />
          <Route path="/home" element={<Navigate to="/home-bold-studio-sinop-brasil" replace />} />
          <Route path="/home-bold-studio-sinop-brasil" element={<HomeInstitucionalPage />} />
          <Route path="/servico/:slug" element={<ServicoPage />} />
          <Route path="/termos" element={<TermosPage />} />
          <Route path="/privacidade" element={<PrivacidadePage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/uso-da-ia" element={<UsoIAPage />} />
          <Route path="/suporte" element={<SuportePage />} />
          <Route path="/:projetoSlug" element={<ProjetoClientePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
