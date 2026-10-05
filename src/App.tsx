import { siteRoutes } from '@/apps/site/routes'
import { academyRoutes } from '@/apps/academy/routes'
import { adminRoutes } from '@/apps/admin/routes'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { getArea } from '@/shared/lib/area'
import { AuthProvider } from '@/shared/contexts/AuthContext'
import { ToastProvider } from '@/shared/components/Toast'
import { CookieBar } from '@/shared/components/CookieBar'
import { LoginPage } from '@/shared/pages/LoginPage'
import { CadastroPage } from '@/shared/pages/CadastroPage'
import { RecuperarSenhaPage } from '@/shared/pages/RecuperarSenhaPage'
import { RedefinirSenhaPage } from '@/shared/pages/RedefinirSenhaPage'
import { TwoFactorPage } from '@/shared/pages/TwoFactorPage'
import { TermosPage, PrivacidadePage, CookiesPage, SuportePage, UsoIAPage } from '@/shared/pages/LegalPages'
import { NotFoundPage } from '@/shared/pages/NotFoundPage'

// Porteiro da raiz: o dominio principal mostra a landing/portfolio;
// os subdominios de area (academy/admin/crew) vao direto pro login tematico.
function RootGate() {
  // O domínio raiz agora leva direto pra home institucional em
  // /home-bold-studio-sinop-brasil (URL amigável de SEO).
  // Os subdomínios de área (academy/admin/crew) seguem direto pro login temático.
  return getArea() === 'public'
    ? <Navigate to="/home-bold-studio-sinop-brasil" replace />
    : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
        <CookieBar />
        <Routes>
          {/* publicas */}
          <Route path="/" element={<RootGate />} />
          {siteRoutes()}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
          <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
          <Route path="/2fa" element={<TwoFactorPage />} />
          <Route path="/termos" element={<TermosPage />} />
          <Route path="/privacidade" element={<PrivacidadePage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/uso-da-ia" element={<UsoIAPage />} />
          <Route path="/suporte" element={<SuportePage />} />

          {academyRoutes()}
          {adminRoutes()}


          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
