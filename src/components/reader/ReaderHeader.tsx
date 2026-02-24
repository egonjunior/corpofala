import { ArrowLeft, Maximize2, Moon, Sun, BookMarked, User, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface ReaderHeaderProps {
  chapterTitle: string;
  focusMode: boolean;
  darkMode: boolean;
  isVisible?: boolean;
  onToggleFocus: () => void;
  onToggleDark: () => void;
  onOpenMarkings: () => void;
  onOpenMap?: () => void;
}

const ReaderHeader = ({
  chapterTitle,
  focusMode,
  darkMode,
  isVisible = true,
  onToggleFocus,
  onToggleDark,
  onOpenMarkings,
  onOpenMap,
}: ReaderHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (focusMode) return null;

  const bg = darkMode ? "rgba(26,21,32,0.95)" : "rgba(242,237,228,0.94)";
  const borderColor = darkMode ? "rgba(255,255,255,0.07)" : "rgba(26,21,32,0.07)";
  const textMuted = darkMode ? "rgba(255,255,255,0.45)" : "#8A7A70";
  const textLabel = darkMode ? "rgba(255,255,255,0.35)" : "#B0A090";
  const iconColor = darkMode ? "rgba(255,255,255,0.6)" : "#8A7A70";

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? "0%" : "-100%", opacity: isVisible ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 35, mass: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        height: 52,
        background: bg,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${borderColor}`,
        padding: "0 24px",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/app/dashboard")}
          className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: textMuted }}
        >
          <ArrowLeft size={16} />
          <span>voltar</span>
        </button>
        {!isMobile && (
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: textLabel,
              marginLeft: 8,
            }}
          >
            O Que Seu Corpo...
          </span>
        )}
      </div>

      {/* Center — desktop only */}
      {!isMobile && (
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: textMuted,
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {chapterTitle}
        </span>
      )}

      {/* Right */}
      <div className="flex items-center gap-2">
        {onOpenMap && (
          <button
            onClick={onOpenMap}
            className="flex items-center gap-1.5 rounded-full transition-opacity hover:opacity-70"
            style={{ height: 32, padding: isMobile ? "0 6px" : "0 10px" }}
            title="Meu Mapa"
          >
            <Map size={16} color={iconColor} />
            {!isMobile && (
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: iconColor }}>
                Meu Mapa
              </span>
            )}
          </button>
        )}
        <button
          onClick={onOpenMarkings}
          className="flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
          style={{ width: 32, height: 32 }}
          title="Minhas Marcações"
        >
          <BookMarked size={16} color={iconColor} />
        </button>
        <button
          onClick={onToggleFocus}
          className="flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
          style={{ width: 32, height: 32 }}
          title="Modo Foco"
        >
          <Maximize2 size={16} color={iconColor} />
        </button>
        <button
          onClick={onToggleDark}
          className="flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
          style={{ width: 32, height: 32 }}
          title={darkMode ? "Modo Claro" : "Modo Noturno"}
        >
          {darkMode ? <Sun size={16} color={iconColor} /> : <Moon size={16} color={iconColor} />}
        </button>
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: 28,
            height: 28,
            background: darkMode ? "rgba(255,255,255,0.1)" : "#D4C9BF",
          }}
        >
          <User size={14} color={darkMode ? "rgba(255,255,255,0.5)" : "#8A7A70"} />
        </div>
      </div>
    </motion.header>
  );
};

export default ReaderHeader;
