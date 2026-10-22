# Vídeos de serviços — 22/10/2026

## Escopo

- Institucionais: AgroBaggio/John Deere, FazCarnes, Mascarello & Guerra Advogados.
- Eventos: Exponorte 2026, confraternização AgroBaggio em Sorriso, resumo do quinto dia de feira AgroBaggio.
- Food/Produto: Forteza, Louvada Weis, Mangut Fit — Batata Doce.
- O mesmo arquivo é utilizado no mockup de iPhone e no player de cada trabalho; a imagem é contida, sem recorte ou deformação para forçar formato vertical.
- O arquivo de Sorriso tinha pixels em 720×1280, mas o conteúdo estava deitado. A matriz de orientação foi corrigida em 90° por remux, sem recompressão: reprodução/pôster ficam horizontais na posição correta, mantendo os pixels e o áudio originais. O pôster foi escolhido aos 20 segundos, evitando o quadro branco da abertura.
- Logos existentes de AgroBaggio, Exponorte e Forteza; nomes para as empresas sem logo fornecida.
- Título da abertura dos cases: “Marcas que confiaram na” + logo Bold inline.

## Entrega de mídia

`scripts/prepare-service-films.mjs` mantém os arquivos originais em Downloads intactos e gera versões estáticas H.264/AAC com MP4 fast-start, pôster WebP e nomes descritivos versionados. A resolução e a taxa de quadros nativas são preservadas na maior versão; isso não significa compressão sem perdas. Não há ampliação artificial para 4K.

Quando disponíveis: 720p nos mockups/telas pequenas, 1080p padrão no player grande do desktop e escolha manual de 4K no player grande. A opção Auto é uma escolha inicial por tamanho/formato do player, não streaming adaptativo por velocidade de conexão. Trocar a qualidade interrompe o vídeo e exige novo clique em reproduzir. Vídeos que já têm resolução menor mantêm sua resolução nativa.

As versões 4K são empacotadas por `scripts/package-service-4k.mjs` em HLS sem nova compressão. O player usa HLS nativo onde disponível e importa hls.js somente após clique nos demais navegadores compatíveis. O buffer do hls.js é limitado; ao encerrar, a instância é destruída e as requisições pendentes canceladas. Os MP4 intermediários 4K gerados ficam arquivados em `.verification/native-service-masters`, fora de Git/deploy; somente playlists e segmentos são publicados. Os originais em Downloads não são movidos.

Nenhum MP4 é solicitado ao abrir a página, rolar ou trocar a empresa/qualidade. O elemento de vídeo só é montado após reproduzir; há apenas um player ativo. Ao sair da área, trocar o trabalho ou ocultar a aba, o player é desmontado e a transferência é cancelada. O navegador/CDN ainda pode ter bytes já recebidos ou em trânsito.

As URLs são `/media/services/...`, servidas como arquivos estáticos no mesmo domínio, sem proxy API/Supabase. Cache imutável é seguro porque os nomes incluem versão. Reprodução, primeira carga e rastreamento de buscadores continuam consumindo tráfego; esta implementação não garante que cotas nunca serão atingidas. As versões grandes também precisam respeitar os limites de upload/hospedagem no momento de um futuro deploy.

## SEO

Nomes de arquivo descritivos, títulos, descrições, duração, pôsteres e `VideoObject` são gerados a partir do manifesto `src/apps/site/data/service-films.json`. `scripts/generate-service-video-sitemap.mjs` gera um sitemap de vídeo referenciado pelo robots.txt.

As cinco páginas de serviço também recebem HTML de entrada com título, descrição, Open Graph e canônica próprios em `scripts/generate-service-seo.mjs`, executado depois do build. As três categorias novas incluem os metadados de vídeo já no HTML estático. Rewrites explícitos no Vercel preservam as URLs públicas `/servico/...`; a navegação React mantém título/canônica atualizados. Isso corrige a canônica antiga que apontava todos os serviços para a Home.

Referências primárias:

- https://developers.google.com/search/docs/appearance/structured-data/video
- https://developers.google.com/search/docs/appearance/video
- https://github.com/video-dev/hls.js

