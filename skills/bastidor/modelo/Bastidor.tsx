// Formato "Bastidor" da Lívia Brasil (comando /bastidor).
// Igual à referência: bastidor de um serviço feito só de takes curtos (corte seco a cada ~1 s), com a narração da
// pessoa por cima; o som dos takes fica mudo. Medidas tiradas da referência (1080x1920).
//  - Gancho: palavras grandes, uma por vez, Montserrat ExtraBold branca com sombra escura deslocada, no meio da tela.
//    A primeira palavra sobe de baixo para cima se revelando; as outras trocam seco no mesmo lugar.
//  - Destaque do valor: linha pequena em cima ("um cílios de") e o valor grande embaixo ("R$ 600,00"), alinhados à
//    esquerda. Uma moeda dourada girando passa da esquerda para a direita revelando o valor. Fica parado alguns segundos.
//  - Legenda: uma palavra por vez, pequena, Montserrat Bold itálica branca levemente transparente, no mesmo lugar.
//  - Final: tomadas do resultado sem legenda, com a música do fim (sfx/trilha-bastidor.wav, tirada da referência).
//    Sem efeitos sonoros.
//  - CTA (regra da Lívia): caixa marsala "Comenta: PALAVRA" colada em cima da legenda, parada até o fim.
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { z } from "zod";

const fonte = loadMontserrat("normal", { weights: ["700", "800"], subsets: ["latin", "latin-ext"] }).fontFamily;
loadMontserrat("italic", { weights: ["700"], subsets: ["latin", "latin-ext"] });
const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

const FPS = 30;
const MARSALA = "#7D1D2F";
const SOMBRA = "5px 8px 10px rgba(0,0,0,0.7), 2px 3px 3px rgba(0,0,0,0.35)";
const TRILHA = "sfx/trilha-bastidor.wav";

export const bastidorSchema = z.object({
  narracao: z.object({ arquivo: z.string(), inicio: z.number().optional() }),
  takes: z.array(z.object({ arquivo: z.string(), duracao: z.number(), inicio: z.number().optional() })),
  gancho: z.array(z.object({ texto: z.string(), inicio: z.number(), fim: z.number() })), // palavras grandes do começo
  valor: z.object({ linha1: z.string(), linha2: z.string(), inicio: z.number(), fim: z.number(), moeda: z.boolean().optional() }).optional(),
  legendas: z.array(z.object({ texto: z.string(), inicio: z.number(), fim: z.number() })), // uma palavra por vez
  legendaCentro: z.number().optional(), // padrão 1230 (igual à referência)
  trilha: z.object({ inicio: z.number(), fim: z.number(), volume: z.number().optional() }).optional(), // música do final
  cta: z.object({ texto: z.string(), inicio: z.number() }).optional(),
});
export type BastidorProps = z.infer<typeof bastidorSchema>;

export const calcularDuracaoBastidor: CalculateMetadataFunction<BastidorProps> = ({ props }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.takes.reduce((s, c) => s + c.duracao, 0) * FPS),
});

// moeda dourada genérica (desenhada)
const Moeda: React.FC<{ giro: number }> = ({ giro }) => (
  <svg width={210} height={210} viewBox="0 0 100 100" style={{ transform: `rotate(${giro}deg)` }}>
    <defs>
      <radialGradient id="ouro" cx="38%" cy="32%" r="75%">
        <stop offset="0%" stopColor="#FFF6A8" />
        <stop offset="45%" stopColor="#F2C929" />
        <stop offset="100%" stopColor="#B8860B" />
      </radialGradient>
    </defs>
    <circle cx={50} cy={50} r={48} fill="#C9971A" />
    <circle cx={50} cy={50} r={48} fill="none" stroke="#E8B923" strokeWidth={3} strokeDasharray="2 2.2" />
    <circle cx={50} cy={50} r={41} fill="url(#ouro)" stroke="#A97A0E" strokeWidth={1.5} />
    <circle cx={50} cy={50} r={33} fill="none" stroke="#C99A1C" strokeWidth={1.2} />
    <text x={50} y={64} textAnchor="middle" fontFamily={fonte} fontWeight={800} fontSize={40} fill="#B07F0C">$</text>
  </svg>
);

