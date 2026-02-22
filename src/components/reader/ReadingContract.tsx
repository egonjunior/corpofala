import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { haptic } from "@/lib/haptics";
import { chimeSuccess } from "@/lib/audio";

interface ReadingContractProps {
  done: boolean;
  onComplete: (answer: string) => void;
  darkMode: boolean;
}

const ReadingContract = ({ done, onComplete, darkMode }: ReadingContractProps) => {
  const [answer, setAnswer] = useState("");
  const [signed, setSigned] = useState(false);

  if (done) return null;

  const handleSubmit = () => {
    haptic("success");
    chimeSuccess();
    setSigned(true);
    setTimeout(() => onComplete(answer), 1800);
  };

  const bg = darkMode ? "#2A2035" : "white";
  const textPrimary = darkMode ? "rgba(255,255,255,0.9)" : "#1A1520";
  const textMuted = darkMode ? "rgba(255,255,255,0.5)" : "#6A5A55";
  const textBody = darkMode ? "rgba(255,255,255,0.75)" : "#2A2035";
  const inputBg = darkMode ? "rgba(255,255,255,0.05)" : "#F2EDE4";
  const inputBorder = darkMode ? "rgba(255,255,255,0.12)" : "#D4C9BF";
  const borderOuter = darkMode ? "rgba(255,255,255,0.08)" : "rgba(26,21,32,0.08)";

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: bg,
            borderRadius: 16,
            border: `1px solid ${borderOuter}`,
            boxShadow: darkMode
              ? "0 4px 32px rgba(0,0,0,0.3)"
              : "0 4px 32px rgba(26,21,32,0.08)",
            padding: 36,
            marginBottom: 40,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle grain texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.015,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
              pointerEvents: "none",
            }}
          />

          {/* Decorative line — Apple-style */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 40 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: 2,
              background: "#C4622D",
              borderRadius: 1,
              marginBottom: 24,
            }}
          />

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ marginBottom: 20 }}>
              <path
                d="M16 28s-1.5-1-3.5-2.8C8 21.2 4 17 4 12.5 4 8.9 6.9 6 10.5 6c2 0 3.9 1 5.5 2.8C17.6 7 19.5 6 21.5 6 25.1 6 28 8.9 28 12.5c0 1.5-.5 3-1.3 4.3"
                stroke="#C4622D"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M18 20h2.5l1.5-3 2 6 2-3h2.5"
                stroke="#C4622D"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: 22,
              color: textPrimary,
              marginBottom: 12,
              letterSpacing: "-0.01em",
            }}
          >
            Antes de começar.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 300,
              color: textMuted,
              lineHeight: 1.9,
              marginBottom: 4,
            }}
          >
            Uma pergunta.
            <br />
            Não tem resposta certa.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 17,
              color: textBody,
              marginTop: 16,
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            O que você mais quer entender
            <br />
            sobre o que sente no seu corpo?
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <textarea
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value.slice(0, 200));
                if (e.target.value.length === 1) haptic("selection");
              }}
              placeholder="Escreve aqui. Sem filtro."
              style={{
                width: "100%",
                background: inputBg,
                border: `1px solid ${inputBorder}`,
                borderRadius: 12,
                padding: "16px 18px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 300,
                color: textBody,
                minHeight: 90,
                resize: "none",
                outline: "none",
                transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#C4622D";
                e.target.style.boxShadow = "0 0 0 4px rgba(196,98,45,0.08)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = inputBorder;
                e.target.style.boxShadow = "none";
              }}
            />

            <div className="flex items-center justify-between mt-2">
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#B0A090" }}>
                {answer.length}/200
              </span>
            </div>
          </motion.div>

          {/* Signed state — Seal stamp animation */}
          <AnimatePresence>
            {signed && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.1,
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: darkMode
                    ? "rgba(42,32,53,0.95)"
                    : "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(8px)",
                  zIndex: 10,
                  borderRadius: 16,
                }}
              >
                {/* Seal */}
                <motion.div
                  initial={{ rotate: -15, scale: 1.3 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                >
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="36" stroke="#C4622D" strokeWidth="2" fill="none" opacity="0.3" />
                    <circle cx="40" cy="40" r="30" stroke="#C4622D" strokeWidth="1.5" fill="none" opacity="0.2" />
                    <motion.path
                      d="M28 42l8 8 16-18"
                      stroke="#C4622D"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                    />
                  </svg>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 18,
                    color: "#C4622D",
                    marginTop: 16,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Contrato firmado.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: textMuted,
                    marginTop: 8,
                    fontWeight: 300,
                  }}
                >
                  A jornada começa agora.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            whileHover={answer.trim() ? { scale: 1.01, y: -1 } : {}}
            whileTap={answer.trim() ? { scale: 0.98 } : {}}
            style={{
              marginTop: 20,
              width: "100%",
              background: "#C4622D",
              borderRadius: 12,
              padding: "14px 24px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: "white",
              border: "none",
              cursor: answer.trim() ? "pointer" : "default",
              opacity: answer.trim() ? 1 : 0.35,
              transition: "opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
              letterSpacing: "0.01em",
            }}
          >
            Começar a leitura →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReadingContract;
