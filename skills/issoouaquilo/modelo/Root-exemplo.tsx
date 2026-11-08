import React from "react";
import { Composition } from "remotion";
import { IssoOuAquilo, issoOuAquiloSchema, calcularDuracao } from "./IssoOuAquilo";
import dados from "../dados.json"; // preencha seguindo modelo/exemplo-dados.json

export const Root: React.FC = () => (
  <Composition
    id="IssoOuAquilo"
    component={IssoOuAquilo}
    schema={issoOuAquiloSchema}
    calculateMetadata={calcularDuracao}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={300}
    defaultProps={dados as any}
  />
);
