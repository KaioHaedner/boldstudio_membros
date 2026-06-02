import { supabase } from '@/lib/supabase'

// Identidade estavel do dispositivo (persiste no localStorage do aparelho).
const DEVICE_ID_KEY = 'bold:device-id'

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = (crypto.randomUUID?.() ?? `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}

export function detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const ua = navigator.userAgent
  if (/iPad|Tablet/i.test(ua)) return 'tablet'
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return 'mobile'
  return 'desktop'
}

export function deviceLabel(): string {
  const ua = navigator.userAgent
  let os = 'Dispositivo'
  if (/Windows/i.test(ua)) os = 'Windows'
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS'
  else if (/Mac/i.test(ua)) os = 'Mac'
  else if (/Android/i.test(ua)) os = 'Android'
  else if (/Linux/i.test(ua)) os = 'Linux'

  let browser = ''
  if (/Edg/i.test(ua)) browser = 'Edge'
  else if (/OPR|Opera/i.test(ua)) browser = 'Opera'
  else if (/Chrome/i.test(ua)) browser = 'Chrome'
  else if (/Firefox/i.test(ua)) browser = 'Firefox'
  else if (/Safari/i.test(ua)) browser = 'Safari'

  return browser ? `${browser} no ${os}` : os
}

// Registra/atualiza o dispositivo atual do usuario. Fire-and-forget (nunca trava o login).
export async function registerDevice(userId: string): Promise<void> {
  try {
    await supabase.from('device_sessions').upsert(
      {
        user_id: userId,
        device_id: getDeviceId(),
        device_label: deviceLabel(),
        device_type: detectDeviceType(),
        user_agent: navigator.userAgent,
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,device_id' }
    )
  } catch {
    /* silencioso: tracking nunca bloqueia o usuario */
  }
}

// Registra um evento de acesso (login, logout, etc). Fire-and-forget.
export async function logAccess(
  userId: string | null,
  email: string | null,
  action: string
): Promise<void> {
  try {
    await supabase.from('access_log').insert({
      user_id: userId,
      email,
      action,
      user_agent: navigator.userAgent,
    })
  } catch {
    /* silencioso */
  }
}
