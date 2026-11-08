---
name: telaverde
description: Formato "Tela verde" da Lívia Brasil. A pessoa fala para a câmera e, quando comenta alguém ou algo, aparece recortada (sem o fundo) na frente do vídeo ou foto comentado, com legenda branca em negrito por frase. Manda o storyboard visual antes e só entrega o final com aprovação.
argument-hint: "[vídeo falando] [vídeos/fotos de fundo]"
disable-model-invocation: true
---

# /telaverde

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.

Monte um Reel vertical (1080x1920, 30 fps) igual ao modelo de referência, usando o vídeo e os fundos de `$ARGUMENTS`. Fale com a pessoa em português simples. Se faltar vídeo ou foto para algum trecho comentado, pergunte; não invente fundo.

## Como o formato é (copiar exatamente)

**Imagem:** a pessoa fala para a câmera, em tela cheia. Nos trechos em que ela **cita alguém, uma marca ou um post**, entra por trás dela o **vídeo ou a foto comentado, ocupando a tela toda**, e ela aparece **recortada (sem o fundo)** na frente, **um pouco menor (83%), no canto esquerdo e mais para baixo** (pedido da Lívia: `deslocX` -150, `deslocY` 220, para o fundo aparecer bem). Entrada e saída com **corte seco**. **O som do fundo fica mudo**; só a voz dela toca. **Sem música e sem efeitos sonoros.**

**Colagem (opcional, como na abertura da referência):** fotos de pessoas já recortadas por cima do fundo original dela, e ela na frente em tamanho normal (`colagem` com x, y e largura de cada foto).

**Legenda:** **por frase** (a frase inteira aparece de uma vez e troca seca), **Inter Bold 60 px branca** com sombra suave, centralizada, com letra maiúscula só no começo da frase e em nomes. **A primeira frase aparece inteira e maior** (72 px, até 4 linhas; `grande: true`). **Sempre no mesmo lugar, ~1 cm abaixo do queixo** já contando com ela menor nos trechos de tela verde (`legendaTopo`, padrão 1330).

**CTA:** se a pessoa falar um CTA, caixa marsala `#7D1D2F` com texto branco em negrito, `Comenta: PALAVRA`, **logo abaixo do queixo, colada em cima da legenda**. Fica parada até o fim. (A referência usa só a legenda; vale a regra da Lívia.)

O código pronto está em `modelo/TelaVerde.tsx`; `modelo/exemplo-dados.json` mostra todos os campos preenchidos. O recorte é feito antes, com `recorte/recortar_pessoa.py`.

## Regras que valem sempre

1. **Storyboard primeiro.** Nunca entregue o vídeo final sem antes mandar o storyboard e a pessoa aprovar.
2. **Prévia de 8 segundos contínua.** Depois do storyboard aprovado, mande uma prévia de 8 s de um trecho só, sem emendar duas partes (a pessoa entende emenda como corte errado).
3. **Vídeo final só com aprovação clara** ("pode fazer", "aprovado", "manda o final"). Silêncio ou elogio não é aprovação.
4. **Mude só o que a pessoa pedir.** Em cada ajuste, mexa apenas no ponto pedido e mantenha todo o resto igual.
5. **A narração começa no início da primeira frase**, sem silêncio, respiração ou "é..." antes.
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

Confira `ffmpeg`, Node, Whisper e Python com `mediapipe` e `opencv-python` (`pip install mediapipe opencv-python numpy`); instale o que faltar. Baixe uma vez o modelo de recorte indicado no topo de `recorte/recortar_pessoa.py`. Rode o /imparavel no vídeo antes, se a pessoa pedir edição básica.

## Passo 2: transcrever

Transcreva o vídeo com o tempo de cada palavra (Whisper). É daí que saem as legendas, os trechos de tela verde e o CTA.

## Passo 3: recortar a pessoa

`python3 recorte/recortar_pessoa.py <video> public/<nome>-recorte.webm <modelo.tflite>`. Confira um quadro do recorte por cima de uma cor lisa; se o cabelo ou as mãos sumirem, avise no storyboard.

## Passo 4: planejar e montar no Remotion (sem renderizar ainda)

1. `pessoa`: `arquivo` (original, com som), `recorte` (o .webm), `duracao`.
2. `fundos`: um por trecho em que ela comenta alguém ou algo, com `inicio`/`fim` nas pausas e o `arquivo` do vídeo ou foto (vídeo começa em `inicioArquivo`). Peça à pessoa os vídeos/fotos de cada trecho; não invente.
3. `legendas`: a primeira frase inteira com `grande: true`; depois frase por frase curta (até ~5 palavras), `inicio` = primeira palavra, `fim` = início da próxima. Tire ponto final, interrogação e reticências.
4. CTA: se houver, `cta.inicio` = início da primeira palavra do CTA.
5. Meça o queixo nos trechos de tela verde e use em `legendaTopo` o ponto mais baixo + ~95 px.
6. Copie `modelo/TelaVerde.tsx` para `src/` e registre como em `modelo/Root-exemplo.tsx`. Instale `@remotion/google-fonts` e `zod` na versão que o Remotion pedir.

## Passo 5: storyboard visual

Gere o storyboard como em "Como fazer o storyboard": a primeira frase, cada trecho de tela verde, algumas frases normais e o CTA. Abra automaticamente. Pergunte se quer mudar algo; ajuste só o que for pedido e abra de novo.

## Passo 6: prévia de 8 segundos

Renderize 8 s seguidos, sem emenda, com pelo menos um trecho de tela verde: `npx remotion render <entrada> TelaVerde previa-8s.mp4 --frames=0-239 --codec=h264 --crf=18`. Abra automaticamente e pergunte se pode fazer o vídeo final.

## Passo 7: vídeo final (só com aprovação)

Renderize o vídeo inteiro em H.264, salve como `<nome>-tela-verde.mp4` na pasta de entregas, confira 3 quadros (primeira frase, um trecho de tela verde e CTA), abra automaticamente e diga onde está o arquivo e a duração.
