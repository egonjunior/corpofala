export type DynamicId = "anchor" | "breathing" | "bodymap" | "release" | "inversion";

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
  },
  bodymap: {
    id: "bodymap",
    name: "Mapa do Corpo",
    word: "Corpo",
    description: "Escaneie e nomeie o que sente no corpo",
    color: "#FF7043",
    bgColor: "rgba(255,112,67,0.12)",
    icon: "M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z",
    forPatterns: [3, 5],
    whenToUse: "Quando não sabe o que sente, tensão difusa",
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
  },
};

export const DYNAMICS_LIST: DynamicInfo[] = Object.values(DYNAMICS);

export const DYNAMIC_ROUTES: Record<DynamicId, string> = {
  anchor: "/app/dinamicas/ancora",
  breathing: "/app/dinamicas/respiracao",
  bodymap: "/app/dinamicas/mapa-corpo",
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
  3: "bodymap",
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

// Body map — 11-zone anatomical model
export interface BodyZone {
  id: string;
  label: string;
  path: string;
  centerX: number;
  centerY: number;
  sensations: string[];
  emotionalMapping: Record<string, string>;
  sound: { frequency: number; type: OscillatorType; duration: number };
  color: string;
}

export const BODY_ZONES: Record<string, BodyZone> = {
  head: {
    id: "head", label: "Cabeça",
    path: "M160,12 C149,12 140,18 137,28 C134,38 134,48 138,56 C141,62 147,68 152,73 C155,76 158,78 160,79 C162,78 165,76 168,73 C173,68 179,62 182,56 C186,48 186,38 183,28 C180,18 171,12 160,12Z",
    centerX: 160, centerY: 45,
    sensations: ["Pressão", "Zumbido", "Vazio", "Peso"],
    emotionalMapping: { "pressão": "Pensamentos que não param", "zumbido": "Sobrecarga sensorial", "vazio": "Dissociação", "peso": "Exaustão mental" },
    sound: { frequency: 396, type: "sine", duration: 300 },
    color: "#FF4D4D",
  },
  throat: {
    id: "throat", label: "Garganta",
    path: "M153,79 C155,82 157,84 160,85 C163,84 165,82 167,79 C168,83 169,88 170,93 C170,96 168,99 165,101 C163,102 161,103 160,103 C159,103 157,102 155,101 C152,99 150,96 150,93 C151,88 152,83 153,79Z",
    centerX: 160, centerY: 91,
    sensations: ["Nó", "Aperto", "Queimação", "Bloqueio"],
    emotionalMapping: { "nó": "Palavra presa — algo que precisa ser dito", "aperto": "Emoção contida — choro ou raiva", "queimação": "Raiva não expressa", "bloqueio": "Medo de se expressar" },
    sound: { frequency: 285, type: "sine", duration: 400 },
    color: "#FF9A6C",
  },
  chest: {
    id: "chest", label: "Peito",
    path: "M134,108 C128,112 122,120 119,130 C116,140 115,150 115,158 C115,163 118,167 124,170 C132,174 146,176 160,176 C174,176 188,174 196,170 C202,167 205,163 205,158 C205,150 204,140 201,130 C198,120 192,112 186,108 C178,104 170,102 160,102 C150,102 142,104 134,108Z",
    centerX: 160, centerY: 140,
    sensations: ["Aperto", "Peso", "Queimação", "Vazio"],
    emotionalMapping: { "aperto": "Ansiedade ou medo", "peso": "Tristeza ou luto", "queimação": "Raiva dirigida ao coração", "vazio": "Perda ou solidão" },
    sound: { frequency: 528, type: "sine", duration: 500 },
    color: "#FF4D4D",
  },
  leftShoulder: {
    id: "leftShoulder", label: "Ombro Esq.",
    path: "M134,108 C128,106 120,106 114,108 C108,111 103,116 100,122 C97,128 96,135 96,142 C96,144 97,145 99,145 L115,145 C115,144 115,142 115,140 C115,134 116,127 119,121 C122,116 126,112 131,109 Z",
    centerX: 110, centerY: 126,
    sensations: ["Tensão", "Dor", "Peso", "Rigidez"],
    emotionalMapping: { "tensão": "Responsabilidade emocional", "dor": "Peso carregado há muito tempo", "peso": "Hiperresponsabilidade", "rigidez": "Resistência a pedir ajuda" },
    sound: { frequency: 417, type: "triangle", duration: 300 },
    color: "#C4622D",
  },
  rightShoulder: {
    id: "rightShoulder", label: "Ombro Dir.",
    path: "M186,108 C192,106 200,106 206,108 C212,111 217,116 220,122 C223,128 224,135 224,142 C224,144 223,145 221,145 L205,145 C205,144 205,142 205,140 C205,134 204,127 201,121 C198,116 194,112 189,109 Z",
    centerX: 210, centerY: 126,
    sensations: ["Tensão", "Dor", "Peso", "Rigidez"],
    emotionalMapping: { "tensão": "Pressão de performance", "dor": "Autoexigência", "peso": "Peso do passado", "rigidez": "Controle excessivo" },
    sound: { frequency: 417, type: "triangle", duration: 300 },
    color: "#C4622D",
  },
  stomach: {
    id: "stomach", label: "Estômago",
    path: "M128,176 C126,180 124,186 123,192 C122,198 122,204 123,209 C124,213 128,216 134,218 C142,220 150,221 160,221 C170,221 178,220 186,218 C192,216 196,213 197,209 C198,204 198,198 197,192 C196,186 194,180 192,176 C184,179 172,181 160,181 C148,181 136,179 128,176Z",
    centerX: 160, centerY: 198,
    sensations: ["Borboletas", "Náusea", "Vazio", "Aperto"],
    emotionalMapping: { "borboletas": "Ansiedade antecipatória", "náusea": "Rejeição ou nojo emocional", "vazio": "Fome afetiva", "aperto": "Medo visceral" },
    sound: { frequency: 174, type: "sine", duration: 400 },
    color: "#6B7FF5",
  },
  leftArm: {
    id: "leftArm", label: "Braço Esq.",
    path: "M99,145 C97,150 95,156 93,163 C90,172 87,182 85,192 C83,200 81,208 80,214 C79,219 80,223 83,225 C86,227 89,225 91,221 C93,216 95,208 97,199 C99,190 101,181 103,173 C106,164 110,156 115,150 L115,145 Z",
    centerX: 94, centerY: 185,
    sensations: ["Formigamento", "Peso", "Tensão", "Vazio"],
    emotionalMapping: { "formigamento": "Energia bloqueada — não agiu", "peso": "Impotência", "tensão": "Vontade de afastar algo", "vazio": "Distância afetiva" },
    sound: { frequency: 285, type: "triangle", duration: 200 },
    color: "#98FF98",
  },
  rightArm: {
    id: "rightArm", label: "Braço Dir.",
    path: "M221,145 C223,150 225,156 227,163 C230,172 233,182 235,192 C237,200 239,208 240,214 C241,219 240,223 237,225 C234,227 231,225 229,221 C227,216 225,208 223,199 C221,190 219,181 217,173 C214,164 210,156 205,150 L205,145 Z",
    centerX: 226, centerY: 185,
    sensations: ["Formigamento", "Peso", "Tensão", "Vazio"],
    emotionalMapping: { "formigamento": "Impulso de agir — ação bloqueada", "peso": "Cansaço de carregar", "tensão": "Raiva contida", "vazio": "Desconexão" },
    sound: { frequency: 285, type: "triangle", duration: 200 },
    color: "#98FF98",
  },
  lowerBack: {
    id: "lowerBack", label: "Lombar",
    path: "M130,218 C128,224 126,232 126,238 C126,244 127,250 130,254 C134,259 142,262 150,264 C155,265 160,265 160,265 C160,265 165,265 170,264 C178,262 186,259 190,254 C193,250 194,244 194,238 C194,232 192,224 190,218 C182,221 172,223 160,223 C148,223 138,221 130,218Z",
    centerX: 160, centerY: 242,
    sensations: ["Dor", "Tensão", "Peso", "Fadiga"],
    emotionalMapping: { "dor": "Carga emocional carregada literalmente", "tensão": "Hiperresponsabilidade crônica", "peso": "O que você sustenta sozinho", "fadiga": "Esgotamento de longo prazo" },
    sound: { frequency: 174, type: "triangle", duration: 500 },
    color: "#8A7FF5",
  },
  leftLeg: {
    id: "leftLeg", label: "Perna Esq.",
    path: "M147,264 C146,272 144,282 143,292 C141,306 139,320 138,334 C137,344 136,354 136,362 C136,368 137,374 139,378 C141,381 143,382 145,381 C147,380 148,377 149,373 C150,367 151,358 152,348 C153,338 154,326 154,314 C155,302 155,290 156,280 C156,274 156,268 156,264 C153,265 150,265 147,264Z",
    centerX: 146, centerY: 324,
    sensations: ["Peso", "Formigamento", "Tensão", "Fraqueza"],
    emotionalMapping: { "peso": "Dificuldade de avançar", "formigamento": "Ansiedade de movimento", "tensão": "Resistência a ir embora", "fraqueza": "Falta de sustentação" },
    sound: { frequency: 396, type: "triangle", duration: 200 },
    color: "#00BCD4",
  },
  rightLeg: {
    id: "rightLeg", label: "Perna Dir.",
    path: "M173,264 C174,272 176,282 177,292 C179,306 181,320 182,334 C183,344 184,354 184,362 C184,368 183,374 181,378 C179,381 177,382 175,381 C173,380 172,377 171,373 C170,367 169,358 168,348 C167,338 166,326 166,314 C165,302 165,290 164,280 C164,274 164,268 164,264 C167,265 170,265 173,264Z",
    centerX: 174, centerY: 324,
    sensations: ["Peso", "Formigamento", "Tensão", "Fraqueza"],
    emotionalMapping: { "peso": "Hesitação", "formigamento": "Urgência de sair, de fugir", "tensão": "Contenção do movimento", "fraqueza": "Colapso de energia" },
    sound: { frequency: 396, type: "triangle", duration: 200 },
    color: "#00BCD4",
  },
};

export const BODY_ZONES_LIST = Object.values(BODY_ZONES);

// Legacy compat
export const BODY_REGIONS = BODY_ZONES_LIST.map(z => ({
  id: z.id, name: z.label, x: 50, y: 50, w: 20, h: 10,
}));

export type BodyFeeling = "dor" | "tensao" | "peso" | "formigamento" | "nada";

export const FEELING_LABELS: Record<BodyFeeling, string> = {
  dor: "Dor",
  tensao: "Tensão",
  peso: "Peso",
  formigamento: "Formigamento",
  nada: "Nada",
};

// Map reflection generator
export const generateMapReflection = (markedZoneIds: string[]): string => {
  if (markedZoneIds.length === 0) return "";
  const names = markedZoneIds.map(id => BODY_ZONES[id]?.label.toLowerCase()).filter(Boolean);
  if (markedZoneIds.length === 1) {
    return `Você sente algo em ${names[0]}. Reconhecer já é o primeiro passo.`;
  }
  if (markedZoneIds.includes("chest") && markedZoneIds.includes("stomach")) {
    return "Peito e estômago ao mesmo tempo. Seu corpo carrega algo grande — e você teve coragem de olhar.";
  }
  if (markedZoneIds.includes("throat") && markedZoneIds.includes("chest")) {
    return "Algo quer ser dito e não saiu ainda. Seu corpo guarda a palavra. Quando estiver pronto, ela vai sair.";
  }
  return `${names.length} lugares no seu corpo carregando o que você sente. Ver isso com clareza já muda algo.`;
};

// Recommendation engine
export const generateRecommendation = (markedZoneIds: string[], sensationsMap: Record<string, string[]>): { dynamicId: DynamicId; reason: string } => {
  const hasChest = markedZoneIds.includes("chest");
  const hasStomach = markedZoneIds.includes("stomach");
  const hasThroat = markedZoneIds.includes("throat");
  const hasHead = markedZoneIds.includes("head");
  const hasBack = markedZoneIds.includes("lowerBack") || markedZoneIds.includes("leftShoulder") || markedZoneIds.includes("rightShoulder");

  if (hasChest && hasStomach) return { dynamicId: "breathing", reason: "Peito e estômago juntos pedem respiração profunda." };
  if (markedZoneIds.length <= 1 || hasHead) return { dynamicId: "anchor", reason: "A âncora vai trazer você de volta ao corpo." };
  if (hasThroat) return { dynamicId: "release", reason: "Algo preso na garganta precisa de espaço para sair." };
  if (hasBack) return { dynamicId: "inversion", reason: "Você carrega peso — inverter a perspectiva vai ajudar." };
  return { dynamicId: "breathing", reason: "A respiração é o ponto de partida mais eficaz." };
};
