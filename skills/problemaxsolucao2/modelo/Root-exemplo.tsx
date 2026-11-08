import React from "react";
import { Composition } from "remotion";
import { ProblemaXSolucao2, problemaXSolucao2Schema, calcularDuracao } from "./ProblemaXSolucao2";
import dados from "../dados.json"; // preencha seguindo modelo/exemplo-dados.json

export const Root: React.FC = () => (
  <Composition
    id="ProblemaXSolucao2"
    component={ProblemaXSolucao2}
    schema={problemaXSolucao2Schema}
    calculateMetadata={calcularDuracao}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={300}
    defaultProps={dados as any}
  />
);
