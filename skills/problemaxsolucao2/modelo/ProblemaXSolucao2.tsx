// Formato "Problema x solução 2" da Lívia Brasil (comando /problemaxsolucao2).
// Igual à referência: a pessoa fala para a câmera em tela cheia, sem música e sem efeitos sonoros.
//  - @ da pessoa pequeno no topo, fixo o vídeo inteiro.
//  - Primeira parte: uma tabela de 2 colunas sobre o peito, com os títulos das colunas (ex.: "SINTOMA" e "AÇÃO")
//    em Montserrat ExtraBold branca com sombra, e uma linha para cada item. No começo todas as linhas estão
//    tampadas por blocos sólidos: vermelhos na coluna da esquerda e verdes na da direita.
//    Quando a pessoa fala um item, o bloco dele some de uma vez (corte seco) e aparece o texto branco por baixo.
//  - Quando a tabela termina, ela sai da tela de uma vez e começa a legenda: 2 ou 3 palavras por vez, em MAIÚSCULAS,
//    Inter Bold branca, parada sempre no mesmo lugar, ~1 cm abaixo do queixo.
//  - CTA (regra da Lívia): caixa marsala "Comenta: PALAVRA" logo abaixo do queixo, colada em cima da legenda.
// Medidas tiradas do vídeo de referência (1080x1920).
// Atenção: o Remotion não aplica os valores padrão do schema nas props passadas por arquivo; por isso há "??" no código.
import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { z } from "zod";

