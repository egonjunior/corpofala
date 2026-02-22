import { motion } from "framer-motion";
import { useMemo } from "react";

interface BreathingBlobProps {
  phase: "idle" | "inhale" | "hold" | "exhale";
  progress: number; // 0-1 within current phase
}

const PHASE_COLORS = {
  idle: "#00BCD4",
  inhale: "#00BCD4",
  hold: "#8A7FF5",
  exhale: "#FF9A6C",
};

const PHASE_SCALES = {
  idle: 0.5,
  inhale: 1,
  hold: 1,
  exhale: 0.4,
};

/**
 * Generates an organic blob SVG path with 8 control points.
 * seed adds variation so the blob looks alive.
 */
function generateBlobPath(radius: number, seed: number): string {
  const cx = 100, cy = 100;
  const points = 8;
  const pts: { x: number; y: number }[] = [];

  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const variation = Math.sin(angle * 3 + seed) * 6 + Math.cos(angle * 2 - seed * 0.7) * 4;
    const r = radius + variation;
    pts.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    });
  }

  // Build smooth closed path using quadratic bezier curves
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < points; i++) {
    const curr = pts[i];
    const next = pts[(i + 1) % points];
    const mx = (curr.x + next.x) / 2;
    const my = (curr.y + next.y) / 2;
    d += ` Q ${curr.x},${curr.y} ${mx},${my}`;
  }
  d += " Z";
  return d;
}

const BreathingBlob = ({ phase, progress }: BreathingBlobProps) => {
  const color = PHASE_COLORS[phase];

  // Calculate scale based on phase and progress
  const scale = useMemo(() => {
    if (phase === "inhale") return 0.4 + progress * 0.6;
    if (phase === "hold") return 1.0 + Math.sin(progress * Math.PI * 4) * 0.03;
    if (phase === "exhale") return 1.0 - progress * 0.6;
    return 0.5;
  }, [phase, progress]);

  // Generate two blob paths for morphing animation
  const path1 = useMemo(() => generateBlobPath(55, 0), []);
  const path2 = useMemo(() => generateBlobPath(55, Math.PI), []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
      {/* Glow layer */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          scale: scale * 1.3,
          opacity: phase === "hold" ? 0.15 : 0.08,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${color}40, transparent 70%)`,
        }}
      />

      {/* Main blob SVG */}
      <motion.svg
        viewBox="0 0 200 200"
        animate={{ scale }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: 200,
          height: 200,
          filter: `drop-shadow(0 0 30px ${color}50)`,
        }}
      >
        <defs>
          <radialGradient id="blobGradient" cx="40%" cy="40%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.15" />
          </radialGradient>
        </defs>
        {/* Animate between two organic shapes */}
        <motion.path
          d={path1}
          fill="url(#blobGradient)"
          stroke={color}
          strokeWidth="1.5"
          strokeOpacity="0.4"
          animate={{ d: phase === "hold" ? path2 : path1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      </motion.svg>
    </div>
  );
};

export default BreathingBlob;
