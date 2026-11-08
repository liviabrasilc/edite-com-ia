---
name: problemaxsolucao1
description: Formato "Problema x solução 1" da Lívia Brasil. Tela dividida ao meio com duas gravações da mesma pessoa, Dúvida à esquerda e Resposta à direita, título fixo numa faixa preta e legenda em caixa vermelha do lado de quem fala. Manda o storyboard visual antes e só entrega o final com aprovação.
argument-hint: "[vídeo da Dúvida] [vídeo da Resposta]"
disable-model-invocation: true
---

# /problemaxsolucao1

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.

Monte um Reel vertical (1080x1920, 30 fps) igual ao modelo de referência, usando os vídeos de `$ARGUMENTS`. Fale com a pessoa em português simples.

## Como o formato é (copiar exatamente)

A pessoa grava **duas vezes**, de preferência com fone ouvindo a primeira gravação: uma fazendo as perguntas (**Dúvida**) e outra respondendo (**Resposta**), cada uma reagindo em silêncio enquanto a outra fala. As duas rodam **juntas o tempo todo**, lado a lado. **Sem música e sem efeitos sonoros.** O áudio é a voz das duas gravações.

**Layout:** faixa preta no topo (até y = 390) e embaixo a tela dividida ao meio na vertical: **Dúvida na metade esquerda** e **Resposta na metade direita** (cada uma com 540 px de largura, vídeo cortado no centro, sem zoom extra).

**Título (fixo o vídeo inteiro):** na faixa preta, centralizado, em 2 caixas:
- linha 1: caixa **branca** arredondada, texto **preto Figtree ExtraBold (800) 68 px**, pode terminar com emoji (ex.: "Não pule este vídeo 🚨"); topo em y = 167, 89 px de altura;
- linha 2: caixa **vermelho-escura `#4C0001`**, texto **branco Figtree ExtraBold 54 px** (ex.: "Salvando a sua CNH em 28 segundos"); 97 px de altura, colada embaixo da linha 1.

**Etiquetas:** "Dúvida" e "Resposta" no topo de cada metade (topo em y = 365, centralizadas em x = 270 e x = 810), caixa **branca com borda vermelha `#FF0000` grossa (7 px)**, cantos arredondados, texto **preto Roboto Bold 76 px**.

**Legenda:** frases curtas em **até 2 linhas** (até ~15 letras por linha), **Figtree ExtraBold 56 px branca** com sombra escura, numa **caixa vermelha transparente de borda suave**. Fica **sempre na metade de quem está falando**, centralizada nessa metade, **cerca de 1 cm abaixo do queixo** (`legendaTopo`), nunca no rosto. Troca seca, sem animação. Sem ponto final nem interrogação.

**CTA:** se a pessoa falar um CTA, caixa marsala `#7D1D2F` com texto branco em negrito, cantos arredondados, `Comenta: PALAVRA`, **logo abaixo do queixo de quem fala, colada em cima da legenda**, na metade dela. Aparece quando ela começa a falar o CTA e fica parada até o fim. O título continua na tela.

O código pronto está em `modelo/ProblemaXSolucao.tsx`, na pasta desta skill; `modelo/exemplo-dados.json` mostra todos os campos preenchidos.

## Regras que valem sempre

