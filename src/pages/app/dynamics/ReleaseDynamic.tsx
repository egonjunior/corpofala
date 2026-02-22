import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DynamicShell from "@/components/dynamics/DynamicShell";
import PostDynamicScreen from "@/components/dynamics/PostDynamicScreen";
import { haptic } from "@/lib/haptics";
import {
  playReleaseSound,
  playCaptureSound,
  startHoldPulse,
  playParticleSounds,
} from "@/lib/releaseAudio";
import { detectSentiment, getSentimentColor, getColorForSentiment, type Sentiment } from "@/lib/sentimentAnalysis";

// ─── Types ───────────────────────────────────────────
type Act = "presence" | "capture" | "contact" | "release" | "reflection" | "conclusion" | "post";

interface ThoughtObject {
  text: string;
  color: string;
  sentiment: Sentiment;
  holdDuration: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
}

// ─── Helpers ─────────────────────────────────────────
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const lighten = (color: string, amount: number) => {
  // For rgba colors, just return a lighter version
  return `rgba(255,255,255,${amount})`;
};

// ─── Main Component ──────────────────────────────────
const ReleaseDynamic = () => {
  const [act, setAct] = useState<Act>("presence");
  const [releasedThoughts, setReleasedThoughts] = useState<ThoughtObject[]>([]);
  const startTime = useRef(Date.now());
  const [duration, setDuration] = useState(0);

  // ═══ ACT 1 — PRESENCE ═══
  const PresenceScreen = () => {
    const [visibleLines, setVisibleLines] = useState<number[]>([]);
    const lines = [
      { text: "Eu sei que sua mente não para.", delay: 0, opacity: 0.85, font: "serif" },
      { text: "Não precisa parar.", delay: 2500, opacity: 0.70, font: "serif" },
      { text: "Só precisa soltar.", delay: 4500, opacity: 0.85, font: "serif" },
      { text: "__BUTTON__", delay: 7000, opacity: 1, font: "button" },
    ];

    useEffect(() => {
      const timers: NodeJS.Timeout[] = [];
      lines.forEach((line, i) => {
        timers.push(setTimeout(() => setVisibleLines((prev) => [...prev, i]), line.delay));
      });
      return () => timers.forEach(clearTimeout);
    }, []);

    return (
      <DynamicShell background="#060610" showClose screenKey="presence">
        <div
          className="flex-1 flex flex-col items-center justify-center gap-6 px-6 cursor-pointer"
          onClick={() => {
            startTime.current = Date.now();
            setAct("capture");
          }}
        >
          {/* Presence dot */}
          <motion.div
            className="rounded-full"
            style={{
              width: 3,
              height: 3,
              background: "#8A7FF5",
              boxShadow: "0 0 12px 4px rgba(138,127,245,0.3)",
            }}
            animate={{
              opacity: [0.4, 1, 0.4],
              boxShadow: [
                "0 0 6px 2px rgba(138,127,245,0.2)",
                "0 0 20px 8px rgba(138,127,245,0.4)",
                "0 0 6px 2px rgba(138,127,245,0.2)",
              ],
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Sequential text */}
          <div className="flex flex-col items-center gap-2 mt-8">
            {lines.map((line, i) => {
              if (line.font === "button") {
                return (
                  <AnimatePresence key={i}>
                    {visibleLines.includes(i) && (
                      <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        onClick={() => {
                          startTime.current = Date.now();
                          setAct("capture");
                        }}
                        className="mt-4 px-10 py-3.5 rounded-full"
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          color: "rgba(255,255,255,0.7)",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 16,
                        }}
                      >
                        <motion.span
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          Começar
                        </motion.span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                );
              }
              return (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: visibleLines.includes(i) ? line.opacity : 0 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    fontFamily: line.font === "sans" ? "'DM Sans', sans-serif" : "'DM Serif Display', serif",
                    fontStyle: line.font === "sans" ? "normal" : "italic",
                    fontSize: line.font === "sans" ? 14 : 18,
                    color: "white",
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  {line.text}
                </motion.p>
              );
            })}
          </div>
        </div>
      </DynamicShell>
    );
  };

  // ═══ ACT 2 — CAPTURE ═══
  const CaptureScreen = () => {
    const [text, setText] = useState("");
    const [cantWrite, setCantWrite] = useState(false);
    const [transforming, setTransforming] = useState(false);
    const [showObject, setShowObject] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const sentimentColor = text.length > 3 ? getSentimentColor(text) : "rgba(200,200,220,0.8)";

    const handleCantWrite = async () => {
      setCantWrite(true);
      await delay(2000);
      handleTransform("", "neutral");
    };

    const handleTransform = async (thoughtText: string, sentimentOverride?: Sentiment) => {
      if (transforming) return;
      setTransforming(true);

      const finalText = thoughtText || text;
      const sentiment = sentimentOverride || detectSentiment(finalText);
      const color = getColorForSentiment(sentiment);

      playCaptureSound();
      haptic("medium");

      // Wait for sphere animation
      await delay(1500);

      const obj: ThoughtObject = {
        text: finalText,
        color,
        sentiment,
        holdDuration: 0,
      };

      setReleasedThoughts((prev) => [...prev, obj]);
      setAct("contact");
    };

    // Speech recognition
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);

    const hasSpeechAPI = typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

    const toggleRecording = () => {
      if (isRecording) {
        recognitionRef.current?.stop();
        setIsRecording(false);
        return;
      }
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRec();
      recognition.lang = "pt-BR";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
      };
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      haptic("medium");
    };

    return (
      <DynamicShell background="#060610" showClose screenKey="capture">
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
          {!cantWrite && !transforming && (
            <>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontStyle: "italic",
                  fontSize: 18,
                  color: "rgba(255,255,255,0.85)",
                  textAlign: "center",
                }}
              >
                Qual pensamento mais volta?
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  color: "rgba(255,255,255,0.5)",
                  textAlign: "center",
                }}
              >
                Escreve. Não precisa ser bonito.
              </motion.p>

              {/* Text input — minimal, only border-bottom */}
              <div className="w-full max-w-md relative">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, 200))}
                  placeholder="Está aqui. Pode escrever."
                  rows={4}
                  autoFocus
                  className="w-full resize-none outline-none"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "none",
                    borderBottom: `1px solid ${text ? "rgba(138,127,245,0.5)" : "rgba(255,255,255,0.15)"}`,
                    borderRadius: 0,
                    padding: "20px 0 16px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 17,
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.9)",
                    lineHeight: 1.7,
                    caretColor: "#8A7FF5",
                    transition: "border-color 0.3s ease",
                  }}
                />
                <div className="flex justify-between items-center mt-2">
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
                    {text.length}/200
                  </span>
                  {text.length > 3 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="rounded-full"
                      style={{
                        width: 8,
                        height: 8,
                        background: sentimentColor,
                        boxShadow: `0 0 6px ${sentimentColor}`,
                        transition: "background 0.8s ease",
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Alternatives */}
              <div className="flex items-center gap-4 mt-2">
                {hasSpeechAPI && (
                  <button
                    onClick={toggleRecording}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all"
                    style={{
                      background: "transparent",
                      border: `1px solid ${isRecording ? "#FF6464" : "rgba(255,255,255,0.15)"}`,
                      color: isRecording ? "#FF6464" : "rgba(255,255,255,0.5)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                    }}
                  >
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                    {isRecording ? "Ouvindo..." : "Falar"}
                  </button>
                )}
                <button
                  onClick={() => handleCantWrite()}
                  className="transition-all"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "rgba(255,255,255,0.3)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    textDecoration: "underline",
                    textUnderlineOffset: 4,
                    cursor: "pointer",
                  }}
                >
                  Não consigo escrever agora
                </button>
              </div>

              {/* Transform button */}
              <AnimatePresence>
                {text.length > 2 && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={() => handleTransform(text)}
                    className="mt-4 px-8 py-3 rounded-xl"
                    style={{
                      background: "#8A7FF5",
                      color: "#fff",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 16,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Transformar em objeto →
                  </motion.button>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Can't write mode */}
          {cantWrite && !transforming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: 16,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.7,
              }}>
                Tudo bem. O peso que você está carregando
                <br />
                já é suficiente para trabalharmos com ele.
              </p>
            </motion.div>
          )}

          {/* Transform animation */}
          {transforming && (
            <motion.div
              initial={{ scale: 0, borderRadius: "4px" }}
              animate={{ scale: 1, borderRadius: "50%" }}
              transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex items-center justify-center"
              style={{
                width: 160,
                height: 160,
                background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4), ${sentimentColor} 60%, rgba(0,0,0,0.3) 100%)`,
                boxShadow: `0 0 40px 8px ${sentimentColor}30, 0 0 80px 20px ${sentimentColor}15, inset 0 0 20px rgba(255,255,255,0.2)`,
              }}
            >
              {text && (
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontStyle: "italic",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.9)",
                  textAlign: "center",
                  padding: 20,
                  lineHeight: 1.5,
                  pointerEvents: "none",
                }}>
                  {text.length > 40 ? text.slice(0, 37) + "..." : text}
                </span>
              )}
            </motion.div>
          )}
        </div>
      </DynamicShell>
    );
  };

  // ═══ ACT 3 — CONTACT ═══
  const ContactScreen = () => {
    const currentThought = releasedThoughts[releasedThoughts.length - 1];
    const [isHolding, setIsHolding] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);
    const [holdText, setHoldText] = useState("");
    const [showReleaseTip, setShowReleaseTip] = useState(false);
    const [holdTooShort, setHoldTooShort] = useState(false);
    const holdStartRef = useRef(0);
    const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
    const progressRef = useRef<NodeJS.Timeout | null>(null);
    const stopPulseRef = useRef<(() => void) | null>(null);
    const holdTextTimersRef = useRef<NodeJS.Timeout[]>([]);

    const cleanup = useCallback(() => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      stopPulseRef.current?.();
      holdTextTimersRef.current.forEach(clearTimeout);
    }, []);

    useEffect(() => () => cleanup(), [cleanup]);

    const handleHoldStart = () => {
      setIsHolding(true);
      setHoldTooShort(false);
      holdStartRef.current = Date.now();
      haptic("heavy");

      // Start hold pulse sound
      stopPulseRef.current = startHoldPulse();

      // Progress ring — 20s max
      progressRef.current = setInterval(() => {
        const elapsed = Date.now() - holdStartRef.current;
        setHoldProgress(Math.min(elapsed / 20000, 1));
      }, 100);

      // Sequential hold texts
      holdTextTimersRef.current.push(
        setTimeout(() => setHoldText("Você está carregando isso."), 3000),
        setTimeout(() => setHoldText("Por quanto tempo?"), 6000),
        setTimeout(() => setHoldText("Você pode soltar quando quiser."), 10000),
        setTimeout(() => setShowReleaseTip(true), 5000),
      );

      // Auto-release after 20s
      holdTimerRef.current = setTimeout(() => handleHoldEnd(), 20000);
    };

    const handleHoldEnd = () => {
      if (!isHolding && holdStartRef.current === 0) return;
      const holdDuration = Date.now() - holdStartRef.current;
      cleanup();
      setIsHolding(false);

      if (holdDuration < 3000) {
        setHoldTooShort(true);
        setHoldProgress(0);
        return;
      }

      // Update hold duration on the thought
      setReleasedThoughts((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], holdDuration };
        return updated;
      });

      setAct("release");
    };

    const circumference = 2 * Math.PI * 95;

    return (
      <DynamicShell background="#060610" showClose screenKey="contact">
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
          {/* Instruction */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 15,
              color: "rgba(255,255,255,0.6)",
              textAlign: "center",
            }}
          >
            Pressione e segure a esfera
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "rgba(255,255,255,0.35)",
              textAlign: "center",
              marginTop: -12,
            }}
          >
            Mantenha pressionado por pelo menos 3 segundos
          </motion.p>

          {/* Sphere with touch target */}
          <div
            className="relative flex items-center justify-center"
            style={{ padding: 20, cursor: isHolding ? "grabbing" : "grab" }}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
          >
            {/* Progress ring */}
            {isHolding && (
              <svg
                viewBox="0 0 200 200"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(-90deg)",
                  width: 200,
                  height: 200,
                  pointerEvents: "none",
                }}
              >
                <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                <circle
                  cx="100" cy="100" r="95"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - holdProgress * circumference}
                  style={{ transition: "stroke-dashoffset 0.1s linear" }}
                />
              </svg>
            )}

            {/* Sphere */}
            <motion.div
              animate={{
                y: isHolding ? 0 : [0, -12, 0],
                scale: isHolding ? 1.05 : 1,
              }}
              transition={isHolding ? { duration: 0.3 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-full flex items-center justify-center relative select-none"
              style={{
                width: 160,
                height: 160,
                background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4), ${currentThought.color} 60%, rgba(0,0,0,0.3) 100%)`,
                boxShadow: `0 0 40px 8px ${currentThought.color}30, 0 0 80px 20px ${currentThought.color}15, inset 0 0 20px rgba(255,255,255,0.2)`,
              }}
            >
              {currentThought.text && (
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontStyle: "italic",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.9)",
                  textAlign: "center",
                  padding: 20,
                  lineHeight: 1.5,
                  pointerEvents: "none",
                }}>
                  {currentThought.text.length > 40
                    ? currentThought.text.slice(0, 37) + "..."
                    : currentThought.text}
                </span>
              )}
              {/* Glass reflection */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  top: "20%",
                  left: "20%",
                  width: "30%",
                  height: "20%",
                  background: "radial-gradient(ellipse at center, rgba(255,255,255,0.4), transparent)",
                  transform: "rotate(-30deg)",
                }}
              />
            </motion.div>
          </div>

          {/* Hold text */}
          <AnimatePresence mode="wait">
            {holdText && isHolding && (
              <motion.p
                key={holdText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontStyle: "italic",
                  fontSize: 16,
                  color: "rgba(255,255,255,0.6)",
                  textAlign: "center",
                }}
              >
                {holdText}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Release tip */}
          {showReleaseTip && isHolding && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Levante o dedo para soltar
            </motion.p>
          )}

          {/* Too short tip */}
          {holdTooShort && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "rgba(255,255,255,0.5)",
                textAlign: "center",
              }}
            >
              Segure por mais tempo.
              <br />
              Sinta o peso antes de soltar.
            </motion.p>
          )}
        </div>
      </DynamicShell>
    );
  };

  // ═══ ACT 4 — THE RELEASE ═══
  const ReleaseScreen = () => {
    const currentThought = releasedThoughts[releasedThoughts.length - 1];
    const [phase, setPhase] = useState<"fly" | "silence" | "voice">("fly");
    const [sphereScale, setSphereScale] = useState(1);
    const [sphereY, setSphereY] = useState(0);
    const [sphereOpacity, setSphereOpacity] = useState(1);
    const [particles, setParticles] = useState<Particle[]>([]);
    const particleLoopRef = useRef<NodeJS.Timeout | null>(null);
    const controlX = useRef((Math.random() - 0.5) * 100);

    useEffect(() => {
      const run = async () => {
        // Frame 50ms — expansion
        await delay(50);
        setSphereScale(1.15);

        // Frame 200ms — sound + vibration
        await delay(150);
        playReleaseSound();
        haptic("heavy");

        // Frame 100ms — start flight
        setSphereY(-window.innerHeight * 0.6);

        // Frame 400ms — particles
        await delay(200);
        playParticleSounds();
        const newParticles: Particle[] = Array.from({ length: 18 }).map((_, i) => {
          const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.5;
          const speed = 2 + Math.random() * 4;
          return {
            id: i,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            size: 3 + Math.random() * 5,
            color: `hsl(${i * 20}, 60%, 75%)`,
            opacity: 0.6 + Math.random() * 0.4,
            life: 1,
          };
        });
        setParticles(newParticles);

        // Animate particles
        particleLoopRef.current = setInterval(() => {
          setParticles((prev) =>
            prev
              .map((p) => ({
                ...p,
                x: p.x + p.vx,
                y: p.y + p.vy,
                vy: p.vy - 0.05,
                opacity: p.opacity * 0.96,
                life: p.life - 0.02,
              }))
              .filter((p) => p.life > 0)
          );
        }, 16);

        // Frame 1200ms — sphere gone
        await delay(800);
        setSphereOpacity(0);

        // Particles end
        await delay(800);
        if (particleLoopRef.current) clearInterval(particleLoopRef.current);
        setParticles([]);

        // 3 seconds of sacred silence
        setPhase("silence");
        await delay(3000);

        // Voice moment
        setPhase("voice");
        await delay(4000);

        setAct("reflection");
      };

      run();
      return () => {
        if (particleLoopRef.current) clearInterval(particleLoopRef.current);
      };
    }, []);

    return (
      <DynamicShell background="#060610" showClose={false} screenKey="release">
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Flying sphere */}
          {phase === "fly" && (
            <motion.div
              initial={{ scale: 1, y: 0, opacity: 1 }}
              animate={{
                scale: [sphereScale, 0.6, 0],
                y: [0, sphereY * 0.4, sphereY],
                x: [0, controlX.current, controlX.current * 1.5],
                opacity: [1, 0.7, 0],
              }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="rounded-full flex items-center justify-center"
              style={{
                width: 160,
                height: 160,
                background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4), ${currentThought.color} 60%, rgba(0,0,0,0.3) 100%)`,
                boxShadow: `0 0 40px 8px ${currentThought.color}30, 0 0 80px 20px ${currentThought.color}15`,
                opacity: sphereOpacity,
              }}
            />
          )}

          {/* Particles */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }}>
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: p.x,
                  top: p.y,
                  width: p.size,
                  height: p.size,
                  background: p.color,
                  opacity: p.opacity,
                  boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }}
              />
            ))}
          </div>

          {/* Voice text */}
          {phase === "voice" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 1 }}
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: 18,
                color: "rgba(255,255,255,0.85)",
                textAlign: "center",
              }}
            >
              Foi embora. Por agora, foi embora.
            </motion.p>
          )}
        </div>
      </DynamicShell>
    );
  };

  // ═══ ACT 5 — REFLECTION ═══
  const ReflectionScreen = () => {
    const count = releasedThoughts.length;
    const [showButtons, setShowButtons] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setShowButtons(true), 2000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <DynamicShell background="#060610" showClose screenKey="reflection">
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
          {/* Presence dot — brighter now */}
          <motion.div
            className="rounded-full"
            style={{
              width: 4,
              height: 4,
              background: "#8A7FF5",
              boxShadow: "0 0 20px 8px rgba(138,127,245,0.5)",
            }}
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: 18,
              color: "rgba(255,255,255,0.85)",
              textAlign: "center",
            }}
          >
            Foi embora. Por agora, foi embora.
          </motion.p>

          {count >= 2 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1 }}
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: 16,
                color: "rgba(255,255,255,0.6)",
                textAlign: "center",
              }}
            >
              Você soltou {count} pensamento{count > 1 ? "s" : ""} hoje.
              {count >= 3 && <><br />Sua mente tem mais espaço agora.</>}
            </motion.p>
          )}

          {showButtons && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 mt-6"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontStyle: "italic",
                  fontSize: 16,
                  color: "rgba(255,255,255,0.7)",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                Tem outro pensamento que quer soltar?
              </motion.p>

              <button
                onClick={() => setAct("capture")}
                className="px-8 py-3 rounded-xl"
                style={{
                  background: "rgba(138,127,245,0.15)",
                  border: "1px solid rgba(138,127,245,0.4)",
                  color: "#8A7FF5",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Tem mais um
              </button>
              <button
                onClick={() => {
                  setDuration(Math.round((Date.now() - startTime.current) / 1000));
                  setAct("conclusion");
                }}
                className="px-8 py-3 rounded-xl"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Por hoje é suficiente
              </button>
            </motion.div>
          )}
        </div>
      </DynamicShell>
    );
  };

  // ═══ CONCLUSION — Constellation ═══
  const ConclusionScreen = () => {
    const count = releasedThoughts.length;
    const [checkIn, setCheckIn] = useState<string | null>(null);
    const [showCheckin, setShowCheckin] = useState(false);

    // Generate constellation stars
    const stars = releasedThoughts.map((_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      size: 2 + Math.random() * 3,
      brightness: 0.4 + Math.random() * 0.6,
    }));

    useEffect(() => {
      const timer = setTimeout(() => setShowCheckin(true), 3000);
      return () => clearTimeout(timer);
    }, []);

    const handleCheckIn = (value: string) => {
      setCheckIn(value);
      // After checkin, go to post
      setTimeout(() => setAct("post"), 1500);
    };

    return (
      <DynamicShell background="#0F0E18" showClose={false} screenKey="conclusion">
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
          {/* Constellation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            style={{ width: 220, height: 220 }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Lines between close stars */}
              {stars.map((star, i) =>
                stars.slice(i + 1).map((other, j) => {
                  const dist = Math.sqrt((star.x - other.x) ** 2 + (star.y - other.y) ** 2);
                  if (dist < 30) {
                    return (
                      <line
                        key={`${i}-${j}`}
                        x1={star.x} y1={star.y}
                        x2={other.x} y2={other.y}
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="0.3"
                      />
                    );
                  }
                  return null;
                })
              )}
              {/* Stars */}
              {stars.map((star) => (
                <circle key={star.id} cx={star.x} cy={star.y} r={star.size * 0.1} fill="white" opacity={star.brightness}>
                  <animate
                    attributeName="opacity"
                    values={`${star.brightness};${star.brightness * 0.4};${star.brightness}`}
                    dur={`${2 + Math.random() * 2}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </svg>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 1 }}
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: 22,
              color: "rgba(255,255,255,0.85)",
              textAlign: "center",
            }}
          >
            {count} pensamento{count > 1 ? "s" : ""} soltado{count > 1 ? "s" : ""} hoje.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.5 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            Cada vez que você pratica, o loop fica
            <br />
            mais fraco. O espaço interno fica maior.
          </motion.p>

          {/* Check-in */}
          {showCheckin && !checkIn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4 mt-4"
            >
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                color: "rgba(255,255,255,0.7)",
              }}>
                Como está sua cabeça agora?
              </p>
              <div className="flex gap-3">
                {[
                  { label: "Mais leve", value: "better" },
                  { label: "Igual", value: "same" },
                  { label: "Ainda pesada", value: "heavy" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleCheckIn(opt.value)}
                    className="px-5 py-2.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.7)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* After check-in */}
          {checkIn === "heavy" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: 15,
                color: "rgba(255,255,255,0.6)",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Tudo bem. Às vezes leva mais de uma vez.
              <br />
              Você pode voltar quando quiser.
            </motion.p>
          )}
        </div>
      </DynamicShell>
    );
  };

  // ═══ RENDER ═══
  if (act === "presence") return <PresenceScreen />;
  if (act === "capture") return <CaptureScreen />;
  if (act === "contact") return <ContactScreen />;
  if (act === "release") return <ReleaseScreen />;
  if (act === "reflection") return <ReflectionScreen />;
  if (act === "conclusion") return <ConclusionScreen />;

  // Post screen
  return (
    <DynamicShell background="#F2EDE4" showClose={false} screenKey="post">
      <PostDynamicScreen
        dynamicId="release"
        durationSeconds={duration}
        onRestart={() => {
          setAct("presence");
          setReleasedThoughts([]);
          setDuration(0);
        }}
      />
    </DynamicShell>
  );
};

export default ReleaseDynamic;
