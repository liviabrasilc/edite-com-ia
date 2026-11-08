// Formato "Isso ou aquilo chic" da Lívia Brasil (comando /issoouaquilochic).
// Igual à referência: a pessoa fala para a câmera em tela cheia, sem música e sem legenda.
//  - Título de 2 linhas no topo, Bebas Neue inclinada (itálico), branca com sombra, com emoji no fim de cada linha
//    (ex.: "VALE A PENA ✅" / "NÃO VALE ❌"). Fica parado o vídeo inteiro.
//  - Para cada item: um cartão branco (514 x 322 px) com a imagem do item sobe de baixo para o peito com fade (9 quadros);
//    quando a pessoa dá o veredito, aparece em cima do cartão a etiqueta (Bebas Neue inclinada rosa-claro com emoji),
//    subindo um pouquinho com fade (2 quadros) e com o "clique-clique" da referência (sfx/clique-chic.wav).
//    A etiqueta some com fade e o cartão desce rápido com fade (3 quadros) antes do próximo item.
//  - CTA (regra da Lívia): caixa marsala "Comenta: PALAVRA" logo abaixo do queixo; o cartão e a etiqueta saem antes.
// Medidas tiradas do vídeo de referência (1080x1920).
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { z } from "zod";

const bebas = loadBebas("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
const figtree = loadFigtree("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

const FPS = 30;
const CARTAO = { l: 514, a: 322 }; // cartão branco
const INCLINA = "skewX(-10deg)"; // itálico da referência
const SOMBRA = "0 3px 10px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.45)";
const ROSA = "#F7D2E6"; // cor da etiqueta
const CLIQUE = "sfx/clique-chic.wav";
const CLIQUE_VOLUME = 0.6;

const itemSchema = z.object({
  imagem: z.string(), // logo ou foto do item (fica centralizada dentro do cartão branco)
  etiqueta: z.string(), // ex.: "VALE A PENA ✅"
  entra: z.number(), // quando a pessoa começa a falar do item (o cartão sobe)
  veredito: z.number(), // quando ela dá o veredito (a etiqueta aparece)
  sai: z.number(), // quando o cartão sai (um pouco antes do próximo item)
});

export const issoOuAquiloChicSchema = z.object({
  apresentadora: z.object({ arquivo: z.string() }),
  cenas: z.array(z.object({ duracao: z.number(), apresentadoraInicio: z.number().optional() })),
  titulo: z.array(z.string()), // 2 linhas, ex.: ["VALE A PENA ✅", "NÃO VALE ❌"]
  itens: z.array(itemSchema),
  cartaoTopo: z.number().optional(), // topo do cartão (px), logo abaixo do queixo. Padrão 1132 (igual à referência)
  ctaTopo: z.number().optional(), // topo da caixa do CTA (px), logo abaixo do queixo
  cta: z.object({ texto: z.string(), inicio: z.number() }).optional(),
});

export type IssoOuAquiloChicProps = z.infer<typeof issoOuAquiloChicSchema>;

export const calcularDuracao: CalculateMetadataFunction<IssoOuAquiloChicProps> = ({ props }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.cenas.reduce((s, c) => s + c.duracao, 0) * FPS),
});

const texto = (tamanho: number, cor: string): React.CSSProperties => ({
  fontFamily: bebas.fontFamily,
  fontSize: tamanho,
  lineHeight: 1,
  color: cor,
  textShadow: SOMBRA,
  whiteSpace: "nowrap",
  display: "inline-block",
  transform: INCLINA,
});

const Item: React.FC<{ item: z.infer<typeof itemSchema>; topo: number; fim: number }> = ({ item, topo, fim }) => {
  const f = useCurrentFrame();
  const fe = Math.round(item.entra * FPS);
  const fv = Math.round(item.veredito * FPS);
  const fs = Math.min(Math.round(item.sai * FPS), fim);
  if (f < fe || f >= fs) return null;
  // cartão: sobe 250 px com fade (9 quadros); sai descendo 170 px com fade (3 quadros)
  const entrada = interpolate(f, [fe, fe + 9], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const saida = interpolate(f, [fs - 3, fs], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const y = (1 - entrada) * 250 + saida * 170;
  const op = Math.min(entrada, 1 - saida);
  // etiqueta: sobe 25 px com fade (2 quadros); some com fade (2 quadros) junto com a saída do cartão
  const fsEt = fs - 3;
  const etOp = f < fv ? 0 : Math.min(interpolate(f, [fv, fv + 2], [0, 1], { extrapolateRight: "clamp" }), interpolate(f, [fsEt - 2, fsEt], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const etY = interpolate(f, [fv, fv + 2], [25, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: (1080 - CARTAO.l) / 2,
          top: topo + y,
          width: CARTAO.l,
          height: CARTAO.a,
          backgroundColor: "white",
          opacity: op,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img src={midia(item.imagem)} style={{ maxWidth: CARTAO.l - 70, maxHeight: CARTAO.a - 50, objectFit: "contain" }} />
      </div>
      {etOp > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: topo - 115 + etY, textAlign: "center", opacity: etOp }}>
          <span style={texto(100, ROSA)}>{item.etiqueta}</span>
        </div>
      )}
    </>
  );
};

export const IssoOuAquiloChic: React.FC<IssoOuAquiloChicProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let ini = 0;
  const inicios = p.cenas.map((c) => {
    const i = ini;
    ini += c.duracao;
    return i;
  });
  const total = Math.round(ini * FPS);
  const topo = p.cartaoTopo ?? 1132;
  const ctaAtivo = !!p.cta && t >= p.cta.inicio;
  const fimItens = p.cta ? Math.round(p.cta.inicio * FPS) : total; // cartão e etiqueta saem antes do CTA

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

      {/* Título: 2 linhas no topo, parado o vídeo inteiro */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 218, textAlign: "center" }}>
        {p.titulo.slice(0, 2).map((linha, i) => (
          <div key={i} style={{ marginTop: i ? -6 : 0 }}>
            <span style={texto(96, "white")}>{linha}</span>
          </div>
        ))}
      </div>

      {p.itens.map((item, i) => (
        <Item key={i} item={item} topo={topo} fim={fimItens} />
      ))}

      {/* "clique-clique" da referência quando a etiqueta aparece */}
      {p.itens
        .filter((item) => Math.round(item.veredito * FPS) < Math.min(Math.round(item.sai * FPS), fimItens))
        .map((item, i) => (
          <Sequence key={`clique-${i}`} from={Math.round(item.veredito * FPS)} durationInFrames={8}>
            <Audio src={staticFile(CLIQUE)} volume={CLIQUE_VOLUME} />
          </Sequence>
        ))}

      {/* CTA: logo abaixo do queixo, parado até o fim */}
      {ctaAtivo && (
        <div style={{ position: "absolute", left: 0, right: 0, top: p.ctaTopo ?? topo, display: "flex", justifyContent: "center" }}>
          <div style={{ backgroundColor: "#7D1D2F", color: "white", fontFamily: figtree.fontFamily, fontWeight: 700, fontSize: 56, padding: "10px 30px", borderRadius: 14 }}>
            {p.cta!.texto}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
