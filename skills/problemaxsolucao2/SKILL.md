---
name: problemaxsolucao2
description: Formato "Problema x solução 2" da Lívia Brasil. A pessoa fala para a câmera com uma tabela de 2 colunas (ex.: sintoma e ação) sobre o peito, com as linhas tampadas por blocos vermelhos e verdes que somem quando cada item é falado; depois a tabela sai e entra legenda curta em maiúsculas. Manda o storyboard visual antes e só entrega o final com aprovação.
argument-hint: "[vídeo da pessoa falando]"
disable-model-invocation: true
---

# /problemaxsolucao2

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.

Monte um Reel vertical (1080x1920, 30 fps) igual ao modelo de referência, usando o vídeo de `$ARGUMENTS`. Fale com a pessoa em português simples.

## Como o formato é (copiar exatamente)

A pessoa **em tela cheia o tempo todo**, fundo original, sem zoom. **Sem música e sem efeitos sonoros.** O áudio é a voz como veio.

**@ da pessoa:** pequeno no topo (y = 128), centralizado, Montserrat Medium 36 px branco, fixo o vídeo inteiro. Pergunte o @ se não souber.

**Tabela (primeira parte do vídeo):** sobre o peito, 2 colunas (esquerda x = 110 a 508, direita x = 572 a 970, um pouco mais estreitas que a referência para respeitar as margens laterais do Instagram):
- títulos das colunas em **MAIÚSCULAS, Montserrat ExtraBold branca com sombra**, letras bem juntas (até 76 px; palavra longa fica um pouco menor para caber), centralizados em cada coluna (ex.: "SINTOMA" e "AÇÃO", ou "PROBLEMA" e "SOLUÇÃO");
- uma linha para cada item (140 px de altura, 153 px entre uma e outra); o texto do item em **MAIÚSCULAS, Montserrat ExtraBold 50 px branca com sombra**, centralizado na linha (quebra em 2 linhas se for comprido);
- no começo **todas as linhas estão tampadas por blocos sólidos: vermelho `#ED1D1D` na coluna da esquerda e verde `#00AE07` na da direita**;
- **quando a pessoa fala um item, o bloco dele some de uma vez (corte seco, sem animação)** e aparece o texto. A esquerda e a direita abrem cada uma na sua hora.
- Na referência a tabela começa em y = 920 (títulos) e vai até y = 1805. Se o rosto da pessoa estiver mais baixo, desça a tabela (`tabelaTopo`) para ela ficar abaixo do queixo.

**Fim da tabela:** quando a pessoa termina a lista, a tabela **sai da tela de uma vez** (`tabelaFim`) e começa a legenda.

**Legenda (só depois da tabela):** **2 ou 3 palavras por vez, em MAIÚSCULAS, Inter Bold 62 px branca**, centralizada, **parada sempre no mesmo lugar**, **cerca de 1 cm abaixo do queixo** (`legendaTopo`), nunca no rosto. Sem ponto final.

**CTA:** se a pessoa falar um CTA, caixa marsala `#7D1D2F` com texto branco em negrito, cantos arredondados, `Comenta: PALAVRA`, **logo abaixo do queixo e colada em cima da legenda**. Aparece quando ela começa a falar o CTA e fica parada até o fim.

O código pronto está em `modelo/ProblemaXSolucao2.tsx`, na pasta desta skill; `modelo/exemplo-dados.json` mostra todos os campos preenchidos.

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
11. **CTA fixo na tela.** Só se a pessoa falar um CTA no vídeo (comentar uma palavra, seguir, curtir, salvar, compartilhar, chamar no direct, clicar no link). O CTA aparece no momento em que ela começa a falar o CTA e **fica parado na tela até o último quadro**, sem animação; a legenda continua rolando embaixo dele. Quando o CTA fica abaixo do queixo, a legenda fica praticamente colada embaixo da caixa do CTA, sem espaço vazio entre os dois. Neste formato o CTA fica logo abaixo do queixo, colado em cima da legenda (depois que a tabela saiu da tela). Texto curto e direto:
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

Transcreva o vídeo com o tempo de cada palavra (Whisper). É daí que saem os itens da tabela, a legenda e o CTA.

## Passo 3: planejar e montar no Remotion (sem renderizar ainda)

1. Cenas: o vídeo inteiro como veio, sem zoom.
2. `colunas`: os dois títulos, em maiúsculas. Use as palavras que a pessoa fala (ex.: "sintoma" e "ação"); se ela não disser, use "PROBLEMA" e "SOLUÇÃO".
3. `linhas`: uma por par que a pessoa apresenta, na ordem. Em cada lado, `texto` = o item curto em maiúsculas (até 3 palavras, como ela fala) e `aparece` = início da palavra em que ela fala esse item. Se não estiver claro qual é o par, marque "CONFIRA" no storyboard.
4. `tabelaFim` = quando ela termina a lista e passa para o resto da fala (o começo da primeira frase depois do último item).
5. `legendas`: depois da tabela, grupos de 2 ou 3 palavras em MAIÚSCULAS, do início do grupo até o início do próximo. Tire ponto final, interrogação e reticências; mantenha só vírgula e exclamação. Números em algarismos.
6. CTA: se houver, `cta.inicio` = início da primeira palavra do CTA.
7. Meça o queixo em vários momentos e use em `legendaTopo` o ponto mais baixo + ~95 px (uns 1 cm abaixo do queixo). Se o queixo ficar abaixo de y = 900, desça a tabela (`tabelaTopo` = queixo + ~10 px).
8. Copie `modelo/ProblemaXSolucao2.tsx` para `src/` e registre como em `modelo/Root-exemplo.tsx`. Instale `@remotion/google-fonts` e `zod` na versão que o Remotion pedir. Preencha os dados como em `modelo/exemplo-dados.json` (todos os campos).

## Passo 4: storyboard visual

Gere o storyboard como em "Como fazer o storyboard": uma imagem do começo (tabela toda tampada), uma para cada item que abre, uma da tabela completa, uma da primeira legenda depois da tabela e o CTA. Abra automaticamente. Pergunte se quer mudar algo; ajuste só o que for pedido e abra de novo.

## Passo 5: prévia de 8 segundos

Renderize 8 s seguidos, sem emenda, de um trecho que mostre itens abrindo e, se der, a tabela saindo: `npx remotion render <entrada> ProblemaXSolucao2 previa-8s.mp4 --frames=<início>-<início+239> --codec=h264 --crf=18`. Abra automaticamente e pergunte se pode fazer o vídeo final.

## Passo 6: vídeo final (só com aprovação)

Renderize o vídeo inteiro em H.264, salve como `<nome>-problema-x-solucao-2.mp4` na pasta de entregas, confira 3 quadros (tabela tampada, tabela completa e o CTA), abra automaticamente e diga onde está o arquivo e a duração.
