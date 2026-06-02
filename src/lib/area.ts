// Detecta qual area o usuario esta acessando pelo subdominio.
// admin.boldstudiobrasil.com -> admin | academy. -> academy | crew. -> crew | dominio raiz -> public
// Em dev (localhost/vercel.app) aceita override via ?area=admin para testar os temas.
export type Area = 'academy' | 'admin' | 'crew' | 'public'

export function getArea(): Area {
  if (typeof window === 'undefined') return 'public'
  const host = window.location.hostname
  if (host.startsWith('admin.')) return 'admin'
  if (host.startsWith('crew.')) return 'crew'
  if (host.startsWith('academy.') || host.startsWith('app.')) return 'academy'

  const q = new URLSearchParams(window.location.search).get('area')
  if (q === 'admin' || q === 'crew' || q === 'academy') return q
  return 'public'
}

// Destino pos-login conforme o papel do usuario.
export function homeForRole(role?: string | null): string {
  if (role === 'admin') return '/admin'
  if (role === 'crew') return '/crew'
  return '/dashboard'
}
