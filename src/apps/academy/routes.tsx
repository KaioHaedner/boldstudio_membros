import { Navigate, Route } from 'react-router-dom'
import { DashboardPage } from '@/apps/academy/pages/DashboardPage'
import { ModuloPage } from '@/apps/academy/pages/ModuloPage'
import { AulaPage } from '@/apps/academy/pages/AulaPage'
import { PerfilPage } from '@/apps/academy/pages/PerfilPage'
import { TrilhasPage } from '@/apps/academy/pages/TrilhasPage'
import { RotaPage } from '@/apps/academy/pages/RotaPage'
import { ArsenalPage } from '@/apps/academy/pages/ArsenalPage'
import { ConquistasPage } from '@/apps/academy/pages/ConquistasPage'
import { EvolucaoPage } from '@/apps/academy/pages/EvolucaoPage'
import { CertificadoPage } from '@/apps/academy/pages/CertificadoPage'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { AppLayout } from '@/apps/academy/components/AppLayout'

export function academyRoutes() {
  return (
    <>
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


          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
    </>
  )
}
