export type DynamicId = "anchor" | "breathing" | "butterfly" | "release" | "inversion";

export interface DynamicInfo {
  id: DynamicId;
  name: string;
  word: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string; // SVG path
  forPatterns: number[];
  whenToUse: string;
  science: {
    mechanism: string;
    sources: string;
  };
}

export const DYNAMICS: Record<DynamicId, DynamicInfo> = {
  anchor: {
    id: "anchor",
    name: "Âncora",
    word: "Âncora",
    description: "Grounding 5-4-3-2-1 — quando está fora do corpo",
    color: "#00BCD4",
    bgColor: "rgba(0,188,212,0.12)",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z",
    forPatterns: [1, 4],
    whenToUse: "Pânico, dissociação, 'não estou no meu corpo'",
    science: {
      mechanism: "Técnica de enraizamento sensorial (Sensory Grounding). Desvia o foco do córtex pré-frontal (onde ocorre o pensamento ansioso ou catastrófico) ativando áreas parietais do processamento visual, tátil e auditivo no momento presente. Isso envia um sinal de 'ausência de ameaça imediata' para a amígdala.",
      sources: "Protocolos de regulação emocional da TCC (Terapia Cognitivo-Comportamental); Intervenções padrão ouro para TEPT (Transtorno de Estresse Pós-Traumático) recomendadas pela APA (Associação Americana de Psiquiatria)."
    }
  },
  breathing: {
    id: "breathing",
    name: "Respiração",
    word: "Respirar",
    description: "Ciclo 4-7-8 — quando está acelerado",
    color: "#7C4DFF",
    bgColor: "rgba(124,77,255,0.12)",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.22.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
    forPatterns: [2, 3],
    whenToUse: "Ansiedade, coração acelerado, respiração curta",
    science: {
      mechanism: "A expiração prolongada (8 segundos) estimula mecanicamente o nervo vago, ativando imediatamente o sistema nervoso parassimpático. Essa ativação diminui a frequência cardíaca e a pressão arterial, quebrando a resposta fisiológica de 'luta ou fuga' desencadeada pelo sistema simpático.",
      sources: "Método popularizado pelo Dr. Andrew Weil baseado no Pranayama; Estudos de variabilidade da frequência cardíaca na Psicofisiologia."
    }
  },
  butterfly: {
    id: "butterfly",
    name: "Abraço da Borboleta",
    word: "Borboleta",
    description: "Estimulação bilateral — quando precisa se acalmar",
    color: "#CE93D8",
    bgColor: "rgba(206,147,216,0.12)",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    forPatterns: [3, 5],
    whenToUse: "Ansiedade, pânico, tristeza, angústia — alívio imediato",
    science: {
      mechanism: "Estimulação Bilateral Alternada, princípio fundamental do EMDR. O estímulo cruzado recruta ambos os hemisférios cerebrais aumentando a capacidade de processamento de memórias de trabalho e desativando rapidamente a hiper-reatividade da amígdala cerebral em situações de alto estresse e desamparo.",
      sources: "Desenvolvido por Lucina Artigas e Ignacio Jarero (1998) em abrigos durante desastres. A terapia EMDR é recomendada pela Organização Mundial da Saúde (OMS) no tratamento de trauma e eventos agudos de estresse."
    }
  },
  release: {
    id: "release",
    name: "Soltar Pensamento",
    word: "Soltar",
    description: "Escreva e deixe ir — quando o pensamento não para",
    color: "#26A69A",
    bgColor: "rgba(38,166,154,0.12)",
    icon: "M7 14l5-5 5 5H7zm5-13C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1z",
    forPatterns: [2, 4],
    whenToUse: "Ruminação, pensamento obsessivo, loop mental",
    science: {
      mechanism: "Utiliza os princípios de Desfusão Cognitiva e Expressão Escrita. Transferir o foco obsessivo para o plano motor verbal/escrito externaliza a carga cognitiva da ruminação. Ao observar o pensamento 'sumir', treinamos o cérebro a separar a identidade do indivíduo de seus pensamentos automáticos (Defusão).",
      sources: "TCC de Terceira Onda, especificamente ACT (Terapia de Aceitação e Compromisso); Protocolos de Escrita Expressiva de James Pennebaker, evidenciados na melhora de marcadores imunológicos e emocionais."
    }
  },
  inversion: {
    id: "inversion",
    name: "Inverter Perspectiva",
    word: "Inverter",
    description: "Reescreva pensamentos destrutivos",
    color: "#C4622D",
    bgColor: "rgba(196,98,45,0.12)",
    icon: "M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z",
    forPatterns: [1, 5],
    whenToUse: "Loop destrutivo, autocrítica, catastrofização",
    science: {
      mechanism: "Processo estruturado de Reestruturação Cognitiva. Ensina o cérebro a identificar, questionar e desafiar distorções cognitivas (como generalização, catastrofização ou salto para conclusões). Ao intervir conscientemente entre um pensamento automático negativo e a resposta emocional, criam-se caminhos neurais mais adaptativos.",
      sources: "Protocolos fundadores da Terapia Cognitiva de Aaron Beck (década de 1960). Inúmeros ensaios clínicos randomizados demonstram que questionar a validade dos próprios pensamentos altera a atividade no córtex pré-frontal ventromedial."
    }
  },
};

