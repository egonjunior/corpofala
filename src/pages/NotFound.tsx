import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.15 },
  }),
};

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "#1A1520" }}
    >
      {/* Ambient gradients */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 40%, rgba(196,98,45,0.08), transparent)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 40% 30% at 30% 70%, rgba(0,188,212,0.04), transparent)" }} />

      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Animated Pulso icon with "lost signal" effect */}
        <motion.svg
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          width="64" height="64" viewBox="0 0 32 32" fill="none"
        >
          <motion.circle
            cx="16" cy="16" r="3.2" fill="#C4622D"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="16" cy="16" r="7.5" stroke="#C4622D" strokeWidth="1.2"
            animate={{ opacity: [0.3, 0.08, 0.3], r: [7.5, 8.5, 7.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="16" cy="16" r="12" stroke="#C4622D" strokeWidth="1"
            animate={{ opacity: [0.12, 0.03, 0.12], r: [12, 14, 12] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
        </motion.svg>

        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="mt-6"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "rgba(196,98,45,0.6)",
          }}
        >
          SINAL PERDIDO
        </motion.p>

        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="mt-4"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(28px, 5vw, 36px)",
            color: "rgba(255,255,255,0.92)",
            lineHeight: 1.2,
          }}
        >
          Esse caminho ainda não existe.
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="mt-3"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 300,
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.7,
          }}
        >
          Mas o seu mapa está te esperando.
        </motion.p>

        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="flex flex-col sm:flex-row gap-3 mt-8"
        >
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 28px",
              background: "#C4622D",
              borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(196,98,45,0.3)",
            }}
          >
            Voltar ao início →
          </button>
          <button
            onClick={() => navigate("/app/dashboard")}
            style={{
              padding: "12px 28px",
              background: "transparent",
              borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.12)",
              cursor: "pointer",
            }}
          >
            Ir ao Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
