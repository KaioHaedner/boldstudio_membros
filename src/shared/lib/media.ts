// Monta as URLs do proxy de mídia, que esconde qual
// projeto Supabase está por trás de cada bucket. Ver api/media.ts.
//
// VERSAO entra como query string só para mudar a chave de cache da borda.
// Suba esse número quando precisar descartar o que está cacheado lá: as
// respostas saem com `immutable` e um ano de validade, então sem trocar a URL
// não há como invalidar. Foi necessário uma vez porque o proxy chegou a
// cachear resposta parcial (206) na chave do arquivo inteiro, e todo mundo
// passou a receber 1KB de um vídeo de 13MB.
const VERSAO = '2'

// Always use this deployment's same-origin proxy. A separate api.bold host
// fragmented caches and tied previews to production. Storage origins remain
// server-side in api/media.ts; static build media uses local /media paths.
const BASE = '/api/media'

/** URL completa de um arquivo. */
export function media(bucket: string, arquivo: string) {
  return `${BASE}?b=${encodeURIComponent(bucket)}&v=${VERSAO}&f=${encodeURIComponent(arquivo)}`
}

/** Prefixo para quem concatena o nome do arquivo depois. */
export function mediaBase(bucket: string) {
  return `${BASE}?b=${encodeURIComponent(bucket)}&v=${VERSAO}&f=`
}
