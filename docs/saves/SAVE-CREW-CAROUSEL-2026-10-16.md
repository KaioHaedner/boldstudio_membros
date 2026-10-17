# Crew: carrossel horizontal compacto

## Pedido e resultado

- Referência: componente React anexado pelo usuário (`carousel-07`). Adaptado para `framer-motion`, já instalado; sem novas dependências ou imagens de demonstração.
- Cards com centros na mesma linha, sem rotação, arco, inclinação ou perspectiva. No repouso aparecem o card principal e dois vizinhos parcialmente recolhidos de cada lado.
- Altura preservada em 400 px; largura máxima de 430 px e ajuste responsivo.
- Fotos, nomes e cargos originais preservados. Cargo amarelo; descrição branca.
- Desktop: bloco de título/CTA centralizado verticalmente com a imagem, descontando a linha de navegação. Mobile: título, cards/setas, CTA e sticker, nessa ordem.
- Mouse e touch usam a superfície estável do palco. Scroll vertical/pinch continuam nativos; cancelamento do gesto não troca integrante.
- Setas de 44 px, teclado (←/→, Home/End), anúncio da seleção e navegação circular.
- Sem autoplay, camada duplicada de blur, timer permanente ou transformações 3D. Progresso de movimento não provoca render React por quadro; reduced-motion pula a mola.
- Gesto novo parte da última seleção confirmada para evitar perda de índice ao interromper uma transição.

## Verificação

- `npm run test:media`: 35 testes passaram, incluindo geometria/loop e cancelamento de pointer.
- Lint dos três arquivos TypeScript alterados passou.
- Chrome/Playwright: 1366, 900, 768, 390 e 360 px; sem overflow horizontal ou erros JS.
- Imagens locais carregadas; cinco cards visíveis; centros alinhados; matrizes sem rotação; descrição `rgb(255,255,255)`.
- Arraste com mouse, setas, teclado, wrap anterior/próximo e foco testados.
- Touch emulado via CDP: swipe nos dois sentidos, gestos repetidos, 12 toques rápidos nas setas, scroll vertical nativo, pointercancel e resize/orientação sem perder a navegação.
- Capturas: `docs/qa/2026-10-16/crew-desktop.png` e `crew-mobile.png`.
- Safari/iPhone físico não testado nesta execução. A implementação usa Pointer Events e touch-action padrão, sem depender de API exclusiva do Chromium em produção.

## Publicação

- O ajuste anterior do seletor de idioma já foi confirmado no domínio institucional.
- Esta alteração do Crew será validada em deployment antes de ser promovida. Não altera Bio, DNS, banco de dados nem credenciais.
