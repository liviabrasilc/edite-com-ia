// Formato "Lista / ranking de 1 a 10" da Lívia Brasil (comando /lista).
// Igual à referência: a pessoa fala para a câmera em tela cheia, só com cortes secos (sem zoom), sem legenda, sem música e sem efeitos sonoros.
//  - Título fixo no topo, em 2 linhas, Montserrat ExtraBold 71 px branca com sombra escura dura (4 px), do primeiro ao último quadro.
//  - Lista fixa do lado esquerdo: "1 -" até "10 -", Montserrat ExtraBold 56 px, com a mesma sombra.
//  - Cada item (foto do produto sem fundo) entra deslizando da borda direita até a mão da pessoa (5 quadros),
//    fica parado ali enquanto ela fala dele e depois voa, diminuindo, até o lado do número da posição (18 quadros), onde fica até o fim.
//  - CTA (regra fixa do plugin): caixa marsala "Comenta: PALAVRA" logo abaixo do queixo (este formato não tem legenda).
//    Regra da Lívia: quando o CTA entra, o ranking sai da tela (título, números e produtos) e fica só o CTA até o fim.
// Medidas tiradas do vídeo de referência (1080x1920).
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { z } from "zod";

const montserrat = loadMontserrat("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] });
const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

const FPS = 30;
const SOMBRA = "4px 4px 0 rgba(30,30,30,0.85)";
const ENTRADA = 5; // quadros para o item entrar pela direita
const VOO = 18; // quadros para o item voar até a lista

const itemSchema = z.object({
  imagem: z.string(), // PNG do produto sem fundo
  proporcao: z.number(), // largura / altura da imagem
  posicao: z.number(), // 1 a 10
  entra: z.number(), // segundos: quando a pessoa mostra o produto
  voa: z.number(), // segundos: quando ela dá a nota/posição e o produto vai para a lista
  maoX: z.number().optional(), // centro do produto na mão (px). Padrão 530
  maoY: z.number().optional(), // padrão 1090
});

export const listaSchema = z.object({
  apresentadora: z.object({ arquivo: z.string() }),
  cenas: z.array(z.object({ duracao: z.number(), apresentadoraInicio: z.number().optional() })),
  titulo: z.string(), // "\n" quebra a linha (2 linhas, como na referência)
  quantidade: z.number().optional(), // padrão 10
  itens: z.array(itemSchema),
  cta: z.object({ texto: z.string(), inicio: z.number() }).optional(),
  ctaTopo: z.number().optional(), // topo da caixa do CTA (px), ~1 cm abaixo do queixo
});

export type ListaProps = z.infer<typeof listaSchema>;

export const calcularDuracao: CalculateMetadataFunction<ListaProps> = ({ props }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.cenas.reduce((s, c) => s + c.duracao, 0) * FPS),
});

// posição de cada número na tela (igual à referência: 1 em y=608, 10 em y=1675)
const numeroY = (n: number, total: number) => 608 + (n - 1) * ((1675 - 608) / Math.max(total - 1, 1));
const NUMERO_DIREITA = 278; // 1 cm (100 px) mais para dentro que a referência, para o Reels não cortar (pedido da Lívia)
const SLOT_ESQUERDA = 292;
const SLOT_L = 170;
const SLOT_A = 72;
const MAO = 340;

const caber = (prop: number, w: number, h: number) => (prop >= w / h ? { w, h: w / prop } : { w: h * prop, h });

const Item: React.FC<{ it: z.infer<typeof itemSchema>; total: number }> = ({ it, total }) => {
  const f = useCurrentFrame();
  const fe = Math.round(it.entra * FPS);
  const fv = Math.round(it.voa * FPS);
  if (f < fe) return null;
  const mao = caber(it.proporcao, MAO, MAO);
  const slot = caber(it.proporcao, SLOT_L, SLOT_A);
  const mx = it.maoX ?? 530;
  const my = it.maoY ?? 1090;
  const sx = SLOT_ESQUERDA + slot.w / 2;
  const sy = numeroY(it.posicao, total);
  let cx: number, cy: number, w: number, h: number;
  if (f < fv) {
    const p = interpolate(f, [fe, fe + ENTRADA], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    cx = interpolate(p, [0, 1], [1080 + mao.w / 2, mx]);
    cy = my;
    w = mao.w;
    h = mao.h;
  } else {
    const p = interpolate(f, [fv, fv + VOO], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
    const px = Easing.out(Easing.quad)(p); // anda para a esquerda antes de descer (curva da referência)
    const py = Easing.in(Easing.quad)(p);
    cx = interpolate(px, [0, 1], [mx, sx]);
    cy = interpolate(py, [0, 1], [my, sy]);
    w = interpolate(p, [0, 1], [mao.w, slot.w]);
    h = interpolate(p, [0, 1], [mao.h, slot.h]);
  }
  return (
    <Img
      src={midia(it.imagem)}
      style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))" }}
    />
  );
};

export const Lista: React.FC<ListaProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const total = p.quantidade ?? 10;
  let ini = 0;
  const inicios = p.cenas.map((c) => {
    const i = ini;
    ini += c.duracao;
    return i;
  });
  const ctaAtivo = p.cta && t >= p.cta.inicio;
  const texto: React.CSSProperties = { fontFamily: montserrat.fontFamily, fontWeight: 800, color: "white", textShadow: SOMBRA };

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
      {/* Título fixo no topo */}
      <div style={{ ...texto, position: "absolute", left: 40, right: 40, top: 222, fontSize: 71, lineHeight: 1.15, textAlign: "center", whiteSpace: "pre-wrap" }}>
        {p.titulo}
      </div>

      {/* Números da lista, fixos do lado esquerdo */}
      {Array.from({ length: total }, (_, k) => k + 1).map((n) => (
        <div
          key={n}
          style={{ ...texto, position: "absolute", right: 1080 - NUMERO_DIREITA, top: numeroY(n, total) - 34, fontSize: 56, lineHeight: "68px", whiteSpace: "nowrap" }}
        >
          {n} -
        </div>
      ))}

      {/* Produtos: entram na mão e voam para a posição */}
      {p.itens.map((it, i) => (
        <Item key={i} it={it} total={total} />
      ))}
      </>
      )}

      {/* CTA: logo abaixo do queixo, parado até o fim */}
      {ctaAtivo && (
        <div style={{ position: "absolute", left: 0, right: 0, top: p.ctaTopo ?? 1200, display: "flex", justifyContent: "center" }}>
          <div style={{ backgroundColor: "#7D1D2F", color: "white", fontFamily: montserrat.fontFamily, fontWeight: 800, fontSize: 52, padding: "10px 30px", borderRadius: 14 }}>
            {p.cta!.texto}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
