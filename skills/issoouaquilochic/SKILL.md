---
name: issoouaquilochic
description: Formato "Isso ou aquilo chic" da Lívia Brasil. A pessoa fala para a câmera com um título de 2 linhas no topo; para cada item, um cartão branco com a imagem sobe para o peito e, no veredito, aparece em cima uma etiqueta rosa-claro inclinada com emoji e um clique-clique. Manda o storyboard visual antes e só entrega o final com aprovação.
argument-hint: "[vídeo da pessoa falando]"
disable-model-invocation: true
---

# /issoouaquilochic

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.

Monte um Reel vertical (1080x1920, 30 fps) igual ao modelo de referência, usando o vídeo de `$ARGUMENTS`. Fale com a pessoa em português simples.

## Como o formato é (copiar exatamente)

A pessoa **em tela cheia o tempo todo**, fundo original, sem zoom. **Sem música e sem legenda.** O áudio é a voz como veio, mais o clique-clique abaixo.

**Título:** 2 linhas no topo (a partir de y = 218), centralizadas, **Bebas Neue inclinada (itálico, skew -10°) 96 px branca** com sombra escura suave, cada linha terminando com um emoji. Padrão (escolha da Lívia): `VALE A PENA ✅` / `NÃO VALE A PENA ❌`. Fica **parado o vídeo inteiro**.

**Itens (um de cada vez, no peito, logo abaixo do queixo):**
- **Cartão branco** de 514 x 322 px, centralizado, topo em y = 1132 (`cartaoTopo`), cantos retos, sem sombra; a imagem do item (logo ou foto) fica centralizada dentro, sem distorcer.
- **Entrada do cartão:** quando a pessoa começa a falar do item, ele **sobe 250 px de baixo com fade** em 9 quadros (desacelerando no fim).
- **Etiqueta:** quando ela dá o veredito, aparece **em cima do cartão** o texto em **Bebas Neue inclinada 100 px rosa-claro `#F7D2E6`** com sombra e emoji. Padrão: `VALE A PENA ✅`, `NÃO VALE ❌` e `LUXO 💎` (nível acima), **subindo 25 px com fade em 2 quadros**, com o **clique-clique** da referência (`sfx/clique-chic.wav`, na pasta desta skill; copie para `public/sfx/`; volume 0,6, abaixo da voz).
- **Saída:** um pouco antes do próximo item, a etiqueta some com fade e o cartão **desce rápido com fade** (3 quadros).

**CTA:** se a pessoa falar um CTA, o cartão e a etiqueta saem, e aparece a caixa marsala `#7D1D2F` com texto branco em negrito, cantos arredondados, `Comenta: PALAVRA`, **logo abaixo do queixo** (`ctaTopo`), parada até o fim. A referência não tem legenda, então não há legenda embaixo do CTA.

O código pronto está em `modelo/IssoOuAquiloChic.tsx`, na pasta desta skill; `modelo/exemplo-dados.json` mostra todos os campos preenchidos.

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
11. **CTA fixo na tela.** Só se a pessoa falar um CTA no vídeo (comentar uma palavra, seguir, curtir, salvar, compartilhar, chamar no direct, clicar no link). O CTA aparece no momento em que ela começa a falar o CTA e **fica parado na tela até o último quadro**, sem animação; a legenda continua rolando embaixo dele. Quando o CTA fica abaixo do queixo, a legenda fica praticamente colada embaixo da caixa do CTA, sem espaço vazio entre os dois. Neste formato não há legenda: o CTA fica logo abaixo do queixo, e o cartão e a etiqueta saem da tela antes dele. Texto curto e direto:
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

Transcreva o vídeo com o tempo de cada palavra (Whisper). É daí que saem o título, os itens, as etiquetas e o CTA.

## Passo 3: imagens

Para cada item, procure na pasta de assets da pessoa a imagem pelo nome falado (logo da marca ou foto do produto). Se faltar alguma, pergunte à pessoa e marque "CONFIRA" no storyboard.

## Passo 4: planejar e montar no Remotion (sem renderizar ainda)

1. Cenas: o vídeo inteiro como veio, sem zoom.
2. `titulo`: `VALE A PENA ✅` / `NÃO VALE A PENA ❌`.
3. `itens`: um por item, na ordem. `entra` = início da palavra em que ela começa a falar do item; `veredito` = início da palavra do veredito; `sai` = ~0,3 s antes do `entra` do próximo item (o último sai no CTA ou no fim). `etiqueta` = `VALE A PENA ✅`, `NÃO VALE ❌` ou `LUXO 💎`, conforme o veredito dela.
4. CTA: se houver, `cta.inicio` = início da primeira palavra do CTA.
5. Meça o queixo em vários momentos e use em `cartaoTopo` e `ctaTopo` o ponto mais baixo + ~20 px.
6. Copie `modelo/IssoOuAquiloChic.tsx` para `src/` e registre como em `modelo/Root-exemplo.tsx`. Instale `@remotion/google-fonts` e `zod` na versão que o Remotion pedir. Preencha os dados como em `modelo/exemplo-dados.json` (todos os campos).

## Passo 5: storyboard visual

Gere o storyboard como em "Como fazer o storyboard": uma imagem de cada item com a etiqueta e o CTA. Abra automaticamente. Pergunte se quer mudar algo; ajuste só o que for pedido e abra de novo.

## Passo 6: prévia de 8 segundos

Renderize 8 s seguidos, sem emenda, de um trecho com pelo menos dois itens: `npx remotion render <entrada> IssoOuAquiloChic previa-8s.mp4 --frames=<início>-<início+239> --codec=h264 --crf=18`. Abra automaticamente e pergunte se pode fazer o vídeo final.

## Passo 7: vídeo final (só com aprovação)

Renderize o vídeo inteiro em H.264, salve como `<nome>-isso-ou-aquilo-chic.mp4` na pasta de entregas, confira 3 quadros (um item com etiqueta, a troca de item e o CTA), abra automaticamente e diga onde está o arquivo e a duração.
