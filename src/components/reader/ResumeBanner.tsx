import { useState } from "react";
import { X } from "lucide-react";

interface ResumeBannerProps {
  chapterTitle: string;
  progress: number;
  onResume: () => void;
  darkMode: boolean;
}

const ResumeBanner = ({ chapterTitle, progress, onResume, darkMode }: ResumeBannerProps) => {
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem("resumeBannerDismissed") === "true"; } catch { return false; }
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("resumeBannerDismissed", "true");
  };

  return (
    <div
      className="flex items-center justify-between"
      style={{
        background: darkMode ? "rgba(196,98,45,0.12)" : "rgba(196,98,45,0.08)",
        borderLeft: "3px solid #C4622D",
        borderRadius: "0 8px 8px 0",
        padding: "12px 16px",
        maxWidth: 640,
        margin: "0 auto 24px",
      }}
    >
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          color: darkMode ? "rgba(255,255,255,0.6)" : "#6A5A55",
        }}
      >
        Você parou em {chapterTitle}, {progress}% lido.
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={onResume}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            color: "#C4622D",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Continuar de onde parou →
        </button>
        <button onClick={handleDismiss} className="opacity-50 hover:opacity-100 transition-opacity">
          <X size={14} color={darkMode ? "rgba(255,255,255,0.5)" : "#6A5A55"} />
        </button>
      </div>
    </div>
  );
};

export default ResumeBanner;
