// Fonte unica dos clientes da Bold. Usada na home (ClientesWave) e nas paginas
// individuais (/projeto-:slug). Conforme novos assets chegarem (site, telefone,
// fotos de evento, demoreel), e so preencher aqui — a UI se adapta sozinha.
//
// Ordem dos clientes COM video = ordem do carrossel de Cases (CasesCarrossel
// so usa videos[0]). Sequencia pedida pelo Kaio em 2026-08-18: AgroBaggio,
// Machado, Unimed, Paiol, Exponorte, Forteza, DuoTorri, Sonhalto Paranoa —
// depois os clientes antigos (Madô Burguer, Grupo Sinop) que nao fazem parte
// dessa leva nova.

const LOGO = 'https://erhtqgaxibncpondscna.supabase.co/storage/v1/object/public/CLIENTES_CONTEINER/'
const VID = 'https://erhtqgaxibncpondscna.supabase.co/storage/v1/object/public/CLIENTES_CONTEINER_PREVIA_VD/'
// Novos vídeos de case (2026-08-18), bucket do Supabase novo (infra em migração, ver Bold Studio no vault)
const VID_NEW = 'https://heriogfvynncvabbwspu.supabase.co/storage/v1/object/public/Videos_Cliente_New/'
// Placeholder pra clientes novos sem logo ainda — troca quando o Kaio mandar a logo real
const LOGO_PLACEHOLDER = '/brand/logo-boldstudio.webp'

export type Depoimento = { autor: string; texto: string }

export type Cliente = {
  slug: string
  nome: string
  logo: string
  area?: string
  telefone?: string
  site?: string
  // previews .mp4 (rodam em loop cortado em 10s nos mockups de celular)
  videos: string[]
  // fotos de eventos (galeria com hover bold). Vazio ate ter os assets.
  eventos?: string[]
  depoimento?: Depoimento
}

export const CLIENTES: Cliente[] = [
  {
    slug: 'agro-baggio-john-deere',
    nome: 'John Deere · Agro Baggio',
    logo: `${LOGO}AGROBAGGIO_JHONDEERE_LOGO_CLIENTES.png`,
    area: 'Máquinas Agrícolas',
    videos: [`${VID_NEW}agrobaggio-cine.mp4`, `${VID_NEW}showsafra-aftermovie.mp4`],
    depoimento: {
      autor: 'Carlos Felipe',
      texto: 'A parceria com a Bold foi fator determinante na nova imagem da AgroBaggio. Investir em produtos e treinamento sempre foi um pilar da nossa empresa, mas comunicar com um material impactante muda a percepção do nosso cliente.',
    },
  },
  {
    slug: 'machado-supermercados',
    nome: 'Machado Supermercados',
    logo: `${LOGO}GRUPOMACHADO_LOGO_CLEINTES.png`,
    area: 'Supermercados',
    videos: [`${VID_NEW}machado-copa.mp4`],
  },
  { slug: 'unimed', nome: 'Unimed', logo: LOGO_PLACEHOLDER, area: 'Saúde', videos: [`${VID_NEW}unimed-institucional.mp4`] },
  { slug: 'paiol-agricola', nome: 'Paiol Agrícola', logo: `${LOGO}PAIOL_LOGO_CLIENTES.png`, area: 'Agronegócio', videos: [`${VID_NEW}paiol-cine.mp4`] },
  { slug: 'exponorte', nome: 'Exponorte', logo: `${LOGO}EXPORNORTE_LOGO_CLIENTES.png`, area: 'Feira · Agronegócio', videos: [`${VID_NEW}exponorte-aftermovie.mp4`] },
  {
    slug: 'forteza',
    nome: 'Forteza',
    logo: `${LOGO}FORTEZA_LOGO_CLIENTES.png`,
    videos: [`${VID_NEW}forteza-video-principal.mp4`],
    depoimento: {
      autor: 'Cesar Caneppele',
      texto: 'O material da Bold literalmente mudou a cara do Forteza. Conseguiram mostrar nossos produtos da maneira como nós sempre imaginamos. Foi um grande passo no que pensamos ser o futuro da nossa marca.',
    },
  },
  { slug: 'duotorri', nome: 'DuoTorri', logo: LOGO_PLACEHOLDER, videos: [`${VID_NEW}duotorri-lancamento-cine.mp4`] },
  { slug: 'sonhalto-paranoa', nome: 'Sonhalto Paranoá', logo: LOGO_PLACEHOLDER, videos: [`${VID_NEW}sonhalto-paranoa.mp4`] },

  // Clientes com video mas fora da leva nova de hoje — ficam depois na ordem do carrossel
  { slug: 'mado-burguer', nome: 'Madô Burguer', logo: `${LOGO}MADO%20BURGUER_CLEINTES.png`, area: 'Hamburgueria', videos: [`${VID}MADO_BURGUER_.mp4`] },
  {
    slug: 'grupo-sinop',
    nome: 'Grupo Sinop',
    logo: `${LOGO}GRUPOSINOP_LOGO_CLIENTES.png`,
    area: 'Agronegócio',
    videos: [`${VID}GRUPOSINOP_.mp4`, `${VID}GRUPOSINOP_02_.mp4`],
    depoimento: {
      autor: 'Danilo Cardoso',
      texto: 'A transformação da comunicação do Grupo Sinop no último ano foi gigante, e a Bold com certeza contribuiu muito para isso. Nosso posicionamento mudou, nossos produtos evoluíram e comunicar isso ao mercado de forma profissional teve influência direta no nosso resultado.',
    },
  },

  // Clientes sem video ainda (logo só entra na marquee de Clientes, não no carrossel de Cases)
  { slug: 'shopping-sinop', nome: 'Shopping Sinop', logo: `${LOGO}SHOPPING_SINOP_LOGO_CLIENTES.png`, area: 'Shopping Center', videos: [] },
  { slug: 'frialto', nome: 'Frialto', logo: `${LOGO}FRIALTO_LOGO_CLIENTES.png`, area: 'Frigorífico', videos: [] },
  { slug: 'jmd-urbanismo', nome: 'JMD Urbanismo', logo: `${LOGO}JMD_LOGO_CLIENTES.png`, area: 'Urbanismo', videos: [] },
  { slug: 'fobel', nome: 'Fobel', logo: `${LOGO}FOBEL_LOGO_CLIENTES.png`, videos: [] },
  { slug: 'biancon', nome: 'Grupo Biancon', logo: `${LOGO}BIANCON_LOGO_CLIENTES.png`, videos: [] },
  { slug: 'embrapa', nome: 'Embrapa', logo: `${LOGO}EMBRAPA_LOGO_CLEINTES.png`, area: 'Pesquisa Agropecuária', videos: [] },
  { slug: 'parrilla-do-campo', nome: 'Parrilla do Campo', logo: `${LOGO}PARRILHA_DO_CAMPO_LOGO_CLIENTES.png`, area: 'Gastronomia', videos: [] },
]

export function getClienteBySlug(slug: string): Cliente | undefined {
  return CLIENTES.find((c) => c.slug === slug)
}
