// Formato "Tela dividida elegante" da Lívia Brasil.
// Cenas em sequência com corte seco:
//  - "dividida": imagem ou vídeo em cima (0 a 904 px) e a pessoa embaixo (904 a 1920 px); legenda logo acima da divisão.
//  - "apresentadora": a pessoa em tela cheia, zoom alternado a cada corte; legenda na altura do peito.
//  - "imagem": imagem ou vídeo em tela cheia (sem a pessoa), com a voz dela por baixo.
// Legenda curta (1 a 3 palavras) em maiúsculas, Archivo ExtraBold itálico, branca.
// Palavras-chave grandes ("títulos") entram palavra por palavra no momento em que são faladas.
// Medidas tiradas do vídeo de referência (1440x2560) e convertidas para 1080x1920.
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { z } from "zod";

const archivo = loadArchivo("italic", { weights: ["800"], subsets: ["latin", "latin-ext"] });
const archivoReto = loadArchivo("normal", { weights: ["900"], subsets: ["latin", "latin-ext"] });

const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));
const ehImagem = (s: string) => /\.(png|jpe?g|webp|gif)$/i.test(s);

const FPS = 30;
const DIVISAO = 904; // linha entre a imagem de cima e a pessoa
const LEGENDA_FUNDO_DIVIDIDA = 896; // a legenda termina logo acima da divisão
const ESPACO_QUEIXO = 160; // legenda: cerca de 1 cm abaixo do queixo na tela do celular
const ESPACO_QUEIXO_CTA = 28; // a caixa do CTA fica logo abaixo do queixo; a legenda vem colada embaixo dela
const LEGENDA_Y_IMAGEM = 960;
const CTA_ALTURA = 92;
const CTA_ESPACO = 10;

const cenaSchema = z.object({
  tipo: z.enum(["dividida", "apresentadora", "imagem"]),
  duracao: z.number(),
  apresentadoraInicio: z.number(), // segundo no vídeo tratado da pessoa
  zoom: z.number().optional(), // apresentadora: 1 e 1.12 alternando
  midia: z.string().optional(), // dividida / imagem
  midiaInicio: z.number().optional(),
  enquadramento: z.string().optional(), // object-position da mídia
  pessoaDeslocY: z.number().optional(), // dividida: quanto subir o vídeo da pessoa para o rosto ficar no alto da metade de baixo (px, negativo sobe)
});

export const elegantesSchema = z.object({
  apresentadora: z.object({ arquivo: z.string() }),
  cenas: z.array(cenaSchema),
  legendas: z.array(z.object({ texto: z.string(), inicio: z.number(), fim: z.number() })),
  titulos: z
    .array(
      z.object({
        palavras: z.array(z.object({ texto: z.string(), inicio: z.number() })), // cada palavra entra quando é falada
        fim: z.number(),
        estilo: z.enum(["condensado", "italico"]), // condensado: Archivo Black reto; italico: Archivo ExtraBold itálico
        cor: z.string(), // laranja #E2741B, vermelho-rosado #E8475F, branco #FFFFFF
        tamanho: z.number().optional(), // padrão 112
      })
    )
    .optional(),
  cta: z.object({ texto: z.string(), inicio: z.number() }).optional(),
  queixoY: z.number().optional(), // altura do queixo da pessoa no vídeo sem zoom (px). A legenda, as palavras-chave e o CTA ficam logo abaixo dele nas cenas de tela cheia. Padrão 880.
});

export type ElegantesProps = z.infer<typeof elegantesSchema>;
type Cena = z.infer<typeof cenaSchema>;

export const calcularDuracao: CalculateMetadataFunction<ElegantesProps> = ({ props }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.cenas.reduce((s, c) => s + c.duracao, 0) * FPS),
});

const Midia: React.FC<{ src: string; inicio?: number; pos?: string }> = ({ src, inicio, pos }) => {
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", objectPosition: pos ?? "50% 50%" };
  return ehImagem(src) ? <Img src={midia(src)} style={st} /> : <OffthreadVideo src={midia(src)} startFrom={Math.round((inicio ?? 0) * FPS)} muted style={st} />;
};

