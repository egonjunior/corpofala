import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DynamicShell from "@/components/dynamics/DynamicShell";
import PostDynamicScreen from "@/components/dynamics/PostDynamicScreen";
import BreathingBlob from "@/components/dynamics/breathing/BreathingBlob";
import SleepModeModal from "@/components/dynamics/breathing/SleepModeModal";
import AdaptiveModal from "@/components/dynamics/breathing/AdaptiveModal";
import { clickSoft, chimeCompletion, playTherapeutic, breathInOut, FREQUENCIES } from "@/lib/audio";
import { haptic } from "@/lib/haptics";

// ─── Types & Config ────────────────────────────────────────

type BreathingMode = "normal" | "sleep" | "emergency";
type Phase = "inhale" | "hold" | "exhale";
type Screen = "entry" | "breathing" | "conclusion" | "post";

interface Rhythm {
  inhale: number;
  hold: number;
  exhale: number;
}

interface ModeConfig {
  cycles: number;
  rhythm: Rhythm;
  vibrateOnPhaseChange: boolean;
}

const MODE_CONFIGS: Record<BreathingMode, ModeConfig> = {
  normal: { cycles: 3, rhythm: { inhale: 4, hold: 7, exhale: 8 }, vibrateOnPhaseChange: true },
  sleep: { cycles: 5, rhythm: { inhale: 4, hold: 8, exhale: 12 }, vibrateOnPhaseChange: false },
  emergency: { cycles: 1, rhythm: { inhale: 3, hold: 5, exhale: 6 }, vibrateOnPhaseChange: true },
};

const EASIER_RHYTHM: Rhythm = { inhale: 3, hold: 5, exhale: 6 };

const PHASE_LABELS: Record<Phase, string> = {
  inhale: "Inspira...",
  hold: "Segura...",
  exhale: "Solta... devagar...",
};

const PHASE_COLORS: Record<Phase, string> = {
  inhale: "#00BCD4",
  hold: "#8A7FF5",
  exhale: "#FF9A6C",
};

const BG_BY_CYCLE = ["#0A0A12", "#0E0E1A", "#141422", "#1A1A2C", "#20203A"];

// ─── Detect context ────────────────────────────────────────

function detectNightMode(): boolean {
  const h = new Date().getHours();
  return h >= 22 || h < 6;
}

// ─── Main Component ────────────────────────────────────────

