import { PATTERN_NAMES } from "@/data/readerContent";
import { protocolVariations } from "@/data/protocolVariations";

interface PersonalizedProtocolBoxProps {
  dominantPattern: string;
  stepKey: string;
  darkMode: boolean;
}

const PersonalizedProtocolBox = ({ dominantPattern, stepKey, darkMode }: PersonalizedProtocolBoxProps) => {
  const variations = protocolVariations[dominantPattern];
  if (!variations) return null;

  const text = variations[stepKey];
  if (!text) return null;

  const patternName = PATTERN_NAMES[dominantPattern] || dominantPattern;

  return (
    <div
      style={{
        background: darkMode
          ? "linear-gradient(135deg, rgba(0,188,212,0.06), rgba(0,188,212,0.12))"
          : "linear-gradient(135deg, rgba(0,188,212,0.04), rgba(0,188,212,0.08))",
        borderLeft: "3px solid #00BCD4",
        borderRadius: "0 10px 10px 0",
        padding: 20,
        margin: "16px 0",
        boxShadow: "0 2px 12px rgba(0,188,212,0.08)",
      }}
    >
      {/* Label */}
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          color: "#00BCD4",
          letterSpacing: "0.2em",
          marginBottom: 12,
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Heart+wave icon */}
        <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
          <path
            d="M10 17s-7-4.5-7-9a4 4 0 0 1 7-2.5A4 4 0 0 1 17 8c0 4.5-7 9-7 9z"
            fill="none"
            stroke="#00BCD4"
            strokeWidth={1.5}
          />
          <path
            d="M4 10h2l1.5-3 2 6 1.5-3H14"
            stroke="#00BCD4"
            strokeWidth={1}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        PARA O SEU PADRÃO · {patternName}
      </div>

      {/* Content */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          lineHeight: 1.7,
          color: darkMode ? "rgba(255,255,255,0.75)" : "#2A2035",
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
};

export default PersonalizedProtocolBox;
