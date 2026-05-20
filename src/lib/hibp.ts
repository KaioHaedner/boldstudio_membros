// HaveIBeenPwned Password API (k-anonymity).
// Hash SHA-1 → manda os 5 primeiros chars (prefix) → recebe suffixes que casam.
// Privacy-preserving: servidor nunca ve a senha nem o hash completo.

async function sha1Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-1', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

/**
 * Verifica se a senha aparece em vazamentos publicos.
 * Retorna o numero de vezes que apareceu (0 = segura, > 0 = vazou, -1 = erro de rede).
 */
export async function checkPwnedPassword(password: string): Promise<number> {
  if (!password || password.length < 4) return 0

  try {
    const hash = await sha1Hex(password)
    const prefix = hash.slice(0, 5)
    const suffix = hash.slice(5)

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true' },
    })
    if (!res.ok) return -1

    const text = await res.text()
    for (const line of text.split('\n')) {
      const [s, count] = line.trim().split(':')
      if (s === suffix) return Number.parseInt(count, 10) || 1
    }
    return 0
  } catch {
    return -1
  }
}
