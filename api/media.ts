export const config = { runtime: 'edge' }

// Mapa bucket -> projeto Supabase de origem (nunca exposto ao cliente: só
// existe aqui, no servidor). Evita expor o project ref do Supabase (antigo ou
// novo) no bundle JS ou na aba Rede do navegador.
//
// Rota estática (sem segmento dinâmico [...path]) de propósito: o Vercel tem
// um bug de roteamento com funções catch-all multi-segmento em projetos sem
// framework Next.js (a conversão automática só cobre 1 segmento e cai em 404
// pros demais) — bucket/arquivo vêm por query string em vez de path.
const LEGACY_ORIGIN = process.env.SUPABASE_MEDIA_LEGACY_URL || 'https://erhtqgaxibncpondscna.supabase.co'
const PRIMARY_ORIGIN = process.env.SUPABASE_MEDIA_PRIMARY_URL || 'https://heriogfvynncvabbwspu.supabase.co'

// Cada bucket conserva sua origem até que seus objetos tenham sido migrados.
// Trocar todas as URLs para o projeto novo não copia os arquivos armazenados.
const BUCKET_ORIGIN: Record<string, string> = {
  avatars: LEGACY_ORIGIN,
  CLIENTES_CONTEINER: LEGACY_ORIGIN,
  CLIENTES_CONTEINER_PREVIA_VD: LEGACY_ORIGIN,
  Fotos_CREW_COLORIDAS: LEGACY_ORIGIN,
  PROCESSO: LEGACY_ORIGIN,
  brand: LEGACY_ORIGIN,
  Videos_Cliente_New: PRIMARY_ORIGIN,
  ICONES_JORNADAS_SVG: PRIMARY_ORIGIN,
}

async function fetchWithRetry(target: string, init: RequestInit, attempts = 2) {
  let lastError: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(target, init)
      // Quota/rate-limit responses need intervention/backoff, not amplification.
      const retryable = res.status >= 500
      if (!retryable || i === attempts - 1) return res
      lastError = new Error(`upstream ${res.status}`)
      await res.body?.cancel()
    } catch (err) {
      lastError = err
      if (init.signal?.aborted) throw err
      if (i === attempts - 1) throw lastError
    }
    await new Promise((r) => setTimeout(r, 300 * (i + 1)))
  }
  throw lastError
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, If-Range, If-None-Match, If-Modified-Since',
    } })
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD, OPTIONS', 'Cache-Control': 'no-store' } })
  }
  const url = new URL(req.url)
  const bucket = url.searchParams.get('b') ?? ''
  const file = url.searchParams.get('f') ?? ''
  const origin = Object.hasOwn(BUCKET_ORIGIN, bucket) ? BUCKET_ORIGIN[bucket] : undefined

  if (!origin || !file || file.length > 2048 || file.split('/').some((part) => !part || part === '.' || part === '..')) {
    return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })
  }

  const target = `${origin}/storage/v1/object/public/${bucket}/${file.split('/').map(encodeURIComponent).join('/')}`

  const upstreamHeaders: HeadersInit = {}
  const range = req.headers.get('range')
  if (range) upstreamHeaders['range'] = range
  for (const name of ['if-range', 'if-none-match', 'if-modified-since']) {
    const value = req.headers.get(name)
    if (value) upstreamHeaders[name] = value
  }

  let upstream: Response
  try {
    upstream = await fetchWithRetry(target, { method: req.method, headers: upstreamHeaders,
      signal: req.signal, redirect: 'error' })
  } catch {
    return new Response('Upstream unavailable', { status: 502, headers: { 'Cache-Control': 'no-store' } })
  }

  if (!upstream.ok && upstream.status !== 304) {
    const headers = new Headers({ 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' })
    if (upstream.status === 416 && upstream.headers.has('content-range')) headers.set('Content-Range', upstream.headers.get('content-range')!)
    await upstream.body?.cancel()
    return new Response(req.method === 'HEAD' ? null : 'Upstream error', { status: upstream.status, headers })
  }

  const headers = new Headers()
  headers.set('Content-Type', upstream.headers.get('content-type') ?? 'application/octet-stream')
  const contentLength = upstream.headers.get('content-length')
  if (contentLength) headers.set('Content-Length', contentLength)
  const contentRange = upstream.headers.get('content-range')
  if (contentRange) headers.set('Content-Range', contentRange)
  headers.set('Accept-Ranges', 'bytes')
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, ETag, Last-Modified')
  for (const name of ['etag', 'last-modified']) {
    const value = upstream.headers.get(name)
    if (value) headers.set(name, value)
  }

  // A chave de cache da borda é a URL, que NÃO inclui o header Range. Cachear
  // uma resposta 206 aqui servia aquele pedaço para todo mundo: como todo
  // player de vídeo pede range, o primeiro visitante envenenava o cache e os
  // seguintes recebiam ~1KB de um MP4 de 13MB, que o navegador rejeita com
  // erro de formato. Por isso resposta parcial fica só no cache do navegador
  // (private), que sabe lidar com range, e nunca na borda compartilhada.
  if (upstream.status === 206) {
    headers.set('Cache-Control', 'private, max-age=31536000')
    headers.set('Vary', 'Range')
  } else {
    // Resposta inteira pode ficar na borda: depois do primeiro sucesso as
    // visitas seguintes nem chegam a bater no Supabase instável.
    headers.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable')
  }

  return new Response(req.method === 'HEAD' || upstream.status === 304 ? null : upstream.body, { status: upstream.status, headers })
}
