// Formato "Ranking elegante" da Lívia Brasil (comando /rankingelegante).
// Igual à referência: a pessoa fala para a câmera em tela cheia, sem música e sem efeitos sonoros.
//  - Título: Bebas Neue 94 px amarelo-dourado (#E8C847) com brilho escuro, centralizado, parado em cima do primeiro quadro até o CTA (pedido da Lívia).
//  - Lista fixa do lado esquerdo (1 cm para dentro): 10 círculos cinza translúcidos com borda branca tracejada e o número branco (Montserrat Black).
//  - Legenda: UMA palavra por vez, em MAIÚSCULAS, Montserrat Black 60 px branca, parada sempre no mesmo lugar (centro em x = 630).
//  - Cada produto (foto sem fundo) aparece ~1,7x maior e borrado e diminui rápido como um zoom out (9 quadros), fica parado embaixo da legenda
//    enquanto a pessoa fala dele e depois voa, diminuindo, para o lado do círculo da posição dita (8 quadros), onde fica.
//  - CTA (regra da Lívia): caixa marsala "Comenta: PALAVRA" logo abaixo do queixo, colada em cima da legenda;
//    quando o CTA entra, o ranking (título, círculos e produtos) sai da tela e ficam só o CTA e a legenda.
// Medidas tiradas do vídeo de referência (1080x1920).
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { z } from "zod";

const montserrat = loadMontserrat("normal", { weights: ["900"], subsets: ["latin", "latin-ext"] });
const bebas = loadBebas("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

const FPS = 30;
const ENTRADA = 9; // quadros: produto entra grande e borrado e diminui rápido (zoom out) até o tamanho normal
const VOO = 8; // quadros: produto voa até o círculo
const CIRCULO_X = 272; // 1 cm mais para dentro que a referência (pedido da Lívia) // centro dos círculos
const CIRCULO_D = 105; // diâmetro
const SLOT_ESQ = 340; // produto pequeno à direita do círculo
const SLOT_L = 90;
const SLOT_A = 100;
const GRANDE = 520; // altura máxima do produto grande
const LEG_X = 630; // centro da legenda (um pouco mais para dentro que a referência, pedido da Lívia)

const itemSchema = z.object({
  imagem: z.string(),
  proporcao: z.number(), // largura / altura
  posicao: z.number(),
  entra: z.number(), // quando a pessoa fala o nome do produto
  voa: z.number(), // quando ela diz a posição
});

export const rankingEleganteSchema = z.object({
  apresentadora: z.object({ arquivo: z.string() }),
  cenas: z.array(z.object({ duracao: z.number(), apresentadoraInicio: z.number().optional() })),
  titulo: z.string(),
  quantidade: z.number().optional(), // padrão 10
  legendas: z.array(z.object({ texto: z.string(), inicio: z.number(), fim: z.number() })), // uma palavra por vez
  legendaTopo: z.number().optional(), // topo da legenda (px), ~1 cm abaixo do queixo
  produtoTopo: z.number().optional(), // topo do produto grande (px), logo embaixo da legenda
  itens: z.array(itemSchema),
  cta: z.object({ texto: z.string(), inicio: z.number() }).optional(),
});

export type RankingEleganteProps = z.infer<typeof rankingEleganteSchema>;

export const calcularDuracao: CalculateMetadataFunction<RankingEleganteProps> = ({ props }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.cenas.reduce((s, c) => s + c.duracao, 0) * FPS),
});

const circuloY = (n: number, total: number) => 450 + (n - 1) * ((1470 - 450) / Math.max(total - 1, 1)); // 120 px mais para baixo que a referência, para o título centralizado caber em cima
const caber = (prop: number, w: number, h: number) => (prop >= w / h ? { w, h: w / prop } : { w: h * prop, h });

