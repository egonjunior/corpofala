import { motion } from "framer-motion";

const LPGuarantee = () => {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "#0C0C18" }}>
      <div className="max-w-2xl mx-auto text-center">
        {/* Hexagon icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto">
            <path
              d="M24 4L42 14V34L24 44L6 34V14L24 4Z"
              stroke="rgba(0,188,212,0.2)"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M24 12L36 18V30L24 36L12 30V18L24 12Z"
              stroke="rgba(0,188,212,0.1)"
              strokeWidth="1"
              fill="none"
            />
            <text
              x="24"
              y="27"
              textAnchor="middle"
              fill="rgba(0,188,212,0.4)"
              fontSize="14"
              fontFamily="'Space Mono', monospace"
            >
              7d
            </text>
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: "17px",
            color: "rgba(250,250,247,0.45)",
            lineHeight: 1.8,
          }}
          className="mb-6"
        >
          Se em 7 dias você não sentir que esse é o mapa mais honesto
          que já recebeu sobre o que o seu corpo tenta dizer...
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(24px, 3.5vw, 38px)",
            fontWeight: 400,
            color: "#FAFAF7",
            lineHeight: 1.3,
          }}
          className="mb-6"
        >
          devolvo tudo. Sem formulário.
          <br />
          Sem justificativa. Sem demora.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: "14px",
            color: "rgba(250,250,247,0.3)",
            fontStyle: "italic",
          }}
        >
          Porque se não funcionou para você, não merece ficar com o seu dinheiro.
        </motion.p>
      </div>
    </section>
  );
};

export default LPGuarantee;
