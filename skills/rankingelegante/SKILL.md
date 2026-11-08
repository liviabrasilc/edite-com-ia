---
name: rankingelegante
description: Formato "Ranking elegante" da Lívia Brasil. A pessoa classifica produtos falando para a câmera; título dourado no começo, círculos de 1 a 10 do lado esquerdo, legenda de uma palavra e cada produto sobe grande e voa para a posição dita. Manda o storyboard visual antes e só entrega o final com aprovação.
argument-hint: "[vídeo da pessoa falando] [fotos dos produtos]"
disable-model-invocation: true
---

# /rankingelegante

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.

Monte um Reel vertical (1080x1920, 30 fps) igual ao modelo de referência, usando o vídeo de `$ARGUMENTS`. Fale com a pessoa em português simples.

## Como o formato é (copiar exatamente)

A pessoa **em tela cheia o tempo todo**, fundo original, sem zoom. **Sem música e sem efeitos sonoros.** O áudio é a voz como veio.

**Título:** no começo, **centralizado na tela**, logo acima do círculo 1 (topo em y = 268): **Bebas Neue 94 px dourado `#E8C847`** com brilho escuro em volta (ex.: "TOP 10 PRODUTOS"). **Fica parado em cima do primeiro quadro até o fim** e só sai na hora do CTA, junto com o ranking.

**Círculos:** 10 círculos fixos do lado esquerdo (centro em x = 272, 1 cm mais para dentro que a referência para o Instagram não cortar, do 1 em y = 450 ao 10 em y = 1470, um pouco mais baixo que a referência para o título caber centralizado em cima, 105 px), cinza translúcidos com **borda branca tracejada** e o número branco em **Montserrat Black**. Sem animação.

**Legenda:** **uma palavra por vez, em MAIÚSCULAS**, Montserrat Black (900) 60 px, branca com sombra suave, centralizada em x = 630 (sem invadir o ranking). Fica **parada sempre no mesmo lugar**, **logo embaixo do queixo** (`legendaTopo` = queixo mais baixo + ~20 px), nunca no rosto. Sem ponto final.

**Produtos:** cada produto é uma foto sem fundo (PNG). Quando a pessoa **fala o nome do produto**, ele **entra com o motion de transição da referência: aparece já no lugar, ~1,7x maior e bem borrado, e diminui rápido como um zoom out** até o tamanho normal (até 380 x 520 px, 9 quadros), e fica parado logo embaixo da legenda (`produtoTopo`). Quando ela diz a posição, ele **voa diminuindo** até o lado direito do círculo **desse número** (8 quadros, até 90 x 100 px) e fica ali. **O ranking segue exatamente o que a pessoa fala**, em qualquer ordem.

**CTA:** se a pessoa falar um CTA, caixa marsala `#7D1D2F` com texto branco em negrito, cantos arredondados, `Comenta: PALAVRA`, **logo abaixo do queixo e colada em cima da legenda**. Aparece quando ela começa a falar o CTA e fica parada até o fim. **Quando o CTA entra, o ranking sai da tela** (título, círculos e produtos) e ficam só o CTA e a legenda.

O código pronto está em `modelo/RankingElegante.tsx`, na pasta desta skill; `modelo/exemplo-dados.json` mostra todos os campos preenchidos e `modelo/exemplo-produtos/` tem produtos de exemplo (só para teste).

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
11. **CTA fixo na tela.** Só se a pessoa falar um CTA no vídeo (comentar uma palavra, seguir, curtir, salvar, compartilhar, chamar no direct, clicar no link). O CTA aparece no momento em que ela começa a falar o CTA e **fica parado na tela até o último quadro**, sem animação; a legenda continua rolando embaixo dele. Quando o CTA fica abaixo do queixo, a legenda fica praticamente colada embaixo da caixa do CTA, sem espaço vazio entre os dois. Neste formato o CTA fica logo abaixo do queixo, colado em cima da legenda, e o ranking sai da tela quando o CTA entra. Texto curto e direto:
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

Confira `ffmpeg`, Node e Whisper; instale o que faltar. Neste formato **a pessoa já manda o vídeo cortado**: use o vídeo como veio, sem cortar de novo e sem acelerar.

**Imagens dos produtos:** a pessoa baixa a imagem de cada produto e coloca na pasta `assets` do projeto, com o nome do produto no arquivo (ex.: `assets/nivea-creme.png`, `assets/cerave.jpg`). Liste os arquivos da pasta `assets` e ligue cada imagem ao produto que a pessoa fala, pelo nome (ignore maiúsculas, acentos, hífens e a extensão; aceite nome parecido ou só a marca). Se a imagem tiver fundo, tire o fundo (ex.: `rembg`) e salve uma cópia em PNG, sem mexer na original. Anote a proporção (largura / altura) de cada imagem. Se faltar a imagem de algum produto falado, ou se uma imagem não bater com nenhum nome, pergunte à pessoa antes de seguir.

## Passo 2: transcrever

Transcreva o vídeo com o tempo de cada palavra (Whisper). É daí que saem a legenda, os nomes dos produtos, as posições e o CTA.

## Passo 3: planejar e montar no Remotion (sem renderizar ainda)

1. Cenas: o vídeo inteiro como veio, sem zoom.
2. Título: o tema em maiúsculas, curto, sem ponto final. Se a pessoa não disser, use "TOP 10 <TEMA>".
3. Legendas: uma entrada por palavra falada, em MAIÚSCULAS, do início da palavra até o início da próxima (no máximo 0,9 s). Tire ponto final, interrogação e reticências; mantenha só vírgula e exclamação. Números em algarismos.
4. Para cada produto: `entra` = início da palavra em que a pessoa fala o nome do produto; `voa` = início da palavra em que ela diz a posição; `posicao` = o número dito. Se ela não disser a posição de algum produto, pergunte.
5. CTA: se houver, `cta.inicio` = início da primeira palavra do CTA.
6. Meça o queixo em vários momentos e use em `legendaTopo` o ponto mais baixo + ~20 px (legenda logo embaixo do queixo). Use `produtoTopo` = `legendaTopo` + 80 (o produto grande aparece logo embaixo da legenda, bem visível).
7. Copie `modelo/RankingElegante.tsx` para `src/` e registre como em `modelo/Root-exemplo.tsx`. Instale `@remotion/google-fonts` e `zod` na versão que o Remotion pedir. Preencha os dados como em `modelo/exemplo-dados.json` (todos os campos).

## Passo 4: storyboard visual

Gere o storyboard como em "Como fazer o storyboard": uma imagem do começo (título e círculos), e para cada produto uma com ele grande (dizendo o nome falado e a imagem usada) e uma com ele já na posição, mais o CTA (já sem o ranking). Abra automaticamente. Pergunte se quer mudar algo; ajuste só o que for pedido e abra de novo.

## Passo 5: prévia de 8 segundos

Renderize os 8 primeiros segundos, sem emenda: `npx remotion render <entrada> RankingElegante previa-8s.mp4 --frames=0-239 --codec=h264 --crf=18`. Abra automaticamente e pergunte se pode fazer o vídeo final.

## Passo 6: vídeo final (só com aprovação)

Renderize o vídeo inteiro em H.264, salve como `<nome>-ranking-elegante.mp4` na pasta de entregas, confira 3 quadros (começo, um produto voando e o CTA), abra automaticamente e diga onde está o arquivo e a duração.
