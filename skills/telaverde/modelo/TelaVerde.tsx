// Formato "Tela verde" da Lívia Brasil (comando /telaverde).
// Igual à referência: a pessoa fala para a câmera; nos trechos em que cita alguém ou algo, ela aparece recortada
// (sem o fundo) na frente do vídeo/foto que está comentando, um pouco menor e encostada embaixo. Corte seco na entrada
// e na saída do fundo. O vídeo do fundo fica mudo; só a voz dela toca. Sem música e sem efeitos sonoros.
//  - Recorte: vídeo com transparência (webm VP9 com alfa) gerado antes com o script recortar_pessoa.py.
//  - Fundo de colagem (como na abertura da referência): fotos recortadas por cima do fundo original dela.
//  - Legenda por frase, branca em negrito (Inter Bold) com sombra suave, centralizada, sempre no mesmo lugar.
//    A primeira frase aparece inteira (até 4 linhas), como na referência.
//  - CTA (regra da Lívia): caixa marsala "Comenta: PALAVRA" colada em cima da legenda, parada até o fim.
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { z } from "zod";

const inter = loadInter("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] }).fontFamily;
const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));
const ehImagem = (s: string) => /\.(png|jpe?g|webp|gif)$/i.test(s);

const FPS = 30;
const MARSALA = "#7D1D2F";

export const telaVerdeSchema = z.object({
  pessoa: z.object({
    arquivo: z.string(), // vídeo original (com o som)
    recorte: z.string(), // mesmo vídeo sem o fundo (webm com transparência)
    inicio: z.number().optional(),
    duracao: z.number(),
  }),
  fundos: z.array(
    z.object({
      inicio: z.number(),
      fim: z.number(),
      arquivo: z.string().optional(), // vídeo ou foto que ocupa a tela toda atrás dela
      inicioArquivo: z.number().optional(),
      colagem: z.array(z.object({ arquivo: z.string(), x: z.number(), y: z.number(), largura: z.number() })).optional(),
      escala: z.number().optional(), // tamanho dela na frente do fundo (padrão 0.83)
      deslocX: z.number().optional(), // empurra para o lado (px); padrão -150 (canto esquerdo, pedido da Lívia)
      deslocY: z.number().optional(), // empurra para baixo (px); padrão 220 (mais para baixo, pedido da Lívia)
    })
  ),
  legendas: z.array(z.object({ texto: z.string(), inicio: z.number(), fim: z.number(), grande: z.boolean().optional() })), // grande: a primeira frase, inteira e maior
  legendaTopo: z.number().optional(), // padrão 1330 (~1 cm abaixo do queixo, contando com ela menor)
  cta: z.object({ texto: z.string(), inicio: z.number() }).optional(),
});
export type TelaVerdeProps = z.infer<typeof telaVerdeSchema>;

export const calcularDuracaoTelaVerde = ({ props }: { props: TelaVerdeProps }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.pessoa.duracao * FPS),
});

export const TelaVerde: React.FC<TelaVerdeProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ini = Math.round((p.pessoa.inicio ?? 0) * FPS);
  const topo = p.legendaTopo ?? 1330;
  const leg = p.legendas.find((l) => t >= l.inicio && t < l.fim);
  const ctaAtivo = !!p.cta && t >= p.cta.inicio;
  const fundo = p.fundos.find((f) => t >= f.inicio && t < f.fim);
  const comFundo = !!fundo && !!fundo.arquivo;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* vídeo original dela (com o som); some atrás do fundo quando há fundo */}
      <OffthreadVideo src={midia(p.pessoa.arquivo)} startFrom={ini} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: comFundo ? 0 : 1 }} />

      {p.fundos.map((f, i) => (
        <Sequence key={i} from={Math.round(f.inicio * FPS)} durationInFrames={Math.round((f.fim - f.inicio) * FPS)}>
          {f.arquivo &&
            (ehImagem(f.arquivo) ? (
              <Img src={midia(f.arquivo)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <OffthreadVideo src={midia(f.arquivo)} startFrom={Math.round((f.inicioArquivo ?? 0) * FPS)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ))}
          {(f.colagem ?? []).map((c, j) => (
            <Img key={j} src={midia(c.arquivo)} style={{ position: "absolute", left: c.x, top: c.y, width: c.largura }} />
          ))}
          {/* ela recortada na frente */}
          <AbsoluteFill style={{ transform: f.arquivo ? `translate(${f.deslocX ?? -150}px, ${f.deslocY ?? 220}px) scale(${f.escala ?? 0.83})` : undefined, transformOrigin: "0% 100%" }}>
            <OffthreadVideo src={midia(p.pessoa.recorte)} startFrom={ini + Math.round(f.inicio * FPS)} muted transparent style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* legenda por frase, com o CTA colado em cima */}
      {(leg || ctaAtivo) && (
        <div style={{ position: "absolute", left: 90, width: 900, top: topo }}>
          {ctaAtivo && (
            <div style={{ position: "absolute", left: "50%", bottom: "100%", marginBottom: 6, transform: "translateX(-50%)", whiteSpace: "nowrap", backgroundColor: MARSALA, color: "white", fontFamily: inter, fontWeight: 700, fontSize: 52, padding: "8px 28px", borderRadius: 14 }}>
              {p.cta!.texto}
            </div>
          )}
          {leg && (
            <div style={{ fontFamily: inter, fontWeight: 700, fontSize: leg.grande ? 72 : 60, lineHeight: 1.2, margin: leg.grande ? "0 50px" : 0, color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.55), 0 0 2px rgba(0,0,0,0.4)", textAlign: "center", whiteSpace: "pre-line" }}>{leg.texto}</div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
