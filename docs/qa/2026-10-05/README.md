# QA — recuperação de mídia e ajustes da home

Ambiente: cópia `BoldStudioHub`, branch `codex/organize-subdomains`, Vite local
em `127.0.0.1:5175`. Nenhuma publicação, troca de DNS ou push desta rodada.
SDK na prévia usa configuração pública fictícia: fluxos autenticados não foram
validados. Não substituir configuração real pelo ambiente de QA.

## Estado final após novas orientações do usuário

- Soluções: exatamente 3 fotos (2 à esquerda, 1 centralizada à direita).
- Crew, abertura de Cases, Clientes e Processo: zero fotos laterais.
- Cases: exatamente 1 foto, à direita; moeda da Bold à esquerda abaixo do sticker.
- Player ampliado (mobile 4:3, desktop até 1600 px); abertura termina mais
  perto do player. Contêiner da marca não tem mais fundo branco. Fundo embutido
  no bitmap original exige asset transparente, não filtro que apague letras.
- Parallax tem suavização temporal e RAF encerra ao estabilizar; scroll continua
  nativo. Ausência de lag em aparelho real ainda não foi comprovada.
- 17 logos originais: DuoTorri e Sonhalto recebidas no ZIP 22_05_47 e confirmadas
  carregadas (950 px de largura natural). Nenhuma usa o placeholder Bold.
- Filtros brancos que apagavam lettering foram suspensos: originais legíveis
  até receber versões brancas transparentes. Bordas cinzas removidas (DOM: 0 px).
- Prompt e tamanhos em `docs/PROMPT-LOGOS-BRANCAS.md`.
- Captura atual: [Clientes sem laterais](clientes-sem-laterais.jpg).
- DOM conferido: fotos por seção = 3/0/0/1/0/0 (Soluções/Crew/abertura/Cases/
  Clientes/Processo). Capturas antigas abaixo ilustram versões intermediárias.
- Novo download autorizado tentado: os 9 vídeos referenciados em
  Videos_Cliente_New continuam HTTP 402/exceed_cached_egress_quota. Manifesto
  local ignorado em .verification/recovery/client-videos-20261005. Nenhum novo
  vídeo baixado. Painel autenticado não verificado após desconexão da extensão.
- Primeira foto do Crew tem carregamento eager/prioritário. Gesto e ciclo foram
  tratados antes; inspeção final em Android físico permanece pendente.

## Entregas e evidências históricas desta rodada

- Proxy: HEAD real, validação de bucket/caminho, Range 206 privado, respostas
  condicionais 304 e erros de quota não armazenados nem repetidos.
- Vídeos decorativos: 15 previews novos de até 10 segundos, sem áudio,
  290.948.055 → 8.949.723 bytes (96,92% menos **nesses arquivos**, não promessa
  de redução equivalente na cobrança). Originais recuperados preservados.
- Vídeos fora da tela ou em segundo plano pausam; filmes completos não tocam
  automaticamente. Economia de dados/movimento reduzido evitam autoplay.
- Crew: gesto vertical preservado; cancelamento/multitoque não trocam card;
  arrasto horizontal nativo no navegador de QA manteve scrollY em 2709.
  Isso não substitui validação em aparelho Android/Chrome real.
- Home tem fallback de erro/importação e fundo leve no mobile, sem depender
  de quatro cenas WebGL para revelar o conteúdo.
- CTA de clientes fica sozinho; instrução explícita abaixo do carrossel.
- Nove WebPs laterais enviados ao bucket público `brand/backgrounds-20261005`:
  HTTP 200, MIME image/webp e SHA-256 conferidos com os arquivos fornecidos.
  Nenhuma política de acesso alterada. Produção usa proxy; DEV usa os mesmos
  bytes locais. O proxy de produção ainda precisa validar a nova rota aninhada.
- Logos: 15 originais do ZIP importados sem alteração de bytes. Branco é
  tratamento CSS do carrossel; demais páginas mantêm os originais coloridos.
  JMD v1 tem alpha inteiramente zero: escolhida v2. DuoTorri e Sonhalto faltam.
  Filtros não equivalem a vetores monocromáticos oficiais e podem simplificar
  detalhes internos de selos/marcas multicoloridas.
- Soluções: quatro imagens, duas de cada lado, gradiente horizontal/vertical.
  Movimento acompanha scroll com distâncias limitadas e velocidades diferentes.
  Não há preventDefault de roda/toque, body overflow:hidden ou snap de telas.
  Um RAF por evento, IntersectionObserver limita à seção visível, cleanup React
  e prefers-reduced-motion preservados. Scroll mobile 1676 → 1845 alterou os
  offsets das fotos de -1,50/+0,97/-0,82/+1,50 para +6,74/-4,38/+3,71/-6,74 px.
  Sem overflow horizontal nessa prévia. Desktop também inspecionado visualmente.

Referência visual consultada: https://sand.black/ . ZIP de referência lido
integralmente: `Efeito Parallax Full Page.zip`, Império WEB Codes Store,
marsdesigner.com.br/codesstore. A implementação local de imagens é independente;
o pacote comercial original não foi republicado nem incluído no repositório.

Capturas: [Soluções mobile](solucoes-mobile.jpg),
[Soluções desktop](solucoes-desktop.jpg), [Clientes mobile](clientes-mobile.jpg),
[Rodapé mobile](footer-mobile.jpg), [Rodapé desktop](footer-desktop.jpg).
Capturas anteriores não confirmam o estado de alterações posteriores do usuário.

## Gates

- 20 testes de gesto/orçamento de mídia/proxy passaram.
- Build TypeScript/Vite passou, com aviso de chunk principal >500 KB.
- Lint focado de Soluções/Clientes passou; diff-check passou.
- Lint global anterior mantém 24 erros e 2 avisos herdados (não são 24 bugs
  de runtime comprovados).
- Ainda necessários: cold reload e toque em Android/Chrome real, funções admin/
  Academy/auth com backend real, segurança/autorizações e configuração de deploy.
- Nove vídeos e 13 SVGs do projeto novo continuaram retornando 402 na recuperação;
  o pagamento do projeto antigo não comprova liberação da outra organização.

## Achados para triagem (não corrigidos nesta rodada)

- Crew autenticado ainda tem pasta/rota de painel incompleta.
- Flag local de 2FA não comprova proteção server-side.
- Progresso de aula pode exibir estado anterior enquanto nova consulta carrega;
  investigar loading e feedback de erro antes da entrega da Academy.
- Contadores admin ignoram erros de consulta; zero pode significar falha.
- Checkout/sucesso têm conteúdo placeholder: não comprovam pagamento.
- Link Facebook do footer ainda é `#`.
- Auditoria completa de todas as rotas e integrações não foi concluída.
