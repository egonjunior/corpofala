import { motion, AnimatePresence } from "framer-motion";

interface LPFloatBarProps {
  visible: boolean;
  onOpenAuth?: () => void;
}

const LPFloatBar = ({ visible, onOpenAuth }: LPFloatBarProps) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3"
          style={{
            background: "rgba(8,8,16,0.85)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(0,188,212,0.15)",
            boxShadow: "0 -4px 30px rgba(0,0,0,0.3), 0 0 20px rgba(0,188,212,0.05)",
          }}
        >
          <div className="max-w-xl mx-auto flex items-center justify-between">
            {/* Price */}
            <div className="flex items-center gap-3">
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "13px",
                  color: "rgba(250,250,247,0.3)",
                  textDecoration: "line-through",
                }}
              >
                R$97
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#00BCD4",
                }}
              >
                R$47,90
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={onOpenAuth}
              className="px-6 py-2.5 rounded-lg cursor-pointer border-none"
              style={{
                background: "linear-gradient(135deg, #00BCD4, #0891b2)",
                color: "#fff",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "12px",
                letterSpacing: "0.08em",
                boxShadow: "0 0 20px rgba(0,188,212,0.25)",
              }}
            >
              ACESSAR AGORA
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LPFloatBar;
