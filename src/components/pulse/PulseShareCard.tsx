import { forwardRef } from "react";
import { PulseCard, PULSE_THEMES, PulseCategory } from "@/data/pulseCards";

interface PulseShareCardProps {
  card: PulseCard;
  format: 'square' | 'story';
}

function getShareBackground(category: PulseCategory): string {
  switch (category) {
    case 'corpo':
      return 'radial-gradient(ellipse at 70% 40%, rgba(196,98,45,0.50), transparent 65%), radial-gradient(ellipse at 20% 85%, rgba(139,52,12,0.35), transparent 60%), #1A0D08';
    case 'mente':
      return 'radial-gradient(ellipse at 50% 30%, rgba(107,127,245,0.25), transparent 60%), linear-gradient(180deg, #0D0F24, #060818)';
    case 'alma':
      return 'radial-gradient(ellipse at 40% 60%, rgba(138,127,245,0.30), transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(75,40,140,0.20), transparent 55%), #050310';
    case 'poder':
      return 'radial-gradient(ellipse at 60% 40%, rgba(0,188,212,0.18), transparent 55%), linear-gradient(180deg, #04151A, #020D10)';
    case 'relacoes':
      return 'radial-gradient(ellipse at 50% 30%, rgba(255,154,108,0.22), transparent 55%), #120806';
    case 'presenca':
      return 'radial-gradient(ellipse at 50% 50%, rgba(230,218,200,0.4), transparent 65%), #F5EDE4';
    default:
      return '#1A1520';
  }
}

const PulseShareCard = forwardRef<HTMLDivElement, PulseShareCardProps>(({ card, format }, ref) => {
  const theme = PULSE_THEMES[card.category];
  const isLight = card.category === 'presenca';
  const isStory = format === 'story';
  const width = isStory ? 1080 : 1080;
  const height = isStory ? 1920 : 1080;

  const quoteFontSize = card.quote.length < 80 ? (isStory ? 52 : 44) : card.quote.length < 150 ? (isStory ? 40 : 34) : (isStory ? 32 : 26);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: -9999,
        top: 0,
        width,
        height,
        background: getShareBackground(card.category),
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* Subtle noise via CSS gradient instead of SVG filter (html2canvas compatible) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.12,
          background: `repeating-conic-gradient(${isLight ? 'rgba(42,32,53,0.03)' : 'rgba(255,255,255,0.02)'} 0% 25%, transparent 0% 50%) 0 0 / 4px 4px`,
          pointerEvents: "none",
        }}
      />

      {/* Glow orb */}
      <div
        style={{
          position: "absolute",
          width: isStory ? 600 : 500,
          height: isStory ? 600 : 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.color}22, transparent 70%)`,
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />

      {/* Top: category + branding */}
      <div style={{ padding: isStory ? "100px 80px 0" : "60px 60px 0", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: theme.color,
            boxShadow: `0 0 12px ${theme.color}88`,
          }} />
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 14,
            letterSpacing: "0.25em",
            color: theme.color,
          }}>
            {theme.label}
          </span>
        </div>
      </div>

      {/* Center: quote */}
      <div style={{ padding: isStory ? "0 100px" : "0 80px", position: "relative", zIndex: 2 }}>
        <span style={{
          position: "absolute",
          top: isStory ? -80 : -50,
          left: isStory ? 50 : 40,
          fontSize: isStory ? 240 : 160,
          opacity: 0.04,
          color: isLight ? "#2A2035" : "white",
          fontFamily: "Georgia, serif",
          lineHeight: 1,
        }}>"</span>

        <p style={{
          fontFamily: "'DM Serif Display', serif",
          fontStyle: "italic",
          fontSize: quoteFontSize,
          color: isLight ? "#1A1520" : "rgba(255,255,255,0.95)",
          lineHeight: 1.5,
          textAlign: "center",
          maxWidth: isStory ? 900 : 880,
          margin: "0 auto",
        }}>
          {card.quote}
        </p>

        <div style={{ textAlign: "center", marginTop: isStory ? 40 : 28 }}>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: isStory ? 16 : 14,
            letterSpacing: "0.2em",
            color: theme.color,
          }}>
            — {card.author.toUpperCase()}
          </span>
          {card.authorRole && (
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isStory ? 16 : 14,
              color: isLight ? "rgba(42,32,53,0.4)" : "rgba(255,255,255,0.35)",
              marginTop: 8,
            }}>
              {card.authorRole}
            </p>
          )}
        </div>
      </div>

      {/* Bottom: branding */}
      <div style={{ padding: isStory ? "0 80px 100px" : "0 60px 60px", position: "relative", zIndex: 2 }}>
        <div style={{
          width: "100%",
          height: 1,
          background: isLight ? "rgba(42,32,53,0.12)" : "rgba(255,255,255,0.12)",
          marginBottom: 24,
        }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              color: isLight ? "rgba(42,32,53,0.5)" : "rgba(255,255,255,0.5)",
            }}>
              O Que Seu Corpo Está Tentando Te Dizer
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M16 28s-1.5-1-3.5-2.8C8 21.2 4 17 4 12.5 4 8.9 6.9 6 10.5 6c2 0 3.9 1 5.5 2.8C17.6 7 19.5 6 21.5 6 25.1 6 28 8.9 28 12.5c0 1.5-.5 3-1.3 4.3" stroke={theme.color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M18 20h2.5l1.5-3 2 6 2-3h2.5" stroke={theme.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              color: theme.color,
              letterSpacing: "0.1em",
            }}>
              PULSO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

PulseShareCard.displayName = "PulseShareCard";

export default PulseShareCard;
