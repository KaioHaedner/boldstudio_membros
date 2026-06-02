import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppLayout } from '@/components/AppLayout'
import { AdminLayout } from '@/components/AdminLayout'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { CadastroPage } from '@/pages/CadastroPage'
import { RecuperarSenhaPage } from '@/pages/RecuperarSenhaPage'
import { RedefinirSenhaPage } from '@/pages/RedefinirSenhaPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { SucessoPage } from '@/pages/SucessoPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ModuloPage } from '@/pages/ModuloPage'
import { AulaPage } from '@/pages/AulaPage'
import { PerfilPage } from '@/pages/PerfilPage'
import { CertificadoPage } from '@/pages/CertificadoPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminModulosListPage } from '@/pages/admin/AdminModulosListPage'
import { AdminModuloEditPage } from '@/pages/admin/AdminModuloEditPage'
import { AdminAulaEditPage } from '@/pages/admin/AdminAulaEditPage'
import { AdminAlunosPage } from '@/pages/admin/AdminAlunosPage'
import { AdminComentariosPage } from '@/pages/admin/AdminComentariosPage'
import { AdminDispositivosPage } from '@/pages/admin/AdminDispositivosPage'
import { AdminAcessosPage } from '@/pages/admin/AdminAcessosPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* publicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
          <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
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
            <Route path="/admin/dispositivos" element={<AdminDispositivosPage />} />
            <Route path="/admin/acessos" element={<AdminAcessosPage />} />
          </Route>

          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
