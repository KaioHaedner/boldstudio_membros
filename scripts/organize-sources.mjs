import { mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Migração mecânica da estrutura original. Não altera conteúdo visual ou rotas.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const moves = []
const sitePages = ['HomeInstitucionalPage', 'ServicoPage', 'ProjetoClientePage', 'LandingPage', 'ComingSoon', 'CheckoutPage', 'SucessoPage']
const academyPages = ['DashboardPage', 'ModuloPage', 'AulaPage', 'PerfilPage', 'TrilhasPage', 'RotaPage', 'ArsenalPage', 'ConquistasPage', 'EvolucaoPage', 'CertificadoPage']

function add(from, to) { moves.push([`src/${from}`, `src/${to}`]) }
for (const name of sitePages) add(`pages/${name}.tsx`, `apps/site/pages/${name}.tsx`)
for (const name of academyPages) add(`pages/${name}.tsx`, `apps/academy/pages/${name}.tsx`)
add('pages/admin', 'apps/admin/pages')
add('components/home', 'apps/site/components')
add('components/AppLayout.tsx', 'apps/academy/components/AppLayout.tsx')
add('components/StudioVideoBg.tsx', 'apps/academy/components/StudioVideoBg.tsx')
add('components/AdminLayout.tsx', 'apps/admin/components/AdminLayout.tsx')
add('hooks/useCardSwap.ts', 'apps/site/hooks/useCardSwap.ts')
for (const name of ['useModules', 'useLessons', 'useLessonProgress']) add(`hooks/${name}.ts`, `apps/academy/hooks/${name}.ts`)
add('data', 'apps/site/data')
add('i18n', 'apps/site/i18n')
add('pages', 'shared/pages')
add('components', 'shared/components')
add('hooks', 'shared/hooks')
add('contexts', 'shared/contexts')
add('lib', 'shared/lib')
add('index.css', 'shared/styles/global.css')

// Reescreve somente imports dos caminhos movidos, antes de mover os arquivos.
const aliases = moves.map(([from, to]) => [from.replace('src/', '@/').replace(/\.(tsx|ts)$/, ''), to.replace('src/', '@/').replace(/\.(tsx|ts)$/, '')])
function rewrite(folder) {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name)
    if (entry.isDirectory()) rewrite(path)
    else if (/\.(tsx?|css)$/.test(entry.name)) {
      const before = readFileSync(path, 'utf8')
      let after = before
      for (const [from, to] of aliases) after = after.replaceAll(from, to)
      if (entry.name === 'main.tsx') after = after.replace("'./index.css'", "'./shared/styles/global.css'")
      if (after !== before) writeFileSync(path, after)
    }
  }
}

if (existsSync(join(root, 'src/shared/styles/global.css'))) {
  console.log('Estrutura já organizada; nenhuma alteração necessária.')
} else {
  rewrite(join(root, 'src'))
  for (const [from, to] of moves) {
    const source = join(root, from)
    const target = join(root, to)
    if (!existsSync(source)) throw new Error(`Origem ausente: ${from}`)
    if (existsSync(target)) throw new Error(`Destino já existe: ${to}`)
    mkdirSync(dirname(target), { recursive: true })
    renameSync(source, target)
  }
  console.log(`Estrutura organizada: ${moves.length} movimentos; imports atualizados.`)
}

if (existsSync(join(root, 'src/i18n'))) {
  rewrite(join(root, 'src'))
  renameSync(join(root, 'src/i18n'), join(root, 'src/apps/site/i18n'))
}
const versionPath = join(root, 'src/shared/lib/version.ts')
const versionSource = readFileSync(versionPath, 'utf8')
const versionUpdated = versionSource.replace("'../../package.json'", "'../../../package.json'")
if (versionUpdated !== versionSource) writeFileSync(versionPath, versionUpdated)

