import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Share2 } from "lucide-react";

import { ReaderChapter } from "@/data/readerContent";
import { Highlight } from "@/hooks/useHighlights";

interface HighlightToolbarProps {
  darkMode: boolean;
  focusMode: boolean;
  activeParagraphIndex: number | null;
  chapter: ReaderChapter | undefined;
  chapterHighlights: Highlight[];
  onClose: () => void;
  onHighlight: (color: "yellow" | "red" | "cyan") => void;
  onNote: (note: string) => void;
  onRemove?: () => void;
  onShare?: (text: string) => void;
  isExisting?: boolean;
}

const HighlightToolbar = ({
  darkMode,
  focusMode,
  activeParagraphIndex,
  chapter,
  chapterHighlights,
  onClose,
  onHighlight,
  onNote,
  onRemove,
  onShare,
  isExisting,
}: HighlightToolbarProps) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState("");
  const toolbarRef = useRef<HTMLDivElement>(null);

  const activeHighlight = activeParagraphIndex !== null
    ? chapterHighlights.find(h => h.paragraphIndex === activeParagraphIndex)
    : null;

  // Position the toolbar above the active paragraph
  useEffect(() => {
    if (activeParagraphIndex === null) {
      setShowNoteInput(false);
      setNoteText("");
      return;
    }

    // Small delay to allow CSS transitions or DOM updates
    setTimeout(() => {
      const el = document.querySelector(`[data-paragraph-index="${activeParagraphIndex}"]`);
      if (el) {
        const rect = el.getBoundingClientRect();
        const toolbarWidth = 180;
        let x = rect.left + rect.width / 2 - toolbarWidth / 2;
        x = Math.max(8, Math.min(x, window.innerWidth - toolbarWidth - 8));

        // Place it slightly above the paragraph
        setPos({ x, y: rect.top + window.scrollY - 56 });
      }
    }, 50);

  }, [activeParagraphIndex]);

  // Click outside to close
  useEffect(() => {
    if (activeParagraphIndex === null) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If clicking inside toolbar, ignore
      if (toolbarRef.current?.contains(target)) return;
      // If clicking on another paragraph, ignore (let ReaderContent handle it)
      if (target.closest("[data-paragraph-index]")) return;

      onClose();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [activeParagraphIndex, onClose]);

  const handleHighlightClick = (color: "yellow" | "red" | "cyan") => {
    onHighlight(color);
  };

  const handleSaveNote = () => {
    if (noteText.trim()) {
      onNote(noteText.trim());
      setNoteText("");
      setShowNoteInput(false);
    }
  };

  const handleRemove = () => {
    onRemove?.();
  };

  if (activeParagraphIndex === null) return null;

  const buttons = [
    { color: "#F5D547", key: "yellow" as const, tooltip: "Destacar" },
    { color: "#C4622D", key: "red" as const, tooltip: "Importante" },
    { color: "#00BCD4", key: "cyan" as const, tooltip: "Resumo" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        ref={toolbarRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          zIndex: 100,
          background: "#1A1520",
          borderRadius: 8,
          padding: showNoteInput ? "8px 10px 12px" : "8px 10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <div className="flex items-center gap-1.5">
          {!activeHighlight &&
            buttons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => handleHighlightClick(btn.key)}
                title={btn.tooltip}
                className="rounded-full transition-transform hover:scale-110"
                style={{
                  width: 28,
                  height: 28,
                  background: btn.color,
                  opacity: 0.85,
                  border: "none",
                  cursor: "pointer",
                }}
              />
            ))}
          {!activeHighlight && (
            <button
              onClick={() => setShowNoteInput(!showNoteInput)}
              title="Nota"
              className="rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{
                width: 28,
                height: 28,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Pencil size={14} color="white" />
            </button>
          )}
          {!activeHighlight && onShare && (
            <button
              onClick={() => {
                if (chapter && activeParagraphIndex !== null) {
                  const ptext = chapter.paragraphs[activeParagraphIndex]?.text;
                  if (ptext) onShare(ptext);
                }
              }}
              title="Compartilhar trecho"
              className="rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{
                width: 28,
                height: 28,
                background: "rgba(0,188,212,0.7)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Share2 size={14} color="white" />
            </button>
          )}
          {activeHighlight && (
            <button
              onClick={handleRemove}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: "rgba(255,255,255,0.7)",
                background: "none",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              ✕ Remover destaque
            </button>
          )}
        </div>

        {showNoteInput && (
          <div style={{ marginTop: 8 }}>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value.slice(0, 200))}
              placeholder="Sua nota..."
              style={{
                width: "100%",
                minWidth: 200,
                minHeight: 48,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 6,
                padding: "8px 10px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.8)",
                resize: "none",
                outline: "none",
              }}
            />
            <div className="flex items-center justify-between mt-1.5">
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                {noteText.length}/200
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowNoteInput(false); setNoteText(""); }}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={!noteText.trim()}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    color: noteText.trim() ? "#00BCD4" : "rgba(255,255,255,0.2)",
                    background: "none",
                    border: "none",
                    cursor: noteText.trim() ? "pointer" : "default",
                  }}
                >
                  Salvar nota
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default HighlightToolbar;
