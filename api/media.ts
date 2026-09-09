export const config = { runtime: 'edge' }

// Mapa bucket -> projeto Supabase de origem (nunca exposto ao cliente: só
// existe aqui, no servidor). Evita expor o project ref do Supabase (antigo ou
// novo) no bundle JS ou na aba Rede do navegador.
//
// Rota estática (sem segmento dinâmico [...path]) de propósito: o Vercel tem
// um bug de roteamento com funções catch-all multi-segmento em projetos sem
// framework Next.js (a conversão automática só cobre 1 segmento e cai em 404
// pros demais) — bucket/arquivo vêm por query string em vez de path.
const BUCKET_ORIGIN: Record<string, string> = {
  avatars: 'https://erhtqgaxibncpondscna.supabase.co',
  CLIENTES_CONTEINER: 'https://erhtqgaxibncpondscna.supabase.co',
  CLIENTES_CONTEINER_PREVIA_VD: 'https://erhtqgaxibncpondscna.supabase.co',
  Fotos_CREW_COLORIDAS: 'https://erhtqgaxibncpondscna.supabase.co',
  PROCESSO: 'https://erhtqgaxibncpondscna.supabase.co',
  brand: 'https://erhtqgaxibncpondscna.supabase.co',
  Videos_Cliente_New: 'https://heriogfvynncvabbwspu.supabase.co',
}

// O Supabase antigo (erhtqgaxibncpondscna, sem acesso ao dashboard) falha de
// forma intermitente (timeout/503). Tenta de novo antes de desistir, em vez
// de propagar a falha transitória pro navegador na primeira tentativa.
async function fetchWithRetry(target: string, headers: HeadersInit, attempts = 3) {
  let lastError: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(target, { headers })
      const retryable = res.status >= 500 || res.status === 429
      if (!retryable || i === attempts - 1) return res
      lastError = new Error(`upstream ${res.status}`)
    } catch (err) {
      lastError = err
      if (i === attempts - 1) throw lastError
    }
    await new Promise((r) => setTimeout(r, 300 * (i + 1)))
  }
  throw lastError
}

export default async function handler(req: Request) {
  const url = new URL(req.url)
  const bucket = url.searchParams.get('b') ?? ''
  const file = url.searchParams.get('f') ?? ''
  const origin = BUCKET_ORIGIN[bucket]

  if (!origin || !file) {
    return new Response('Not found', { status: 404 })
  }

  const target = `${origin}/storage/v1/object/public/${bucket}/${encodeURIComponent(file)}`

  const upstreamHeaders: HeadersInit = {}
  const range = req.headers.get('range')
  if (range) upstreamHeaders['range'] = range

  let upstream: Response
  try {
    upstream = await fetchWithRetry(target, upstreamHeaders)
  } catch {
    return new Response('Upstream unavailable', { status: 502 })
  }

  if (!upstream.ok && upstream.status !== 206) {
    return new Response('Upstream error', { status: upstream.status })
  }

  const headers = new Headers()
  headers.set('Content-Type', upstream.headers.get('content-type') ?? 'application/octet-stream')
  const contentLength = upstream.headers.get('content-length')
  if (contentLength) headers.set('Content-Length', contentLength)
  const contentRange = upstream.headers.get('content-range')
  if (contentRange) headers.set('Content-Range', contentRange)
  headers.set('Accept-Ranges', 'bytes')
  // s-maxage cacheia na borda da Vercel (não só no navegador do visitante) —
  // depois do primeiro sucesso, visitas seguintes nem chegam a bater no
  // Supabase instável.
  headers.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable')
  headers.set('Access-Control-Allow-Origin', '*')

  return new Response(upstream.body, { status: upstream.status, headers })
}
