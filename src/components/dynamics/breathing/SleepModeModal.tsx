import { motion } from "framer-motion";

interface SleepModeModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

const SleepModeModal = ({ onAccept, onDecline }: SleepModeModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex items-center justify-center px-6"
      style={{ background: "rgba(10,10,18,0.95)", backdropFilter: "blur(12px)" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-8 w-full max-w-sm text-center"
        style={{ background: "#1A1520", border: "1px solid rgba(138,127,245,0.2)" }}
      >
        <motion.p
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🌙
        </motion.p>

        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "rgba(255,255,255,0.95)", marginBottom: 12 }}>
          Detectamos que é noite
        </p>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 24 }}>
          O Modo Sono usa um ritmo mais lento (4-8-12), som de chuva suave,
          e não pede interação no final para você adormecer naturalmente.
        </p>

        <div className="flex flex-col gap-2 text-left mb-6">
          {[
            "Ritmo 50% mais lento",
            "5 ciclos ao invés de 3",
            "Sem vibração (não acorda)",
            "Tela escurece gradualmente",
          ].map((item) => (
            <p key={item} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
              ✓ {item}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onAccept}
            className="w-full py-3 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #8A7FF5, #6B5FD9)",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Sim, preparar para dormir
          </button>
          <button
            onClick={onDecline}
            className="w-full py-3 rounded-xl"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Não, usar modo normal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SleepModeModal;
