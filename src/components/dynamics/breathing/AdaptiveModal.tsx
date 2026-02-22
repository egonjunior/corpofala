import { motion } from "framer-motion";

interface AdaptiveModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

const AdaptiveModal = ({ onAccept, onDecline }: AdaptiveModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex items-center justify-center px-6"
      style={{ background: "rgba(10,10,18,0.9)" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-8 w-full max-w-sm text-center"
        style={{ background: "#1A1520", border: "1px solid rgba(0,188,212,0.2)" }}
      >
        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "rgba(255,255,255,0.95)", marginBottom: 12 }}>
          Vamos um pouco mais devagar?
        </p>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 24 }}>
          Percebi que você está tendo dificuldade.
          Posso ajustar para um ritmo mais gentil:
        </p>

        {/* Comparison */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex flex-col items-center gap-1">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Atual</p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: "#00BCD4" }}>4-7-8</p>
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 20 }}>→</span>
          <div className="flex flex-col items-center gap-1">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Proposto</p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: "#8A7FF5" }}>3-5-6</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onAccept}
            className="w-full py-3 rounded-xl"
            style={{
              background: "#00BCD4",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Sim, tentar mais devagar
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
            Não, continuar assim
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdaptiveModal;
