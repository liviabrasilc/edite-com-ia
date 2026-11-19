// Formato "Gancho com três imagens" da Lívia Brasil (comando /ganchotresimagens).
// Gancho (copiado do print enviado pela Lívia): a pessoa em tela cheia e, por cima, TRÊS IMAGENS QUADRADAS pequenas em fila
// e o TÍTULO logo embaixo delas, tudo parado desde o primeiro quadro, sem animação e sem som, até a primeira frase acabar.
// O título usa a MESMA fonte da legenda amarela do reel de referência (Montserrat Bold, amarelo #F2DD76, sombra escura suave).
// Depois do gancho, o estilo do reel https://www.instagram.com/reel/DXP9ZspgMgs/ :
//  - cortes secos com zoom alternando 1.0 e 1.15;
//  - legenda por frase (2 ou 3 linhas curtas), Montserrat Bold amarela, sem animação;
//  - imagens de apoio (se a pessoa mandar): tela dividida (imagem em cima, pessoa embaixo, legenda na emenda)
//    ou imagem em tela cheia com a legenda por cima;
//  - sem música e sem efeitos sonoros.
// Medidas tiradas da referência e convertidas para 1080x1920.
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { z } from "zod";

const montserrat = loadMontserrat("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

const FPS = 30;
const AMARELO = "#F2DD76"; // cor medida na legenda da referência
const SOMBRA = "0 2px 8px rgba(0,0,0,0.7), 0 0 3px rgba(0,0,0,0.6)";
const LEGENDA_TAMANHO = 58;
const TITULO_TAMANHO = 70;
const LARGURA = 900; // dentro das bordas do Reels
const CTA_ESPACO = 6;

// Gancho: 3 quadrados de 266 px com 19 px entre eles (836 px no total, centralizados), topo em 244; título começa em 554.
const IMG_LADO = 266;
const IMG_ESPACO = 19;
const IMG_TOPO = 244;
const TITULO_TOPO = 554;

// Tela dividida: imagem de 0 a 960 (com degradê de 100 px no pé), pessoa de 860 até o fim.
const DIV_IMG_ALTURA = 960;
const DIV_PESSOA_TOPO = 860;

const cenaSchema = z.object({
  duracao: z.number(),
  apresentadoraInicio: z.number().optional(), // segundo do vídeo tratado em que a cena começa
  zoom: z.number().optional(), // 1 e 1.15 alternando a cada corte
  tipo: z.enum(["pessoa", "dividida", "imagem"]).optional(), // padrão "pessoa"
  imagem: z.string().optional(), // obrigatória em "dividida" e "imagem"
});

export const ganchoTresImagensSchema = z.object({
  apresentadora: z.object({ arquivo: z.string() }),
  cenas: z.array(cenaSchema),
  gancho: z.object({
    imagens: z.array(z.string()).length(3),
    titulo: z.string(), // "\n" quebra linha
    fim: z.number(), // segundo em que o gancho some (início da 2ª frase)
  }),
  legendas: z.array(z.object({ texto: z.string(), inicio: z.number(), fim: z.number() })),
  cta: z.object({ texto: z.string(), inicio: z.number() }).optional(),
  legendaTopo: z.number().optional(), // tela cheia: topo da legenda, ~1 cm abaixo do queixo mais baixo (já com zoom)
  legendaTopoDividida: z.number().optional(), // tela dividida: na emenda, padrão 980
});

export type GanchoTresImagensProps = z.infer<typeof ganchoTresImagensSchema>;

export const calcularDuracao: CalculateMetadataFunction<GanchoTresImagensProps> = ({ props }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.cenas.reduce((s, c) => s + c.duracao, 0) * FPS),
});

const texto = (tamanho: number): React.CSSProperties => ({
  fontFamily: montserrat.fontFamily,
  fontWeight: 700,
  fontSize: tamanho,
  lineHeight: 1.08,
  color: AMARELO,
  textAlign: "center",
  whiteSpace: "pre-wrap",
  textShadow: SOMBRA,
});

