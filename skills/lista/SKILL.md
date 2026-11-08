---
name: lista
description: Formato "Lista de 1 a 10" da Lívia Brasil. A pessoa classifica produtos falando para a câmera em tela cheia; título fixo no topo, números de 1 a 10 do lado esquerdo e cada produto entra na mão e voa para a sua posição. Manda o storyboard visual antes e só entrega o final com aprovação.
argument-hint: "[vídeo da pessoa falando] [fotos dos produtos]"
disable-model-invocation: true
---

# /lista

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.

Monte um Reel vertical (1080x1920, 30 fps) igual ao modelo de referência, usando o vídeo de `$ARGUMENTS`. Fale com a pessoa em português simples.

## Como o formato é (copiar exatamente)

A pessoa **em tela cheia o tempo todo**, fundo original, **só cortes secos** (sem zoom). **Sem legenda, sem música e sem efeitos sonoros.** O áudio é a voz tratada.

**Título:** fixo no topo do primeiro ao último quadro, centralizado, em 2 linhas (ex.: "Classificando hidratantes\nfaciais de 1 a 10"), **Montserrat ExtraBold (800) 71 px**, branca, com sombra escura dura deslocada 4 px para baixo e para a direita. Começa em y = 222 px. Sem animação.

**Lista:** os números "1 -" até "10 -" fixos do lado esquerdo (do 1 em y = 608 ao 10 em y = 1675), Montserrat ExtraBold 56 px, mesma sombra, terminando em x = 278 px (1 cm mais para dentro que a referência, para o Reels não cortar: regra da Lívia). Os produtos ficam à direita do número, a partir de x = 292 px. Sem animação.

**Produtos:** cada produto é uma foto sem fundo (PNG). Quando a pessoa **fala o nome do produto**, ele **entra deslizando pela borda direita até a mão dela** (5 quadros), com uns 340 px, e **fica parado** ali enquanto ela fala dele. Quando ela diz a posição (ex.: "oitavo lugar", "fica em 8º", "número 8"), ele **voa em curva, diminuindo**, até o lado direito **desse número** (18 quadros), com no máximo 170 x 72 px, e fica ali. **O ranking segue exatamente o que a pessoa fala**, em qualquer ordem: se ela diz 8º e depois 2º, o primeiro vai para o 8 e o segundo para o 2.

**CTA:** se a pessoa falar um CTA, caixa marsala `#7D1D2F` com texto branco em negrito, cantos arredondados, `Comenta: PALAVRA`, **logo abaixo do queixo** (cerca de 1 cm), centralizada. Aparece quando ela começa a falar o CTA e fica parada até o fim. **Quando o CTA entra, o ranking sai da tela** (título, números e produtos) **e fica só o CTA** até o fim (regra da Lívia). Sem CTA falado, o ranking fica até o fim.

O código pronto está em `modelo/Lista.tsx`, na pasta desta skill; `modelo/exemplo-dados.json` mostra todos os campos preenchidos e `modelo/exemplo-produtos/` tem produtos de exemplo (só para teste).

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
11. **CTA fixo na tela.** Só se a pessoa falar um CTA no vídeo (comentar uma palavra, seguir, curtir, salvar, compartilhar, chamar no direct, clicar no link). O CTA aparece no momento em que ela começa a falar o CTA e **fica parado na tela até o último quadro**, sem animação; a legenda continua rolando embaixo dele. Quando o CTA fica abaixo do queixo, a legenda fica praticamente colada embaixo da caixa do CTA, sem espaço vazio entre os dois. Neste formato (que não tem legenda) o CTA fica logo abaixo do queixo, centralizado. Texto curto e direto:
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

Transcreva o vídeo com o tempo de cada palavra (Whisper). É daí que saem os nomes dos produtos, as posições e o CTA.

## Passo 3: planejar e montar no Remotion (sem renderizar ainda)

1. Cenas: o vídeo inteiro como veio, sem zoom (`cenas` com uma cena só, ou uma por corte que já existir).
2. Título: o tema da lista em 2 linhas parecidas, sem ponto final. Se a pessoa não disser, use "Classificando <tema> de 1 a 10".
3. Para cada produto, na transcrição: `entra` = o início da palavra em que a pessoa **fala o nome do produto** pela primeira vez; `voa` = o início da palavra em que ela **diz a posição** desse produto; `posicao` = o número que ela disse (oitavo, 8º, oito, número 8, "em oitavo lugar"...). Siga exatamente a ordem e as posições que ela falar. Se ela não disser a posição de algum produto, ou disser duas posições diferentes, pergunte. Coloque o produto na mão dela (`maoX`, `maoY`: veja num quadro onde está a mão).
4. CTA: se houver, `cta.inicio` = início da primeira palavra do CTA. A partir dali o ranking some e fica só o CTA.
5. Copie `modelo/Lista.tsx` para `src/` e registre como em `modelo/Root-exemplo.tsx`. Instale `@remotion/google-fonts` e `zod` na versão que o Remotion pedir.
6. Preencha os dados como em `modelo/exemplo-dados.json` (preencha todos os campos: o Remotion não aplica os valores padrão). Para o CTA, meça o queixo e use em `ctaTopo` o queixo + 100 px.

## Passo 4: storyboard visual

Gere o storyboard como em "Como fazer o storyboard": uma imagem do começo (título e lista), e para cada produto uma com ele na mão (dizendo o nome falado e a imagem usada) e uma com ele já na posição, mais o CTA (já sem o ranking). Abra automaticamente. Pergunte se quer mudar algo; ajuste só o que for pedido e abra de novo.

## Passo 5: prévia de 8 segundos

Renderize os 8 primeiros segundos, sem emenda: `npx remotion render <entrada> Lista previa-8s.mp4 --frames=0-239 --codec=h264 --crf=18`. Abra automaticamente e pergunte se pode fazer o vídeo final.

## Passo 6: vídeo final (só com aprovação)

Renderize o vídeo inteiro em H.264, salve como `<nome>-lista.mp4` na pasta de entregas, confira 3 quadros (começo, um produto voando e o final com a lista), abra automaticamente e diga onde está o arquivo e a duração.
