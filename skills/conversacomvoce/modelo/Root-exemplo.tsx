import React from "react";
import { Composition } from "remotion";
import { ConversaComVoce, conversaComVoceSchema, calcularDuracaoConversa } from "./ConversaComVoce";
import dados from "../dados.json"; // preencha seguindo modelo/exemplo-dados.json

export const Root: React.FC = () => (
  <Composition
    id="ConversaComVoce"
    component={ConversaComVoce}
    schema={conversaComVoceSchema}
    calculateMetadata={calcularDuracaoConversa}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={300}
    defaultProps={dados as any}
  />
);
