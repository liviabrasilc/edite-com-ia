# Edite com IA

Os formatos de edição de vídeo da Lívia Brasil, prontos para usar no Claude Code. Cada formato é um comando: você manda o vídeo, recebe o storyboard, ajusta o que quiser e só depois recebe o vídeo final.

## Como instalar

**O jeito mais fácil:** copie a mensagem abaixo e cole numa conversa nova do Claude.

```
Instale para mim o plugin de edição de vídeo "edite-com-ia" da Lívia Brasil. Rode estes dois comandos: claude plugin marketplace add liviabrasilc/edite-com-ia e depois claude plugin install edite-com-ia@edite-com-ia --scope user. Se aqui você não conseguir rodar comandos, me explique bem simples, um passo de cada vez, como instalar pelo app do Claude: Customize, Plugins, Add marketplace, liviabrasilc/edite-com-ia, Install.
```

**No app do Claude (mais fácil):**
1. No menu do lado, clique em **Customize** (Personalizar) e depois em **Plugins**.
2. Clique em **Add marketplace** (Adicionar marketplace) e cole: `liviabrasilc/edite-com-ia`
3. O plugin **edite-com-ia** aparece na lista. Clique em **Install** (Instalar).

Pronto: os formatos ficam salvos na sua conta e funcionam nas suas conversas do Claude.

**No Claude Code (terminal), digite:**

```
/plugin marketplace add liviabrasilc/edite-com-ia
/plugin install edite-com-ia@edite-com-ia
```

## Comandos

| Comando | O que faz |
|---|---|
| `/imparavel caminho/do/video.mov` | Edição básica: corta erros e respiros, acelera 1.2x sem mudar a voz e limpa o áudio. |
| `/tela-dividida-noticia` | Notícia em cima, card estilo Twitter com a manchete no meio e você reagindo embaixo; depois você comentando em tela cheia com legenda. |
| `/teladivididaelegante` | Imagem em cima e você embaixo, alternando com você em tela cheia, legenda curta em itálico e palavras-chave grandes surgindo palavra por palavra. |
| `/yapelaborado` | Você em tela cheia com cortes e zoom, legenda de uma palavra por vez ao lado do rosto e textos em cima da cabeça (título ou texto digitado letra por letra). |
| `/yaporganico` | Você em tela cheia com cortes e zoom, gancho escrito no começo e legenda curta branca parada abaixo do queixo, sem música nem efeitos. |
| `/lista` | Lista de 1 a 10: você em tela cheia, título fixo no topo, números do lado esquerdo e cada produto entra na sua mão e voa para a posição dele. Sem legenda, música ou efeitos. |
| `/rankingelegante` | Ranking elegante: título dourado no começo, círculos de 1 a 10 à esquerda, legenda de uma palavra e cada produto sobe grande e voa para a posição dita. |
| `/rankingcolorido` | Ranking colorido: título em caixas brancas, quadradinhos coloridos de 1 a 10 que acendem com um ding, nome do produto escrito letra por letra, legenda karaokê amarela e cada produto voa para a posição dita. |
| `/problemaxsolucao1` | Problema x solução: tela dividida com duas gravações (Dúvida e Resposta), título fixo numa faixa preta e legenda em caixa vermelha do lado de quem fala. |
| `/problemaxsolucao2` | Problema x solução 2: tabela de 2 colunas com blocos vermelhos e verdes que somem quando cada item é falado, depois legenda curta em maiúsculas. |
| `/issoouaquilo` | Isso ou aquilo: foto do problema no alto à esquerda e produto sem fundo (com o nome embaixo) no alto à direita, entrando deslizando a cada par, com legenda igual à do yap orgânico. |
| `/issoouaquilochic` | Isso ou aquilo chic: título de 2 linhas no topo; cartão branco com a imagem sobe para o peito e a etiqueta (✅, ❌ ou 💎) aparece no veredito com um clique-clique. |
| `/narracaovlog` | Narração vlog: takes curtos com corte seco, a narração por cima e legenda amarela com contorno preto, uma frase por vez em minúsculas. |
| `/narracaotutorial` | Narração tutorial: takes com corte seco e narração; título de 3 linhas, gancho que se monta linha a linha com pop e brilho, legenda manuscrita palavra por palavra, CTA branco. |
| `/conversacomvoce` | Conversa com você: esquete com a pessoa nos dois papéis, corte seco, título POV fixo, legenda por frase, trilha e grave de tensão na abertura, CTA marsala. |
| `/conversaelegante` | Conversa elegante: a pessoa nos dois papéis com corte seco, título em caixa escura com Bebas creme no começo, legenda condensada por frase, animação de salvar e seguir, CTA marsala. |
| `/telaverde` | Tela verde: a pessoa recortada na frente do vídeo ou foto que está comentando, legenda branca em negrito por frase (a primeira maior), CTA marsala. |
| `/bastidor` | Bastidor: takes curtos com narração, gancho em palavras grandes, valor revelado por moeda dourada, legenda itálica palavra por palavra e final com música. |

Mais formatos em breve.

## Como funciona cada edição

1. Você manda o comando com o vídeo.
2. O Claude manda o **storyboard**: todos os cortes, como o vídeo começa e termina e a duração final.
3. Você pede ajustes, se quiser.
4. O Claude manda uma **prévia de 8 segundos**.
5. Você aprova e recebe o **vídeo final**.

Precisa ter `ffmpeg` instalado no computador (e Node, para os formatos montados no Remotion). Se não tiver, o Claude oferece instalar.
