# Plano: Home institucional BoldStudio

## Objetivo
Finalizar a composição editorial da home institucional e reconstruir a cena do Crew com assinatura estática, manifesto vertical e fundo interativo.

## Fase atual
Fase 14

## Fases

### Fase 1: Descoberta
- [x] Confirmar tipografia, cores e estrutura atual
- [x] Identificar a story aplicável
- [x] Registrar achados
- **Status:** concluída

### Fase 2: Planejamento técnico
- [x] Definir comportamento desktop e mobile
- [x] Mapear alterações por arquivo
- **Status:** concluída

### Fase 3: Implementação
- [x] Ampliar a apresentação do Crew sem alterar seus cards
- [x] Criar duas trilhas horizontais de clientes em sentidos opostos
- [x] Preservar parallax, ScrollTrigger e identidade visual
- **Status:** concluída

### Fase 4: Validação
- [x] Executar lint, typecheck, testes e build disponíveis
- [x] Revisar diff e responsividade
- **Status:** concluída

### Fase 5: Handoff
- [x] Atualizar story, checklist e file list aplicáveis
- [x] Criar SAVE do trabalho
- [x] Entregar resumo ao usuário
- **Status:** concluída

### Fase 6: Descoberta do novo escopo
- [x] Localizar o GIF usado em `academy.boldstudiobrasil.com`
- [x] Inspecionar Header, hero e comportamento atual dos componentes
- [x] Registrar os problemas mostrados nas capturas
- **Status:** concluída

### Fase 7: Implementação visual
- [x] Crew ocupar a viewport sem container central estreito
- [x] Clientes em duas linhas horizontais retas e opostas
- [x] Header desktop com logo à esquerda, idioma e `Menu +`
- [x] Header mobile com logo à esquerda e toggle à direita
- [x] Hero com o asset real do Academy como background
- **Status:** concluída

### Fase 8: Validação
- [x] Lint focado, typecheck e build
- [x] Revisar desktop, mobile e reduced motion
- **Status:** concluída

### Fase 9: Story, SAVE e commit
- [x] Atualizar critérios, checklist e file list
- [x] Criar SAVE incremental
- [x] Criar commit scoped
- **Status:** concluída

### Fase 10: Publicação
- [x] Registrar handoff para `@devops`
- [x] Confirmar que o deploy anterior não continha o commit local
- **Status:** pendente

### Fase 11: Releitura visual do Crew
- [x] Comparar referência Sand, título atual e mockup desejado
- [x] Registrar remoções e áreas seguras
- **Status:** concluída

### Fase 12: Reconstrução da cena Crew
- [x] Remover título e subtítulo externos
- [x] Remover marquee horizontal
- [x] Adicionar assinatura estática `BoldCrew`
- [x] Criar manifesto vertical em loop com fonte ampliada
- [x] Reservar áreas seguras para header e RecIA
- [x] Revelar o shader interativo atrás da composição
- **Status:** concluída

### Fase 13: Validação e documentação
- [x] Lint focado, typecheck, build e diff check
- [x] Atualizar story, SAVE, findings e progress
- **Status:** concluída

### Fase 14: Publicação da nova cena
- [x] Criar commit scoped
- [x] Handoff ao `@devops`
- [ ] Confirmar bundle em produção
- **Status:** em andamento

## Decisões

| Decisão | Motivo |
|---|---|
| Preservar os cards existentes do Crew | Requisito explícito do usuário |
| Usar duas trilhas horizontais, superior e inferior | Requisito explícito do usuário |
| Não copiar a identidade da Sand | A referência é composicional, enquanto tipografia e cores devem vir do projeto BoldStudio |
| Crew com card quase full-screen | O card atual mede 65% × 60%; a nova escala preserva o componente e aproxima o ritmo editorial da referência |
| Clientes com duas pistas opostas | Mantém todos os clientes clicáveis e transforma o scroll vertical em deslocamento horizontal sem uma fila única |
| Header sem cápsula | Requisito explícito do usuário a partir da captura real |
| Reutilizar asset do Academy | Requisito explícito; não criar nem baixar mídia substituta |
| Marquee vertical dentro da cena | Traduz a referência sem copiar o layout e atende ao mockup fornecido pelo usuário |
| Áreas seguras superior e inferior | Evita conflito visual com Menu e RecIA |
| Assinatura `BoldCrew` estática | Substitui o título externo e ancora a identidade da seção |

## Erros

| Erro | Tentativa | Resolução |
|---|---:|---|
| Busca por stories retornou código 1 porque `docs/stories` não existe | 1 | Criar story rastreável a partir dos requisitos explícitos do usuário |
| Patch inicial não encontrou bloco por diferença de codificação | 1 | Reaplicado em blocos menores ancorados no código |
| `npm test` indisponível | 1 | `package.json` não define script `test`; registrado na story e no handoff |
| Lint global: 22 erros e 2 avisos preexistentes fora do escopo | 1 | Validar isoladamente o arquivo TypeScript alterado e registrar dívida existente |
| Leitura inicial usou caminho inexistente `src/components/Header.tsx` | 1 | Corrigido para `src/components/home/Header.tsx` |
| Usuário chamou o asset do Academy de GIF, mas não existe GIF no projeto | 1 | Reutilizar o componente real, que aponta para `VD_BOLD_01.mp4` |
