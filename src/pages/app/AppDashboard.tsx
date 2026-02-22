import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, CalendarDays, HelpCircle, Sun, Moon, Sunset, Flame, Smartphone, X } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/app/AppLayout";
import BookCoverMini from "@/components/ebook/BookCoverMini";
import { pulseCards, getDailyCardIndex, PULSE_THEMES } from "@/data/pulseCards";

/* ── helpers ── */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "BOM DIA";
  if (h < 18) return "BOA TARDE";
  return "BOA NOITE";
};

const GreetingIcon = () => {
  const h = new Date().getHours();
  if (h < 12) return <Sun size={14} strokeWidth={1.5} color="#C4622D" />;
  if (h < 18) return <Sunset size={14} strokeWidth={1.5} color="#C4622D" />;
  return <Moon size={14} strokeWidth={1.5} color="#8A7A70" />;
};

/* ── progress ring SVG ── */
const ProgressRing = ({ progress, size = 72 }: { progress: number; size?: number }) => {
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <svg width={size} height={size} className="absolute -inset-1.5" style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(196,98,45,0.10)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke="#C4622D" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
      />
    </svg>
  );
};

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
  }),
};

/* ── shared card style objects ── */
const glassCardStyle = {
  borderRadius: 16,
  padding: 28,
  cursor: "pointer" as const,
};

const primaryBtnStyle = {
  background: "#C4622D",
  borderRadius: 10,
  padding: "10px 22px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  fontWeight: 600 as const,
  color: "#fff",
  border: "none",
  cursor: "pointer" as const,
};

const outlineBtnStyle = {
  height: 42,
  background: "transparent",
  border: "1.5px solid rgba(196,98,45,0.30)",
  borderRadius: 10,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  fontWeight: 500 as const,
  color: "#C4622D",
  cursor: "pointer" as const,
};

