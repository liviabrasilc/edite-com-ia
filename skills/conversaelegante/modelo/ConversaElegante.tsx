// Formato "Conversa elegante" da Lívia Brasil (comando /conversaelegante).
// Igual à referência: conversa encenada (a pessoa faz os dois papéis, com roupas/ângulos diferentes), takes com corte
// seco e o som de cada take. Sem música. Medidas tiradas da referência (1080x1920).
//  - Título no alto em caixa escura translúcida, Bebas Neue creme, só na primeira troca de falas (some seco num corte).
//  - Legenda por frase, Roboto Condensed branca com sombra suave, centralizada, sempre no mesmo lugar.
//  - "Salvar e seguir" (só quando alguém fala que está salvando/seguindo): o ícone de salvar é desenhado a traço,
//    aparece o botão cinza "Seguir", o ícone fica preenchido e o botão vira branco "Seguindo ⌄", com os toques
//    agudos bem baixinhos da referência (sfx/seguir-elegante.wav).
//  - CTA (regra da Lívia): caixa marsala "Comenta: PALAVRA" colada em cima da legenda, parada até o fim.
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadRobotoC } from "@remotion/google-fonts/RobotoCondensed";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { z } from "zod";

const bebas = loadBebas("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] }).fontFamily;
const condensada = loadRobotoC("normal", { weights: ["400", "700"], subsets: ["latin", "latin-ext"] }).fontFamily;
const inter = loadInter("normal", { weights: ["600"], subsets: ["latin", "latin-ext"] }).fontFamily;
const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

const FPS = 30;
const CREME = "#F8E1BD";
const MARSALA = "#7D1D2F";
const SEGUIR_SOM = "sfx/seguir-elegante.wav";

export const conversaEleganteSchema = z.object({
  takes: z.array(z.object({ arquivo: z.string(), inicio: z.number().optional(), duracao: z.number() })),
  titulo: z.object({ texto: z.string(), fim: z.number() }),
  legendas: z.array(z.object({ texto: z.string(), inicio: z.number(), fim: z.number() })),
  legendaTopo: z.number().optional(), // padrão 1220 (~1 cm abaixo do queixo)
  salvarSeguir: z.object({ inicio: z.number(), fim: z.number(), seguir: z.string().optional(), seguindo: z.string().optional() }).optional(),
  cta: z.object({ texto: z.string(), inicio: z.number() }).optional(),
});
export type ConversaEleganteProps = z.infer<typeof conversaEleganteSchema>;

export const calcularDuracaoElegante: CalculateMetadataFunction<ConversaEleganteProps> = ({ props }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.takes.reduce((s, c) => s + c.duracao, 0) * FPS),
});

// ícone de salvar (marcador) desenhado a traço; comprimento do caminho ~ 400
const MARCADOR = "M 48 4 L 6 4 L 6 106 L 48 72 L 90 106 L 90 4 Z";

const SalvarSeguir: React.FC<{ f: number; seguir: string; seguindo: string }> = ({ f, seguir, seguindo }) => {
  const s = f / FPS;
  const traco = interpolate(s, [0, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const preenchido = s >= 1.3;
  const botaoEscala = interpolate(s, [1.0, 1.13], [0.2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const botaoOpac = interpolate(s, [1.0, 1.07], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seguindoAtivo = s >= 1.8;
  return (
    <>
      <svg style={{ position: "absolute", left: 172, top: 262 }} width={96} height={112} viewBox="0 0 96 112">
        <path d={MARCADOR} fill={preenchido ? "white" : "none"} stroke="white" strokeWidth={6} strokeLinejoin="miter" strokeDasharray={400} strokeDashoffset={400 * (1 - traco)} />
      </svg>
      {s >= 1.0 && (
        <div style={{ position: "absolute", left: 321, top: 270, width: 615, height: 90, borderRadius: 18, backgroundColor: seguindoAtivo ? "white" : "#737373", color: seguindoAtivo ? "black" : "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 600, fontSize: 46, transform: `scale(${botaoEscala})`, opacity: botaoOpac }}>
          {seguindoAtivo ? (
            <>
              {seguindo}
              <svg width={44} height={44} viewBox="0 0 24 24" style={{ marginLeft: 10 }}>
                <path d="M6 9 L12 15 L18 9" fill="none" stroke="black" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          ) : (
            seguir
          )}
        </div>
      )}
    </>
  );
};

export const ConversaElegante: React.FC<ConversaEleganteProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let acc = 0;
  const ini = p.takes.map((c) => {
    const i = Math.round(acc * FPS);
    acc += c.duracao;
    return i;
  });
  const topo = p.legendaTopo ?? 1220;
  const leg = p.legendas.find((l) => t >= l.inicio && t < l.fim);
  const ctaAtivo = !!p.cta && t >= p.cta.inicio;
  const ss = p.salvarSeguir;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {p.takes.map((c, i) => (
        <Sequence key={i} from={ini[i]} durationInFrames={Math.round(c.duracao * FPS)}>
          <OffthreadVideo src={midia(c.arquivo)} startFrom={Math.round((c.inicio ?? 0) * FPS)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
      ))}

      {/* título em caixa escura, só na primeira troca de falas */}
      {t < p.titulo.fim && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 213, display: "flex", justifyContent: "center" }}>
          <div style={{ backgroundColor: "rgba(25,15,10,0.85)", height: 176, padding: "0 46px", display: "flex", alignItems: "center", maxWidth: 920, boxSizing: "border-box" }}>
            <span style={{ fontFamily: bebas, fontSize: 96, color: CREME, whiteSpace: "nowrap", lineHeight: 1, paddingTop: 6 }}>{p.titulo.texto}</span>
          </div>
        </div>
      )}

      {/* salvar e seguir */}
      {ss && (
        <Sequence from={Math.round(ss.inicio * FPS)} durationInFrames={Math.round((ss.fim - ss.inicio) * FPS)}>
          <SalvarSeguir f={frame - Math.round(ss.inicio * FPS)} seguir={ss.seguir ?? "Seguir"} seguindo={ss.seguindo ?? "Seguindo"} />
          <Sequence from={Math.round(1.25 * FPS)} durationInFrames={Math.round(1.4 * FPS)}>
            <Audio src={staticFile(SEGUIR_SOM)} />
          </Sequence>
        </Sequence>
      )}

      {/* legenda por frase, com o CTA colado em cima */}
      {(leg || ctaAtivo) && (
        <div style={{ position: "absolute", left: 140, width: 800, top: topo }}>
          {ctaAtivo && (
            <div style={{ position: "absolute", left: "50%", bottom: "100%", marginBottom: 6, transform: "translateX(-50%)", whiteSpace: "nowrap", backgroundColor: MARSALA, color: "white", fontFamily: condensada, fontWeight: 700, fontSize: 54, padding: "6px 28px", borderRadius: 14 }}>
              {p.cta!.texto}
            </div>
          )}
          {leg && (
            <div style={{ fontFamily: condensada, fontWeight: 400, fontSize: 62, lineHeight: "60px", color: "white", textShadow: "0 2px 6px rgba(0,0,0,0.55)", textAlign: "center", whiteSpace: "pre-line" }}>{leg.texto}</div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
