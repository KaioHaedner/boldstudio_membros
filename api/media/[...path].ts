export const config = { runtime: 'edge' }

// Mapa bucket -> projeto Supabase de origem (nunca exposto ao cliente: só
// existe aqui, no servidor). Evita expor o project ref do Supabase (antigo ou
// novo) no bundle JS ou na aba Rede do navegador.
const BUCKET_ORIGIN: Record<string, string> = {
  avatars: 'https://erhtqgaxibncpondscna.supabase.co',
  CLIENTES_CONTEINER: 'https://erhtqgaxibncpondscna.supabase.co',
  CLIENTES_CONTEINER_PREVIA_VD: 'https://erhtqgaxibncpondscna.supabase.co',
  Fotos_CREW_COLORIDAS: 'https://erhtqgaxibncpondscna.supabase.co',
  PROCESSO: 'https://erhtqgaxibncpondscna.supabase.co',
  brand: 'https://erhtqgaxibncpondscna.supabase.co',
  Videos_Cliente_New: 'https://heriogfvynncvabbwspu.supabase.co',
}

export default async function handler(req: Request) {
  const url = new URL(req.url)
  const parts = url.pathname.replace(/^\/api\/media\//, '').split('/')
  const bucket = parts[0]
  const objectPath = parts.slice(1).join('/')
  const origin = BUCKET_ORIGIN[bucket]

  if (!origin || !objectPath) {
    return new Response('Not found', { status: 404 })
  }

  const target = `${origin}/storage/v1/object/public/${bucket}/${objectPath}`

  const upstreamHeaders: HeadersInit = {}
  const range = req.headers.get('range')
  if (range) upstreamHeaders['range'] = range

  const upstream = await fetch(target, { headers: upstreamHeaders })

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
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  headers.set('Access-Control-Allow-Origin', '*')

  return new Response(upstream.body, { status: upstream.status, headers })
}
