import React from "react";
import { introParagraphs } from "@/data/readerContent/intro";
import { parte1Paragraphs } from "@/data/readerContent/parte1";
import { parte2Paragraphs } from "@/data/readerContent/parte2";
import { parte3Paragraphs } from "@/data/readerContent/parte3";
import { parte4Paragraphs } from "@/data/readerContent/parte4";
import { parte5Paragraphs } from "@/data/readerContent/parte5";
import { parte6Paragraphs } from "@/data/readerContent/parte6";
import { conclusaoParagraphs } from "@/data/readerContent/conclusao";

export interface ReaderParagraph {
  text: string;
  type?: "normal" | "heading" | "subheading" | "quote" | "list-item" | "divider" | "reference-title" | "reference-text";
}

export interface ReaderChapter {
  slug: string;
  title: string;
  subtitle: string;
  paragraphs: ReaderParagraph[];
  // Interaction insertion points (paragraph index)
  interactionAfter?: Record<number, "pause" | "fixation">;
  patternSliders?: boolean;
  patternReveal?: boolean;
  readingContract?: boolean;
}

export interface PatternScores {
  pattern1: number;
  pattern2: number;
  pattern3: number;
  pattern4: number;
  pattern5: number;
}

export const PATTERN_NAMES: Record<string, string> = {
  pattern1: "Doença = Atenção",
  pattern2: "Raiva Engolida",
  pattern3: "Hipercontrole",
  pattern4: "Medo e Trauma Não Processado",
  pattern5: "Autossabotagem",
};

export const readerChapters: ReaderChapter[] = [
  {
    slug: "intro",
    title: "Introdução",
    subtitle: "Por Que Este Livro Existe",
    readingContract: true,
    paragraphs: introParagraphs,
  },
  {
    slug: "parte-1",
    title: "A Ciência Fundamental",
    subtitle: "Como emoções viram doenças",
    paragraphs: parte1Paragraphs,
    interactionAfter: (() => {
      // Place pause after section 1.2 (before 1.3 heading)
      const pauseIdx = parte1Paragraphs.findIndex(p => p.text.startsWith("1.3 Epigenética")) - 2;
      // Place fixation test after section 1.4 cases (before summary)
      const fixIdx = parte1Paragraphs.findIndex(p => p.text.startsWith("Resumo do Capítulo 1")) - 2;
      const map: Record<number, "pause" | "fixation"> = {};
      if (pauseIdx > 0) map[pauseIdx] = "pause";
      if (fixIdx > 0) map[fixIdx] = "fixation";
      return map;
    })(),
  },
  {
    slug: "parte-2",
    title: "Os 5 Padrões Universais",
    subtitle: "Identificando a origem dos seus sintomas",
    paragraphs: parte2Paragraphs,
    patternSliders: true,
    patternReveal: true,
  },
  {
    slug: "parte-3",
    title: "Como Reprogramar Seu Cérebro",
    subtitle: "Neuroplasticidade, EMDR e PNL",
    paragraphs: parte3Paragraphs,
  },
  {
    slug: "parte-4",
    title: "Espiritualidade Científica",
    subtitle: "A 4ª dimensão e a cura",
    paragraphs: parte4Paragraphs,
  },
  {
    slug: "parte-5",
    title: "O Arsenal Físico",
    subtitle: "Suplementos, Dieta, Exercício, Sono e Respiração",
    paragraphs: parte5Paragraphs,
  },
  {
    slug: "parte-6",
    title: "Onde Continuar Aprendendo",
    subtitle: "Livros, Cursos, Terapeutas e Recursos",
    paragraphs: parte6Paragraphs,
  },
  {
    slug: "conclusao",
    title: "Conclusão",
    subtitle: "O Início do Fim dos Seus Padrões",
    paragraphs: conclusaoParagraphs,
  },
];

// Word count helper
export function countWords(chapter: ReaderChapter): number {
  return chapter.paragraphs.reduce((acc, p) => acc + p.text.split(/\s+/).length, 0);
}

export function estimateReadingTime(chapter: ReaderChapter): number {
  return Math.max(1, Math.ceil(countWords(chapter) / 200));
}