Renomear ou adicionar metadados não garante indexação nem resultados de vídeo. O carregamento condicionado ao clique prioriza economia de tráfego; o Google recomenda players descobertos sem interação e páginas de exibição dedicadas para melhores condições de indexação. Sitemap e metadados expõem URLs públicas rastreáveis, mas não substituem validação posterior no Search Console. Não há tentativa de identificar bots ou servir conteúdo diferente a eles.

## Tamanhos e validação local

Valores em MiB, por arquivo completo; o navegador não baixa todos eles ao abrir a página.

| Trabalho | Auto desktop | Auto celular/mockup | Maior resolução disponível |
| --- | ---: | ---: | --- |
| AgroBaggio institucional | 62,4 | 31,8 | 3840×2160, HLS opcional |
| FazCarnes | 42,6 | 20,7 | 1920×1080 |
| Mascarello & Guerra | 38,6 | 16,3 | 3840×2160, HLS opcional |
| Exponorte 2026 | 45,5 | 45,5 | 1276×718 |
| AgroBaggio — Sorriso | 23,0 | 23,0 | 720×1280 |
| AgroBaggio — resumo da feira | 67,1 | 32,0 | 1920×1080 |
| Forteza | 5,8 | 5,8 | 1278×720 |
| Louvada Weis | 7,0 | 3,5 | 3840×2160, HLS opcional |
| Mangut Fit | 14,2 | 6,7 | 1920×1080 |

O diretório público completo, incluindo mídias anteriores e todas as opções 4K, soma aproximadamente 969 MiB. Isso é armazenamento total, não transferência inicial por visita. O maior arquivo individual tem aproximadamente 67 MiB; os grandes MP4 intermediários foram arquivados fora do deploy. Conferir os limites do plano antes da publicação.

- Build TypeScript/Vite e geração dos cinco HTMLs de SEO: aprovados.
- 32 testes de mídia, proxy e manifesto + 5 testes de HTML/canônica/rewrites: aprovados.
- As 18 versões foram inspecionadas com ffprobe: vídeo H.264, áudio AAC, duração completa, resolução nativa na maior versão e taxa de quadros preservada.
- Chrome em 1366×900 e 390×900: três categorias, três mockups/trabalhos por categoria, logos esperadas, nenhum MP4/HLS/segmento antes do clique, troca de qualidade sem download automático, áudio e ausência de overflow/erros JavaScript.
- Regressão de VT Comercial nos dois viewports: aprovada.
- Novo título com logo Bold nos dois viewports: aprovado.
- Streaming 4K reproduzido em 3840×2160 com áudio no Chrome, seek próximo ao fim e cancelamento ao sair da área: aprovado; apenas os segmentos necessários foram solicitados.
- Safari físico e aparelhos reais não foram testados nesta rodada.
- Publicado em 22/10/2026: Vercel `dpl_HGnYASfVpk8meXecb5u4hzZNhBw3`, estado `READY`, domínio `https://boldstudiobrasil.com`. Sem commit/push nesta etapa.

## Verificação após deploy

- Três páginas públicas: HTTP 200, canônicas individuais e três VideoObjects estáticos em cada HTML.
- Nove MP4s e pôsteres: HTTP 200, tamanhos corretos e cache imutável; teste de Range 206 com 1024 bytes idênticos ao arquivo local.
- Três playlists 4K: MIME HLS correto, conteúdo igual ao local e primeiros/últimos segmentos disponíveis com tamanho correto.
- Chrome público em 390×900: três trabalhos por categoria, nenhuma requisição de MP4/HLS/segmento antes do clique, sem overflow ou erros JavaScript.
- Home pública: novo título “Marcas que confiaram na” com logo Bold confirmado.
- `/.env.local` e `/.verification/streaming.html` não são públicos (403/404).
- O primeiro envio foi interrompido ao indicar inclusão de QA/intermediários. `.vercelignore` explícito exclui arquivos de ambiente, `.verification`, builds locais e caches; envio reiniciado e concluído com o escopo correto.
- Alertas preexistentes do build remoto em `api/media.ts` (tipos Node/target de `Object.hasOwn`) e 15 vulnerabilidades npm continuam como dívida técnica; não foram corrigidos nesta entrega. O build frontend e o deploy concluíram.
