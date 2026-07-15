# Achados: Home institucional BoldStudio

## Requisitos

- Conferir e preservar tipografia e cores já definidas no projeto.
- Manter os cards atuais do Crew.
- Apresentar o Crew ocupando toda a tela, inspirado na escala editorial da Sand.
- Substituir o antigo movimento de logos em S por rolagem horizontal.
- Usar duas faixas de clientes: uma em cima e outra embaixo, com movimentos complementares.
- Preservar parallax e ScrollTrigger existentes.
- Fazer o Crew ocupar visualmente toda a viewport, sem o container estreito visto no deploy atual.
- Deixar as duas linhas de clientes retas, uma em cima e outra embaixo.
- Remover o header arredondado em formato de cápsula.
- Desktop: logo no canto superior esquerdo, idioma e texto `Menu +`.
- Mobile: logo no canto superior esquerdo e toggle no canto superior direito.
- Usar como background da hero o mesmo arquivo GIF já presente no projeto do Academy.
- Remover o eyebrow `Crew` e o título `Quem faz a BoldStudio acontecer`.
- Remover a faixa amarela horizontal criada no SAVE-201.
- Inserir `BoldCrew` estático em amarelo dentro da cena full-screen.
- Transformar o manifesto em carrossel vertical com fonte preta muito maior.
- Limitar a coluna vertical à altura útil do container, sem cobrir Menu ou RecIA.
- Permitir que o shader interativo apareça atrás do conteúdo do Crew.

## Achados visuais

- O screenshot da Sand usa seções de tela cheia, tipografia em escala extrema, alto contraste, mosaicos de imagens e alternância entre áreas densas e respiro.
- A referência será aplicada à escala e ao ritmo, não à identidade de marca.
- A captura 122326 mostra o deploy antigo: card do Crew centralizado com margens grandes e metade direita sem foto carregada.
- A captura 122401 mostra o efeito antigo dos clientes: cards isolados distribuídos verticalmente, não duas linhas horizontais.
- As duas capturas mostram o header antigo em cápsula centralizada.
- O commit `9f25291` ainda não foi publicado, portanto as capturas não representam o código local mais recente.
- A referência Sand usa uma faixa vertical de grande escala como eixo editorial do elenco.
- A captura atual do projeto mostra que o título externo cria uma introdução redundante antes da cena full-screen.
- O mockup desejado posiciona `BoldCrew` no canto inferior esquerdo e a faixa vertical na lateral direita.
- No mockup, a faixa começa abaixo do header e termina antes da RecIA, formando uma área segura clara.

## Achados técnicos

- A fonte global atual é `Inter`, com fallbacks de sistema; não existem arquivos locais de fonte.
- Tokens oficiais: preto `#000000`, amarelo `#FFD712`, branco `#FFFFFF` e grafite `#282828`.
- `CrewSticky` já ocupa `100svh`, usa pin e ScrollTrigger, mas os cards têm somente `min(65%, 60rem)` de largura e 60% de altura.
- `ClientesWave` contém 14 clientes clicáveis, modal e páginas individuais; somente a apresentação do conjunto deve mudar.
- O efeito atual de clientes é uma coluna vertical com deslocamento senoidal em X e recorte variável.
- `package.json` não possui script `test`; existem `lint`, `typecheck` e `build`.
- O diretório `docs/stories` não existia no início desta tarefa.
- O Academy usa `StudioVideoBg`, não um GIF. O asset real é `VD_BOLD_01.mp4` no bucket público `avatars` do Supabase.
- `StudioVideoBg` já encapsula autoplay, muted, loop, playsInline e object-cover, portanto pode ser reutilizado diretamente na hero.
- O header atual concentrava logo, sete links, idioma e CTA dentro de uma cápsula `max-w-4xl`.
- O novo header concentra navegação em overlay full-screen, reduzindo a barra fixa a logo, idioma e controle de menu.

## Decisões técnicas

| Decisão | Motivo |
|---|---|
| Manter Inter e os tokens existentes | Preservar a identidade implementada da BoldStudio |
| Dividir `CLIENTES` por índices pares e ímpares | Gera duas pistas equilibradas sem inventar conteúdo |
| Duplicar visualmente cada pista | Permite movimento horizontal contínuo; a segunda cópia será escondida da árvore de acessibilidade |
| Usar ScrollTrigger com scrub | Mantém o comportamento solicitado integrado ao scroll existente |
| Reutilizar `StudioVideoBg` | É exatamente o componente e o arquivo usados pelo Academy; evita divergência e mídia duplicada |
| Crew com `100vw × 100svh` | Remove definitivamente o container central estreito apontado pelo usuário |
| Remover offsets verticais das logos | Produz duas linhas horizontais retas, conforme a correção visual do usuário |
| Rail com `top` e `bottom` responsivos | Mantém o manifesto dentro da altura útil da viewport |
| Rail com z-index inferior ao Header e RecIA | Garante que os controles globais nunca sejam cobertos |
| Fundo único sem preto opaco em cada card | Evita bloquear completamente o ShaderGradient atrás da seção |

## Recursos

- `src/components/home/CrewSticky.tsx`
- `src/components/home/ClientesWave.tsx`
- `src/index.css`
- `src/components/home/Header.tsx`
- `src/pages/HomeInstitucionalPage.tsx`
- `src/components/StudioVideoBg.tsx`
- `src/data/clientes.ts`
- Screenshot local fornecido pelo usuário.

## Hotfix Crew sem sobreposição

- O fundo transparente revelou todos os cards futuros, pois a animação controlava apenas transformações.
- A correção precisa ocultar os cards inativos antes do primeiro frame e durante todo o ScrollTrigger.
- Um crossfade curto entre o card atual e o próximo preserva fluidez sem criar uma pilha legível de textos.

## Comparação com `Sticky Cards Scroll GSAP.zip`

- O JavaScript original nunca altera `opacity` ou `visibility`.
- A pilha depende de `yPercent`, `scale`, `rotationX`, z-index decrescente e `transform-origin: center bottom`.
- Cards futuros permanecem presentes e aparecem como camadas menores atrás do card ativo.
- A separação visual funciona porque cada card original possui fundo opaco.
- A implementação BoldStudio anterior ao SAVE-202 também usava `background: #000000` em `.crew-card`.
- A regressão nasceu ao trocar esse fundo por `transparent`; o SAVE-203 mascarou o sintoma com `autoAlpha` e removeu a leitura da pilha.
- A restauração correta é retirar o `autoAlpha` e devolver o fundo preto do card, preservando imagens, textos, rail e integrações atuais.

## Remoção do ShaderGradient

- O usuário decidiu remover integralmente o fundo ShaderGradient e avaliar outro efeito depois.
- `StarfieldBackground` serve apenas como wrapper do `BoldShaderGradientScene`.
- `@shadergradient/react`, `@react-three/fiber`, `camera-controls` e `three-stdlib` não possuem outros consumidores em `src`.
- `three` e `@types/three` devem permanecer porque `ReelsEspiral.tsx` usa Three.js diretamente.
