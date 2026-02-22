import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useNarrativeAudio } from "@/contexts/NarrativeAudioContext";

interface Screen0Props {
  onNext: () => void;
}

/* ── Grain SVG overlay ── */
const GrainOverlay = () => (
  <svg className="fixed inset-0 w-full h-full pointer-events-none z-50" style={{ opacity: 0.025 }}>
    <filter id="grain0">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain0)" />
  </svg>
);

/* ── Heart + sine wave SVG icon ── */
const HeartSineIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <path
      d="M26 45 C26 45 6 32 6 18 C6 10 12 5 19 5 C23 5 26 8 26 8 C26 8 29 5 33 5 C40 5 46 10 46 18 C46 32 26 45 26 45Z"
      fill="none"
      stroke="#00BCD4"
      strokeWidth="1.5"
    />
    <path
      d="M4 26 Q10 26 14 20 Q18 14 22 26 Q24 32 26 26 Q28 20 30 26 Q34 38 38 26 Q42 14 48 26"
      fill="none"
      stroke="#00BCD4"
      strokeWidth="1.2"
    />
  </svg>
);

/* ── Wave & Particle Canvas ── */
interface WaveConfig {
  amplitude: number;
  frequency: number;
  speed: number;
  yOffset: number;
}

const Screen0_Pulse = ({ onNext }: Screen0Props) => {
  const audio = useNarrativeAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -200, y: -200 });
  const phaseRef = useRef(0);
  const amplitudeMultRef = useRef(1);
  const canvasOpacityRef = useRef(0);
  const fadeOutRef = useRef(false);
  const fadeOutOpacityRef = useRef(0);

  const [phase, setPhase] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [currentTyping, setCurrentTyping] = useState("");
  const [showIcon, setShowIcon] = useState(false);
  const [showIconLabel, setShowIconLabel] = useState(false);
  const [revealLines, setRevealLines] = useState<{ text: string; style?: React.CSSProperties }[]>([]);
  const [showButton, setShowButton] = useState(false);
  const [buttonText, setButtonText] = useState("INICIAR CONTATO");
  const [showBodyText, setShowBodyText] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  // Particles
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; size: number }[]>([]);
  const wavesRef = useRef<WaveConfig[]>([
    { amplitude: 15, frequency: 0.008, speed: 0.3, yOffset: 0.25 },
    { amplitude: 25, frequency: 0.01, speed: 0.5, yOffset: 0.4 },
    { amplitude: 35, frequency: 0.012, speed: 0.7, yOffset: 0.6 },
    { amplitude: 20, frequency: 0.015, speed: 0.8, yOffset: 0.75 },
  ]);
  const timeRef = useRef(0);

  // Init particles once
  useEffect(() => {
    const p: typeof particlesRef.current = [];
    for (let i = 0; i < 55; i++) {
      p.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: 1.5 + Math.random(),
      });
    }
    particlesRef.current = p;
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handler = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const touch = (e: TouchEvent) => { mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    window.addEventListener("mousemove", handler);
    window.addEventListener("touchmove", touch);
    return () => { window.removeEventListener("mousemove", handler); window.removeEventListener("touchmove", touch); };
  }, []);

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Fade in canvas opacity
      if (canvasOpacityRef.current < 1 && !fadeOutRef.current) {
        canvasOpacityRef.current = Math.min(1, canvasOpacityRef.current + 0.005); // ~3s fade
      }
      if (fadeOutRef.current) {
        canvasOpacityRef.current = Math.max(0, canvasOpacityRef.current - 0.016); // ~1s fade out
      }

      ctx.globalAlpha = canvasOpacityRef.current;
      timeRef.current += 1;

      // Draw waves
      const ampMult = amplitudeMultRef.current;
      wavesRef.current.forEach((wave) => {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 188, 212, 0.10)";
        ctx.lineWidth = 1;
        const baseY = h * wave.yOffset;
        for (let x = 0; x < w; x++) {
          const y = baseY + Math.sin((x * wave.frequency) + (timeRef.current * wave.speed * 0.02)) * wave.amplitude * ampMult;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // Draw particles
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      particlesRef.current.forEach((p) => {
        // Repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80 && dist > 0) {
          p.vx += (dx / dist) * 2 * (1 - dist / 80) * 0.1;
          p.vy += (dy / dist) * 2 * (1 - dist / 80) * 0.1;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));

        // Damping
        p.vx *= 0.998;
        p.vy *= 0.998;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 188, 212, 0.18)";
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Start audio on first user interaction
  const handleFirstInteraction = useCallback(() => {
    if (audioStarted) return;
    setAudioStarted(true);
    audio.ensureContext();
  }, [audioStarted, audio]);

  useEffect(() => {
    const h = () => handleFirstInteraction();
    window.addEventListener("click", h, { once: true });
    window.addEventListener("touchstart", h, { once: true });
    return () => { window.removeEventListener("click", h); window.removeEventListener("touchstart", h); };
  }, [handleFirstInteraction]);

  // Phase sequencer
  useEffect(() => {
    const typewriterLines = [
      { text: "Seu corpo emite frequências.", pause: 1800 },
      { text: "A maioria das pessoas nunca aprende a decodificá-las.", pause: 2200 },
      { text: "Alguém aprendeu.", pause: 3200 },
      { text: "E hoje", pause: 900 },
      { text: "seu corpo pediu que essa pessoa entrasse em contato com você.", pause: 2800 },
    ];

    const revealTexts = [
      { text: "Esta é a frequência do seu corpo neste momento.", pause: 2000, style: {} },
      { text: "Você foi identificado.", pause: 3500, style: { fontSize: "clamp(24px, 4vw, 28px)", color: "#FFFFFF", fontWeight: 400 } },
      { text: "O intermediário está pronto.", pause: 1800, style: { color: "#00BCD4" } },
    ];

    const timers: NodeJS.Timeout[] = [];
    let offset = 400; // short silence before start

    // Phase 1: Start audio + waves
    timers.push(setTimeout(() => {
      setPhase(1);
      phaseRef.current = 1;
      if (audioStarted) audio.startTone528();
    }, offset));

    // Phase 2: Typewriter text (starts at 8s)
    offset = 5000;
    let typeOffset = offset;

    const typeText = (text: string, speed: number, onDone: () => void) => {
      let i = 0;
      const doChar = () => {
        if (i < text.length) {
          setCurrentTyping(text.slice(0, i + 1));
          i++;
          timers.push(setTimeout(doChar, speed));
        } else {
          onDone();
        }
      };
      doChar();
    };

    let lineIdx = 0;
    const typeNextLine = () => {
      if (lineIdx >= typewriterLines.length) {
        // Move to Phase 3
        timers.push(setTimeout(() => {
          setPhase(3);
          phaseRef.current = 3;
          // Reduce wave amplitude
          const startAmp = amplitudeMultRef.current;
          const ampInterval = setInterval(() => {
            amplitudeMultRef.current = Math.max(0.3, amplitudeMultRef.current - 0.01);
            if (amplitudeMultRef.current <= 0.3) clearInterval(ampInterval);
          }, 30);

          // Start heartbeat
          audio.startHeartbeat();
          audio.setHeartbeatVolume(0.12, 2);

          // Show icon
          timers.push(setTimeout(() => setShowIcon(true), 500));
          timers.push(setTimeout(() => setShowIconLabel(true), 1500));

          // Phase 4: Revelation
          timers.push(setTimeout(() => {
            setPhase(4);
            phaseRef.current = 4;
            let rIdx = 0;
            const typeNextReveal = () => {
              if (rIdx >= revealTexts.length) {
                // Phase 5: Button
                timers.push(setTimeout(() => {
                  setPhase(5);
                  phaseRef.current = 5;
                  setShowButton(true);

                  // Waiting messages
                  timers.push(setTimeout(() => {
                    setButtonText("O intermediário está esperando.");
                  }, 4000));
                  timers.push(setTimeout(() => {
                    setShowBodyText(true);
                  }, 8000));
                }, 1800));
                return;
              }
              const r = revealTexts[rIdx];
              setCurrentTyping("");
              typeText(r.text, 65, () => {
                setRevealLines(prev => [...prev, { text: r.text, style: r.style }]);
                setCurrentTyping("");
                if (rIdx === 1) {
                  // "Você foi identificado" — increase heartbeat
                  audio.setHeartbeatVolume(0.18, 1);
                }
                rIdx++;
                timers.push(setTimeout(typeNextReveal, r.pause));
              });
            };
            typeNextReveal();
          }, 2000));
        }, 500));
        return;
      }

      const line = typewriterLines[lineIdx];
      setCurrentTyping("");
      typeText(line.text, 45, () => {
        setLines(prev => [...prev, line.text]);
        setCurrentTyping("");
        if (lineIdx === 2) {
          // "Alguém aprendeu" — increase wave amplitude 30%
          const ampInterval = setInterval(() => {
            amplitudeMultRef.current = Math.min(1.3, amplitudeMultRef.current + 0.005);
            if (amplitudeMultRef.current >= 1.3) clearInterval(ampInterval);
          }, 20);
        }
        lineIdx++;
        timers.push(setTimeout(typeNextLine, line.pause));
      });
    };

    timers.push(setTimeout(() => {
      setPhase(2);
      phaseRef.current = 2;
      typeNextLine();
    }, typeOffset));

    return () => timers.forEach(clearTimeout);
  }, [audioStarted, audio]);

  // Click handler
  const handleClick = useCallback(() => {
    if (fadingOut) return;
    setFadingOut(true);
    fadeOutRef.current = true;
    audio.stopAll();
    setTimeout(() => onNext(), 800);
  }, [audio, onNext, fadingOut]);

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center overflow-hidden relative"
      style={{ background: "#080808" }}
      onClick={handleFirstInteraction}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <GrainOverlay />

      {/* Fade out overlay */}
      {fadingOut && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      )}

      {/* Text area */}
      <div className="relative z-10 max-w-[480px] px-8 text-center flex flex-col items-center">
        {/* Icon (Phase 3+) */}
        {showIcon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="mb-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                boxShadow: [
                  "0 0 0 0 rgba(0,188,212,0.3)",
                  "0 0 0 16px rgba(0,188,212,0)",
                  "0 0 0 0 rgba(0,188,212,0.3)",
                ],
              }}
              transition={{ duration: 1.03, repeat: Infinity }}
              className="rounded-full p-2"
            >
              <HeartSineIcon />
            </motion.div>
            {showIconLabel && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                style={{ fontSize: 14, color: "#888", fontFamily: "'Inter', sans-serif", marginTop: 8 }}
              >
                frequência identificada
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Completed lines */}
        {lines.map((line, i) => (
          <p
            key={i}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              color: "#E8E8E8",
              fontSize: "clamp(18px, 3vw, 22px)",
              lineHeight: 1.8,
              marginBottom: 4,
            }}
          >
            {line}
          </p>
        ))}

        {/* Reveal lines (Phase 4) */}
        {revealLines.map((rl, i) => (
          <p
            key={`r${i}`}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              color: "#E8E8E8",
              fontSize: "clamp(18px, 3vw, 22px)",
              lineHeight: 1.8,
              marginBottom: 4,
              ...rl.style,
            }}
          >
            {rl.text}
          </p>
        ))}

        {/* Currently typing */}
        {currentTyping && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              color: "#E8E8E8",
              fontSize: "clamp(18px, 3vw, 22px)",
              lineHeight: 1.8,
            }}
          >
            {currentTyping}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ color: "#00BCD4", marginLeft: 2 }}
            >
              |
            </motion.span>
          </p>
        )}

        {/* Button (Phase 5) */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="mt-16 flex flex-col items-center"
          >
            <button
              onClick={handleClick}
              className="bg-transparent border-none cursor-pointer group relative"
              style={{
                fontSize: 13,
                letterSpacing: "0.35em",
                color: "#00BCD4",
                fontFamily: "'Inter', sans-serif",
                padding: "8px 0",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#00BCD4"; }}
            >
              {buttonText}
              <motion.div
                animate={{ width: ["60%", "100%", "60%"] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  height: 1,
                  background: "#00BCD4",
                  margin: "6px auto 0",
                }}
              />
            </button>

            {showBodyText && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{ fontSize: 14, color: "#666", marginTop: 16, fontFamily: "'Inter', sans-serif" }}
              >
                Seu corpo também.
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Screen0_Pulse;
