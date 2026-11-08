// Formato "YAP elaborado" da Lívia Brasil (comando /yapelaborado).
// A pessoa fala para a câmera em tela cheia o tempo todo (sem inserções), com cortes secos e zoom alternado a cada corte.
//  - Legenda de UMA palavra por vez, minúscula e sem pontuação, serifada condensada branca (Libre Caslon Condensed),
//    parada sempre no mesmo lugar: ao lado do rosto, na altura da boca (dentro da área segura do Reels).
//  - Textos em cima da cabeça, centralizados e colados no alto da cabeça:
//      "titulo":   serifada condensada (Libre Caslon Condensed), aparece pronto (gancho do começo, frases de destaque);
//      "topico":   Figtree bold (igual à fonte "Classic" da referência), aparece pronto, com som de clique;
//      "digitado": Figtree bold, aparece letra por letra com cursor "|", com som de teclado enquanto digita;
//      "emoji":    só emojis pequenos (ex.: ❌), com o som de erro (buzzer) quando tem ❌.
//  - Abertura: o primeiro quadro começa com zoom 1.4 e desfoque e abre para o normal em 0,2 s (igual à referência).
//  - Efeitos sonoros tirados do próprio vídeo de referência (pasta sfx/): clique, teclado, erro e brilho.
//  - CTA (regra fixa do plugin): caixa marsala com fonte branca em negrito, "Comenta: PALAVRA",
//    colada em cima da cabeça, parada do momento em que é falado até o fim.
// Medidas tiradas do vídeo de referência (720x1280) e convertidas para 1080x1920.
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadCaslon } from "@remotion/google-fonts/LibreCaslonCondensed";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { z } from "zod";

const caslon = loadCaslon("normal", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });
const figtree = loadFigtree("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
const EMOJI = '"Apple Color Emoji", "Noto Color Emoji", "Segoe UI Emoji"';

const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

const FPS = 30;
const ORIGEM_ZOOM_Y = 576; // zoom a partir de 30% da altura (rosto)
const LETRAS_POR_SEGUNDO = 40; // velocidade da digitação na referência
const ESPACO_CABECA = 10; // textos de cima: colados no alto da cabeça
const ESPACO_CABECA_CTA = 10; // CTA: colado na cabeça
const LARGURA_TEXTO = 980;

// Sons tirados do vídeo de referência (volume original da referência)
const SONS = {
  clique: "sfx/clique-texto.wav",
  digitando: "sfx/maquina-escrever.wav", // som de máquina de escrever da referência
  erro: "sfx/erro-buzzer.wav",
  brilho: "sfx/brilho.wav",
} as const;
type Som = keyof typeof SONS;
// Clique e teclado são estalos fortes: metade do volume para não estourar nem passar da voz
const VOLUME: Record<Som, number> = { clique: 0.5, digitando: 0.25, erro: 1, brilho: 1 };

const cenaSchema = z.object({
  duracao: z.number(),
  apresentadoraInicio: z.number().optional(), // segundo no vídeo tratado da pessoa
  zoom: z.number().optional(), // 1 e 1.15 alternando a cada corte
  cabecaY: z.number().optional(), // alto da cabeça nesta cena (px, sem zoom); se não tiver, usa o geral
});

export const yapElaboradoSchema = z.object({
  apresentadora: z.object({ arquivo: z.string() }),
  cenas: z.array(cenaSchema),
  palavras: z.array(z.object({ texto: z.string(), inicio: z.number(), fim: z.number() })), // uma palavra por vez
  textos: z
    .array(
      z.object({
        texto: z.string(), // "\n" quebra linha
        inicio: z.number(),
        fim: z.number(),
        estilo: z.enum(["titulo", "topico", "digitado", "emoji"]),
        som: z.enum(["clique", "digitando", "erro", "brilho", "nenhum"]).optional(), // padrão: topico=clique, digitado=digitando, emoji com ❌=erro
      })
    )
    .optional(),
  efeitos: z.array(z.object({ som: z.enum(["clique", "digitando", "erro", "brilho"]), inicio: z.number() })).optional(), // sons extras (ex.: brilho no gancho)
  cta: z.object({ texto: z.string(), inicio: z.number() }).optional(),
  cabecaY: z.number().optional(), // ponto mais alto da cabeça no vídeo sem zoom (px). Padrão 300.
  cabecaTrilha: z.array(z.object({ t: z.number(), y: z.number() })).optional(), // alto da cabeça medido a cada 0,1 s (vídeo sem zoom); cada texto fica parado na altura do ponto mais alto da cabeça durante o tempo dele
  legendaX: z.number().optional(), // centro da palavra (px), FIXO na tela: ao lado do rosto. Padrão 750.
  legendaY: z.number().optional(), // centro da palavra (px), FIXO na tela: na altura da boca, ao lado do rosto. Padrão 950.
});

export type YapElaboradoProps = z.infer<typeof yapElaboradoSchema>;
type Texto = NonNullable<YapElaboradoProps["textos"]>[number];

export const calcularDuracao: CalculateMetadataFunction<YapElaboradoProps> = ({ props }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.cenas.reduce((s, c) => s + c.duracao, 0) * FPS),
});

