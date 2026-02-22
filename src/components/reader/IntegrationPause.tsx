import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { haptic } from "@/lib/haptics";
import { clickSoft, chimeSuccess } from "@/lib/audio";

interface IntegrationPauseProps {
  darkMode: boolean;
  onContinue: () => void;
}

const PAUSE_DURATION = 30;

const IntegrationPause = ({ darkMode, onContinue }: IntegrationPauseProps) => {
  const [timer, setTimer] = useState<number | null>(null);
  const [timerDone, setTimerDone] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"in" | "hold" | "out">("in");
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const breathRef = useRef<ReturnType<typeof setInterval>>();

  const startTimer = () => {
    haptic("medium");
    clickSoft();
    setTimer(PAUSE_DURATION);
    setTimerDone(false);
  };

  // Timer countdown
  useEffect(() => {
    if (timer === null || timer <= 0) return;
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(intervalRef.current);
          setTimerDone(true);
          haptic("success");
          chimeSuccess();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [timer !== null && timer > 0]);

  // Breathing cycle animation (4s in, 4s hold, 6s out)
  useEffect(() => {
    if (timer === null || timerDone) return;
    const cycle = () => {
      setBreathPhase("in");
      setTimeout(() => setBreathPhase("hold"), 4000);
      setTimeout(() => setBreathPhase("out"), 8000);
    };
    cycle();
    breathRef.current = setInterval(cycle, 14000);
    return () => clearInterval(breathRef.current);
  }, [timer !== null, timerDone]);

  const mutedText = darkMode ? "rgba(255,255,255,0.5)" : "#5A4A50";
  const borderC = darkMode ? "rgba(196,98,45,0.4)" : "rgba(196,98,45,0.25)";

  // Timer circle progress
  const circumference = 2 * Math.PI * 20;
  const progress = timer !== null ? ((PAUSE_DURATION - timer) / PAUSE_DURATION) * circumference : 0;

  const breathLabel = breathPhase === "in" ? "inspire" : breathPhase === "hold" ? "segure" : "expire";
  const breathScale = breathPhase === "in" ? 1.3 : breathPhase === "hold" ? 1.3 : 0.9;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ margin: "48px 0" }}
    >
      {/* Divider — animated line */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ height: 1, background: "rgba(196,98,45,0.15)", marginBottom: 40 }}
      />

      <div
        style={{
          background: darkMode ? "rgba(196,98,45,0.06)" : "rgba(196,98,45,0.03)",
          borderLeft: `3px solid ${borderC}`,
          borderRadius: "0 12px 12px 0",
          padding: "28px 28px 28px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        {timer !== null && !timerDone && (
          <motion.div
            animate={{ opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at center, rgba(196,98,45,0.15), transparent 70%)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Label */}
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            color: "#C4622D",
            letterSpacing: "0.2em",
            display: "block",
            marginBottom: 16,
          }}
        >
          PAUSA DE INTEGRAÇÃO
        </motion.span>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            fontWeight: 300,
            color: mutedText,
            lineHeight: 1.9,
            marginBottom: 24,
          }}
        >
          Pausa. Respira.
          <br />
          O que você acabou de ler
          <br />
          muda a forma de ver o que você sente.
          <br />
          Deixa isso pousar antes de continuar.
        </motion.p>

        {/* Breathing orb — only visible during timer */}
        <AnimatePresence>
          {timer !== null && !timerDone && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 24,
                overflow: "hidden",
              }}
            >
              {/* Breathing circle */}
              <motion.div
                animate={{ scale: breathScale }}
                transition={{ duration: breathPhase === "in" ? 4 : breathPhase === "hold" ? 0.3 : 6, ease: "easeInOut" }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(196,98,45,0.25), rgba(196,98,45,0.05))",
                  border: "1px solid rgba(196,98,45,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <motion.div
                  animate={{ scale: breathScale }}
                  transition={{ duration: breathPhase === "in" ? 4 : breathPhase === "hold" ? 0.3 : 6, ease: "easeInOut" }}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "rgba(196,98,45,0.4)",
                  }}
                />
              </motion.div>

              <motion.span
                key={breathLabel}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 0.5, y: 0 }}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: "#C4622D",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                {breathLabel}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-4">
          {/* Timer */}
          {timer === null ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startTimer}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: darkMode ? "rgba(255,255,255,0.4)" : "#8A7A70",
                background: "none",
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.12)" : "#D4C9BF"}`,
                borderRadius: "50%",
                width: 48,
                height: 48,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s",
              }}
            >
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11 }}>30s</span>
            </motion.button>
          ) : (
            <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(196,98,45,0.15)" strokeWidth="2" />
                <motion.circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="#C4622D"
                  strokeWidth="2"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                  strokeLinecap="round"
                  transform="rotate(-90 24 24)"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: timerDone ? 18 : 16,
                  color: "#C4622D",
                }}
              >
                {timerDone ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    ✓
                  </motion.span>
                ) : (
                  timer
                )}
              </span>
            </div>
          )}

          <motion.button
            whileHover={{ x: 4 }}
            onClick={() => {
              haptic("light");
              onContinue();
            }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "#C4622D",
              background: "none",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.01em",
            }}
          >
            Continuar leitura →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default IntegrationPause;
