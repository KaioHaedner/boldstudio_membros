export const config = { runtime: 'edge' }

// Página de cada tratamento com as metatags de compartilhamento (Open Graph e
// Twitter) já no HTML. O site é uma SPA: WhatsApp, LinkedIn e Slack não rodam
// JavaScript, então sem isto todo link mostraria o título e a imagem da home.
// A função busca o index.html do próprio deploy e troca só o <head>; o app
// carrega normalmente por cima.
const SITE = 'https://boldstudiobrasil.com'

const TRATAMENTOS: Record<string, { titulo: string; descricao: string; imagem: string; alt: string }> = {
  'john-deere': {
    titulo: 'Tratamento de roteiro · John Deere Brasil',
    descricao:
      'Como a Bold Studio pretende filmar o reality: qualidade visual de cinema, narrativa cativante e câmera viva, bloco a bloco, com referências e linguagem de cena.',
    imagem: `${SITE}/brand/og-tratamento-john-deere.jpg`,
    alt: 'Tratamento de roteiro John Deere Brasil, por Bold Studio, sobre colheitadeira ao pôr do sol',
  },
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export default async function handler(req: Request) {
  const url = new URL(req.url)
  const cliente = (url.searchParams.get('c') ?? '').toLowerCase()
  const base = await fetch(new URL('/index.html', url.origin))
  let html = await base.text()

  const t = TRATAMENTOS[cliente]
  if (t) {
    const canonica = `${SITE}/tratamento/${cliente}`
    html = html
      .replace(/<title>[\s\S]*?<\/title>/, '')
      .replace(/<meta\s+(?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)"[\s\S]*?\/>/g, '')
      .replace(/<link\s+rel="canonical"[^>]*>/, '')
    const bloco = `
    <title>${esc(t.titulo)} | Bold Studio</title>
    <meta name="description" content="${esc(t.descricao)}" />
    <meta name="robots" content="noindex, nofollow" />
    <link rel="canonical" href="${canonica}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Bold Studio Brasil" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="${esc(t.titulo)}" />
    <meta property="og:description" content="${esc(t.descricao)}" />
    <meta property="og:url" content="${canonica}" />
    <meta property="og:image" content="${t.imagem}" />
    <meta property="og:image:secure_url" content="${t.imagem}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(t.alt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(t.titulo)}" />
    <meta name="twitter:description" content="${esc(t.descricao)}" />
    <meta name="twitter:image" content="${t.imagem}" />
    <meta name="twitter:image:alt" content="${esc(t.alt)}" />
`
    html = html.replace('</head>', `${bloco}  </head>`)
  }

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
    },
  })
}
