import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { getArea } from '@/lib/area'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/components/Toast'
import PulsatingLoader from '@/components/PulsatingLoader'
import { CookieBar } from '@/components/CookieBar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppLayout } from '@/components/AppLayout'
import { AdminLayout } from '@/components/AdminLayout'
import { LandingPage } from '@/pages/LandingPage'
import { ComingSoon } from '@/pages/ComingSoon'
import { HomeInstitucionalPage } from '@/pages/HomeInstitucionalPage'
import { LoginPage } from '@/pages/LoginPage'
import { CadastroPage } from '@/pages/CadastroPage'
import { RecuperarSenhaPage } from '@/pages/RecuperarSenhaPage'
import { RedefinirSenhaPage } from '@/pages/RedefinirSenhaPage'
import { TwoFactorPage } from '@/pages/TwoFactorPage'
import { TermosPage, PrivacidadePage, CookiesPage, SuportePage, UsoIAPage } from '@/pages/LegalPages'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { SucessoPage } from '@/pages/SucessoPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ModuloPage } from '@/pages/ModuloPage'
import { AulaPage } from '@/pages/AulaPage'
import { PerfilPage } from '@/pages/PerfilPage'
import { TrilhasPage } from '@/pages/TrilhasPage'
import { RotaPage } from '@/pages/RotaPage'
import { ArsenalPage } from '@/pages/ArsenalPage'
import { ConquistasPage } from '@/pages/ConquistasPage'
import { EvolucaoPage } from '@/pages/EvolucaoPage'
import { CertificadoPage } from '@/pages/CertificadoPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminModulosListPage } from '@/pages/admin/AdminModulosListPage'
import { AdminModuloEditPage } from '@/pages/admin/AdminModuloEditPage'
import { AdminAulaEditPage } from '@/pages/admin/AdminAulaEditPage'
import { AdminAlunosPage } from '@/pages/admin/AdminAlunosPage'
import { AdminComentariosPage } from '@/pages/admin/AdminComentariosPage'
import { AdminReciaFormsPage } from '@/pages/admin/AdminReciaFormsPage'
import { AdminDispositivosPage } from '@/pages/admin/AdminDispositivosPage'
import { AdminAcessosPage } from '@/pages/admin/AdminAcessosPage'
import { AdminLgpdPage } from '@/pages/admin/AdminLgpdPage'
import { AdminErrosPage } from '@/pages/admin/AdminErrosPage'
import { AdminLinksPage } from '@/pages/admin/AdminLinksPage'

// Porteiro da raiz: o dominio principal mostra a landing/portfolio;
// os subdominios de area (academy/admin/crew) vao direto pro login tematico.
function RootGate() {
  // O domínio raiz exibe a página "Em Breve". A home institucional vive em
  // /home-bold-studio-sinop-brasil (acessível via /home, que redireciona pra ela).
  // Os subdomínios de área (academy/admin/crew) seguem direto pro login temático.
  return getArea() === 'public' ? <ComingSoon /> : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
        <PulsatingLoader />
        <CookieBar />
        <Routes>
          {/* publicas */}
          <Route path="/" element={<RootGate />} />
          <Route path="/home" element={<Navigate to="/home-bold-studio-sinop-brasil" replace />} />
          <Route path="/home-bold-studio-sinop-brasil" element={<HomeInstitucionalPage />} />
          <Route path="/landing" element={<LandingPage />} />
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
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/sucesso" element={<SucessoPage />} />

          {/* protegidas (aluno) */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/trilhas" element={<TrilhasPage />} />
            <Route path="/rota" element={<RotaPage />} />
            <Route path="/arsenal" element={<ArsenalPage />} />
            <Route path="/conquistas" element={<ConquistasPage />} />
            <Route path="/evolucao" element={<EvolucaoPage />} />
            <Route path="/modulo/:id" element={<ModuloPage />} />
            <Route path="/aula/:id" element={<AulaPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/certificado" element={<CertificadoPage />} />
          </Route>

          {/* admin */}
          <Route
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/modulos" element={<AdminModulosListPage />} />
            <Route path="/admin/modulos/:id" element={<AdminModuloEditPage />} />
            <Route path="/admin/aulas/:id" element={<AdminAulaEditPage />} />
            <Route path="/admin/alunos" element={<AdminAlunosPage />} />
            <Route path="/admin/comentarios" element={<AdminComentariosPage />} />
            <Route path="/admin/recia" element={<AdminReciaFormsPage />} />
            <Route path="/admin/dispositivos" element={<AdminDispositivosPage />} />
            <Route path="/admin/acessos" element={<AdminAcessosPage />} />
            <Route path="/admin/lgpd" element={<AdminLgpdPage />} />
            <Route path="/admin/erros" element={<AdminErrosPage />} />
            <Route path="/admin/links" element={<AdminLinksPage />} />
          </Route>

          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