/* ── component ── */
const AppDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("appUser") || '{"name":"Usuário"}');
  const progress = parseInt(localStorage.getItem("ebookProgress") || "0", 10);
  const chapter = parseInt(localStorage.getItem("currentChapter") || "1", 10);

  // PWA install banner
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true;
  const [installDismissed, setInstallDismissed] = useState(() => localStorage.getItem("installBannerDismissed") === "true");
  const showInstallBanner = !isStandalone && !installDismissed;

  const dismissInstall = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem("installBannerDismissed", "true");
    setInstallDismissed(true);
  };

  // Calendar progress
  const calRaw = localStorage.getItem("calendarProgress");
  const calWeeks: boolean[][] = calRaw
    ? JSON.parse(calRaw).weeks
    : [Array(7).fill(false), Array(7).fill(false), Array(7).fill(false), Array(7).fill(false)];
  const calDone = calWeeks.flat().filter(Boolean).length;
  let calStreak = 0;
  const allDays = calWeeks.flat();
  for (let i = allDays.length - 1; i >= 0; i--) {
    if (allDays[i]) calStreak++;
    else break;
  }
  const calPhaseIdx = Math.min(Math.floor(calDone / 7), 3);
  const calPhaseNames = ["Identificação", "Interrupção", "Reescrita", "Consolidação"];

  return (
    <AppLayout>
      <div className="max-w-[720px] mx-auto px-6 pt-10">
        {/* ── Greeting ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-center gap-2">
          <GreetingIcon />
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#8A7A70",
          }}>
            {getGreeting()}, {user.name?.toUpperCase()}
          </p>
        </motion.div>

        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="mt-2"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(26px, 4vw, 32px)",
            color: "#1A1520",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          O mapa está esperando por você.
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="mt-2"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 300,
            color: "#6A5A55",
            lineHeight: 1.6,
          }}
        >
          Por onde você quer começar hoje?
        </motion.p>

        {/* ── Premium Progress Bar ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="mt-6">
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#8A7A70", marginBottom: 8 }}>
            PROGRESSO NO MAPA
          </p>
          <div
            className="w-full rounded-full overflow-hidden relative"
            style={{
              height: 5,
              background: "rgba(196,98,45,0.10)",
              boxShadow: "inset 0 1px 2px rgba(26,21,32,0.06)",
            }}
          >
            <motion.div
              className="h-full rounded-full relative progress-shimmer"
              style={{
                background: "linear-gradient(90deg, #A8481E, #C4622D, #D4784A)",
                overflow: "hidden",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            />
            {progress > 0 && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#C4622D",
                  boxShadow: "0 0 8px rgba(196,98,45,0.50)",
                }}
                initial={{ left: 0, opacity: 0 }}
                animate={{ left: `${progress}%`, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
              />
            )}
          </div>
          <p className="mt-2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#8A7A70" }}>
            {progress > 0
              ? `Capítulo ${chapter} de 8 · ${progress}% concluído`
              : "Você ainda não começou. Que tal agora?"}
          </p>
        </motion.div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {/* ─ Card 1: Ebook Hero ─ */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-5 glass-card"
            onClick={() => navigate("/app/ebook")}
            style={{
              ...glassCardStyle,
              background: "linear-gradient(135deg, rgba(255,255,255,0.70), rgba(242,237,228,0.60))",
            }}
          >
            <div className="relative shrink-0">
              <BookCoverMini height={80} className="relative z-10" />
              {progress > 0 && <ProgressRing progress={progress} size={88} />}
            </div>
            <div className="flex-1">
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.15em", color: "#C4622D" }}>
                LEITURA INTERATIVA
              </p>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#1A1520", marginTop: 4, letterSpacing: "-0.01em" }}>
                O Que Seu Corpo Está Tentando Te Dizer
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: "#8A7A70", marginTop: 4, lineHeight: 1.5 }}>
                Visualizações, pausas guiadas e protocolo personalizado ao seu padrão.
              </p>
            </div>
            <button className="shrink-0 btn-premium" style={primaryBtnStyle}>
              {progress > 0 ? "Continuar →" : "Começar →"}
            </button>
          </motion.div>

          {/* ─ Card: Calendário 28 dias ─ */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={5}
            className="md:col-span-2 glass-card"
            onClick={() => navigate("/app/calendario")}
            style={glassCardStyle}
          >
            <div className="flex items-start sm:items-center gap-5 flex-col sm:flex-row">
              <div
                className="shrink-0 flex items-center justify-center"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, rgba(196,98,45,0.08), rgba(196,98,45,0.15))",
                }}
              >
                <CalendarDays size={28} color="#C4622D" />
              </div>
              <div className="flex-1">
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.15em", color: "#C4622D" }}>
                  PRÁTICA DIÁRIA
                </p>
                <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#1A1520", marginTop: 4 }}>
                  Calendário de 28 dias
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: "#8A7A70", marginTop: 4, lineHeight: 1.5 }}>
                  {calDone === 0
                    ? "Baseado em neuroplasticidade: 28 dias de micro-ações diárias para reescrever os circuitos emocionais que geram seus sintomas."
                    : `${calDone} de 28 dias · Semana ${calPhaseIdx + 1} — ${calPhaseNames[calPhaseIdx]}${calStreak > 1 ? ` · ${calStreak} dias seguidos 🔥` : ""}`}
                </p>
                {/* Mini progress bar */}
                <div className="mt-3" style={{ maxWidth: 280 }}>
                  <div className="w-full rounded-full overflow-hidden relative" style={{ height: 4, background: "rgba(196,98,45,0.10)", boxShadow: "inset 0 1px 2px rgba(26,21,32,0.04)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #A8481E, #C4622D)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(calDone / 28) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
                    />
                  </div>
                </div>
              </div>
              <button className="shrink-0 btn-premium" style={primaryBtnStyle}>
                Marcar hoje →
              </button>
            </div>
          </motion.div>

          {/* ─ Card: Pulso ─ */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={6}
            className="md:col-span-2"
            onClick={() => navigate("/app/pulso")}
            style={{
              ...glassCardStyle,
              background: (() => {
                const dailyCard = pulseCards[getDailyCardIndex()];
                const t = PULSE_THEMES[dailyCard.category];
                return t.background;
              })(),
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.04)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Grain */}
            <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '128px' }} />
            <div className="relative z-[2] flex items-start gap-4">
              <div className="shrink-0 flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(196,98,45,0.12)", border: "1px solid rgba(196,98,45,0.20)" }}>
                <motion.svg width="24" height="24" viewBox="0 0 32 32" fill="none" animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                  <path d="M16 28s-1.5-1-3.5-2.8C8 21.2 4 17 4 12.5 4 8.9 6.9 6 10.5 6c2 0 3.9 1 5.5 2.8C17.6 7 19.5 6 21.5 6 25.1 6 28 8.9 28 12.5c0 1.5-.5 3-1.3 4.3" stroke="#C4622D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  <path d="M18 20h2.5l1.5-3 2 6 2-3h2.5" stroke="#C4622D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </motion.svg>
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.15em", color: "#C4622D" }}>
                  RITUAL DIÁRIO
                </p>
                <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "rgba(255,255,255,0.92)", marginTop: 4 }}>
                  Pulso
                </p>
                <p className="mt-1" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                  "{pulseCards[getDailyCardIndex()].quote.slice(0, 70)}..."
                </p>
                <p className="mt-1" style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                  — {pulseCards[getDailyCardIndex()].author}
                </p>
              </div>
            </div>
            <button className="relative z-[2] w-full mt-4 btn-premium" style={{
              background: "#C4622D",
              borderRadius: 10,
              padding: "10px 22px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}>
              Revelar meu Pulso →
            </button>
          </motion.div>

          {/* ─ Card: Baixar PDF ─ */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={7}
            className="glass-card"
            onClick={() => {
              const a = document.createElement("a");
              a.href = "/ebook.pdf";
              a.download = "O-Que-Seu-Corpo-Esta-Tentando-Te-Dizer.pdf";
              a.click();
            }}
            style={glassCardStyle}
          >
            <ArrowDown size={24} color="#C4622D" />
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#1A1520", marginTop: 12 }}>
              Baixar o Mapa
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: "#8A7A70", lineHeight: 1.6, marginTop: 6 }}>
              PDF completo para ler offline, imprimir ou salvar onde quiser.
            </p>
            <button className="w-full mt-4 btn-premium" style={outlineBtnStyle}>
              Baixar PDF →
            </button>
            <p className="mt-2" style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#B0A090" }}>
              PDF · Atualizado em Jan 2026
            </p>
          </motion.div>

          {/* ─ Card: Dinâmicas (dark) ─ */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={8}
            className="group"
            onClick={() => navigate("/app/dinamicas")}
            style={{
              ...glassCardStyle,
              background: "radial-gradient(ellipse 80% 60% at 30% 100%, rgba(0,188,212,0.08) 0%, #1A1520 70%)",
              border: "1px solid rgba(0,188,212,0.10)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.20), 0 0 40px rgba(0,188,212,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
            }}
            whileHover={{
              scale: 1.01,
              boxShadow: "0 8px 40px rgba(0,0,0,0.25), 0 0 60px rgba(0,188,212,0.10), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
            whileTap={{ scale: 0.99 }}
          >
            <motion.svg
              width="24" height="24" viewBox="0 0 32 32" fill="none"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <path d="M16 28s-1.5-1-3.5-2.8C8 21.2 4 17 4 12.5 4 8.9 6.9 6 10.5 6c2 0 3.9 1 5.5 2.8C17.6 7 19.5 6 21.5 6 25.1 6 28 8.9 28 12.5c0 1.5-.5 3-1.3 4.3" stroke="#00BCD4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M18 20h2.5l1.5-3 2 6 2-3h2.5" stroke="#00BCD4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </motion.svg>
            <p className="mt-3" style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.15em", color: "#00BCD4" }}>
              MODO CRISE + DINÂMICAS
            </p>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#fff", marginTop: 6 }}>
              Ferramentas para quando precisar
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginTop: 6 }}>
              5 dinâmicas baseadas em técnicas validadas — para momentos difíceis e para praticar no dia a dia.
            </p>
            <button
              className="w-full mt-4 btn-premium"
              style={{
                height: 42,
                background: "#00BCD4",
                borderRadius: 10,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#080810",
                border: "none",
                cursor: "pointer",
              }}
            >
              Acessar Dinâmicas →
            </button>
          </motion.div>

          {/* ─ Card: Instalar App ─ */}
          {showInstallBanner && (
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={9}
              className="md:col-span-2 relative overflow-hidden"
              onClick={() => navigate("/app/instalar")}
              style={{
                ...glassCardStyle,
                background: "linear-gradient(135deg, rgba(255,255,255,0.70), rgba(242,237,228,0.50))",
                border: "1px solid rgba(196,98,45,0.12)",
                boxShadow: "0 4px 24px rgba(196,98,45,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              <button
                onClick={dismissInstall}
                className="absolute top-3 right-3 z-10"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
              >
                <X size={16} color="#B0A090" />
              </button>
              <div className="flex items-center gap-5">
                <div
                  className="shrink-0 flex items-center justify-center"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: "linear-gradient(135deg, rgba(196,98,45,0.10), rgba(196,98,45,0.18))",
                  }}
                >
                  <Smartphone size={24} color="#C4622D" />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#1A1520", lineHeight: 1.2 }}>
                    Seu app, na sua tela
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: "#8A7A70", lineHeight: 1.5, marginTop: 4 }}>
                    Um toque pra abrir, sem navegador. Veja como instalar →
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─ Card: Como Funciona ─ */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={9}
            className="md:col-span-2 glass-card"
            onClick={() => navigate("/app/como-funciona")}
            style={glassCardStyle}
          >
            <HelpCircle size={24} color="#C4622D" />
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#1A1520", marginTop: 12 }}>
              Como usar o mapa
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: "#8A7A70", lineHeight: 1.6, marginTop: 6 }}>
              Um guia rápido para aproveitar tudo que está incluído.
            </p>
            <button className="w-full mt-4 btn-premium" style={{
              ...outlineBtnStyle,
              border: "1.5px solid rgba(26,21,32,0.12)",
              color: "#6A5A55",
            }}>
              Ver guia →
            </button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AppDashboard;
