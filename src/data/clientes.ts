// Fonte unica dos clientes da Bold. Usada na home (ClientesWave) e nas paginas
// individuais (/projeto-:slug). Conforme novos assets chegarem (site, telefone,
// fotos de evento, demoreel), e so preencher aqui — a UI se adapta sozinha.

const LOGO = 'https://erhtqgaxibncpondscna.supabase.co/storage/v1/object/public/CLIENTES_CONTEINER/'
const VID = 'https://erhtqgaxibncpondscna.supabase.co/storage/v1/object/public/CLIENTES_CONTEINER_PREVIA_VD/'

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
  { slug: 'shopping-sinop', nome: 'Shopping Sinop', logo: `${LOGO}SHOPPING_SINOP_LOGO_CLIENTES.png`, area: 'Shopping Center', videos: [] },
  { slug: 'frialto', nome: 'Frialto', logo: `${LOGO}FRIALTO_LOGO_CLIENTES.png`, area: 'Frigorífico', videos: [] },
  {
    slug: 'forteza',
    nome: 'Forteza',
    logo: `${LOGO}FORTEZA_LOGO_CLIENTES.png`,
    videos: [`${VID}FORTEZA_.mp4`],
    depoimento: {
      autor: 'Cesar Caneppele',
      texto: 'O material da Bold literalmente mudou a cara do Forteza. Conseguiram mostrar nossos produtos da maneira como nós sempre imaginamos. Foi um grande passo no que pensamos ser o futuro da nossa marca.',
    },
  },
  { slug: 'jmd-urbanismo', nome: 'JMD Urbanismo', logo: `${LOGO}JMD_LOGO_CLIENTES.png`, area: 'Urbanismo', videos: [] },
  { slug: 'fobel', nome: 'Fobel', logo: `${LOGO}FOBEL_LOGO_CLIENTES.png`, videos: [] },
  { slug: 'biancon', nome: 'Grupo Biancon', logo: `${LOGO}BIANCON_LOGO_CLIENTES.png`, videos: [] },
  { slug: 'embrapa', nome: 'Embrapa', logo: `${LOGO}EMBRAPA_LOGO_CLEINTES.png`, area: 'Pesquisa Agropecuária', videos: [] },
  {
    slug: 'machado-supermercados',
    nome: 'Machado Supermercados',
    logo: `${LOGO}GRUPOMACHADO_LOGO_CLEINTES.png`,
    area: 'Supermercados',
    videos: [`${VID}MACHADO_.mp4`, `${VID}MACHADO_02_.mp4`],
  },
  { slug: 'mado-burguer', nome: 'Madô Burguer', logo: `${LOGO}MADO%20BURGUER_CLEINTES.png`, area: 'Hamburgueria', videos: [`${VID}MADO_BURGUER_.mp4`] },
  {
    slug: 'agro-baggio-john-deere',
    nome: 'John Deere · Agro Baggio',
    logo: `${LOGO}AGROBAGGIO_JHONDEERE_LOGO_CLIENTES.png`,
    area: 'Máquinas Agrícolas',
    videos: [`${VID}AGRO_BAGGIO_JHON_DEERE_.mp4`, `${VID}AGRO_BAGGIO_JHON_DEERE_02_.mp4`],
    depoimento: {
      autor: 'Carlos Felipe',
      texto: 'A parceria com a Bold foi fator determinante na nova imagem da AgroBaggio. Investir em produtos e treinamento sempre foi um pilar da nossa empresa, mas comunicar com um material impactante muda a percepção do nosso cliente.',
    },
  },
  { slug: 'parrilla-do-campo', nome: 'Parrilla do Campo', logo: `${LOGO}PARRILHA_DO_CAMPO_LOGO_CLIENTES.png`, area: 'Gastronomia', videos: [] },
  { slug: 'exponorte', nome: 'Exponorte', logo: `${LOGO}EXPORNORTE_LOGO_CLIENTES.png`, area: 'Feira · Agronegócio', videos: [`${VID}EXPORNORTE_.mp4`] },
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
  { slug: 'paiol-agricola', nome: 'Paiol Agrícola', logo: `${LOGO}PAIOL_LOGO_CLIENTES.png`, area: 'Agronegócio', videos: [`${VID}PAIOL_AGRICOLA_.mp4`, `${VID}PAIOL_AGRICOLA_02_.mp4`] },
]

export function getClienteBySlug(slug: string): Cliente | undefined {
  return CLIENTES.find((c) => c.slug === slug)
}
