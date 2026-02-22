import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const ReadingProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => setPercent(Math.round(v * 100)));
  }, [scrollYProgress]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
      <motion.div
        className="h-full bg-primary origin-left"
        style={{ scaleX }}
      />
      <span className="absolute right-3 top-2 text-xs font-medium text-muted-foreground opacity-80">
        {percent}%
      </span>
    </div>
  );
};

export default ReadingProgress;
