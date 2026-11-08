---
name: imparavel
description: Edição básica universal de um vídeo falado (Reels, aula, depoimento) no padrão da Lívia Brasil. Corta erros e respiros, acelera 1.2x sem mudar a voz e limpa o áudio. Sempre manda o storyboard antes e só entrega o vídeo final com aprovação.
argument-hint: "[caminho do vídeo] [pedidos extras, opcional]"
disable-model-invocation: true
---

# /imparavel: edição básica universal

> **Pontuação (regra da Lívia para todos os formatos):** nunca use ponto final, nem no título nem em nenhuma legenda ou texto na tela. As únicas pontuações permitidas são vírgula, exclamação e aspas (só em citação). Também não use interrogação, dois-pontos (exceto no CTA "Comenta: PALAVRA") nem reticências.

Você vai fazer a edição básica do vídeo indicado em `$ARGUMENTS`: deixar o vídeo bem cortadinho, rápido e com áudio limpo, sem mudar a voz da pessoa. Este é o primeiro passo de todos os formatos de edição; os outros formatos partem do vídeo que sai daqui.

Fale com a pessoa em português, em frases simples, sem termos técnicos. Se `$ARGUMENTS` não trouxer o vídeo, pergunte qual é o arquivo e pare.

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
   No /imparavel não entram textos na tela, então ele não coloca CTA; o CTA fixo entra nos formatos de edição.

## Como fazer o storyboard (visual)

O storyboard é **visual**: a pessoa precisa ver todas as cenas do vídeo, na ordem, como uma tirinha.
1. **Divida o vídeo final em cenas.** Uma cena é cada momento em que muda algo na tela: um corte, uma nova frase de legenda, um título, uma imagem, a troca de layout. Em fala sem legenda, uma cena por frase.
2. **Tire uma imagem de cada cena já editada** (com o enquadramento, os textos e o layout finais, não do vídeo bruto), no meio da cena. No Remotion: `npx remotion still <entrada> <composição> quadros/cena-NN.png --frame=<frame> --props=<dados>.json`. Só com ffmpeg: `ffmpeg -ss <tempo> -i <video-editado> -frames:v 1 quadros/cena-NN.jpg`. Reduza para 360 px de largura.
3. **Monte o `storyboard.json`** com cada cena (imagem, tempo no vídeo final, título curto, o que se ouve ou a legenda, nota e `confira: true` quando houver dúvida), a lista de cortes e as observações. Veja o modelo no topo de `storyboard/gerar_storyboard.py`, na pasta desta skill.
4. **Gere a página:** `python3 storyboard/gerar_storyboard.py storyboard.json storyboard.html`. Ela sai num arquivo só, com as imagens dentro, e mostra as cenas numeradas em grade, os cortes e os pontos para CONFERIR.
5. **Abra automaticamente** o `storyboard.html` no navegador.

## Passo 1: preparar

- Confira se `ffmpeg` e `ffprobe` estão instalados. Para transcrever com o tempo de cada palavra, use Whisper (`whisper-cpp`, `faster-whisper` ou `openai-whisper`, o que estiver disponível). Se faltar algo, diga em uma frase o que precisa instalar e ofereça instalar.
- Crie uma pasta de trabalho ao lado do vídeo: `<nome-do-video>-imparavel/`.
- Leia duração, resolução, fps e áudio com `ffprobe`.

## Passo 2: transcrever e achar os cortes

1. Extraia o áudio (`ffmpeg -i video -vn -ac 1 -ar 16000 audio.wav`) e transcreva em português com tempo por palavra.
2. Marque como corte:
   - **Erros de gravação:** começos interrompidos, frases repetidas (fica a versão mais completa, normalmente a última), palavras soltas, "hum"/"é..." sozinhos, comentários de bastidor ("corta essa parte", "testando o áudio").
   - **Respiros:** toda pausa entre frases acima de 0,3 s vira um respiro curto (cerca de 80 ms depois da última palavra e 60 ms antes da próxima). Confirme silêncios com `ffmpeg -af silencedetect=noise=-35dB:d=0.3`.
   - **Começo e fim:** tudo antes do início da primeira frase e depois do fim da última frase.
3. Ajuste cada ponto de corte para cair no silêncio entre palavras, nunca dentro de uma palavra correta. Se a palavra seguinte começa colada, prefira cortar uns milissegundos depois a cortar o início dela.

## Passo 3: storyboard e prévia de 8 segundos (abrem sozinhos)

Assim que os cortes estiverem definidos, faça as duas coisas de uma vez:

1. **Prévia:** gere `previa-8s.mp4` com todo o tratamento (cortes, 1.2x, áudio). Escolha 8 s contínuos do resultado final, sem emendar duas partes, com pelo menos dois cortes dentro, para a pessoa sentir o ritmo.
2. **Storyboard:** gere `storyboard.html` (veja "Como fazer o storyboard") com os cortes de erros, o total de respiros removidos e o tratamento de áudio.
3. **Abra os dois automaticamente** no computador (primeiro a prévia, depois o storyboard).

Depois pergunte: "Quer mudar algum corte? Se estiver tudo certo, eu faço o vídeo completo." Espere a resposta. Se a pessoa pedir ajuste, mude só aquele ponto, gere de novo a prévia e o storyboard, abra os dois e pergunte de novo.

## Passo 4: vídeo final (só com aprovação)

Monte o vídeo com `ffmpeg` nesta ordem:

1. **Cortes:** junte os trechos mantidos (filtro `select`/`aselect` com os intervalos, ou `trim`/`atrim` + `concat`). Aplique um fade de áudio de 10 ms em cada emenda para não estalar.
2. **Acelerar 1.2x sem mudar a voz:** vídeo com `setpts=PTS/1.2`, áudio com `atempo=1.2` (o `atempo` mantém o tom da voz). Se o ffmpeg tiver `rubberband`, pode usar `rubberband=tempo=1.2:pitchq=quality`.
3. **Limpar o áudio sem mudar a voz:** `highpass=f=80`, redução de ruído leve (`afftdn=nr=10:nf=-30`, ou `arnndn` se houver modelo) e sem equalização que mude o timbre.
4. **Volume para Instagram:** `loudnorm=I=-14:TP=-1.5:LRA=11` (em duas passadas se possível).
5. **Exportar:** mesma resolução e orientação do original, H.264 (`-c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p`), AAC 192k, 30 fps se o original for 30 ou mais, `-movflags +faststart`.

Salve como `<nome-do-video>-imparavel.mp4` ao lado do original. Assista a 3 pontos com cortes (extraia frames ou trechos curtos) para conferir que nenhuma palavra foi cortada. Abra o vídeo final automaticamente e diga à pessoa onde está o arquivo, a duração final e que o vídeo está pronto para o próximo formato de edição, se ela quiser.
