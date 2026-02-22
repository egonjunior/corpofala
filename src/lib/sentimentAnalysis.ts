// Client-side keyword-based sentiment analysis for pt-BR

export type Sentiment = "anxious" | "angry" | "sad" | "critical" | "neutral";

const KEYWORDS: Record<Exclude<Sentiment, "neutral">, string[]> = {
  anxious: ["ansioso", "ansiosa", "preocupado", "preocupada", "medo", "acontecer", "e se", "vai dar", "perder", "errar", "nervoso", "nervosa", "pânico", "panico"],
  angry: ["raiva", "ódio", "odio", "odeio", "injusto", "absurdo", "culpa", "não aguento", "nao aguento", "irritado", "irritada"],
  sad: ["triste", "cansado", "cansada", "sozinho", "sozinha", "perdido", "perdida", "sem saída", "sem saida", "não adianta", "nao adianta", "nunca", "vazio", "vazia"],
  critical: ["fracasso", "idiota", "burro", "burra", "inútil", "inutel", "não presto", "nao presto", "sempre errei", "nunca consigo", "incapaz"],
};

const COLORS: Record<Sentiment, string> = {
  anxious: "#FF9A6C",
  angry: "#FF6464",
  sad: "#6B7FF5",
  critical: "#C4622D",
  neutral: "rgba(200,200,220,0.8)",
};

export const detectSentiment = (text: string): Sentiment => {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};
  for (const [key, words] of Object.entries(KEYWORDS)) {
    scores[key] = words.filter((w) => lower.includes(w)).length;
  }
  const best = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
  return best[1] > 0 ? (best[0] as Sentiment) : "neutral";
};

export const getSentimentColor = (text: string): string => {
  return COLORS[detectSentiment(text)];
};

export const getColorForSentiment = (s: Sentiment): string => COLORS[s];
