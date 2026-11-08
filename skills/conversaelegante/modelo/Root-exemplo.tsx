import React from "react";
import { Composition } from "remotion";
import { ConversaElegante, conversaEleganteSchema, calcularDuracaoElegante } from "./ConversaElegante";
import dados from "../dados.json"; // preencha seguindo modelo/exemplo-dados.json

export const Root: React.FC = () => (
  <Composition
    id="ConversaElegante"
    component={ConversaElegante}
    schema={conversaEleganteSchema}
    calculateMetadata={calcularDuracaoElegante}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={300}
    defaultProps={dados as any}
  />
);
