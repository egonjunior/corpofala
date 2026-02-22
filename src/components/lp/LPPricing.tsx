import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

const includes = [
  "Ebook completo em PDF (200+ citações)",
  "Plataforma interativa com leitura guiada",
  "Kit de crise com 5 dinâmicas práticas",
  "Acesso vitalício + atualizações futuras",
  "7 dias de garantia incondicional",
];

interface LPPricingProps {
  onOpenAuth?: () => void;
}

const LPPricing = ({ onOpenAuth }: LPPricingProps) => {
  const priceRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(priceRef, { once: true, amount: 0.5 });
  const hasPlayedRef = useRef(false);

  // 528Hz subliminal when price enters viewport
  useEffect(() => {
    if (isInView && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 528;
        osc.type = "sine";
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } catch {}
    }
  }, [isInView]);

  return (
    <section
      id="preco"
      className="py-24 px-6"
      style={{
        background: "linear-gradient(180deg, #0F0F1C 0%, #080810 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Anchor text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 p-6 rounded-lg"
          style={{
            border: "1px solid rgba(250,250,247,0.06)",
            background: "rgba(250,250,247,0.02)",
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: "16px",
              color: "rgba(250,250,247,0.5)",
              lineHeight: 1.8,
              textAlign: "center",
            }}
          >
            Uma sessão com especialista em psicossomática custa entre{" "}
            <strong style={{ color: "rgba(250,250,247,0.7)", fontWeight: 500 }}>
              R$200 e R$500
            </strong>{" "}
            por encontro. E não te entrega nada pra levar pra casa.
          </p>
        </motion.div>

        {/* Price card */}
        <motion.div
          ref={priceRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "rgba(250,250,247,0.03)",
            border: "1px solid rgba(0,188,212,0.15)",
          }}
        >
          {/* Top light line */}
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(90deg, transparent, #00BCD4, transparent)",
            }}
          />

          <div className="p-10 text-center">
            {/* Badge */}
            <span
              className="inline-block px-4 py-1.5 rounded-full mb-8"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.15em",
                color: "#00BCD4",
                border: "1px solid rgba(0,188,212,0.3)",
                background: "rgba(0,188,212,0.08)",
                animation: "pulse 3s infinite",
              }}
            >
              PREÇO DE LANÇAMENTO
            </span>

            {/* Struck price */}
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "18px",
                color: "rgba(250,250,247,0.25)",
                textDecoration: "line-through",
              }}
              className="mb-2"
            >
              R$97
            </p>

            {/* Main price with spring */}
            <motion.p
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "64px",
                fontWeight: 700,
                color: "#00BCD4",
                lineHeight: 1,
                textShadow: "0 0 40px rgba(0,188,212,0.3)",
              }}
              className="mb-2"
            >
              R$47,90
            </motion.p>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: 300,
                color: "rgba(250,250,247,0.35)",
                letterSpacing: "0.05em",
              }}
              className="mb-10"
            >
              pagamento único · acesso imediato
            </p>

            {/* Includes */}
            <div className="text-left max-w-sm mx-auto mb-10 space-y-3">
              {includes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span style={{ color: "#00BCD4", fontSize: "14px", marginTop: 2 }}>✓</span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      fontSize: "14px",
                      color: "rgba(250,250,247,0.6)",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              onClick={onOpenAuth}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full py-4 rounded-lg cursor-pointer mb-4 text-center border-none"
              style={{
                background: "linear-gradient(135deg, #00BCD4, #0891b2)",
                color: "#fff",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                letterSpacing: "0.06em",
                boxShadow: "0 0 50px rgba(0,188,212,0.3), 0 0 100px rgba(0,188,212,0.1)",
              }}
            >
              QUERO ACESSAR O MAPA AGORA
            </motion.button>

            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.1em",
                color: "rgba(250,250,247,0.25)",
              }}
            >
              7 DIAS DE GARANTIA · DEVOLUÇÃO SEM PERGUNTAS
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LPPricing;
