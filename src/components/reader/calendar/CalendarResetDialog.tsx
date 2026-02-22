import { useState } from "react";

interface CalendarResetDialogProps {
  onReset: () => void;
  darkMode: boolean;
}

const CalendarResetDialog = ({ onReset, darkMode }: CalendarResetDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div style={{ textAlign: "right", marginTop: 12 }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: darkMode ? "rgba(255,255,255,0.3)" : "#B0A090",
            textDecoration: "underline",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Resetar calendário
        </button>
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26,21,32,0.7)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: darkMode ? "#2A2035" : "white",
              borderRadius: 12,
              padding: 28,
              maxWidth: 360,
              width: "100%",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                color: darkMode ? "rgba(255,255,255,0.8)" : "#1A1520",
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
              Tem certeza? Todo o progresso será perdido.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: `1px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}`,
                  background: "transparent",
                  color: darkMode ? "rgba(255,255,255,0.6)" : "#6A5A55",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onReset();
                  setOpen(false);
                }}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: "none",
                  background: "#FF4D4D",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Resetar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarResetDialog;
