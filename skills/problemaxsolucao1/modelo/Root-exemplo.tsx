import React from "react";
import { Composition } from "remotion";
import { ProblemaXSolucao, problemaXSolucaoSchema, calcularDuracao } from "./ProblemaXSolucao";
import dados from "../dados.json"; // preencha seguindo modelo/exemplo-dados.json

export const Root: React.FC = () => (
  <Composition
    id="ProblemaXSolucao"
    component={ProblemaXSolucao}
    schema={problemaXSolucaoSchema}
    calculateMetadata={calcularDuracao}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={300}
    defaultProps={dados as any}
  />
);