const sombra = "0 2px 6px rgba(0,0,0,0.45), 0 0 2px rgba(0,0,0,0.35)";

const somDoTexto = (x: Texto): Som | undefined => {
  if (x.som) return x.som === "nenhum" ? undefined : x.som;
  if (x.estilo === "topico") return "clique";
  if (x.estilo === "digitado") return "digitando";
  if (x.estilo === "emoji" && x.texto.includes("❌")) return "erro";
  return undefined;
};

const TextoTopo: React.FC<{ x: Texto; desde: number }> = ({ x, desde }) => {
  const letras = Array.from(x.texto);
  const n = x.estilo === "digitado" ? Math.min(letras.length, Math.floor(desde * LETRAS_POR_SEGUNDO) + 1) : letras.length;
  const digitando = x.estilo === "digitado" && n < letras.length;
  const st: React.CSSProperties =
    x.estilo === "titulo"
      ? { fontFamily: `${caslon.fontFamily}, ${EMOJI}`, fontWeight: 500, fontSize: 76, lineHeight: 1.08 }
      : x.estilo === "emoji"
      ? { fontFamily: EMOJI, fontSize: 44, lineHeight: 1 }
      : { fontFamily: `${figtree.fontFamily}, ${EMOJI}`, fontWeight: 700, fontSize: 60, lineHeight: 1.12, letterSpacing: -0.5 };
  // O bloco ocupa desde o início o tamanho do texto completo (parado na tela); a digitação começa na primeira linha e desce
  const base: React.CSSProperties = { ...st, color: "white", textAlign: "center", whiteSpace: "pre-wrap", maxWidth: LARGURA_TEXTO, textShadow: sombra };
  return (
    <div style={{ position: "relative" }}>
      <div style={{ ...base, visibility: "hidden" }}>{x.texto}</div>
      <div style={{ ...base, position: "absolute", top: 0, left: 0, right: 0 }}>
        {letras.slice(0, n).join("")}
        {digitando ? <span style={{ fontWeight: 400 }}>|</span> : null}
      </div>
    </div>
  );
};

