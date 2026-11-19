---
name: ganchotresimagens
description: Formato "Gancho com três imagens" da Lívia Brasil. Começa com três imagens quadradas em fila e o título amarelo parado embaixo delas por cima do vídeo; depois cortes secos com zoom, legenda amarela por frase e imagens de apoio em tela dividida ou cheia. Manda o storyboard visual antes e só entrega o final com aprovação.
argument-hint: "[vídeo da pessoa falando] [3 imagens do gancho] [imagens de apoio, opcional]"
disable-model-invocation: true
---

# /ganchotresimagens

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.

Monte um Reel vertical (1080x1920, 30 fps) igual às referências, usando o vídeo e as imagens de `$ARGUMENTS`. Fale com a pessoa em português simples.

## Como o formato é (copiar exatamente)

Duas referências: o **gancho** vem do print que a Lívia mandou (três imagens pequenas em fila em cima do vídeo e o título embaixo delas) e **o resto do vídeo** segue o reel https://www.instagram.com/reel/DXP9ZspgMgs/ .

**Fonte (a mesma da legenda amarela da referência):** Montserrat Bold (700), amarela `#F2DD76`, sombra escura suave em volta (sem contorno duro), linhas juntas (entrelinha 1,08). O título do gancho usa **essa mesma fonte e cor**, só maior.

**Gancho:** a pessoa em tela cheia (zoom 1.0) e, por cima, **desde o primeiro quadro e sem nenhuma animação**:
- **três imagens quadradas** lado a lado (266 x 266 px cada, 19 px entre elas, fila centralizada, topo em y = 244), sem borda e sem sombra;
- logo embaixo, o **título** em Montserrat Bold amarela 70 px, centralizado, em 2 linhas parecidas (topo em y = 554, no máximo 900 px de largura).
Tudo fica **parado** (não acompanha a cabeça) até a pessoa terminar a primeira frase e **some por corte seco**, sem fade. Durante o gancho não há legenda. **Sem efeito sonoro** na entrada ou na saída (a referência não tem).

**Depois do gancho (estilo do reel de referência):**
- **Cortes secos** com **zoom alternando 1.0 e 1.15** a cada corte (jump cut). **Sem música e sem efeitos sonoros.**
- **Legenda por frase**, em blocos de 2 ou 3 linhas curtas (ex.: "e quase metade das / parábolas envolve / finanças"), Montserrat Bold amarela 58 px, minúscula como a fala (maiúscula só em nomes), centralizada, **sem animação** e sem palavra destacada. Em tela cheia fica **parada sempre no mesmo lugar, ~1 cm abaixo do queixo** (`legendaTopo`).
- **Imagens ou vídeos de apoio** (só se a pessoa mandar; o som dos vídeos fica mudo): **tela dividida** (imagem em cima de 0 a 960 px, com degradê suave no pé, pessoa embaixo a partir de 860 px, legenda na emenda em `legendaTopoDividida` = 980) ou **imagem em tela cheia** com a legenda por cima. Entram e saem por corte seco, alternando com a pessoa em tela cheia a cada 2 a 3 s, na hora em que a fala combina com a imagem. Se a pessoa não mandar imagens de apoio, o vídeo é só ela em tela cheia com cortes, zoom e legenda.

**CTA:** se a pessoa falar um CTA, caixa marsala `#7D1D2F` com texto branco em negrito, cantos arredondados, `Comenta: PALAVRA`, **colada em cima da legenda** (logo abaixo do queixo). Aparece quando ela começa a falar o CTA e fica parada até o fim; a legenda continua embaixo dela.

O código pronto está em `modelo/GanchoTresImagens.tsx`, na pasta desta skill; `modelo/exemplo-dados.json` mostra todos os campos preenchidos.

## Regras que valem sempre

