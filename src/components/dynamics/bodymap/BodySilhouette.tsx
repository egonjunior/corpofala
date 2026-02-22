import { motion } from "framer-motion";
import { BODY_ZONES_LIST, type BodyZone } from "@/data/dynamicsContent";

interface BodySilhouetteProps {
  mode: "draw" | "scan" | "mark" | "display";
  markedZones?: Set<string>;
  activeZone?: string | null;
  sensationsMap?: Record<string, string[]>;
  onZoneTap?: (zoneId: string) => void;
  onZoneTouch?: (zoneId: string, point: { x: number; y: number }) => void;
  className?: string;
}

const BodySilhouette = ({
  mode,
  markedZones = new Set(),
  activeZone,
  sensationsMap = {},
  onZoneTap,
  onZoneTouch,
  className = "",
}: BodySilhouetteProps) => {

  const handleInteraction = (zone: BodyZone, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as SVGElement).closest("svg")?.getBoundingClientRect();
    if (!rect) return;

    let clientX = 0, clientY = 0;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    if (mode === "scan" && onZoneTouch) {
      onZoneTouch(zone.id, { x: clientX, y: clientY });
    } else if ((mode === "mark" || mode === "display") && onZoneTap) {
      onZoneTap(zone.id);
    }
  };

  const getZoneFill = (zone: BodyZone) => {
    const isMarked = markedZones.has(zone.id);
    const isActive = activeZone === zone.id;
    if (isActive) return `${zone.color}50`;
    if (isMarked) {
      const sCount = (sensationsMap[zone.id] || []).length;
      const opacity = sCount >= 3 ? "60" : sCount >= 2 ? "45" : "30";
      return `${zone.color}${opacity}`;
    }
    return "transparent";
  };

  const getZoneStroke = (zone: BodyZone) => {
    if (markedZones.has(zone.id)) return zone.color;
    if (activeZone === zone.id) return "rgba(255,255,255,0.4)";
    return "rgba(255,255,255,0.12)";
  };

  return (
    <svg
      viewBox="70 0 180 395"
      className={`w-full max-w-[280px] h-auto ${className}`}
      style={{ filter: "drop-shadow(0 0 20px rgba(255,255,255,0.03))" }}
    >
      {/* Body outline — drawn with stroke animation */}
      {mode === "draw" && (
        <g>
          {BODY_ZONES_LIST.map((zone, i) => (
            <motion.path
              key={zone.id}
              d={zone.path}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 2, delay: i * 0.15, ease: "easeInOut" },
                opacity: { duration: 0.3, delay: i * 0.15 },
              }}
            />
          ))}
        </g>
      )}

      {/* Interactive zones */}
      {mode !== "draw" && BODY_ZONES_LIST.map((zone) => {
        const isMarked = markedZones.has(zone.id);
        return (
          <g key={zone.id}>
            {/* Glow layer for marked zones */}
            {isMarked && (
              <motion.path
                d={zone.path}
                fill="none"
                stroke={zone.color}
                strokeWidth="6"
                opacity={0.15}
                filter="url(#glow)"
                animate={{ opacity: [0.1, 0.25, 0.1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Invisible hit area for better mobile touch */}
            <path
              d={zone.path}
              fill="transparent"
              stroke="transparent"
              strokeWidth="20"
              style={{ cursor: mode !== "display" || onZoneTap ? "pointer" : "default" }}
              onTouchStart={(e) => handleInteraction(zone, e)}
              onClick={(e) => handleInteraction(zone, e)}
              role="button"
              aria-label={zone.label}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  if (onZoneTap) onZoneTap(zone.id);
                }
              }}
            />

            {/* Zone path (visual) */}
            <motion.path
              d={zone.path}
              fill={getZoneFill(zone)}
              stroke={getZoneStroke(zone)}
              strokeWidth={isMarked ? 1.5 : 0.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pointerEvents: "none", transition: "fill 0.4s, stroke 0.4s" }}
              whileTap={mode !== "display" ? { scale: 0.97 } : undefined}
            />

            {/* Label for marked zones */}
            {isMarked && mode === "display" && (
              <text
                x={zone.centerX}
                y={zone.centerY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="rgba(255,255,255,0.7)"
                fontSize="7"
                fontFamily="'DM Mono', monospace"
                style={{ pointerEvents: "none" }}
              >
                {zone.label}
              </text>
            )}
          </g>
        );
      })}

      {/* SVG filter for glow */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

export default BodySilhouette;
