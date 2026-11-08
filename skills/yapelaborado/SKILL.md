---
name: yapelaborado
description: Formato "YAP elaborado" da Lívia Brasil. A pessoa fala para a câmera em tela cheia, com cortes secos e zoom alternado, legenda de uma palavra por vez em letra serifada ao lado do rosto e textos em cima da cabeça (título serifado ou texto digitado letra por letra, com emojis). Manda o storyboard visual antes e só entrega o final com aprovação.
argument-hint: "[vídeo da pessoa falando]"
disable-model-invocation: true
---

# /yapelaborado

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.

Monte um Reel vertical (1080x1920, 30 fps) igual ao modelo de referência, usando os arquivos de `$ARGUMENTS`. Fale com a pessoa em português simples.

## Como o formato é (copiar exatamente)

**Abertura (motion da referência):** o primeiro quadro começa com zoom 1.4 e desfoque de movimento e abre rápido para o tamanho normal em 0,2 s (6 quadros). O modelo já faz isso.

A pessoa aparece **em tela cheia o tempo todo**, com o fundo original. **Não há inserções, imagens nem vídeos passando.** O vídeo tem **cortes secos** com **zoom alternando 1.0 e 1.15** a cada corte (origem do zoom no rosto). Sem música.

**Fontes (as mesmas da referência, sempre):**
- títulos em cima da cabeça e legenda: serifada estreita **Libre Caslon Condensed** (títulos peso 500, 76 px; legenda peso 400, 64 px);
- tópicos e textos digitados: **Figtree** bold, 60 px (a fonte reta "Classic" da referência).
Todas brancas, com sombra escura suave.

**Legenda: uma palavra por vez**, exatamente no momento em que é falada, em **minúsculas e sem pontuação**. Fica **parada sempre no mesmo lugar** (não sobe nem desce de uma palavra para outra): **ao lado do rosto, na altura da boca**, do lado em que há espaço, sem encostar no rosto e **dentro da área segura do Reels** (pelo menos 60 px da borda esquerda e longe dos botões da direita: a palavra não passa de x = 900). `legendaX` e `legendaY` são o centro da palavra na tela; não mudam com o zoom. Números em algarismos ("250", "7").

**Textos em cima da cabeça:** centralizados, de 1 a 3 linhas curtas (quebre com `\n`), logo acima da cabeça e **parados na tela**: cada texto fica no mesmo lugar do começo ao fim, mesmo que a pessoa se mexa (nada se movimenta). Os **títulos ficam colados na cabeça**, na posição normal dela (o modelo usa a altura do meio da cabeça durante o tempo do título); se ela se inclinar e o título encostar um pouquinho no cabelo, tudo bem. Isso também mantém o título longe da borda de cima do Instagram. Os outros textos ficam na altura do ponto mais alto da cabeça durante o tempo deles. Um por vez; cada um fica enquanto a pessoa fala daquele assunto. Estilos:
- `titulo`: serifada, aparece pronto. O **gancho** (tema do vídeo) desde o primeiro quadro até o fim da primeira ideia, e frases curtas de destaque ("Pessoa específica", "Desafio de 90 dias juntos").
- `topico`: Figtree, aparece pronto, **com som de clique**. Para os tópicos numerados ("1. Para de falar “oi gente” 🗣️").
- `digitado`: Figtree, **efeito de máquina de escrever**: aparece letra por letra (40 letras por segundo) com cursor "|", começando na primeira linha e descendo (o bloco não se mexe), **com o som de máquina de escrever da referência** enquanto digita. Para exemplos e frases citadas. É muito importante: use em todo vídeo.
- `emoji`: só emojis pequenos (ex.: ❌🎬), quando a pessoa fala de algo errado; com ❌ toca o **som de erro**.

**Efeitos sonoros (iguais aos da referência, tirados dela, na pasta `sfx/` desta skill):** `brilho.wav` no gancho (cerca de 1,3 s depois do início), `clique-texto.wav` quando um tópico aparece, `maquina-escrever.wav` (teclas tiradas da referência) enquanto um texto é digitado, `erro-buzzer.wav` quando aparece um ❌ (sozinho ou no fim de um texto digitado, no instante em que o ❌ é digitado). O modelo já toca cada som no momento certo; o brilho vai em `efeitos`. Copie a pasta `sfx/` para `public/sfx/`. A voz continua com o áudio original.

