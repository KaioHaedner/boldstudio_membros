import { mediaBase } from '@/lib/media'

// Ícones da jornada do cliente (13 etapas), na MESMA ordem de t.processo.etapas.
// Chegaram como SVG, mas não eram vetor: cada arquivo trazia um PNG de 1254px
// em base64 dentro da tag, 6,2 MB somados para desenhar ícones de 68px. O que
// está no ar é WebP de 240px (3x do tamanho de exibição) com canal alfa.
//
// Moram no bucket ICONES_JORNADAS_SVG do Supabase, servidos pelo proxy
// api.boldstudiobrasil.com. Existe uma cópia igual em public/jornada/, que
// serve de reserva: em setembro de 2026 esse projeto ficou pausado e tudo que
// dependia dele saiu do ar por dias.
const ICONE = mediaBase('ICONES_JORNADAS_SVG')

export const JORNADA_ICONES = [
  `${ICONE}reuniao-inicial.webp`,
  `${ICONE}proposta.webp`,
  `${ICONE}onboarding.webp`,
  `${ICONE}referencias-moodboard.webp`,
  `${ICONE}roteiros.webp`,
  `${ICONE}cronograma.webp`,
  `${ICONE}ppm.webp`,
  `${ICONE}captacoes.webp`,
  `${ICONE}pos-producao.webp`,
  `${ICONE}previa.webp`,
  `${ICONE}ajustes.webp`,
  `${ICONE}material-final.webp`,
  `${ICONE}fechamento.webp`,
] as const

// Mesmo conteúdo servido pelo próprio site, sem depender do Supabase.
export const JORNADA_ICONES_LOCAIS = JORNADA_ICONES.map(
  (u) => `/jornada/${u.split('f=')[1]}`
)
