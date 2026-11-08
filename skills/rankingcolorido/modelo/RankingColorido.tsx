// Formato "Ranking colorido" da Lívia Brasil (comando /rankingcolorido).
// Igual à referência: a pessoa fala para a câmera em tela cheia, sem música.
//  - Título fixo no topo em caixas brancas arredondadas (uma por linha), Montserrat Bold preta, com a palavra-chave em vermelho.
//    Fica parado do primeiro quadro até o CTA (regra da Lívia).
//  - Lista do lado esquerdo: 10 quadradinhos coloridos arredondados com "1-" a "10-" em preto (Montserrat ExtraBold).
//    Vazios ficam apagados (meio transparentes); acendem na cor cheia quando o produto chega, com um "ding".
//  - Produto (foto sem fundo) aparece com fade rápido (8 quadros) enquanto a pessoa fala dele, com o nome escrito
//    letra por letra (efeito máquina de escrever, 1 letra por quadro) em branco com contorno preto, no lugar da legenda.
//    Quando ela diz a posição, o nome some e o produto voa diminuindo até o lado do quadradinho (17 quadros).
//  - Legenda: frases curtas em 2 linhas, Montserrat Bold branca; cada palavra fica amarela quando é falada (karaokê).
//  - CTA (regra da Lívia): caixa marsala "Comenta: PALAVRA" logo abaixo do queixo, colada em cima da legenda;
//    quando o CTA entra, o ranking e o título saem da tela e ficam só o CTA e a legenda.
// Medidas tiradas do vídeo de referência (1080x1920).
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { z } from "zod";

const montserrat = loadMontserrat("normal", { weights: ["700", "800"], subsets: ["latin", "latin-ext"] });
const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

const FPS = 30;
const FADE = 8; // quadros: produto aparece
const VOO = 17; // quadros: produto voa até o quadradinho
const QUAD_X = 144; // centro dos quadradinhos
const QUAD_A = 98; // altura do quadradinho
const QUAD_Y1 = 372; // centro do 1
const PASSO = 118.1; // distância entre um e outro
const SLOT_ESQ = 220; // produto pequeno à direita do quadradinho
const SLOT_L = 80;
const SLOT_A = 114;
const GRANDE_L = 300;
const GRANDE_A = 300;
const CENTRO_X = 540; // legenda, nome do produto e produto grande
const AMARELO = "#E9BF03";
const CORES = ["#FF0000", "#F3C60F", "#FE7E00", "#FC0852", "#CC00FF", "#008FFE", "#00B109", "#FFD5F1", "#FE86CB", "#EFFC00"];
const CONTORNO = "-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 3px 0 #000, 0 -3px 0 #000, 3px 0 0 #000, -3px 0 0 #000, 0 4px 10px rgba(0,0,0,0.6)";

const itemSchema = z.object({
  imagem: z.string(),
  proporcao: z.number(), // largura / altura
  nome: z.string(), // nome do produto, escrito letra por letra
  posicao: z.number(),
  entra: z.number(), // quando a pessoa fala o nome do produto
  voa: z.number(), // quando ela diz a posição
});

export const rankingColoridoSchema = z.object({
  apresentadora: z.object({ arquivo: z.string() }),
  cenas: z.array(z.object({ duracao: z.number(), apresentadoraInicio: z.number().optional() })),
  titulo: z.array(z.string()), // uma linha por item; *palavra* fica vermelha
  quantidade: z.number().optional(), // padrão 10
  palavras: z.array(z.object({ texto: z.string(), inicio: z.number() })), // todas as palavras faladas, com o tempo
  frases: z.array(z.object({ linhas: z.array(z.array(z.number())), inicio: z.number(), fim: z.number() })), // índices das palavras em cada linha
  legendaTopo: z.number().optional(), // topo da legenda (px), ~1 cm abaixo do queixo
  produtoTopo: z.number().optional(), // topo do produto grande (px)
  itens: z.array(itemSchema),
  cta: z.object({ texto: z.string(), inicio: z.number() }).optional(),
  volumeDing: z.number().optional(), // padrão 0.5 (bem abaixo da voz)
});

