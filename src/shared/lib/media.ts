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

// Na cópia e nos previews, usa o proxy do próprio deployment. Para manter
// um host de mídia separado, configure VITE_MEDIA_BASE_URL no ambiente.
const BASE = import.meta.env.VITE_MEDIA_BASE_URL || '/api/media'

/** URL completa de um arquivo. */
export function media(bucket: string, arquivo: string) {
  return `${BASE}?b=${bucket}&v=${VERSAO}&f=${arquivo}`
}

/** Prefixo para quem concatena o nome do arquivo depois. */
export function mediaBase(bucket: string) {
  return `${BASE}?b=${bucket}&v=${VERSAO}&f=`
}
