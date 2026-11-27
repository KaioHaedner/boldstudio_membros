import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

// Imports unchanged originals; monochrome display is exclusively carousel CSS.
const source = resolve(process.argv[2] || '.verification/user-logos-20261005')
const additional = resolve(process.argv[3] || '.verification/user-additional-logos-20261005')
const output = resolve('public/brand/clients')
mkdirSync(output, { recursive: true })
const entries = [
  ['agro-baggio-john-deere', 'boldstudio_logo_agro_baggio_1x', 'light'],
  ['machado-supermercados', 'boldstudio_logo_machado_1x', 'transparent'],
  ['unimed', 'boldstudio_logo_unimed_1x', 'dark'],
  ['paiol-agricola', 'boldstudio_logo_paiol_1x', 'transparent'],
  ['exponorte', 'boldstudio_logo_exponorte_1x', 'dark'],
  ['forteza', 'boldstudio_logo_forteza_1x', 'light'],
  ['mado-burguer', 'boldstudio_logo_mado_1x', 'dark'],
  ['grupo-sinop', 'boldstudio_logo_grupo_sinop_1x', 'dark'],
  ['shopping-sinop', 'shopping_sinop_logo_1_1x', 'transparent'],
  ['frialto', 'boldstudio_logo_frialto_1x', 'light'],
  // Version 1 is entirely transparent (empty); use the actual artwork in v2.
  ['jmd-urbanismo', 'jmd_urbanismo_logo_2_1x', 'light'],
  ['fobel', 'boldstudio_logo_fobel_1x', 'transparent'],
  ['biancon', 'boldstudio_logo_grupo_biancon_1x', 'transparent'],
  ['embrapa', 'boldstudio_logo_embrapa_1x', 'transparent'],
  ['parrilla-do-campo', 'boldstudio_logo_parrilha_do_campo_1x', 'light'],
  ['duotorri', 'image_15_1x', 'transparent'],
  ['sonhalto-paranoa', 'image_17_1x', 'transparent'],
]
const manifest = {}
for (const [slug, base, treatment] of entries) {
  const input = join(['duotorri', 'sonhalto-paranoa'].includes(slug) ? additional : source, `${base}.webp`)
  const bytes = readFileSync(input)
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12)
  const filename = `${base}-${hash}.webp`
  const target = join(output, filename)
  if (!existsSync(target)) copyFileSync(input, target)
  manifest[slug] = { src: `/brand/clients/${filename}`, treatment }
}
writeFileSync('src/apps/site/data/client-logos.json', `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Imported ${entries.length} unchanged original logos`)
