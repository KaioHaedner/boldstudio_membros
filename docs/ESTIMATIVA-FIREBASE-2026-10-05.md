# Estimativa Firebase — 05/10/2026

Não é orçamento garantido. Medição de 30 dias do Supabase, por projeto,
inclui período de restrição de quota e requisições de recuperação/debug.
Tráfego bloqueado não representa demanda saudável; usuários únicos e consumo
futuro da Academy ainda não foram estimados por logs completos.

| Projeto | Cached egress | Uncached egress | Storage médio |
| --- | ---: | ---: | ---: |
| Antigo `erhtqgaxibncpondscna` | 7,445 GB | 0,329 GB | 0,347 GB |
| Novo `heriogfvynncvabbwspu` | 18,717 GB | 0,272 GB | 0,232 GB |

Total: 26,763 GB decimais ≈24,925 GiB. Egress é **tráfego entregue**, não
15 GB de arquivos de cache que possam ser apagados para zerar consumo.
Janelas de cobrança e últimos 30 dias são diferentes. A captura de 15,744 GB
do projeto novo pertence ao ciclo de cobrança, não a essa mesma janela.

## Premissas de preços consultados

- Blaze: sem mensalidade fixa do plano, cobrança por uso; Workspace não inclui
  esses serviços. [Firebase pricing](https://firebase.google.com/pricing).
- Cloud Storage Standard em São Paulo: US$0,035/GiB-mês; saída à internet
  para Brasil, primeira faixa: US$0,12/GiB. Operações A: US$0,005/1000;
  B: US$0,0004/1000. Faixa gratuita regional de Storage não inclui São Paulo.
  Buckets novos `.firebasestorage.app` seguem Google Cloud Storage, não os
  antigos preços de `.appspot.com`.
  [Cloud Storage pricing](https://cloud.google.com/storage/pricing).
- Firestore Standard: faixa gratuita de 1 GiB, 50 mil leituras/dia,
  20 mil escritas/dia, 20 mil exclusões/dia, 10 GiB de saída/mês. Não são
  operações acumuláveis no mês; backups/PITR são adicionais.
  [Firebase pricing](https://firebase.google.com/pricing).
- Hosting clássico: 10 GB de armazenamento e 10 GB/mês de transferência
  gratuitos; excedentes US$0,026/GB-mês e US$0,15/GB. Não confundir com
  App Hosting/SSR. Functions, IA, SMS, e-mail e serviços externos podem somar.
- Alertas de orçamento não bloqueiam gastos automaticamente.
  [Planos e faturamento](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans).
- Supabase Pro parte de US$25/mês, inclui 100 GB de Storage e quotas distintas
  de 250 GB cached /250 GB uncached; compute de projetos adicionais pode
  acrescentar custo. Não é ilimitado.
  [Supabase pricing](https://supabase.com/pricing).

## Conta indicativa (câmbio hipotético R$5/US$, sem impostos)

Repetir mecanicamente os 24,925 GiB históricos por Storage direto daria cerca
de US$2,99 de saída, mais armazenamento/operações. Não é previsão validada.
Para o site público atual, uma reserva inicial de US$5–10/mês (R$25–50,
R$300–600/ano) é apenas hipótese até medir tráfego após otimização.

| Saída mensal | Só tráfego em US$ | R$/mês hipotético | R$/ano hipotético |
| --- | ---: | ---: | ---: |
| 30 GiB | 3,60 | 18 | 216 |
| 100 GiB | 12 | 60 | 720 |
| 500 GiB | 60 | 300 | 3600 |
| 1000 GiB | 120 | 600 | 7200 |

Exemplo Academy: 100 alunos ×10 horas/mês ×2 Mbps ≈900 GB decimais,
838 GiB. Só saída de vídeos ≈US$100,58/R$503 por mês, sem IA/banco/operações.
Por isso vídeo de aulas merece streaming dedicado/adaptativo e controle de
acesso, não apenas colocar arquivos pesados no banco/Storage.

Não contar economia de cache como garantida: cache local ajuda visitas
repetidas, mas novos visitantes, eviction, Range e diferentes dispositivos
geram transferências. Proxy não elimina saída do Storage; respostas Range
206 não têm a mesma cacheabilidade CDN de arquivos completos.
[Vercel CDN caching](https://vercel.com/docs/caching/cdn-cache).

Próximo passo de estimativa confiável: janela saudável de 7–30 dias após
publicação aprovada, bytes por vídeo/página, espectadores, horas de aula,
leituras/escritas e tokens IA. Migração SQL→Firestore é remodelagem de dados,
consultas e autorização; não simples troca de chave SDK.
