# SAVE — cópia organizada para BoldStudioHub

Origem `KaioHaedner/boldstudio_membros` em `6e06f19`. Destino já existente
`boldstudiobrasil/BoldStudioHub`, inicialmente em `98ebe6f`, ancestral da origem.

Fontes organizadas em `src/apps/{site,academy,admin,crew}` e `src/shared`.
API preservada em `api`, migrations e funções em `supabase`. URL de mídia
configurável; suporte publishable key sem uso de chave privilegiada no frontend.

Build, lint focado, comparação das 42 rotas e extração dos temas: aprovados.
Renderização local em desktop/mobile passou; mídias externas não foram verificadas.
Lint global herdado: 24 erros e 2 avisos, iguais à origem.

Vercel da Bold confirmada; projeto `boldstudio-hub` criado com envs públicas.
Conexão GitHub depende de autorização do app Vercel ao repo privado.
Recuperação de mídias, banco remoto, DNS e publicação comercial continuam pendentes.
