import { motion, AnimatePresence } from "framer-motion";
import { PATTERN_NAMES, type PatternScores } from "@/data/readerContent";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { haptic } from "@/lib/haptics";
import { chimeReveal, chimeCompletion } from "@/lib/audio";

interface PatternRevealProps {
  patternScores: PatternScores;
  onReveal: () => void;
  darkMode: boolean;
  allSlidersCompleted: boolean;
}

/* ── Confetti particle ────────────────────────────────── */
const Particle = ({ delay, x }: { delay: number; x: number }) => (
  <motion.div
    initial={{ opacity: 1, y: 0, x, scale: 1 }}
    animate={{ opacity: 0, y: -120, x: x + (Math.random() - 0.5) * 80, scale: 0 }}
    transition={{ duration: 1.5, delay, ease: "easeOut" }}
    style={{
      position: "absolute",
      bottom: 0,
      left: "50%",
      width: 4,
      height: 4,
      borderRadius: 2,
      background: ["#C4622D", "#00BCD4", "#F2EDE4", "#FFB74D", "#81C784"][
        Math.floor(Math.random() * 5)
      ],
    }}
  />
);

const PatternReveal = ({ patternScores, onReveal, darkMode, allSlidersCompleted }: PatternRevealProps) => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"waiting" | "revealing" | "revealed">("waiting");
  const [particles, setParticles] = useState<{ id: number; delay: number; x: number }[]>([]);

  if (!allSlidersCompleted) return null;

  // Find dominant pattern
  const entries = Object.entries(patternScores) as [string, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const topPattern = entries[0];
  const topScore = topPattern[1];
  const topName = PATTERN_NAMES[topPattern[0]] || topPattern[0];

  // Check for tie
  const tied = entries.filter((e) => e[1] === topScore && e[1] > 0);
  const displayName = tied.length > 1
    ? tied.map((t) => PATTERN_NAMES[t[0]] || t[0]).join(" & ")
    : topName;

  const handleReveal = () => {
    haptic("heavy");
    setPhase("revealing");

    // Generate confetti particles
    const newParticles = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      delay: 0.8 + Math.random() * 0.5,
      x: (Math.random() - 0.5) * 160,
    }));
    setParticles(newParticles);

    setTimeout(() => {
      chimeReveal();
      haptic("success");
    }, 600);

    setTimeout(() => {
      chimeCompletion();
      setPhase("revealed");
      onReveal();
    }, 2500);
  };

  if (phase === "revealed") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center py-8"
      >
        <motion.button
          onClick={() => {
            haptic("light");
            navigate("/app/ebook/parte-3");
          }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          style={{
            background: "#C4622D",
            borderRadius: 12,
            padding: "14px 28px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 600,
            color: "white",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.01em",
          }}
        >
          Continuar o mapa →
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        maxWidth: "100%",
        padding: 36,
        background: "#1A1520",
        borderRadius: 16,
        margin: "48px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient gradient background */}
      <motion.div
        animate={phase === "revealing"
          ? { opacity: [0, 0.3, 0.1], scale: [1, 1.2, 1] }
          : { opacity: 0.05 }
        }
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          inset: -40,
          background: "radial-gradient(ellipse at center, rgba(196,98,45,0.3), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Confetti particles */}
      {particles.map((p) => (
        <Particle key={p.id} delay={p.delay} x={p.x} />
      ))}

      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "#00BCD4",
          letterSpacing: "0.2em",
          display: "block",
          marginBottom: 16,
          position: "relative",
        }}
      >
        COM BASE NO QUE VOCÊ MARCOU
      </motion.span>

      <AnimatePresence mode="wait">
        {phase === "waiting" && (
          <motion.div key="waiting" exit={{ opacity: 0, y: -20 }}>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 16,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 24,
                position: "relative",
              }}
            >
              Seu corpo já sabe. Está pronto pra ver?
            </motion.p>

            <motion.button
              onClick={handleReveal}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                background: "rgba(196,98,45,0.15)",
                border: "1px solid rgba(196,98,45,0.3)",
                borderRadius: 12,
                padding: "14px 28px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                color: "#C4622D",
                cursor: "pointer",
                position: "relative",
                letterSpacing: "0.01em",
              }}
            >
              Revelar meu padrão dominante
            </motion.button>
          </motion.div>
        )}

        {phase === "revealing" && (
          <motion.div
            key="revealing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ position: "relative" }}
          >
            {/* Suspense dots */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 15,
                color: "rgba(255,255,255,0.4)",
                marginBottom: 12,
              }}
            >
              Seu padrão dominante é:
            </motion.p>

            {/* Pattern name — dramatic reveal */}
            <motion.h2
              initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 34,
                color: "white",
                lineHeight: 1.1,
                marginBottom: 24,
                letterSpacing: "-0.02em",
              }}
            >
              {displayName}
            </motion.h2>

            {/* Intensity bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{ marginBottom: 24 }}
            >
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.3)",
                  display: "block",
                  marginBottom: 8,
                  letterSpacing: "0.15em",
                }}
              >
                INTENSIDADE
              </span>
              <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${topScore}%` }}
                  transition={{ duration: 1.2, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #00BCD4, #00E5FF)",
                    borderRadius: 2,
                    boxShadow: "0 0 12px rgba(0,188,212,0.3)",
                  }}
                />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 300,
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.9,
              }}
            >
              Os próximos capítulos vão falar
              <br />
              diretamente com este padrão.
              <br />
              Presta atenção nos boxes marcados com ⟶
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PatternReveal;
