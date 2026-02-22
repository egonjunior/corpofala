import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CrisisButton = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed z-[999]" style={{ bottom: 88, right: 24 }}>
      {hovered && (
        <div
          className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-3 py-2 pointer-events-none"
          style={{
            background: "#1A1520",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "#fff",
          }}
        >
          Preciso de ajuda agora
          <div
            className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 rotate-45"
            style={{ background: "#1A1520" }}
          />
        </div>
      )}

      <button
        onClick={() => navigate("/app/dinamicas?modo=crise")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex items-center justify-center rounded-full transition-shadow"
        style={{
          width: 52,
          height: 52,
          animation: "heartbeat 1.2s ease-in-out infinite",
          background: "#1A1520",
          border: "1.5px solid rgba(0,188,212,0.3)",
          boxShadow: "0 4px 20px rgba(0,188,212,0.25)",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 28s-1.5-1-3.5-2.8C8 21.2 4 17 4 12.5 4 8.9 6.9 6 10.5 6c2 0 3.9 1 5.5 2.8C17.6 7 19.5 6 21.5 6 25.1 6 28 8.9 28 12.5c0 1.5-.5 3-1.3 4.3"
            stroke="#00BCD4"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M18 20h2.5l1.5-3 2 6 2-3h2.5"
            stroke="#00BCD4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="animate-ecg"
          />
        </svg>
      </button>

      <style>{`
        @keyframes ecgPulse {
          0%, 100% { stroke-dashoffset: 24; }
          50% { stroke-dashoffset: 0; }
        }
        .animate-ecg {
          stroke-dasharray: 24;
          animation: ecgPulse 3s ease-in-out infinite;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.06); }
          28% { transform: scale(1); }
          42% { transform: scale(1.04); }
          56% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default CrisisButton;
