import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { RotateCcw } from "lucide-react";

interface SignalPathVizProps {
  darkMode: boolean;
}

const SignalPathViz = ({ darkMode }: SignalPathVizProps) => {
  const { ref, hasTriggered, animKey, replay } = useInViewAnimation(0.6);

  const strokeColor = darkMode ? "rgba(255,255,255,0.15)" : "rgba(26,21,32,0.15)";
  const labelColor = darkMode ? "rgba(255,255,255,0.6)" : "#6A5A55";

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        maxWidth: 480,
        margin: "40px auto",
        background: "rgba(0,188,212,0.02)",
        border: "1px solid rgba(0,188,212,0.1)",
        borderRadius: 12,
        padding: 24,
        position: "relative",
      }}
    >
      {/* Label */}
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          color: "#00BCD4",
          letterSpacing: "0.2em",
          marginBottom: 16,
          textTransform: "uppercase",
        }}
      >
        VISUALIZAÇÃO · CAMINHO DO SINAL
      </div>

      {/* Replay button */}
      <button
        onClick={replay}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(0,188,212,0.5)",
          padding: 4,
        }}
        aria-label="Replay"
      >
        <RotateCcw size={18} />
      </button>

      {/* SVG */}
      <svg
        key={animKey}
        viewBox="0 0 400 280"
        style={{ width: "100%", height: "auto" }}
        aria-label="Visualização do caminho do sinal emocional"
      >
        <style>{`
          @keyframes drawPath {
            from { stroke-dashoffset: 300; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes pulseRing {
            from { r: 6; opacity: 0.8; }
            to { r: 20; opacity: 0; }
          }
          .sig-path { stroke-dasharray: 300; stroke-dashoffset: 300; }
          .sig-path.active { animation: drawPath 3s ease-in-out forwards; }
          .point-a { opacity: 0; }
          .point-a.active { animation: fadeIn 0.4s ease-out forwards; animation-delay: 0s; }
          .point-b { opacity: 0; }
          .point-b.active { animation: fadeIn 0.4s ease-out forwards; animation-delay: 1.5s; }
          .point-c { opacity: 0; }
          .point-c.active { animation: fadeIn 0.4s ease-out forwards; animation-delay: 3s; }
          .ring-a { opacity: 0; }
          .ring-a.active { animation: pulseRing 0.8s ease-out forwards; animation-delay: 0.1s; }
          .ring-b { opacity: 0; }
          .ring-b.active { animation: pulseRing 0.8s ease-out forwards; animation-delay: 1.6s; }
          .ring-c { opacity: 0; }
          .ring-c.active { animation: pulseRing 0.8s ease-out forwards; animation-delay: 3.1s; }
          .label-a { opacity: 0; }
          .label-a.active { animation: fadeIn 0.4s ease-out forwards; animation-delay: 0.2s; }
          .label-b { opacity: 0; }
          .label-b.active { animation: fadeIn 0.4s ease-out forwards; animation-delay: 1.7s; }
          .label-c { opacity: 0; }
          .label-c.active { animation: fadeIn 0.4s ease-out forwards; animation-delay: 3.2s; }
        `}</style>

        {/* Body silhouette */}
        <path
          d="M200,30 C210,30 220,40 220,55 C220,70 210,80 200,80 C190,80 180,70 180,55 C180,40 190,30 200,30 Z M200,80 L200,180 M200,100 L160,140 M200,100 L240,140 M200,180 L170,240 M200,180 L230,240"
          stroke={strokeColor}
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
        />

        {/* Signal path */}
        <path
          className={`sig-path ${hasTriggered ? "active" : ""}`}
          d="M200,55 Q210,80 205,120 Q200,150 200,180"
          stroke="#C4622D"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />

        {/* Point A — Brain */}
        <circle className={`ring-a ${hasTriggered ? "active" : ""}`} cx={200} cy={55} r={6} fill="none" stroke="#00BCD4" strokeWidth={1.5} />
        <circle className={`point-a ${hasTriggered ? "active" : ""}`} cx={200} cy={55} r={6} fill="#00BCD4" />
        <text className={`label-a ${hasTriggered ? "active" : ""}`} x={240} y={58} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fill: labelColor }}>Emoção detectada</text>

        {/* Point B — Heart */}
        <circle className={`ring-b ${hasTriggered ? "active" : ""}`} cx={205} cy={120} r={6} fill="none" stroke="#C4622D" strokeWidth={1.5} />
        <circle className={`point-b ${hasTriggered ? "active" : ""}`} cx={205} cy={120} r={6} fill="#C4622D" />
        <text className={`label-b ${hasTriggered ? "active" : ""}`} x={240} y={123} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fill: labelColor }}>Sistema nervoso ativa</text>

        {/* Point C — Stomach */}
        <circle className={`ring-c ${hasTriggered ? "active" : ""}`} cx={200} cy={180} r={6} fill="none" stroke="#FF4D4D" strokeWidth={1.5} />
        <circle className={`point-c ${hasTriggered ? "active" : ""}`} cx={200} cy={180} r={6} fill="#FF4D4D" />
        <text className={`label-c ${hasTriggered ? "active" : ""}`} x={240} y={183} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fill: labelColor }}>Sintoma físico</text>
      </svg>
    </div>
  );
};

export default SignalPathViz;
