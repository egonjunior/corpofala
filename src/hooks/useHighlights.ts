import { useState, useCallback, useEffect } from "react";

export interface Highlight {
  id: string;
  chapterId: string;
  paragraphIndex: number;
  text: string;
  color: "yellow" | "red" | "cyan";
  note: string | null;
  timestamp: string;
}

function loadHighlights(): Highlight[] {
  try {
    const raw = localStorage.getItem("userHighlights");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useHighlights(chapterId: string) {
  const [highlights, setHighlights] = useState<Highlight[]>(loadHighlights);

  useEffect(() => {
    localStorage.setItem("userHighlights", JSON.stringify(highlights));
  }, [highlights]);

  const chapterHighlights = highlights.filter((h) => h.chapterId === chapterId);

  const addHighlight = useCallback(
    (data: Omit<Highlight, "id" | "timestamp" | "chapterId">) => {
      const newH: Highlight = {
        ...data,
        id: crypto.randomUUID(),
        chapterId,
        timestamp: new Date().toISOString(),
      };
      setHighlights((prev) => [...prev, newH]);
      return newH;
    },
    [chapterId]
  );

  const removeHighlight = useCallback((id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const updateNote = useCallback((id: string, note: string) => {
    setHighlights((prev) => prev.map((h) => (h.id === id ? { ...h, note } : h)));
  }, []);

  const allHighlights = highlights;
  const summaries = highlights.filter((h) => h.color === "cyan");
  const notes = highlights.filter((h) => h.note);

  return {
    highlights: chapterHighlights,
    allHighlights,
    summaries,
    notes,
    addHighlight,
    removeHighlight,
    updateNote,
  };
}
