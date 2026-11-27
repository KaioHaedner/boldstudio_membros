# Preparar logos brancas do carrossel

Enviar uma logo original por vez. Para reprodução exata, a versão vetorial
monocromática oficial é preferível à geração por IA: conferir letras e detalhes
antes de aprovar o resultado.

## Prompt

Use a imagem anexada como referência exata. Extraia somente o lettering/nome
da marca e seus textos secundários, preservando grafia, tipografia, proporções
e espaçamento. Converta os traços das letras para branco puro (#FFFFFF),
mantendo os vazados transparentes. Remova fundo, placa, moldura, selo e símbolos
separados. Não redesenhe, não invente letras, não adicione contornos, sombras,
relevo ou brilho. Não entregue um retângulo branco nem apenas a silhueta do selo:
a escrita deve permanecer legível. Entregue PNG com canal alpha e transparência
real, não um fundo quadriculado desenhado. Canvas de 1200 ×600 px, marca
centralizada e margem de 8%. Se algum texto não estiver legível, avise em vez
de adivinhar. Não corte letras nem distorça a proporção da marca.

## Medidas de exibição

| Elemento | Mobile | Desktop (sm+) |
| --- | --- | --- |
| Área clicável | 208 ×112 px | 240 ×128 px |
| Imagem, limite com padding | 160 ×64 px | 192 ×80 px |

O tamanho final depende da proporção original (object-fit: contain). Os 1200×600
px são resolução de entrega, não dimensões de exibição. Converter depois para
WebP preservando alpha, em arquivo novo. Não aplicar filtros à versão pronta.