export type RankingColoridoProps = z.infer<typeof rankingColoridoSchema>;

export const calcularDuracao: CalculateMetadataFunction<RankingColoridoProps> = ({ props }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.cenas.reduce((s, c) => s + c.duracao, 0) * FPS),
});

const quadY = (n: number) => QUAD_Y1 + (n - 1) * PASSO;
const caber = (prop: number, w: number, h: number) => (prop >= w / h ? { w, h: w / prop } : { w: h * prop, h });

const Item: React.FC<{ it: z.infer<typeof itemSchema>; topoY: number }> = ({ it, topoY }) => {
  const f = useCurrentFrame();
  const fe = Math.round(it.entra * FPS);
  const fv = Math.round(it.voa * FPS);
  if (f < fe) return null;
  const g = caber(it.proporcao, GRANDE_L, GRANDE_A);
  const s = caber(it.proporcao, SLOT_L, SLOT_A);
  const gy = topoY + g.h / 2;
  const sx = SLOT_ESQ + s.w / 2;
  const sy = quadY(it.posicao);
  let cx = CENTRO_X, cy = gy, w = g.w, h = g.h, op = 1;
  if (f < fv) {
    op = interpolate(f, [fe, fe + FADE], [0, 1], { extrapolateRight: "clamp" });
  } else {
    const p = interpolate(f, [fv, fv + VOO], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    cx = interpolate(p, [0, 1], [CENTRO_X, sx]);
    cy = interpolate(p, [0, 1], [gy, sy]);
    w = interpolate(p, [0, 1], [g.w, s.w]);
    h = interpolate(p, [0, 1], [g.h, s.h]);
  }
  return (
    <Img
      src={midia(it.imagem)}
      style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, opacity: op, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))" }}
    />
  );
};

