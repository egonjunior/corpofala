import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Pause, PenLine, ShieldCheck, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/app/AppLayout";
import WeeklyCalendar, { CalendarProgress } from "@/components/reader/calendar/WeeklyCalendar";

const STORAGE_KEY = "calendarProgress";

const defaultCalendar: CalendarProgress = {
  weeks: [
    Array(7).fill(false),
    Array(7).fill(false),
    Array(7).fill(false),
    Array(7).fill(false),
  ],
};

function load(): CalendarProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultCalendar;
  } catch {
    return defaultCalendar;
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 },
  }),
};

const phases = [
  { icon: Search, label: "Identificação", week: "Sem 1", color: "#C4622D" },
  { icon: Pause, label: "Interrupção", week: "Sem 2", color: "#C4622D" },
  { icon: PenLine, label: "Reescrita", week: "Sem 3", color: "#C4622D" },
  { icon: ShieldCheck, label: "Consolidação", week: "Sem 4", color: "#C4622D" },
];

const AppCalendar = () => {
  const navigate = useNavigate();
  const [calendarProgress, setCalendarProgress] = useState<CalendarProgress>(load);

  const save = (value: CalendarProgress) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  };

  const toggleCalendarDay = useCallback((week: number, day: number) => {
    setCalendarProgress((prev) => {
      const newWeeks = prev.weeks.map((w, wi) =>
        wi === week ? w.map((d, di) => (di === day ? !d : d)) : [...w]
      );
      const next = { weeks: newWeeks };
      save(next);
      return next;
    });
  }, []);

  const resetCalendar = useCallback(() => {
    save(defaultCalendar);
    setCalendarProgress(defaultCalendar);
  }, []);

  const totalDone = calendarProgress.weeks.flat().filter(Boolean).length;
  const pct = Math.round((totalDone / 28) * 100);

  // Current phase
  const currentWeekIdx = Math.min(Math.floor(totalDone / 7), 3);

  return (
    <AppLayout>
      <div className="max-w-[720px] mx-auto px-5 sm:px-6 pt-6 pb-24">
        {/* Back */}
        <motion.button
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          onClick={() => navigate("/app/dashboard")}
          className="flex items-center gap-2 mb-6"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: "#8A7A70",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={16} />
          Voltar ao Dashboard
        </motion.button>

        {/* ── Hero contextual ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="mb-2">
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#C4622D" }}>
            NEUROPLASTICIDADE APLICADA
          </span>
          <h1
            className="mt-2"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(24px, 5vw, 32px)",
              color: "#1A1520",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            28 dias para reescrever o circuito
          </h1>
          <p className="mt-3" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 300, color: "#6A5A55", lineHeight: 1.7 }}>
            Pesquisas em neuroplasticidade — como as de <strong style={{ fontWeight: 500, color: "#4A3A35" }}>Dr. Joe Dispenza</strong> e <strong style={{ fontWeight: 500, color: "#4A3A35" }}>Dr. Norman Doidge</strong> — mostram que 21 a 28 dias de prática consistente criam novos caminhos neurais. Este calendário traduz essa ciência em micro-ações diárias.
          </p>
        </motion.div>

        {/* ── Progress bar ── */}
        {totalDone > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="mb-6 mt-4">
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#8A7A70" }}>
                {totalDone} DE 28 DIAS
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#C4622D" }}>
                {pct}%
              </span>
            </div>
            <div
              className="w-full rounded-full overflow-hidden relative"
              style={{ height: 5, background: "rgba(196,98,45,0.10)", boxShadow: "inset 0 1px 2px rgba(26,21,32,0.06)" }}
            >
              <motion.div
                className="h-full rounded-full relative progress-shimmer"
                style={{ background: "linear-gradient(90deg, #A8481E, #C4622D, #D4784A)", overflow: "hidden" }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2"
                style={{ width: 7, height: 7, borderRadius: "50%", background: "#C4622D", boxShadow: "0 0 8px rgba(196,98,45,0.50)" }}
                initial={{ left: 0, opacity: 0 }}
                animate={{ left: `${pct}%`, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* ── 4 Phases Timeline ── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="grid grid-cols-4 gap-2 sm:gap-3 mt-6 mb-8"
        >
          {phases.map((phase, i) => {
            const Icon = phase.icon;
            const isActive = i === currentWeekIdx;
            const isDone = i < currentWeekIdx;
            return (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-2"
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(196,98,45,0.12), rgba(196,98,45,0.20))"
                      : isDone
                        ? "rgba(196,98,45,0.06)"
                        : "rgba(26,21,32,0.03)",
                    border: isActive
                      ? "1.5px solid rgba(196,98,45,0.35)"
                      : "1px solid rgba(26,21,32,0.06)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    color={isActive || isDone ? "#C4622D" : "#B0A090"}
                  />
                </div>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#C4622D" : isDone ? "#6A5A55" : "#B0A090",
                  lineHeight: 1.3,
                }}>
                  {phase.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="phase-indicator"
                    style={{ width: 4, height: 4, borderRadius: "50%", background: "#C4622D" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* ── Calendar ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <WeeklyCalendar
            progress={calendarProgress}
            onToggleDay={toggleCalendarDay}
            onReset={resetCalendar}
            darkMode={false}
          />
        </motion.div>

        {/* ── Ebook connection banner ── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
          onClick={() => navigate("/app/ebook/parte-5")}
          className="mt-8 cursor-pointer"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 30% 100%, rgba(196,98,45,0.06) 0%, #1A1520 70%)",
            borderRadius: 16,
            padding: "24px 20px",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 flex items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(196,98,45,0.12)",
                border: "1px solid rgba(196,98,45,0.20)",
              }}
            >
              <BookOpen size={20} strokeWidth={1.5} color="#C4622D" />
            </div>
            <div className="flex-1">
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
                Este calendário é parte do Capítulo 5 do livro.
              </p>
              <p className="mt-1" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                A ciência por trás de cada fase — e por que 28 dias — está explicada lá.
              </p>
              <button
                className="mt-3 btn-premium"
                style={{
                  background: "#C4622D",
                  borderRadius: 8,
                  padding: "8px 18px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Ler no livro →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default AppCalendar;
