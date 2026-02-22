import { motion } from "framer-motion";

interface JarvisVisualizerProps {
  isPlaying: boolean;
}

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  angle: (360 / 12) * i,
  delay: i * 0.15,
}));

const JarvisVisualizer = ({ isPlaying }: JarvisVisualizerProps) => {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
      {/* Outer glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 180,
          height: 180,
          border: "1.5px solid rgba(0,188,212,0.3)",
          boxShadow: "0 0 40px rgba(0,188,212,0.15), inset 0 0 40px rgba(0,188,212,0.05)",
        }}
        animate={
          isPlaying
            ? {
                scale: [1, 1.08, 0.96, 1.04, 1],
                boxShadow: [
                  "0 0 40px rgba(0,188,212,0.15), inset 0 0 40px rgba(0,188,212,0.05)",
                  "0 0 60px rgba(0,188,212,0.4), inset 0 0 50px rgba(0,188,212,0.1)",
                  "0 0 35px rgba(0,188,212,0.2), inset 0 0 35px rgba(0,188,212,0.05)",
                  "0 0 55px rgba(0,188,212,0.35), inset 0 0 45px rgba(0,188,212,0.08)",
                  "0 0 40px rgba(0,188,212,0.15), inset 0 0 40px rgba(0,188,212,0.05)",
                ],
              }
            : {
                scale: [1, 1.03, 1],
                boxShadow: [
                  "0 0 40px rgba(0,188,212,0.15), inset 0 0 40px rgba(0,188,212,0.05)",
                  "0 0 50px rgba(0,188,212,0.25), inset 0 0 45px rgba(0,188,212,0.08)",
                  "0 0 40px rgba(0,188,212,0.15), inset 0 0 40px rgba(0,188,212,0.05)",
                ],
              }
        }
        transition={{
          duration: isPlaying ? 0.8 : 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Inner ring - rotating */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 120,
          height: 120,
          border: "1px solid rgba(0,188,212,0.25)",
          boxShadow: "0 0 20px rgba(0,188,212,0.1), inset 0 0 20px rgba(0,188,212,0.05)",
        }}
        animate={{
          rotate: 360,
          scale: isPlaying ? [1, 1.06, 0.95, 1.03, 1] : [1, 1.02, 1],
        }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          scale: {
            duration: isPlaying ? 0.6 : 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      {/* Core dot */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 8,
          height: 8,
          backgroundColor: "rgba(0,188,212,0.8)",
          boxShadow: "0 0 20px rgba(0,188,212,0.6)",
        }}
        animate={
          isPlaying
            ? {
                scale: [1, 1.8, 1, 1.5, 1],
                boxShadow: [
                  "0 0 20px rgba(0,188,212,0.6)",
                  "0 0 40px rgba(0,188,212,0.9)",
                  "0 0 15px rgba(0,188,212,0.5)",
                  "0 0 35px rgba(0,188,212,0.8)",
                  "0 0 20px rgba(0,188,212,0.6)",
                ],
              }
            : {
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 20px rgba(0,188,212,0.6)",
                  "0 0 30px rgba(0,188,212,0.8)",
                  "0 0 20px rgba(0,188,212,0.6)",
                ],
              }
        }
        transition={{
          duration: isPlaying ? 0.5 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Orbiting particles */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3,
            height: 3,
            backgroundColor: "rgba(0,188,212,0.6)",
            boxShadow: "0 0 6px rgba(0,188,212,0.4)",
            top: "50%",
            left: "50%",
          }}
          animate={{
            x: [
              Math.cos(((p.angle + 0) * Math.PI) / 180) * 75,
              Math.cos(((p.angle + 360) * Math.PI) / 180) * 75,
            ],
            y: [
              Math.sin(((p.angle + 0) * Math.PI) / 180) * 75,
              Math.sin(((p.angle + 360) * Math.PI) / 180) * 75,
            ],
            opacity: isPlaying ? [0.3, 0.9, 0.3] : [0.2, 0.5, 0.2],
            scale: isPlaying ? [1, 1.5, 1] : [1, 1.2, 1],
          }}
          transition={{
            x: { duration: 6, repeat: Infinity, ease: "linear", delay: p.delay },
            y: { duration: 6, repeat: Infinity, ease: "linear", delay: p.delay },
            opacity: { duration: isPlaying ? 0.8 : 2, repeat: Infinity, delay: p.delay * 0.5 },
            scale: { duration: isPlaying ? 0.6 : 2, repeat: Infinity, delay: p.delay * 0.5 },
          }}
        />
      ))}

      {/* Dashed ring */}
      <svg
        className="absolute"
        width="160"
        height="160"
        viewBox="0 0 160 160"
        style={{ opacity: 0.15 }}
      >
        <motion.circle
          cx="80"
          cy="80"
          r="72"
          fill="none"
          stroke="#00BCD4"
          strokeWidth="0.5"
          strokeDasharray="4 8"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        />
      </svg>
    </div>
  );
};

export default JarvisVisualizer;
