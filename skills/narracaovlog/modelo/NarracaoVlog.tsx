// Formato "Narração vlog" da Lívia Brasil (comando /narracaovlog).
// Igual à referência: vlog feito só de takes curtos (cortes secos a cada ~1 a 2 s), com a narração da pessoa por cima.
// Sem música e sem efeitos sonoros; o som dos takes fica mudo, só a narração toca.
//  - Legenda: uma frase por vez (3 a 10 palavras), em minúsculas, Montserrat Bold amarelo-limão (#EEFC0C) com contorno
//    preto, letras bem juntas, até 3 linhas, centralizada um pouco abaixo do meio da tela, sem animação (troca seca).
//    A primeira frase (o gancho) pode terminar com um emoji, como na referência.
//  - CTA (regra da Lívia): caixa BRANCA com texto PRETO (pedido da Lívia neste formato) "Comenta: PALAVRA" colada em cima da legenda, parada até o fim.
// Medidas tiradas do vídeo de referência (720x1280, convertidas para 1080x1920).
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { z } from "zod";

const montserrat = loadMontserrat("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

const FPS = 30;
const AMARELO = "#EEFC0C";
const LARGURA = 800; // largura máxima da legenda

export const narracaoVlogSchema = z.object({
  narracao: z.object({ arquivo: z.string(), inicio: z.number().optional() }), // áudio (ou vídeo) com a narração
  takes: z.array(z.object({ arquivo: z.string(), duracao: z.number(), inicio: z.number().optional() })), // em ordem; inicio = segundo do take onde começa
  legendas: z.array(z.object({ texto: z.string(), inicio: z.number(), fim: z.number() })),
  legendaCentro: z.number().optional(), // centro vertical da legenda (px). Padrão 1278 (igual à referência)
  cta: z.object({ texto: z.string(), inicio: z.number() }).optional(),
});

export type NarracaoVlogProps = z.infer<typeof narracaoVlogSchema>;

export const calcularDuracao: CalculateMetadataFunction<NarracaoVlogProps> = ({ props }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.takes.reduce((s, c) => s + c.duracao, 0) * FPS),
});

export const NarracaoVlog: React.FC<NarracaoVlogProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let ini = 0;
  const inicios = p.takes.map((c) => {
    const i = ini;
    ini += c.duracao;
    return i;
  });
  const centro = p.legendaCentro ?? 1278;
  const leg = p.legendas.find((l) => t >= l.inicio && t < l.fim);
  const ctaAtivo = !!p.cta && t >= p.cta.inicio;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* Takes com corte seco, sem som */}
      {p.takes.map((c, i) => (
        <Sequence key={i} from={Math.round(inicios[i] * FPS)} durationInFrames={Math.round(c.duracao * FPS)}>
          <OffthreadVideo src={midia(c.arquivo)} startFrom={Math.round((c.inicio ?? 0) * FPS)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
      ))}

      {/* Narração */}
      <Audio src={midia(p.narracao.arquivo)} startFrom={Math.round((p.narracao.inicio ?? 0) * FPS)} />

      {/* Legenda (centralizada no mesmo ponto) com o CTA colado em cima */}
      {(leg || ctaAtivo) && (
        <div style={{ position: "absolute", left: (1080 - LARGURA) / 2, width: LARGURA, top: centro, transform: "translateY(-50%)", display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", textAlign: "center" }}>
            {ctaAtivo && (
              <div style={{ position: "absolute", left: "50%", bottom: "100%", marginBottom: 6, transform: "translateX(-50%)", whiteSpace: "nowrap", backgroundColor: "white", color: "black", fontFamily: montserrat.fontFamily, fontWeight: 700, fontSize: 52, padding: "10px 30px", borderRadius: 14 }}>
                {p.cta!.texto}
              </div>
            )}
            {leg && (
              <div
                style={{
                  fontFamily: montserrat.fontFamily,
                  fontWeight: 700,
                  fontSize: 64,
                  lineHeight: 1,
                  letterSpacing: -2,
                  color: AMARELO,
                  WebkitTextStroke: "7px black",
                  paintOrder: "stroke fill",
                  whiteSpace: "pre-wrap",
                  textWrap: "balance",
                }}
              >
                {leg.texto}
              </div>
            )}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
