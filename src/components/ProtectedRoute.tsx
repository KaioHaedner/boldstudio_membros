import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader } from '@/components/Loader'
import { is2faVerified } from '@/lib/twoFactor'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loader fullscreen />

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // 2FA obrigatorio: com sessao mas sem o codigo validado, vai pro /2fa.
  if (!is2faVerified()) {
    return <Navigate to="/2fa" replace />
  }

  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
