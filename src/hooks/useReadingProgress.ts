import { useEffect, useRef, useCallback } from "react";

interface UseReadingProgressOpts {
  onProgress: (pct: number) => void;
  onParagraph: (index: number) => void;
}

export function useReadingProgress({ onProgress, onParagraph }: UseReadingProgressOpts) {
  const contentRef = useRef<HTMLDivElement>(null);
  const lastParagraphRef = useRef(0);

  // Scroll-based progress with throttle
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = contentRef.current;
        if (!el) { ticking = false; return; }
        const rect = el.getBoundingClientRect();
        const totalHeight = el.scrollHeight - window.innerHeight;
        const scrolled = -rect.top + 52; // account for header
        const pct = Math.min(100, Math.max(0, Math.round((scrolled / totalHeight) * 100)));
        onProgress(pct);
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onProgress]);

  // IntersectionObserver for paragraphs
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const paragraphs = el.querySelectorAll("[data-paragraph-index]");
    if (!paragraphs.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = parseInt((entry.target as HTMLElement).dataset.paragraphIndex || "0", 10);
            if (idx !== lastParagraphRef.current) {
              lastParagraphRef.current = idx;
              onParagraph(idx);
            }
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    paragraphs.forEach((p) => observer.observe(p));
    return () => observer.disconnect();
  }, [onParagraph]);

  return { contentRef };
}
