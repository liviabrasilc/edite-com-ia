---
name: yaporganico
description: Formato "YAP orgânico" da Lívia Brasil. A pessoa fala para a câmera em tela cheia, só com cortes secos e zoom alternado, gancho escrito no começo e legenda curta branca parada abaixo do queixo, sem música nem efeitos. Manda o storyboard visual antes e só entrega o final com aprovação.
argument-hint: "[vídeo da pessoa falando]"
disable-model-invocation: true
---

# /yaporganico

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.

Monte um Reel vertical (1080x1920, 30 fps) igual ao modelo de referência, usando o vídeo de `$ARGUMENTS`. Fale com a pessoa em português simples.

## Como o formato é (copiar exatamente)

Visual simples e "orgânico": a pessoa **em tela cheia o tempo todo**, fundo original, **cortes secos** com **zoom alternando 1.0 e 1.15** a cada corte. **Sem música, sem efeitos sonoros, sem imagens de apoio e sem nenhuma animação** nos textos (eles aparecem e somem direto). O áudio é a voz tratada.

**Fonte (a mesma da referência):** Figtree bold, 60 px, branca, sombra escura suave, linhas bem juntas (entrelinha 0,95).

**Gancho (título):** a primeira frase **inteira** do vídeo (até o fim da primeira frase, mesmo que seja longa, e sem ponto final) aparece **escrita toda de uma vez e parada**, em até 5 linhas parecidas, no lugar da legenda (mesma fonte, mesma altura de início), **desde o primeiro quadro até a pessoa terminar de falar essa frase**. Durante o gancho não há legenda.

**Legenda:** depois do gancho, **1 a 4 palavras por vez**, cortando também na vírgula e no fim da frase, **com letra maiúscula no começo da frase**, mantendo só vírgula e exclamação, **sem ponto final** (ex.: "Eu lembro quando", "tá quebrada,", "do computador"). Números em algarismos. Fica **parada sempre no mesmo lugar** (o topo da legenda em `legendaTopo`), **abaixo do queixo** e dentro das bordas do Reels (no máximo 900 px de largura, centralizada). **Título e legenda ficam cerca de 1 cm abaixo do queixo** (regra da Lívia): meça o queixo mais baixo (já com zoom) e ponha o topo das letras uns 100 px abaixo dele (no teste: queixo 1140, `legendaTopo` 1220). Tamanho da letra 60 px.

**CTA:** se a pessoa falar um CTA, caixa marsala `#7D1D2F` com texto branco em negrito, cantos arredondados, `Comenta: PALAVRA`, **logo abaixo do queixo e colada em cima da legenda**. Aparece quando a pessoa começa a falar o CTA e fica parada até o fim; a legenda continua embaixo dela.

O código pronto está em `modelo/YapOrganico.tsx`, na pasta desta skill; `modelo/exemplo-dados.json` mostra todos os campos preenchidos.

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

Confira `ffmpeg`, Node e Whisper; instale o que faltar. Este formato não usa imagens nem vídeos de apoio: é só a pessoa em tela cheia.

## Passo 2: tratar a fala com o /imparavel (sempre)

Faça no vídeo toda a edição básica do `/imparavel` (cortes, respiros, 1.2x sem mudar a voz, áudio limpo, -14 LUFS) e salve `apresentadora.mp4`. Transcreva com o tempo de cada palavra: a legenda depende disso.

## Passo 3: planejar e montar no Remotion (sem renderizar ainda)

1. Cenas: mantenha os cortes do vídeo tratado e alterne o zoom 1.0 e 1.15 a cada corte.
2. Gancho: a primeira frase INTEIRA, até o primeiro ponto final (regra da Lívia), em linhas parecidas (`\n`), com `fim` no início da primeira palavra da frase seguinte. Nada dela vira legenda.
3. Legendas: depois do gancho, grupos de até 4 palavras, cortando em vírgula e ponto; cada grupo vai do início da primeira palavra até o início do próximo. Maiúscula no começo de cada frase.
4. Copie `modelo/YapOrganico.tsx` para `src/` e registre como em `modelo/Root-exemplo.tsx`. Instale `@remotion/google-fonts` e `zod` na versão que o Remotion pedir.
5. Preencha os dados como em `modelo/exemplo-dados.json` (preencha todos os campos: o Remotion não aplica os valores padrão). **Meça o queixo** em vários momentos (sem zoom), pegue o ponto mais baixo, calcule a posição com zoom 1.15 (`576 + (queixo - 576) * 1.15`) e use em `legendaTopo` o maior valor entre 1124 e esse queixo + 140. Confira em alguns quadros que a legenda e o CTA não encostam no rosto.

## Passo 4: storyboard visual

Gere o storyboard como em "Como fazer o storyboard": uma imagem para o gancho e uma por legenda, dizendo o zoom da cena e onde entra o CTA. Abra automaticamente. Pergunte se quer mudar alguma cena, legenda ou corte; ajuste só o que for pedido e abra de novo.

## Passo 5: prévia de 8 segundos

Renderize os 8 primeiros segundos, sem emenda (mostra o gancho e as primeiras legendas): `npx remotion render <entrada> YapOrganico previa-8s.mp4 --frames=0-239 --codec=h264 --crf=18`. Abra automaticamente e pergunte se pode fazer o vídeo final.

## Passo 6: vídeo final (só com aprovação)

Renderize o vídeo inteiro em H.264, salve como `<nome>-yap-organico.mp4` na pasta de entregas, confira 3 quadros (gancho, legenda e CTA), abra automaticamente e diga onde está o arquivo e a duração.
