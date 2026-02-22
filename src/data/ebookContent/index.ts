import { introContent } from "./intro";
import { parte1Content } from "./parte1";
import { parte2Content } from "./parte2";
import { parte3Content } from "./parte3";
import { parte4Content } from "./parte4";
import { parte5Content } from "./parte5";
import { parte6Content } from "./parte6";
import { conclusaoContent } from "./conclusao";

export const ebookParts: Record<string, { title: string; subtitle: string; content: React.ReactNode }> = {
  "intro": {
    title: "Introdução",
    subtitle: "Por Que Este Livro Existe",
    content: introContent,
  },
  "parte-1": {
    title: "A Ciência Fundamental",
    subtitle: "Como emoções viram doenças",
    content: parte1Content,
  },
  "parte-2": {
    title: "Os 5 Padrões Universais",
    subtitle: "Identificando a origem dos seus sintomas",
    content: parte2Content,
  },
  "parte-3": {
    title: "Como Reprogramar Seu Cérebro",
    subtitle: "Neuroplasticidade, EMDR e PNL",
    content: parte3Content,
  },
  "parte-4": {
    title: "Espiritualidade Científica",
    subtitle: "A 4ª dimensão e a cura",
    content: parte4Content,
  },
  "parte-5": {
    title: "O Arsenal Físico",
    subtitle: "Suplementos, Dieta, Exercício, Sono e Respiração",
    content: parte5Content,
  },
  "parte-6": {
    title: "Onde Continuar Aprendendo",
    subtitle: "Livros, Cursos, Terapeutas e Recursos",
    content: parte6Content,
  },
  "conclusao": {
    title: "Conclusão",
    subtitle: "O Início do Fim dos Seus Padrões",
    content: conclusaoContent,
  },
};
