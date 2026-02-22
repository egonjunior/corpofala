import { useState, useRef, useEffect } from "react";

interface MirrorCardProps {
  introQuestion: string | null;
  conclusionReflection: string | null;
  reflectionSavedAt: string | null;
  onSaveReflection: (text: string) => void;
  darkMode: boolean;
}

const MirrorCard = ({
  introQuestion,
  conclusionReflection,
  reflectionSavedAt,
  onSaveReflection,
  darkMode,
}: MirrorCardProps) => {
  const [text, setText] = useState(conclusionReflection || "");
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const saved = !!reflectionSavedAt;

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const handleSave = () => {
    if (text.trim()) onSaveReflection(text.trim());
  };

  if (!introQuestion) return null;

  return (
    <div
      data-mirror-card
      ref={ref}
      style={{
        margin: "48px 0",
        background: "linear-gradient(135deg, rgba(0,188,212,0.04), rgba(196,98,45,0.04))",
        borderRadius: 12,
        borderLeft: "3px solid #00BCD4",
        padding: 32,
        boxShadow: "0 2px 16px rgba(0,188,212,0.08)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.2em",
          color: "#00BCD4",
          display: "block",
          marginBottom: 16,
        }}
      >
        VOCÊ LEMBRA?
      </span>

      <h3
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 20,
          color: darkMode ? "rgba(255,255,255,0.9)" : "#1A1520",
          marginBottom: 20,
        }}
      >
        Quando você começou, você escreveu:
      </h3>

      <div
        style={{
          background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.6)",
          borderLeft: "3px solid #C4622D",
          borderRadius: "0 8px 8px 0",
          padding: "16px 20px",
          marginBottom: 24,
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontStyle: "italic",
            fontSize: 16,
            color: darkMode ? "rgba(255,255,255,0.75)" : "#2A2035",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          "{introQuestion}"
        </p>
      </div>

      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          color: darkMode ? "rgba(255,255,255,0.5)" : "#6A5A55",
          lineHeight: 1.7,
          marginBottom: 16,
        }}
      >
        Você ainda quer entender isso?
        <br />
        Ou a resposta mudou depois de ler este livro?
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 300))}
        disabled={saved}
        placeholder="Como você responderia essa pergunta agora?"
        style={{
          width: "100%",
          minHeight: 100,
          background: darkMode ? "rgba(255,255,255,0.05)" : "#F2EDE4",
          border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "#D4C9BF"}`,
          borderRadius: 8,
          padding: "14px 16px",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          color: darkMode ? "rgba(255,255,255,0.8)" : "#2A2035",
          resize: "vertical",
          outline: "none",
          opacity: saved ? 0.6 : 1,
        }}
      />
      <div style={{ textAlign: "right", marginTop: 8 }}>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: darkMode ? "rgba(255,255,255,0.3)" : "#B0A090",
          }}
        >
          {text.length}/300
        </span>
      </div>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
        {saved ? (
          <button
            disabled
            style={{
              background: "rgba(0,188,212,0.1)",
              border: "1px solid #00BCD4",
              borderRadius: 8,
              padding: "12px 24px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: "#00BCD4",
              cursor: "not-allowed",
            }}
          >
            ✓ Reflexão salva
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            style={{
              background: text.trim() ? "#C4622D" : "rgba(196,98,45,0.3)",
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: "white",
              cursor: text.trim() ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
            }}
          >
            Salvar reflexão
          </button>
        )}
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: darkMode ? "rgba(255,255,255,0.3)" : "#B0A090",
          }}
        >
          Esta reflexão ficará salva no seu Mapa Pessoal
        </span>
      </div>
    </div>
  );
};

export default MirrorCard;
