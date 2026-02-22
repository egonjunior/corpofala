import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Download, CheckCircle } from "lucide-react";
import { chapters } from "@/data/ebookChapters";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 },
  }),
};

const AppEbookIndex = () => {
  const navigate = useNavigate();

  const getChapterProgress = (slug: string): number => {
    try {
      const raw = localStorage.getItem("ebookProgress");
      if (!raw) return 0;
      const data = JSON.parse(raw);
      return data.chapterProgress?.[slug] || 0;
    } catch {
      return 0;
    }
  };

  const totalProgress = (() => {
    try {
      const raw = localStorage.getItem("ebookProgress");
      if (!raw) return 0;
      return JSON.parse(raw).totalProgress || 0;
    } catch {
      return 0;
    }
  })();

  return (
    <div style={{ background: "#F2EDE4", minHeight: "100vh" }}>
      {/* Atmospheric gradients */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(196,98,45,0.04) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 80% 100%, rgba(0,188,212,0.03) 0%, transparent 70%)",
        }}
      />

      {/* Grain */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Header */}
      <div className="max-w-2xl mx-auto px-6 pt-6 relative z-10">
        <motion.button
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          onClick={() => navigate("/app/dashboard")}
          className="flex items-center gap-2 transition-opacity hover:opacity-70"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: "#8A7A70",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </motion.button>
      </div>

      {/* Hero */}
      <div className="max-w-2xl mx-auto px-6 pt-10 pb-8 relative z-10">
        <motion.span
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#C4622D",
            display: "block",
            marginBottom: 12,
          }}
        >
          EBOOK COMPLETO
        </motion.span>

        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(28px, 5vw, 40px)",
            color: "#1A1520",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          O Que Seu Corpo Está
          <br />
          Tentando Te Dizer
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontStyle: "italic",
            fontSize: 18,
            color: "#5A4A50",
            marginBottom: 24,
          }}
        >
          Um Mapa Científico Para Entender a Origem
          <br />
          Emocional de Suas Doenças
        </motion.p>

        {/* Progress */}
        {totalProgress > 0 && (
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            style={{ marginBottom: 24 }}
          >
            <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#8A7A70" }}>
                {totalProgress}% CONCLUÍDO
              </span>
            </div>
            <div
              className="w-full rounded-full overflow-hidden relative"
              style={{ height: 4, background: "rgba(196,98,45,0.10)", boxShadow: "inset 0 1px 2px rgba(26,21,32,0.06)" }}
            >
              <motion.div
                className="h-full rounded-full relative progress-shimmer"
                style={{ background: "linear-gradient(90deg, #A8481E, #C4622D, #D4784A)", overflow: "hidden" }}
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
              />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#C4622D",
                  boxShadow: "0 0 8px rgba(196,98,45,0.50)",
                }}
                initial={{ left: 0, opacity: 0 }}
                animate={{ left: `${totalProgress}%`, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
              />
            </div>
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={() => navigate("/app/ebook/intro")}
            className="btn-premium"
            style={{
              background: "#C4622D",
              borderRadius: 10,
              padding: "14px 28px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <BookOpen size={16} />
            {totalProgress > 0 ? "Continuar Leitura Interativa" : "Começar Leitura Interativa"}
          </button>

          <button
            onClick={() => {
              const a = document.createElement("a");
              a.href = "/ebook.pdf";
              a.download = "O-Que-Seu-Corpo-Esta-Tentando-Te-Dizer.pdf";
              a.click();
            }}
            className="btn-premium"
            style={{
              background: "transparent",
              borderRadius: 10,
              padding: "14px 28px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 500,
              color: "#C4622D",
              border: "1.5px solid rgba(196,98,45,0.30)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Download size={16} />
            Baixar PDF
          </button>
        </motion.div>
      </div>

      {/* Chapter list */}
      <section className="max-w-2xl mx-auto px-6 pb-32 relative z-10">
        <motion.span
          variants={fadeUp} initial="hidden" animate="visible" custom={6}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#8A7A70",
            display: "block",
            marginBottom: 16,
          }}
        >
          SUMÁRIO
        </motion.span>

        <ul className="space-y-2">
          {chapters.map((ch, i) => {
            const pct = getChapterProgress(ch.slug);
            const done = pct >= 95;

            return (
              <motion.li
                key={ch.slug}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={7 + i * 0.5}
              >
                <button
                  onClick={() => navigate(`/app/ebook/${ch.slug}`)}
                  className="w-full text-left group flex items-center gap-4 glass-card"
                  style={{
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: done ? "1px solid rgba(196,98,45,0.15)" : undefined,
                    background: done ? "linear-gradient(135deg, rgba(255,255,255,0.70), rgba(242,237,228,0.60))" : undefined,
                    cursor: "pointer",
                  }}
                >
                  {/* Number / check */}
                  <span
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: done ? "rgba(196,98,45,0.10)" : "rgba(26,21,32,0.03)",
                      transition: "background 0.3s ease",
                    }}
                  >
                    {done ? (
                      <CheckCircle size={16} color="#C4622D" />
                    ) : (
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#B0A090" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                  </span>

                  {/* Title + subtitle */}
                  <div className="flex-1 min-w-0">
                    <span
                      className="group-hover:text-[#C4622D] transition-colors block"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 15,
                        fontWeight: 500,
                        color: "#1A1520",
                      }}
                    >
                      {ch.title}
                    </span>
                    {ch.subtitle && (
                      <span
                        className="block"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13,
                          fontWeight: 300,
                          color: "#8A7A70",
                          marginTop: 2,
                        }}
                      >
                        {ch.subtitle}
                      </span>
                    )}
                  </div>

                  {/* Progress indicator */}
                  {pct > 0 && !done && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div style={{ width: 32, height: 3, borderRadius: 2, background: "rgba(196,98,45,0.10)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: "#C4622D", borderRadius: 2 }} />
                      </div>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#B0A090" }}>
                        {pct}%
                      </span>
                    </div>
                  )}

                  {/* Arrow */}
                  <span
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    style={{ color: "#C4622D", fontSize: 14 }}
                  >
                    →
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default AppEbookIndex;
