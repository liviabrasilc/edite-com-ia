---
name: teladivididaelegante
description: Formato "Tela dividida elegante" da Lívia Brasil. A pessoa fala para a câmera; o vídeo alterna tela dividida (imagem em cima, pessoa embaixo) e a pessoa em tela cheia, com legenda curta em maiúsculas itálicas e palavras-chave grandes que surgem palavra por palavra. Manda o storyboard visual antes e só entrega o final com aprovação.
argument-hint: "[vídeo da pessoa falando] [imagens e vídeos de apoio, opcional]"
disable-model-invocation: true
---

# /teladivididaelegante

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.

Monte um Reel vertical (1080x1920, 30 fps) igual ao modelo de referência, usando os arquivos de `$ARGUMENTS`. Fale com a pessoa em português simples.

## Como o formato é (copiar exatamente)

Cenas em sequência com **corte seco**, uma nova a cada frase ou ideia (2 a 6 s):

1. **Tela dividida** (`dividida`): imagem ou vídeo de apoio em cima (0 a 904 px, sem som) e a pessoa embaixo (904 a 1920 px), com o rosto no alto da metade de baixo. A legenda fica **logo acima da linha da divisão**. **O vídeo abre com uma tela dividida.** Use quando a fala cita algo que dá para mostrar: uma foto, um estudo ou documento (com o trecho importante grifado em amarelo), uma pessoa histórica (foto em preto e branco), um lugar, um produto.
2. **Pessoa em tela cheia** (`apresentadora`): fundo original, zoom alternando 1.0 e 1.12 a cada corte. A legenda fica **pelo menos 1 cm abaixo do queixo** na tela do celular (160 px no vídeo 1080x1920), nunca no rosto nem encostada no queixo.
3. **Imagem em tela cheia** (`imagem`): vídeo ou foto de apoio cobrindo tudo, com a voz da pessoa por baixo, legenda no meio da tela. Use pouco (1 ou 2 vezes), para exemplos visuais (comida, produto, lugar).

**Legenda:** 1 a 3 palavras por vez, sempre em MAIÚSCULAS, Archivo ExtraBold itálico, 58 px, branca, sombra escura suave. Mantém só vírgula e exclamação da fala, sem ponto final.

**Palavras-chave grandes:** 3 a 6 vezes no vídeo, nas frases mais fortes (uma regra, um número, um nome, um ano). 1 a 3 palavras em 1 ou 2 linhas, grandes (100 a 120 px), entrando **palavra por palavra no instante em que cada uma é falada** (sobe um pouco e aparece em 5 quadros), e ficam até o fim da cena.
- **Posição:** sempre colada na legenda, sem espaço entre as duas. Em tela cheia, a pilha (legenda, palavra-chave) começa 1 cm (160 px) abaixo do queixo; com CTA, a caixa do CTA fica logo abaixo do queixo e a legenda colada embaixo dela; na tela dividida, fica logo acima da divisão.
- **Sem repetir:** a palavra-chave **entra no lugar da legenda** do trecho em que é falada. As palavras dela não aparecem também na legenda branca (ex.: fala "sete dias, 250 mil reais" → legenda "SETE DIAS," e depois a palavra-chave "250 MIL REAIS" no lugar da legenda). Não deixe uma palavrinha sozinha na legenda (junte "DE" com o trecho anterior).

Dois estilos, alternando:
- reto e pesado (Archivo Black) em **laranja `#E2741B`** ou **vermelho-rosado `#E8475F`**;
- itálico (Archivo ExtraBold itálico) em **branco**.
Se a roupa ou o fundo apagarem a cor, use branco itálico.

**CTA:** se a pessoa falar um CTA, caixa marsala `#7D1D2F` com texto branco no estilo da legenda, cantos arredondados, **logo abaixo do queixo** (nunca no rosto), no formato `Comenta: PALAVRA`. Fica parado até o fim e a legenda continua colada embaixo.

