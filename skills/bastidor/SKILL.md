---
name: bastidor
description: Formato "Bastidor" da Lívia Brasil. Bastidor de um serviço feito de takes curtos com corte seco e narração por cima, gancho em palavras grandes, valor revelado por uma moeda dourada, legenda pequena itálica palavra por palavra e final com música. Manda o storyboard visual antes e só entrega o final com aprovação.
argument-hint: "[narração] [takes do bastidor]"
disable-model-invocation: true
---

# /bastidor


> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.
Monte um Reel vertical (1080x1920, 30 fps) igual ao modelo de referência, usando a narração e os takes de `$ARGUMENTS`. Fale com a pessoa em português simples. Se ela mandar só um vídeo falando para a câmera, use a fala como narração e os takes que ela tiver na pasta; se faltar take, pergunte.

## Como o formato é (copiar exatamente)

**Imagem:** só takes do bastidor em tela cheia (chegada, conversa, o serviço sendo feito, detalhes de perto), um depois do outro, com **corte seco a cada ~0,6 a 1,2 s**. **O som dos takes fica mudo**; só a narração toca. No fim, **2 a 5 s de tomadas do resultado**, sem fala e sem legenda.

**Áudio:** a narração como veio. **Sem efeitos sonoros.** Só no final (as tomadas do resultado, depois da última fala) entra a **música do final** (`sfx/trilha-bastidor.wav`, tirada da referência).

**Gancho (primeiro ~1 s):** as palavras da primeira frase, **uma por vez**, grandes, **Montserrat ExtraBold 150 px branca com sombra escura deslocada para baixo e para a direita**, em minúsculas, centralizadas em y = 1103. A **primeira palavra sobe de baixo para cima se revelando** (~7 quadros); as outras **trocam seco** no mesmo lugar.

**Destaque do valor:** quando a pessoa fala o preço ou número principal, aparece à esquerda (x = 112): uma **linha pequena em cima** (Montserrat ExtraBold 56 px, ex.: "um cílios de") e o **valor grande embaixo** (Montserrat ExtraBold 165 px, ex.: "R$ 600,00"), com a mesma sombra. Uma **moeda dourada girando passa da esquerda para a direita** em ~4 quadros revelando o valor. Fica parado ~2 s e some seco. Se não houver valor falado, não use.

**Legenda:** depois do gancho/valor, **uma palavra por vez**, pequena, **Montserrat Bold itálica 64 px branca com 90% de opacidade**, sem sombra, centralizada em y = 1230, sempre no mesmo lugar, troca seca. Minúsculas, menos nomes próprios. Durante o valor e no final com música não há legenda.

**CTA:** se a pessoa falar um CTA, caixa **marsala `#7D1D2F`** com texto branco em negrito, `Comenta: PALAVRA`, **colada em cima da legenda**, parada até o fim (a referência não tem CTA; é a regra da Lívia).

O código pronto está em `modelo/Bastidor.tsx`, na pasta desta skill; `modelo/exemplo-dados.json` mostra todos os campos preenchidos. Copie `sfx/trilha-bastidor.wav` para `public/sfx/`.

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
11. **CTA fixo na tela.** Só se a pessoa falar um CTA no vídeo (comentar uma palavra, seguir, curtir, salvar, compartilhar, chamar no direct, clicar no link). O CTA aparece no momento em que ela começa a falar o CTA e **fica parado na tela até o último quadro**, sem animação; a legenda continua rolando embaixo dele. Quando o CTA fica abaixo do queixo, a legenda fica praticamente colada embaixo da caixa do CTA, sem espaço vazio entre os dois. Neste formato o CTA fica colado em cima da legenda (a legenda fica no mesmo lugar o vídeo todo). Texto curto e direto:
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
## Como fazer o storyboard (visual)

O storyboard é **visual**: a pessoa precisa ver todas as cenas do vídeo, na ordem, como uma tirinha.
1. **Divida o vídeo final em cenas.** Uma cena é cada momento em que muda algo na tela: um corte, uma nova frase de legenda, um título, uma imagem, a troca de layout. Em fala sem legenda, uma cena por frase.
2. **Tire uma imagem de cada cena já editada** (com o enquadramento, os textos e o layout finais, não do vídeo bruto), no meio da cena. No Remotion: `npx remotion still <entrada> <composição> quadros/cena-NN.png --frame=<frame> --props=<dados>.json`. Só com ffmpeg: `ffmpeg -ss <tempo> -i <video-editado> -frames:v 1 quadros/cena-NN.jpg`. Reduza para 360 px de largura.
3. **Monte o `storyboard.json`** com cada cena (imagem, tempo no vídeo final, título curto, o que se ouve ou a legenda, nota e `confira: true` quando houver dúvida), a lista de cortes e as observações. Veja o modelo no topo de `storyboard/gerar_storyboard.py`, na pasta desta skill.
4. **Gere a página:** `python3 storyboard/gerar_storyboard.py storyboard.json storyboard.html`. Ela sai num arquivo só, com as imagens dentro, e mostra as cenas numeradas em grade, os cortes e os pontos para CONFERIR.
5. **Abra automaticamente** o `storyboard.html` no navegador.
## Passo 1: preparar

Confira `ffmpeg`, Node e Whisper; instale o que faltar. Se a pessoa pedir edição básica da narração, rode antes o /imparavel nela.

## Passo 2: transcrever

Transcreva a narração com o tempo de cada palavra (Whisper). É daí que saem o gancho, o valor, a legenda, os cortes e o CTA.

## Passo 3: planejar e montar no Remotion (sem renderizar ainda)

1. `narracao`: o arquivo da narração (`inicio` = segundo onde começa a primeira frase).
2. `takes`: em ordem, cada um com `duracao` de ~0,6 a 1,2 s e `inicio` = o melhor trecho do take. Troque de take no começo das palavras. No fim, um ou mais takes do resultado somando 2 a 5 s depois da última fala. A soma das durações = duração do vídeo.
3. `gancho`: as palavras da primeira frase, uma por item, do início de cada palavra até o início da próxima.
4. `valor` (se houver): `linha1` = as palavras antes do valor, `linha2` = o valor escrito (`R$ 600,00`), `inicio` = início da primeira palavra da linha1, `fim` ~2 s depois.
5. `legendas`: uma palavra por item, do início da palavra até o início da próxima, a partir do fim do valor (ou do gancho). Sem pontuação.
6. `trilha`: `inicio` = fim da última fala, `fim` = fim do vídeo.
7. CTA: se houver, `cta.inicio` = início da primeira palavra do CTA.
8. Copie `modelo/Bastidor.tsx` para `src/` e registre como em `modelo/Root-exemplo.tsx`. Instale `@remotion/google-fonts` e `zod` na versão que o Remotion pedir.

## Passo 4: storyboard visual

Gere o storyboard: o gancho, o valor (com a moeda), algumas palavras da legenda, o CTA e o final com música. Abra automaticamente. Pergunte se quer mudar algo; ajuste só o que for pedido e abra de novo.

## Passo 5: prévia de 8 segundos

Renderize 8 s seguidos desde o começo, sem emenda: `npx remotion render <entrada> Bastidor previa-8s.mp4 --frames=0-239 --codec=h264 --crf=18`. Abra automaticamente e pergunte se pode fazer o vídeo final.

## Passo 6: vídeo final (só com aprovação)

Renderize o vídeo inteiro em H.264, salve como `<nome>-bastidor.mp4` na pasta de entregas, confira 3 quadros (o gancho, o valor e o CTA), abra automaticamente e diga onde está o arquivo e a duração.
