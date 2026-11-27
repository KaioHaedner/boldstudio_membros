// Tratamento de roteiro da John Deere (/projetos/apresentacao/jhondeere).
// Os GIFs do documento viraram MP4 curtos em loop (5 MB no total) e as fotos
// viraram WebP, tudo em /public/tratamento/john-deere. A ordem das mídias dentro
// de cada bloco pode ser trocada na própria página, pelo botão "Controle".

export type Midia = {
  id: string
  tipo: 'video' | 'imagem'
  // arquivo (mp4 para vídeo, webp para imagem) e quadro de capa do vídeo
  src: string
  poster: string
  // proporção original, para o mosaico não cortar a cena
  w: number
  h: number
}

export type BlocoTexto = {
  id: string
  menu: string
  eyebrow: string
  titulo: string
  paragrafos: string[]
  exemplo?: { fala: string; texto: string }[]
  // rótulo que deixa claro que as falas são sugestão, e a frase que as apresenta
  sugestao?: { rotulo: string; intro?: string }
  video?: string
  // aviso mostrado antes do vídeo (e por cima dele, por alguns segundos)
  aviso?: string
  // quantas mídias entram depois de cada parágrafo; "ultima" põe a última do
  // grupo em tela cheia (a de destaque), o padrão é a primeira
  grupos?: { n: number; cheia?: 'primeira' | 'ultima' | 'todas' | 'triangulo' | 'nenhuma' }[]
  // nota de rodapé no fim do bloco, sem imagem
  nota?: string
  midias: string[]
}

const PASTA = '/tratamento/john-deere/'

const DIMENSOES: Record<number, [number, number, 'video' | 'imagem']> = {
  1: [1431, 617, 'imagem'], 2: [1430, 610, 'imagem'], 3: [720, 278, 'video'], 4: [854, 386, 'video'],
  5: [720, 306, 'video'], 6: [854, 480, 'video'], 7: [720, 262, 'video'], 8: [854, 480, 'video'],
  9: [1920, 804, 'video'], 10: [1432, 522, 'imagem'], 11: [1432, 869, 'imagem'], 12: [854, 280, 'video'],
  13: [854, 480, 'video'], 14: [1432, 716, 'imagem'], 15: [854, 386, 'video'], 16: [854, 480, 'video'],
  17: [720, 406, 'video'], 18: [854, 364, 'video'], 19: [1432, 589, 'imagem'], 20: [1432, 805, 'imagem'],
  21: [1432, 597, 'imagem'], 22: [1429, 804, 'imagem'], 23: [1430, 710, 'imagem'], 24: [1429, 608, 'imagem'],
  25: [1432, 805, 'imagem'], 26: [720, 312, 'video'], 27: [1432, 932, 'imagem'], 28: [854, 348, 'video'],
  29: [852, 480, 'video'], 30: [720, 406, 'video'], 31: [720, 406, 'video'], 32: [854, 480, 'video'],
  33: [1432, 597, 'imagem'], 34: [854, 364, 'video'], 35: [1432, 537, 'imagem'],
  // referências de direção de fotografia (versão final do documento)
  41: [1429, 604, 'imagem'], 42: [1430, 608, 'imagem'], 43: [1429, 994, 'imagem'], 44: [1432, 568, 'imagem'], 45: [1429, 804, 'imagem'],
}

export const MIDIAS: Record<string, Midia> = Object.fromEntries(
  Object.entries(DIMENSOES).map(([n, [w, h, tipo]]) => [
    `m${n}`,
    {
      id: `m${n}`,
      tipo,
      src: `${PASTA}image${n}.${tipo === 'video' ? 'mp4' : 'webp'}`,
      poster: `${PASTA}image${n}.webp`,
      w,
      h,
    },
  ]),
)

const seq = (de: number, ate: number) => Array.from({ length: ate - de + 1 }, (_, i) => `m${de + i}`)

