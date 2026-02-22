import { PulseCard, PULSE_THEMES, PulseCategory } from "@/data/pulseCards";
import { motion } from "framer-motion";

/* ── Font size helper ── */
function getQuoteFontSize(quote: string): number {
  if (quote.length < 80) return 24;
  if (quote.length < 150) return 19;
  return 15;
}

/* ── Category-specific SVG textures (elevated) ── */
const CategoryTexture = ({ category }: { category: PulseCategory }) => {
  switch (category) {
    case 'corpo':
      return (
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.07 }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <path
              key={i}
              d={`M ${-30 + i * 25} ${350 + Math.sin(i * 0.8) * 50} Q ${100 + i * 22} ${300 + Math.cos(i * 0.6) * 70}, ${260 + i * 18} ${380 + Math.sin(i * 1.3) * 40}`}
              stroke="rgba(196,98,45,0.5)" strokeWidth={0.6} fill="none"
            />
          ))}
          {/* Pulse wave */}
          <path
            d="M 0 240 Q 60 200, 120 240 T 240 240 T 360 240 T 480 240"
            stroke="rgba(196,98,45,0.12)" strokeWidth={1.5} fill="none"
          />
        </svg>
      );
    case 'mente':
      return (
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.10 }}>
          {Array.from({ length: 22 }).map((_, row) =>
            Array.from({ length: 22 }).map((_, col) => {
              const dist = Math.sqrt(Math.pow(col - 11, 2) + Math.pow(row - 11, 2));
              const opacity = Math.max(0, 1 - dist / 14);
              return (
                <circle key={`${row}-${col}`} cx={10 + col * 22} cy={10 + row * 22} r={1.2 * opacity + 0.3}
                  fill={`rgba(107,127,245,${0.6 * opacity})`} />
              );
            })
          )}
        </svg>
      );
    case 'alma':
      return (
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.12 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <circle key={i} cx="50%" cy="50%" r={40 + i * 30} fill="none"
              stroke={`rgba(138,127,245,${0.15 - i * 0.02})`} strokeWidth={0.5} />
          ))}
          {Array.from({ length: 40 }).map((_, i) => {
            const angle = (i / 40) * Math.PI * 2;
            const r = 60 + Math.sin(i * 3.7) * 40;
            const x = 50 + Math.cos(angle) * r * 0.4;
            const y = 50 + Math.sin(angle) * r * 0.4;
            return <circle key={`s${i}`} cx={`${x}%`} cy={`${y}%`} r={1 + (i % 3) * 0.5} fill={`rgba(138,127,245,${0.2 + (i % 5) * 0.04})`} />;
          })}
        </svg>
      );
    case 'poder':
      return (
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.08 }}>
          {[20, 40, 60, 80].map((y, i) => (
            <line key={i} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="rgba(0,188,212,0.4)" strokeWidth={0.8}
              strokeDasharray={i % 2 === 0 ? "none" : "4 8"} />
          ))}
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(0,188,212,0.06)" strokeWidth={0.5} />
        </svg>
      );
    case 'relacoes':
      return (
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.07 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <path key={i}
              d={`M 0 ${280 + i * 25 + Math.sin(i) * 20} Q ${240} ${260 + i * 22}, 480 ${290 + i * 25 + Math.cos(i) * 15}`}
              stroke="rgba(255,154,108,0.35)" strokeWidth={0.8} fill="none"
            />
          ))}
        </svg>
      );
    case 'presenca':
      return (
        <svg className="absolute inset-0 w-full h-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <circle key={i} cx="50%" cy="50%" r={60 + i * 40} fill="none"
              stroke={`rgba(42,32,53,${0.06 - i * 0.015})`} strokeWidth={0.8} />
          ))}
        </svg>
      );
    default:
      return null;
  }
};

