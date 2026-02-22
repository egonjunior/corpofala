import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Highlight } from "@/hooks/useHighlights";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { readerChapters } from "@/data/readerContent";
import { useNavigate } from "react-router-dom";

interface MarkingsPanelProps {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
  allHighlights: Highlight[];
  summaries: Highlight[];
  notes: Highlight[];
  onNavigateToHighlight: (h: Highlight) => void;
}

const tabs = ["Destaques", "Resumos", "Notas"] as const;

const colorDots: Record<string, string> = {
  yellow: "#F5D547",
  red: "#C4622D",
  cyan: "#00BCD4",
};

const MarkingsPanel = ({
  open,
  onClose,
  darkMode,
  allHighlights,
  summaries,
  notes,
  onNavigateToHighlight,
}: MarkingsPanelProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Destaques");
  const navigate = useNavigate();

  const items =
    activeTab === "Destaques" ? allHighlights : activeTab === "Resumos" ? summaries : notes;

  const bg = darkMode ? "#1A1520" : "#F2EDE4";
  const textColor = darkMode ? "rgba(255,255,255,0.75)" : "#2A2035";
  const mutedColor = darkMode ? "rgba(255,255,255,0.35)" : "#B0A090";
  const borderColor = darkMode ? "rgba(255,255,255,0.06)" : "rgba(26,21,32,0.06)";

  const chapterName = (chapterId: string) => {
    const ch = readerChapters.find((c) => c.slug === chapterId);
    return ch ? ch.title : chapterId;
  };

  const handleClick = (h: Highlight) => {
    onNavigateToHighlight(h);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200]"
            style={{ background: "rgba(0,0,0,0.3)" }}
          />

          {/* Panel */}
          <motion.div
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed z-[201] overflow-y-auto"
            style={
              isMobile
                ? {
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "70vh",
                    borderRadius: "16px 16px 0 0",
                    background: bg,
                  }
                : {
                    top: 0,
                    right: 0,
                    width: 320,
                    height: "100vh",
                    background: bg,
                    boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
                  }
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-3">
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 20,
                  color: darkMode ? "rgba(255,255,255,0.9)" : "#1A1520",
                }}
              >
                Minhas Marcações
              </h2>
              <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
                <X size={18} color={textColor} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 px-5 mb-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: activeTab === tab ? "#C4622D" : mutedColor,
                    borderBottom: activeTab === tab ? "2px solid #C4622D" : "2px solid transparent",
                    padding: "8px 12px",
                    background: "none",
                    border: "none",
                    borderBottomWidth: 2,
                    borderBottomStyle: "solid",
                    borderBottomColor: activeTab === tab ? "#C4622D" : "transparent",
                    cursor: "pointer",
                    letterSpacing: "0.1em",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Items */}
            <div className="px-5">
              {items.length === 0 ? (
                <p
                  className="text-center py-12"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: mutedColor,
                    lineHeight: 1.8,
                  }}
                >
                  Nenhuma marcação ainda.
                  <br />
                  Selecione qualquer trecho no texto.
                </p>
              ) : (
                items.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => handleClick(h)}
                    className="w-full text-left transition-opacity hover:opacity-80"
                    style={{
                      padding: "16px 0",
                      borderBottom: `1px solid ${borderColor}`,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className="rounded-full mt-1.5 flex-shrink-0"
                        style={{
                          width: 8,
                          height: 8,
                          background: colorDots[h.color] || "#B0A090",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="line-clamp-2"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 14,
                            color: textColor,
                            lineHeight: 1.5,
                          }}
                        >
                          {h.note || h.text}
                        </p>
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 10,
                            color: mutedColor,
                          }}
                        >
                          {chapterName(h.chapterId)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MarkingsPanel;