// Slide "Sobre nós", entre a logo da Bold e o trator
export const SOBRE = {
  eyebrow: 'Sobre nós',
  titulo: 'Nascidos no agro!',
  texto:
    'Viemos do celeiro do Brasil, temos o pé no chão da fazenda, entendemos a linguagem e vivemos os desafios desse ambiente todos os dias.',
  foto: '/tratamento/john-deere/sobre-bold.webp',
}

export const CAPA = {
  titulo: 'Tratamento de roteiro',
  cliente: 'John Deere',
  texto:
    'Muito obrigado pela oportunidade de fazermos parte desse projeto lindo, queremos trazer uma visão nova sobre o formato, agregando uma qualidade visual de cinema, mas mantendo a narrativa cativante do reality.',
  midia: 'm1',
}

// Textos conforme a versão final do documento do Pedro (só a grafia corrigida).
export const BLOCOS: BlocoTexto[] = [
  {
    id: 'tom',
    menu: 'Tom',
    eyebrow: 'Tom & Storytelling',
    titulo: 'Reality com cara de documentário',
    paragrafos: [
      'A ideia central é desenvolver um roteiro de blocos fixos que embalem e deem ritmo ao formato de reality, mas com uma roupagem de documentário padrão Netflix.',
      'Os blocos se alternam entre cenas mais elaboradas (montadas), como os depoimentos, e momentos de “câmera viva” acompanhando os personagens entre as transições de cenários e momentos.',
    ],
    aviso: 'O vídeo abaixo não representa o pace/ritmo que queremos desenvolver, mas tem fotografia e ângulos que mostram bem nossa visão.',
    video: 'I19VL_2BruA',
    midias: [],
  },
  {
    id: 'b1',
    menu: 'Bloco 1',
    eyebrow: 'Bloco 1',
    titulo: 'Chamada Kellen',
    paragrafos: ['Muitos grafismos, dados e imagens complementares, com ganchos visuais e retenção.'],
    exemplo: [
      {
        fala: 'Kellen',
        texto:
          'Mas tudo isso é teoria, expectativa. Agora vocês vão poder ver isso no mundo real, no dia a dia do produtor de verdade. E tem alguém que vai experienciar na pele esses desafios também. Michel, já chegou na fazenda do nosso parceiro?',
      },
    ],
    sugestao: { rotulo: 'Sugestão de fala de fechamento para Kellen', intro: 'Ela entrega a ação para o Michel com algo como:' },
    video: 'nSBbX5gn1Lg',
    midias: [],
  },
  {
    id: 'b2',
    menu: 'Bloco 2',
    eyebrow: 'Bloco 2',
    titulo: 'Chegada do Michel',
    paragrafos: [
      'Iniciamos com uma montagem contextualizando onde o Michel está chegando, com cortes rápidos e poucas cenas, apenas para dar dinamismo à primeira parte da Kellen, que é mais estática.',
      'A entrada do Michel é dentro do carro, falando rapidamente sobre a fazenda a que estamos chegando, e seguimos com a chegada dele em si, sendo recebido e cumprimentando o produtor (e a família, caso participem).',
    ],
    grupos: [{ n: 2 }, { n: 3 }],
    midias: seq(2, 6),
  },
  {
    id: 'b3',
    menu: 'Bloco 3',
    eyebrow: 'Bloco 3',
    titulo: 'Café com o produtor',
    paragrafos: [
      'Introdução à fazenda em depoimento, aqui temos a primeira conversa com o produtor (e a família, caso queiram), imaginamos uma sala da sede ou uma área externa mais aconchegante e a ideia é termos o produtor apresentando um breve relato da sua história e da propriedade.',
      'Cobrimos com b-rolls da fazenda e do produtor no seu dia a dia e não aprofundamos nos desafios ainda, porque aqui entra a história para humanizar o convidado.',
    ],
    exemplo: [
      { fala: 'Michel', texto: 'Seu João, conta pra gente um pouquinho da sua história e da sua família no agro e sobre essa propriedade linda em que a gente está.' },
      { fala: 'Seu João', texto: 'Minha família veio para a região em 1970, vindos do sul tentando uma vida melhor, hoje a propriedade tem XXX hectares, plantamos soja, milho e temos XX cabeças de gado.' },
      { fala: 'Michel', texto: 'Será que o senhor pode me levar pra conhecer melhor seu dia a dia?' },
    ],
    sugestao: { rotulo: 'Sugestão de conversa' },
    // depois do 1º texto: o produtor no café (em evidência) e a mesa; depois
    // do 2º: o rapaz no milharal, o moreno de chapéu e o dia a dia, lado a lado
    midias: ['m13', 'm14', 'm9', 'm10', 'm7', 'm8', 'm11', 'm12'],
  },
  {
    id: 'b4',
    menu: 'Bloco 4',
    eyebrow: 'Bloco 4',
    titulo: 'Entendendo os desafios, vivendo na pele',
    paragrafos: [
      'Câmera na mão, movimento e uma troca mais espontânea entre os protagonistas.',
      'Seguimos para a “lida” do dia a dia, conhecendo melhor a fazenda e entendendo os desafios que o produtor enfrenta (focando no assunto do episódio), com os protagonistas passando por vários locais e situações.',
      'Iniciamos os inserts de depoimentos “entrando” no meio das situações para pontuar algo importante ou criar um gancho de atenção, bem no estilo reality.',
    ],
    nota: 'Aqui podemos introduzir o especialista John Deere para já fazer o tour pela propriedade, ou ele entra logo depois com a solução.',
    grupos: [{ n: 3, cheia: 'triangulo' }, { n: 3, cheia: 'triangulo' }, { n: 6, cheia: 'nenhuma' }],
    midias: seq(15, 26),
  },
  {
    id: 'b5',
    menu: 'Bloco 5',
    eyebrow: 'Bloco 5',
    titulo: 'Criação\ndo plano',
    paragrafos: [
      'Voltamos para o ambiente da casa ou sala de reunião da fazenda, hora de uma montagem dinâmica mostrando o planejamento e como as soluções da John Deere podem ajudar nosso produtor.',
    ],
    midias: ['m28', 'm29', 'm27', 'm30', 'm31'],
  },
  {
    id: 'b6',
    menu: 'Bloco 6',
    eyebrow: 'Bloco 6',
    titulo: 'Colocando em prática',
    paragrafos: [
      'Colocamos à prova o plano traçado pelo especialista, sempre exaltando e valorizando os produtos Deere, com hero shots e entrada de depoimentos para contextualizar informações importantes de como cada processo vai ajudar no resultado.',
    ],
    midias: ['m33', 'm34', 'm35'],
  },
  {
    id: 'b7',
    menu: 'Bloco 7',
    eyebrow: 'Bloco 7',
    titulo: 'Resultado e legado',
    paragrafos: [
      'Fechamento do episódio com a conversa entre Michel e o produtor falando sobre as mudanças feitas, com entrada de depoimentos do especialista, e finalizamos com Michel entrando na caminhonete e fazendo um convite para o próximo episódio, deixando o clima de suspense de para onde ele vai (ou já usando um pequeno teaser do próximo).',
    ],
    midias: [],
  },
]