/* ── Category-specific decorations (elevated) ── */
const CategoryDecoration = ({ category }: { category: PulseCategory }) => {
  const theme = PULSE_THEMES[category];
  switch (category) {
    case 'corpo':
      return (
        <div className="absolute bottom-5 right-5" style={{ opacity: 0.10 }}>
          <motion.svg width={140} height={140} viewBox="0 0 140 140"
            animate={{ scale: [1, 1.04, 1], opacity: [0.10, 0.14, 0.10] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}>
            <circle cx={70} cy={70} r={25} fill="none" stroke={theme.color} strokeWidth={1.2} />
            <circle cx={70} cy={70} r={42} fill="none" stroke={theme.color} strokeWidth={0.8} opacity={0.6} />
            <circle cx={70} cy={70} r={58} fill="none" stroke={theme.color} strokeWidth={0.5} opacity={0.3} />
          </motion.svg>
        </div>
      );
    case 'mente':
      return (
        <svg className="absolute top-3 right-3" width={130} height={130} viewBox="0 0 130 130" style={{ opacity: 0.12 }}>
          <path d="M 110 20 L 65 110 L 20 20 Z" fill="none" stroke="#6B7FF5" strokeWidth={0.8} />
          <path d="M 95 35 L 65 95 L 35 35 Z" fill="none" stroke="#6B7FF5" strokeWidth={0.5} opacity={0.5} />
        </svg>
      );
    case 'alma':
      return (
        <motion.div className="absolute right-4 top-1/4" style={{ opacity: 0.15 }}
          animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 60, ease: "linear" }}>
          <svg width={80} height={80} viewBox="0 0 80 80">
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              return <circle key={i} cx={40 + Math.cos(angle) * 25} cy={40 + Math.sin(angle) * 25} r={3} fill="none" stroke="#8A7FF5" strokeWidth={0.5} />;
            })}
          </svg>
        </motion.div>
      );
    case 'poder':
      return (
        <svg className="absolute bottom-5 right-5" width={90} height={90} viewBox="0 0 90 90" style={{ opacity: 0.12 }}>
          <path d="M 10 45 L 70 45 M 70 45 L 52 28 M 70 45 L 52 62" stroke="#00BCD4" strokeWidth={2} strokeLinecap="round" fill="none" />
          <path d="M 20 45 L 60 45" stroke="#00BCD4" strokeWidth={0.5} strokeLinecap="round" fill="none" opacity={0.4} strokeDasharray="2 4" />
        </svg>
      );
    case 'relacoes':
      return (
        <svg className="absolute top-6 right-6" width={90} height={70} viewBox="0 0 90 70" style={{ opacity: 0.10 }}>
          <circle cx={30} cy={35} r={22} fill="none" stroke="#FF9A6C" strokeWidth={0.8} />
          <circle cx={60} cy={35} r={22} fill="none" stroke="#FF9A6C" strokeWidth={0.8} />
        </svg>
      );
    default:
      return null;
  }
};

/* ── Background styles per category (elevated) ── */
function getCategoryBackground(category: PulseCategory): string {
  switch (category) {
    case 'corpo':
      return 'radial-gradient(ellipse at 70% 45%, rgba(196,98,45,0.45), transparent 65%), radial-gradient(ellipse at 15% 85%, rgba(139,52,12,0.30), transparent 65%), radial-gradient(ellipse at 90% 10%, rgba(196,98,45,0.10), transparent 50%), #2A1510';
    case 'mente':
      return 'radial-gradient(ellipse at 50% 40%, rgba(107,127,245,0.18), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(60,80,200,0.08), transparent 50%), #0D0F24';
    case 'alma':
      return 'radial-gradient(ellipse at 30% 65%, rgba(138,127,245,0.25), transparent 50%), radial-gradient(ellipse at 75% 25%, rgba(75,40,140,0.18), transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(100,80,200,0.05), transparent 70%), #08060F';
    case 'poder':
      return 'radial-gradient(ellipse at 60% 40%, rgba(0,188,212,0.12), transparent 50%), linear-gradient(45deg, transparent 30%, rgba(0,188,212,0.05) 50%, transparent 70%), #04151A';
    case 'relacoes':
      return 'radial-gradient(ellipse at 50% 0%, rgba(255,154,108,0.18), transparent 55%), radial-gradient(ellipse at 40% 100%, rgba(196,98,45,0.10), transparent 55%), #1E0E06';
    case 'presenca':
      return 'radial-gradient(ellipse at 50% 50%, rgba(230,218,200,0.3), transparent 60%), #F5EDE4';
    default:
      return '#1A1520';
  }
}

/* ── Main Card Component ── */
interface PulseCardViewProps {
  card: PulseCard;
  isShareMode?: boolean;
}

