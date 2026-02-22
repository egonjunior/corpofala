import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Flame, Award } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import AppLayout from "@/components/app/AppLayout";
import { useDynamicsState } from "@/hooks/useDynamicsState";
import { DYNAMICS, BADGES, DYNAMICS_LIST, type DynamicId } from "@/data/dynamicsContent";
import { format } from "date-fns";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 },
  }),
};

const DynamicsHistory = () => {
  const navigate = useNavigate();
  const { getAllSessions, getGlobalStreak, badges, getStats } = useDynamicsState();

  const allSessions = useMemo(() => getAllSessions(), [getAllSessions]);
  const globalStreak = useMemo(() => getGlobalStreak(), [getGlobalStreak]);
  const unlockedBadges = useMemo(() => BADGES.filter((b) => badges.includes(b.id)), [badges]);

  const chartData = useMemo(() => {
    return allSessions
      .slice(0, 20)
      .reverse()
      .map((s, i) => ({
        x: i + 1,
        score: s.postScore,
        color: DYNAMICS[s.dynamicId].color,
      }));
  }, [allSessions]);

  return (
    <AppLayout>
      <div className="px-4 py-6 max-w-lg mx-auto">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate("/app/dinamicas")}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: "rgba(26,21,32,0.05)" }}
          >
            <ArrowLeft size={16} color="#8A7A70" />
          </button>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="mb-6">
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#00BCD4" }}>
            SEU PROGRESSO
          </span>
          <h1
            className="mt-2"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(26px, 4vw, 32px)",
              color: "#1A1520",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            Histórico
          </h1>
        </motion.div>

        {/* Global stats */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total", value: `${allSessions.length}x`, icon: <TrendingUp size={14} color="#00BCD4" />, color: "#00BCD4" },
            { label: "Sequência", value: `${globalStreak}d`, icon: <Flame size={14} color="#C4622D" />, color: "#C4622D" },
            { label: "Badges", value: `${unlockedBadges.length}`, icon: <Award size={14} color="#6A5A55" />, color: "#6A5A55" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-4 text-center glass-card"
              style={{ borderRadius: 14 }}
            >
              <div className="flex justify-center mb-2">{s.icon}</div>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, color: s.color, fontWeight: 500 }}>{s.value}</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#8A7A70", marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Chart */}
        {chartData.length > 1 && (
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="rounded-2xl p-5 mb-6 glass-card"
            style={{ borderRadius: 16 }}
          >
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#8A7A70", marginBottom: 16 }}>
              PROGRESSO GERAL
            </p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={chartData}>
                <XAxis dataKey="x" hide />
                <YAxis domain={[0, 10]} hide />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#00BCD4"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#00BCD4", stroke: "#fff", strokeWidth: 1.5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Badges */}
        {unlockedBadges.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="mb-6">
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#8A7A70", marginBottom: 10 }}>
              BADGES
            </p>
            <div className="flex flex-wrap gap-2">
              {unlockedBadges.map((b) => (
                <span
                  key={b.id}
                  className="px-3 py-1.5 rounded-full flex items-center gap-1.5 glass-card"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: "#1A1520",
                    borderRadius: 999,
                  }}
                >
                  {b.icon} {b.name}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent sessions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#8A7A70", marginBottom: 10 }}>
            SESSÕES RECENTES
          </p>
        </motion.div>

        {allSessions.length === 0 ? (
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={6}
            className="glass-card rounded-2xl p-8 text-center"
            style={{ borderRadius: 16 }}
          >
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#8A7A70" }}>
              Nenhuma sessão ainda.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#B0A090", marginTop: 6 }}>
              Experimente uma dinâmica para começar seu histórico.
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-2">
            {allSessions.slice(0, 20).map((s, i) => {
              const d = DYNAMICS[s.dynamicId];
              const min = Math.floor(s.durationSeconds / 60);
              const sec = s.durationSeconds % 60;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={6 + i * 0.3}
                  className="flex items-center gap-3 p-3.5 rounded-xl glass-card"
                  style={{ borderRadius: 14 }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: d.bgColor, boxShadow: `0 2px 8px ${d.color}15` }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={d.color}><path d={d.icon} /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#1A1520", fontWeight: 500 }}>{d.name}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#B0A090" }}>
                      {format(new Date(s.date), "dd/MM · HH:mm")} · {min}:{sec.toString().padStart(2, "0")}
                    </p>
                  </div>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, color: d.color, fontWeight: 500 }}>{s.postScore}/10</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default DynamicsHistory;
