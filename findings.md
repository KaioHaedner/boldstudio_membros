# Achados: Home institucional BoldStudio

## Requisitos

- Conferir e preservar tipografia e cores já definidas no projeto.
- Manter os cards atuais do Crew.
- Apresentar o Crew ocupando toda a tela, inspirado na escala editorial da Sand.
- Substituir o antigo movimento de logos em S por rolagem horizontal.
- Usar duas faixas de clientes: uma em cima e outra embaixo, com movimentos complementares.
- Preservar parallax e ScrollTrigger existentes.

## Achados visuais

- O screenshot da Sand usa seções de tela cheia, tipografia em escala extrema, alto contraste, mosaicos de imagens e alternância entre áreas densas e respiro.
- A referência será aplicada à escala e ao ritmo, não à identidade de marca.

## Achados técnicos

- A fonte global atual é `Inter`, com fallbacks de sistema; não existem arquivos locais de fonte.
- Tokens oficiais: preto `#000000`, amarelo `#FFD712`, branco `#FFFFFF` e grafite `#282828`.
- `CrewSticky` já ocupa `100svh`, usa pin e ScrollTrigger, mas os cards têm somente `min(65%, 60rem)` de largura e 60% de altura.
- `ClientesWave` contém 14 clientes clicáveis, modal e páginas individuais; somente a apresentação do conjunto deve mudar.
- O efeito atual de clientes é uma coluna vertical com deslocamento senoidal em X e recorte variável.
- `package.json` não possui script `test`; existem `lint`, `typecheck` e `build`.
- O diretório `docs/stories` não existia no início desta tarefa.

## Decisões técnicas

| Decisão | Motivo |
|---|---|
| Manter Inter e os tokens existentes | Preservar a identidade implementada da BoldStudio |
| Dividir `CLIENTES` por índices pares e ímpares | Gera duas pistas equilibradas sem inventar conteúdo |
| Duplicar visualmente cada pista | Permite movimento horizontal contínuo; a segunda cópia será escondida da árvore de acessibilidade |
| Usar ScrollTrigger com scrub | Mantém o comportamento solicitado integrado ao scroll existente |

## Recursos

- `src/components/home/CrewSticky.tsx`
- `src/components/home/ClientesWave.tsx`
- `src/index.css`
- `src/data/clientes.ts`
- Screenshot local fornecido pelo usuário.
