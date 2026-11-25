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
  video?: string
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

export const CLIENTE = 'John Deere'

export const CAPA = {
  titulo: 'Tratamento de roteiro',
  cliente: 'John Deere',
  texto:
    'Muito obrigado pela oportunidade de fazermos parte desse projeto lindo. Queremos trazer uma visão nova sobre o formato, agregando uma qualidade visual de cinema, mas mantendo a narrativa cativante do reality.',
  midia: 'm1',
}

export const BLOCOS: BlocoTexto[] = [
  {
    id: 'tom',
    menu: 'Tom',
    eyebrow: 'Tom e storytelling',
    titulo: 'Reality com roupagem de documentário',
    paragrafos: [
      'A ideia central é desenvolver um roteiro de blocos fixos que embalem e deem ritmo ao formato de reality, mas com uma roupagem de documentário padrão Netflix.',
      'Os blocos se alternam entre cenas mais elaboradas (montadas), como os depoimentos, e momentos de câmera viva acompanhando os personagens entre as transições de cenários e momentos.',
    ],
    video: 'I19VL_2BruA',
    midias: [],
  },
  {
    id: 'b1',
    menu: 'Bloco 1',
    eyebrow: 'Bloco 1',
    titulo: 'Chamada Kellen',
    paragrafos: [
      'Muitos grafismos, dados e imagens complementares. Ganchos visuais e retenção.',
      'Ela entrega a ação para o Michel com algo como:',
    ],
    exemplo: [
      {
        fala: 'Kellen',
        texto:
          'Mas tudo isso é teoria, expectativa. Agora vocês vão poder ver isso no mundo real, no dia a dia do produtor de verdade. E tem alguém que vai experienciar na pele esses desafios também. Michel, já chegou na fazenda do nosso parceiro?',
      },
    ],
    video: 'nSBbX5gn1Lg',
    midias: [],
  },
  {
    id: 'b2',
    menu: 'Bloco 2',
    eyebrow: 'Bloco 2',
    titulo: 'Chegada do Michel',
    paragrafos: [
      'Iniciamos com uma montagem contextualizando onde o Michel está chegando. Cortes rápidos e poucas cenas, apenas para dar dinamismo à primeira parte da Kellen, que é mais estática.',
      'A entrada do Michel é dentro do carro, falando rapidamente sobre a fazenda que estamos chegando. Seguimos com a chegada dele em si, sendo recebido e cumprimentando o produtor (e família, caso participem).',
    ],
    midias: seq(2, 6),
  },
  {
    id: 'b3',
    menu: 'Bloco 3',
    eyebrow: 'Bloco 3',
    titulo: 'Café com o produtor',
    paragrafos: [
      'Introdução à fazenda, em depoimento. Aqui temos a primeira conversa com o produtor (e família, caso queiram). Imaginamos uma sala da sede ou uma área externa mais aconchegante. A ideia é ter o produtor apresentando um breve relato da sua história e da propriedade.',
      'Cobrimos com b-rolls da fazenda e do produtor no seu dia a dia. Não aprofundamos nos desafios ainda: aqui entra a história para humanizar o convidado.',
    ],
    exemplo: [
      { fala: 'Michel', texto: 'Seu João, conta pra gente um pouquinho da sua história e da sua família no agro e sobre essa propriedade linda em que a gente está.' },
      { fala: 'Seu João', texto: 'Minha família veio para a região em 1970, vindos do sul tentando uma vida melhor… hoje a propriedade tem XXX hectares, plantamos soja, milho e temos XX cabeças de gado…' },
      { fala: 'Michel', texto: 'Será que o senhor pode me levar pra conhecer melhor seu dia a dia?' },
    ],
    midias: seq(7, 14),
  },
  {
    id: 'b4',
    menu: 'Bloco 4',
    eyebrow: 'Bloco 4',
    titulo: 'Vivendo na pele',
    paragrafos: [
      'Entendendo os desafios. Câmera na mão, movimento e uma troca mais espontânea entre os protagonistas.',
      'Seguimos para a lida do dia a dia, conhecendo melhor a fazenda e entendendo os desafios que o produtor enfrenta (focando no assunto do episódio), com os protagonistas passando por vários locais e situações.',
      'Iniciamos os inserts de depoimentos entrando no meio das situações para pontuar algo importante ou criar um gancho de atenção, bem no estilo reality.',
      'Aqui podemos introduzir o especialista John Deere para já fazer o tour pela propriedade, ou ele entra logo depois com a solução.',
    ],
    midias: seq(15, 26),
  },
  {
    id: 'b5',
    menu: 'Bloco 5',
    eyebrow: 'Bloco 5',
    titulo: 'Criação do plano',
    paragrafos: [
      'Voltamos para o ambiente da casa ou sala de reunião da fazenda. Hora de uma montagem dinâmica mostrando o planejamento que vai trazer as soluções que a John Deere pode oferecer para ajudar nosso produtor.',
    ],
    midias: seq(27, 31),
  },
  {
    id: 'b6',
    menu: 'Bloco 6',
    eyebrow: 'Bloco 6',
    titulo: 'Colocando em prática',
    paragrafos: [
      'Colocamos à prova o plano traçado pelo especialista, sempre exaltando e valorizando os produtos Deere, com hero shots e entrada de depoimentos para contextualizar informações importantes de como cada processo vai ajudar no resultado.',
    ],
    midias: seq(32, 35),
  },
  {
    id: 'b7',
    menu: 'Bloco 7',
    eyebrow: 'Bloco 7',
    titulo: 'Resultado e legado',
    paragrafos: ['Em construção. Este bloco entra assim que o roteiro dele estiver fechado.'],
    midias: [],
  },
]

