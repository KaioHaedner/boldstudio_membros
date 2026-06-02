// Estado do 2FA no dispositivo. Limpo a cada novo login (senha) e no logout;
// setado apos validar o codigo OTP. Persiste enquanto a sessao do navegador viver.
const KEY = 'bold:2fa-ok'

export function is2faVerified(): boolean {
  return localStorage.getItem(KEY) === 'true'
}

export function set2faVerified(): void {
  localStorage.setItem(KEY, 'true')
}

export function clear2fa(): void {
  localStorage.removeItem(KEY)
}
