import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNarrativeAudio } from "@/contexts/NarrativeAudioContext";

interface Screen1Props {
  onNext: () => void;
}

/* ── Grain SVG overlay ── */
const GrainOverlay = () => (
  <svg className="fixed inset-0 w-full h-full pointer-events-none z-50" style={{ opacity: 0.025 }}>
    <filter id="grain1">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain1)" />
  </svg>
);

/* ── Vignette overlay ── */
const Vignette = () => (
  <div
    className="fixed inset-0 pointer-events-none z-30"
    style={{
      background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.5) 100%)",
    }}
  />
);

/* ── Floating particles ── */
const FloatingParticles = ({ count = 18 }: { count?: number }) => {
  const particles = useRef(
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 1.5,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 5,
      opacity: 0.05 + Math.random() * 0.12,
    }))
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: "rgba(0,188,212,0.8)",
          }}
          animate={{
            y: [0, -60 - Math.random() * 80, -120 - Math.random() * 60],
            x: [0, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 60],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

/* ── DotGrid ── */
const DotGrid = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      opacity: 0.05,
      backgroundImage: "radial-gradient(rgba(0,188,212,0.5) 1px, transparent 1px)",
      backgroundSize: "28px 28px",
    }}
  />
);

/* ── Counter ── */
const Counter = ({ target, duration }: { target: number; duration: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration * 60);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(id);
  }, [target, duration]);
  return <span>{count}</span>;
};

