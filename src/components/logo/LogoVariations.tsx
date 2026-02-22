/** 15 logo variations for comparison */

interface LogoProps {
  scale?: number;
}

/* ── Variation A: Ultra-minimal — lowercase + tiny heart dot ── */
export const LogoA = ({ scale = 1 }: LogoProps) => (
  <div className="flex items-center gap-2" style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
    <svg width={16} height={16} viewBox="0 0 32 32" fill="none">
      <path d="M16 28S4 20 4 12a6 6 0 0 1 12-1 6 6 0 0 1 12 1c0 8-12 16-12 16z" fill="#C4622D" opacity="0.65" />
    </svg>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 300, letterSpacing: "0.04em", color: "currentColor" }}>
      corpofala
    </span>
  </div>
);

/* ── Variation B: Heart-inline ── */
export const LogoB = ({ scale = 1 }: LogoProps) => (
  <div className="flex items-center" style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 400, letterSpacing: "0.02em", color: "currentColor" }}>corpo</span>
    <svg width={12} height={12} viewBox="0 0 32 32" fill="none" style={{ margin: "0 1px", marginTop: -1 }}>
      <path d="M16 28S4 20 4 12a6 6 0 0 1 12-1 6 6 0 0 1 12 1c0 8-12 16-12 16z" fill="#C4622D" opacity="0.8" />
    </svg>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 400, letterSpacing: "0.02em", color: "currentColor" }}>fala</span>
  </div>
);

/* ── Variation C: Stacked ── */
export const LogoC = ({ scale = 1 }: LogoProps) => (
  <div className="flex flex-col items-center gap-1.5" style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
    <svg width={20} height={20} viewBox="0 0 32 32" fill="none">
      <path d="M16 28S4 20 4 12a6 6 0 0 1 12-1 6 6 0 0 1 12 1c0 8-12 16-12 16z" fill="#C4622D" opacity="0.7" />
    </svg>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, letterSpacing: "0.12em", color: "currentColor", textTransform: "uppercase" as const }}>corpofala</span>
  </div>
);

/* ── Variation D: Monogram ── */
export const LogoD = ({ scale = 1 }: LogoProps) => (
  <div className="flex items-center gap-3" style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
    <div className="relative">
      <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "currentColor", lineHeight: 1 }}>cf</span>
      <svg width={8} height={8} viewBox="0 0 32 32" fill="none" style={{ position: "absolute", top: -2, right: -6 }}>
        <path d="M16 28S4 20 4 12a6 6 0 0 1 12-1 6 6 0 0 1 12 1c0 8-12 16-12 16z" fill="#C4622D" opacity="0.8" />
      </svg>
    </div>
    <div style={{ width: 1, height: 20, background: "currentColor", opacity: 0.15 }} />
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, letterSpacing: "0.06em", color: "currentColor" }}>corpofala</span>
  </div>
);

/* ── Variation E: Aesop ── */
export const LogoE = ({ scale = 1 }: LogoProps) => (
  <div className="flex items-center gap-3" style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 400, letterSpacing: "0.18em", color: "currentColor", textTransform: "uppercase" as const }}>corpofala</span>
    <svg width={14} height={14} viewBox="0 0 32 32" fill="none" style={{ opacity: 0.5 }}>
      <path d="M16 28S4 20 4 12a6 6 0 0 1 12-1 6 6 0 0 1 12 1c0 8-12 16-12 16z" fill="#C4622D" />
    </svg>
  </div>
);

/* ── Variation F: Dot separator ── */
export const LogoF = ({ scale = 1 }: LogoProps) => (
  <div className="flex items-center" style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 300, letterSpacing: "0.03em", color: "currentColor" }}>corpo</span>
    <span style={{ margin: "0 6px", color: "#C4622D", fontSize: 18, lineHeight: 1, fontWeight: 700 }}>·</span>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 300, letterSpacing: "0.03em", color: "currentColor" }}>fala</span>
  </div>
);

/* ── Variation G: Weight contrast ── */
export const LogoG = ({ scale = 1 }: LogoProps) => (
  <div className="flex items-center" style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 300, letterSpacing: "0.02em", color: "currentColor" }}>corpo</span>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: "0.02em", color: "currentColor" }}>fala</span>
  </div>
);

/* ── Variation H: Slash editorial ── */
export const LogoH = ({ scale = 1 }: LogoProps) => (
  <div className="flex items-center" style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 400, letterSpacing: "0.02em", color: "currentColor" }}>corpo</span>
    <span style={{ margin: "0 2px", color: "#C4622D", fontSize: 15, fontWeight: 300, opacity: 0.6 }}>/</span>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 400, letterSpacing: "0.02em", color: "currentColor" }}>fala</span>
  </div>
);

/* ── Variation I: Badge heart ── */
export const LogoI = ({ scale = 1 }: LogoProps) => (
  <div className="flex items-center gap-2.5" style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(196,98,45,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={11} height={11} viewBox="0 0 32 32" fill="none">
        <path d="M16 28S4 20 4 12a6 6 0 0 1 12-1 6 6 0 0 1 12 1c0 8-12 16-12 16z" fill="#C4622D" opacity="0.85" />
      </svg>
    </div>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 400, letterSpacing: "0.1em", color: "currentColor", textTransform: "uppercase" as const }}>corpofala</span>
  </div>
);

