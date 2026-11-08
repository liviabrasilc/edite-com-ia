// Formato "Conversa com você" da Lívia Brasil (comando /conversacomvoce).
// Igual à referência: esquete em que a pessoa faz os dois papéis (cena + resposta), takes com corte seco e o áudio
// de cada take. Medidas tiradas da referência (convertidas para 1080x1920).
//  - Título "POV: ..." fixo no alto o vídeo inteiro, 2 linhas, Montserrat 500 branco com contorno escuro suave.
//  - Legenda por frase (não palavra por palavra), minúscula, mesma fonte, centralizada no peito, sempre no mesmo lugar.
//  - Trilha de tensão (sfx/trilha-conversa.wav, tirada da referência) só na cena de abertura; para seca no corte
//    para a conversa.
//  - Efeito "tensao" num take: só o grave crescente (sfx/tensao-conversa.wav, da referência) antes do corte.
//    Sem filtro na imagem (a Lívia pediu para tirar a tremida e o vermelho da referência).
//  - CTA (regra da Lívia): caixa marsala "Comenta: PALAVRA" colada em cima da legenda, parada até o fim.
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Freeze, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { z } from "zod";

const fonte = loadMontserrat("normal", { weights: ["500", "700"], subsets: ["latin", "latin-ext"] }).fontFamily;
const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

const FPS = 30;
const SOMBRA = "0 0 3px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.5)";
const TRILHA = "sfx/trilha-conversa.wav";
const TENSAO = "sfx/tensao-conversa.wav";
const TENSAO_ANTES = 0.72; // o grave começa 0,72 s antes do corte (igual à referência)
const MARSALA = "#7D1D2F";

export const conversaComVoceSchema = z.object({
  takes: z.array(
    z.object({
      arquivo: z.string(),
      inicio: z.number().optional(), // segundo do arquivo onde o take começa
      duracao: z.number(),
      efeito: z.enum(["tensao"]).optional(),
      congelar: z.boolean().optional(), // take parado num quadro (lembrança rápida)
    })
  ),
  titulo: z.array(z.string()), // linhas do "POV: ..."
  trilha: z.object({ inicio: z.number(), fim: z.number(), volume: z.number().optional() }).optional(),
  legendas: z.array(z.object({ texto: z.string(), inicio: z.number(), fim: z.number() })),
  legendaTopo: z.number().optional(), // padrão 1220 (~1 cm abaixo do queixo)
  cta: z.object({ texto: z.string(), inicio: z.number() }).optional(),
});
export type ConversaComVoceProps = z.infer<typeof conversaComVoceSchema>;

export const calcularDuracaoConversa: CalculateMetadataFunction<ConversaComVoceProps> = ({ props }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.takes.reduce((s, c) => s + c.duracao, 0) * FPS),
});

export const ConversaComVoce: React.FC<ConversaComVoceProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let acc = 0;
  const ini = p.takes.map((c) => {
    const i = Math.round(acc * FPS);
    acc += c.duracao;
    return i;
  });
  const fimTake = (i: number) => ini[i] + Math.round(p.takes[i].duracao * FPS);
  const topo = p.legendaTopo ?? 1220;
  const leg = p.legendas.find((l) => t >= l.inicio && t < l.fim);
  const ctaAtivo = !!p.cta && t >= p.cta.inicio;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {p.takes.map((c, i) => {
        const v = <OffthreadVideo src={midia(c.arquivo)} startFrom={Math.round((c.inicio ?? 0) * FPS)} muted={!!c.congelar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
        return (
          <Sequence key={i} from={ini[i]} durationInFrames={fimTake(i) - ini[i]}>
            {c.congelar ? <Freeze frame={0}>{v}</Freeze> : v}
          </Sequence>
        );
      })}
      {/* grave de tensão: começa antes do corte, então fica fora do take */}
      {p.takes.map((c, i) =>
        c.efeito === "tensao" ? (
          <Sequence key={`g${i}`} from={Math.max(0, ini[i] - Math.round(TENSAO_ANTES * FPS))} durationInFrames={30}>
            <Audio src={staticFile(TENSAO)} volume={0.8} />
          </Sequence>
        ) : null
      )}
      {p.trilha && (
        <Sequence from={Math.round(p.trilha.inicio * FPS)} durationInFrames={Math.round((p.trilha.fim - p.trilha.inicio) * FPS)}>
          <Audio src={staticFile(TRILHA)} volume={p.trilha.volume ?? 1} loop />
        </Sequence>
      )}


      {/* título POV fixo */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 268, textAlign: "center", fontFamily: fonte, fontWeight: 500, fontSize: 64, lineHeight: "64px", color: "white", textShadow: SOMBRA }}>
        {p.titulo.map((l, i) => (
          <div key={i} style={{ whiteSpace: "nowrap" }}>{l}</div>
        ))}
      </div>

      {/* legenda por frase, com o CTA colado em cima */}
      {(leg || ctaAtivo) && (
        <div style={{ position: "absolute", left: 150, width: 780, top: topo }}>
          {ctaAtivo && (
            <div style={{ position: "absolute", left: "50%", bottom: "100%", marginBottom: 6, transform: "translateX(-50%)", whiteSpace: "nowrap", backgroundColor: MARSALA, color: "white", fontFamily: fonte, fontWeight: 700, fontSize: 52, padding: "8px 28px", borderRadius: 14 }}>
              {p.cta!.texto}
            </div>
          )}
          {leg && (
            <div style={{ fontFamily: fonte, fontWeight: 500, fontSize: 58, lineHeight: "60px", color: "white", textShadow: SOMBRA, textAlign: "center" }}>{leg.texto}</div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
