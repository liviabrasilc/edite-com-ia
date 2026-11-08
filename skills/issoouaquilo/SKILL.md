---
name: issoouaquilo
description: Formato "Isso ou aquilo" da Lívia Brasil. A pessoa fala para a câmera apontando para cima; para cada par, a foto do problema entra deslizando no alto à esquerda e a foto do produto (sem fundo, com o nome embaixo) entra deslizando no alto à direita. Legenda igual à do /yaporganico. Manda o storyboard visual antes e só entrega o final com aprovação.
argument-hint: "[vídeo da pessoa falando]"
disable-model-invocation: true
---

# /issoouaquilo

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.

Monte um Reel vertical (1080x1920, 30 fps) igual ao modelo de referência, usando o vídeo de `$ARGUMENTS`. Fale com a pessoa em português simples.

## Como o formato é (copiar exatamente)

A pessoa **em tela cheia o tempo todo**, fundo original, sem zoom, normalmente apontando com os dois indicadores para cima (para as fotos). **Sem música.** O áudio é a voz como veio, mais os efeitos "sush" e "pop" abaixo.

**Pares (problema e produto), um de cada vez, no alto da tela:**
- **Foto do problema:** quadrada, 362 x 362 px, no alto à esquerda (x = 100, y = 228; um pouco mais para dentro que a referência, por causa das margens do Instagram). Entra **deslizando da esquerda** em 6 quadros (desacelerando no fim) quando a pessoa fala do problema.
- **Foto do produto:** PNG **sem fundo**, no alto à direita (centro x = 834, também um pouco para dentro; base y = 596, até 260 x 416 px, mantendo a proporção). Entra **deslizando da direita** em 3 quadros quando a pessoa fala do produto.
- **Cada imagem (problema e produto) entra com um "sush" curto** (o mesmo da referência, tirado do áudio dela: `sfx/sush-isso.wav`, na pasta desta skill; copie para `public/sfx/`). Começa 1 quadro antes da imagem entrar, volume 0,7.
- **Nome do produto** (pedido da Lívia): **colado embaixo da imagem do produto**, Figtree Bold 44 px branca com sombra, centralizado, até 2 linhas. Entra junto com o produto.
- **Os dois somem de uma vez** (corte seco) quando começa o próximo par, ou no CTA, com um **"pop" curto** (o mesmo da referência, tirado do áudio dela: `sfx/pop-isso.wav`, na pasta desta skill; copie para `public/sfx/`). O pop começa 1 quadro antes do corte, com volume 0,5 (abaixo da voz). Não toca se o par só sai no fim do vídeo.

**Legenda** (pedido da Lívia, igual à do /yaporganico e no mesmo lugar): **Figtree Bold 60 px branca** com sombra leve, **1 a 4 palavras por vez**, do jeito que a pessoa fala (maiúscula só no começo de frase e em nomes), centralizada, **parada sempre no mesmo lugar, cerca de 1 cm abaixo do queixo** (`legendaTopo`), sem animação, o vídeo inteiro. Sem ponto final.

**CTA:** se a pessoa falar um CTA, caixa marsala `#7D1D2F` com texto branco em negrito, cantos arredondados, `Comenta: PALAVRA`, **logo abaixo do queixo e colada em cima da legenda**. Aparece quando ela começa a falar o CTA e fica parada até o fim.

O código pronto está em `modelo/IssoOuAquilo.tsx`, na pasta desta skill; `modelo/exemplo-dados.json` mostra todos os campos preenchidos.

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

Confira `ffmpeg`, Node e Whisper; instale o que faltar. Use o vídeo como veio, sem cortar de novo e sem acelerar (se a pessoa pedir edição básica, rode antes o /imparavel).

## Passo 2: transcrever

Transcreva o vídeo com o tempo de cada palavra (Whisper). É daí que saem os pares, a legenda e o CTA.

## Passo 3: imagens

Para cada par, procure na pasta de assets da pessoa a foto do problema e a do produto pelo nome falado (ex.: "cravos" e "ácido salicílico"). A foto do problema é cortada no centro para ficar quadrada; a do produto tem que ser PNG sem fundo (se vier com fundo, recorte o fundo antes). Se faltar alguma imagem, pergunte à pessoa e marque "CONFIRA" no storyboard. Meça a proporção (largura / altura) de cada produto.

## Passo 4: planejar e montar no Remotion (sem renderizar ainda)

1. Cenas: o vídeo inteiro como veio, sem zoom.
2. `pares`: um por produto, na ordem. `problemaEntra` = início da palavra em que ela fala o problema; `produtoEntra` = início da palavra em que ela fala o produto; `sai` = `problemaEntra` do próximo par (ou o início do CTA, ou o fim do vídeo). `nome` = nome do produto como ela fala, com maiúscula só na primeira letra. `proporcao` = largura / altura do PNG.
3. `legendas`: o vídeo inteiro, grupos de 1 a 4 palavras, do início do grupo até o início do próximo. Tire ponto final, interrogação e reticências; mantenha só vírgula e exclamação. Números em algarismos.
4. CTA: se houver, `cta.inicio` = início da primeira palavra do CTA.
5. Meça o queixo em vários momentos e use em `legendaTopo` o ponto mais baixo + ~95 px (uns 1 cm abaixo do queixo).
6. Copie `modelo/IssoOuAquilo.tsx` para `src/` e registre como em `modelo/Root-exemplo.tsx`. Instale `@remotion/google-fonts` e `zod` na versão que o Remotion pedir. Preencha os dados como em `modelo/exemplo-dados.json` (todos os campos).

## Passo 5: storyboard visual

Gere o storyboard como em "Como fazer o storyboard": para cada par, uma imagem só com o problema e uma com o problema e o produto; e o CTA. Abra automaticamente. Pergunte se quer mudar algo; ajuste só o que for pedido e abra de novo.

## Passo 6: prévia de 8 segundos

Renderize 8 s seguidos, sem emenda, de um trecho com pelo menos dois pares: `npx remotion render <entrada> IssoOuAquilo previa-8s.mp4 --frames=<início>-<início+239> --codec=h264 --crf=18`. Abra automaticamente e pergunte se pode fazer o vídeo final.

## Passo 7: vídeo final (só com aprovação)

Renderize o vídeo inteiro em H.264, salve como `<nome>-isso-ou-aquilo.mp4` na pasta de entregas, confira 3 quadros (um par completo, a troca de par e o CTA), abra automaticamente e diga onde está o arquivo e a duração.