O código pronto está em `modelo/TelaDivididaElegante.tsx`, na pasta desta skill; `modelo/exemplo-dados.json` mostra todos os campos preenchidos.

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
11. **CTA fixo na tela.** Só se a pessoa falar um CTA no vídeo (comentar uma palavra, seguir, curtir, salvar, compartilhar, chamar no direct, clicar no link). O CTA aparece no momento em que ela começa a falar o CTA e **fica parado na tela até o último quadro**, sem animação; a legenda continua rolando embaixo dele. Quando o CTA fica abaixo do queixo, a legenda fica praticamente colada embaixo da caixa do CTA, sem espaço vazio entre os dois. Texto curto e direto:
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

Confira `ffmpeg`, Node e Whisper; instale o que faltar. Se a pessoa não mandou imagens de apoio, procure na pasta dela; se não houver, use mais cenas de tela cheia e diga no storyboard onde entraria uma imagem.

## Passo 2: tratar a fala com o /imparavel

Faça no vídeo toda a edição básica do `/imparavel` (cortes, respiros, 1.2x sem mudar a voz, áudio limpo, -14 LUFS) e salve `apresentadora.mp4`. Transcreva com o tempo de cada palavra: as legendas e as palavras-chave dependem disso.

## Passo 3: planejar e montar no Remotion (sem renderizar ainda)

1. Divida a fala em cenas: abre com tela dividida; alterna tela cheia e tela dividida; 1 ou 2 imagens em tela cheia; termina em tela cheia com o CTA, se houver.
2. Legendas: quebre as palavras em grupos de até 3, cortando também em vírgula e ponto; cada grupo vai do início da primeira palavra até o início do próximo grupo. Tire das legendas as palavras que viram palavra-chave.
3. Palavras-chave: escolha as frases mais fortes e use o tempo de cada palavra.
4. Copie `modelo/TelaDivididaElegante.tsx` para `src/` e registre como em `modelo/Root-exemplo.tsx`. Instale `@remotion/google-fonts` e `zod` na versão que o Remotion pedir.
5. Preencha os dados como em `modelo/exemplo-dados.json` (preencha todos os campos: o Remotion não aplica os valores padrão). **Meça o queixo:** tire um quadro da pessoa em tela cheia (`npx remotion still` ou ffmpeg) e veja em que altura (px, no vídeo 1080x1920 sem zoom) fica o queixo; se a cabeça se mexe, meça em vários momentos e use o ponto mais baixo. Coloque em `queixoY`: o modelo põe a legenda 160 px (1 cm) abaixo e o CTA logo abaixo, já contando o zoom. Confira nos quadros que a legenda não encosta no queixo. Ajuste também `pessoaDeslocY` (rosto no alto da metade de baixo na tela dividida). Confira em alguns quadros que nenhum texto cobre o rosto.

## Passo 4: storyboard visual

Gere o storyboard como em "Como fazer o storyboard": uma imagem por legenda (no momento em que a palavra-chave já apareceu, quando houver), dizendo o tipo de cena, a imagem usada e as palavras-chave. Abra automaticamente. Pergunte se quer mudar alguma cena, imagem, palavra-chave, legenda ou corte; ajuste só o que for pedido e abra de novo.

## Passo 5: prévia de 8 segundos

Renderize 8 s contínuos que mostrem tela dividida, tela cheia e uma palavra-chave entrando: `npx remotion render <entrada> TelaDivididaElegante previa-8s.mp4 --frames=<inicio>-<fim> --codec=h264 --crf=18`. Abra automaticamente e pergunte se pode fazer o vídeo final.

## Passo 6: vídeo final (só com aprovação)

Renderize o vídeo inteiro em H.264, salve como `<nome>-tela-dividida-elegante.mp4` na pasta de entregas, confira 3 quadros (tela dividida, palavra-chave e CTA), abra automaticamente e diga onde está o arquivo e a duração.
