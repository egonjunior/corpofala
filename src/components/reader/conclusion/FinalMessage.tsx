import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface FinalMessageProps {
  finalMessage: string | null;
  finalMessageSentAt: string | null;
  onSendMessage: (text: string) => void;
  darkMode: boolean;
}

const FinalMessage = ({
  finalMessage,
  finalMessageSentAt,
  onSendMessage,
  darkMode,
}: FinalMessageProps) => {
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [showReply, setShowReply] = useState(!!finalMessageSentAt);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sent = !!finalMessageSentAt;

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const handleSend = () => {
    if (!text.trim() || sent) return;
    onSendMessage(text.trim());
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setShowReply(true);
    }, 2000);
  };

  const bodyIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#00BCD4" opacity="0.8"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#00BCD4" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  );

  return (
    <div
      ref={ref}
      style={{
        background: "#1A1520",
        borderRadius: 12,
        padding: 32,
        marginTop: 48,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.95)",
        transition: "opacity 1s ease 1s, transform 1s ease 1s",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        {bodyIcon}
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.2em", color: "#00BCD4" }}>
          MENSAGEM FINAL · CORPO
        </span>
      </div>
      <div style={{ height: 1, background: "rgba(0,188,212,0.2)", margin: "16px 0" }} />

      {/* Body message */}
      <div
        style={{
          background: "rgba(0,188,212,0.08)",
          borderRadius: "0 12px 12px 12px",
          padding: "16px 20px",
          marginBottom: 8,
        }}
      >
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>
          {`Você leu. Você marcou. Você reconheceu.

Isso já é diferente de tudo que você fez
antes com o que sente.

O mapa está com você.
O circuito pode ser reescrito.

Eu sempre soube.
Esperava que você perguntasse.`}
        </p>
      </div>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
        Agora · Lido
      </span>

      {/* User message (if sent) */}
      {(sent || typing || showReply) && finalMessage && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: "12px 0 12px 12px",
              padding: "12px 16px",
              maxWidth: "80%",
            }}
          >
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "white", margin: 0, lineHeight: 1.6 }}>
              {finalMessage}
            </p>
          </div>
        </div>
      )}

      {/* Typing indicator */}
      {typing && (
        <div style={{ marginTop: 12 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
            <span className="animate-pulse">digitando...</span>
          </span>
        </div>
      )}

      {/* Reply */}
      {showReply && (
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              background: "rgba(0,188,212,0.08)",
              borderRadius: "0 12px 12px 12px",
              padding: "12px 16px",
              display: "inline-block",
            }}
          >
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.85)", margin: 0 }}>
              Eu ouvi. Continue caminhando.
            </p>
          </div>
        </div>
      )}

      {/* Input */}
      {!sent && (
        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder="Escrever resposta..."
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: "12px 16px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "rgba(255,255,255,0.8)",
              resize: "none",
              outline: "none",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            style={{
              background: text.trim() ? "#00BCD4" : "rgba(0,188,212,0.3)",
              border: "none",
              borderRadius: 8,
              padding: "12px 16px",
              cursor: text.trim() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Send size={16} color="#1A1520" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FinalMessage;