const Pessoa: React.FC<{ arquivo: string; inicio: number; zoom: number; topo?: number }> = ({ arquivo, inicio, zoom, topo = 0 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: topo, bottom: 0, overflow: "hidden" }}>
    <OffthreadVideo
      src={midia(arquivo)}
      startFrom={Math.round(inicio * FPS)}
      muted
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: topo ? "50% 22%" : "50% 50%",
        transform: `scale(${zoom})`,
        transformOrigin: "50% 30%",
      }}
    />
  </div>
);

export const GanchoTresImagens: React.FC<GanchoTresImagensProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let ini = 0;
  const inicios = p.cenas.map((c) => {
    const i = ini;
    ini += c.duracao;
    return i;
  });
  const idx = Math.max(0, inicios.findIndex((s, i) => t >= s && t < s + p.cenas[i].duracao));
  const tipoAtual = p.cenas[idx]?.tipo ?? "pessoa";
  const noGancho = t < p.gancho.fim;
  const leg = noGancho ? undefined : p.legendas.find((l) => t >= l.inicio && t < l.fim);
  const ctaAtivo = p.cta && t >= p.cta.inicio;
  const topo = tipoAtual === "dividida" ? p.legendaTopoDividida ?? 980 : p.legendaTopo ?? 1180;
  const esquerdaImgs = (1080 - (3 * IMG_LADO + 2 * IMG_ESPACO)) / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {p.cenas.map((c, i) => {
        const tipo = c.tipo ?? "pessoa";
        const inicio = c.apresentadoraInicio ?? inicios[i];
        return (
          <Sequence key={i} from={Math.round(inicios[i] * FPS)} durationInFrames={Math.round(c.duracao * FPS)}>
            <AbsoluteFill style={{ overflow: "hidden" }}>
              {tipo === "pessoa" && <Pessoa arquivo={p.apresentadora.arquivo} inicio={inicio} zoom={c.zoom ?? 1} />}
              {tipo === "dividida" && (
                <>
                  <Pessoa arquivo={p.apresentadora.arquivo} inicio={inicio} zoom={c.zoom ?? 1} topo={DIV_PESSOA_TOPO} />
                  <Img
                    src={midia(c.imagem!)}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: 1080,
                      height: DIV_IMG_ALTURA,
                      objectFit: "cover",
                      WebkitMaskImage: `linear-gradient(to bottom, black ${DIV_IMG_ALTURA - 100}px, transparent ${DIV_IMG_ALTURA}px)`,
                      maskImage: `linear-gradient(to bottom, black ${DIV_IMG_ALTURA - 100}px, transparent ${DIV_IMG_ALTURA}px)`,
                    }}
                  />
                </>
              )}
              {tipo === "imagem" && <Img src={midia(c.imagem!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <Audio src={midia(p.apresentadora.arquivo)} />

      {/* Gancho: três imagens quadradas em fila e o título embaixo, parados, sem animação */}
      {noGancho && (
        <>
          {p.gancho.imagens.map((src, i) => (
            <Img
              key={i}
              src={midia(src)}
              style={{
                position: "absolute",
                left: esquerdaImgs + i * (IMG_LADO + IMG_ESPACO),
                top: IMG_TOPO,
                width: IMG_LADO,
                height: IMG_LADO,
                objectFit: "cover",
              }}
            />
          ))}
          <div style={{ position: "absolute", left: (1080 - LARGURA) / 2, width: LARGURA, top: TITULO_TOPO, display: "flex", justifyContent: "center" }}>
            <div style={texto(TITULO_TAMANHO)}>{p.gancho.titulo}</div>
          </div>
        </>
      )}

      {/* CTA: colado em cima da legenda, parado até o fim */}
      {ctaAtivo && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 1920 - topo + CTA_ESPACO, display: "flex", justifyContent: "center" }}>
          <div style={{ backgroundColor: "#7D1D2F", color: "white", fontFamily: montserrat.fontFamily, fontWeight: 700, fontSize: 52, padding: "10px 30px", borderRadius: 14 }}>
            {p.cta!.texto}
          </div>
        </div>
      )}

      {/* Legenda por frase, amarela, parada, sem animação */}
      {leg && (
        <div style={{ position: "absolute", left: (1080 - LARGURA) / 2, width: LARGURA, top: topo, display: "flex", justifyContent: "center" }}>
          <div style={texto(LEGENDA_TAMANHO)}>{leg.texto}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