const Item: React.FC<{ it: z.infer<typeof itemSchema>; total: number; topoY: number; id: string }> = ({ it, total, topoY, id }) => {
  const f = useCurrentFrame();
  const fe = Math.round(it.entra * FPS);
  const fv = Math.round(it.voa * FPS);
  if (f < fe) return null;
  const g = caber(it.proporcao, 380, GRANDE);
  const centroY = topoY + g.h / 2;
  const s = caber(it.proporcao, SLOT_L, SLOT_A);
  const sx = SLOT_ESQ + s.w / 2;
  const sy = circuloY(it.posicao, total);
  let cx = LEG_X, cy = centroY, w = g.w, h = g.h, borrao = 0;
  if (f < fv) {
    // Igual à referência: aparece já no lugar, ~1,7x maior e muito borrado, e encolhe rápido até o tamanho normal
    const p = interpolate(f, [fe, fe + ENTRADA], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const esc = interpolate(p, [0, 1], [1.7, 1]);
    w = g.w * esc;
    h = g.h * esc;
    cy = centroY + interpolate(p, [0, 1], [g.h * 0.25, 0]);
    borrao = interpolate(p, [0, 1], [28, 0]);
  } else {
    const p = interpolate(f, [fv, fv + VOO], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
    cx = interpolate(p, [0, 1], [LEG_X, sx]);
    cy = interpolate(p, [0, 1], [centroY, sy]);
    w = interpolate(p, [0, 1], [g.w, s.w]);
    h = interpolate(p, [0, 1], [g.h, s.h]);
  }
  return (
    <>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={id} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation={`${borrao * 0.35} ${borrao}`} />
        </filter>
      </svg>
      <Img
        src={midia(it.imagem)}
        style={{
          position: "absolute",
          left: cx - w / 2,
          top: cy - h / 2,
          width: w,
          height: h,
          filter: `${borrao > 0.5 ? `url(#${id}) ` : ""}drop-shadow(0 6px 10px rgba(0,0,0,0.45))`,
        }}
      />
    </>
  );
};

export const RankingElegante: React.FC<RankingEleganteProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const total = p.quantidade ?? 10;
  let ini = 0;
  const inicios = p.cenas.map((c) => {
    const i = ini;
    ini += c.duracao;
    return i;
  });
  const topo = p.legendaTopo ?? 1092;
  const ctaAtivo = p.cta && t >= p.cta.inicio;
  const leg = p.legendas.find((l) => t >= l.inicio && t < l.fim);

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

      {!ctaAtivo && (
        <>
          {/* Título parado em cima até o fim (sai só na hora do CTA, junto com o ranking) */}
          {(
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 268, // centralizado na tela, logo acima do círculo 1
                textAlign: "center",
                fontFamily: bebas.fontFamily,
                fontSize: 94,
                lineHeight: 1.1,
                color: "#E8C847",
                textShadow: "0 0 18px rgba(0,0,0,0.85), 0 3px 6px rgba(0,0,0,0.7)",
                whiteSpace: "pre-wrap",
              }}
            >
              {p.titulo}
            </div>
          )}

          {/* Círculos com os números, fixos do lado esquerdo */}
          {Array.from({ length: total }, (_, k) => k + 1).map((n) => (
            <div
              key={n}
              style={{
                position: "absolute",
                left: CIRCULO_X - CIRCULO_D / 2,
                top: circuloY(n, total) - CIRCULO_D / 2,
                width: CIRCULO_D,
                height: CIRCULO_D,
                borderRadius: "50%",
                boxSizing: "border-box",
                border: "3px dashed rgba(255,255,255,0.9)",
                background: "radial-gradient(circle at 40% 35%, rgba(150,150,155,0.9), rgba(105,105,110,0.9))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: montserrat.fontFamily,
                fontWeight: 900,
                fontSize: n >= 10 ? 56 : 70,
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {n}
            </div>
          ))}

          {/* Produtos */}
          {p.itens.map((it, i) => (
            <Item key={i} it={it} total={total} topoY={p.produtoTopo ?? topo + 80} id={`borrao-${i}`} />
          ))}
        </>
      )}

      {/* CTA: logo abaixo do queixo, colado em cima da legenda; parado até o fim */}
      {ctaAtivo && (
        <div style={{ position: "absolute", left: LEG_X - 500, width: 1000, bottom: 1920 - topo + 6, display: "flex", justifyContent: "center" }}>
          <div style={{ backgroundColor: "#7D1D2F", color: "white", fontFamily: montserrat.fontFamily, fontWeight: 900, fontSize: 52, padding: "10px 30px", borderRadius: 14 }}>
            {p.cta!.texto}
          </div>
        </div>
      )}

      {/* Legenda: uma palavra por vez, parada sempre no mesmo lugar */}
      {leg && (
        <div
          style={{
            position: "absolute",
            top: topo,
            left: LEG_X - 500,
            width: 1000,
            textAlign: "center",
            fontFamily: montserrat.fontFamily,
            fontWeight: 900,
            fontSize: 60,
            lineHeight: 1,
            color: "white",
            textShadow: "0 2px 8px rgba(0,0,0,0.45)",
            whiteSpace: "nowrap",
          }}
        >
          {leg.texto}
        </div>
      )}
    </AbsoluteFill>
  );
};
