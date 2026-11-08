import React from "react";
import { Composition } from "remotion";
import { TelaVerde, telaVerdeSchema, calcularDuracaoTelaVerde } from "./TelaVerde";
import dados from "../dados.json"; // preencha seguindo modelo/exemplo-dados.json

export const Root: React.FC = () => (
  <Composition
    id="TelaVerde"
    component={TelaVerde}
    schema={telaVerdeSchema}
    calculateMetadata={calcularDuracaoTelaVerde}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={300}
    defaultProps={dados as any}
  />
);
