// Formato "Narração tutorial" da Lívia Brasil (comando /narracaotutorial).
// Igual à referência: takes curtos de demonstração (corte seco), mudos, com a narração da pessoa por cima. Sem música.
//  - @ da pessoa pequeno e meio transparente no topo, o vídeo inteiro.
//  - Título de abertura (primeira frase, ~2,5 s) em 3 linhas no alto: palavra pequena manuscrita (Sriracha),
//    palavra GRANDE arredondada (Sniglet ExtraBold) com 🚨 dos dois lados, e linha fina sublinhada (Quicksand).
//  - Gancho (segunda frase): as linhas vão aparecendo uma a uma conforme a fala, empilhadas no alto, cada uma com um
//    "pop" rápido (cresce 20% e volta em 8 quadros): manuscrita com ✨, GRANDE com 🔥 dos dois lados, linha fina dentro
//    de uma caixa dourada translúcida com "alças de seleção" brancas, e a última manuscrita com emoji, que entra com o
//    brilho (sfx/brilho-tutorial.wav, tirado da referência).
//  - Depois: legenda manuscrita pequena, palavra por palavra (cada palavra aparece quando é falada, a frase vai se
//    formando em até 2 linhas e troca na próxima frase), sempre no mesmo lugar, abaixo do queixo.
//  - CTA (regra da Lívia, pedido dela neste formato): caixa BRANCA com texto PRETO "Comenta: PALAVRA" colada em cima
//    da legenda, parada até o fim, com o mesmo brilho da referência quando entra.
// Medidas tiradas do vídeo de referência (1080x1920).
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadSriracha } from "@remotion/google-fonts/Sriracha";
import { loadFont as loadSniglet } from "@remotion/google-fonts/Sniglet";
import { loadFont as loadQuicksand } from "@remotion/google-fonts/Quicksand";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { z } from "zod";

const script = loadSriracha("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] }).fontFamily;
const grande = loadSniglet("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] }).fontFamily;
const fina = loadQuicksand("normal", { weights: ["500"], subsets: ["latin", "latin-ext"] }).fontFamily;
const poppins = loadPoppins("normal", { weights: ["500", "600"], subsets: ["latin", "latin-ext"] }).fontFamily;
const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

const FPS = 30;
const SOMBRA = "0 2px 6px rgba(0,0,0,0.35)";
const BRILHO = "sfx/brilho-tutorial.wav";
const BRILHO_VOLUME = 0.8;
const CAIXA = "rgba(160,112,8,0.55)"; // caixa dourada translúcida do gancho

const linhaSchema = z.object({
  texto: z.string(),
  estilo: z.enum(["script", "grande", "fina", "caixa"]),
  emojiAntes: z.string().optional(),
  emojiDepois: z.string().optional(),
  inicio: z.number().optional(), // só no gancho: quando a linha aparece
});

export const narracaoTutorialSchema = z.object({
  narracao: z.object({ arquivo: z.string(), inicio: z.number().optional() }),
  takes: z.array(z.object({ arquivo: z.string(), duracao: z.number(), inicio: z.number().optional() })),
  arroba: z.string().optional(),
  titulo: z.object({ linhas: z.array(linhaSchema), fim: z.number() }), // 3 linhas: script, grande, fina
  gancho: z.object({ linhas: z.array(linhaSchema), fim: z.number(), brilho: z.boolean().optional() }),
  legendas: z.array(z.object({ palavras: z.array(z.object({ texto: z.string(), inicio: z.number() })), fim: z.number() })),
  legendaTopo: z.number().optional(), // topo da legenda (px), ~1 cm abaixo do queixo. Padrão 1335 (igual à referência)
  cta: z.object({ texto: z.string(), inicio: z.number() }).optional(),
});

export type NarracaoTutorialProps = z.infer<typeof narracaoTutorialSchema>;
type Linha = z.infer<typeof linhaSchema>;

export const calcularDuracao: CalculateMetadataFunction<NarracaoTutorialProps> = ({ props }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.takes.reduce((s, c) => s + c.duracao, 0) * FPS),
});

const estiloTexto = (e: Linha["estilo"], titulo: boolean): React.CSSProperties => {
  if (e === "script") return { fontFamily: script, fontSize: titulo ? 84 : 64, letterSpacing: 2, color: "white", textShadow: SOMBRA, lineHeight: 1.15 };
  if (e === "grande") return { fontFamily: grande, fontWeight: 800, fontSize: titulo ? 104 : 96, color: "white", textShadow: SOMBRA, lineHeight: 1.05 };
  return { fontFamily: fina, fontWeight: 500, fontSize: titulo ? 58 : 54, color: "white", textShadow: SOMBRA, lineHeight: 1.3 };
};

const Emoji: React.FC<{ e?: string; tamanho: number; y: number }> = ({ e, tamanho, y }) =>
  e ? <span style={{ fontSize: tamanho, display: "inline-block", transform: `translateY(${y}px)`, margin: "0 6px" }}>{e}</span> : null;

