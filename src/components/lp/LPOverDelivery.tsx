import { motion } from "framer-motion";

const deliveryItems = [
  {
    num: "01",
    title: "O Mapa Completo — Para Download",
    tag: "EBOOK PDF",
    desc: "Seis partes estruturadas com 200+ citações científicas verificáveis. Seu guia permanente de referência.",
    pills: ["PDF Download", "Leitura Online", "5 Padrões", "Protocolo Semanal"],
  },
  {
    num: "02",
    title: "O Ebook Que Responde a Você",
    tag: "PLATAFORMA INTERATIVA",
    desc: "A mesma jornada, mas viva. Visualizações animadas, pausas guiadas e conteúdo que se adapta ao seu ritmo.",
    pills: ["Visualizações Animadas", "Pausas Guiadas", "Personalizado"],
  },
  {
    num: "03",
    title: "O Kit de Crise — Para Quando Precisar",
    tag: "DINÂMICAS",
    desc: "5 técnicas de regulação imediata. Para o momento em que o corpo grita e você precisa de algo agora.",
    pills: ["Âncora de Crise", "Respiração Guiada", "Regulação Vagal", "Grounding", "Protocolo SOS"],
  },
  {
    num: "04",
    title: "Acesso Permanente + Atualizações",
    tag: "ACESSO VITALÍCIO",
    desc: "Comprou uma vez, é seu para sempre. Cada atualização científica futura chega sem custo adicional.",
    pills: ["Acesso Vitalício", "Atualizações Inclusas", "Preço Lançamento"],
  },
];

const LPOverDelivery = () => {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "#0F0F1C" }}>
      <div className="max-w-3xl mx-auto">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "#00BCD4",
          }}
          className="mb-4"
        >
          O QUE VOCÊ RECEBE
        </motion.p>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 400,
            color: "#FAFAF7",
            lineHeight: 1.2,
          }}
          className="mb-3"
        >
          Não é um ebook.{" "}
          <em style={{ fontStyle: "italic", color: "rgba(250,250,247,0.6)" }}>
            É um sistema completo.
          </em>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: "16px",
            color: "rgba(250,250,247,0.4)",
          }}
          className="mb-16"
        >
          Quatro camadas de entrega. Pelo preço de uma única sessão.
        </motion.p>

        {/* Items */}
        <div className="space-y-0">
          {deliveryItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="flex gap-6 py-10"
              style={{
                borderBottom:
                  idx < deliveryItems.length - 1
                    ? "1px solid rgba(250,250,247,0.06)"
                    : "none",
              }}
            >
              {/* Number */}
              <span
                className="flex-shrink-0 select-none"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "48px",
                  fontWeight: 700,
                  color: "rgba(0,188,212,0.12)",
                  lineHeight: 1,
                }}
              >
                {item.num}
              </span>

              {/* Content */}
              <div className="flex-1">
                <span
                  className="inline-block px-2 py-0.5 rounded mb-3"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    color: "#00BCD4",
                    border: "1px solid rgba(0,188,212,0.2)",
                    background: "rgba(0,188,212,0.05)",
                  }}
                >
                  {item.tag}
                </span>
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: "18px",
                    color: "#FAFAF7",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="mb-4"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    fontSize: "14px",
                    color: "rgba(250,250,247,0.45)",
                    lineHeight: 1.7,
                  }}
                >
                  {item.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.pills.map((pill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "11px",
                        fontWeight: 400,
                        color: "rgba(250,250,247,0.5)",
                        border: "1px solid rgba(250,250,247,0.08)",
                        background: "rgba(250,250,247,0.03)",
                      }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LPOverDelivery;
