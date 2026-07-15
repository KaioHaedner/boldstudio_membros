# Progresso: Home institucional BoldStudio

## Sessão 2026-07-14

### Fase 1: Descoberta
- **Status:** concluída
- Ações:
  - Referência visual completa da Sand analisada.
  - Requisitos de identidade, Crew e clientes registrados.
  - Skills de frontend e planejamento lidos.
  - Tipografia, tokens, CSS do Crew, CSS dos clientes e dados dos clientes confirmados.
  - Nenhum asset local de fonte encontrado; Inter é a fonte declarada pelo projeto.
- Arquivos criados:
  - `task_plan.md`
  - `findings.md`
  - `progress.md`

### Fase 2: Planejamento técnico
- **Status:** concluída
- Ações:
  - Definida ampliação dos cards existentes do Crew sem mudar conteúdo ou fotos.
  - Definidas duas pistas horizontais de clientes em sentidos opostos, controladas pelo scroll.
- Arquivos a modificar:
  - `src/components/home/ClientesWave.tsx`
  - `src/index.css`

### Fase 3: Implementação
- **Status:** concluída
- Ações:
  - Story derivada dos requisitos do usuário preparada.
  - Cards do Crew ampliados para presença quase full-screen.
  - Clientes divididos em duas pistas horizontais com movimentos opostos.
  - Cópias visuais removidas da árvore de acessibilidade.
  - Reduced motion mantém as pistas navegáveis horizontalmente sem pin/animação.
- Arquivos a modificar:
  - `docs/stories/2026-07-14-home-crew-clientes-editorial.md`
  - `src/components/home/ClientesWave.tsx`
  - `src/index.css`

### Fase 4: Validação
- **Status:** concluída
- Resultados:
  - Typecheck aprovado.
  - Build aprovado.
  - Lint global mantém 22 erros e 2 avisos preexistentes fora dos arquivos alterados.
  - `npm test` indisponível porque não existe script `test`.
  - Diff scoped sem erros de whitespace.
  - Build final repetido após o ajuste de reduced motion e aprovado.

### Fase 5: Handoff
- **Status:** concluída
- Ações:
  - Story atualizada para Ready for Review.
  - SAVE-196 criado.
  - `LIVE-SESSION.md` preservado; pertence à sessão do Claude Code.
  - Commit local criado e resumo final preparado para o usuário.

### Fase 6: Novo escopo após revisão visual
- **Status:** concluída
- Ações:
  - Capturas reais comparadas com o commit local.
  - Confirmado que o site publicado ainda está no layout anterior.
  - Requisitos de Crew, clientes, header e hero registrados.
  - Localizado o asset real do Academy: `VD_BOLD_01.mp4`, usado por `StudioVideoBg`.

### Fase 7: Implementação visual complementar
- **Status:** concluída
- Ações:
  - Header em cápsula substituído por barra aberta nas bordas da viewport.
  - Desktop agora exibe logo, idioma e `Menu +`; mobile exibe logo e toggle.
  - Menu transformado em overlay editorial full-screen com navegação numerada.
  - Hero passou a reutilizar o vídeo real do Academy com overlay de contraste.
  - Crew passou para `100vw × 100svh` no desktop e mobile.
  - Offsets verticais removidos dos clientes para duas linhas retas.
- Arquivos alterados:
  - `src/components/home/Header.tsx`
  - `src/pages/HomeInstitucionalPage.tsx`
  - `src/components/home/ClientesWave.tsx`
  - `src/index.css`

### Fase 8: Validação complementar
- **Status:** concluída
- Resultados:
  - Lint focado nos três TSX alterados aprovado.
  - Typecheck aprovado.
  - Build de produção aprovado.
  - Diff check aprovado.
  - Revisão estrutural de desktop, mobile e reduced motion concluída.
  - Validação visual automatizada não executada; screenshots de produção ainda representam o deploy antigo.

### Fase 9: Story, SAVE e commit complementar
- **Status:** concluída
- Ações:
  - Story ampliada com header e hero.
  - SAVE-197 preparado.
  - Commit local criado sem incluir arquivos Supabase.

### Fase 11: Releitura visual do Crew
- **Status:** concluída
- Ações:
  - Três capturas comparadas: referência Sand, título atual e mockup desejado.
  - Definida remoção do título externo e da faixa horizontal.
  - Definida assinatura estática `BoldCrew` no canto inferior esquerdo.
  - Definido manifesto vertical com áreas seguras para header e RecIA.