// Extrai os temas de autenticação para as áreas que os possuem.
const shellPath = join(root, 'src/shared/components/AuthShell.tsx')
if (!existsSync(join(root, 'src/apps/crew/components/AuthLayout.tsx'))) {
  const shell = readFileSync(shellPath, 'utf8')
  const interfaceStart = shell.indexOf('interface AuthShellProps {')
  const interfaceEnd = shell.indexOf('\n}', interfaceStart) + 2
  const interfaceSource = shell.slice(interfaceStart, interfaceEnd)
  const helperStart = shell.indexOf('function HeaderLogo(')
  const fieldStart = shell.indexOf('/* ============== Field exportado')
  const helperSource = shell.slice(helperStart, fieldStart).replace('function HeaderLogo(', 'export function HeaderLogo(').replace('function VersionTag(', 'export function VersionTag(')
  const write = (path, content) => {
    const target = join(root, path)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, content)
  }
  write('src/shared/auth/types.ts', `export ${interfaceSource}\n`)
  write('src/shared/components/AuthLayoutParts.tsx', `import { APP_VERSION } from '@/shared/lib/version'\nimport { cn } from '@/shared/lib/utils'\n\n${helperSource}`)
  const layoutNames = ['Academy', 'Admin', 'Crew']
  for (const [index, name] of layoutNames.entries()) {
    const start = shell.indexOf(`function ${name}AuthLayout(`)
    const end = shell.indexOf('/* ==============', start)
    const layout = shell.slice(start, end).replace(`function ${name}AuthLayout(`, `export function ${name}AuthLayout(`)
    const area = name.toLowerCase()
    const parts = index === 0 ? 'VersionTag' : 'HeaderLogo, VersionTag'
    const studio = index === 0 ? "import { StudioVideoBg } from '@/apps/academy/components/StudioVideoBg'\n" : ''
    write(`src/apps/${area}/components/AuthLayout.tsx`, `${studio}import { PoweredByBold } from '@/shared/components/PoweredByBold'\nimport { ${parts} } from '@/shared/components/AuthLayoutParts'\nimport type { AuthShellProps } from '@/shared/auth/types'\n\n${layout}`)
  }
  const wrapperStart = shell.indexOf('// Cada subdominio')
  const wrapperEnd = shell.indexOf('/* ============== ACADEMY')
  write('src/shared/components/AuthShell.tsx', `import { Footer } from '@/shared/components/Footer'\nimport { getArea } from '@/shared/lib/area'\nimport type { AuthShellProps } from '@/shared/auth/types'\nimport { AcademyAuthLayout } from '@/apps/academy/components/AuthLayout'\nimport { AdminAuthLayout } from '@/apps/admin/components/AuthLayout'\nimport { CrewAuthLayout } from '@/apps/crew/components/AuthLayout'\n\n${shell.slice(wrapperStart, wrapperEnd)}${shell.slice(fieldStart)}`)
  console.log('Temas Academy, Admin e Crew separados; markup original preservado.')
}

// Mantém uma SPA, com os grupos de rotas no diretório de cada área.
const appPath = join(root, 'src/App.tsx')
if (!existsSync(join(root, 'src/apps/site/routes.tsx'))) {
  let app = readFileSync(appPath, 'utf8')
  const imports = app.split('\n').filter((line) => line.startsWith('import '))
  function writeRoutes(area, routes, extras, navigate = false) {
    const ownImports = imports.filter((line) => line.includes(`@/apps/${area}/pages/`))
    const content = `import { ${navigate ? 'Navigate, ' : ''}Route } from 'react-router-dom'\n${ownImports.join('\n')}\n${extras}\n\nexport function ${area}Routes() {\n  return (\n    <>\n${routes}\n    </>\n  )\n}\n`
    writeFileSync(join(root, `src/apps/${area}/routes.tsx`), content)
  }
  const siteStart = app.indexOf('          <Route path="/home"')
  const siteEnd = app.indexOf('          <Route path="/login"')
  const siteBlock = app.slice(siteStart, siteEnd)
  const checkout = app.split('\n').filter((line) => /path="\/(checkout|sucesso)"/.test(line)).join('\n')
  const project = app.split('\n').find((line) => line.includes('path="/:projetoSlug"'))
  writeRoutes('site', `${siteBlock}${checkout}\n${project}`, '', true)
  app = app.replace(siteBlock, '          {siteRoutes()}\n')
  app = app.split('\n').filter((line) => !/path="\/(checkout|sucesso)"/.test(line) && !line.includes('path="/:projetoSlug"')).join('\n')
  const academyStart = app.indexOf('          {/* protegidas (aluno) */}')
  const adminStart = app.indexOf('          {/* admin */}')
  const appRedirectStart = app.indexOf('          <Route path="/app"')
  const appRedirectEnd = app.indexOf('\n', appRedirectStart)
  const academyBlock = app.slice(academyStart, adminStart)
  const adminBlock = app.slice(adminStart, appRedirectStart)
  const appRedirect = app.slice(appRedirectStart, appRedirectEnd)
  writeRoutes('academy', `${academyBlock}\n${appRedirect}`, "import { ProtectedRoute } from '@/shared/components/ProtectedRoute'\nimport { AppLayout } from '@/apps/academy/components/AppLayout'", true)
  writeRoutes('admin', adminBlock, "import { ProtectedRoute } from '@/shared/components/ProtectedRoute'\nimport { AdminLayout } from '@/apps/admin/components/AdminLayout'")
  app = app.replace(academyBlock, '          {academyRoutes()}\n').replace(adminBlock, '          {adminRoutes()}\n').replace(appRedirect, '')
  app = app.split('\n').filter((line) => !line.startsWith('import ') || (!line.includes('@/apps/') && !line.includes('ProtectedRoute'))).join('\n')
  app = "import { siteRoutes } from '@/apps/site/routes'\nimport { academyRoutes } from '@/apps/academy/routes'\nimport { adminRoutes } from '@/apps/admin/routes'\n" + app
  app = app.replace('          {/* paginas por cliente: /projeto-grupo-machado etc (valida o prefixo) */}\n', '')
  writeFileSync(appPath, app)
  console.log('Rotas institucional, Academy e Admin separadas; URLs preservadas.')
}
