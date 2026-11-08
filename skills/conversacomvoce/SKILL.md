---
name: conversacomvoce
description: Formato "Conversa com você" da Lívia Brasil. Esquete em que a pessoa faz os dois papéis (cena + resposta) com corte seco, título POV fixo, legenda por frase, trilha e grave de tensão na cena de abertura. Manda o storyboard visual antes e só entrega o final com aprovação.
argument-hint: "[gravações]"
disable-model-invocation: true
---

# /conversacomvoce

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação nem reticências. Os dois-pontos só no "POV:" do título e no CTA "Comenta: PALAVRA".

Monte um Reel vertical (1080x1920, 30 fps) igual ao modelo de referência, usando as gravações de `$ARGUMENTS`. Fale com a pessoa em português simples. Se ela mandar um vídeo só, corte em takes por frase; se mandar as gravações de cada papel, ponha na ordem da conversa.

## Como o formato é (copiar exatamente)

**Imagem:** esquete curta. A pessoa faz **dois papéis** (ex.: o avô insistindo e depois ela mesma respondendo), takes em tela cheia com **corte seco** entre as falas. **Cada take toca o próprio som.** Sem zoom e sem transição, exceto o efeito de tensão abaixo.

**Título POV:** fixo no alto **o vídeo inteiro**, centralizado, 2 linhas (topo y = 268), **Montserrat Medium 64 px** branco com contorno escuro suave, ex.: "POV: onde nasceu / a sua culpa de dizer não".

**Legenda:** **por frase** (a frase inteira aparece de uma vez e troca seca), em minúsculas (nomes próprios com maiúscula), **Montserrat Medium 58 px** branca com o mesmo contorno, centralizada num bloco de 780 px, até 2 linhas. **Sempre no mesmo lugar, ~1 cm abaixo do queixo** (`legendaTopo`, padrão 1220).

**Trilha:** uma trilha de tensão baixinha (`sfx/trilha-conversa.wav`, tirada da referência) toca **só na cena de abertura** e **para seca** no corte em que a conversa começa (`trilha.inicio` / `trilha.fim`). Depois, sem música.

**Grave de tensão** (`efeito: "tensao"` no take do momento dramático): um **grave crescente** (`sfx/tensao-conversa.wav`, da referência) começa 0,7 s antes do corte. **A imagem fica normal, sem filtro** (a Lívia pediu para tirar a tremida e o vermelho da referência).

**CTA:** se a pessoa falar um CTA, caixa marsala `#7D1D2F` com texto branco em negrito (Montserrat Bold 52 px), `Comenta: PALAVRA`, **logo abaixo do queixo, colada em cima da legenda**. Fica parada até o fim.

Copie os dois áudios de `sfx/` (na pasta desta skill) para `public/sfx/`. O código pronto está em `modelo/ConversaComVoce.tsx`; `modelo/exemplo-dados.json` mostra todos os campos preenchidos.

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

Transcreva cada gravação com o tempo de cada palavra (Whisper). É daí que saem os takes, as legendas e o CTA.

## Passo 3: planejar e montar no Remotion (sem renderizar ainda)

1. `takes`: na ordem da conversa, um take por fala (`arquivo`, `inicio` no arquivo, `duracao`). A soma das durações é a duração do vídeo.
2. Marque com `efeito: "tensao"` o take da fala mais dramática da cena de abertura (só um).
3. `trilha`: do começo (`inicio: 0`) até o corte em que a conversa/resposta começa (`fim`).
4. `titulo`: o "POV: ..." em 2 linhas, tirado do tema do vídeo. Pergunte à pessoa se ela não disser; não invente sem avisar.
5. `legendas`: frase por frase (até ~8 palavras), `inicio` = primeira palavra, `fim` = início da próxima frase. Tire ponto final, interrogação e reticências.
6. CTA: se houver, `cta.inicio` = início da primeira palavra do CTA.
7. Meça o queixo e use em `legendaTopo` o ponto mais baixo + ~95 px.
8. Copie `modelo/ConversaComVoce.tsx` para `src/` e registre como em `modelo/Root-exemplo.tsx`. Instale `@remotion/google-fonts` e `zod` na versão que o Remotion pedir. Preencha os dados como em `modelo/exemplo-dados.json`.

## Passo 4: storyboard visual

Gere o storyboard como em "Como fazer o storyboard": abertura, o momento de tensão, algumas frases da conversa e o CTA. Abra automaticamente. Pergunte se quer mudar algo; ajuste só o que for pedido e abra de novo.

## Passo 5: prévia de 8 segundos

Renderize 8 s seguidos, sem emenda, do começo (com a trilha e o efeito de tensão): `npx remotion render <entrada> ConversaComVoce previa-8s.mp4 --frames=0-239 --codec=h264 --crf=18`. Abra automaticamente e pergunte se pode fazer o vídeo final.

## Passo 6: vídeo final (só com aprovação)

Renderize o vídeo inteiro em H.264, salve como `<nome>-conversa-com-voce.mp4` na pasta de entregas, confira 3 quadros (abertura, tensão e CTA), abra automaticamente e diga onde está o arquivo e a duração.
