import { Navigate, Route } from 'react-router-dom'
import { ServicoPage } from '@/apps/site/pages/ServicoPage'
import { LandingPage } from '@/apps/site/pages/LandingPage'
import { HomeInstitucionalPage } from '@/apps/site/pages/HomeInstitucionalPage'
import { ProjetoClientePage } from '@/apps/site/pages/ProjetoClientePage'
import { CheckoutPage } from '@/apps/site/pages/CheckoutPage'
import { SucessoPage } from '@/apps/site/pages/SucessoPage'


export function siteRoutes() {
  return (
    <>
          <Route path="/home" element={<Navigate to="/home-bold-studio-sinop-brasil" replace />} />
          <Route path="/home-bold-studio-sinop-brasil" element={<HomeInstitucionalPage />} />
          <Route path="/servico/:slug" element={<ServicoPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/sucesso" element={<SucessoPage />} />
          <Route path="/:projetoSlug" element={<ProjetoClientePage />} />
    </>
  )
}
