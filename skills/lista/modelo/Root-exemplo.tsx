import React from "react";
import { Composition } from "remotion";
import { Lista, listaSchema, calcularDuracao } from "./Lista";
import dados from "../dados.json"; // preencha seguindo modelo/exemplo-dados.json

export const Root: React.FC = () => (
  <Composition
    id="Lista"
    component={Lista}
    schema={listaSchema}
    calculateMetadata={calcularDuracao}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={300}
    defaultProps={dados as any}
  />
);
