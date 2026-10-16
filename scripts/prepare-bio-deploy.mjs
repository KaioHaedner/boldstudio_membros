import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const target = path.resolve(root, process.argv[2] || '../BoldStudioBioPublic')
if (target === root || target === dist || target.startsWith(`${dist}${path.sep}`)) {
  throw new Error('Escolha uma pasta de deploy separada do código e do dist.')
}
const builtHtml = await readFile(path.join(dist, 'index.html'), 'utf8')
const script = builtHtml.match(/<script type="module"[^>]*src="\/assets\/[^>]+><\/script>/)?.[0]
const styles = builtHtml.match(/<link rel="stylesheet"[^>]*href="\/assets\/[^>]+>/g) || []
if (!script || !styles.length) throw new Error('Execute npm run build antes de preparar a Bio.')
await mkdir(target, { recursive: true })
await cp(dist, path.join(target, 'public'), { recursive: true, force: true })
await cp(path.join(root, 'deployment/bio/vercel.json'), path.join(target, 'vercel.json'))
await writeFile(path.join(target, 'public/index.html'), `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#050505" />
    <title>Bold Studio Brasil | Links oficiais</title>
    <meta name="description" content="O próximo grande projeto pode ser o seu! Acesse o site, portfólio e contatos da Bold Studio Brasil." />
    <link rel="canonical" href="https://bio.boldstudiobrasil.com/bio" />
    <link rel="icon" type="image/png" sizes="48x48" href="/brand/favicon-48.png" />
    <link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Bold Studio Brasil | Links oficiais" />
    <meta property="og:description" content="O próximo grande projeto pode ser o seu!" />
    <meta property="og:url" content="https://bio.boldstudiobrasil.com/bio" />
    <meta property="og:image" content="https://bio.boldstudiobrasil.com/brand/og-image.jpg" />
    ${script}
    ${styles.join('\n    ')}
  </head>
  <body><div id="root"></div></body>
</html>
`)
console.log(`Bio preparada em ${target}`)
