import { useState } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { RotateCcw } from "lucide-react";

interface RecurrenceCycleVizProps {
  darkMode: boolean;
}

const POINTS = [
  { angle: -90, label: "Sintoma aparece", icon: "⚠", color: "#FF4D4D", detail: "O corpo manifesta um sintoma — dor, ansiedade, insônia, inflamação. É um sinal de que algo emocional não foi processado. Mas raramente é interpretado assim." },
  { angle: 0, label: "Supressão", icon: "💊", color: "#8A7A70", detail: "A resposta automática: tomar um remédio, evitar a situação, se distrair, negar. O sintoma é silenciado temporariamente, mas a causa permanece intocada." },
  { angle: 90, label: "Alívio temporário", icon: "✓", color: "#00BCD4", detail: "O sintoma some por dias ou semanas. Você acredita que está curado. Mas a raiz emocional continua ativa, alimentando o circuito por baixo da superfície." },
  { angle: 180, label: "Retorna mais forte", icon: "⚠⚠", color: "#FF4D4D", detail: "O sintoma volta — muitas vezes mais intenso ou em forma diferente. O corpo aumenta o volume do sinal porque o anterior foi ignorado. O ciclo se repete." },
];

const CX = 200;
const CY = 130;
const R = 80;

const RecurrenceCycleViz = ({ darkMode }: RecurrenceCycleVizProps) => {
  const { ref, hasTriggered, animKey, replay } = useInViewAnimation(0.6);
  const [expanded, setExpanded] = useState<number | null>(null);

  const getPos = (angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
  };

  const circumference = 2 * Math.PI * R;

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
        VISUALIZAÇÃO · CICLO DE RECORRÊNCIA
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
        viewBox="0 0 400 260"
        style={{ width: "100%", height: "auto", cursor: "default" }}
        aria-label="Visualização do ciclo de recorrência dos sintomas"
      >
        <style>{`
          @keyframes drawCircle {
            from { stroke-dashoffset: ${circumference}; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes spinArrow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes fadeCenterText {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .cycle-circle { stroke-dasharray: ${circumference}; stroke-dashoffset: ${circumference}; }
          .cycle-circle.active { animation: drawCircle 4s ease-in-out forwards; }
          .cycle-arrow { opacity: 0; }
          .cycle-arrow.active { opacity: 1; animation: spinArrow 3s linear infinite; animation-delay: 4s; transform-origin: ${CX}px ${CY}px; }
          .center-text { opacity: 0; }
          .center-text.active { animation: fadeCenterText 0.6s ease-out 4.5s forwards; }
          .cycle-point { opacity: 0; transition: opacity 0.3s; }
          .cycle-point.p0.active { animation: fadeCenterText 0.3s ease-out 0s forwards; }
          .cycle-point.p1.active { animation: fadeCenterText 0.3s ease-out 1s forwards; }
          .cycle-point.p2.active { animation: fadeCenterText 0.3s ease-out 2s forwards; }
          .cycle-point.p3.active { animation: fadeCenterText 0.3s ease-out 3s forwards; }
          .cycle-label { opacity: 0; }
          .cycle-label.l0.active { animation: fadeCenterText 0.3s ease-out 0.2s forwards; }
          .cycle-label.l1.active { animation: fadeCenterText 0.3s ease-out 1.2s forwards; }
          .cycle-label.l2.active { animation: fadeCenterText 0.3s ease-out 2.2s forwards; }
          .cycle-label.l3.active { animation: fadeCenterText 0.3s ease-out 3.2s forwards; }
        `}</style>

        {/* Main circle */}
        <circle
          className={`cycle-circle ${hasTriggered ? "active" : ""}`}
          cx={CX}
          cy={CY}
          r={R}
          stroke="rgba(255,77,77,0.3)"
          strokeWidth={2}
          fill="none"
        />

        {/* Rotating arrow */}
        <g className={`cycle-arrow ${hasTriggered ? "active" : ""}`}>
          <circle cx={CX} cy={CY - R} r={5} fill="#C4622D" />
          <polygon points={`${CX - 4},${CY - R - 8} ${CX + 4},${CY - R - 8} ${CX},${CY - R - 14}`} fill="#C4622D" />
        </g>

        {/* Points */}
        {POINTS.map((pt, i) => {
          const pos = getPos(pt.angle);
          const isTop = pt.angle === -90;
          const isRight = pt.angle === 0;
          const isBottom = pt.angle === 90;
          const labelX = isRight ? pos.x + 20 : pt.angle === 180 ? pos.x - 20 : pos.x;
          const labelY = isTop ? pos.y - 16 : isBottom ? pos.y + 20 : pos.y;
          const anchor = isRight ? "start" : pt.angle === 180 ? "end" : "middle";

          return (
            <g key={i} style={{ cursor: "pointer" }} onClick={() => setExpanded(expanded === i ? null : i)}>
              <circle
                className={`cycle-point p${i} ${hasTriggered ? "active" : ""}`}
                cx={pos.x}
                cy={pos.y}
                r={i === 3 ? 10 : 8}
                fill={pt.color}
              />
              <text
                className={`cycle-point p${i} ${hasTriggered ? "active" : ""}`}
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                style={{ fontSize: i === 3 ? 10 : 9, fill: "white" }}
              >
                {pt.icon}
              </text>
              <text
                className={`cycle-label l${i} ${hasTriggered ? "active" : ""}`}
                x={labelX}
                y={labelY}
                textAnchor={anchor}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  fill: i === 3 ? "#FF4D4D" : (darkMode ? "rgba(255,255,255,0.5)" : "#8A7A70"),
                  fontWeight: i === 3 ? 500 : 400,
                }}
              >
                {pt.label}
              </text>
            </g>
          );
        })}

        {/* Center text */}
        <text className={`center-text ${hasTriggered ? "active" : ""}`} x={CX} y={CY - 6} textAnchor="middle" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fill: darkMode ? "rgba(255,255,255,0.5)" : "#6A5A55", fontStyle: "italic" }}>
          O circuito se
        </text>
        <text className={`center-text ${hasTriggered ? "active" : ""}`} x={CX} y={CY + 12} textAnchor="middle" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fill: darkMode ? "rgba(255,255,255,0.5)" : "#6A5A55", fontStyle: "italic" }}>
          auto-reforça
        </text>
      </svg>

      {/* Expanded card */}
      {expanded !== null && (
        <div
          style={{
            background: darkMode ? "rgba(255,255,255,0.05)" : "white",
            padding: 16,
            borderRadius: 8,
            borderLeft: `3px solid ${POINTS[expanded].color}`,
            marginTop: 12,
            transition: "all 0.3s ease",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              lineHeight: 1.7,
              color: darkMode ? "rgba(255,255,255,0.75)" : "#2A2035",
              margin: 0,
            }}
          >
            {POINTS[expanded].detail}
          </p>
        </div>
      )}
    </div>
  );
};

export default RecurrenceCycleViz;
