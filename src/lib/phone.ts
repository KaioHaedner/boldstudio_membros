// Mascara WhatsApp BR: +55 (DDD) 9XXXX-XXXX

export function maskWhatsapp(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 13)
  if (digits.length === 0) return ''

  // Sem codigo do pais (assume +55)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

export function isValidWhatsapp(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 11
}
