---
name: narracaovlog
description: Formato "Narração vlog" da Lívia Brasil. Vlog feito de takes curtos com corte seco, a narração da pessoa por cima e legenda amarela com contorno preto, uma frase por vez em minúsculas. Manda o storyboard visual antes e só entrega o final com aprovação.
argument-hint: "[narração] [takes do vlog]"
disable-model-invocation: true
---

# /narracaovlog

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.

Monte um Reel vertical (1080x1920, 30 fps) igual ao modelo de referência, usando a narração e os takes de `$ARGUMENTS`. Fale com a pessoa em português simples. Se ela mandar só um vídeo falando para a câmera, use a fala como narração e os takes que ela tiver na pasta; se faltar take, pergunte.

## Como o formato é (copiar exatamente)

**Imagem:** só takes de vlog em tela cheia (sem zoom), um depois do outro, com **corte seco a cada ~1 a 2 segundos** (troque de take mais ou menos a cada frase ou meia frase). **O som dos takes fica mudo**; só a narração toca.

**Áudio:** só a narração, como veio. **Sem música e sem efeitos sonoros.**

**Legenda:** **uma frase por vez** (3 a 10 palavras, do jeito que a pessoa fala), **em minúsculas**, **Montserrat Bold 64 px amarelo-limão `#EEFC0C` com contorno preto** grosso, letras bem juntas (espaçamento -2), até 3 linhas com quebra equilibrada, largura máxima 800 px, **centralizada em y = 1278** (um pouco abaixo do meio da tela), **parada sempre no mesmo lugar**, **troca seca, sem animação**. A primeira frase (o gancho) pode terminar com um emoji ligado ao assunto, como na referência. Sem ponto final nem interrogação.

**CTA:** se a pessoa falar um CTA, caixa **branca com texto preto** em negrito (pedido da Lívia neste formato, no lugar da marsala), cantos arredondados, `Comenta: PALAVRA`, **colada em cima da legenda**. Aparece quando ela começa a falar o CTA e fica parada até o fim.

O código pronto está em `modelo/NarracaoVlog.tsx`, na pasta desta skill; `modelo/exemplo-dados.json` mostra todos os campos preenchidos.

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
   Estilo padrão: caixa marsala `#7D1D2F` com fonte branca em negrito e cantos arredondados (neste formato: caixa branca com texto preto). A posição depende do formato (veja a seção do formato); se o formato não disser, fica logo abaixo do queixo. Se não houver CTA falado, não coloque CTA. Mostre o CTA no storyboard como uma cena própria.

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

Transcreva a narração com o tempo de cada palavra (Whisper). É daí que saem a legenda, os pontos de corte e o CTA.

## Passo 3: planejar e montar no Remotion (sem renderizar ainda)

1. `narracao`: o arquivo da narração (`inicio` = segundo onde começa a primeira frase).
2. `takes`: em ordem, cada um com `duracao` de ~1 a 2 s e `inicio` = o melhor trecho do take (movimento, sem tremida). A soma das durações = duração da narração. Troque de take nas pausas ou no começo das frases. Se o take tiver a ver com o que está sendo falado, use-o nesse trecho.
3. `legendas`: frases de 3 a 10 palavras, em minúsculas, do início da primeira palavra até o início da próxima frase. Tire ponto final, interrogação e reticências; mantenha só vírgula e exclamação. Números em algarismos. Emoji só no gancho.
4. CTA: se houver, `cta.inicio` = início da primeira palavra do CTA.
5. Copie `modelo/NarracaoVlog.tsx` para `src/` e registre como em `modelo/Root-exemplo.tsx`. Instale `@remotion/google-fonts` e `zod` na versão que o Remotion pedir. Preencha os dados como em `modelo/exemplo-dados.json` (todos os campos).

## Passo 4: storyboard visual

Gere o storyboard como em "Como fazer o storyboard": uma imagem por frase de legenda (com o take daquele momento) e o CTA. Abra automaticamente. Pergunte se quer mudar algo; ajuste só o que for pedido e abra de novo.

## Passo 5: prévia de 8 segundos

Renderize 8 s seguidos, sem emenda: `npx remotion render <entrada> NarracaoVlog previa-8s.mp4 --frames=<início>-<início+239> --codec=h264 --crf=18`. Abra automaticamente e pergunte se pode fazer o vídeo final.

## Passo 6: vídeo final (só com aprovação)

Renderize o vídeo inteiro em H.264, salve como `<nome>-narracao-vlog.mp4` na pasta de entregas, confira 3 quadros (o gancho, um corte e o CTA), abra automaticamente e diga onde está o arquivo e a duração.
