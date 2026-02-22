import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface FixationTestProps {
  done: boolean;
  onComplete: () => void;
  darkMode: boolean;
}

const WORDS = [
  { text: "emoção", correct: true, slot: 0 },
  { text: "processar", correct: true, slot: 1 },
  { text: "ignorar", correct: false, slot: -1 },
];

const FixationTest = ({ done, onComplete, darkMode }: FixationTestProps) => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState<(string | null)[]>([null, null]);
  const [available, setAvailable] = useState(WORDS.map((w) => w.text));
  const [result, setResult] = useState<"correct" | "incorrect" | null>(done ? "correct" : null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // If already done, show completed state
  const isCompleted = done || result === "correct";

  const handleWordClick = (word: string) => {
    if (isCompleted) return;
    setSelectedWord(word);
  };

  const handleSlotClick = (slotIndex: number) => {
    if (!selectedWord || isCompleted) return;
    const newSlots = [...slots];
    if (newSlots[slotIndex]) {
      setAvailable((prev) => [...prev, newSlots[slotIndex]!]);
    }
    newSlots[slotIndex] = selectedWord;
    setSlots(newSlots);
    setAvailable((prev) => prev.filter((w) => w !== selectedWord));
    setSelectedWord(null);

    if (newSlots[0] && newSlots[1]) {
      const isCorrect = newSlots[0] === "emoção" && newSlots[1] === "processar";
      setResult(isCorrect ? "correct" : "incorrect");
      if (isCorrect) {
        onComplete();
      }
    }
  };

  const handleRetry = () => {
    setSlots([null, null]);
    setAvailable(WORDS.map((w) => w.text));
    setResult(null);
    setSelectedWord(null);
  };

  const borderColor = result === "correct" ? "#C4622D" : darkMode ? "rgba(255,255,255,0.08)" : "rgba(26,21,32,0.08)";

  const slotStyle = (filled: boolean) => ({
    display: "inline-block",
    minWidth: 80,
    textAlign: "center" as const,
    padding: "2px 8px",
    background: darkMode ? "rgba(255,255,255,0.05)" : "#F2EDE4",
    borderBottom: `2px solid ${filled ? "#C4622D" : darkMode ? "rgba(196,98,45,0.4)" : "#C4622D"}`,
    borderRadius: 2,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 17,
    color: filled ? (darkMode ? "rgba(255,255,255,0.8)" : "#2A2035") : "transparent",
    lineHeight: 2,
    transition: "all 0.2s",
  });

  return (
    <div style={{ margin: "40px 0" }}>
      <div
        style={{
          background: darkMode ? "#2A2035" : "white",
          borderRadius: 12,
          border: `1px solid ${borderColor}`,
          padding: 28,
          transition: "border-color 0.3s",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            color: "#C4622D",
            letterSpacing: "0.2em",
            display: "block",
            marginBottom: 12,
          }}
        >
          FIXAÇÃO · CAPÍTULO 1
        </span>

        <h3
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 18,
            color: darkMode ? "rgba(255,255,255,0.9)" : "#1A1520",
            marginBottom: 16,
          }}
        >
          Complete a frase:
        </h3>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: darkMode ? "rgba(255,255,255,0.75)" : "#2A2035", lineHeight: 2 }}>
          O corpo transforma{" "}
          <span onClick={() => handleSlotClick(0)} style={slotStyle(isCompleted || !!slots[0])}>
            {isCompleted ? "emoção" : (slots[0] || "___")}
          </span>{" "}
          em sintoma físico quando não há outra forma de{" "}
          <span onClick={() => handleSlotClick(1)} style={slotStyle(isCompleted || !!slots[1])}>
            {isCompleted ? "processar" : (slots[1] || "___")}
          </span>
          .
        </p>

        {/* Word chips — hide when completed */}
        {!isCompleted && (
          <div className="flex flex-wrap gap-2 mt-4">
            {available.map((word) => (
              <button
                key={word}
                onClick={() => handleWordClick(word)}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  background: darkMode ? "rgba(255,255,255,0.05)" : "#F2EDE4",
                  border: `1px solid ${
                    selectedWord === word ? "#C4622D" : darkMode ? "rgba(255,255,255,0.12)" : "#D4C9BF"
                  }`,
                  borderRadius: 100,
                  padding: "6px 14px",
                  cursor: "pointer",
                  color: darkMode ? "rgba(255,255,255,0.7)" : "#2A2035",
                  transition: "border-color 0.2s",
                }}
              >
                {word}
              </button>
            ))}
          </div>
        )}

        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-4"
          >
            <Check size={16} color="#C4622D" />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#C4622D" }}>
              Exato.
            </span>
          </motion.div>
        )}

        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 mt-4"
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{
                background: darkMode ? "rgba(255,255,255,0.06)" : "#F2EDE4",
                borderRadius: 8,
                padding: "10px 20px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: darkMode ? "rgba(255,255,255,0.7)" : "#6A5A55",
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "#D4C9BF"}`,
                cursor: "pointer",
              }}
            >
              ↑ Reler capítulo
            </button>
            <button
              onClick={() => navigate("/app/ebook/parte-2")}
              style={{
                background: "#C4622D",
                borderRadius: 8,
                padding: "10px 20px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Ir para o Capítulo 2 →
            </button>
          </motion.div>
        )}

        {result === "incorrect" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#8A7A70" }}>
              Quase. Relê este trecho →{" "}
              <button
                onClick={handleRetry}
                style={{
                  color: "#C4622D",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                }}
              >
                Tentar novamente
              </button>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FixationTest;
