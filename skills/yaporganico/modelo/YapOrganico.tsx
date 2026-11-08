// Formato "YAP orgânico" da Lívia Brasil (comando /yaporganico).
// Igual à referência: a pessoa fala para a câmera em tela cheia, só com cortes secos (zoom alternando 1.0 e 1.15 a cada corte),
// sem música, sem efeitos sonoros, sem animação nos textos.
//  - Gancho: a primeira frase escrita inteira em até 3 linhas, no lugar da legenda, do primeiro quadro até a frase acabar.
//  - Legenda: 1 a 4 palavras por vez, com letra maiúscula no começo da frase e a pontuação da fala,
//    branca, Figtree bold 60 px (a fonte reta "Classic" da referência), sombra suave, parada sempre no mesmo lugar, abaixo do queixo.
//  - CTA (regra fixa do plugin): caixa marsala, "Comenta: PALAVRA", logo abaixo do queixo e colada em cima da legenda.
// Medidas tiradas do vídeo de referência (720x1280) e convertidas para 1080x1920.
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { z } from "zod";

const figtree = loadFigtree("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

const FPS = 30;
const TAMANHO = 60; // letra da legenda e do gancho
const ENTRELINHA = 0.95; // linhas bem juntas, como na referência
const LARGURA = 900; // dentro das bordas do Reels
const CTA_ESPACO = 6; // CTA colado em cima da legenda

const cenaSchema = z.object({
  duracao: z.number(),
  apresentadoraInicio: z.number().optional(),
  zoom: z.number().optional(), // 1 e 1.15 alternando a cada corte
});

export const yapOrganicoSchema = z.object({
  apresentadora: z.object({ arquivo: z.string() }),
  cenas: z.array(cenaSchema),
  gancho: z.object({ texto: z.string(), fim: z.number() }).optional(), // "\n" quebra linha; aparece desde o primeiro quadro
  legendas: z.array(z.object({ texto: z.string(), inicio: z.number(), fim: z.number() })),
  cta: z.object({ texto: z.string(), inicio: z.number() }).optional(),
  legendaTopo: z.number().optional(), // altura (px) do topo da legenda, FIXA. Padrão 1124 (referência). Fica pelo menos 140 px abaixo do queixo mais baixo (já com zoom).
});

export type YapOrganicoProps = z.infer<typeof yapOrganicoSchema>;

export const calcularDuracao: CalculateMetadataFunction<YapOrganicoProps> = ({ props }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.cenas.reduce((s, c) => s + c.duracao, 0) * FPS),
});

const estiloTexto: React.CSSProperties = {
  fontFamily: figtree.fontFamily,
  fontWeight: 700,
  fontSize: TAMANHO,
  lineHeight: ENTRELINHA,
  color: "white",
  textAlign: "center",
  whiteSpace: "pre-wrap",
  textShadow: "0 2px 6px rgba(0,0,0,0.45), 0 0 2px rgba(0,0,0,0.4)",
};

export const YapOrganico: React.FC<YapOrganicoProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let ini = 0;
  const inicios = p.cenas.map((c) => {
    const i = ini;
    ini += c.duracao;
    return i;
  });
  const topo = p.legendaTopo ?? 1124;
  const noGancho = p.gancho && t < p.gancho.fim;
  const leg = noGancho ? undefined : p.legendas.find((l) => t >= l.inicio && t < l.fim);
  const ctaAtivo = p.cta && t >= p.cta.inicio;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {p.cenas.map((c, i) => (
        <Sequence key={i} from={Math.round(inicios[i] * FPS)} durationInFrames={Math.round(c.duracao * FPS)}>
          <AbsoluteFill style={{ overflow: "hidden" }}>
            <OffthreadVideo
              src={midia(p.apresentadora.arquivo)}
              startFrom={Math.round((c.apresentadoraInicio ?? inicios[i]) * FPS)}
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${c.zoom ?? 1})`, transformOrigin: "50% 30%" }}
            />
          </AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={midia(p.apresentadora.arquivo)} />

      {/* CTA: logo abaixo do queixo, colado em cima da legenda; parado até o fim */}
      {ctaAtivo && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 1920 - topo + CTA_ESPACO, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              backgroundColor: "#7D1D2F",
              color: "white",
              fontFamily: figtree.fontFamily,
              fontWeight: 700,
              fontSize: 56,
              padding: "10px 30px",
              borderRadius: 14,
            }}
          >
            {p.cta!.texto}
          </div>
        </div>
      )}

      {/* Gancho ou legenda: sempre começando na mesma altura, sem animação */}
      {(noGancho || leg) && (
        <div style={{ position: "absolute", left: (1080 - LARGURA) / 2, width: LARGURA, top: topo, display: "flex", justifyContent: "center" }}>
          <div style={estiloTexto}>{noGancho ? p.gancho!.texto : leg!.texto}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
