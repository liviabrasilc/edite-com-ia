import React from "react";
import { Composition } from "remotion";
import { Bastidor, bastidorSchema, calcularDuracaoBastidor } from "./Bastidor";
import dados from "../dados.json"; // preencha seguindo modelo/exemplo-dados.json

export const Root: React.FC = () => (
  <Composition
    id="Bastidor"
    component={Bastidor}
    schema={bastidorSchema}
    calculateMetadata={calcularDuracaoBastidor}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={300}
    defaultProps={dados as any}
  />
);
