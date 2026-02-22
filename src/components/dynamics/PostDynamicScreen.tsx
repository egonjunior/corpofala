import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Dot } from "recharts";
import { useDynamicsState } from "@/hooks/useDynamicsState";
import { BADGES, DYNAMICS, type DynamicId } from "@/data/dynamicsContent";
import { supabase } from "@/integrations/supabase/client";
import BadgeUnlock from "./BadgeUnlock";

interface PostDynamicScreenProps {
  dynamicId: DynamicId;
  durationSeconds: number;
  onRestart?: () => void;
}

const emojis: Record<number, string> = { 0: "😰", 1: "😰", 2: "😟", 3: "😕", 4: "😐", 5: "😐", 6: "🙂", 7: "🙂", 8: "😊", 9: "😌", 10: "😌" };

const PostDynamicScreen = ({ dynamicId, durationSeconds, onRestart }: PostDynamicScreenProps) => {
  const navigate = useNavigate();
  const { addSession, getStats, badges } = useDynamicsState();
  const [score, setScore] = useState(5);
  const [saved, setSaved] = useState(false);
  const [newBadge, setNewBadge] = useState<typeof BADGES[number] | null>(null);
  const [showBadge, setShowBadge] = useState(false);

  const stats = useMemo(() => getStats(dynamicId), [getStats, dynamicId, saved]);
  const dynamic = DYNAMICS[dynamicId];

  const handleSave = () => {
    const prevBadgeCount = badges.length;
    addSession(dynamicId, score, durationSeconds);
    setSaved(true);

    // Persistir no Supabase (fire-and-forget)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from("dynamics_usage").insert({
          user_id: user.id,
          dynamic_type: dynamicId,
        }).then(() => {});
      }
    }).catch(() => {});

    // Check for new badges after save
    setTimeout(() => {
      const currentBadges = JSON.parse(localStorage.getItem("dynamicsBadges") || "[]");
      if (currentBadges.length > prevBadgeCount) {
        const newId = currentBadges[currentBadges.length - 1];
        const badge = BADGES.find((b) => b.id === newId);
        if (badge) {
          setNewBadge(badge);
          setShowBadge(true);
        }
      }
    }, 100);
  };

  const chartData = stats.sessions.map((s, i) => ({ x: i + 1, score: s.postScore }));
  const avgMin = Math.floor(stats.avgTime / 60);
  const avgSec = stats.avgTime % 60;

  if (showBadge && newBadge) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <BadgeUnlock badge={newBadge} onDone={() => setShowBadge(false)} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center px-6 pb-8 overflow-y-auto">
      {!saved ? (
        /* Check-in slider */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center w-full max-w-sm gap-8"
        >
          <p
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 24,
              color: "#1A1520",
              textAlign: "center",
            }}
          >
            Como você está agora?
          </p>

          <span className="text-5xl">{emojis[score]}</span>

          <div className="w-full flex flex-col gap-2">
            <input
              type="range"
              min={0}
              max={10}
              value={score}
              onChange={(e) => {
                setScore(Number(e.target.value));
                try { navigator.vibrate?.(10); } catch {}
              }}
              className="w-full accent-[#C4622D]"
              style={{ height: 40 }}
            />
            <div className="flex justify-between" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#6A5A55" }}>
              <span>😰 Ainda em crise</span>
              <span>😐 Melhorando</span>
              <span>😌 Muito melhor</span>
            </div>
          </div>

          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 48, color: "#C4622D" }}>
            {score}/10
          </p>

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl"
            style={{
              background: "#C4622D",
              color: "#FFFFFF",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Salvar
          </button>
        </motion.div>
      ) : (
        /* Progress history */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm flex flex-col gap-6 pt-4"
        >
          <p
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 20,
              color: "#1A1520",
            }}
          >
            Sua Jornada com {dynamic.word}
          </p>

          {/* Chart */}
          {chartData.length > 1 && (
            <div className="rounded-xl p-4" style={{ background: "rgba(26,21,32,0.04)" }}>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={chartData}>
                  <XAxis dataKey="x" hide />
                  <YAxis domain={[0, 10]} hide />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#00BCD4"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#00BCD4" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {stats.improving && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#C4622D", fontStyle: "italic" }}>
              Você está ficando melhor em se acalmar. O cérebro está aprendendo.
            </p>
          )}

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total", value: `${stats.total + 1}x` },
              { label: "Tempo médio", value: `${avgMin}:${avgSec.toString().padStart(2, "0")}` },
              { label: "Sequência", value: `${stats.streak}d` },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-3 text-center"
                style={{ background: "rgba(26,21,32,0.04)" }}
              >
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: "#1A1520" }}>{s.value}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#6A5A55" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={() => navigate("/app/dinamicas")}
              className="w-full py-3 rounded-xl"
              style={{
                background: "#1A1520",
                color: "#F2EDE4",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
              }}
            >
              Explorar outras dinâmicas
            </button>
            {onRestart && (
              <button
                onClick={onRestart}
                className="w-full py-3 rounded-xl"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(26,21,32,0.15)",
                  color: "#1A1520",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                }}
              >
                Repetir
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PostDynamicScreen;
