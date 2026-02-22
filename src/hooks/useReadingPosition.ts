import { useEffect, useRef, useCallback } from "react";

interface UseReadingPositionOpts {
  chapterId: string;
  onSave: (chapterId: string, scrollY: number, paragraphIndex: number) => void;
  currentParagraph: number;
}

export function useReadingPosition({ chapterId, onSave, currentParagraph }: UseReadingPositionOpts) {
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      onSave(chapterId, window.scrollY, currentParagraph);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [chapterId, onSave, currentParagraph]);

  const scrollToPosition = useCallback((paragraphIndex: number) => {
    const el = document.querySelector(`[data-paragraph-index="${paragraphIndex}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return { scrollToPosition };
}
