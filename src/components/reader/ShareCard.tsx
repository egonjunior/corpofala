import { forwardRef } from "react";

interface ShareCardProps {
  text: string;
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ text }, ref) => {
  const fontSize = text.length < 30 ? 36 : 28;
  const displayText = text.length > 280 ? text.slice(0, 280) + "..." : text;

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: -9999,
        top: 0,
        width: 1080,
        height: 1920,
        background: "linear-gradient(135deg, #1A1520, #2A2040)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* Grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          pointerEvents: "none",
        }}
      />

      {/* Top */}
      <div style={{ padding: "80px 60px 0" }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#00BCD4" />
        </svg>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: "#00BCD4", letterSpacing: "0.25em", marginTop: 12 }}>
          CORPOFALA
        </p>
      </div>

      {/* Center */}
      <div style={{ padding: "0 80px", position: "relative" }}>
        {/* Decorative quotes */}
        <span style={{ position: "absolute", top: -60, left: 40, fontSize: 180, opacity: 0.05, color: "white", fontFamily: "Georgia, serif", lineHeight: 1 }}>"</span>
        <p
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize,
            color: "white",
            lineHeight: 1.5,
            textAlign: "center",
            maxWidth: 920,
            margin: "0 auto",
          }}
        >
          {displayText}
        </p>
        <span style={{ position: "absolute", bottom: -80, right: 40, fontSize: 180, opacity: 0.05, color: "white", fontFamily: "Georgia, serif", lineHeight: 1 }}>"</span>
      </div>

      {/* Bottom */}
      <div style={{ padding: "0 60px 80px" }}>
        <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.2)", marginBottom: 24 }} />
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.7)", textAlign: "center", margin: 0 }}>
          O Que Seu Corpo Está Tentando Te Dizer
        </p>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#00BCD4", textAlign: "center", marginTop: 8 }}>
          corpofala.com
        </p>
      </div>
    </div>
  );
});

ShareCard.displayName = "ShareCard";

export default ShareCard;
