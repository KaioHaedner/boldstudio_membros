# SAVE-202 | 14/07/2026 | BoldStudio: Crew com rail vertical e assinatura estática

## Mudança de direção

- Removidos o eyebrow `Crew` e o título `Quem faz a BoldStudio acontecer`.
- Removida a faixa-manifesto horizontal full-width do SAVE-201.
- A seção agora começa diretamente na cena full-screen dos cards.

## Nova composição

- `BoldCrew` permanece estático em uma etiqueta amarela no canto inferior esquerdo.
- O manifesto `O ÚLTIMO TIME AUDIOVISUAL QUE VOCÊ TERÁ` passou para uma coluna amarela vertical à direita.
- Texto preto ampliado com `writing-mode: vertical-rl` e loop contínuo vertical de 20 segundos.
- A coluna começa abaixo do Header e termina acima da área da RecIA.
- Header e RecIA possuem z-index superior; o rail não bloqueia interação.
- Cards reservam uma largura responsiva para a coluna, evitando cobrir fotos e informações.
- O fundo preto opaco de cada card foi removido.
- Um único overlay preto a 68% mantém legibilidade e permite ver o ShaderGradient interativo atrás da cena.
- `prefers-reduced-motion` desativa o movimento do manifesto.

## Validação

- Lint focado em `CrewSticky.tsx`: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `git diff --check`: passou.

## Arquivos

- `src/components/home/CrewSticky.tsx`
- `src/index.css`
- `docs/stories/2026-07-14-home-crew-clientes-editorial.md`
- `task_plan.md`
- `findings.md`
- `progress.md`

## Relacionados

[[project_boldstudio]] [[SAVE-201_2026-07-14_boldstudio-marquee-crew]]
