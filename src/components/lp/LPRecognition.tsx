import { motion } from "framer-motion";

const signals = [
  "A dor que não tem causa no exame",
  "O cansaço que não passa com descanso",
  "A ansiedade que aparece sem motivo aparente",
  "O padrão que volta cada vez que você acha que resolveu",
  "O sintoma que os médicos disseram que não existe — mas que você sente",
];

const LPRecognition = () => {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "#0C0C18" }}>
      <div className="max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: "20px",
            color: "rgba(250,250,247,0.6)",
            lineHeight: 1.8,
          }}
          className="mb-12"
        >
          Você chegou até aqui porque algo ressoou.
        </motion.p>

        <div className="space-y-5 mb-14">
          {signals.map((signal, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="flex items-start gap-4"
            >
              <span
                className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0"
                style={{ backgroundColor: "#FF4D4D", boxShadow: "0 0 8px rgba(255,77,77,0.4)" }}
              />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  fontSize: "16px",
                  color: "rgba(250,250,247,0.7)",
                  lineHeight: 1.7,
                }}
              >
                {signal}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: "18px",
              color: "rgba(250,250,247,0.5)",
              lineHeight: 1.8,
            }}
          >
            Isso não é fraqueza. Não é frescura. Não é "coisa da sua cabeça".
            <br />
            É o seu corpo tentando falar — sem ter as palavras.
          </p>
          <p
            className="mt-4"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "14px",
              color: "#00BCD4",
              letterSpacing: "0.05em",
            }}
          >
            Até agora.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LPRecognition;
