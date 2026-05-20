import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppLayout } from '@/components/AppLayout'
import { CursorFollower } from '@/components/CursorFollower'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { CadastroPage } from '@/pages/CadastroPage'
import { RecuperarSenhaPage } from '@/pages/RecuperarSenhaPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ModuloPage } from '@/pages/ModuloPage'
import { AulaPage } from '@/pages/AulaPage'
import { PerfilPage } from '@/pages/PerfilPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CursorFollower />
        <Routes>
          {/* publicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />

          {/* protegidas */}
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
          </Route>

          {/* compatibilidade com hash antiga / SPA fallback */}
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
