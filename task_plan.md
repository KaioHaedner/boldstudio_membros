# Plano: Home institucional BoldStudio

## Objetivo
Adaptar a composição editorial da home institucional preservando a identidade BoldStudio, mantendo os cards atuais do Crew em tela cheia e convertendo clientes atendidos em duas trilhas horizontais sobrepostas.

## Fase atual
Fase 5

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

## Decisões

| Decisão | Motivo |
|---|---|
| Preservar os cards existentes do Crew | Requisito explícito do usuário |
| Usar duas trilhas horizontais, superior e inferior | Requisito explícito do usuário |
| Não copiar a identidade da Sand | A referência é composicional, enquanto tipografia e cores devem vir do projeto BoldStudio |
| Crew com card quase full-screen | O card atual mede 65% × 60%; a nova escala preserva o componente e aproxima o ritmo editorial da referência |
| Clientes com duas pistas opostas | Mantém todos os clientes clicáveis e transforma o scroll vertical em deslocamento horizontal sem uma fila única |

## Erros

| Erro | Tentativa | Resolução |
|---|---:|---|
| Busca por stories retornou código 1 porque `docs/stories` não existe | 1 | Criar story rastreável a partir dos requisitos explícitos do usuário |
| Patch inicial não encontrou bloco por diferença de codificação | 1 | Reaplicado em blocos menores ancorados no código |
| `npm test` indisponível | 1 | `package.json` não define script `test`; registrado na story e no handoff |
| Lint global: 22 erros e 2 avisos preexistentes fora do escopo | 1 | Validar isoladamente o arquivo TypeScript alterado e registrar dívida existente |
