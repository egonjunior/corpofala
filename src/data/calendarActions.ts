export interface CalendarWeek {
  label: string;
  theme: string;
  description: string;
  days: string[];
}

export const calendarWeeks: CalendarWeek[] = [
  {
    label: "Semana 1",
    theme: "IDENTIFICAÇÃO",
    description: "Observe seus gatilhos sem tentar mudar nada",
    days: [
      "Identifica 1 gatilho",
      "Onde sente no corpo?",
      "Nomeia a emoção",
      "Quando começou hoje?",
      "Padrão de repetição?",
      "Escreve 1 linha sobre",
      "Revisa a semana",
    ],
  },
  {
    label: "Semana 2",
    theme: "INTERRUPÇÃO",
    description: "Comece a criar espaço entre gatilho e reação",
    days: [
      "Pausa antes de reagir",
      "Respira 4-7-8 (3 ciclos)",
      "Nomeia em voz alta",
      "Escreve sem julgar",
      "Identifica a crença",
      "Questiona a crença",
      "Revisa a semana",
    ],
  },
  {
    label: "Semana 3",
    theme: "REESCRITA",
    description: "Substitua a resposta antiga por uma nova",
    days: [
      "Nova resposta possível?",
      "Pratica a nova resposta",
      "Como se sentiu?",
      "Repete nova resposta",
      "Reconhece o progresso",
      "Ajusta se necessário",
      "Revisa a semana",
    ],
  },
  {
    label: "Semana 4",
    theme: "CONSOLIDAÇÃO",
    description: "Reforce até virar automático",
    days: [
      "Qual o novo padrão?",
      "Reforça com prática",
      "Identifica próximo gatilho",
      "Nova resposta automática?",
      "Celebra as mudanças",
      "Escreve o que aprendeu",
      "Define próximos passos",
    ],
  },
];

export const DAY_LABELS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