const BreathingDynamic = () => {
  // State
  const [screen, setScreen] = useState<Screen>("entry");
  const [mode, setMode] = useState<BreathingMode>("normal");
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showAdaptiveModal, setShowAdaptiveModal] = useState(false);

  // Breathing state
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [countdown, setCountdown] = useState(4);
  const [rhythm, setRhythm] = useState<Rhythm>(MODE_CONFIGS.normal.rhythm);
  const [paused, setPaused] = useState(false);

  // Struggle detection
  const tapCountRef = useRef(0);

  // Progress tracking
  const startTimeRef = useRef(Date.now());
  const [duration, setDuration] = useState(0);

  // Interval ref
  const intervalRef = useRef<number>();

  // Phase duration helper
  const getPhaseDuration = useCallback(
    (p: Phase) => rhythm[p],
    [rhythm]
  );

  // Detect night mode on mount
  useEffect(() => {
    if (detectNightMode()) {
      setShowSleepModal(true);
    }
  }, []);

  // ─── Breathing Timer ─────────────────────────────

  useEffect(() => {
    if (screen !== "breathing" || paused) return;

    const config = MODE_CONFIGS[mode];

    intervalRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Advance phase
          setPhase((currentPhase) => {
            if (currentPhase === "inhale") {
              clickSoft();
              if (config.vibrateOnPhaseChange) haptic("selection");
              setCountdown(getPhaseDuration("hold"));
              return "hold";
            }
            if (currentPhase === "hold") {
              clickSoft();
              if (config.vibrateOnPhaseChange) haptic("selection");
              setCountdown(getPhaseDuration("exhale"));
              return "exhale";
            }
            // exhale → next cycle or conclusion
            setCycle((c) => {
              const nextCycle = c + 1;
              if (nextCycle >= config.cycles) {
                // Done
                clearInterval(intervalRef.current);
                setDuration(Math.round((Date.now() - startTimeRef.current) / 1000));
                setScreen("conclusion");
                return c;
              }
              return nextCycle;
            });
            clickSoft();
            if (config.vibrateOnPhaseChange) haptic("selection");
            setCountdown(getPhaseDuration("inhale"));
            return "inhale";
          });
          return 0; // will be overridden by setCountdown above
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [screen, paused, mode, getPhaseDuration]);

  // Play breathing guide tone on each phase change
  useEffect(() => {
    if (screen !== "breathing" || paused) return;
    breathInOut(rhythm.inhale, rhythm.hold, rhythm.exhale);
  }, [phase, screen, paused, rhythm]);

  // Play completion sound when reaching conclusion
  useEffect(() => {
    if (screen === "conclusion") {
      playTherapeutic(FREQUENCIES.transformation, 2);
      haptic("success");
    }
  }, [screen]);

  // ─── Handlers ─────────────────────────────────────

  const startBreathing = (selectedMode: BreathingMode) => {
    const config = MODE_CONFIGS[selectedMode];
    setMode(selectedMode);
    setRhythm(config.rhythm);
    setCycle(0);
    setPhase("inhale");
    setCountdown(config.rhythm.inhale);
    setPaused(false);
    tapCountRef.current = 0;
    startTimeRef.current = Date.now();
    setScreen("breathing");
  };

  const handleEntryTap = () => {
    startBreathing(mode);
  };

  const handleBreathingTap = () => {
    if (paused || showAdaptiveModal) return;
    tapCountRef.current += 1;
    // After 2 taps in first cycle, offer easier rhythm
    if (cycle === 0 && tapCountRef.current >= 2 && rhythm.inhale === 4) {
      setPaused(true);
      clearInterval(intervalRef.current);
      setShowAdaptiveModal(true);
    }
  };

  const handleAdaptAccept = () => {
    setRhythm(EASIER_RHYTHM);
    setShowAdaptiveModal(false);
    setPaused(false);
  };

  const handleAdaptDecline = () => {
    setShowAdaptiveModal(false);
    setPaused(false);
  };

  const handlePause = () => {
    setPaused((p) => !p);
    if (!paused) clearInterval(intervalRef.current);
  };

  const handleRestart = () => {
    setScreen("entry");
    setCycle(0);
    setPhase("inhale");
    setDuration(0);
    setMode("normal");
    tapCountRef.current = 0;
    if (detectNightMode()) setShowSleepModal(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent, handler: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handler();
    }
  };

  // ─── Calculate progress for blob ──────────────────

  const phaseDuration = getPhaseDuration(phase);
  const phaseProgress = phaseDuration > 0 ? 1 - countdown / phaseDuration : 0;
  const config = MODE_CONFIGS[mode];
  const bg = screen === "breathing" ? BG_BY_CYCLE[Math.min(cycle, BG_BY_CYCLE.length - 1)] : "#0A0A12";

  // ─── ENTRY SCREEN ────────────────────────────────

  if (screen === "entry") {
    return (
      <DynamicShell background="#0A0A12" showClose screenKey="entry" isDark>
        <div
          className="flex-1 flex flex-col items-center justify-center gap-10 px-6"
          onClick={handleEntryTap}
          onKeyDown={(e) => handleKeyDown(e, handleEntryTap)}
          role="button"
          tabIndex={0}
          aria-label="Toque para começar a respiração guiada"
        >
          <BreathingBlob phase="idle" progress={0} />

          <div className="text-center">
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
              Seu corpo está acelerado.
              <br />
              Vamos desacelerar juntos.
            </p>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            onClick={(e) => { e.stopPropagation(); handleEntryTap(); }}
            className="px-10 py-3.5 rounded-full"
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
              {mode === "sleep" ? "Começar a dormir" : "Começar respiração"}
            </motion.span>
          </motion.button>

          {mode !== "normal" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-3 py-1.5 rounded-full"
              style={{
                background: mode === "sleep" ? "rgba(138,127,245,0.2)" : "rgba(196,98,45,0.2)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: mode === "sleep" ? "#8A7FF5" : "#C4622D",
              }}
            >
              {mode === "sleep" ? "🌙 Modo Sono" : "⚡ Modo Emergência"}
            </motion.div>
          )}
        </div>

        {/* Sleep Mode Modal */}
        {showSleepModal && (
          <SleepModeModal
            onAccept={() => {
              setMode("sleep");
              setShowSleepModal(false);
            }}
            onDecline={() => {
              setMode("normal");
              setShowSleepModal(false);
            }}
          />
        )}
      </DynamicShell>
    );
  }

  // ─── BREATHING SCREEN ────────────────────────────

  if (screen === "breathing") {
    return (
      <DynamicShell
        background={bg}
        currentStep={cycle}
        totalSteps={config.cycles}
        showClose
        screenKey="breathing"
        isDark
      >
        <div
          className="flex-1 flex flex-col items-center justify-center gap-4 px-6"
          onClick={handleBreathingTap}
          role="button"
          tabIndex={0}
          aria-label={`${PHASE_LABELS[phase]} — ${countdown} segundos restantes`}
          onKeyDown={(e) => handleKeyDown(e, handleBreathingTap)}
        >
          {/* Cycle counter */}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>
            CICLO {cycle + 1} DE {config.cycles}
          </p>

          {/* Blob */}
          <BreathingBlob phase={phase} progress={phaseProgress} />

          {/* Countdown */}
          <motion.p
            key={countdown}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 48,
              color: PHASE_COLORS[phase],
              opacity: 0.7,
            }}
          >
            {countdown}
          </motion.p>

          {/* Phase label */}
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: 22,
                color: PHASE_COLORS[phase],
              }}
            >
              {PHASE_LABELS[phase]}
            </motion.p>
          </AnimatePresence>

          {/* Rhythm indicator */}
          <div className="flex gap-2 mt-2">
            {(["inhale", "hold", "exhale"] as Phase[]).map((p) => (
              <div
                key={p}
                className="rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  background: p === phase ? PHASE_COLORS[p] : "rgba(255,255,255,0.15)",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>

          {/* Pause button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePause();
            }}
            className="mt-6 w-10 h-10 flex items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.06)" }}
            aria-label={paused ? "Continuar" : "Pausar"}
          >
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>
              {paused ? "▶" : "⏸"}
            </span>
          </button>

          {paused && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)" }}
            >
              Pausado. Toque ⏸ para continuar.
            </motion.p>
          )}
        </div>

        {/* Adaptive Modal */}
        {showAdaptiveModal && (
          <AdaptiveModal onAccept={handleAdaptAccept} onDecline={handleAdaptDecline} />
        )}
      </DynamicShell>
    );
  }

  // ─── CONCLUSION SCREEN ────────────────────────────

  if (screen === "conclusion") {
    const min = Math.floor(duration / 60);
    const sec = duration % 60;

    const titleText =
      mode === "emergency"
        ? "1 respiração completa."
        : mode === "sleep"
          ? "Pode dormir agora."
          : `${config.cycles} respirações completas.`;

    const subtitleText =
      mode === "sleep"
        ? "Seu corpo está desacelerando."
        : "Sente a diferença?";

    return (
      <DynamicShell background="#F2EDE4" showClose screenKey="conclusion" isDark={false}>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
          {/* Mandala */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 360 }}
            transition={{
              scale: { duration: 0.8 },
              opacity: { duration: 0.8 },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            }}
            className="relative"
            style={{ width: 160, height: 160 }}
          >
            <div className="absolute rounded-full" style={{ width: 160, height: 160, top: "50%", left: "50%", transform: "translate(-50%, -50%)", border: "2px solid rgba(138,127,245,0.3)" }} />
            <div className="absolute rounded-full" style={{ width: 110, height: 110, top: "50%", left: "50%", transform: "translate(-50%, -50%)", border: "2px solid rgba(138,127,245,0.5)" }} />
            <div className="absolute rounded-full" style={{ width: 60, height: 60, top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "linear-gradient(135deg, #8A7FF5, #00BCD4)" }} />
          </motion.div>

          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#1A1520", textAlign: "center" }}>
            {titleText}
            <br />
            {subtitleText}
          </p>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#6A5A55" }}>
            Tempo: {min} min {sec.toString().padStart(2, "0")} seg
          </p>

          <button
            onClick={() => setScreen("post")}
            className="mt-4 px-8 py-3 rounded-xl"
            style={{
              background: "#C4622D",
              color: "#FFFFFF",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            {mode === "sleep" ? "Dormir agora" : "Continuar"}
          </button>
        </div>
      </DynamicShell>
    );
  }

  // ─── POST-DYNAMIC ────────────────────────────────

  return (
    <DynamicShell background="#F2EDE4" showClose={false} screenKey="post" isDark={false}>
      <PostDynamicScreen dynamicId="breathing" durationSeconds={duration} onRestart={handleRestart} />
    </DynamicShell>
  );
};

export default BreathingDynamic;
