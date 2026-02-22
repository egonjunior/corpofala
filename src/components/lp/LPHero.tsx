import { motion } from "framer-motion";

const LPHero = () => {
  const scrollToPrice = () => {
    document.getElementById("preco")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{ backgroundColor: "#080810" }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Subtle wave SVG at bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 120"
        style={{ opacity: 0.04 }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 C360,120 720,40 1080,80 C1260,100 1380,60 1440,80 L1440,120 L0,120 Z"
          fill="#00BCD4"
        />
      </svg>

      <div className="relative z-20 text-center max-w-3xl mx-auto flex flex-col items-center">
        {/* Heart + Wave Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8"
        >
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <path
              d="M28 48C28 48 6 34 6 20C6 12 12 6 20 6C24 6 27 8 28 10C29 8 32 6 36 6C44 6 50 12 50 20C50 34 28 48 28 48Z"
              stroke="#00BCD4"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M14 28 Q21 22 28 28 Q35 34 42 28"
              stroke="#00BCD4"
              strokeWidth="1.5"
              fill="none"
              opacity="0.8"
            >
              <animate
                attributeName="d"
                values="M14 28 Q21 22 28 28 Q35 34 42 28;M14 28 Q21 34 28 28 Q35 22 42 28;M14 28 Q21 22 28 28 Q35 34 42 28"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center gap-2 mb-10 px-4 py-2 rounded-full"
          style={{
            border: "1px solid rgba(0,188,212,0.2)",
            background: "rgba(0,188,212,0.05)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: "#00BCD4",
              boxShadow: "0 0 8px #00BCD4",
              animation: "pulse 2s infinite",
            }}
          />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.15em",
              color: "rgba(0,188,212,0.8)",
            }}
          >
            CANAL ABERTO — MAPA DISPONÍVEL
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 400,
            color: "#FAFAF7",
            lineHeight: 1.15,
          }}
          className="mb-6"
        >
          O que o seu corpo estava tentando dizer tem um{" "}
          <em style={{ color: "#00BCD4", fontStyle: "italic" }}>nome agora.</em>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: "19px",
            color: "rgba(250,250,247,0.55)",
            lineHeight: 1.7,
          }}
          className="mb-12 max-w-xl"
        >
          O mapa científico que nenhum médico te entregou — com 200+ estudos,
          5 padrões mapeados e protocolos que você aplica hoje.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={scrollToPrice}
          className="w-full max-w-xs py-4 rounded-lg cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #00BCD4, #0891b2)",
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            letterSpacing: "0.08em",
            boxShadow: "0 0 40px rgba(0,188,212,0.25), 0 0 80px rgba(0,188,212,0.1)",
          }}
        >
          VER O QUE ESTÁ INCLUÍDO
        </motion.button>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="rgba(250,250,247,0.3)" strokeWidth="1.5" />
            </svg>
          </motion.div>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              color: "rgba(250,250,247,0.2)",
            }}
          >
            ROLE PARA VER
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default LPHero;
