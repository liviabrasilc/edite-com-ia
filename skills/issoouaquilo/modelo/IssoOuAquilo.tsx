// Formato "Isso ou aquilo" da Lívia Brasil (comando /issoouaquilo).
// Igual à referência: a pessoa fala para a câmera em tela cheia, sem música, apontando
// com os dois indicadores para cima. Para cada par:
//  - a foto do problema (quadrada) entra deslizando da esquerda (6 quadros) no alto à esquerda;
//  - logo depois a foto do produto (sem fundo) entra deslizando da direita (3 quadros) no alto à direita;
//  - os dois somem de uma vez (corte seco) quando começa o próximo par, com um "pop" curto (o mesmo da referência,
//    tirado do áudio dela: sfx/pop-isso.wav), um pouco mais baixo que na referência.
//  - Cada imagem (problema e produto) entra com um "sush" curto, também tirado do áudio da referência (sfx/sush-isso.wav).
//  - Fotos um pouco mais para dentro que na referência, para respeitar as margens do Instagram.
// Pedidos da Lívia (a referência não tem): legenda igual à do /yaporganico, no mesmo lugar (Figtree Bold 60 px branca,
// 1 a 4 palavras, ~1 cm abaixo do queixo), e o nome de cada produto colado embaixo da imagem do produto.
// CTA (regra da Lívia): caixa marsala "Comenta: PALAVRA" logo abaixo do queixo, colada em cima da legenda.
// Medidas tiradas do vídeo de referência (1080x1920).
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { z } from "zod";

const figtree = loadFigtree("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

const FPS = 30;
const PROB = { x: 100, y: 228, lado: 362 }; // foto do problema (quadrada)
const PROD = { cx: 834, base: 596, l: 260, a: 416 }; // produto: centro x, base (y) e tamanho máximo
const ENTRA_PROB = 6; // quadros
const ENTRA_PROD = 3; // quadros
const TAMANHO = 60; // legenda (igual ao /yaporganico)
const LARGURA = 900;
const POP = "sfx/pop-isso.wav"; // efeito da referência quando o par some
const POP_VOLUME = 0.5;
const SUSH = "sfx/sush-isso.wav"; // efeito da referência quando cada imagem entra
const SUSH_VOLUME = 0.7;

const parSchema = z.object({
  problema: z.string(), // foto do problema (quadrada; é cortada no centro se não for)
  produto: z.string(), // foto do produto sem fundo (PNG)
  proporcao: z.number(), // largura / altura do produto
  nome: z.string(), // nome do produto, embaixo da imagem
  problemaEntra: z.number(), // quando a pessoa fala do problema
  produtoEntra: z.number(), // quando ela fala do produto
  sai: z.number(), // quando os dois somem (começo do próximo par); toca o "pop"
});

export const issoOuAquiloSchema = z.object({
  apresentadora: z.object({ arquivo: z.string() }),
  cenas: z.array(z.object({ duracao: z.number(), apresentadoraInicio: z.number().optional() })),
  pares: z.array(parSchema),
  legendas: z.array(z.object({ texto: z.string(), inicio: z.number(), fim: z.number() })),
  legendaTopo: z.number().optional(), // topo da legenda (px), ~1 cm abaixo do queixo
  cta: z.object({ texto: z.string(), inicio: z.number() }).optional(),
});

export type IssoOuAquiloProps = z.infer<typeof issoOuAquiloSchema>;

export const calcularDuracao: CalculateMetadataFunction<IssoOuAquiloProps> = ({ props }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.cenas.reduce((s, c) => s + c.duracao, 0) * FPS),
});

const caber = (prop: number, w: number, h: number) => (prop >= w / h ? { w, h: w / prop } : { w: h * prop, h });

