import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowLeft, Sparkles, BookOpen, X, Library } from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import CrisisEntry from "@/components/dynamics/CrisisEntry";
import { ScienceModal } from "@/components/dynamics/ScienceModal";
import { DYNAMICS_LIST, DYNAMIC_ROUTES, DynamicInfo } from "@/data/dynamicsContent";
import { useDynamicsState } from "@/hooks/useDynamicsState";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 },
  }),
};

const CrisisHub = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getStats, getAllSessions } = useDynamicsState();
  const isCrisisMode = searchParams.get("modo") === "crise";
  const [scienceModal, setScienceModal] = useState<DynamicInfo | null>(null);

  if (isCrisisMode) {
    return <CrisisEntry />;
  }

  const totalSessions = getAllSessions().length;

  return (
    <AppLayout>
      <div className="px-4 py-6 max-w-lg mx-auto">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-center justify-between mb-2">
          <button
            onClick={() => navigate("/app/dashboard")}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: "rgba(26,21,32,0.05)" }}
          >
            <ArrowLeft size={16} color="#8A7A70" />
          </button>
          <button
            onClick={() => navigate("/app/dinamicas/historico")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full btn-premium"
            style={{
              background: "rgba(26,21,32,0.04)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(26,21,32,0.06)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "#6A5A55",
              cursor: "pointer",
            }}
          >
            <Clock size={14} />
            Histórico
          </button>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="mb-6">
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#00BCD4" }}>
            FERRAMENTAS SOMÁTICAS
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
            Dinâmicas
          </h1>
          <p className="mt-2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 300, color: "#6A5A55", lineHeight: 1.6 }}>
            {totalSessions === 0
              ? "5 ferramentas baseadas em neurociência para quando você precisar."
              : `${totalSessions} sessões realizadas. Cada prática fortalece o circuito.`}
          </p>
        </motion.div>

        {/* Dynamic cards grid */}
        <div className="flex flex-col gap-3">
          {DYNAMICS_LIST.map((d, i) => {
            const stats = getStats(d.id);
            return (
              <motion.div
                key={d.id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2 + i}
                className="w-full flex bg-transparent rounded-2xl overflow-hidden glass-card relative"
                style={{ borderRadius: 16 }}
              >
                {/* Main area to start the therapy */}
                <button
                  onClick={() => navigate(DYNAMIC_ROUTES[d.id])}
                  className="flex-1 p-5 flex items-center gap-4 text-left cursor-pointer transition-all hover:bg-white/5 active:bg-white/10"
                  style={{ background: "transparent", border: "none" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: d.bgColor,
                      boxShadow: `0 4px 12px ${d.color}20`,
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={d.color}>
                      <path d={d.icon} />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, color: "#1A1520" }}>
                      {d.name}
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6A5A55", marginTop: 2, lineHeight: 1.5 }}>
                      {d.description}
                    </p>
                  </div>

                  {stats.total > 0 ? (
                    <div className="flex-shrink-0 text-right pr-2">
                      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, color: d.color, fontWeight: 500 }}>
                        {stats.total}x
                      </p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#B0A090" }}>
                        sessões
                      </p>
                    </div>
                  ) : (
                    <div className="flex-shrink-0 pr-2">
                      <Sparkles size={14} color="#B0A090" />
                    </div>
                  )}
                </button>

                {/* Science/Info button separator */}
                <div className="w-[1px] my-4" style={{ background: "rgba(26,21,32,0.06)" }} />

                {/* Info Area */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setScienceModal(d);
                  }}
                  className="flex flex-col items-center justify-center px-4 cursor-pointer transition-colors"
                  style={{ background: "transparent", border: "none", color: "rgba(26,21,32,0.4)" }}
                >
                  <Library size={20} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Science Info Modal */}
      <ScienceModal
        dynamic={scienceModal}
        onClose={() => setScienceModal(null)}
      />

    </AppLayout >
  );
};

export default CrisisHub;
