---
name: narracaotutorial
description: Formato "Narração tutorial" da Lívia Brasil. Takes de demonstração com corte seco e a narração por cima; título de abertura em 3 linhas, gancho que se monta linha a linha com pop e brilho, e legenda manuscrita palavra por palavra. Manda o storyboard visual antes e só entrega o final com aprovação.
argument-hint: "[narração] [takes]"
disable-model-invocation: true
---

# /narracaotutorial

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.

Monte um Reel vertical (1080x1920, 30 fps) igual ao modelo de referência, usando a narração e os takes de `$ARGUMENTS`. Fale com a pessoa em português simples. Se ela mandar só um vídeo falando para a câmera, use a fala como narração e os takes que ela tiver na pasta; se faltar take, pergunte.

## Como o formato é (copiar exatamente)

**Imagem:** takes de demonstração em tela cheia, um depois do outro, com **corte seco** (~1,5 a 3 s cada). **O som dos takes fica mudo**; só a narração toca. **Sem música.**

**@ da pessoa:** no topo (y = 128), centralizado, Poppins Medium 48 px branco meio transparente, o vídeo inteiro. Pergunte o @ se não souber.

**Título de abertura** (a primeira frase, parado enquanto ela é falada), centralizado no alto (a partir de y = 310), 3 linhas:
1. manuscrita (**Sriracha** 84 px branca com sombra leve), ex.: "Besteiras";
2. **GRANDE arredondada (Sniglet ExtraBold 104 px)** com 🚨 dos dois lados (um mais baixo, outro mais alto), ex.: "BARATINHAS";
3. fina sublinhada (**Quicksand** 58 px), ex.: "virais da Shopee".

**Gancho** (a segunda frase): as linhas **vão aparecendo uma a uma quando são faladas**, empilhadas no alto (a partir de y = 200), cada uma com um **pop rápido** (entra 20% maior e volta ao normal em 8 quadros):
1. manuscrita (Sriracha 64 px) com ✨ no fim;
2. **GRANDE (Sniglet 96 px)** com 🔥 dos dois lados;
3. fina (Quicksand 54 px) dentro de uma **caixa dourada translúcida** com **alças de seleção brancas** (barrinha com bolinha no canto de cima à esquerda e no de baixo à direita);
4. manuscrita (Sriracha 64 px) com emoji no fim, que entra com o **brilho** da referência (`sfx/brilho-tutorial.wav`, na pasta desta skill; copie para `public/sfx/`).
O gancho todo sai de uma vez quando a frase termina.

**Legenda** (o resto da narração): **manuscrita (Sriracha 52 px) branca com sombra**, em minúsculas (nomes próprios com maiúscula), **palavra por palavra**: cada palavra aparece quando é falada e a frase vai se formando em até 2 linhas, alinhada à esquerda num bloco de 640 px centralizado; troca para a próxima frase de uma vez. **Sempre no mesmo lugar, logo abaixo do queixo** (`legendaTopo`, padrão 1335).

**CTA:** se a pessoa falar um CTA, **caixa branca com texto preto** em negrito, cantos arredondados, `Comenta: PALAVRA`, **logo abaixo do queixo, colada em cima da legenda**, com o brilho da referência quando entra. Fica parada até o fim.

O código pronto está em `modelo/NarracaoTutorial.tsx`, na pasta desta skill; `modelo/exemplo-dados.json` mostra todos os campos preenchidos.

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
   Estilo padrão: caixa marsala `#7D1D2F` com fonte branca em negrito e cantos arredondados (neste formato: caixa branca com texto preto, pedido da Lívia). A posição depende do formato (veja a seção do formato); se o formato não disser, fica logo abaixo do queixo. Se não houver CTA falado, não coloque CTA. Mostre o CTA no storyboard como uma cena própria.

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

Transcreva a narração com o tempo de cada palavra (Whisper). É daí que saem o título, o gancho, a legenda e o CTA.

## Passo 3: planejar e montar no Remotion (sem renderizar ainda)

1. `narracao` e `takes` como no /narracaovlog (takes de ~1,5 a 3 s, a soma = duração da narração; troque de take nas pausas).
2. `titulo`: a primeira frase dividida em 3 linhas (manuscrita / GRANDE / fina), `fim` = início da segunda frase.
3. `gancho`: a segunda frase em 4 linhas (manuscrita com ✨ / GRANDE com 🔥 / caixa / manuscrita com emoji), cada uma com `inicio` = quando a primeira palavra dela é falada; `fim` = início da terceira frase. Use as palavras da pessoa; não invente texto.
4. `legendas`: o resto, frase por frase (até ~8 palavras, 2 linhas), cada palavra com o seu `inicio`; `fim` = início da próxima frase. Tire ponto final, interrogação e reticências.
5. CTA: se houver, `cta.inicio` = início da primeira palavra do CTA.
6. Meça o queixo e use em `legendaTopo` o ponto mais baixo + ~95 px.
7. Copie `modelo/NarracaoTutorial.tsx` para `src/` e registre como em `modelo/Root-exemplo.tsx`. Instale `@remotion/google-fonts` e `zod` na versão que o Remotion pedir. Preencha os dados como em `modelo/exemplo-dados.json` (todos os campos).

## Passo 4: storyboard visual

Gere o storyboard como em "Como fazer o storyboard": o título, o gancho completo, algumas frases da legenda e o CTA. Abra automaticamente. Pergunte se quer mudar algo; ajuste só o que for pedido e abra de novo.

## Passo 5: prévia de 8 segundos

Renderize 8 s seguidos, sem emenda, do começo (título + gancho + legenda): `npx remotion render <entrada> NarracaoTutorial previa-8s.mp4 --frames=0-239 --codec=h264 --crf=18`. Abra automaticamente e pergunte se pode fazer o vídeo final.

## Passo 6: vídeo final (só com aprovação)

Renderize o vídeo inteiro em H.264, salve como `<nome>-narracao-tutorial.mp4` na pasta de entregas, confira 3 quadros (título, gancho completo e CTA), abra automaticamente e diga onde está o arquivo e a duração.
