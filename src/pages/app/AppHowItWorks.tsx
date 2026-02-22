import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/app/AppLayout";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
  }),
};

const steps = [
  {
    tag: "COMECE PELO MAPA",
    title: "Acesse o ebook interativo",
    text: "Identifique seu padrão nos primeiros dois capítulos. Não precisa ler tudo de uma vez. O progresso fica salvo.",
    cta: "Abrir ebook →",
    path: "/app/ebook",
  },
  {
    tag: "BAIXE O PDF",
    title: "Tenha o mapa sempre com você",
    text: "Imprima, salve no celular, ou guarde onde achar melhor. É seu para sempre.",
    cta: "Baixar PDF →",
    path: "/ebook.pdf",
    external: true,
  },
  {
    tag: "EXPLORE AS DINÂMICAS",
    title: "Experimente as ferramentas",
    text: "Quando estiver calma e bem, experimente as dinâmicas preventivas. Quando precisar de ajuda no momento — o botão flutuante está sempre acessível.",
    cta: "Ver dinâmicas →",
    path: "/app/dinamicas",
  },
  {
    tag: "USE QUANDO PRECISAR",
    title: "Volte sempre que precisar",
    text: "Este não é um produto para ler uma vez. É uma ferramenta para voltar sempre. Especialmente nos momentos difíceis.",
  },
];

const AppHowItWorks = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="max-w-[640px] mx-auto px-6 pt-8 pb-16">
        <motion.button
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          onClick={() => navigate("/app/dashboard")}
          className="flex items-center gap-2 mb-8"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: "#8A7A70",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={16} /> Voltar
        </motion.button>

        <motion.span
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#C4622D", letterSpacing: "0.15em", display: "block" }}
        >
          GUIA DE USO
        </motion.span>

        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="mt-2"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(28px, 5vw, 36px)",
            color: "#1A1520",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          Como aproveitar tudo que está aqui.
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="mt-3"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            fontWeight: 300,
            color: "#6A5A55",
            lineHeight: 1.7,
          }}
        >
          Não existe ordem errada. Mas existe uma sequência que funciona melhor.
        </motion.p>

        <div className="mt-10">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp} initial="hidden" animate="visible" custom={4 + i}
              className="flex gap-5 py-6"
              style={{ borderBottom: i < steps.length - 1 ? "1px solid rgba(26,21,32,0.07)" : "none" }}
            >
              <span
                className="shrink-0 text-right"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 40,
                  color: "rgba(196,98,45,0.15)",
                  width: 40,
                  lineHeight: 1,
                }}
              >
                {i + 1}
              </span>
              <div className="flex-1">
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.15em", color: "#C4622D" }}>
                  {step.tag}
                </p>
                <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#1A1520", marginTop: 4 }}>
                  {step.title}
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: "#6A5A55", lineHeight: 1.7, marginTop: 6 }}>
                  {step.text}
                </p>
                {step.cta && (
                  <button
                    onClick={() => step.external ? window.open(step.path, "_blank") : navigate(step.path!)}
                    className="mt-3 btn-premium"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#C4622D",
                      background: "rgba(196,98,45,0.06)",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px 16px",
                      borderRadius: 8,
                    }}
                  >
                    {step.cta}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact card */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={8}
          className="mt-10 glass-card"
          style={{ borderRadius: 14, padding: 24 }}
        >
          <Mail size={20} color="#8A7A70" />
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#1A1520", marginTop: 10 }}>
            Tem alguma dúvida?
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#8A7A70", marginTop: 6, lineHeight: 1.6 }}>
            Manda uma mensagem para contato@corpofala.com e respondemos em até 48 horas.
          </p>
          <a
            href="mailto:contato@corpofala.com"
            className="block mt-3"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#C4622D" }}
          >
            contato@corpofala.com
          </a>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default AppHowItWorks;