1. **Storyboard primeiro.** Nunca entregue o vídeo final sem antes mandar o storyboard e a pessoa aprovar.
2. **Prévia de 8 segundos contínua.** Depois do storyboard aprovado, mande uma prévia de 8 s de um trecho só, sem emendar duas partes (a pessoa entende emenda como corte errado).
3. **Vídeo final só com aprovação clara** ("pode fazer", "aprovado", "manda o final"). Silêncio ou elogio não é aprovação.
4. **Mude só o que a pessoa pedir.** Em cada ajuste, mexa apenas no ponto pedido e mantenha todo o resto igual.
5. **O vídeo começa no início da primeira frase**, sem silêncio, respiração ou "é..." antes.
6. **Cortes precisos.** Nunca corte o pedaço de uma palavra correta. Só saem palavras que são erro (tropeço, repetição, frase abandonada, comentário de bastidor).
7. **Nunca mude o sentido** do que a pessoa disse. Na dúvida, deixe o trecho e marque "CONFIRA" no storyboard.
8. **Efeitos sonoros**, se algum formato usar, começam bem baixos, abaixo da voz.
9. **Nunca apague nem sobrescreva o vídeo original.** Tudo novo vai para arquivos novos.
10. **Abra tudo automaticamente no computador.** Assim que o storyboard, a prévia ou o vídeo final ficarem prontos, abra o arquivo sozinho para a pessoa ver, sem ela precisar procurar: `open "<arquivo>"` no Mac, `start "" "<arquivo>"` no Windows, `xdg-open "<arquivo>"` no Linux. Depois diga no chat o que abriu e onde o arquivo está salvo.
11. **CTA fixo na tela.** Só se a pessoa falar um CTA no vídeo (comentar uma palavra, seguir, curtir, salvar, compartilhar, chamar no direct, clicar no link). O CTA aparece no momento em que ela começa a falar o CTA e **fica parado na tela até o último quadro**, sem animação; a legenda continua rolando embaixo dele. Quando o CTA fica abaixo do queixo, a legenda fica praticamente colada embaixo da caixa do CTA, sem espaço vazio entre os dois. Neste formato o CTA fica logo abaixo do queixo, colado em cima da legenda. Texto curto e direto:
   - pedido para comentar: `Comenta: PALAVRA` (a palavra sempre em maiúsculas, ex.: `Comenta: BLACK`);
   - outros: `Me siga para mais`, `Curte, comenta e salva`, `Salva esse vídeo`, `Me chama no direct`.
   Estilo padrão: caixa marsala `#7D1D2F` com fonte branca em negrito e cantos arredondados. A posição depende do formato (veja a seção do formato); se o formato não disser, fica logo abaixo do queixo. Se não houver CTA falado, não coloque CTA. Mostre o CTA no storyboard como uma cena própria.

## Como fazer o storyboard (visual)

O storyboard é **visual**: a pessoa precisa ver todas as cenas do vídeo, na ordem, como uma tirinha.
1. **Divida o vídeo final em cenas.** Uma cena é cada momento em que muda algo na tela: um corte, uma nova frase de legenda, um título, uma imagem, a troca de layout. Em fala sem legenda, uma cena por frase.
2. **Tire uma imagem de cada cena já editada** (com o enquadramento, os textos e o layout finais, não do vídeo bruto), no meio da cena. No Remotion: `npx remotion still <entrada> <composição> quadros/cena-NN.png --frame=<frame> --props=<dados>.json`. Só com ffmpeg: `ffmpeg -ss <tempo> -i <video-editado> -frames:v 1 quadros/cena-NN.jpg`. Reduza para 360 px de largura.
3. **Monte o `storyboard.json`** com cada cena (imagem, tempo no vídeo final, título curto, o que se ouve ou a legenda, nota e `confira: true` quando houver dúvida), a lista de cortes e as observações. Veja o modelo no topo de `storyboard/gerar_storyboard.py`, na pasta desta skill.
4. **Gere a página:** `python3 storyboard/gerar_storyboard.py storyboard.json storyboard.html`. Ela sai num arquivo só, com as imagens dentro, e mostra as cenas numeradas em grade, os cortes e os pontos para CONFERIR.
5. **Abra automaticamente** o `storyboard.html` no navegador.
## Passo 1: preparar