export const DYNAMICS_LIST: DynamicInfo[] = Object.values(DYNAMICS);

export const DYNAMIC_ROUTES: Record<DynamicId, string> = {
  anchor: "/app/dinamicas/ancora",
  breathing: "/app/dinamicas/respiracao",
  butterfly: "/app/dinamicas/borboleta",
  release: "/app/dinamicas/soltar",
  inversion: "/app/dinamicas/inverter",
};

export interface BadgeDef {
  id: string;
  name: string;
  dynamicId: DynamicId | "global";
  condition: "uses" | "streak" | "explorer";
  threshold: number;
  icon: string;
}

export const BADGES: BadgeDef[] = [
  // Per-dynamic badges
  ...DYNAMICS_LIST.flatMap((d) => [
    { id: `${d.id}_bronze`, name: `${d.word} Bronze`, dynamicId: d.id as DynamicId, condition: "uses" as const, threshold: 3, icon: "🥉" },
    { id: `${d.id}_silver`, name: `${d.word} Prata`, dynamicId: d.id as DynamicId, condition: "uses" as const, threshold: 10, icon: "🥈" },
    { id: `${d.id}_gold`, name: `${d.word} Ouro`, dynamicId: d.id as DynamicId, condition: "uses" as const, threshold: 30, icon: "🥇" },
  ]),
  // Global badges
  { id: "consistency", name: "Constância", dynamicId: "global", condition: "streak", threshold: 7, icon: "🔥" },
  { id: "explorer", name: "Explorador", dynamicId: "global", condition: "explorer", threshold: 5, icon: "🧭" },
];

export const PATTERN_TO_DYNAMIC: Record<number, DynamicId> = {
  1: "anchor",
  2: "breathing",
  3: "butterfly",
  4: "release",
  5: "inversion",
};

// Inversion thoughts for Dinâmica 5
export const INVERSION_THOUGHTS = [
  { negative: "Eu sou um peso para todo mundo.", positive: "As pessoas que me amam escolhem estar comigo." },
  { negative: "Nada do que eu faço é suficiente.", positive: "Eu estou fazendo o melhor que posso com o que tenho agora." },
  { negative: "Eu nunca vou melhorar.", positive: "Cada dia que eu pratico é um dia de progresso." },
  { negative: "Todo mundo está me julgando.", positive: "A maioria das pessoas está ocupada demais consigo mesmas." },
  { negative: "Eu deveria conseguir lidar com isso sozinho.", positive: "Pedir ajuda é sinal de coragem, não de fraqueza." },
  { negative: "Eu sou fraco por sentir isso.", positive: "Sentir é humano. Eu estou sendo honesto comigo." },
  { negative: "Vai ser sempre assim.", positive: "Crises passam. Eu já sobrevivi a todas as anteriores." },
  { negative: "Eu não mereço me sentir bem.", positive: "Eu mereço paz tanto quanto qualquer pessoa." },
];


