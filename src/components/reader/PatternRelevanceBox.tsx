import { PATTERN_NAMES } from "@/data/readerContent";
import { useIsMobile } from "@/hooks/use-mobile";

interface PatternRelevanceBoxProps {
  patternKey: string;
  connectionText: string;
  darkMode: boolean;
}

const PatternRelevanceBox = ({ patternKey, connectionText, darkMode }: PatternRelevanceBoxProps) => {
  const isMobile = useIsMobile();
  const name = PATTERN_NAMES[patternKey] || patternKey;

  return (
    <div
      style={{
        background: darkMode ? "rgba(0,188,212,0.08)" : "rgba(0,188,212,0.06)",
        borderLeft: "2px solid #00BCD4",
        padding: "8px 12px",
        borderRadius: "0 6px 6px 0",
        marginTop: isMobile ? 12 : 0,
        marginBottom: isMobile ? 12 : 0,
      }}
    >
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "#00BCD4",
          display: "block",
        }}
      >
        ⟶ Padrão {name}
      </span>
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          color: darkMode ? "rgba(0,188,212,0.9)" : "rgba(0,188,212,0.8)",
        }}
      >
        {connectionText}
      </span>
    </div>
  );
};

export default PatternRelevanceBox;