### Fase 12: Reconstrução da cena Crew
- **Status:** concluída
- Ações:
  - Título externo e faixa horizontal removidos.
  - Assinatura `BoldCrew` adicionada no canto inferior esquerdo.
  - Manifesto reconstruído como rail vertical amarelo em loop.
  - Rail limitado entre áreas seguras superior e inferior.
  - Cards passaram a reservar a largura do rail.
  - Fundo preto individual removido; overlay único translúcido mantém o shader visível.
- Arquivos alterados:
  - `src/components/home/CrewSticky.tsx`
  - `src/index.css`

### Fase 13: Validação e documentação
- **Status:** concluída
- Resultados:
  - Lint focado aprovado.
  - Typecheck aprovado.
  - Build aprovado.
  - Diff check aprovado.
  - Story e SAVE-202 atualizados.

## Validações

| Validação | Resultado |
|---|---|
| Ainda não executada | Pendente |
| Typecheck | Aprovado |
| Build | Aprovado |
| Lint global | Bloqueado por 22 erros e 2 avisos preexistentes |
| Testes | Indisponíveis, sem script `test` |
| Lint focado em `ClientesWave.tsx` | Aprovado |
| Diff scoped | Aprovado |
| Lint focado complementar | Aprovado |
| Typecheck complementar | Aprovado |
| Build complementar | Aprovado |

## Erros

| Horário | Erro | Tentativa | Resolução |
|---|---|---:|---|
| 2026-07-14 | `rg` retornou código 1 ao não encontrar `docs/stories` | 1 | Criar o diretório e a story da tarefa |
| 2026-07-14 | Patch não encontrou bloco com comentários codificados de forma diferente | 1 | Patch reaplicado com âncoras menores |
| 2026-07-14 | `npm test` falhou por script ausente | 1 | Registrado como gate indisponível |
| 2026-07-14 | Lint global retornou 22 erros e 2 avisos preexistentes | 1 | Executar lint focado no arquivo alterado |
| 2026-07-14 | Caminho inicial do Header não existia | 1 | Usado `src/components/home/Header.tsx` |

## SAVE-203 | Hotfix de sobreposição do Crew

- Causa confirmada: cards absolutos e transparentes permaneciam visíveis simultaneamente.
- CSS agora oculta todos os cards antes da inicialização, exceto o primeiro.
- GSAP controla `opacity` e `visibility` com `autoAlpha`; somente o ativo e, no fim da transição, o próximo podem aparecer.
- Lint focado, typecheck, build e `git diff --check`: aprovados.

## Análise do ZIP original

- Todos os arquivos textuais do ZIP foram lidos diretamente, sem extração ou alteração.
- `efeito.js` confirmado como fonte do algoritmo já portado para `CrewSticky.tsx`.
- `efeito.css` confirmou que cada card precisa de fundo opaco.
- A tentativa com `autoAlpha` foi classificada como regressão do efeito e será revertida.
- Edge headless não gerou a captura local; validação alternativa pelo Chrome foi selecionada.
- A primeira captura do Chrome abriu a raiz `ComingSoon`; a chamada seguinte reutilizou esse processo. Será feita uma última tentativa isolada.
- A terceira captura headless falhou; automação visual encerrada após três tentativas.
- Algoritmo GSAP original restaurado sem `autoAlpha`; fundo preto individual restaurado.
- Lint focado, typecheck, build, diff-check e verificação dos parâmetros originais: aprovados.
- Após corrigir o seletor CSS, a repetição paralela dos gates expirou; nova rodada sequencial será a validação final.
- Por decisão do usuário, o wrapper e a cena ShaderGradient foram removidos da home; dependências exclusivas serão desinstaladas.
- Dependências exclusivas foram removidas do package e lock antes do timeout do npm; usos residuais nas páginas de projeto também foram retirados e substituídos por fundo preto.
- Gates finais da versão definitiva: lint dos três TSX alterados, typecheck, build e diff-check aprovados.
- O chunk `BoldShaderGradientScene` de aproximadamente 395 KB desapareceu; o bundle JS principal caiu de aproximadamente 1.585 KB para 1.364 KB.
