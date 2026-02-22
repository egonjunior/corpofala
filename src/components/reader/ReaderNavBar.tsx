import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { readerChapters } from "@/data/readerContent";

interface ReaderNavBarProps {
  currentSlug: string;
  focusMode: boolean;
  darkMode: boolean;
}

const ReaderNavBar = ({ currentSlug, focusMode, darkMode }: ReaderNavBarProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (focusMode) return null;

  const currentIndex = readerChapters.findIndex((c) => c.slug === currentSlug);
  const total = readerChapters.length;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < total - 1;

  const bg = darkMode ? "rgba(26,21,32,0.96)" : "rgba(242,237,228,0.96)";
  const borderColor = darkMode ? "rgba(255,255,255,0.07)" : "rgba(26,21,32,0.07)";
  const mutedColor = darkMode ? "rgba(255,255,255,0.35)" : "#8A7A70";
  const labelColor = darkMode ? "rgba(255,255,255,0.3)" : "#B0A090";
  const activeColor = "#C4622D";

  const goTo = (slug: string) => navigate(`/app/ebook/${slug}`);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        height: 56,
        background: bg,
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${borderColor}`,
        padding: "0 24px",
      }}
    >
      <button
        onClick={() => hasPrev && goTo(readerChapters[currentIndex - 1].slug)}
        disabled={!hasPrev}
        className="transition-opacity"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          color: hasPrev ? mutedColor : "transparent",
          opacity: hasPrev ? 1 : 0,
        }}
      >
        ← Cap. anterior
      </button>

      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: labelColor,
        }}
      >
        Cap. {currentIndex + 1} de {total}
      </span>

      <button
        onClick={() => hasNext && goTo(readerChapters[currentIndex + 1].slug)}
        disabled={!hasNext}
        className="transition-opacity"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          color: hasNext ? activeColor : "transparent",
          opacity: hasNext ? 1 : 0,
        }}
      >
        Próximo cap. →
      </button>
    </nav>
  );
};

export default ReaderNavBar;
