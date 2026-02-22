import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Download, Monitor, Anchor } from "lucide-react";
import BookCoverMini from "@/components/ebook/BookCoverMini";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.12 },
  }),
};

const HeartWaveIcon = ({ size = 32, color = "#00BCD4" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M16 28s-1.5-1-3.5-2.8C8 21.2 4 17 4 12.5 4 8.9 6.9 6 10.5 6c2 0 3.9 1 5.5 2.8C17.6 7 19.5 6 21.5 6 25.1 6 28 8.9 28 12.5c0 1.5-.5 3-1.3 4.3"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M18 20h2.5l1.5-3 2 6 2-3h2.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const AppWelcome = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [dontShow, setDontShow] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("welcomeSeen") === "true") {
      navigate("/app/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleEnter = () => {
    if (dontShow) {
      localStorage.setItem("welcomeSeen", "true");
    }
    setFading(true);
    setTimeout(() => navigate("/app/dashboard"), 600);
  };

  const pills = [
    { icon: Download, label: "PDF incluso" },
    { icon: Monitor, label: "Leitura interativa" },
    { icon: Anchor, label: "5 dinâmicas" },
  ];

  return (
    <div
      className="min-h-screen flex transition-colors duration-[600ms]"
      style={{ background: fading ? "#F2EDE4" : "#1A1520" }}
    >
      {/* Left column */}
      <div
        className="flex flex-col justify-between w-full md:w-[45%] p-8 md:p-12 lg:p-16"
        style={{ minHeight: "100vh", opacity: fading ? 0 : 1, transition: "opacity 0.5s" }}
      >
        <div className="flex items-center gap-2">
          <HeartWaveIcon size={32} color="#00BCD4" />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              color: "#00BCD4",
            }}
          >
            CORPOFALA
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center py-12">
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(28px, 5vw, 38px)",
              color: "#fff",
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            O canal está aberto.
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              fontWeight: 300,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.8,
              maxWidth: 380,
            }}
          >
            Você tem acesso a tudo que o intermediário preparou.
            Mas antes de entrar no mapa — quero te apresentar
            a pessoa que passou 14 meses escrevendo o que eu
            tentei te dizer.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="flex items-center gap-3 mt-8">
            <div
              className="rounded-full flex items-center justify-center shrink-0"
              style={{
                width: 72,
                height: 72,
                background: "rgba(0,188,212,0.15)",
                border: "2px solid rgba(0,188,212,0.3)",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 28,
                  color: "#00BCD4",
                }}
              >
                E
              </span>
            </div>
            <div>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#fff" }}>
                Egon Jr
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                Fundador · corpofala.com
              </p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00BCD4" }}>
                @egon
              </p>
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="mt-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 300,
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.7,
              maxWidth: 340,
            }}
          >
            Egon não criou o mapa sozinho.
            O intermediário mostrou o caminho.
            Ele teve a coragem de escrever.
          </motion.p>
        </div>

        <div>
          {/* Mobile-only book cover */}
          {isMobile && (
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={4}
              className="flex justify-center mb-6"
            >
              <BookCoverMini height={120} />
            </motion.div>
          )}

          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <div
              className="flex items-center justify-center shrink-0 rounded transition-colors"
              style={{
                width: 16,
                height: 16,
                border: dontShow ? "none" : "1px solid rgba(255,255,255,0.2)",
                background: dontShow ? "#00BCD4" : "transparent",
                borderRadius: 4,
              }}
              onClick={() => setDontShow(!dontShow)}
            >
              {dontShow && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Não mostrar esta tela novamente
            </span>
          </label>

          <motion.button
            variants={fadeUp} initial="hidden" animate="visible" custom={5}
            onClick={handleEnter}
            className="w-full transition-colors"
            style={{
              maxWidth: 280,
              height: 48,
              background: "#C4622D",
              borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ENTRAR NO MAPA →
          </motion.button>
        </div>
      </div>

      {/* Right column — desktop only */}
      {!isMobile && (
        <div
          className="w-[55%] flex flex-col items-center justify-center gap-6 overflow-hidden"
          style={{
            background: "#F2EDE4",
            borderRadius: "0 0 0 16px",
            opacity: fading ? 0 : 1,
            transition: "opacity 0.5s",
          }}
        >
          <BookCoverMini height={360} />
          <div className="flex gap-3">
            {pills.map((p) => (
              <div
                key={p.label}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full"
                style={{
                  background: "#fff",
                  border: "1px solid #D4C9BF",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  color: "#8A7A70",
                }}
              >
                <p.icon size={12} />
                {p.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppWelcome;
