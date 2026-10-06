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
  const unsafeFile = file.includes('\\') || Array.from(file).some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)

  if (!origin || !file || file.length > 2048 || unsafeFile || file.split('/').some((part) => !part || part === '.' || part === '..')) {
    return new Response(req.method === 'HEAD' ? null : 'Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })
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
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    // One attempt per browser request: an outage must not double Storage work.
    // Keep the independent timeout signal: coupling it to req.signal caused
    // aborted upstream requests on the production Edge runtime previously.
    upstream = await fetch(target, { method: req.method, headers: upstreamHeaders,
      signal: controller.signal, redirect: 'follow' })
  } catch (error) {
    const code = controller.signal.aborted ? 'timeout' : 'fetch-failed'
    console.error('[media] upstream fetch failed', { code, bucket, error: error instanceof Error ? error.name : 'UnknownError' })
    return new Response(req.method === 'HEAD' ? null : 'Upstream unavailable', { status: 502, headers: { 'Cache-Control': 'no-store', 'X-Media-Error': code } })
  } finally {
    clearTimeout(timeout)
  }

  if (!upstream.ok && upstream.status !== 304) {
    const headers = new Headers({ 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' })
    if (upstream.status === 416 && upstream.headers.has('content-range')) headers.set('Content-Range', upstream.headers.get('content-range')!)
    await upstream.body?.cancel()
    return new Response(req.method === 'HEAD' ? null : 'Upstream error', { status: upstream.status, headers })
  }

  const headers = new Headers()
  headers.set('Content-Type', upstream.headers.get('content-type') ?? 'application/octet-stream')
  headers.set('X-Content-Type-Options', 'nosniff')
  const contentLength = upstream.headers.get('content-length')
  // Fetch can decompress an encoded upstream body. Its wire length would no
  // longer match the bytes forwarded by this response.
  if (contentLength && !upstream.headers.has('content-encoding')) headers.set('Content-Length', contentLength)
  const contentRange = upstream.headers.get('content-range')
  if (contentRange) headers.set('Content-Range', contentRange)
  const acceptRanges = upstream.headers.get('accept-ranges')
  if (acceptRanges || upstream.status === 206) headers.set('Accept-Ranges', acceptRanges || 'bytes')
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, ETag, Last-Modified')
  for (const name of ['etag', 'last-modified']) {
    const value = upstream.headers.get(name)
    if (value) headers.set(name, value)
  }

  // Vercel does not cache Function Range requests or objects >10 MB. Keep
  // partial responses in the browser only, including when an origin ignores
  // Range and returns 200. HEAD/304 metadata must not seed a bodyless CDN entry.
  // Static public previews served from /media avoid this upstream altogether.
  if (range || upstream.status === 206) {
    headers.set('Cache-Control', 'private, max-age=31536000')
    headers.set('Vary', 'Range')
    headers.set('CDN-Cache-Control', 'no-store')
    headers.set('Vercel-CDN-Cache-Control', 'no-store')
  } else if (req.method === 'HEAD' || upstream.status === 304) {
    headers.set('Cache-Control', 'private, max-age=31536000')
    headers.set('CDN-Cache-Control', 'no-store')
    headers.set('Vercel-CDN-Cache-Control', 'no-store')
  } else {
    // Resposta inteira pode ficar na borda: depois do primeiro sucesso as
    // visitas seguintes nem chegam a bater no Supabase instável.
    headers.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable')
  }

  return new Response(req.method === 'HEAD' || upstream.status === 304 ? null : upstream.body, { status: upstream.status, headers })
}
