import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { RotateCcw } from "lucide-react";

interface CircuitFormationVizProps {
  darkMode: boolean;
}

const CircuitFormationViz = ({ darkMode }: CircuitFormationVizProps) => {
  const { ref, hasTriggered, animKey, replay } = useInViewAnimation(0.6);
  const labelColor = darkMode ? "rgba(255,255,255,0.5)" : "#B0A090";

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
        VISUALIZAÇÃO · FORMAÇÃO DO CIRCUITO
      </div>

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

      <svg
        key={animKey}
        viewBox="0 0 400 240"
        style={{ width: "100%", height: "auto" }}
        aria-label="Visualização da formação do circuito neural"
      >
        <style>{`
          @keyframes nodeGlow {
            from { opacity: 0.1; }
            to { opacity: 1; }
          }
          @keyframes state1 {
            0% { stroke-width: 1; stroke-dasharray: 5,5; opacity: 0.2; }
            100% { stroke-width: 1; stroke-dasharray: 5,5; opacity: 0.3; }
          }
          @keyframes evolveConnection {
            0% { stroke-width: 1; stroke-dasharray: 5,5; opacity: 0.2; stroke: #C4622D; }
            25% { stroke-width: 2; stroke-dasharray: none; opacity: 0.5; stroke: #C4622D; }
            50% { stroke-width: 3; stroke-dasharray: none; opacity: 0.8; stroke: #C4622D; }
            75%, 100% { stroke-width: 4; stroke-dasharray: none; opacity: 1; stroke: #C4622D; }
          }
          @keyframes labelFade1 {
            0%, 24% { opacity: 1; }
            25%, 100% { opacity: 0; }
          }
          @keyframes labelFade2 {
            0%, 24% { opacity: 0; }
            25%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }
          @keyframes labelFade3 {
            0%, 49% { opacity: 0; }
            50%, 74% { opacity: 1; }
            75%, 100% { opacity: 0; }
          }
          @keyframes labelFade4 {
            0%, 74% { opacity: 0; }
            75%, 100% { opacity: 1; }
          }
          @keyframes particleFlow {
            0% { cx: 100; }
            100% { cx: 300; }
          }
          @keyframes arcFade {
            from { opacity: 0; }
            to { opacity: 0.6; }
          }
          .circuit-line { opacity: 0; }
          .circuit-line.active { animation: evolveConnection 8s ease-in-out forwards; }
          .lbl1 { opacity: 0; }
          .lbl1.active { animation: labelFade1 8s ease-in-out forwards; }
          .lbl2 { opacity: 0; }
          .lbl2.active { animation: labelFade2 8s ease-in-out forwards; }
          .lbl3 { opacity: 0; }
          .lbl3.active { animation: labelFade3 8s ease-in-out forwards; }
          .lbl4 { opacity: 0; }
          .lbl4.active { animation: labelFade4 8s ease-in-out forwards; }
          .particle { opacity: 0; }
          .particle.active { opacity: 1; animation: particleFlow 1.2s linear infinite; }
          .p2.active { animation-delay: 0.4s; }
          .p3.active { animation-delay: 0.8s; }
          .arc-emphasis { opacity: 0; }
          .arc-emphasis.active { animation: arcFade 0.6s ease-out 8.5s forwards; }
        `}</style>

        {/* Node Left */}
        <circle cx={100} cy={120} r={20} stroke="rgba(26,21,32,0.2)" strokeWidth={1.5} fill="rgba(0,188,212,0.1)" />
        {/* Node Right */}
        <circle cx={300} cy={120} r={20} stroke="rgba(26,21,32,0.2)" strokeWidth={1.5} fill="rgba(0,188,212,0.1)" />

        {/* Connection line */}
        <line className={`circuit-line ${hasTriggered ? "active" : ""}`} x1={120} y1={120} x2={280} y2={120} stroke="#C4622D" />

        {/* State labels */}
        <text className={`lbl1 ${hasTriggered ? "active" : ""}`} x={200} y={155} textAnchor="middle" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fill: labelColor }}>
          Primeira repetição · conexão fraca
        </text>
        <text className={`lbl2 ${hasTriggered ? "active" : ""}`} x={200} y={155} textAnchor="middle" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fill: labelColor }}>
          Repetição · conexão reforçada
        </text>
        <text className={`lbl3 ${hasTriggered ? "active" : ""}`} x={200} y={155} textAnchor="middle" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fill: labelColor }}>
          Múltiplas repetições · conexão forte
        </text>
        <text className={`lbl4 ${hasTriggered ? "active" : ""}`} x={200} y={155} textAnchor="middle" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fill: labelColor }}>
          Circuito instalado · automático
        </text>

        {/* Particles (flow after state 4) */}
        <circle className={`particle p1 ${hasTriggered ? "active" : ""}`} cx={100} cy={120} r={4} fill="#00BCD4" style={{ animationDelay: hasTriggered ? "8s" : undefined }} />
        <circle className={`particle p2 ${hasTriggered ? "active" : ""}`} cx={100} cy={120} r={4} fill="#00BCD4" style={{ animationDelay: hasTriggered ? "8.4s" : undefined }} />
        <circle className={`particle p3 ${hasTriggered ? "active" : ""}`} cx={100} cy={120} r={4} fill="#00BCD4" style={{ animationDelay: hasTriggered ? "8.8s" : undefined }} />

        {/* Emphasis arc */}
        <path className={`arc-emphasis ${hasTriggered ? "active" : ""}`} d="M130,90 Q200,60 270,90" stroke="#C4622D" strokeWidth={1.5} fill="none" />
        <text className={`arc-emphasis ${hasTriggered ? "active" : ""}`} x={200} y={78} textAnchor="middle" style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fill: "#C4622D" }}>
          Este caminho agora é automático
        </text>
      </svg>
    </div>
  );
};

export default CircuitFormationViz;