const Valor: React.FC<{ f: number; linha1: string; linha2: string; moeda: boolean }> = ({ f, linha1, linha2, moeda }) => {
  // moeda passa da esquerda (x 105) para a direita (x 1000) em ~5 quadros, revelando o valor
  const cx = moeda ? interpolate(f, [0, 1, 2, 3, 4], [105, 420, 585, 915, 1150], { extrapolateRight: "clamp" }) : 2000;
  const revela = moeda ? Math.max(0, cx - 120) : 2000;
  return (
    <>
      <div style={{ position: "absolute", left: 112, top: 1020, fontFamily: fonte, fontWeight: 800, color: "white", textShadow: SOMBRA, whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 56, lineHeight: "70px", letterSpacing: -1 }}>{linha1}</div>
        <div style={{ fontSize: 165, lineHeight: "150px", marginTop: 15, letterSpacing: -2, clipPath: `inset(-40px calc(100% - ${revela}px) -40px -40px)` }}>{linha2}</div>
      </div>
      {moeda && f < 4 && (
        <div style={{ position: "absolute", left: cx - 105, top: 1160 - 105 }}>
          <Moeda giro={f * 35} />
        </div>
      )}
    </>
  );
};

const Gancho: React.FC<{ texto: string; f: number; entra: boolean }> = ({ texto, f, entra }) => {
  const sobe = entra ? interpolate(f, [0, 7], [150, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 0;
  const corte = entra ? interpolate(f, [0, 3], [80, 0], { extrapolateRight: "clamp" }) : 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1103, transform: `translateY(calc(-50% + ${sobe}px))`, textAlign: "center" }}>
      <span style={{ display: "inline-block", fontFamily: fonte, fontWeight: 800, fontSize: 150, lineHeight: 1.1, letterSpacing: -3, color: "white", textShadow: SOMBRA, clipPath: `inset(-40px -40px ${corte}% -40px)` }}>{texto}</span>
    </div>
  );
};

export const Bastidor: React.FC<BastidorProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let acc = 0;
  const inicios = p.takes.map((c) => {
    const i = acc;
    acc += c.duracao;
    return i;
  });
  const centro = p.legendaCentro ?? 1230;
  const gi = p.gancho.findIndex((g) => t >= g.inicio && t < g.fim);
  const leg = p.legendas.find((l) => t >= l.inicio && t < l.fim);
  const ctaAtivo = !!p.cta && t >= p.cta.inicio;
  const v = p.valor;
  const valorAtivo = !!v && t >= v.inicio && t < v.fim;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {p.takes.map((c, i) => (
        <Sequence key={i} from={Math.round(inicios[i] * FPS)} durationInFrames={Math.round(c.duracao * FPS)}>
          <OffthreadVideo src={midia(c.arquivo)} startFrom={Math.round((c.inicio ?? 0) * FPS)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
      ))}

      <Audio src={midia(p.narracao.arquivo)} startFrom={Math.round((p.narracao.inicio ?? 0) * FPS)} />
      {p.trilha && (
        <Sequence from={Math.round(p.trilha.inicio * FPS)} durationInFrames={Math.round((p.trilha.fim - p.trilha.inicio) * FPS)}>
          <Audio src={staticFile(TRILHA)} volume={p.trilha.volume ?? 1} />
        </Sequence>
      )}

      {gi >= 0 && <Gancho texto={p.gancho[gi].texto} f={frame - Math.round(p.gancho[0].inicio * FPS)} entra={gi === 0} />}
      {valorAtivo && <Valor f={frame - Math.round(v!.inicio * FPS)} linha1={v!.linha1} linha2={v!.linha2} moeda={v!.moeda ?? true} />}

      {/* legenda palavra por palavra, com o CTA colado em cima */}
      {(leg || ctaAtivo) && (
        <div style={{ position: "absolute", left: 140, width: 800, top: centro, transform: "translateY(-50%)", display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", textAlign: "center" }}>
            {ctaAtivo && (
              <div style={{ position: "absolute", left: "50%", bottom: "100%", marginBottom: 6, transform: "translateX(-50%)", whiteSpace: "nowrap", backgroundColor: MARSALA, color: "white", fontFamily: fonte, fontWeight: 700, fontSize: 52, padding: "8px 28px", borderRadius: 14 }}>
                {p.cta!.texto}
              </div>
            )}
            <div style={{ fontFamily: fonte, fontWeight: 700, fontStyle: "italic", fontSize: 64, lineHeight: "80px", color: "rgba(255,255,255,0.9)", whiteSpace: "nowrap", minHeight: 80 }}>{leg ? leg.texto : " "}</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
