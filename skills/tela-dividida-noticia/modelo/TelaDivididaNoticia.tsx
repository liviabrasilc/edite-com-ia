// Formato "Tela dividida notícia" (estilo Twitter / fofoca / notícia).
// Parte 1: notícia em cima, card estilo Twitter no meio, reação embaixo (som da notícia).
// Parte 2: corte seco para a pessoa comentando em tela cheia, com legenda por frase.
// Medidas tiradas do vídeo de referência (720x1280) e convertidas para 1080x1920.
import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { z } from "zod";

const montserrat = loadMontserrat("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
const inter = loadInter("normal", { weights: ["400", "700", "800"], subsets: ["latin", "latin-ext"] });

const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

export const telaDivididaSchema = z.object({
  noticia: z.object({
    arquivo: z.string(), // vídeo da notícia (fica em cima, com o som)
    inicio: z.number(), // segundos
    fim: z.number(),
    enquadramento: z.string().default("50% 50%"), // object-position
  }),
  reacao: z.object({
    arquivo: z.string(), // vídeo da pessoa reagindo (fica embaixo, sem som)
    inicio: z.number(),
    enquadramento: z.string().default("50% 30%"),
  }),
  comentario: z.object({
    arquivo: z.string(), // vídeo da pessoa comentando, já tratado pelo /imparavel
    duracao: z.number(), // segundos
    enquadramento: z.string().default("50% 50%"),
  }),
  card: z.object({
    nome: z.string(),
    usuario: z.string(), // sem @
    foto: z.string(),
    verificado: z.boolean().default(true),
    manchete: z.string(),
  }),
  legendas: z.array(z.object({ texto: z.string(), inicio: z.number(), fim: z.number() })), // tempos da parte 2
  // CTA fixo (só se a pessoa falar um CTA). Aparece quando ela começa a falar o CTA e fica parado até o fim.
  cta: z
    .object({
      texto: z.string(), // ex.: "Comenta: BLACK", "Me siga para mais", "Curte, comenta e salva"
      inicio: z.number(), // segundos dentro da parte 2
      centroY: z.number().default(1190), // abaixo do queixo; a legenda continua embaixo, em 1382
    })
    .optional(),
});

export type TelaDivididaProps = z.infer<typeof telaDivididaSchema>;

// Layout (1080x1920)
const TOPO_ALTURA = 752; // notícia: 0 → 752
const CARD_ALTURA = 370; // card: 752 → 1122
const BASE_TOPO = TOPO_ALTURA + CARD_ALTURA; // reação: 1122 → 1920

export const calcularDuracao: CalculateMetadataFunction<TelaDivididaProps> = ({ props }) => {
  const fps = 30;
  const p1 = props.noticia.fim - props.noticia.inicio;
  return { fps, durationInFrames: Math.round((p1 + props.comentario.duracao) * fps) };
};

const SeloVerificado: React.FC = () => (
  <svg width={34} height={34} viewBox="0 0 22 22" style={{ marginLeft: 6 }}>
    <path
      fill="#1D9BF0"
      d="M20.4 11c0-1.3-.8-2.5-2-3 .4-1.2.1-2.6-.8-3.5-.9-.9-2.3-1.2-3.5-.8-.5-1.2-1.7-2-3-2s-2.5.8-3 2c-1.2-.4-2.6-.1-3.5.8-.9.9-1.2 2.3-.8 3.5-1.2.5-2 1.7-2 3s.8 2.5 2 3c-.4 1.2-.1 2.6.8 3.5.9.9 2.3 1.2 3.5.8.5 1.2 1.7 2 3 2s2.5-.8 3-2c1.2.4 2.6.1 3.5-.8.9-.9 1.2-2.3.8-3.5 1.2-.5 2-1.7 2-3z"
    />
    <path fill="#fff" d="M9.6 14.6 6.4 11.4l1.4-1.4 1.8 1.8 4.6-4.6 1.4 1.4z" />
  </svg>
);

const CardTwitter: React.FC<{ card: TelaDivididaProps["card"] }> = ({ card }) => (
  <div
    style={{
      position: "absolute",
      top: TOPO_ALTURA,
      left: 0,
      width: 1080,
      height: CARD_ALTURA,
      background: "#F9F8FB",
      fontFamily: inter.fontFamily,
      color: "#0F1419",
      padding: "20px 100px 0 135px",
      boxSizing: "border-box",
    }}
  >
    <div style={{ display: "flex", alignItems: "center" }}>
      <Img
        src={midia(card.foto)}
        style={{ width: 124, height: 124, borderRadius: "50%", objectFit: "cover", marginRight: 22 }}
      />
      <div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 41, fontWeight: 700, lineHeight: 1.1 }}>
          {card.nome}
          {card.verificado ? <SeloVerificado /> : null}
        </div>
        <div style={{ fontSize: 27, fontWeight: 400, color: "#536471", marginTop: 4 }}>@{card.usuario}</div>
      </div>
    </div>
    <div style={{ marginTop: 18, fontSize: 49, fontWeight: 800, lineHeight: 1.16, letterSpacing: -0.2 }}>
      {card.manchete}
    </div>
  </div>
);

