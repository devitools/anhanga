import { ptBR } from "@anhanga/core";
import { configureI18n } from "@anhanga/react-web";
import { ptBR as local } from "./locales/pt-BR";

export default configureI18n({
  resources: {
    "pt-BR": { translation: { ...ptBR, ...local } },
  },
  default: "pt-BR",
  fallback: "pt-BR",
});
