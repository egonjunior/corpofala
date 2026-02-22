import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BadgeDef } from "@/data/dynamicsContent";

// Play arpeggio sound via Web Audio API
function playArpeggio() {
  try {
    const ctx = new AudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.4);
    });
  } catch {}
}

interface Particle {
  id: number;
  x: number;
  delay: number;
  color: string;
  size: number;
}

const BadgeUnlock = ({ badge, onDone }: { badge: BadgeDef; onDone?: () => void }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    playArpeggio();
    const colors = ["#00BCD4", "#C4622D", "#7C4DFF", "#FF7043", "#26A69A"];
    setParticles(
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 20 + Math.random() * 60,
        delay: Math.random() * 0.3,
        color: colors[i % colors.length],
        size: 4 + Math.random() * 4,
      }))
    );
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center gap-6 py-8 relative"
      >
        {/* Confetti */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              left: `${p.x}%`,
              top: 0,
            }}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: 200 + Math.random() * 100 }}
            transition={{ duration: 1.5, delay: p.delay, ease: "easeOut" }}
          />
        ))}

        {/* Badge */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
          transition={{ duration: 0.6, times: [0, 0.6, 1] }}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(0,188,212,0.2), rgba(196,98,45,0.2))",
            border: "2px solid rgba(0,188,212,0.3)",
          }}
        >
          <span className="text-3xl">{badge.icon}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 18,
              color: "#C4622D",
            }}
          >
            Você desbloqueou: {badge.name}
          </p>
        </motion.div>

        {onDone && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={onDone}
            className="mt-4 px-6 py-2 rounded-full"
            style={{
              background: "rgba(0,188,212,0.15)",
              color: "#00BCD4",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
            }}
          >
            Continuar
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default BadgeUnlock;