export const RankingColorido: React.FC<RankingColoridoProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const total = p.quantidade ?? 10;
  let ini = 0;
  const inicios = p.cenas.map((c) => {
    const i = ini;
    ini += c.duracao;
    return i;
  });
  const topo = p.legendaTopo ?? 1215;
  const ctaAtivo = !!p.cta && t >= p.cta.inicio;
  // nome do produto: aparece letra por letra enquanto ele está grande, e ocupa o lugar da legenda
  const falando = p.itens.find((it) => t >= it.entra && t < it.voa);
  const frase = falando ? undefined : p.frases.find((fr) => t >= fr.inicio && t < fr.fim);
  // quadradinhos acesos: os que já receberam produto
  const chegou = (it: z.infer<typeof itemSchema>) => frame >= Math.round(it.voa * FPS) + VOO;
  const acesos = new Set(p.itens.filter(chegou).map((it) => it.posicao));

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {p.cenas.map((c, i) => (
        <Sequence key={i} from={Math.round(inicios[i] * FPS)} durationInFrames={Math.round(c.duracao * FPS)}>
          <OffthreadVideo
            src={midia(p.apresentadora.arquivo)}
            startFrom={Math.round((c.apresentadoraInicio ?? inicios[i]) * FPS)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>
      ))}
      <Audio src={midia(p.apresentadora.arquivo)} />

      {/* "Ding" quando o produto chega no quadradinho (igual à referência) */}
      {p.itens.map((it, i) => {
        const fc = Math.round(it.voa * FPS) + VOO;
        if (p.cta && fc >= p.cta.inicio * FPS) return null;
        return (
          <Sequence key={`ding-${i}`} from={fc} durationInFrames={48}>
            <Audio src={staticFile("sfx/ding-colorido.wav")} volume={p.volumeDing ?? 0.5} />
          </Sequence>
        );
      })}

      {!ctaAtivo && (
        <>
          {/* Título fixo no topo, centralizado na tela: caixas brancas, uma por linha */}
          <div style={{ position: "absolute", left: 0, width: 1080, top: 230, display: "flex", flexDirection: "column", alignItems: "center" }}>
            {p.titulo.map((linha, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "white",
                  borderRadius: 14,
                  padding: "6px 16px 8px",
                  marginTop: i === 0 ? 0 : -2,
                  fontFamily: montserrat.fontFamily,
                  fontWeight: 700,
                  fontSize: 54,
                  lineHeight: "66px",
                  color: "#111",
                  whiteSpace: "nowrap",
                }}
              >
                {linha.split(/(\*[^*]+\*)/).map((parte, k) =>
                  parte.startsWith("*") ? (
                    <span key={k} style={{ color: "#FC0000" }}>
                      {parte.slice(1, -1)}
                    </span>
                  ) : (
                    <span key={k}>{parte}</span>
                  ),
                )}
              </div>
            ))}
          </div>

          {/* Quadradinhos coloridos */}
          {Array.from({ length: total }, (_, k) => k + 1).map((n) => (
            <div
              key={n}
              style={{
                position: "absolute",
                left: QUAD_X - 100,
                width: 200,
                top: quadY(n) - QUAD_A / 2,
                height: QUAD_A,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  height: QUAD_A,
                  minWidth: 86,
                  boxSizing: "border-box",
                  padding: "0 4px",
                  borderRadius: 9,
                  backgroundColor: CORES[(n - 1) % CORES.length],
                  opacity: acesos.has(n) ? 1 : 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: montserrat.fontFamily,
                  fontWeight: 800,
                  fontSize: 80,
                  letterSpacing: -2,
                  color: "#111",
                }}
              >
                {n}-
              </div>
            </div>
          ))}

          {/* Produtos */}
          {p.itens.map((it, i) => (
            <Item key={i} it={it} topoY={p.produtoTopo ?? topo + 100} />
          ))}
        </>
      )}

      {/* CTA: logo abaixo do queixo, colado em cima da legenda; parado até o fim */}
      {ctaAtivo && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 1920 - topo + 6, display: "flex", justifyContent: "center" }}>
          <div style={{ backgroundColor: "#7D1D2F", color: "white", fontFamily: montserrat.fontFamily, fontWeight: 800, fontSize: 52, padding: "10px 30px", borderRadius: 14 }}>
            {p.cta!.texto}
          </div>
        </div>
      )}

      {/* Nome do produto, letra por letra, no lugar da legenda */}
      {falando && !ctaAtivo && (
        <div
          style={{
            position: "absolute",
            top: topo - 4,
            left: CENTRO_X - 500,
            width: 1000,
            textAlign: "center",
            fontFamily: montserrat.fontFamily,
            fontWeight: 800,
            fontSize: 60,
            lineHeight: 1.1,
            color: "white",
            textShadow: CONTORNO,
            whiteSpace: "nowrap",
          }}
        >
          {Array.from(falando.nome).map((ch, k) => (
            <span key={k} style={{ visibility: k <= frame - Math.round(falando.entra * FPS) ? "visible" : "hidden" }}>
              {ch}
            </span>
          ))}
        </div>
      )}

      {/* Legenda: 2 linhas, palavra fica amarela quando é falada */}
      {frase && (
        <div
          style={{
            position: "absolute",
            top: topo,
            left: CENTRO_X - 450,
            width: 900,
            textAlign: "center",
            fontFamily: montserrat.fontFamily,
            fontWeight: 700,
            fontSize: 42,
            lineHeight: "52px",
            color: "white",
            textShadow: "0 2px 6px rgba(0,0,0,0.55)",
          }}
        >
          {frase.linhas.map((linha, li) => (
            <div key={li} style={{ whiteSpace: "nowrap" }}>
              {linha.map((wi, k) => (
                <span key={wi} style={{ color: t >= p.palavras[wi].inicio ? AMARELO : "white" }}>
                  {k > 0 ? " " : ""}
                  {p.palavras[wi].texto}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};