const montserrat = loadMontserrat("normal", { weights: ["500", "800"], subsets: ["latin", "latin-ext"] });
const inter = loadInter("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
const midia = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

const FPS = 30;
const COL_X = [110, 572]; // esquerda de cada coluna (um pouco mais para dentro que a referência, para respeitar as margens do Instagram)
const COL_L = 398; // largura de cada coluna
const LINHA_A = 140; // altura de cada linha
const PASSO = 153; // distância entre as linhas
const VERMELHO = "#ED1D1D";
const VERDE = "#00AE07";
const SOMBRA = "0 3px 8px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.5)";

const celulaSchema = z.object({ texto: z.string(), aparece: z.number() }); // aparece = quando a pessoa fala o item

export const problemaXSolucao2Schema = z.object({
  apresentadora: z.object({ arquivo: z.string() }),
  cenas: z.array(z.object({ duracao: z.number(), apresentadoraInicio: z.number().optional() })),
  arroba: z.string().optional(), // ex.: "@liviabrasilc"
  colunas: z.array(z.string()), // títulos das 2 colunas, ex.: ["SINTOMA", "AÇÃO"]
  linhas: z.array(z.object({ esquerda: celulaSchema, direita: celulaSchema })),
  tabelaTopo: z.number().optional(), // topo dos títulos das colunas (px). Padrão 920 (igual à referência)
  tabelaFim: z.number(), // quando a tabela sai da tela (segundos)
  legendas: z.array(z.object({ texto: z.string(), inicio: z.number(), fim: z.number() })), // só depois da tabela
  legendaTopo: z.number().optional(), // topo da legenda (px), ~1 cm abaixo do queixo
  cta: z.object({ texto: z.string(), inicio: z.number() }).optional(),
});

export type ProblemaXSolucao2Props = z.infer<typeof problemaXSolucao2Schema>;

export const calcularDuracao: CalculateMetadataFunction<ProblemaXSolucao2Props> = ({ props }) => ({
  fps: FPS,
  durationInFrames: Math.round(props.cenas.reduce((s, c) => s + c.duracao, 0) * FPS),
});

export const ProblemaXSolucao2: React.FC<ProblemaXSolucao2Props> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let ini = 0;
  const inicios = p.cenas.map((c) => {
    const i = ini;
    ini += c.duracao;
    return i;
  });
  const topoTab = p.tabelaTopo ?? 920;
  const linhaTopo = (i: number) => topoTab + 132 + i * PASSO;
  const tabela = t < p.tabelaFim;
  const topo = p.legendaTopo ?? 1215;
  const leg = tabela ? undefined : p.legendas.find((l) => t >= l.inicio && t < l.fim);
  const ctaAtivo = !!p.cta && t >= p.cta.inicio;
  const aberto = (c: z.infer<typeof celulaSchema>) => frame >= Math.round(c.aparece * FPS);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {p.cenas.map((c, i) => (
        <Sequence key={i} from={Math.round(inicios[i] * FPS)} durationInFrames={Math.round(c.duracao * FPS)}>
          <OffthreadVideo
            src={midia(p.apresentadora.arquivo)}
            startFrom={Math.round((c.apresentadoraInicio ?? inicios[i]) * FPS)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>
      ))}
      <Audio src={midia(p.apresentadora.arquivo)} />

      {/* @ da pessoa, fixo no topo */}
      {p.arroba && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 128, textAlign: "center", fontFamily: montserrat.fontFamily, fontWeight: 500, fontSize: 36, color: "white", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
          {p.arroba}
        </div>
      )}

      {/* Tabela: títulos das colunas e linhas tampadas por blocos que somem quando o item é falado */}
      {tabela && (
        <>
          {p.colunas.slice(0, 2).map((titulo, k) => (
            <div
              key={`col-${k}`}
              style={{
                position: "absolute",
                left: COL_X[k] - 40,
                width: COL_L + 80,
                top: topoTab,
                textAlign: "center",
                fontFamily: montserrat.fontFamily,
                fontWeight: 800,
                fontSize: Math.min(76, Math.round(500 / Math.max(titulo.length, 1))), // palavra longa fica um pouco menor para caber
                lineHeight: "100px",
                letterSpacing: -3,
                color: "white",
                textShadow: SOMBRA,
                whiteSpace: "nowrap",
              }}
            >
              {titulo}
            </div>
          ))}
          {p.linhas.map((l, i) =>
            [l.esquerda, l.direita].map((c, k) => (
              <div
                key={`${i}-${k}`}
                style={{ position: "absolute", left: COL_X[k], width: COL_L, top: linhaTopo(i), height: LINHA_A, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {aberto(c) ? (
                  <div
                    style={{
                      textAlign: "center",
                      fontFamily: montserrat.fontFamily,
                      fontWeight: 800,
                      fontSize: 50,
                      lineHeight: "48px",
                      letterSpacing: -1.5,
                      color: "white",
                      textShadow: SOMBRA,
                      width: COL_L + 40,
                    }}
                  >
                    {c.texto}
                  </div>
                ) : (
                  <div style={{ position: "absolute", inset: 0, backgroundColor: k === 0 ? VERMELHO : VERDE }} />
                )}
              </div>
            )),
          )}
        </>
      )}

      {/* CTA: logo abaixo do queixo, colado em cima da legenda; parado até o fim */}
      {ctaAtivo && !tabela && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 1920 - topo + 6, display: "flex", justifyContent: "center" }}>
          <div style={{ backgroundColor: "#7D1D2F", color: "white", fontFamily: montserrat.fontFamily, fontWeight: 800, fontSize: 52, padding: "10px 30px", borderRadius: 14 }}>
            {p.cta!.texto}
          </div>
        </div>
      )}

      {/* Legenda: 2 ou 3 palavras por vez, parada sempre no mesmo lugar */}
      {leg && (
        <div
          style={{
            position: "absolute",
            top: topo,
            left: 40,
            right: 40,
            textAlign: "center",
            fontFamily: inter.fontFamily,
            fontWeight: 700,
            fontSize: 62,
            lineHeight: 1.1,
            letterSpacing: -1,
            color: "white",
            textShadow: "0 2px 6px rgba(0,0,0,0.35)",
          }}
        >
          {leg.texto}
        </div>
      )}
    </AbsoluteFill>
  );
};
