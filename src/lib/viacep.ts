export interface ViaCEPAddress {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  complemento?: string
  erro?: boolean
}

export function maskCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export async function fetchCEP(cep: string): Promise<ViaCEPAddress | null> {
  const digits = cep.replace(/\D/g, '')
  if (digits.length !== 8) return null
  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
    if (!res.ok) return null
    const data = (await res.json()) as ViaCEPAddress
    if (data.erro) return null
    return data
  } catch {
    return null
  }
}