const LinhaView: React.FC<{ l: Linha; titulo: boolean; pop: number }> = ({ l, titulo, pop }) => {
  const st = estiloTexto(l.estilo, titulo);
  const tam = (st.fontSize as number) * (l.estilo === "grande" ? 0.8 : 0.7);
  const conteudo = (
    <>
      <Emoji e={l.emojiAntes} tamanho={tam} y={l.estilo === "grande" ? 18 : 0} />
      <span style={{ textDecoration: l.estilo === "fina" ? "underline" : undefined, textDecorationThickness: 3, textUnderlineOffset: 10 }}>{l.texto}</span>
      <Emoji e={l.emojiDepois} tamanho={tam} y={l.estilo === "grande" ? -22 : -8} />
    </>
  );
  return (
    <div style={{ textAlign: "center", transform: `scale(${pop})`, whiteSpace: "nowrap", ...st }}>
      {l.estilo === "caixa" ? (
        <span style={{ position: "relative", display: "inline-block", backgroundColor: CAIXA, padding: "2px 22px 6px" }}>
          {/* alças de seleção */}
          <span style={{ position: "absolute", left: -2, top: -16, bottom: 0, width: 3, backgroundColor: "white" }} />
          <span style={{ position: "absolute", left: -8, top: -26, width: 14, height: 14, borderRadius: 7, backgroundColor: "white" }} />
          <span style={{ position: "absolute", right: -2, top: 0, bottom: -16, width: 3, backgroundColor: "white" }} />
          <span style={{ position: "absolute", right: -8, bottom: -26, width: 14, height: 14, borderRadius: 7, backgroundColor: "white" }} />
          {conteudo}
        </span>
      ) : (
        conteudo
      )}
    </div>
  );
};

export const NarracaoTutorial: React.FC<NarracaoTutorialProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let ini = 0;
  const inicios = p.takes.map((c) => {
    const i = ini;
    ini += c.duracao;
    return i;
  });
  const topo = p.legendaTopo ?? 1335;
  const leg = p.legendas.find((l) => l.palavras.length && t >= l.palavras[0].inicio && t < l.fim);
  const ctaAtivo = !!p.cta && t >= p.cta.inicio;
  const pop = (inicio: number) => interpolate(frame, [Math.round(inicio * FPS), Math.round(inicio * FPS) + 8], [1.2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const ultimaGancho = p.gancho.linhas[p.gancho.linhas.length - 1];

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {p.takes.map((c, i) => (
        <Sequence key={i} from={Math.round(inicios[i] * FPS)} durationInFrames={Math.round(c.duracao * FPS)}>
          <OffthreadVideo src={midia(c.arquivo)} startFrom={Math.round((c.inicio ?? 0) * FPS)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
      ))}
      <Audio src={midia(p.narracao.arquivo)} startFrom={Math.round((p.narracao.inicio ?? 0) * FPS)} />

      {/* brilho da referência: na última linha do gancho e no CTA */}
      {(p.gancho.brilho ?? true) && ultimaGancho?.inicio !== undefined && (
        <Sequence from={Math.round(ultimaGancho.inicio * FPS)} durationInFrames={24}>
          <Audio src={staticFile(BRILHO)} volume={BRILHO_VOLUME} />
        </Sequence>
      )}
      {p.cta && (
        <Sequence from={Math.round(p.cta.inicio * FPS)} durationInFrames={24}>
          <Audio src={staticFile(BRILHO)} volume={BRILHO_VOLUME} />
        </Sequence>
      )}

      {/* @ da pessoa */}
      {p.arroba && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 128, textAlign: "center", fontFamily: poppins, fontWeight: 500, fontSize: 48, color: "rgba(255,255,255,0.72)" }}>{p.arroba}</div>
      )}

      {/* Título de abertura: parado, da primeira frase */}
      {t < p.titulo.fim && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 310, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {p.titulo.linhas.map((l, i) => (
            <LinhaView key={i} l={l} titulo pop={1} />
          ))}
        </div>
      )}

      {/* Gancho: linhas empilhadas que aparecem conforme a fala */}
      {t >= (p.gancho.linhas[0]?.inicio ?? 0) && t < p.gancho.fim && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          {p.gancho.linhas.map((l, i) => (
            <div key={i} style={{ visibility: t >= (l.inicio ?? 0) ? "visible" : "hidden", marginTop: l.estilo === "caixa" ? 14 : 0, marginBottom: l.estilo === "caixa" ? 14 : 0 }}>
              <LinhaView l={l} titulo={false} pop={pop(l.inicio ?? 0)} />
            </div>
          ))}
        </div>
      )}

      {/* Legenda palavra por palavra, com o CTA colado em cima */}
      {(leg || ctaAtivo) && (
        <div style={{ position: "absolute", left: 220, width: 640, top: topo }}>
          {ctaAtivo && (
            <div style={{ position: "absolute", left: "50%", bottom: "100%", marginBottom: 6, transform: "translateX(-50%)", whiteSpace: "nowrap", backgroundColor: "white", color: "black", fontFamily: poppins, fontWeight: 600, fontSize: 50, padding: "8px 28px", borderRadius: 14 }}>
              {p.cta!.texto}
            </div>
          )}
          {leg && (
            <div style={{ fontFamily: script, fontSize: 52, letterSpacing: 1.5, lineHeight: 1.2, color: "white", textShadow: "0 2px 5px rgba(0,0,0,0.5)", textAlign: "left" }}>
              {leg.palavras.map((w, i) => (
                <span key={i} style={{ visibility: t >= w.inicio ? "visible" : "hidden" }}>
                  {w.texto}{" "}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
