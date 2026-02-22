import { calendarWeeks, DAY_LABELS } from "@/data/calendarActions";
import { motion } from "framer-motion";
import CalendarStats from "./CalendarStats";
import CalendarResetDialog from "./CalendarResetDialog";
import { Check } from "lucide-react";

export interface CalendarProgress {
  weeks: boolean[][];
}

interface WeeklyCalendarProps {
  progress: CalendarProgress;
  onToggleDay: (week: number, day: number) => void;
  onReset: () => void;
  darkMode: boolean;
}

function playTick() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    gain.gain.value = 0.03;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {}
}

const WeeklyCalendar = ({ progress, onToggleDay, onReset, darkMode }: WeeklyCalendarProps) => {
  const handleToggle = (w: number, d: number) => {
    if (!progress.weeks[w][d]) playTick();
    onToggleDay(w, d);
  };

  const totalDone = progress.weeks.flat().filter(Boolean).length;

  const allDays = progress.weeks.flat();
  let streak = 0;
  for (let i = allDays.length - 1; i >= 0; i--) {
    if (allDays[i]) streak++;
    else break;
  }

  const bgCard = darkMode ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.65)";
  const borderColor = darkMode ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.50)";
  const textMain = darkMode ? "rgba(255,255,255,0.9)" : "#1A1520";
  const textSub = darkMode ? "rgba(255,255,255,0.5)" : "#6A5A55";
  const textMuted = darkMode ? "rgba(255,255,255,0.3)" : "#B0A090";

  return (
    <div
      style={{
        background: bgCard,
        backdropFilter: darkMode ? "none" : "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: darkMode ? "none" : "blur(20px) saturate(1.4)",
        borderRadius: 16,
        border: `1px solid ${borderColor}`,
        padding: "24px 16px",
        boxShadow: darkMode
          ? "0 4px 24px rgba(0,0,0,0.20)"
          : "0 4px 24px rgba(26,21,32,0.06), 0 1px 3px rgba(26,21,32,0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      {/* Weeks */}
      {calendarWeeks.map((week, wi) => {
        const weekDone = progress.weeks[wi].filter(Boolean).length;
        const weekPct = (weekDone / 7) * 100;

        return (
          <div key={wi} style={{ marginBottom: wi < 3 ? 28 : 0 }}>
            {/* Week header */}
            <div
              style={{
                borderLeft: "2px solid rgba(196,98,45,0.20)",
                paddingLeft: 16,
                marginBottom: 12,
              }}
            >
              <div className="flex items-baseline gap-3 flex-wrap">
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: textMain }}>
                  {week.label}
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#C4622D", letterSpacing: "0.12em" }}>
                  {week.theme}
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: textMuted }}>
                  {weekDone}/7
                </span>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: textSub, marginTop: 4, lineHeight: 1.5 }}>
                {week.description}
              </p>

              {/* Progress bar */}
              <div className="relative overflow-hidden mt-3" style={{ height: 3, background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(196,98,45,0.10)", borderRadius: 2, boxShadow: "inset 0 0.5px 1px rgba(26,21,32,0.04)" }}>
                <motion.div
                  style={{ height: "100%", background: "linear-gradient(90deg, #A8481E, #C4622D)", borderRadius: 2 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${weekPct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* ── Desktop grid (>=640px) ── */}
            <div className="hidden sm:grid" style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
              {week.days.map((action, di) => {
                const done = progress.weeks[wi][di];
                const dayNum = wi * 7 + di + 1;
                return (
                  <motion.div
                    key={di}
                    onClick={() => handleToggle(wi, di)}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: done
                        ? "linear-gradient(135deg, rgba(196,98,45,0.08), rgba(196,98,45,0.14))"
                        : darkMode ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.80)",
                      border: done ? "1.5px solid rgba(196,98,45,0.30)" : `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(26,21,32,0.06)"}`,
                      borderRadius: 10,
                      padding: "12px 8px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      position: "relative",
                      minHeight: 80,
                      boxShadow: done ? "0 2px 8px rgba(196,98,45,0.08)" : "0 1px 3px rgba(26,21,32,0.03)",
                    }}
                  >
                    {done && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 20 }} style={{ position: "absolute", top: 4, right: 4 }}>
                        <Check size={12} color="#C4622D" />
                      </motion.div>
                    )}
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: textMuted, marginBottom: 4 }}>{DAY_LABELS[di]}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: textMain, marginBottom: 4 }}>{dayNum}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: textSub, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{action}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* ── Mobile list (<640px) ── */}
            <div className="flex flex-col gap-2 sm:hidden">
              {week.days.map((action, di) => {
                const done = progress.weeks[wi][di];
                const dayNum = wi * 7 + di + 1;
                return (
                  <motion.div
                    key={di}
                    onClick={() => handleToggle(wi, di)}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3"
                    style={{
                      background: done
                        ? "linear-gradient(135deg, rgba(196,98,45,0.06), rgba(196,98,45,0.12))"
                        : darkMode ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.80)",
                      border: done
                        ? "1.5px solid rgba(196,98,45,0.25)"
                        : `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(26,21,32,0.06)"}`,
                      borderRadius: 12,
                      padding: "12px 14px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: done ? "0 2px 8px rgba(196,98,45,0.06)" : "0 1px 3px rgba(26,21,32,0.02)",
                    }}
                  >
                    {/* Day number circle */}
                    <div
                      className="shrink-0 flex items-center justify-center"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: done
                          ? "linear-gradient(135deg, #C4622D, #D4784A)"
                          : darkMode ? "rgba(255,255,255,0.06)" : "rgba(26,21,32,0.04)",
                        color: done ? "#fff" : textMuted,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {done ? <Check size={16} strokeWidth={2.5} /> : dayNum}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: textMuted, letterSpacing: "0.1em" }}>
                          {DAY_LABELS[di]}
                        </span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: textMuted }}>
                          DIA {dayNum}
                        </span>
                      </div>
                      <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: done ? 500 : 400,
                        color: done ? "#C4622D" : textMain,
                        marginTop: 2,
                        lineHeight: 1.4,
                        textDecoration: done ? "line-through" : "none",
                        textDecorationColor: "rgba(196,98,45,0.30)",
                      }}>
                        {action}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Stats */}
      <div className="mt-6">
        <CalendarStats totalDone={totalDone} streak={streak} darkMode={darkMode} />
      </div>

      {/* Reset */}
      <CalendarResetDialog onReset={onReset} darkMode={darkMode} />
    </div>
  );
};

export default WeeklyCalendar;