const Par: React.FC<{ par: z.infer<typeof parSchema> }> = ({ par }) => {
  const f = useCurrentFrame();
  const fp = Math.round(par.problemaEntra * FPS);
  const fq = Math.round(par.produtoEntra * FPS);
  const fs = Math.round(par.sai * FPS);
  if (f < fp || f >= fs) return null;
  const xProb = interpolate(f, [fp, fp + ENTRA_PROB], [-PROB.lado, PROB.x], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const s = caber(par.proporcao, PROD.l, PROD.a);
  const desloc = interpolate(f, [fq, fq + ENTRA_PROD], [1080 - (PROD.cx - s.w / 2), 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <>
      <Img src={midia(par.problema)} style={{ position: "absolute", left: xProb, top: PROB.y, width: PROB.lado, height: PROB.lado, objectFit: "cover" }} />
      {f >= fq && (
        <div style={{ position: "absolute", left: PROD.cx - 170 + desloc, width: 340, top: PROD.base - s.h, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Img src={midia(par.produto)} style={{ width: s.w, height: s.h }} />
          <div
            style={{
              marginTop: 4,
              width: 320,
              fontFamily: figtree.fontFamily,
              fontWeight: 700,
              fontSize: 44,
              lineHeight: 1,
              color: "white",
              textAlign: "center",
              textShadow: "0 2px 6px rgba(0,0,0,0.55), 0 0 2px rgba(0,0,0,0.5)",
            }}
          >
            {par.nome}
          </div>
        </div>
      )}
    </>
  );
};

export const IssoOuAquilo: React.FC<IssoOuAquiloProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let ini = 0;
  const inicios = p.cenas.map((c) => {
    const i = ini;
    ini += c.duracao;
    return i;
  });
  const topo = p.legendaTopo ?? 1220;
  const leg = p.legendas.find((l) => t >= l.inicio && t < l.fim);
  const ctaAtivo = !!p.cta && t >= p.cta.inicio;

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

      {p.pares.map((par, i) => (
        <Par key={i} par={par} />
      ))}

      {/* "sush" da referência quando cada imagem entra (problema e produto) */}
      {p.pares.flatMap((par, i) =>
        [par.problemaEntra, par.produtoEntra].map((t, k) => (
          <Sequence key={`sush-${i}-${k}`} from={Math.max(0, Math.round(t * FPS) - 1)} durationInFrames={6}>
            <Audio src={staticFile(SUSH)} volume={SUSH_VOLUME} />
          </Sequence>
        )),
      )}

      {/* "pop" da referência na hora em que o par some (1 quadro antes do corte, como na referência) */}
      {p.pares
        .filter((par) => par.sai * FPS < Math.round(p.cenas.reduce((s, c) => s + c.duracao, 0) * FPS) - 1)
        .map((par, i) => (
          <Sequence key={`pop-${i}`} from={Math.max(0, Math.round(par.sai * FPS) - 1)} durationInFrames={6}>
            <Audio src={staticFile(POP)} volume={POP_VOLUME} />
          </Sequence>
        ))}

      {/* CTA: logo abaixo do queixo, colado em cima da legenda; parado até o fim */}
      {ctaAtivo && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 1920 - topo + 6, display: "flex", justifyContent: "center" }}>
          <div style={{ backgroundColor: "#7D1D2F", color: "white", fontFamily: figtree.fontFamily, fontWeight: 700, fontSize: 56, padding: "10px 30px", borderRadius: 14 }}>
            {p.cta!.texto}
          </div>
        </div>
      )}

      {/* Legenda igual à do /yaporganico: fixa, sem animação */}
      {leg && (
        <div style={{ position: "absolute", left: (1080 - LARGURA) / 2, width: LARGURA, top: topo, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              fontFamily: figtree.fontFamily,
              fontWeight: 700,
              fontSize: TAMANHO,
              lineHeight: 0.95,
              color: "white",
              textAlign: "center",
              whiteSpace: "pre-wrap",
              textShadow: "0 2px 6px rgba(0,0,0,0.45), 0 0 2px rgba(0,0,0,0.4)",
            }}
          >
            {leg.texto}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
