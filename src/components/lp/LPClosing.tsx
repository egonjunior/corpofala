import { motion } from "framer-motion";

interface LPClosingProps {
  onOpenAuth?: () => void;
}

const LPClosing = ({ onOpenAuth }: LPClosingProps) => {
  return (
    <>
      {/* Dark to beige transition */}
      <div
        className="h-32"
        style={{
          background: "linear-gradient(180deg, #0C0C18 0%, #F2EDE4 100%)",
        }}
      />

      {/* Closing section — beige */}
      <section className="py-24 px-6" style={{ backgroundColor: "#F2EDE4" }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "rgba(26,26,46,0.4)",
            }}
            className="mb-6"
          >
            O CANAL ESTÁ ABERTO
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 400,
              color: "#1a1a2e",
              lineHeight: 1.25,
            }}
            className="mb-4"
          >
            O mapa está aqui.
            <br />
            O próximo passo é seu.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: "16px",
              color: "rgba(26,26,46,0.5)",
              lineHeight: 1.8,
            }}
            className="mb-12 max-w-lg mx-auto"
          >
            O circuito que trouxe você até aqui ainda está ativo.
            Seu corpo está ouvindo. A pergunta é se você vai responder.
          </motion.p>

          {/* Terracotta CTA */}
          <motion.button
            onClick={onOpenAuth}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block px-10 py-4 rounded-lg cursor-pointer mb-4 border-none"
            style={{
              backgroundColor: "#C4622D",
              color: "#F2EDE4",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "15px",
              letterSpacing: "0.05em",
              boxShadow: "0 8px 30px rgba(196,98,45,0.3)",
            }}
          >
            ACESSAR O MAPA — R$47,90
          </motion.button>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px",
              fontWeight: 300,
              color: "rgba(26,26,46,0.35)",
            }}
          >
            7 dias de garantia · Acesso imediato · Preço de lançamento
          </p>
        </div>
      </section>

      {/* Footer — beige */}
      <footer className="py-12 px-6 text-center" style={{ backgroundColor: "#F2EDE4" }}>
        <div className="max-w-2xl mx-auto">
          {/* Heart + wave icon */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 56 56"
            fill="none"
            className="mx-auto mb-4"
          >
            <path
              d="M28 48C28 48 6 34 6 20C6 12 12 6 20 6C24 6 27 8 28 10C29 8 32 6 36 6C44 6 50 12 50 20C50 34 28 48 28 48Z"
              stroke="rgba(26,26,46,0.2)"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M14 28 Q21 22 28 28 Q35 34 42 28"
              stroke="rgba(26,26,46,0.15)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>

          <p
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "16px",
              fontStyle: "italic",
              color: "rgba(26,26,46,0.4)",
            }}
            className="mb-3"
          >
            O corpo nunca mentiu.
          </p>

          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.15em",
              color: "rgba(26,26,46,0.25)",
            }}
          >
            CORPOFALA.COM · @CORPOFALA.OFICIAL
          </p>
        </div>
      </footer>
    </>
  );
};

export default LPClosing;