const CenaView: React.FC<{ c: Cena; arquivo: string }> = ({ c, arquivo }) => {
  const ini = Math.round(c.apresentadoraInicio * FPS);
  if (c.tipo === "apresentadora")
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo src={midia(arquivo)} startFrom={ini} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${c.zoom ?? 1})`, transformOrigin: "50% 30%" }} />
      </AbsoluteFill>
    );
  if (c.tipo === "dividida")
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: DIVISAO, overflow: "hidden" }}>
          <Midia src={c.midia!} inicio={c.midiaInicio} pos={c.enquadramento} />
        </div>
        <div style={{ position: "absolute", top: DIVISAO, left: 0, width: 1080, height: 1920 - DIVISAO, overflow: "hidden" }}>
          <OffthreadVideo src={midia(arquivo)} startFrom={ini} style={{ position: "absolute", left: 0, top: c.pessoaDeslocY ?? -300, width: 1080, height: 1920, objectFit: "cover" }} />
        </div>
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Midia src={c.midia!} inicio={c.midiaInicio} pos={c.enquadramento} />
      <Audio src={midia(arquivo)} startFrom={ini} />
    </AbsoluteFill>
  );
};

const normal = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/gi, "").toUpperCase().trim();
// a legenda repete a palavra-chave quando todas as palavras da palavra-chave aparecem nela
const mesmoTexto = (x: { palavras: { texto: string }[] }, legenda: string) => {
  const l = " " + normal(legenda) + " ";
  return x.palavras.every((w) => l.includes(" " + normal(w.texto) + " "));
};

const sombra = "0 2px 8px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.5)";

const Titulo: React.FC<{ t: NonNullable<ElegantesProps["titulos"]>[number] }> = ({ t }) => {
  const frame = useCurrentFrame();
  const tempo = frame / FPS;
  const tam = t.tamanho ?? 112;
  return (
    <div
      style={{
        textAlign: "center", marginTop: 6,
        fontFamily: t.estilo === "italico" ? archivo.fontFamily : archivoReto.fontFamily,
        fontStyle: t.estilo === "italico" ? "italic" : "normal",
        fontWeight: t.estilo === "italico" ? 800 : 900,
        fontSize: tam, lineHeight: 0.98, letterSpacing: -2, color: t.cor, textTransform: "uppercase", textShadow: "0 4px 14px rgba(0,0,0,0.45)",
      }}
    >
      {t.palavras.map((p, i) => {
        const f = (tempo - p.inicio) * FPS; // quadros desde que a palavra foi falada
        const op = interpolate(f, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = interpolate(f, [0, 5], [tam * 0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <span key={i} style={{ display: "inline-block", opacity: op, transform: `translateY(${y}px)`, marginRight: "0.22em" }}>
            {p.texto}
          </span>
        );
      })}
    </div>
  );
};

export const TelaDivididaElegante: React.FC<ElegantesProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const inicios: number[] = [];
  p.cenas.reduce((s, c) => (inicios.push(s), s + c.duracao), 0);
  let atual = 0;
  inicios.forEach((x, i) => { if (t >= x) atual = i; });
  const tipo = p.cenas[atual].tipo;
  const titulosAtivos = (p.titulos ?? []).filter((x) => t >= x.palavras[0].inicio && t < x.fim);
  // A legenda não repete o que a palavra-chave já mostra: nesse trecho, a palavra-chave fica no lugar da legenda.
  const leg = p.legendas.find((l) => t >= l.inicio && t < l.fim && !titulosAtivos.some((x) => mesmoTexto(x, l.texto)));
  const comCta = !!p.cta && t >= p.cta.inicio;
  const estiloLeg: React.CSSProperties = {
    color: "#fff", textShadow: sombra, fontFamily: archivo.fontFamily, fontStyle: "italic", fontWeight: 800, fontSize: 58, lineHeight: 1.0, textTransform: "uppercase",
  };
  // Tudo que é texto fica numa pilha só, sem espaço entre os itens: CTA, legenda e palavras-chave.
  const zoom = p.cenas[atual].zoom ?? 1;
  const queixo = 576 + ((p.queixoY ?? 880) - 576) * (tipo === "apresentadora" ? zoom : 1); // origem do zoom em 30% da altura
  const posPilha: React.CSSProperties =
    tipo === "dividida"
      ? { bottom: 1920 - LEGENDA_FUNDO_DIVIDIDA } // cresce para cima a partir da divisão
      : tipo === "imagem"
      ? { top: LEGENDA_Y_IMAGEM, transform: "translateY(-50%)" }
      : { top: queixo + (comCta ? ESPACO_QUEIXO_CTA : ESPACO_QUEIXO) }; // abaixo do queixo
  const pilha = (
    <div style={{ position: "absolute", left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", ...posPilha }}>
      {comCta ? (
        <div style={{ background: "#7D1D2F", color: "#fff", fontFamily: archivo.fontFamily, fontStyle: "italic", fontWeight: 800, fontSize: 58, height: CTA_ALTURA, lineHeight: `${CTA_ALTURA}px`, padding: "0 30px", borderRadius: 14, marginBottom: CTA_ESPACO }}>
          {p.cta!.texto}
        </div>
      ) : null}
      {leg ? <div style={estiloLeg}>{leg.texto}</div> : null}
      {titulosAtivos.map((x, i) => <Titulo key={i} t={x} />)}
    </div>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {p.cenas.map((c, i) => (
        <Sequence key={i} from={Math.round(inicios[i] * FPS)} durationInFrames={Math.round(c.duracao * FPS)} name={`Cena ${i + 1}: ${c.tipo}`}>
          <CenaView c={c} arquivo={p.apresentadora.arquivo} />
        </Sequence>
      ))}
      {pilha}
    </AbsoluteFill>
  );
};