export const CAMERA = {
  eyebrow: 'Linguagem de câmera',
  titulo: 'Câmera livre, imagem de cinema',
  itens: [
    'Handheld: movimento vivo, o espectador se sente na ação',
    'Agilidade com qualidade de imagem',
    'Volume de b-rolls diversos (POVs são uma ideia bacana)',
    'Depoimentos e cenas “montadas”, com ângulos subjetivos: o espectador é mais uma pessoa na “sala”',
    'Cinematografia high end, com master shots',
  ],
}

export const FOTOGRAFIA = {
  eyebrow: 'Direção de\nfotografia',
  titulo: 'Textura de cinema, tons quentes',
  texto:
    'Textura cinematográfica, tons quentes e cores vivas, e a ideia aqui é seguir uma uniformidade com o próprio material publicado pela John Deere recentemente, na campanha “Você e John Deere, uma só força”.',
  midias: ['m41', 'm42', 'm43', 'm44', 'm45'],
}

export const SOM = {
  eyebrow: 'Trilha e SFX',
  titulo: 'O campo também se escuta',
  itens: [
    { nome: 'Trilha geral', texto: 'Pano de fundo, não queremos ela roubando a cena e sim complementando as situações, com folk, viola e instrumental de cordas mais country.' },
    { nome: 'SFX', texto: 'É aqui que construímos a identidade e a ambiência, com a imersão do espectador nos sons naturais do dia a dia do campo.' },
  ],
}

