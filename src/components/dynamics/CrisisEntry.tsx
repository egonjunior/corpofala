import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DYNAMICS_LIST, DYNAMIC_ROUTES } from "@/data/dynamicsContent";

const CrisisEntry = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    // Delay before showing "toque quando estiver pronto"
    const t = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleTouch = () => {
    if (!showOptions) setShowOptions(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: "#0A0A12" }}
      onClick={handleTouch}
    >
      <AnimatePresence mode="wait">
        {!showOptions ? (
          <motion.div
            key="pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Pulsing circle */}
            <div className="relative">
              <motion.div
                className="w-24 h-24 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(0,188,212,0.15) 0%, transparent 70%)",
                  border: "1px solid rgba(0,188,212,0.2)",
                }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <p
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 22,
                color: "rgba(255,255,255,0.85)",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              Respira.
              <br />
              Eu estou aqui.
            </p>

            {ready && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 16,
                  color: "rgba(255,255,255,0.4)",
                  fontStyle: "italic",
                }}
              >
                Toque quando estiver pronto.
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 px-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <p
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 18,
                color: "rgba(255,255,255,0.7)",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              O que você precisa agora?
            </p>

            {DYNAMICS_LIST.map((d, i) => (
              <motion.button
                key={d.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(DYNAMIC_ROUTES[d.id])}
                className="w-full py-4 px-5 rounded-2xl flex items-center gap-4"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${d.color}33`,
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill={d.color}>
                  <path d={d.icon} />
                </svg>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 16,
                    color: d.color,
                    fontWeight: 500,
                  }}
                >
                  {d.word}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CrisisEntry;