1. **Storyboard primeiro.** Nunca entregue o vídeo final sem antes mandar o storyboard e a pessoa aprovar.
2. **Prévia de 8 segundos contínua.** Depois do storyboard aprovado, mande uma prévia de 8 s de um trecho só, sem emendar duas partes (a pessoa entende emenda como corte errado).
3. **Vídeo final só com aprovação clara** ("pode fazer", "aprovado", "manda o final"). Silêncio ou elogio não é aprovação.
4. **Mude só o que a pessoa pedir.** Em cada ajuste, mexa apenas no ponto pedido e mantenha todo o resto igual.
5. **O vídeo começa no início da primeira frase**, sem silêncio, respiração ou "é..." antes.
6. **Cortes precisos.** Nunca corte o pedaço de uma palavra correta. Só saem palavras que são erro (tropeço, repetição, frase abandonada, comentário de bastidor).
7. **Nunca mude o sentido** do que a pessoa disse. Na dúvida, deixe o trecho e marque "CONFIRA" no storyboard.
8. **Efeitos sonoros**, se algum formato usar, começam bem baixos, abaixo da voz. Este formato não tem efeito sonoro.
9. **Nunca apague nem sobrescreva o vídeo original.** Tudo novo vai para arquivos novos.
10. **Abra tudo automaticamente no computador.** Assim que o storyboard, a prévia ou o vídeo final ficarem prontos, abra o arquivo sozinho para a pessoa ver, sem ela precisar procurar: `open "<arquivo>"` no Mac, `start "" "<arquivo>"` no Windows, `xdg-open "<arquivo>"` no Linux. Depois diga no chat o que abriu e onde o arquivo está salvo.
11. **CTA fixo na tela.** Só se a pessoa falar um CTA no vídeo (comentar uma palavra, seguir, curtir, salvar, compartilhar, chamar no direct, clicar no link). O CTA aparece no momento em que ela começa a falar o CTA e **fica parado na tela até o último quadro**, sem animação; a legenda continua rolando embaixo dele. Quando o CTA fica abaixo do queixo, a legenda fica praticamente colada embaixo da caixa do CTA, sem espaço vazio entre os dois. Neste formato o CTA fica logo abaixo do queixo de quem está falando (na metade dela), colado em cima da legenda; o título continua na tela. Texto curto e direto:
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

Confira `ffmpeg`, Node e Whisper; instale o que faltar. A pessoa manda **dois vídeos**: o da Dúvida e o da Resposta. Use os dois como vieram (sem cortar e sem acelerar). Se ela mandar um vídeo só, pergunte se é para usar o mesmo vídeo nos dois lados ou se ela vai mandar a segunda gravação.

**Sincronizar:** as duas gravações precisam andar juntas. Transcreva as duas e ache o ponto em que a primeira fala começa nas duas (ou um bater de palmas). Use `duvida.inicio` e `resposta.inicio` (segundos do arquivo) para alinhar. Se não der para alinhar com certeza, marque "CONFIRA" no storyboard.

## Passo 2: transcrever

Transcreva as duas gravações com o tempo de cada palavra (Whisper). Em cada momento, quem fala é a gravação que tem voz; é daí que sai o lado de cada frase.

## Passo 3: planejar e montar no Remotion (sem renderizar ainda)

1. `duracao` = do início da primeira fala até o fim da última, já sincronizado.
2. Título: `titulo` = linha 1 (gancho curto, com emoji se combinar) e `subtitulo` = linha 2 (o tema). Sem ponto final. Se a pessoa disser o título, use as palavras dela.
3. Legendas: `frases` = grupos de palavras em até 2 linhas de ~15 letras, quebrando em vírgula, ponto, interrogação ou pausa maior que 0,6 s. Cada frase vai do início da primeira palavra até o início da próxima frase, com `lado` = "duvida" ou "resposta" (quem fala). Tire ponto final, interrogação e reticências; mantenha só vírgula e exclamação. Números em algarismos.
4. CTA: se houver, `cta.inicio` = início da primeira palavra do CTA e `cta.lado` = quem fala.
5. Meça o queixo nas duas metades em vários momentos e use em `legendaTopo` o ponto mais baixo + ~75 px (uns 1 cm abaixo do queixo).
6. Copie `modelo/ProblemaXSolucao.tsx` para `src/` e registre como em `modelo/Root-exemplo.tsx`. Instale `@remotion/google-fonts` e `zod` na versão que o Remotion pedir. Preencha os dados como em `modelo/exemplo-dados.json` (todos os campos).

## Passo 4: storyboard visual

Gere o storyboard como em "Como fazer o storyboard": uma imagem por troca de frase, dizendo de que lado está a legenda, mais o CTA. Abra automaticamente. Pergunte se quer mudar algo; ajuste só o que for pedido e abra de novo.

## Passo 5: prévia de 8 segundos

Renderize os 8 primeiros segundos, sem emenda: `npx remotion render <entrada> ProblemaXSolucao previa-8s.mp4 --frames=0-239 --codec=h264 --crf=18`. Abra automaticamente e pergunte se pode fazer o vídeo final.

## Passo 6: vídeo final (só com aprovação)

Renderize o vídeo inteiro em H.264, salve como `<nome>-problema-x-solucao.mp4` na pasta de entregas, confira 3 quadros (começo, uma troca de lado e o CTA), abra automaticamente e diga onde está o arquivo e a duração.