const PulseCardView = ({ card, isShareMode = false }: PulseCardViewProps) => {
  const theme = PULSE_THEMES[card.category];
  const isLight = card.category === 'presenca';
  const fontSize = getQuoteFontSize(card.quote);

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{
        background: getCategoryBackground(card.category),
        aspectRatio: '1 / 1',
        width: '100%',
        maxWidth: 480,
        borderRadius: 22,
        padding: isShareMode ? '44px' : 'clamp(24px, 5.5vw, 38px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: '0 auto',
        boxShadow: isLight
          ? '0 8px 40px rgba(42,32,53,0.08), 0 1px 3px rgba(42,32,53,0.06)'
          : `0 12px 48px rgba(0,0,0,0.35), 0 0 80px ${theme.color}08, inset 0 1px 0 rgba(255,255,255,0.04)`,
        border: isLight
          ? '1px solid rgba(42,32,53,0.06)'
          : `1px solid rgba(255,255,255,0.04)`,
      }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.045,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />

      {/* Subtle inner glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${theme.color}08, transparent 60%)`,
        }}
      />

      {/* Category texture */}
      <CategoryTexture category={card.category} />

      {/* Category decoration */}
      <CategoryDecoration category={card.category} />

      {/* ── TOPO: tag + intensity dot ── */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: theme.color,
          boxShadow: `0 0 8px ${theme.color}66`,
        }} />
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          letterSpacing: '0.25em',
          color: theme.color,
          opacity: 0.9,
        }}>
          {theme.label}
        </span>
        <span style={{
          marginLeft: 'auto',
          fontFamily: "'Space Mono', monospace",
          fontSize: 8,
          letterSpacing: '0.15em',
          color: isLight ? 'rgba(42,32,53,0.25)' : 'rgba(255,255,255,0.20)',
        }}>
          {card.intensity === 'profundo' ? '●●●' : card.intensity === 'medio' ? '●●○' : '●○○'}
        </span>
      </div>

      {/* ── CENTRO: quote ── */}
      <div className="relative z-[2] flex-1 flex flex-col justify-center py-3">
        {/* Aspas decorativas */}
        <span style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 90,
          color: theme.color,
          opacity: 0.06,
          position: 'absolute',
          top: -14,
          left: -6,
          lineHeight: 1,
          pointerEvents: 'none',
        }}>
          "
        </span>

        <p style={{
          fontFamily: "'DM Serif Display', serif",
          fontStyle: 'italic',
          fontSize,
          color: theme.textColor,
          lineHeight: 1.6,
          position: 'relative',
          zIndex: 1,
          textShadow: isLight ? 'none' : '0 1px 8px rgba(0,0,0,0.15)',
        }}>
          {card.quote}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <div style={{ width: 20, height: 1, background: theme.color, opacity: 0.35 }} />
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.18em',
            color: theme.color,
            opacity: 0.85,
          }}>
            {card.author.toUpperCase()}
          </span>
        </div>
        {card.authorRole && (
          <span style={{
            display: 'block',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            color: isLight ? 'rgba(42,32,53,0.32)' : 'rgba(255,255,255,0.30)',
            marginTop: 4,
            marginLeft: 23,
          }}>
            {card.authorRole}
          </span>
        )}
      </div>

      {/* ── BASE: contexto + reflexão ── */}
      <div className="relative z-[2]">
        <div style={{ width: 40, height: 1, background: theme.color, opacity: 0.18, marginBottom: 14 }} />

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          color: theme.contextColor,
          lineHeight: 1.7,
          display: '-webkit-box',
          WebkitLineClamp: isShareMode ? 1 : 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {card.context}
        </p>

        {!isShareMode && (
          <p className="mt-2" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontStyle: 'italic',
            fontSize: 12,
            color: theme.color,
            opacity: 0.75,
            lineHeight: 1.7,
          }}>
            ◦ {card.reflection}
          </p>
        )}

        {/* Watermark */}
        <div className="flex items-center justify-end gap-2 mt-3">
          <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
            <path d="M16 28s-1.5-1-3.5-2.8C8 21.2 4 17 4 12.5 4 8.9 6.9 6 10.5 6c2 0 3.9 1 5.5 2.8C17.6 7 19.5 6 21.5 6 25.1 6 28 8.9 28 12.5c0 1.5-.5 3-1.3 4.3" stroke={isLight ? 'rgba(42,32,53,0.18)' : 'rgba(255,255,255,0.18)'} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M18 20h2.5l1.5-3 2 6 2-3h2.5" stroke={isLight ? 'rgba(42,32,53,0.18)' : 'rgba(255,255,255,0.18)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 8,
            color: isLight ? 'rgba(42,32,53,0.18)' : 'rgba(255,255,255,0.18)',
            letterSpacing: '0.2em',
          }}>
            PULSO
          </span>
        </div>
      </div>
    </div>
  );
};

export default PulseCardView;
