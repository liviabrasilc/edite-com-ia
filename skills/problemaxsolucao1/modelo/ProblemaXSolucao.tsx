// Formato "Problema x solução 1" da Lívia Brasil (comando /problemaxsolucao1).
// Igual à referência: tela dividida ao meio na vertical, a mesma pessoa dos dois lados em duas gravações
// (esquerda = quem pergunta, "Dúvida"; direita = quem responde, "Resposta"), as duas rodando juntas o tempo todo.
//  - Faixa preta no topo com o título em 2 caixas, parado o vídeo inteiro (regra da Lívia):
//      linha 1: caixa branca, texto preto (Figtree ExtraBold), pode ter emoji;
//      linha 2: caixa vermelho-escura (#4C0001), texto branco.
//  - Etiquetas "Dúvida" e "Resposta" em caixa branca com borda vermelha grossa, texto preto (Roboto Bold), no topo de cada metade.
//  - Legenda: frases curtas em 2 linhas, Figtree ExtraBold branca com sombra escura, numa caixa vermelha translúcida
//    de borda suave, sempre embaixo do queixo de quem está falando (na metade de quem fala). Troca seca, sem animação.
//  - Sem música e sem efeitos sonoros.
//  - CTA (regra da Lívia): caixa marsala "Comenta: PALAVRA" logo abaixo do queixo, colada em cima da legenda, na metade de quem fala.
// Medidas tiradas do vídeo de referência (convertidas para 1080x1920).
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { loadFont as loadRoboto } from "@remotion/google-fonts/Roboto";
import { z } from "zod";

const figtree = loadFigtree("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] });
const roboto = loadRoboto("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

const FPS = 30;
const VIDEO_TOPO = 390; // onde começam os vídeos (acima é a faixa preta do título)
const METADE = 540;

const ladoSchema = z.object({
  arquivo: z.string(),
  inicio: z.number().optional(), // segundo do arquivo que corresponde ao começo do Reel (para sincronizar as duas gravações)
  volume: z.number().optional(), // padrão 1
  espelhar: z.boolean().optional(), // só para teste
});

export const problemaXSolucaoSchema = z.object({
  duracao: z.number(), // segundos
  duvida: ladoSchema, // metade esquerda
  resposta: ladoSchema, // metade direita
  titulo: z.string(), // linha 1 (caixa branca)
  subtitulo: z.string(), // linha 2 (caixa vermelho-escura)
  etiquetas: z.array(z.string()).optional(), // padrão ["Dúvida", "Resposta"]
  frases: z.array(z.object({ linhas: z.array(z.string()), inicio: z.number(), fim: z.number(), lado: z.enum(["duvida", "resposta"]) })),
  legendaTopo: z.number().optional(), // topo da legenda (px), ~1 cm abaixo do queixo dentro da metade
  cta: z.object({ texto: z.string(), inicio: z.number(), lado: z.enum(["duvida", "resposta"]) }).optional(),
});

export type ProblemaXSolucaoProps = z.infer<typeof problemaXSolucaoSchema>;

export const calcularDuracao: CalculateMetadataFunction<ProblemaXSolucaoProps> = ({ props }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.duracao * FPS),
});

const centroX = (lado: "duvida" | "resposta") => (lado === "duvida" ? METADE / 2 : METADE + METADE / 2);

const Metade: React.FC<{ l: z.infer<typeof ladoSchema>; x: number }> = ({ l, x }) => (
  <div style={{ position: "absolute", left: x, top: VIDEO_TOPO, width: METADE, height: 1920 - VIDEO_TOPO, overflow: "hidden" }}>
    <OffthreadVideo
      src={midia(l.arquivo)}
      startFrom={Math.round((l.inicio ?? 0) * FPS)}
      volume={l.volume ?? 1}
      style={{ width: "100%", height: "100%", objectFit: "cover", transform: l.espelhar ? "scaleX(-1)" : undefined }}
    />
  </div>
);

const Etiqueta: React.FC<{ texto: string; cx: number }> = ({ texto, cx }) => (
  <div style={{ position: "absolute", left: cx - 260, width: 520, top: 365, display: "flex", justifyContent: "center" }}>
    <div
      style={{
        backgroundColor: "white",
        border: "7px solid #FF0000",
        borderRadius: 16,
        padding: "0 18px",
        height: 112,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        fontFamily: roboto.fontFamily,
        fontWeight: 700,
        fontSize: 76,
        color: "#111",
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  </div>
);

export const ProblemaXSolucao: React.FC<ProblemaXSolucaoProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const topo = p.legendaTopo ?? 1360;
  const etiquetas = p.etiquetas ?? ["Dúvida", "Resposta"];
  const frase = p.frases.find((f) => t >= f.inicio && t < f.fim);
  const ctaAtivo = !!p.cta && t >= p.cta.inicio;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Metade l={p.duvida} x={0} />
      <Metade l={p.resposta} x={METADE} />

      {/* Título fixo o vídeo inteiro, na faixa preta */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 167, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 14,
            height: 89,
            padding: "0 22px",
            display: "flex",
            alignItems: "center",
            fontFamily: figtree.fontFamily,
            fontWeight: 800,
            fontSize: 68,
            color: "#111",
            whiteSpace: "nowrap",
          }}
        >
          {p.titulo}
        </div>
        <div
          style={{
            backgroundColor: "#4C0001",
            borderRadius: 14,
            height: 97,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            fontFamily: figtree.fontFamily,
            fontWeight: 800,
            fontSize: 54,
            color: "white",
            whiteSpace: "nowrap",
          }}
        >
          {p.subtitulo}
        </div>
      </div>

      <Etiqueta texto={etiquetas[0]} cx={centroX("duvida")} />
      <Etiqueta texto={etiquetas[1]} cx={centroX("resposta")} />

      {/* CTA: logo abaixo do queixo de quem fala, colado em cima da legenda; parado até o fim */}
      {ctaAtivo && (
        <div style={{ position: "absolute", left: centroX(p.cta!.lado) - 270, width: 540, bottom: 1920 - topo + 6, display: "flex", justifyContent: "center" }}>
          <div style={{ backgroundColor: "#7D1D2F", color: "white", fontFamily: figtree.fontFamily, fontWeight: 800, fontSize: 48, padding: "10px 26px", borderRadius: 14, whiteSpace: "nowrap" }}>
            {p.cta!.texto}
          </div>
        </div>
      )}

      {/* Legenda na metade de quem fala, em caixa vermelha translúcida */}
      {frase && (
        <div style={{ position: "absolute", left: centroX(frase.lado) - 270, width: 540, top: topo, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", padding: "8px 22px 12px" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(222,18,28,0.78)",
                borderRadius: 22,
                filter: "blur(3px)",
              }}
            />
            <div
              style={{
                position: "relative",
                textAlign: "center",
                fontFamily: figtree.fontFamily,
                fontWeight: 800,
                fontSize: 56,
                lineHeight: "66px",
                color: "white",
                textShadow: "2px 4px 0 rgba(40,0,0,0.75)",
                whiteSpace: "nowrap",
              }}
            >
              {frase.linhas.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
