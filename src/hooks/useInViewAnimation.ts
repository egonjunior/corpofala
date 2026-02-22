import { useRef, useState, useCallback, useEffect } from "react";

export function useInViewAnimation(threshold = 0.6) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, hasTriggered]);

  const replay = useCallback(() => {
    setAnimKey((k) => k + 1);
    setHasTriggered(true);
  }, []);

  return { ref, hasTriggered, animKey, replay };
}
