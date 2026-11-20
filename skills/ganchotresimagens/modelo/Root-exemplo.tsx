import React from "react";
import { Composition } from "remotion";
import { GanchoTresImagens, ganchoTresImagensSchema, calcularDuracao } from "./GanchoTresImagens";
import dados from "../dados.json"; // preencha seguindo modelo/exemplo-dados.json

export const Root: React.FC = () => (
  <Composition
    id="GanchoTresImagens"
    component={GanchoTresImagens}
    schema={ganchoTresImagensSchema}
    calculateMetadata={calcularDuracao}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={300}
    defaultProps={dados as any}
  />
);
