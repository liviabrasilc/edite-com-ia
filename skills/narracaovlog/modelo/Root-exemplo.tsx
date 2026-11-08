import React from "react";
import { Composition } from "remotion";
import { NarracaoVlog, narracaoVlogSchema, calcularDuracao } from "./NarracaoVlog";
import dados from "../dados.json"; // preencha seguindo modelo/exemplo-dados.json

export const Root: React.FC = () => (
  <Composition
    id="NarracaoVlog"
    component={NarracaoVlog}
    schema={narracaoVlogSchema}
    calculateMetadata={calcularDuracao}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={300}
    defaultProps={dados as any}
  />
);
