import React from "react";
import { Composition } from "remotion";
import { TelaDivididaNoticia, telaDivididaSchema, calcularDuracao } from "./TelaDivididaNoticia";
export const Root: React.FC = () => (
  <Composition id="TelaDivididaNoticia" component={TelaDivididaNoticia} schema={telaDivididaSchema}
    calculateMetadata={calcularDuracao} width={1080} height={1920} fps={30} durationInFrames={300}
    defaultProps={{
      noticia: { arquivo: "noticia.mp4", inicio: 0, fim: 6, enquadramento: "50% 50%" },
      reacao: { arquivo: "reacao.mp4", inicio: 0, enquadramento: "50% 50%" },
      comentario: { arquivo: "comentario.mp4", duracao: 6, enquadramento: "50% 50%" },
      card: { nome: "Livia Brasil", usuario: "liviabrasilc", foto: "foto.png", verificado: true,
        manchete: "Empresário chama Virgínia de gananciosa e fala que ela ganhava 6x mais que ele" },
      legendas: [{ texto: "ele contratou a Virgínia", inicio: 0, fim: 3 }, { texto: "foi pagando", inicio: 3, fim: 6 }],
    }} />
);
