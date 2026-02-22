import { useState, useCallback, useEffect } from "react";

export interface Highlight {
  id: string;
  chapterId: string;
  paragraphIndex: number;
  startOffset: number;
  endOffset: number;
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

  // Re-apply highlights to DOM
  const applyHighlights = useCallback(
    (containerEl: HTMLElement) => {
      // Remove existing highlights first
      containerEl.querySelectorAll("[data-highlight-id]").forEach((el) => {
        const parent = el.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(el.textContent || ""), el);
          parent.normalize();
        }
      });

      for (const h of chapterHighlights) {
        const para = containerEl.querySelector(`[data-paragraph-index="${h.paragraphIndex}"]`);
        if (!para) continue;
        try {
          const textNodes: Text[] = [];
          const walk = document.createTreeWalker(para, NodeFilter.SHOW_TEXT);
          let node: Node | null;
          while ((node = walk.nextNode())) textNodes.push(node as Text);

          let charCount = 0;
          let startNode: Text | null = null;
          let endNode: Text | null = null;
          let startLocalOffset = 0;
          let endLocalOffset = 0;

          for (const tn of textNodes) {
            const len = tn.textContent?.length || 0;
            if (!startNode && charCount + len > h.startOffset) {
              startNode = tn;
              startLocalOffset = h.startOffset - charCount;
            }
            if (!endNode && charCount + len >= h.endOffset) {
              endNode = tn;
              endLocalOffset = h.endOffset - charCount;
              break;
            }
            charCount += len;
          }

          if (startNode && endNode) {
            const range = document.createRange();
            range.setStart(startNode, startLocalOffset);
            range.setEnd(endNode, endLocalOffset);

            const span = document.createElement("span");
            span.dataset.highlightId = h.id;
            span.dataset.highlightColor = h.color;
            const colors = { yellow: "#F5D54730", red: "#C4622D25", cyan: "#00BCD420" };
            span.style.backgroundColor = colors[h.color];
            span.style.borderRadius = "2px";
            span.style.cursor = "pointer";
            range.surroundContents(span);
          }
        } catch {
          // Range may fail on complex DOM — skip silently
        }
      }
    },
    [chapterHighlights]
  );

  return {
    highlights: chapterHighlights,
    allHighlights,
    summaries,
    notes,
    addHighlight,
    removeHighlight,
    updateNote,
    applyHighlights,
  };
}
