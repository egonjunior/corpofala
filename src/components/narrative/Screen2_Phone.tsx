import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNarrativeAudio } from "@/contexts/NarrativeAudioContext";

interface Screen2Props {
  onNext: () => void;
}

// ─── SVG Icons ───────────────────────────────────────────
const PhoneIcon = ({ size = 28, rotate = 0 }: { size?: number; rotate?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${rotate}deg)` }}>
    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z" fill="white"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);

const SignalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <rect x="1" y="10" width="2.5" height="5" rx="0.5" fill="white"/>
    <rect x="5" y="7" width="2.5" height="8" rx="0.5" fill="white"/>
    <rect x="9" y="4" width="2.5" height="11" rx="0.5" fill="white"/>
    <rect x="13" y="1" width="2.5" height="14" rx="0.5" fill="white" opacity="0.3"/>
  </svg>
);

const WifiIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12.55a11 11 0 0114 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1" fill="white" stroke="none"/>
  </svg>
);

const BatteryIcon = () => (
  <svg width="28" height="14" viewBox="0 0 28 14">
    <rect x="0.5" y="1" width="22" height="11" rx="2" stroke="white" strokeWidth="1" fill="none"/>
    <rect x="2" y="2.5" width={22 * 0.72 - 2} height="8" rx="1" fill="white"/>
    <rect x="23" y="4" width="2.5" height="5" rx="1" fill="white" opacity="0.4"/>
  </svg>
);

const HeartECGIcon = ({ size = 52, animSpeed = "1.5s" }: { size?: number; animSpeed?: string }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
    <path d="M26 45s-17-11-17-22a9.5 9.5 0 0117-5.7A9.5 9.5 0 0143 23c0 11-17 22-17 22z" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5"/>
    <path
      d="M8 26h8l3-8 4 16 4-12 3 4h14"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="80"
      style={{
        animation: `ecgDash ${animSpeed} linear infinite`,
      }}
    />
  </svg>
);

// ─── Canvas Waves ────────────────────────────────────────
const useConvergingWaves = (canvasRef: React.RefObject<HTMLCanvasElement | null>, active: boolean, pulseRef: React.RefObject<boolean>) => {
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const centerX = () => canvas.width / 2;
    const centerY = () => canvas.height * 0.38; // avatar position approx

    const angles = [0, 60, 120, 180, 240, 300].map(a => (a * Math.PI) / 180);

    const draw = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = centerX();
      const cy = centerY();
      const pulse = pulseRef.current ? 1.3 : 1;

      angles.forEach((angle) => {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,188,212,0.06)";
        ctx.lineWidth = 1.5;

        for (let i = 0; i < 200; i++) {
          const dist = 400 - i * 1.6 - (frameRef.current * 0.4) % 400;
          if (dist < 80) continue;
          const amp = 20 * pulse * Math.sin(i * 0.05 + frameRef.current * 0.02);
          const perpAngle = angle + Math.PI / 2;
          const x = cx + Math.cos(angle) * dist + Math.cos(perpAngle) * amp;
          const y = cy + Math.sin(angle) * dist + Math.sin(perpAngle) * amp;
          const alpha = Math.max(0, Math.min(1, (dist - 80) / 100));
          ctx.globalAlpha = alpha * 0.06;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, active, pulseRef]);
};

// ─── Main Component ──────────────────────────────────────
const Screen2_Phone = ({ onNext }: Screen2Props) => {
  const audio = useNarrativeAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pulseRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  

  // State
  const [time, setTime] = useState(() => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
  const [subtitle, setSubtitle] = useState("Chamada recebida");
  const [subtitleStyle, setSubtitleStyle] = useState<React.CSSProperties>({});
  const [isVibrating, setIsVibrating] = useState(true);
  const [ecgSpeed, setEcgSpeed] = useState("1.5s");
  const [ringActive, setRingActive] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [refuseTexts, setRefuseTexts] = useState<string[]>([]);
  const [islandExpanded, setIslandExpanded] = useState(false);
  const [islandContent, setIslandContent] = useState<"dot" | "freq" | "signal" | "waveform">("dot");
  const [showPassiveText, setShowPassiveText] = useState(false);
  
  const [fadingOut, setFadingOut] = useState(false);
  const [visible, setVisible] = useState(false);
  const [refused, setRefused] = useState(false);
  const [answered, setAnswered] = useState(false);
  

  // Vibration interval
  const vibIntervalRef = useRef<number | null>(null);
  // Idle timers
  const idleIslandRef = useRef<number | null>(null);
  const idleTextRef = useRef<number | null>(null);

  useConvergingWaves(canvasRef, !fadingOut, pulseRef);

  // Clock
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })), 1000);
    return () => clearInterval(iv);
  }, []);

  // Entry: ringtone 0.3s before visual, then fade in
  useEffect(() => {
    audio.stopAll();
    audio.startRingtone();

    const visTimer = setTimeout(() => setVisible(true), 300);

    // Start haptic vibration loop
    const doVibrate = () => {
      try { navigator.vibrate?.([500, 300, 500, 300, 500]); } catch {}
      pulseRef.current = true;
      setTimeout(() => { pulseRef.current = false; }, 200);
    };
    doVibrate();
    vibIntervalRef.current = window.setInterval(doVibrate, 4000);

    // Idle: Dynamic Island expand at 7s
    idleIslandRef.current = window.setTimeout(() => {
      setIslandExpanded(true);
      setIslandContent("freq");
      setTimeout(() => { setIslandExpanded(false); setIslandContent("dot"); }, 4000);
    }, 7000);

    // Idle: passive text at 8s
    idleTextRef.current = window.setTimeout(() => setShowPassiveText(true), 8000);

    return () => {
      clearTimeout(visTimer);
      if (vibIntervalRef.current) clearInterval(vibIntervalRef.current);
      if (idleIslandRef.current) clearTimeout(idleIslandRef.current);
      if (idleTextRef.current) clearTimeout(idleTextRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      
      try { navigator.vibrate?.(0); } catch {}
      audio.stopRingtone();
    };
  }, [audio]);

  const stopAllEffects = useCallback(() => {
    audio.stopRingtone();
    try { navigator.vibrate?.(0); } catch {}
    if (vibIntervalRef.current) { clearInterval(vibIntervalRef.current); vibIntervalRef.current = null; }
    if (idleIslandRef.current) { clearTimeout(idleIslandRef.current); idleIslandRef.current = null; }
    if (idleTextRef.current) { clearTimeout(idleTextRef.current); idleTextRef.current = null; }
    setIsVibrating(false);
    setShowPassiveText(false);
  }, [audio]);

  // ─── RECUSAR ───
  const handleRefuse = useCallback(() => {
    if (refused || answered) return;
    setRefused(true);
    stopAllEffects();
    setShowOverlay(true);
    setSubtitle("Chamada encerrada");
    setSubtitleStyle({ color: "rgba(255,255,255,0.45)" });
    setEcgSpeed("4s");
    setRingActive(false);

    // Sequential texts
    const texts: { text: string; delay: number }[] = [
      { text: "Você recusou.", delay: 1000 },
      { text: "O corpo está acostumado a ser ignorado.", delay: 2000 },
      { text: "Mas o canal continua aberto.", delay: 3500 },
    ];
    texts.forEach(({ text, delay }) => {
      setTimeout(() => setRefuseTexts(prev => [...prev, text]), delay);
    });

    // Dynamic Island "sinal ativo"
    setTimeout(() => { setIslandExpanded(true); setIslandContent("signal"); }, 2000);

    // Restore after total ~7s
    setTimeout(() => {
      setRefused(false);
      setShowOverlay(false);
      setSubtitle("Chamada recebida");
      setSubtitleStyle({});
      setEcgSpeed("1.5s");
      setRingActive(true);
      setRefuseTexts([]);
      setIslandExpanded(false);
      setIslandContent("dot");

      // Restart ringtone and vibration
      audio.startRingtone();
      setIsVibrating(true);
      const doVibrate = () => {
        try { navigator.vibrate?.([500, 300, 500, 300, 500]); } catch {}
        pulseRef.current = true;
        setTimeout(() => { pulseRef.current = false; }, 200);
      };
      doVibrate();
      vibIntervalRef.current = window.setInterval(doVibrate, 4000);
    }, 7000);
  }, [refused, answered, stopAllEffects, audio]);

  // ─── ATENDER ───
  const handleAnswer = useCallback(() => {
    if (refused || answered) return;
    setAnswered(true);
    stopAllEffects();
    try { navigator.vibrate?.(50); } catch {}
    setRingActive(false);

    // Instant transition — brief fade then go to call screen immediately
    setFadingOut(true);
    setTimeout(() => onNext(), 350);
  }, [refused, answered, stopAllEffects, onNext]);

  const iosFont = '-apple-system, "SF Pro Display", system-ui, sans-serif';

  return (
    <div className="w-full h-screen relative overflow-hidden" style={{ fontFamily: iosFont }}>
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(160deg, #1C1C3A 0%, #0D1B2A 40%, #1A0D2E 70%, #0A0A1A 100%)",
      }}/>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }}/>

      {/* Canvas waves */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}/>

      {/* Radial fade out */}
      <AnimatePresence>
        {fadingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-50"
            style={{ background: "radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.4) 100%)" }}
          />
        )}
      </AnimatePresence>

      {/* Refuse overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-10"
            style={{ background: "rgba(0,0,0,0.35)" }}
          />
        )}
      </AnimatePresence>

      {/* Main content with screen vibrate */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: visible ? 1 : 0,
          ...(isVibrating ? {
            y: [0, -2, 2, -1, 1, 0],
          } : {}),
        }}
        transition={{
          opacity: { duration: 0.2 },
          y: isVibrating ? { duration: 0.35, repeat: Infinity, repeatDelay: 3.65 } : undefined,
        }}
        className="relative w-full h-full z-20"
      >
        {/* ─── STATUS BAR ─── */}
        <div className="fixed top-0 left-0 right-0 z-[100] flex items-start justify-between"
          style={{ height: 50, padding: "14px 24px 0" }}>
          {/* Time */}
          <span style={{ fontSize: 17, fontWeight: 600, color: "#fff" }}>{time}</span>

          {/* Dynamic Island */}
          <motion.div
            animate={{
              width: islandExpanded ? 200 : 120,
              height: islandExpanded ? 38 : 34,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute left-1/2 flex items-center justify-center gap-1.5 overflow-hidden"
            style={{
              transform: "translateX(-50%)",
              top: 10,
              background: "#000",
              borderRadius: 20,
            }}
          >
            {islandContent === "dot" && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ width: 8, height: 8, borderRadius: "50%", background: "#30D158", marginLeft: "auto", marginRight: 12 }}
              />
            )}
            {islandContent === "freq" && (
              <div className="flex items-center gap-1.5 px-3">
                <svg width="8" height="8" viewBox="0 0 8 8"><path d="M4 7s-3-2-3-4a3 3 0 016 0c0 2-3 4-3 4z" fill="#00BCD4"/></svg>
                <span style={{ fontSize: 10, color: "#fff", whiteSpace: "nowrap" }}>Frequência: 528Hz</span>
              </div>
            )}
            {islandContent === "signal" && (
              <div className="flex items-center gap-1.5 px-3">
                <svg width="8" height="8" viewBox="0 0 8 8"><path d="M4 7s-3-2-3-4a3 3 0 016 0c0 2-3 4-3 4z" fill="#30D158"/></svg>
                <span style={{ fontSize: 10, color: "#fff", whiteSpace: "nowrap" }}>sinal ativo</span>
              </div>
            )}
            {islandContent === "waveform" && (
              <div className="flex items-center gap-1 px-3">
                <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 8s-4-2.5-4-5a4 4 0 018 0c0 2.5-4 5-4 5z" fill="#34C759"/></svg>
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    style={{ width: 2, background: "#fff", borderRadius: 1 }}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Status icons */}
          <div className="flex items-center gap-1.5">
            <SignalIcon/>
            <WifiIcon/>
            <BatteryIcon/>
            <span style={{ fontSize: 12, color: "#fff", marginLeft: 2 }}>72%</span>
          </div>
        </div>

        {/* ─── CENTRAL AREA ─── */}
        <>
          <div className="flex flex-col items-center w-full" style={{ paddingTop: "18vh" }}>
            <span style={{ fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.6)", letterSpacing: "0.01em", marginBottom: 6 }}>
              iPhone
            </span>
            <span style={{ fontSize: 46, fontWeight: 300, color: "#fff", letterSpacing: "-0.5px", marginBottom: 4 }}>
              Corpo
            </span>
            <motion.span
              key={subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.55)", marginBottom: 40, ...subtitleStyle }}
            >
              {subtitle}
            </motion.span>

            {/* Avatar */}
            <div className="relative" style={{ marginBottom: 36 }}>
              {ringActive && (
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0 0px rgba(0,188,212,0.5)",
                      "0 0 0 20px rgba(0,188,212,0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute rounded-full"
                  style={{ inset: -4, borderRadius: "50%" }}
                />
              )}
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 112, height: 112,
                  background: "linear-gradient(135deg, #005F73 0%, #0A9396 50%, #00BCD4 100%)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                }}
              >
                <HeartECGIcon size={52} animSpeed={ecgSpeed}/>
              </div>
            </div>

            {/* Secondary buttons */}
            <div className="flex items-start gap-7" style={{ marginBottom: 24 }}>
              {[{ icon: <ClockIcon/>, label: "Lembrar-me" }, { icon: <MessageIcon/>, label: "Mensagem" }].map(btn => (
                <div key={btn.label} className="flex flex-col items-center">
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 56, height: 56,
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {btn.icon}
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>{btn.label}</span>
                </div>
              ))}
            </div>

            {/* Refuse texts */}
            <div className="flex flex-col items-center gap-2 min-h-[80px]">
              <AnimatePresence>
                {refuseTexts.map((text, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", textAlign: "center" }}
                  >
                    {text}
                  </motion.p>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* ─── MAIN BUTTONS (incoming call) ─── */}
          <div className="fixed left-0 right-0 flex flex-col items-center z-30" style={{ bottom: 64 }}>
            <div className="flex items-start justify-center" style={{ gap: 72 }}>
              <div className="flex flex-col items-center">
                <button
                  onClick={handleRefuse}
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 72, height: 72,
                    background: "#FF3B30",
                    boxShadow: "0 4px 20px rgba(255,59,48,0.4)",
                  }}
                >
                  <PhoneIcon size={28} rotate={135}/>
                </button>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 8 }}>Recusar</span>
              </div>

              <div className="flex flex-col items-center">
                <motion.button
                  onClick={handleAnswer}
                  animate={answered ? { scale: [1, 0.9, 1] } : {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 4px 20px rgba(52,199,89,0.5)",
                      "0 4px 20px rgba(52,199,89,0.8), 0 0 0 0px rgba(52,199,89,0.4)",
                      "0 4px 20px rgba(52,199,89,0.5), 0 0 0 20px rgba(52,199,89,0)",
                    ],
                  }}
                  transition={answered ? { duration: 0.25 } : { duration: 2.4, repeat: Infinity }}
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 72, height: 72,
                    background: "#34C759",
                  }}
                >
                  <PhoneIcon size={28}/>
                </motion.button>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 8 }}>Atender</span>
              </div>
            </div>

            <AnimatePresence>
              {showPassiveText && !refused && !answered && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textAlign: "center", marginTop: 20 }}
                >
                  O canal aberto pelo scan fecha em breve.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </>
      </motion.div>

      {/* ECG animation keyframes */}
      <style>{`
        @keyframes ecgDash {
          from { stroke-dashoffset: 80; }
          to { stroke-dashoffset: -80; }
        }
      `}</style>
    </div>
  );
};

export default Screen2_Phone;