const CtaFixo: React.FC<{ cta: NonNullable<TelaDivididaProps["cta"]> }> = ({ cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame / fps < cta.inicio) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: cta.centroY,
        transform: "translateY(-50%)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#7D1D2F",
          color: "#FFFFFF",
          fontFamily: montserrat.fontFamily,
          fontWeight: 700,
          fontSize: 52,
          lineHeight: 1.1,
          padding: "16px 34px",
          borderRadius: 14,
          maxWidth: 860,
          textAlign: "center",
        }}
      >
        {cta.texto}
      </div>
    </div>
  );
};

// Altura da caixa do CTA: fonte 52 x 1.1 + 16 + 16 de respiro interno.
const CTA_METADE_ALTURA = 45;
const CTA_ESPACO_ATE_LEGENDA = 6; // legenda praticamente colada embaixo do CTA

const Legenda: React.FC<{ legendas: TelaDivididaProps["legendas"]; cta?: TelaDivididaProps["cta"] }> = ({
  legendas,
  cta,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const atual = legendas.find((l) => t >= l.inicio && t < l.fim);
  if (!atual) return null;
  // Com o CTA na tela, a legenda sobe e fica colada logo abaixo da caixa.
  const comCta = cta && t >= cta.inicio;
  const posicao: React.CSSProperties = comCta
    ? { top: cta.centroY + CTA_METADE_ALTURA + CTA_ESPACO_ATE_LEGENDA }
    : { top: 1382, transform: "translateY(-50%)" };
  return (
    <div
      style={{
        position: "absolute",
        left: 170,
        right: 170,
        ...posicao,
        textAlign: "center",
        fontFamily: montserrat.fontFamily,
        fontWeight: 700,
        fontSize: 60,
        lineHeight: 1.05,
        color: "#FFFFFF",
        textShadow: "0 2px 6px rgba(0,0,0,0.45), 0 0 2px rgba(0,0,0,0.35)",
      }}
    >
      {atual.texto}
    </div>
  );
};

export const TelaDivididaNoticia: React.FC<TelaDivididaProps> = (props) => {
  const { fps } = useVideoConfig();
  const p1 = Math.round((props.noticia.fim - props.noticia.inicio) * fps);
  const cobrir = (pos: string): React.CSSProperties => ({
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: pos,
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence durationInFrames={p1} name="Parte 1: notícia + card + reação">
        <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: TOPO_ALTURA, overflow: "hidden" }}>
          <OffthreadVideo
            src={midia(props.noticia.arquivo)}
            startFrom={Math.round(props.noticia.inicio * fps)}
            style={cobrir(props.noticia.enquadramento)}
          />
        </div>
        <div
          style={{ position: "absolute", top: BASE_TOPO, left: 0, width: 1080, height: 1920 - BASE_TOPO, overflow: "hidden" }}
        >
          <OffthreadVideo
            src={midia(props.reacao.arquivo)}
            startFrom={Math.round(props.reacao.inicio * fps)}
            muted
            style={cobrir(props.reacao.enquadramento)}
          />
        </div>
        <CardTwitter card={props.card} />
      </Sequence>
      <Sequence from={p1} name="Parte 2: comentário com legenda">
        <OffthreadVideo src={midia(props.comentario.arquivo)} style={cobrir(props.comentario.enquadramento)} />
        {props.cta ? <CtaFixo cta={props.cta} /> : null}
        <Legenda legendas={props.legendas} cta={props.cta} />
      </Sequence>
    </AbsoluteFill>
  );
};