Confira `ffmpeg`, Node e Whisper; instale o que faltar. Separe as **3 imagens do gancho** (na ordem em que a pessoa mandou: esquerda, meio, direita) e as **imagens de apoio**, se houver. Copie tudo para `public/imagens/` do projeto Remotion, sem mexer nos originais. As imagens do gancho são cortadas em quadrado pelo centro (`objectFit: cover`); se o rosto ou o assunto ficar cortado, avise no storyboard.

## Passo 2: tratar a fala com o /imparavel (sempre)

Faça no vídeo toda a edição básica do `/imparavel` (cortes de erros, respiros, 1.2x sem mudar a voz, áudio limpo, -14 LUFS) e salve `apresentadora.mp4`. Transcreva com o tempo de cada palavra: a legenda depende disso.

## Passo 3: planejar e montar no Remotion (sem renderizar ainda)

1. **Gancho:** `titulo` = a frase que a pessoa pedir; se ela não disser, use a primeira frase falada, curta, em 2 linhas parecidas (`\n`), sem ponto final. `fim` = início da primeira palavra da segunda frase. Diga no chat se o título é a fala exata ou se foi resumido.
2. **Cenas:** a primeira cena vai do 0 até `gancho.fim` (pessoa, zoom 1.0). Depois mantenha os cortes do vídeo tratado e alterne o zoom 1.0 e 1.15 a cada corte; corte também a cada 2 a 3 s quando houver imagem de apoio. Para cada imagem de apoio, escolha `dividida` ou `imagem` (alterne os dois, como na referência) e ponha no trecho em que a fala combina com ela.
3. **Legendas:** depois do gancho, uma frase curta por vez (até ~8 palavras), em 2 ou 3 linhas parecidas, cortando em vírgula e fim de frase; cada uma vai do início da primeira palavra até o início da próxima. Mantenha só vírgula e exclamação. Números em algarismos.
4. **CTA:** se houver, `cta.inicio` = início da primeira palavra do CTA.
5. Copie `modelo/GanchoTresImagens.tsx` para `src/` e registre como em `modelo/Root-exemplo.tsx`. Instale `@remotion/google-fonts` e `zod` na versão que o Remotion pedir. Preencha os dados como em `modelo/exemplo-dados.json` (todos os campos).
6. **Meça o queixo** em vários momentos (sem zoom), calcule a posição com zoom 1.15 (`576 + (queixo - 576) * 1.15`) e use em `legendaTopo` esse queixo mais baixo + ~100 px (1 cm abaixo). Se o queixo descer muito com o zoom, use `zoomOrigem` na altura do queixo (ex.: "50% 68%"). Confira que o título do gancho e as três imagens não cobrem o rosto; se cobrirem, avise no storyboard antes de mudar qualquer medida.

## Passo 4: storyboard visual

Gere o storyboard como em "Como fazer o storyboard": uma imagem do gancho (três imagens e título), uma por legenda, e uma por imagem de apoio (dizendo se é tela dividida ou cheia), mais o CTA. Abra automaticamente. Pergunte se quer mudar algo; ajuste só o que for pedido e abra de novo.

## Passo 5: prévia de 8 segundos

Renderize os 8 primeiros segundos, sem emenda (mostra o gancho e as primeiras legendas): `npx remotion render <entrada> GanchoTresImagens previa-8s.mp4 --frames=0-239 --codec=h264 --crf=18`. Abra automaticamente e pergunte se pode fazer o vídeo final.

## Passo 6: vídeo final (só com aprovação)

Renderize o vídeo inteiro em H.264, salve como `<nome>-gancho-tres-imagens.mp4` na pasta de entregas, confira 3 quadros (gancho, uma imagem de apoio e o CTA), abra automaticamente e diga onde está o arquivo e a duração.