/* ── Variation J: Serif elegant ── */
export const LogoJ = ({ scale = 1 }: LogoProps) => (
  <div className="flex items-center" style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
    <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, fontWeight: 400, letterSpacing: "0.01em", color: "currentColor" }}>corpofala</span>
    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#C4622D", marginLeft: 4, marginBottom: 8, opacity: 0.7 }} />
  </div>
);

/* ═══════════════════════════════════════════════════════════
   $100K APPLE-TIER VARIATIONS (K–O)
   ═══════════════════════════════════════════════════════════ */

/* ── Variation K: "Product Page" — Apple SF Pro feel.
   Medium weight, negative tracking (tight like Apple product names).
   Heart reduced to a 6px period — functional, not decorative. ── */
export const LogoK = ({ scale = 1 }: LogoProps) => (
  <div className="flex items-baseline" style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
    <span style={{
      fontFamily: "-apple-system, 'SF Pro Display', 'DM Sans', sans-serif",
      fontSize: 17,
      fontWeight: 500,
      letterSpacing: "-0.01em",
      color: "currentColor",
    }}>
      corpofala
    </span>
    <svg width={6} height={6} viewBox="0 0 32 32" fill="none" style={{ marginLeft: 3, marginBottom: 1 }}>
      <path d="M16 28S4 20 4 12a6 6 0 0 1 12-1 6 6 0 0 1 12 1c0 8-12 16-12 16z" fill="#C4622D" opacity="0.5" />
    </svg>
  </div>
);

/* ── Variation L: "The Row" — Fashion-house restraint.
   Featherweight tracking with bold "fala" anchor.
   Maximum breathing room. Reads as luxury. ── */
export const LogoL = ({ scale = 1 }: LogoProps) => (
  <div className="flex items-center" style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
    <span style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 13,
      fontWeight: 300,
      letterSpacing: "0.28em",
      color: "currentColor",
    }}>
      corpo
    </span>
    <span style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 13,
      fontWeight: 500,
      letterSpacing: "0.28em",
      color: "currentColor",
    }}>
      fala
    </span>
  </div>
);

/* ── Variation M: "Pulse" — EKG heartbeat line connects corpo→fala.
   The symbol IS the meaning: body speaks through rhythm.
   Works as hero lockup and favicon-safe at small sizes. ── */
export const LogoM = ({ scale = 1 }: LogoProps) => (
  <div className="flex items-center" style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
    <span style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 15,
      fontWeight: 400,
      letterSpacing: "0.02em",
      color: "currentColor",
    }}>
      corpo
    </span>
    <svg width={24} height={12} viewBox="0 0 48 24" fill="none" style={{ margin: "0 4px", marginTop: 1 }}>
      <path
        d="M0 12h10l3-8 4 16 4-16 3 8h24"
        stroke="#C4622D"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
        fill="none"
      />
    </svg>
    <span style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 15,
      fontWeight: 400,
      letterSpacing: "0.02em",
      color: "currentColor",
    }}>
      fala
    </span>
  </div>
);

/* ── Variation N: "Google-tier" — Zero ornament, pure typography.
   Tight negative tracking. Bold corpo, light fala.
   The brand IS the word. Confidence without decoration. ── */
export const LogoN = ({ scale = 1 }: LogoProps) => (
  <div className="flex items-baseline" style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
    <span style={{
      fontFamily: "-apple-system, 'SF Pro Display', 'DM Sans', sans-serif",
      fontSize: 19,
      fontWeight: 600,
      letterSpacing: "-0.025em",
      color: "currentColor",
      lineHeight: 1,
    }}>
      corpo
    </span>
    <span style={{
      fontFamily: "-apple-system, 'SF Pro Display', 'DM Sans', sans-serif",
      fontSize: 19,
      fontWeight: 300,
      letterSpacing: "-0.025em",
      color: "currentColor",
      lineHeight: 1,
    }}>
      fala
    </span>
  </div>
);

/* ── Variation O: "Iconic mark" — Abstract body/heart fusion.
   A teardrop silhouette with heart negative space inside.
   Works at 16px and 200px. Paired with restrained wordmark. ── */
export const LogoO = ({ scale = 1 }: LogoProps) => (
  <div className="flex items-center gap-3" style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
    <svg width={28} height={28} viewBox="0 0 64 64" fill="none">
      <path
        d="M32 4C20 4 14 14 14 24c0 14 18 34 18 34s18-20 18-34c0-10-6-20-18-20z"
        fill="currentColor"
        opacity="0.08"
      />
      <path
        d="M32 48S20 38 20 28a6 6 0 0 1 12-1 6 6 0 0 1 12 1c0 10-12 20-12 20z"
        fill="#C4622D"
        opacity="0.65"
      />
    </svg>
    <span style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 14,
      fontWeight: 400,
      letterSpacing: "0.06em",
      color: "currentColor",
    }}>
      corpofala
    </span>
  </div>
);
