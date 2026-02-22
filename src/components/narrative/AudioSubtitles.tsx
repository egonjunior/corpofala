import { motion, AnimatePresence } from "framer-motion";

interface Subtitle {
  time: number;
  text: string;
}

interface AudioSubtitlesProps {
  subtitles: Subtitle[];
  currentIndex: number;
}

const AudioSubtitles = ({ subtitles, currentIndex }: AudioSubtitlesProps) => {
  // Show current and previous line (max 2 visible)
  const visible = subtitles
    .map((s, i) => ({ ...s, i }))
    .filter((s) => s.i >= Math.max(0, currentIndex - 1) && s.i <= currentIndex);

  return (
    <div className="flex flex-col items-center gap-1" style={{ minHeight: 60 }}>
      <AnimatePresence mode="popLayout">
        {visible.map((s) => (
          <motion.p
            key={s.i}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: s.i === currentIndex ? 1 : 0.4,
              y: 0,
            }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center px-4"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: 14,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {s.text}
            {s.i === currentIndex && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                style={{ color: "#00BCD4", marginLeft: 2 }}
              >
                |
              </motion.span>
            )}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AudioSubtitles;
