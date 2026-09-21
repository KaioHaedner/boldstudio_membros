// Slugs das páginas de serviço, na MESMA ordem de t.servicos.produtos. Ficam
// fora do i18n de propósito: a URL não muda quando o visitante troca de idioma,
// e link compartilhado continua valendo.
export const SERVICO_SLUGS = [
  'vt-comercial',
  'institucionais',
  'eventos',
  'food-produto',
  'recorrencia',
] as const

export type ServicoSlug = (typeof SERVICO_SLUGS)[number]

export function isServicoSlug(valor: string | undefined): valor is ServicoSlug {
  return !!valor && (SERVICO_SLUGS as readonly string[]).includes(valor)
}