**CTA:** se a pessoa falar um CTA, caixa marsala `#7D1D2F` com texto branco em negrito, cantos arredondados, no formato `Comenta: PALAVRA`, **colada em cima da cabeça** (no lugar dos textos de cima). Aparece quando a pessoa começa a falar o CTA e fica parada até o fim; a legenda continua.

O código pronto está em `modelo/YapElaborado.tsx`, na pasta desta skill; `modelo/exemplo-dados.json` mostra todos os campos preenchidos.

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
11. **CTA fixo na tela.** Só se a pessoa falar um CTA no vídeo (comentar uma palavra, seguir, curtir, salvar, compartilhar, chamar no direct, clicar no link). O CTA aparece no momento em que ela começa a falar o CTA e **fica parado na tela até o último quadro**, sem animação; a legenda continua rolando embaixo dele. Quando o CTA fica abaixo do queixo, a legenda fica praticamente colada embaixo da caixa do CTA, sem espaço vazio entre os dois. Neste formato o CTA fica colado em cima da cabeça. Texto curto e direto:
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

Faça no vídeo toda a edição básica do `/imparavel` (cortes, respiros, 1.2x sem mudar a voz, áudio limpo, -14 LUFS) e salve `apresentadora.mp4`. Transcreva com o tempo de cada palavra: a legenda de uma palavra depende disso.

## Passo 3: planejar e montar no Remotion (sem renderizar ainda)

1. Cenas: um corte seco a cada frase ou ideia (2 a 5 s), alternando zoom 1.0 e 1.15. Sem inserções.
2. Legenda: uma entrada por palavra (`palavras`), do início da palavra até o início da próxima (no máximo 0,9 s), minúscula e sem pontuação.
3. Textos de cima (`textos`): o gancho como `titulo` desde o primeiro quadro (e `efeitos: [{som: "brilho", inicio: 1.35}]`); cada tópico numerado como `topico`; exemplos e frases citadas como `digitado`; algo errado com `emoji` ❌; uma ou duas frases curtas de destaque como `titulo`. Cada um começa quando a pessoa entra no assunto. Quebre a linha com `\n` para ficar em 2 ou 3 linhas curtas.
4. Copie `modelo/YapElaborado.tsx` para `src/` e a pasta `sfx/` para `public/sfx/`, e registre como em `modelo/Root-exemplo.tsx`. Instale `@remotion/google-fonts` e `zod` na versão que o Remotion pedir.
5. Preencha os dados como em `modelo/exemplo-dados.json` (preencha todos os campos: o Remotion não aplica os valores padrão). **Meça o alto da cabeça quadro a quadro:** a cada 0,1 s (vídeo sem zoom) ache a altura (px) onde começa o cabelo, suavize dentro de cada cena (mediana de 5 e média de 5, sem misturar cenas) e coloque em `cabecaTrilha` como `{t, y}`. O modelo usa isso só para escolher a altura fixa de cada texto e do CTA (já contando o zoom); eles não se mexem. Escolha `legendaX`/`legendaY` (ao lado do rosto, na altura da boca; no teste 750 e 950) e confira em vários quadros que a palavra não encosta no rosto. Confira em alguns quadros que nenhum texto cobre o rosto ou o cabelo.

## Passo 4: storyboard visual

Gere o storyboard como em "Como fazer o storyboard": uma imagem por cena, dizendo o texto de cima (título, tópico, digitado, emoji ou CTA), o zoom, os efeitos sonoros e as palavras da legenda. Abra automaticamente. Pergunte se quer mudar alguma cena, texto, legenda ou corte; ajuste só o que for pedido e abra de novo.

## Passo 5: prévia de 8 segundos

Renderize 8 s contínuos que mostrem um tópico aparecendo, um texto sendo digitado e um corte com zoom (para ouvir os efeitos): `npx remotion render <entrada> YapElaborado previa-8s.mp4 --frames=<inicio>-<fim> --codec=h264 --crf=18`. Abra automaticamente e pergunte se pode fazer o vídeo final.

## Passo 6: vídeo final (só com aprovação)

Renderize o vídeo inteiro em H.264, salve como `<nome>-yap-elaborado.mp4` na pasta de entregas, confira 3 quadros (gancho, texto digitado e CTA), abra automaticamente e diga onde está o arquivo e a duração.
