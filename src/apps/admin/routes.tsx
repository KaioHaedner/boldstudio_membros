import { Route } from 'react-router-dom'
import { AdminDashboardPage } from '@/apps/admin/pages/AdminDashboardPage'
import { AdminModulosListPage } from '@/apps/admin/pages/AdminModulosListPage'
import { AdminModuloEditPage } from '@/apps/admin/pages/AdminModuloEditPage'
import { AdminAulaEditPage } from '@/apps/admin/pages/AdminAulaEditPage'
import { AdminAlunosPage } from '@/apps/admin/pages/AdminAlunosPage'
import { AdminComentariosPage } from '@/apps/admin/pages/AdminComentariosPage'
import { AdminReciaFormsPage } from '@/apps/admin/pages/AdminReciaFormsPage'
import { AdminDispositivosPage } from '@/apps/admin/pages/AdminDispositivosPage'
import { AdminAcessosPage } from '@/apps/admin/pages/AdminAcessosPage'
import { AdminLgpdPage } from '@/apps/admin/pages/AdminLgpdPage'
import { AdminErrosPage } from '@/apps/admin/pages/AdminErrosPage'
import { AdminLinksPage } from '@/apps/admin/pages/AdminLinksPage'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { AdminLayout } from '@/apps/admin/components/AdminLayout'

export function adminRoutes() {
  return (
    <>
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


    </>
  )
}
