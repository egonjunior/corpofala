import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CalendarStatsProps {
  totalDone: number;
  streak: number;
  darkMode: boolean;
}

function getEncouragement(done: number): string {
  if (done >= 28) return "Você reescreveu o circuito.\nOs próximos 28 dias consolidam.";
  if (done >= 22) return "Última semana. A mudança\nnão é mais esforço — é hábito.";
  if (done >= 15) return "Mais da metade. O circuito\nestá sendo reescrito agora.";
  if (done >= 8) return "Segunda semana. O cérebro\njá está registrando a mudança.";
  return "Todo começo é recomeço.\nMarca o primeiro dia.";
}

const CalendarStats = ({ totalDone, streak, darkMode }: CalendarStatsProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const pct = Math.round((totalDone / 28) * 100);
  const isComplete = totalDone >= 28;

  useEffect(() => {
    if (isComplete) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(t);
    }
  }, [isComplete]);

  const metricColor1 = "#00BCD4";
  const metricColor2 = "#C4622D";
  const metricColor3 = darkMode ? "rgba(255,255,255,0.6)" : "#6A5A55";
  const labelColor = darkMode ? "rgba(255,255,255,0.4)" : "#8A7A70";
  const encourageStyle = isComplete
    ? { fontFamily: "'DM Serif Display', serif", fontSize: 16, color: "#C4622D" }
    : { fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontStyle: "italic" as const, color: metricColor3 };

  return (
    <div style={{ position: "relative" }}>
      {/* Stats card */}
      <div
        style={{
          background: darkMode ? "rgba(0,188,212,0.06)" : "rgba(0,188,212,0.04)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: `1px solid ${darkMode ? "rgba(0,188,212,0.2)" : "rgba(0,188,212,0.12)"}`,
          borderRadius: 14,
          padding: 24,
          marginTop: 24,
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: 16,
          boxShadow: "0 4px 16px rgba(0,188,212,0.06)",
        }}
      >
        {[
          { value: `${totalDone}/28`, label: "dias praticados", color: metricColor1 },
          { value: `${streak}`, label: "sequência atual", color: metricColor2 },
          { value: `${pct}%`, label: "progresso total", color: metricColor3 },
        ].map((m) => (
          <div key={m.label} style={{ textAlign: "center" }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, color: m.color, fontWeight: 500 }}
            >
              {m.value}
            </motion.div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: labelColor, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Encouragement */}
      <div style={{ textAlign: "center", marginTop: 16, whiteSpace: "pre-line", ...encourageStyle }}>
        {getEncouragement(totalDone)}
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: -10,
                width: 8,
                height: 8,
                borderRadius: i % 2 === 0 ? "50%" : 0,
                background: ["#C4622D", "#00BCD4", "#FF4D4D", "#FFD700", "#52B69A"][i % 5],
                animation: `confettiFall ${1.5 + Math.random() * 1.5}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
          <style>{`
            @keyframes confettiFall {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(300px) rotate(720deg); opacity: 0; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default CalendarStats;
