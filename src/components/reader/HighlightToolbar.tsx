import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Share2 } from "lucide-react";

interface HighlightToolbarProps {
  darkMode: boolean;
  focusMode: boolean;
  onHighlight: (color: "yellow" | "red" | "cyan") => void;
  onNote: (note: string) => void;
  onRemove?: () => void;
  onShare?: (text: string) => void;
  isExisting?: boolean;
}

const HighlightToolbar = ({
  darkMode,
  focusMode,
  onHighlight,
  onNote,
  onRemove,
  onShare,
  isExisting,
}: HighlightToolbarProps) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const handleSelection = useCallback(() => {
    if (focusMode) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      // Check if clicked on existing highlight
      return;
    }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const toolbarWidth = 180;
    let x = rect.left + rect.width / 2 - toolbarWidth / 2;
    x = Math.max(8, Math.min(x, window.innerWidth - toolbarWidth - 8));
    const y = rect.top + window.scrollY - 52;

    setPos({ x, y });
    setVisible(true);
    setShowNoteInput(false);
    setActiveHighlightId(null);
  }, [focusMode]);

  // Listen for existing highlight clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const highlightEl = target.closest("[data-highlight-id]") as HTMLElement | null;

      if (highlightEl) {
        const rect = highlightEl.getBoundingClientRect();
        const toolbarWidth = 180;
        let x = rect.left + rect.width / 2 - toolbarWidth / 2;
        x = Math.max(8, Math.min(x, window.innerWidth - toolbarWidth - 8));
        setPos({ x, y: rect.top + window.scrollY - 52 });
        setVisible(true);
        setShowNoteInput(false);
        setActiveHighlightId(highlightEl.dataset.highlightId || null);
        return;
      }

      // Click outside toolbar
      if (toolbarRef.current && !toolbarRef.current.contains(target)) {
        setVisible(false);
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("click", handleClick);
    };
  }, [handleSelection]);

  // Touch support
  useEffect(() => {
    const handleTouchEnd = () => {
      setTimeout(handleSelection, 200);
    };
    document.addEventListener("touchend", handleTouchEnd);
    return () => document.removeEventListener("touchend", handleTouchEnd);
  }, [handleSelection]);

  const handleHighlightClick = (color: "yellow" | "red" | "cyan") => {
    onHighlight(color);
    setVisible(false);
    window.getSelection()?.removeAllRanges();
  };

  const handleSaveNote = () => {
    if (noteText.trim()) {
      onNote(noteText.trim());
      setNoteText("");
      setShowNoteInput(false);
      setVisible(false);
    }
  };

  const handleRemove = () => {
    onRemove?.();
    setVisible(false);
  };

  if (!visible) return null;

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
          {!activeHighlightId &&
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
          {!activeHighlightId && (
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
          {!activeHighlightId && onShare && (
            <button
              onClick={() => {
                const sel = window.getSelection();
                if (sel && sel.toString().trim()) {
                  onShare(sel.toString().trim());
                  setVisible(false);
                  sel.removeAllRanges();
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
          {activeHighlightId && (
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
