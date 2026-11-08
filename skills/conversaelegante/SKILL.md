---
name: conversaelegante
description: Formato "Conversa elegante" da Lívia Brasil. Conversa encenada em que a pessoa faz os dois papéis, com corte seco, título em caixa escura com letra creme no começo, legenda condensada por frase e a animação de salvar e seguir. Manda o storyboard visual antes e só entrega o final com aprovação.
argument-hint: "[gravações]"
disable-model-invocation: true
---

# /conversaelegante

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.

Monte um Reel vertical (1080x1920, 30 fps) igual ao modelo de referência, usando as gravações de `$ARGUMENTS`. Fale com a pessoa em português simples. Se ela mandar um vídeo só, corte em takes por frase; se mandar as gravações de cada papel, ponha na ordem da conversa.

## Como o formato é (copiar exatamente)

**Imagem:** conversa encenada e elegante. A pessoa faz **dois papéis** (roupas ou ângulos diferentes), takes em tela cheia com **corte seco** a cada fala. **Cada take toca o próprio som. Sem música**, sem zoom, sem transição.

**Título:** no alto (topo y = 213), **caixa escura translúcida** (`rgba(25,15,10,0.85)`, 176 px de altura, sem cantos arredondados) com o texto em **Bebas Neue 96 px creme** `#F8E1BD`, uma linha, centralizada. Fica **só na primeira troca de falas** e some seco num corte (`titulo.fim`).

**Legenda:** **por frase** (a frase inteira aparece de uma vez e troca seca), em minúsculas (nomes próprios com maiúscula), **Roboto Condensed 62 px branca** com sombra suave, centralizada, até 2 linhas **quebradas pelo sentido** (use `\n` no texto). **Sempre no mesmo lugar, ~1 cm abaixo do queixo** (`legendaTopo`, padrão 1220).

**Salvar e seguir** (`salvarSeguir`, só quando alguém fala que está salvando o vídeo ou seguindo o perfil): no alto, à esquerda, o **ícone de salvar é desenhado a traço** branco (0,6 s); aos 1 s aparece crescendo o **botão cinza "Seguir"**; aos 1,3 s o ícone fica **preenchido**; aos 1,8 s o botão vira **branco "Seguindo ⌄"** com texto preto. Toca junto os toques agudos bem baixinhos da referência (`sfx/seguir-elegante.wav`). Some no corte (`salvarSeguir.fim`).

**CTA:** se a pessoa falar um CTA, caixa marsala `#7D1D2F` com texto branco em negrito (Roboto Condensed Bold 54 px), `Comenta: PALAVRA`, **logo abaixo do queixo, colada em cima da legenda**. Fica parada até o fim. (A referência usa outro CTA; vale a regra da Lívia.)

Copie `sfx/seguir-elegante.wav` (na pasta desta skill) para `public/sfx/`. O código pronto está em `modelo/ConversaElegante.tsx`; `modelo/exemplo-dados.json` mostra todos os campos preenchidos (no exemplo o salvar e seguir aparece só para teste).

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

Confira `ffmpeg`, Node e Whisper; instale o que faltar. Rode o /imparavel nas gravações (cortes de erros e respiros) antes de montar.

## Passo 2: transcrever

Transcreva cada gravação com o tempo de cada palavra (Whisper). É daí que saem os takes, as legendas, o salvar e seguir e o CTA.

## Passo 3: planejar e montar no Remotion (sem renderizar ainda)

1. `takes`: na ordem da conversa, um take por fala (`arquivo`, `inicio` no arquivo, `duracao`). A soma das durações é a duração do vídeo.
2. `titulo`: uma frase curta em maiúsculas sobre o tema (pergunte se a pessoa não disser; não invente sem avisar); `fim` = o corte em que termina a primeira troca de falas.
3. `legendas`: frase por frase (até ~8 palavras), quebrando a linha pelo sentido; `inicio` = primeira palavra, `fim` = início da próxima frase. Tire ponto final, interrogação e reticências.
4. `salvarSeguir`: só se alguém falar que está salvando/seguindo; `inicio` = começo dessa fala, `fim` = o próximo corte.
5. CTA: se houver, `cta.inicio` = início da primeira palavra do CTA.
6. Meça o queixo e use em `legendaTopo` o ponto mais baixo + ~95 px.
7. Copie `modelo/ConversaElegante.tsx` para `src/` e registre como em `modelo/Root-exemplo.tsx`. Instale `@remotion/google-fonts` e `zod` na versão que o Remotion pedir. Preencha os dados como em `modelo/exemplo-dados.json`.

## Passo 4: storyboard visual

Gere o storyboard como em "Como fazer o storyboard": o título, algumas falas, o salvar e seguir (se houver) e o CTA. Abra automaticamente. Pergunte se quer mudar algo; ajuste só o que for pedido e abra de novo.

## Passo 5: prévia de 8 segundos

Renderize 8 s seguidos, sem emenda, do começo: `npx remotion render <entrada> ConversaElegante previa-8s.mp4 --frames=0-239 --codec=h264 --crf=18`. Abra automaticamente e pergunte se pode fazer o vídeo final.

## Passo 6: vídeo final (só com aprovação)

Renderize o vídeo inteiro em H.264, salve como `<nome>-conversa-elegante.mp4` na pasta de entregas, confira 3 quadros (título, uma fala e CTA), abra automaticamente e diga onde está o arquivo e a duração.