export const LINKS_BOLD = [
  { marca: 'site', nome: 'Site da Bold', texto: 'boldstudiobrasil.com', url: 'https://boldstudiobrasil.com' },
  { marca: 'whatsapp', nome: 'WhatsApp', texto: 'Falar com a gente', url: 'https://wa.me/5566996402088' },
  { marca: 'instagram', nome: 'Instagram', texto: '@boldstudiobrasil', url: 'https://instagram.com/boldstudiobrasil' },
  { marca: 'email', nome: 'E-mail', texto: 'bold@boldstudiobrasil.com', url: 'mailto:bold@boldstudiobrasil.com' },
]

export const AGRADECIMENTO_MIDIA = 'm9'

export type EstadoTratamento = { ordem: Record<string, string[]>; ocultas: string[] }

const ORDEM_ANTIGA: Record<string, string> = {
  b3: 'm7,m8,m9,m10,m11,m12,m13,m14',
  b5: 'm27,m28,m29,m30,m31',
}

export const estadoTratamentoInicial = (): EstadoTratamento => ({
  ordem: Object.fromEntries(BLOCOS.map((b) => [b.id, [...b.midias]])),
  ocultas: [],
})

export function normalizarEstadoTratamento(bruto: unknown): EstadoTratamento {
  const base = estadoTratamentoInicial()
  if (!bruto || typeof bruto !== 'object' || Array.isArray(bruto)) return base
  const ordemBruta = (bruto as { ordem?: unknown }).ordem
  if (!ordemBruta || typeof ordemBruta !== 'object' || Array.isArray(ordemBruta)) return base
  const ordemLegada = (bruto as { versao?: number }).versao !== 2

  const ordem: Record<string, string[]> = {}
  const usados = new Set<string>()

  for (const b of BLOCOS) {
    const lista = Object.hasOwn(ordemBruta, b.id) ? (ordemBruta as Record<string, unknown>)[b.id] : undefined
    const validos: string[] = []
    if (Array.isArray(lista)) {
      for (const id of lista) {
        if (typeof id === 'string' && Object.hasOwn(MIDIAS, id) && !usados.has(id)) {
          validos.push(id)
          usados.add(id)
        }
      }
    }
    if (ordemLegada && validos.join(',') === ORDEM_ANTIGA[b.id]) {
      validos.forEach((id) => usados.delete(id))
      const migrados = base.ordem[b.id].filter((id) => !usados.has(id))
      migrados.forEach((id) => usados.add(id))
      ordem[b.id] = migrados
    } else {
      ordem[b.id] = validos
    }
  }

  for (const b of BLOCOS) {
    for (const id of base.ordem[b.id]) {
      if (!usados.has(id)) {
        ordem[b.id].push(id)
        usados.add(id)
      }
    }
  }

  const ocultasBrutas = (bruto as { ocultas?: unknown }).ocultas
  const ocultas = Array.isArray(ocultasBrutas)
    ? Array.from(new Set(ocultasBrutas.filter((id): id is string => typeof id === 'string' && Object.hasOwn(MIDIAS, id))))
    : []

  return { ordem, ocultas }
}
