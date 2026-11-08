---
name: tela-dividida-noticia
description: Formato "Tela dividida notícia" (estilo Twitter, fofoca, notícia) da Lívia Brasil. Parte 1 com a notícia em cima, um card estilo Twitter com a manchete no meio e a pessoa reagindo embaixo; parte 2 com a pessoa comentando em tela cheia e legenda por frase. Manda o storyboard antes e só entrega o final com aprovação.
argument-hint: "[vídeo da notícia] [vídeo da reação] [vídeo do comentário] [manchete, opcional]"
disable-model-invocation: true
---

# /tela-dividida-noticia

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.

Monte um Reel vertical (1080x1920, 30 fps) igual ao modelo de referência, usando os arquivos de `$ARGUMENTS`. Fale com a pessoa em português simples.

## Como o formato é (copiar exatamente)

**Parte 1: a notícia (tela dividida em 3 faixas)**
- **Em cima (0 a 752 px):** o vídeo da notícia, preenchendo a faixa (corta as sobras, sem barras pretas). **O som desta parte é o som da notícia.**
- **No meio (752 a 1122 px):** card estilo Twitter em fundo branco gelo `#F9F8FB`: foto redonda do perfil, nome em negrito com selo azul de verificado, @usuario em cinza e, embaixo, a manchete em negrito preto em até 3 linhas. O card fica parado do começo ao fim da parte 1, sem animação.
- **Embaixo (1122 a 1920 px):** a pessoa reagindo à notícia (olhando o tablet ou celular, fazendo caras), **sem som**.
- Sem legendas na parte 1 (o texto que já vier queimado no vídeo da notícia fica como está).

**Parte 2: o comentário**
- Corte seco (sem transição) para a pessoa falando em tela cheia.
- Legenda por frase: 2 a 6 palavras por vez, no máximo 3 linhas, centralizada, na altura do peito (centro em 1382 px), branca, Montserrat Bold 60 px, sombra leve, minúsculas (só nomes próprios com maiúscula), sem pontuação no fim, sem animação e sem emoji. Cada frase aparece quando começa a ser falada e some quando a próxima entra.
- **CTA (só se ela falar um CTA):** caixa marsala `#7D1D2F` com texto branco em Montserrat Bold 52 px, centralizada logo abaixo do queixo (centro em 1190 px), parada do momento em que o CTA começa a ser falado até o fim do vídeo. Enquanto o CTA estiver na tela, a legenda sobe e fica **praticamente colada embaixo da caixa** (6 px de espaço), sem buraco entre as duas; o modelo já faz isso sozinho. Se o queixo estiver mais baixo ou mais alto no vídeo, ajuste `cta.centroY` para a caixa ficar logo abaixo do queixo sem cobrir a boca.
- Sem música, sem efeitos sonoros, sem outros títulos.

O código pronto deste layout está em `modelo/TelaDivididaNoticia.tsx`, na pasta desta skill, com as medidas exatas. Não mude o layout a menos que a pessoa peça.

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

## Passo 1: entender o material

Peça o que faltar, de uma vez só:
1. **Vídeo da notícia** e o trecho a usar (se não disser, proponha o trecho mais forte de 20 a 50 s).
2. **Vídeo da reação** (a pessoa reagindo). Pode ser um trecho do mesmo arquivo do comentário.
3. **Vídeo do comentário** (a pessoa falando sobre a notícia).
4. **Card:** nome, @usuario, foto do perfil e a manchete. Se a pessoa não mandar a manchete, escreva uma no tom de portal de fofoca (fato + quem + número ou polêmica, até 90 caracteres) e coloque no storyboard para ela aprovar.

Confira `ffmpeg`, Node e Whisper. Se faltar algo, diga o que precisa instalar e ofereça instalar.

## Passo 2: tratar o comentário com o /imparavel

Faça no vídeo do comentário toda a edição básica do comando `/imparavel` (cortes de erros e respiros, 1.2x sem mudar a voz, áudio limpo, volume -14 LUFS), mas mostre esses cortes dentro do storyboard deste formato, não em um storyboard separado. No vídeo da notícia não corte nada no meio do trecho escolhido; só ajuste o volume para ficar no mesmo nível do comentário.

## Passo 3: montar no Remotion (sem renderizar ainda)

1. Use um projeto Remotion que já exista na pasta da pessoa; se não houver, crie um (`npx create-video@latest --blank`) e instale `@remotion/google-fonts` e `zod`.
2. Copie `modelo/TelaDivididaNoticia.tsx` para `src/` e registre a composição como em `modelo/Root-exemplo.tsx` (com `schema` e `calculateMetadata`).
3. Coloque os vídeos e a foto em `public/` e preencha os dados: trechos da notícia e da reação, duração do comentário tratado, card, a lista de legendas (tempos em segundos dentro da parte 2) e, se houver CTA falado, `cta` com o texto e o segundo em que ele começa a ser falado.
4. Ajuste `enquadramento` (object-position) para o rosto ficar bem na faixa de baixo e o assunto principal da notícia ficar visível em cima.

## Passo 4: storyboard

Transcreva o trecho da notícia e o comentário já tratado. Gere `storyboard.html` (veja "Como fazer o storyboard") e **abra automaticamente**. Coloque nele uma imagem da parte 1 montada (notícia, card e reação) e uma da parte 2 com a legenda, tiradas com `npx remotion still`, além deste conteúdo:

```
# Storyboard: tela dividida notícia

Duração final: 1:12 (parte 1: 0:00 a 0:47 · parte 2: 0:47 a 1:12)

## Parte 1: notícia (0:00 a 0:47)
Trecho da notícia: 1:05 a 1:52 do arquivo original
Reação embaixo: 0:10 a 0:57 do arquivo da reação
Card: Livia Brasil · @liviabrasilc
Manchete: "Empresário chama Virgínia de gananciosa e fala que ela ganhava 6x mais que ele"
O que se ouve: "..." (resumo da fala da notícia)

## Parte 2: comentário (0:47 a 1:12)
| Tempo | Legenda |
|---|---|
| 0:47.0 | ele contratou a Virgínia |
| 0:48.6 | foi pagando |

## Cortes no comentário (tempos no arquivo original)
1. **0:04.2 → 0:06.0** (1.8 s). "..." repetido; fica "...".
Respiros: 21 pausas encurtadas.
```

Pergunte se quer mudar a manchete, o trecho da notícia, algum corte ou alguma legenda. Ajuste só o que for pedido, gere o storyboard de novo e abra.

## Passo 5: prévia de 8 segundos

Renderize 8 s contínuos que peguem a virada da parte 1 para a parte 2 (por exemplo de 4 s antes a 4 s depois do corte), para a pessoa ver as duas partes sem emenda: `npx remotion render <composição> previa-8s.mp4 --frames=<inicio>-<fim>`. Abra a prévia automaticamente e pergunte se pode fazer o vídeo final.

## Passo 6: vídeo final (só com aprovação)

Renderize em H.264 (`--codec=h264 --crf=18`), salve como `<nome>-tela-dividida.mp4` em uma pasta de entregas, confira 3 frames (parte 1, momento do corte, parte 2), abra o vídeo automaticamente e diga onde está o arquivo e a duração.
