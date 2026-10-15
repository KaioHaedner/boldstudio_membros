# Linha do tempo e botão de Cases — 2026-10-05

Prévia local BoldStudioHub. Sem deploy/push/DNS. As novas fotos substituem a decisão anterior de manter a jornada sem fotos laterais.

- Arquivos recebidos: `boldstudio_lateral_linha_do_tempo_01.webp` (260698 bytes) e `boldstudio_lateral_linha_do_tempo_02.webp` (183784 bytes). WebP 500×333; originais preservados. Cópias com hash em `public/media/backgrounds`.
- Primeiro no começo da jornada à esquerda; segundo no final à direita. Ambos atrás do SVG, com degradê, `pointer-events: none` e carregamento lazy.
- Compartilham `.clientes-lateral`: exatamente as dimensões da imagem de Clientes, inclusive regra mobile. Conferidos 614.39×510 px no viewport desktop da QA, tanto nas fotos quanto na referência.
- Logo do Case agora no canto superior direito; único botão “Ver projeto completo” abaixo dela, dentro do player. Botão retirado da legenda inferior.
- Troca de Case conserva o destino dinâmico. Clique de teste em Madô abriu `/projeto-mado-burguer`.
- Capturas: `docs/qa/2026-10-05/timeline-start-photo.jpg`, `timeline-end-photo.jpg`, `cases-project-button-top-right.jpg`.
- Build e lint dos dois componentes passaram. Capturas desktop; Android físico não validado nesta rodada.