export const YapElaborado: React.FC<YapElaboradoProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  let ini = 0;
  const inicios = p.cenas.map((c) => {
    const i = ini;
    ini += c.duracao;
    return i;
  });
  const ci = Math.max(0, inicios.findIndex((s, i) => t >= s && t < s + p.cenas[i].duracao));
  const cena = p.cenas[ci];
  // Alto da cabeça na tela num instante (com o zoom da cena daquele instante)
  const trilha = p.cabecaTrilha ?? [];
  const cabecaEm = (tt: number) => {
    const k = Math.max(0, inicios.findIndex((s0, i) => tt >= s0 && tt < s0 + p.cenas[i].duracao));
    const c = p.cenas[k];
    let y = c.cabecaY ?? p.cabecaY ?? 300;
    if (trilha.length) {
      const j = trilha.findIndex((q) => q.t > tt);
      if (j <= 0) y = trilha[j === 0 ? 0 : trilha.length - 1].y;
      else {
        const a = trilha[j - 1], b = trilha[j];
        y = a.y + ((b.y - a.y) * (tt - a.t)) / (b.t - a.t);
      }
    }
    return ORIGEM_ZOOM_Y + (y - ORIGEM_ZOOM_Y) * (c.zoom ?? 1);
  };
  // Cada texto fica PARADO na tela do começo ao fim: a posição é o ponto mais alto da cabeça durante o tempo dele
  const posicaoFixa = (a: number, b: number, colado = false) => {
    const v: number[] = [];
    for (let tt = a; tt < b; tt += 0.1) v.push(cabecaEm(tt));
    if (!v.length) return cabecaEm(a);
    if (!colado) return Math.min(...v);
    // Títulos: colados na cabeça na posição normal dela (mediana); se ela se inclinar, pode encostar um pouquinho
    v.sort((x, y) => x - y);
    return v[Math.floor(v.length / 2)];
  };

  // Abertura igual à referência: o vídeo começa com zoom de 1.4 e abre rápido para o normal (0,2 s), com desfoque de movimento
  const aberturaZoom = interpolate(frame, [0, 6], [1.4, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const aberturaBlur = interpolate(frame, [0, 5], [8, 0], { extrapolateRight: "clamp" });

  const palavra = p.palavras.find((w) => t >= w.inicio && t < w.fim);
  const ctaAtivo = p.cta && t >= p.cta.inicio;
  const textos = p.textos ?? [];
  const texto = ctaAtivo ? undefined : textos.find((x) => t >= x.inicio && t < x.fim);

  // Sons: dos textos + extras
  const sons: { som: Som; inicio: number; dur?: number }[] = [];
  for (const x of textos) {
    const s = somDoTexto(x);
    if (!s) continue;
    const dur = s === "digitando" ? Math.min(x.fim - x.inicio, Array.from(x.texto).length / LETRAS_POR_SEGUNDO) : undefined;
    sons.push({ som: s, inicio: x.inicio, dur });
    // Texto digitado que termina com ❌: o som de erro toca quando o ❌ aparece (como na referência)
    if (x.estilo === "digitado" && x.texto.includes("❌")) {
      const pos = Array.from(x.texto).indexOf("❌");
      sons.push({ som: "erro", inicio: x.inicio + pos / LETRAS_POR_SEGUNDO });
    }
  }
  for (const e of p.efeitos ?? []) sons.push({ som: e.som, inicio: e.inicio });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {p.cenas.map((c, i) => (
        <Sequence key={i} from={Math.round(inicios[i] * FPS)} durationInFrames={Math.round(c.duracao * FPS)}>
          <AbsoluteFill style={{ overflow: "hidden" }}>
            <OffthreadVideo
              src={midia(p.apresentadora.arquivo)}
              startFrom={Math.round((c.apresentadoraInicio ?? inicios[i]) * FPS)}
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${(c.zoom ?? 1) * (i === 0 ? aberturaZoom : 1)})`,
                transformOrigin: "50% 30%",
                filter: i === 0 && aberturaBlur > 0.05 ? `blur(${aberturaBlur}px)` : undefined,
              }}
            />
          </AbsoluteFill>
        </Sequence>
      ))}
      {/* A voz vem inteira do vídeo tratado, sem cortes extras */}
      <Audio src={midia(p.apresentadora.arquivo)} />
      {sons.map((s, i) => (
        <Sequence key={`som${i}`} from={Math.round(s.inicio * FPS)} durationInFrames={s.dur ? Math.max(1, Math.round(s.dur * FPS)) : undefined}>
          <Audio src={staticFile(SONS[s.som])} volume={VOLUME[s.som]} />
        </Sequence>
      ))}

      {/* Textos em cima da cabeça (ou CTA) */}
      {(texto || ctaAtivo) && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 1920 - (ctaAtivo ? posicaoFixa(p.cta!.inicio, ini) : posicaoFixa(texto!.inicio, texto!.fim, texto!.estilo === "titulo")) + (ctaAtivo ? ESPACO_CABECA_CTA : ESPACO_CABECA),
            display: "flex",
            justifyContent: "center",
          }}
        >
          {ctaAtivo ? (
            <div
              style={{
                backgroundColor: "#7D1D2F",
                color: "white",
                fontFamily: figtree.fontFamily,
                fontWeight: 700,
                fontSize: 54,
                padding: "12px 30px",
                borderRadius: 14,
              }}
            >
              {p.cta!.texto}
            </div>
          ) : (
            <TextoTopo x={texto!} desde={t - texto!.inicio} />
          )}
        </div>
      )}

      {/* Legenda: uma palavra por vez, parada sempre no mesmo lugar: ao lado do rosto, na altura da boca (dentro da área segura do Reels) */}
      {palavra && (
        <div
          style={{
            position: "absolute",
            left: (p.legendaX ?? 750) - 300,
            width: 600,
            top: p.legendaY ?? 950,
            transform: "translateY(-50%)",
            textAlign: "center",
            fontFamily: caslon.fontFamily,
            fontWeight: 400,
            fontSize: 64,
            color: "white",
            textShadow: sombra,
          }}
        >
          {palavra.texto}
        </div>
      )}
    </AbsoluteFill>
  );
};