/* ── Glitch text effect ── */
const GlitchText = ({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) => {
  const [display, setDisplay] = useState("");
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";

  useEffect(() => {
    let revealedCount = 0;
    const totalDuration = 600;
    const intervalMs = 30;
    const stepsTotal = totalDuration / intervalMs;
    const revealPerStep = text.length / stepsTotal;

    const id = setInterval(() => {
      revealedCount += revealPerStep;
      const revealed = Math.min(Math.floor(revealedCount), text.length);
      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (i < revealed) {
          result += text[i];
        } else if (text[i] === " " || text[i] === "—") {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplay(result);
      if (revealed >= text.length) {
        setDisplay(text);
        clearInterval(id);
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [text]);

  return <span className={className} style={style}>{display}</span>;
};

/* ── Frequency wave canvas with glow ── */
const FrequencyWave = ({ width = 400, height = 60 }: { width?: number; height?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef({
    amp1: 10 + Math.random() * 10,
    freq1: 0.015 + Math.random() * 0.01,
    phase1: Math.random() * Math.PI * 2,
    amp2: 4 + Math.random() * 6,
    freq2: 0.03 + Math.random() * 0.02,
    phase2: Math.random() * Math.PI * 2,
    amp3: 2 + Math.random() * 4,
    freq3: 0.06 + Math.random() * 0.03,
    phase3: Math.random() * Math.PI * 2,
  });
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let animId: number;
    const draw = (time: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const p = paramsRef.current;
      ctx.clearRect(0, 0, w, h);

      const calcY = (x: number, extraOffset = 0) => {
        const xo = x + offsetRef.current + extraOffset;
        return h / 2
          + Math.sin(xo * p.freq1 + p.phase1) * p.amp1
          + Math.sin(xo * p.freq2 + p.phase2) * p.amp2
          + Math.sin(xo * p.freq3 + p.phase3) * p.amp3;
      };

      // Echo wave
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0,188,212,0.12)";
      ctx.lineWidth = 1.5;
      for (let x = 0; x < w; x++) {
        const y = calcY(x, -20);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Main wave with glow
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(0,188,212,0.5)";
      const brightPulse = 0.5 + 0.15 * Math.sin(time * 0.001);
      ctx.globalAlpha = brightPulse + 0.3;
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0,188,212,0.7)";
      ctx.lineWidth = 1.5;
      for (let x = 0; x < w; x++) {
        const y = calcY(x);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      offsetRef.current += 0.3;
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: "80%", height, margin: "0 auto", display: "block" }}
    />
  );
};

/* ── Body silhouette SVG (scalable) ── */
const BodySVG = ({ height: h = "65vh", points, activePoint, showAllGlow }: {
  height?: string;
  points?: { id: number; top: string; left: string; color: string; active: boolean; fixed: boolean }[];
  activePoint?: number;
  showAllGlow?: boolean;
}) => (
  <div className="relative" style={{ height: h, aspectRatio: "120/280" }}>
    {/* Glow layer */}
    <svg viewBox="0 0 120 280" className="absolute inset-0 w-full h-full" fill="none" stroke="rgba(0,188,212,0.08)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "blur(4px)" }}>
      <ellipse cx="60" cy="28" rx="16" ry="20" />
      <line x1="54" y1="48" x2="54" y2="60" />
      <line x1="66" y1="48" x2="66" y2="60" />
      <path d="M54 60 Q40 62 28 78" />
      <path d="M66 60 Q80 62 92 78" />
      <path d="M28 78 L32 160" />
      <path d="M92 78 L88 160" />
      <path d="M32 160 Q60 168 88 160" />
      <path d="M28 78 Q22 100 18 130 Q16 142 20 150" />
      <path d="M92 78 Q98 100 102 130 Q104 142 100 150" />
      <path d="M42 160 L38 220 L34 270" />
      <path d="M78 160 L82 220 L86 270" />
      <path d="M52 160 L50 220 L48 270" />
      <path d="M68 160 L70 220 L72 270" />
    </svg>
    {/* Main layer */}
    <svg viewBox="0 0 120 280" className="absolute inset-0 w-full h-full" fill="none" stroke="rgba(0,188,212,0.18)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="60" cy="28" rx="16" ry="20" />
      <line x1="54" y1="48" x2="54" y2="60" />
      <line x1="66" y1="48" x2="66" y2="60" />
      <path d="M54 60 Q40 62 28 78" />
      <path d="M66 60 Q80 62 92 78" />
      <path d="M28 78 L32 160" />
      <path d="M92 78 L88 160" />
      <path d="M32 160 Q60 168 88 160" />
      <path d="M28 78 Q22 100 18 130 Q16 142 20 150" />
      <path d="M92 78 Q98 100 102 130 Q104 142 100 150" />
      <path d="M42 160 L38 220 L34 270" />
      <path d="M78 160 L82 220 L86 270" />
      <path d="M52 160 L50 220 L48 270" />
      <path d="M68 160 L70 220 L72 270" />
    </svg>
    {/* Points */}
    {points?.map((p) => (
      <AnimatePresence key={p.id}>
        {(p.active || p.fixed) && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute"
            style={{ top: p.top, left: p.left, transform: "translate(-50%, -50%)", zIndex: 10 }}
          >
            {p.active && (
              <>
                {[0, 0.15, 0.3].map((delay, ri) => (
                  <motion.div
                    key={ri}
                    initial={{ width: 0, height: 0, opacity: 0.7 }}
                    animate={{ width: 40 + ri * 10, height: 40 + ri * 10, opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay }}
                    className="absolute rounded-full"
                    style={{ border: `1px solid ${p.color}`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                  />
                ))}
              </>
            )}
            <motion.div
              animate={p.active ? { boxShadow: [`0 0 12px ${p.color}`, `0 0 24px ${p.color}`, `0 0 12px ${p.color}`] } : {}}
              transition={p.active ? { duration: 1.5, repeat: Infinity } : {}}
              style={{
                width: p.active ? 10 : 6,
                height: p.active ? 10 : 6,
                borderRadius: "50%",
                background: p.color,
                boxShadow: `0 0 8px ${p.color}`,
                position: "relative",
                opacity: p.fixed && !p.active ? 0.5 : 1,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    ))}
  </div>
);

/* ── Body signal points data ── */
const bodySignals = [
  { id: 1, name: "ANSIEDADE SEM CAUSA", status: "SUPRIMIDO", label: '"Só estresse"', top: "12%", left: "50%", color: "rgba(255,80,80,0.8)" },
  { id: 2, name: "PÂNICO SEM GATILHO", status: "SUPRIMIDO", label: "Ansiolítico", top: "35%", left: "50%", color: "rgba(255,80,80,0.8)" },
  { id: 3, name: "CANSAÇO CONSTANTE", status: "SUPRIMIDO", label: "Café", top: "30%", left: "28%", color: "rgba(255,80,80,0.8)" },
  { id: 4, name: "DOR NAS COSTAS", status: "SUPRIMIDO", label: "Dorflex", top: "55%", left: "50%", color: "rgba(255,80,80,0.8)" },
  { id: 5, name: "INSÔNIA CRÔNICA", status: "SUPRIMIDO", label: "Sonífero", top: "48%", left: "50%", color: "rgba(255,80,80,0.8)" },
  { id: 6, name: "SINTOMA SEM DIAGNÓSTICO", status: "ORIGEM IDENTIFICADA", label: "", top: "38%", left: "50%", color: "rgba(255,180,0,0.9)" },
];

const constellationPairs = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]];

const Screen1_Archive = ({ onNext }: Screen1Props) => {
  const audio = useNarrativeAudio();
  const [phase, setPhase] = useState(0);
  const [typewriterLines, setTypewriterLines] = useState<string[]>([]);
  const [currentTyping, setCurrentTyping] = useState("");
  const [showDot, setShowDot] = useState(false);
  const [showBlinkText, setShowBlinkText] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [dotGreen, setDotGreen] = useState(false);
  const [confirmLines, setConfirmLines] = useState<string[]>([]);
  const [showMiniLoader, setShowMiniLoader] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [screenShake, setScreenShake] = useState(false);

  // Phase 4: full-screen step sequencer
  const [reportStep, setReportStep] = useState(-1);
  // Step-specific states
  const [scanLineY, setScanLineY] = useState(0);
  const [signalRevealIndex, setSignalRevealIndex] = useState(0); // for steps 2-6
  const [constellationDrawn, setConstellationDrawn] = useState(false);
  const [timelineMilestone, setTimelineMilestone] = useState(0);
  const [originPhraseIndex, setOriginPhraseIndex] = useState(0);
  const [statIndex, setStatIndex] = useState(0);
  const [contextIndex, setContextIndex] = useState(0);
  const [narrativeLine, setNarrativeLine] = useState(-1);
  const [point6Blackout, setPoint6Blackout] = useState(false);
  const [amberPulse, setAmberPulse] = useState(false);

  const patternRef = useRef(
    Array.from({ length: 4 }, () => "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 36)]).join("")
  );
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const hasStartedRef = useRef(false);
  const mono = "'Space Mono', 'Courier New', monospace";

  const typeText = useCallback((text: string, speed: number): Promise<void> => {
    return new Promise((resolve) => {
      let i = 0;
      const doChar = () => {
        if (i < text.length) {
          setCurrentTyping(text.slice(0, i + 1));
          i++;
          const t = setTimeout(doChar, speed);
          timersRef.current.push(t);
        } else {
          resolve();
        }
      };
      doChar();
    });
  }, []);

  const addLine = useCallback((text: string) => {
    setTypewriterLines(prev => [...prev, text]);
    setCurrentTyping("");
  }, []);

  const wait = useCallback((ms: number): Promise<void> => {
    return new Promise((resolve) => {
      const t = setTimeout(resolve, ms);
      timersRef.current.push(t);
    });
  }, []);

  const playTone6 = useCallback(() => {
    const ctx = audio.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // 180Hz bass
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 180;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.05, now + 0.02);
    g.gain.setValueAtTime(0.05, now + 0.15);
    g.gain.linearRampToValueAtTime(0, now + 0.5);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
    // 440Hz alert
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.value = 440;
    g2.gain.setValueAtTime(0.06, now);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc2.connect(g2);
    g2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.1);
  }, [audio]);

  const triggerScreenShake = useCallback(() => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 150);
  }, []);

  // Main sequencer
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    const run = async () => {
      audio.stopAll();
      audio.setHeartbeatVolume(0.22, 2);
      await wait(600);
      setPhase(1);

      // Phase 1: Request
      await typeText("Para acessar o histórico do seu corpo,", 50);
      addLine("Para acessar o histórico do seu corpo,");
      await wait(600);
      await typeText("preciso de um ponto de entrada.", 50);
      addLine("preciso de um ponto de entrada.");
      await wait(1800);
      await typeText("A retina é o único órgão onde os vasos sanguíneos ficam expostos.", 50);
      addLine("A retina é o único órgão onde os vasos sanguíneos ficam expostos.");
      await wait(1200);
      await typeText("O padrão vascular é único — como uma impressão digital do corpo.", 50);
      addLine("O padrão vascular é único — como uma impressão digital do corpo.");
      await wait(2000);
      await typeText("Mantenha o olhar fixo no ponto abaixo.", 50);
      addLine("Mantenha o olhar fixo no ponto abaixo.");
      await wait(1200);
      setShowDot(true);
      await wait(800);
      setShowBlinkText(true);
      await wait(1500);

      // Phase 2: Scan
      setPhase(2);
      setScanning(true);
      setShowBlinkText(false);
      audio.startScanTone();
      const scanStart = Date.now();
      const scanInterval = setInterval(() => {
        const elapsed = Date.now() - scanStart;
        const p = Math.min(100, (elapsed / 4000) * 100);
        setScanProgress(p);
        if (p >= 100) clearInterval(scanInterval);
      }, 16);
      await wait(4000);
      clearInterval(scanInterval);
      setScanProgress(100);

      // Phase 3: Confirmation
      setPhase(3);
      setScanning(false);
      audio.stopScanTone();
      audio.silenceAll();
      await wait(600);
      setDotGreen(true);
      audio.resumeHeartbeat();
      audio.setHeartbeatVolume(0.22, 0.5);
      await wait(300);
      setConfirmLines(["PADRÃO IDENTIFICADO."]);
      await wait(600);
      setConfirmLines(prev => [...prev, "INICIANDO LEITURA DO HISTÓRICO CORPÓREO."]);
      await wait(900);
      setConfirmLines(prev => [...prev, "CARREGANDO SINAIS NÃO PROCESSADOS..."]);
      await wait(500);
      setShowMiniLoader(true);
      await wait(2000);

      // ═══════════════════════════════════════
      // Phase 4: CINEMATIC FULL-SCREEN STEPS
      // ═══════════════════════════════════════
      setPhase(4);
      setShowMiniLoader(false);

      // Step 0: Title full-screen (4.5s)
      setReportStep(0);
      await wait(4500);

      // Step 1: Body scan full-screen (5s)
      setReportStep(1);
      // Animate scan line
      const scanSteps = 60;
      for (let i = 0; i <= scanSteps; i++) {
        setScanLineY((i / scanSteps) * 100);
        await wait(2000 / scanSteps);
      }
      await wait(2500);

      // Steps 2-6: Individual signals
      for (let i = 0; i < 5; i++) {
        setReportStep(2 + i);
        setSignalRevealIndex(i + 1);
        audio.playClickSound();
        await wait(2200);
      }

      // Step 7: 6th signal DRAMATIC
      setReportStep(7);
      setPoint6Blackout(true);
      audio.silenceAll();
      await wait(800);
      setAmberPulse(true);
      playTone6();
      triggerScreenShake();
      setSignalRevealIndex(6);
      await wait(4000);
      setPoint6Blackout(false);

      // Step 8: Constellation complete
      setReportStep(8);
      audio.resumeHeartbeat();
      audio.setHeartbeatVolume(0.22, 0.5);
      setConstellationDrawn(true);
      await wait(3500);

      // Step 9: Timeline vertical
      setReportStep(9);
      for (let m = 1; m <= 3; m++) {
        await wait(1000);
        setTimelineMilestone(m);
        if (m === 3) triggerScreenShake();
      }
      await wait(1500);
      setOriginPhraseIndex(1);
      await wait(2000);
      setOriginPhraseIndex(2);
      await wait(2000);
      setOriginPhraseIndex(3);
      await wait(2000);

      // Step 10: Stats
      setReportStep(10);
      await wait(600);
      setStatIndex(1);
      await wait(600);
      setStatIndex(2);
      await wait(600);
      setStatIndex(3);
      await wait(1200);
      setContextIndex(1);
      await wait(800);
      setContextIndex(2);
      await wait(800);
      setContextIndex(3);
      await wait(2000);

      // Steps 11+: Cinematic narrative
      setReportStep(11);
      audio.setHeartbeatVolume(0.08, 1.5);

      const narrativeLines = [
        { delay: 3000 },
        { delay: 2800 },
        { delay: 3500 },
        { delay: 3500 },
        { delay: 3500 },
        { delay: 2500 },
        { delay: 2500 },
        { delay: 4000 },
      ];

      for (let i = 0; i < narrativeLines.length; i++) {
        setNarrativeLine(i);
        await wait(narrativeLines[i].delay);
      }

      // Silence, heartbeat returns
      setNarrativeLine(-1);
      await wait(2000);
      audio.setHeartbeatVolume(0.35, 1);
      await wait(1000);
      setShowButton(true);
    };

    run();
    return () => timersRef.current.forEach(clearTimeout);
  }, [audio, typeText, addLine, wait, playTone6, triggerScreenShake]);

  const handleClick = useCallback(() => {
    if (fadingOut) return;
    setFadingOut(true);
    audio.setHeartbeatVolume(0.35, 0.2);
    setTimeout(() => {
      audio.stopHeartbeat(0.5);
      setTimeout(() => onNext(), 600);
    }, 500);
  }, [audio, onNext, fadingOut]);

  // Narrative text data
  const narrativeTexts = [
    { text: "A varredura identificou o padrão.", size: 16, opacity: 0.5, special: undefined },
    { text: "Mapeou os sinais.", size: 16, opacity: 0.55, special: undefined },
    { text: "E abriu algo que nunca havia\nsido aberto antes.", size: 18, opacity: 0.65, special: undefined },
    { text: "Um canal direto entre a frequência\ndo seu corpo e uma voz\nque ela nunca teve.", size: 18, opacity: 0.7, special: undefined },
    { text: "Pela primeira vez,\no seu corpo vai falar.", size: 24, opacity: 1, special: "weight" as const },
    { text: "Não através de sintomas.", size: 18, opacity: 0.6, special: undefined },
    { text: "Não através de dores.", size: 18, opacity: 0.65, special: undefined },
    { text: "Através de palavras.", size: 24, opacity: 1, special: "cyan" as const },
  ];

  // Build points for mini-body in signal steps
  const getSignalPoints = (upTo: number, activeId: number) =>
    bodySignals.map((s) => ({
      id: s.id,
      top: s.top,
      left: s.left,
      color: s.color,
      active: s.id === activeId,
      fixed: s.id < activeId && s.id <= upTo,
    }));

  return (
    <motion.div
      className="w-full h-screen flex flex-col items-center overflow-hidden relative"
      animate={screenShake ? { x: [0, -2, 2, -1, 1, 0] } : { x: 0 }}
      transition={screenShake ? { duration: 0.15 } : {}}
      style={{ background: "#080C12" }}
    >
      {/* Breathing background */}
      {phase >= 4 && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-0"
          animate={{ background: ["#080C12", "#0a0e16", "#080C12"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {phase >= 3 && <DotGrid />}
      {phase >= 3 && <GrainOverlay />}
      {phase >= 4 && <Vignette />}
      {phase >= 4 && <FloatingParticles count={18} />}

      {/* Point 6 blackout overlay */}
      <AnimatePresence>
        {point6Blackout && (
          <motion.div
            className="fixed inset-0 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
            transition={{ duration: 0.5 }}
            style={{ background: "#000" }}
          />
        )}
      </AnimatePresence>

      {/* Red retina scan laser */}
      {scanning && (
        <>
          <motion.div
            className="fixed left-0 w-full z-30 pointer-events-none"
            initial={{ top: "0%" }}
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, ease: "easeInOut" }}
            style={{ height: 2, background: "rgba(255, 0, 0, 0.5)", boxShadow: "0 0 12px 4px rgba(255, 0, 0, 0.35)" }}
          />
          <motion.div
            className="fixed z-20 pointer-events-none"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,0,0,0.25) 0%, transparent 70%)" }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </>
      )}

      {phase === 2 && (
        <div className="fixed top-0 left-0 w-full z-30">
          <div style={{ width: `${scanProgress}%`, height: 2, background: "#00BCD4", transition: "width 16ms linear" }} />
          <motion.p animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="text-right pr-4 pt-1" style={{ fontFamily: mono, fontSize: 11, color: "#00BCD4" }}>
            ESCANEANDO PADRÃO RETINAL...
          </motion.p>
        </div>
      )}

      {/* Flash overlay */}
      <AnimatePresence>
        {showFlash && (
          <motion.div className="fixed inset-0 z-40 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ background: "#FFF" }} />
        )}
      </AnimatePresence>

      {/* Fade out */}
      {fadingOut && (
        <motion.div className="fixed inset-0 z-[100] bg-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
      )}

      {/* ═══════ CONTENT ═══════ */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full px-6">

        {/* Phase 1-2: Request text */}
        {phase <= 2 && (
          <div className="text-center max-w-[480px]">
            {typewriterLines.map((line, i) => (
              <p key={i} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: "#E8E8E8", fontSize: "clamp(15px, 4vw, 20px)", lineHeight: 1.7 }}>{line}</p>
            ))}
            {currentTyping && phase <= 1 && (
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: "#E8E8E8", fontSize: "clamp(15px, 4vw, 20px)", lineHeight: 1.7 }}>
                {currentTyping}
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ color: "#00BCD4", marginLeft: 2 }}>|</motion.span>
              </p>
            )}
            {showDot && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="flex flex-col items-center mt-[60px]">
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: dotGreen ? "#4ADE80" : "#FFFFFF" }} />
                {showBlinkText && (
                  <p style={{ fontSize: 12, color: "#555555", marginTop: 16, fontFamily: "'Inter', sans-serif" }}>Não pisque. O processo leva 4 segundos.</p>
                )}
                {scanning && (
                  <>
                    {[0, 1.3, 2.6].map((delay, i) => (
                      <motion.div key={i} className="absolute rounded-full" style={{ border: "1px solid rgba(0,188,212,0.7)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} initial={{ width: 0, height: 0, opacity: 0.8 }} animate={{ width: 180, height: 180, opacity: 0 }} transition={{ duration: 1.3, repeat: Infinity, delay, ease: "easeOut" }} />
                    ))}
                    <motion.svg className="absolute" width="80" height="80" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                      <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(0,188,212,0.5)" strokeWidth="1.5" strokeDasharray="60 180" />
                    </motion.svg>
                  </>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* Phase 3: Confirmation */}
        {phase === 3 && (
          <div className="text-center flex flex-col items-center">
            <motion.div initial={{ scale: 1 }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.3 }} style={{ width: 10, height: 10, borderRadius: "50%", background: "#4ADE80", marginBottom: 24 }} />
            {confirmLines.map((line, i) => (
              <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ fontFamily: mono, fontSize: 13, color: "#00BCD4", lineHeight: 2 }}>{line}</motion.p>
            ))}
            {showMiniLoader && (
              <div className="mt-4 relative overflow-hidden" style={{ width: 200, height: 2, background: "#1A1A2E", borderRadius: 1 }}>
                <motion.div animate={{ x: [-200, 200] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} style={{ width: 60, height: 2, background: "#00BCD4", borderRadius: 1 }} />
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* Phase 4+: FULL-SCREEN CINEMATIC STEPS                  */}
        {/* ═══════════════════════════════════════════════════════ */}
        {phase >= 4 && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">

              {/* ─── STEP 0: Title Full-Screen ─── */}
              {reportStep === 0 && (
                <motion.div
                  key="step0"
                  className="absolute inset-0 flex flex-col items-center justify-center px-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, fontWeight: 200, letterSpacing: "0.4em", color: "#FFFFFF", textAlign: "center" }}>
                    <GlitchText text="HISTÓRICO CORPÓREO" />
                  </p>
                  <p style={{ fontFamily: mono, fontSize: 13, color: "rgba(0,188,212,0.6)", marginTop: 16, letterSpacing: "0.2em" }}>
                    <GlitchText text={`PADRÃO #${patternRef.current}`} />
                  </p>
                  <div className="mt-8 w-full" style={{ maxWidth: 360 }}>
                    <FrequencyWave width={360} height={60} />
                  </div>
                  <p style={{ fontFamily: mono, fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 16, letterSpacing: "0.1em" }}>
                    frequência única — não replicável
                  </p>
                </motion.div>
              )}

              {/* ─── STEP 1: Body Scan Full-Screen ─── */}
              {reportStep === 1 && (
                <motion.div
                  key="step1"
                  className="absolute inset-0 flex flex-col items-center justify-center px-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.p
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    style={{ fontFamily: mono, fontSize: 12, color: "#00BCD4", marginBottom: 24, letterSpacing: "0.15em" }}
                  >
                    LOCALIZANDO SINAIS...
                  </motion.p>

                  <div className="relative" style={{ height: "55vh", aspectRatio: "120/280" }}>
                    {/* Glow */}
                    <svg viewBox="0 0 120 280" className="absolute inset-0 w-full h-full" fill="none" stroke="rgba(0,188,212,0.08)" strokeWidth="2.5" style={{ filter: "blur(4px)" }}>
                      <ellipse cx="60" cy="28" rx="16" ry="20" /><line x1="54" y1="48" x2="54" y2="60" /><line x1="66" y1="48" x2="66" y2="60" /><path d="M54 60 Q40 62 28 78" /><path d="M66 60 Q80 62 92 78" /><path d="M28 78 L32 160" /><path d="M92 78 L88 160" /><path d="M32 160 Q60 168 88 160" /><path d="M28 78 Q22 100 18 130 Q16 142 20 150" /><path d="M92 78 Q98 100 102 130 Q104 142 100 150" /><path d="M42 160 L38 220 L34 270" /><path d="M78 160 L82 220 L86 270" /><path d="M52 160 L50 220 L48 270" /><path d="M68 160 L70 220 L72 270" />
                    </svg>
                    {/* Main */}
                    <svg viewBox="0 0 120 280" className="absolute inset-0 w-full h-full" fill="none" stroke="rgba(0,188,212,0.18)" strokeWidth="1">
                      <ellipse cx="60" cy="28" rx="16" ry="20" /><line x1="54" y1="48" x2="54" y2="60" /><line x1="66" y1="48" x2="66" y2="60" /><path d="M54 60 Q40 62 28 78" /><path d="M66 60 Q80 62 92 78" /><path d="M28 78 L32 160" /><path d="M92 78 L88 160" /><path d="M32 160 Q60 168 88 160" /><path d="M28 78 Q22 100 18 130 Q16 142 20 150" /><path d="M92 78 Q98 100 102 130 Q104 142 100 150" /><path d="M42 160 L38 220 L34 270" /><path d="M78 160 L82 220 L86 270" /><path d="M52 160 L50 220 L48 270" /><path d="M68 160 L70 220 L72 270" />
                    </svg>
                    {/* Scan line */}
                    <div
                      className="absolute left-0 w-full pointer-events-none"
                      style={{
                        top: `${scanLineY}%`,
                        height: 2,
                        background: "linear-gradient(90deg, transparent 0%, rgba(0,188,212,0.6) 20%, rgba(0,188,212,1) 50%, rgba(0,188,212,0.6) 80%, transparent 100%)",
                        boxShadow: "0 0 12px 4px rgba(0,188,212,0.3)",
                        transition: "top 33ms linear",
                      }}
                    />
                  </div>

                  <p style={{ fontFamily: mono, fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 24 }}>
                    0/6 sinais detectados
                  </p>
                </motion.div>
              )}

              {/* ─── STEPS 2-6: Individual Signal Reveals ─── */}
              {reportStep >= 2 && reportStep <= 6 && (
                <motion.div
                  key={`step${reportStep}`}
                  className="absolute inset-0 flex flex-col items-center justify-center px-8"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Mini-body with points */}
                  <div className="mb-8">
                    <BodySVG
                      height="150px"
                      points={getSignalPoints(signalRevealIndex, reportStep - 1)}
                    />
                  </div>

                  {/* Signal info */}
                  <div className="text-center">
                    <motion.p
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 400, color: "#FFFFFF", letterSpacing: "0.05em" }}
                    >
                      {bodySignals[reportStep - 2]?.name}
                    </motion.p>

                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                      style={{ width: 40, height: 1, background: "rgba(255,80,80,0.8)", margin: "16px auto" }}
                    />

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#FF5050", fontWeight: 500, letterSpacing: "0.15em" }}
                    >
                      {bodySignals[reportStep - 2]?.status}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 12, fontStyle: "italic" }}
                    >
                      {bodySignals[reportStep - 2]?.label}
                    </motion.p>
                  </div>

                  {/* Counter */}
                  <p style={{ fontFamily: mono, fontSize: 12, color: "rgba(255,255,255,0.3)", position: "absolute", bottom: 40 }}>
                    {reportStep - 1}/6 sinais detectados
                  </p>
                </motion.div>
              )}

              {/* ─── STEP 7: 6th Signal DRAMATIC ─── */}
              {reportStep === 7 && (
                <motion.div
                  key="step7"
                  className="absolute inset-0 flex flex-col items-center justify-center px-8 z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Mini body with amber point */}
                  <div className="mb-4">
                    <BodySVG
                      height="120px"
                      points={bodySignals.map((s) => ({
                        id: s.id,
                        top: s.top,
                        left: s.left,
                        color: s.color,
                        active: s.id === 6,
                        fixed: s.id < 6,
                      }))}
                    />
                  </div>

                  {/* Amber pulse circle */}
                  {amberPulse && (
                    <motion.div
                      className="absolute"
                      style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: -1 }}
                      initial={{ width: 0, height: 0, opacity: 0.8 }}
                      animate={{ width: 200, height: 200, opacity: 0 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                      <div className="w-full h-full rounded-full" style={{ background: "radial-gradient(circle, rgba(255,180,0,0.3) 0%, transparent 70%)" }} />
                    </motion.div>
                  )}

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 400, color: "#FFB400", textAlign: "center", letterSpacing: "0.05em" }}
                  >
                    SINTOMA SEM DIAGNÓSTICO
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ delay: 1.2, duration: 1.5, repeat: Infinity }}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#FFB400", marginTop: 16, letterSpacing: "0.1em", textAlign: "center" }}
                  >
                    ORIGEM IDENTIFICADA — AGUARDANDO ENTREGA
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 1 }}
                    className="mt-6 text-center"
                  >
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", fontStyle: "italic", lineHeight: 1.8 }}>
                      Este não foi suprimido.<br />
                      Ninguém soube nomeá-lo.
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {/* ─── STEP 8: Constellation Complete ─── */}
              {reportStep === 8 && (
                <motion.div
                  key="step8"
                  className="absolute inset-0 flex flex-col items-center justify-center px-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative" style={{ height: "55vh", aspectRatio: "120/280" }}>
                    {/* Glow body */}
                    <svg viewBox="0 0 120 280" className="absolute inset-0 w-full h-full" fill="none" stroke="rgba(0,188,212,0.08)" strokeWidth="2.5" style={{ filter: "blur(4px)" }}>
                      <ellipse cx="60" cy="28" rx="16" ry="20" /><line x1="54" y1="48" x2="54" y2="60" /><line x1="66" y1="48" x2="66" y2="60" /><path d="M54 60 Q40 62 28 78" /><path d="M66 60 Q80 62 92 78" /><path d="M28 78 L32 160" /><path d="M92 78 L88 160" /><path d="M32 160 Q60 168 88 160" /><path d="M28 78 Q22 100 18 130 Q16 142 20 150" /><path d="M92 78 Q98 100 102 130 Q104 142 100 150" /><path d="M42 160 L38 220 L34 270" /><path d="M78 160 L82 220 L86 270" /><path d="M52 160 L50 220 L48 270" /><path d="M68 160 L70 220 L72 270" />
                    </svg>
                    <svg viewBox="0 0 120 280" className="absolute inset-0 w-full h-full" fill="none" stroke="rgba(0,188,212,0.18)" strokeWidth="1">
                      <ellipse cx="60" cy="28" rx="16" ry="20" /><line x1="54" y1="48" x2="54" y2="60" /><line x1="66" y1="48" x2="66" y2="60" /><path d="M54 60 Q40 62 28 78" /><path d="M66 60 Q80 62 92 78" /><path d="M28 78 L32 160" /><path d="M92 78 L88 160" /><path d="M32 160 Q60 168 88 160" /><path d="M28 78 Q22 100 18 130 Q16 142 20 150" /><path d="M92 78 Q98 100 102 130 Q104 142 100 150" /><path d="M42 160 L38 220 L34 270" /><path d="M78 160 L82 220 L86 270" /><path d="M52 160 L50 220 L48 270" /><path d="M68 160 L70 220 L72 270" />
                    </svg>

                    {/* All 6 points */}
                    {bodySignals.map((s) => (
                      <motion.div
                        key={s.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: s.id * 0.1, type: "spring", stiffness: 200 }}
                        className="absolute"
                        style={{ top: s.top, left: s.left, transform: "translate(-50%, -50%)", zIndex: 5 }}
                      >
                        <div style={{
                          width: s.id === 6 ? 10 : 7,
                          height: s.id === 6 ? 10 : 7,
                          borderRadius: "50%",
                          background: s.color,
                          boxShadow: `0 0 12px ${s.color}`,
                        }} />
                      </motion.div>
                    ))}

                    {/* Constellation lines */}
                    {constellationDrawn && (
                      <svg viewBox="0 0 120 280" className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 4 }}>
                        <defs>
                          <filter id="cGlow">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                          </filter>
                        </defs>
                        {constellationPairs.map(([a, b], i) => {
                          const pA = bodySignals[a];
                          const pB = bodySignals[b];
                          // Convert percentage positions to viewBox coords
                          const x1 = parseFloat(pA.left) * 1.2;
                          const y1 = parseFloat(pA.top) * 2.8;
                          const x2 = parseFloat(pB.left) * 1.2;
                          const y2 = parseFloat(pB.top) * 2.8;
                          return (
                            <motion.line
                              key={i}
                              x1={x1} y1={y1} x2={x2} y2={y2}
                              stroke="rgba(0,188,212,0.2)"
                              strokeWidth="0.5"
                              filter="url(#cGlow)"
                              strokeDasharray="200"
                              strokeDashoffset={200}
                              animate={{ strokeDashoffset: 0 }}
                              transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
                            />
                          );
                        })}
                      </svg>
                    )}
                  </div>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.7)", marginTop: 24, letterSpacing: "0.1em" }}
                  >
                    6 sinais mapeados
                  </motion.p>
                </motion.div>
              )}

              {/* ─── STEP 9: Vertical Timeline ─── */}
              {reportStep === 9 && (
                <motion.div
                  key="step9"
                  className="absolute inset-0 flex flex-col items-center justify-center px-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {originPhraseIndex === 0 ? (
                    /* Timeline milestones */
                    <div className="flex flex-col items-center gap-0" style={{ minHeight: 300 }}>
                      {/* INFÂNCIA */}
                      <AnimatePresence>
                        {timelineMilestone >= 1 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="flex flex-col items-center"
                          >
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,255,255,0.4)", boxShadow: "0 0 10px rgba(255,255,255,0.2)" }} />
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 8, letterSpacing: "0.2em", fontWeight: 500 }}>INFÂNCIA</p>
                            <motion.p
                              initial={{ opacity: 0, filter: "blur(4px)" }}
                              animate={{ opacity: 1, filter: "blur(0px)" }}
                              transition={{ delay: 0.3, duration: 0.6 }}
                              style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 4 }}
                            >
                              circuito instalado
                            </motion.p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Connecting line 1 */}
                      {timelineMilestone >= 2 && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 50 }}
                          transition={{ duration: 0.5 }}
                          style={{ width: 1, borderLeft: "1px dashed rgba(255,255,255,0.15)", margin: "8px 0" }}
                        />
                      )}

                      {/* DESENVOLVIMENTO */}
                      <AnimatePresence>
                        {timelineMilestone >= 2 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="flex flex-col items-center"
                          >
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,100,100,0.6)", boxShadow: "0 0 10px rgba(255,100,100,0.3)" }} />
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 8, letterSpacing: "0.2em", fontWeight: 500 }}>DESENVOLVIMENTO</p>
                            <motion.p
                              initial={{ opacity: 0, filter: "blur(4px)" }}
                              animate={{ opacity: 1, filter: "blur(0px)" }}
                              transition={{ delay: 0.3, duration: 0.6 }}
                              style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 4 }}
                            >
                              primeiros sintomas
                            </motion.p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Connecting line 2 */}
                      {timelineMilestone >= 3 && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 50 }}
                          transition={{ duration: 0.5 }}
                          style={{ width: 1, borderLeft: "1px dashed rgba(255,255,255,0.15)", margin: "8px 0" }}
                        />
                      )}

                      {/* HOJE */}
                      <AnimatePresence>
                        {timelineMilestone >= 3 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 250 }}
                            className="flex flex-col items-center relative"
                          >
                            {/* Radar rings */}
                            {[0, 0.8, 1.6].map((delay, ri) => (
                              <motion.div
                                key={ri}
                                className="absolute rounded-full"
                                style={{ top: 0, left: "50%", transform: "translateX(-50%)", border: "1px solid rgba(0,188,212,0.3)" }}
                                initial={{ width: 12, height: 12, opacity: 0.5 }}
                                animate={{ width: 48, height: 48, opacity: 0 }}
                                transition={{ duration: 1.6, repeat: Infinity, delay, ease: "easeOut" }}
                              />
                            ))}
                            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(0,188,212,0.8)", boxShadow: "0 0 16px rgba(0,188,212,0.6), 0 0 32px rgba(0,188,212,0.3)" }} />
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#00BCD4", marginTop: 8, letterSpacing: "0.2em", fontWeight: 500 }}>HOJE</p>
                            <motion.p
                              initial={{ opacity: 0, filter: "blur(4px)" }}
                              animate={{ opacity: 1, filter: "blur(0px)" }}
                              transition={{ delay: 0.3, duration: 0.6 }}
                              style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#00BCD4", marginTop: 4 }}
                            >
                              padrão ativo
                            </motion.p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    /* Origin phrases — full-screen centered, one at a time */
                    <AnimatePresence mode="wait">
                      {originPhraseIndex === 1 && (
                        <motion.p
                          key="o1"
                          initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                          animate={{ opacity: 0.7, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.8 }}
                          className="text-center"
                          style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#FFFFFF", lineHeight: 1.8, maxWidth: 320 }}
                        >
                          O padrão identificado no seu scan<br />tem origem estimada antes dos 12 anos.
                        </motion.p>
                      )}
                      {originPhraseIndex === 2 && (
                        <motion.p
                          key="o2"
                          initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                          animate={{ opacity: 0.7, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.8 }}
                          className="text-center"
                          style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#FFFFFF", lineHeight: 1.8, maxWidth: 320 }}
                        >
                          Não é um problema recente.<br />É um circuito antigo.
                        </motion.p>
                      )}
                      {originPhraseIndex === 3 && (
                        <motion.div
                          key="o3"
                          initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8 }}
                          className="text-center relative"
                        >
                          {/* Flash sweep */}
                          <motion.div
                            className="absolute inset-0 pointer-events-none"
                            initial={{ x: "-100%" }}
                            animate={{ x: "200%" }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)" }}
                          />
                          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: "#FFFFFF", fontWeight: 500, lineHeight: 1.8, position: "relative" }}>
                            E circuitos antigos <span style={{ color: "#00BCD4", textShadow: "0 0 12px rgba(0,188,212,0.4)" }}>podem ser reescritos</span>.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              )}

              {/* ─── STEP 10: Stats ─── */}
              {reportStep === 10 && (
                <motion.div
                  key="step10"
                  className="absolute inset-0 flex flex-col items-center justify-center px-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col items-center gap-8">
                    {/* 6 sinais */}
                    {statIndex >= 1 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.3, 1] }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
                        className="text-center"
                      >
                        <div style={{ fontSize: 48, fontFamily: "'Inter', sans-serif", fontWeight: 200, color: "#E5E7EB", textShadow: "0 0 12px rgba(229,231,235,0.3)" }}>
                          <Counter target={6} duration={0.5} />
                        </div>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>sinais enviados</p>
                      </motion.div>
                    )}

                    {/* 5 suprimidos */}
                    {statIndex >= 2 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.3, 1] }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
                        className="text-center"
                      >
                        <div style={{ fontSize: 48, fontFamily: "'Inter', sans-serif", fontWeight: 200, color: "#FF5050", textShadow: "0 0 16px rgba(255,80,80,0.4)" }}>
                          <Counter target={5} duration={0.4} />
                        </div>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>suprimidos</p>
                      </motion.div>
                    )}

                    {/* 1 não entregue */}
                    {statIndex >= 3 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.3, 1] }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
                        className="text-center"
                      >
                        <motion.div
                          animate={{ textShadow: ["0 0 16px rgba(255,180,0,0.4)", "0 0 32px rgba(255,180,0,0.7)", "0 0 16px rgba(255,180,0,0.4)"] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{ fontSize: 48, fontFamily: "'Inter', sans-serif", fontWeight: 200, color: "#FFB400" }}
                        >
                          <Counter target={1} duration={0.3} />
                        </motion.div>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>não entregue</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Context texts */}
                  <div className="mt-12 flex flex-col items-center gap-3">
                    {contextIndex >= 1 && (
                      <motion.p initial={{ opacity: 0, y: 8, filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.6 }} style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#00BCD4", textAlign: "center" }}>
                        O intermediário capturou o último sinal há anos.
                      </motion.p>
                    )}
                    {contextIndex >= 2 && (
                      <motion.p initial={{ opacity: 0, y: 8, filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.6 }} style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
                        Não havia canal de acesso.
                      </motion.p>
                    )}
                    {contextIndex >= 3 && (
                      <motion.p initial={{ opacity: 0, y: 8, filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.6 }} style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#FFFFFF", textAlign: "center" }}>
                        A varredura de hoje abriu esse canal.
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ─── STEP 11+: Cinematic Narrative ─── */}
              {reportStep === 11 && (
                <motion.div
                  key="step11"
                  className="absolute inset-0 flex flex-col items-center justify-center px-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <AnimatePresence mode="wait">
                    {narrativeLine >= 0 && narrativeLine < narrativeTexts.length && (
                      <motion.div
                        key={narrativeLine}
                        className="flex items-center justify-center text-center px-4"
                        initial={
                          narrativeTexts[narrativeLine].special === "weight"
                            ? { opacity: 0, scale: 0.9, letterSpacing: "0.5em" }
                            : { opacity: 0, y: 15, filter: "blur(4px)" }
                        }
                        animate={
                          narrativeTexts[narrativeLine].special === "weight"
                            ? { opacity: 1, scale: 1, letterSpacing: "0.15em" }
                            : { opacity: narrativeTexts[narrativeLine].opacity, y: 0, filter: "blur(0px)" }
                        }
                        exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        {narrativeTexts[narrativeLine].special === "cyan" ? (
                          <div className="relative">
                            <motion.div
                              className="absolute inset-0 pointer-events-none"
                              initial={{ x: "-100%" }}
                              animate={{ x: "200%" }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,188,212,0.1) 50%, transparent 100%)" }}
                            />
                            <p style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: narrativeTexts[narrativeLine].size,
                              color: "#00BCD4",
                              fontWeight: 500,
                              lineHeight: 1.6,
                              textShadow: "0 0 24px rgba(0,188,212,0.5)",
                              position: "relative",
                            }}>
                              {narrativeTexts[narrativeLine].text}
                            </p>
                          </div>
                        ) : narrativeTexts[narrativeLine].special === "weight" ? (
                          <div className="relative">
                            <motion.div
                              className="absolute inset-0 pointer-events-none"
                              animate={{ opacity: [0, 0.15, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              style={{ background: "radial-gradient(ellipse at center, rgba(0,188,212,0.2) 0%, transparent 70%)", transform: "scale(2.5)" }}
                            />
                            <p style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: narrativeTexts[narrativeLine].size,
                              color: "#FFFFFF",
                              fontWeight: 500,
                              lineHeight: 1.5,
                              whiteSpace: "pre-line",
                              position: "relative",
                            }}>
                              {narrativeTexts[narrativeLine].text}
                            </p>
                          </div>
                        ) : (
                          <p style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: narrativeTexts[narrativeLine].size,
                            color: `rgba(255,255,255,${narrativeTexts[narrativeLine].opacity})`,
                            lineHeight: 1.6,
                            whiteSpace: "pre-line",
                            maxWidth: 340,
                          }}>
                            {narrativeTexts[narrativeLine].text}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Button */}
                  {showButton && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1 }}
                      className="flex flex-col items-center"
                    >
                      <motion.button
                        onClick={handleClick}
                        className="cursor-pointer bg-transparent"
                        animate={{
                          boxShadow: [
                            "0 0 8px rgba(0,188,212,0.2), inset 0 0 8px rgba(0,188,212,0.05)",
                            "0 0 20px rgba(0,188,212,0.5), inset 0 0 12px rgba(0,188,212,0.1)",
                            "0 0 8px rgba(0,188,212,0.2), inset 0 0 8px rgba(0,188,212,0.05)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                          fontSize: 13,
                          letterSpacing: "0.3em",
                          color: "#00BCD4",
                          fontFamily: "'Inter', sans-serif",
                          padding: "16px 40px",
                          border: "1px solid rgba(0,188,212,0.5)",
                          borderRadius: 2,
                          background: "transparent",
                        }}
                        whileHover={{
                          boxShadow: "0 0 30px rgba(0,188,212,0.6), inset 0 0 20px rgba(0,188,212,0.15)",
                          color: "#FFFFFF",
                        }}
                      >
                        RECEBER LIGAÇÃO
                      </motion.button>
                      <motion.p
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ fontFamily: mono, fontSize: 12, color: "rgba(0,188,212,0.6)", marginTop: 16, letterSpacing: "0.15em" }}
                      >
                        canal aberto — conexão disponível
                      </motion.p>
                    </motion.div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Screen1_Archive;