export const CAMERA = {
  eyebrow: 'Linguagem de câmera e DP',
  titulo: 'Câmera viva, imagem de cinema',
  itens: [
    'Handheld para movimento mais vivo, levando a sensação ao espectador',
    'Agilidade com qualidade de imagem',
    'Volume de b-rolls diversos (POVs são uma ideia bacana)',
    'Depoimentos e cenas montadas, com ângulos subjetivos: o espectador é mais uma pessoa na sala',
    'Cinematografia high end, com master shots',
  ],
}

export const SOM = {
  eyebrow: 'Trilha e SFX',
  titulo: 'O campo também se escuta',
  itens: [
    { nome: 'Trilha geral', texto: 'Pano de fundo, sem roubar a cena. Folk, viola, instrumental de cordas mais country.' },
    { nome: 'SFX', texto: 'É aqui que construímos a identidade e a ambiência: imersão do espectador com os sons naturais do dia a dia do campo.' },
  ],
}

export const ARTE = [
  { nome: 'Direção de arte', texto: 'Ponto a se discutir' },
  { nome: 'Stills', texto: 'Em aberto' },
]

export const REFERENCIAS = [
  { nome: 'Vídeo de referência', url: 'https://www.youtube.com/watch?v=I19VL_2BruA' },
  { nome: 'Nothing but Lilydale will do', url: 'https://www.adsoftheworld.com/campaigns/nothing-but-lilydale-will-do' },
  { nome: 'The Cycle of Tomorrow (Fleur Dyer)', url: 'https://frameset.app/search/director/fleur-dyer/the-cycle-of-tomorrow' },
  { nome: 'Sadia Bio (GNT)', url: 'https://frameset.app/search/brand/gnt/sadia-bio' },
]

export const LINKS_BOLD = [
  { marca: 'site', nome: 'Site da Bold', texto: 'boldstudiobrasil.com', url: 'https://boldstudiobrasil.com' },
  { marca: 'whatsapp', nome: 'WhatsApp', texto: 'Falar com a gente', url: 'https://wa.me/5566996402088' },
  { marca: 'instagram', nome: 'Instagram', texto: '@boldstudiobrasil', url: 'https://instagram.com/boldstudiobrasil' },
  { marca: 'email', nome: 'E-mail', texto: 'bold@boldstudiobrasil.com', url: 'mailto:bold@boldstudiobrasil.com' },
]

// imagem de fundo dos trechos do layout "tratores"
export const FUNDOS_TRATORES = [
  '/apresentacao/john-deere/colheitadeira.webp',
  '/apresentacao/john-deere/campo-aereo.webp',
  '/apresentacao/john-deere/cabine-operador.webp',
  '/apresentacao/john-deere/trator-campo.webp',
]

export const AGRADECIMENTO_MIDIA = 'm9'
