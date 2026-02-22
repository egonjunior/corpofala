import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import DynamicShell from "@/components/dynamics/DynamicShell";
import PostDynamicScreen from "@/components/dynamics/PostDynamicScreen";
import { clickSoft, chimeSuccess, chimeCompletion, playTherapeutic, FREQUENCIES } from "@/lib/audio";
import { haptic } from "@/lib/haptics";

const BACKGROUNDS = ["#0A0A12", "#0F0F1E", "#14141C", "#1A1520", "#201A26", "#26202E", "#F2EDE4"];

const SENSES = [
  { count: 5, label: "VISÃO", instruction: "Toque na tela cada vez que identificar algo", completion: "Bom. Você está aqui." },
  { count: 4, label: "TATO", instruction: "Seus pés no chão. A roupa. O ar.", completion: "Você está sentindo. Você está presente." },
  { count: 3, label: "AUDIÇÃO", instruction: "Longe ou perto. Qualquer um.", completion: "Você está ouvindo. Você está aqui." },
  { count: 2, label: "OLFATO", instruction: "Pode ser sutil.", completion: "Quase lá." },
  { count: 1, label: "PALADAR", instruction: "Só uma.", completion: "Completo." },
];

const SENSE_QUESTIONS = [
  "O que você VÊ ao seu redor? Cinco coisas. Qualquer coisa.",
  "O que você SENTE tocando sua pele? Quatro coisas. Seus pés no chão. A roupa. O ar.",
  "O que você OUVE agora? Três sons. Longe ou perto. Qualquer um.",
  "O que você CHEIRA? Duas coisas. Pode ser sutil.",
  "O que você SENTE na boca? Uma coisa. Só uma.",
];

const AnchorDynamic = () => {
  const [screen, setScreen] = useState(0); // 0=entry, 1-5=senses, 6=conclusion, 7=post
  const [taps, setTaps] = useState(0);
  const [completed, setCompleted] = useState(false);
  const startTime = useRef(Date.now());
  const [duration, setDuration] = useState(0);
  const lastTapRef = useRef(0);

  const sense = screen >= 1 && screen <= 5 ? SENSES[screen - 1] : null;
  const bg = screen <= 5 ? BACKGROUNDS[screen] : BACKGROUNDS[6];
  const isDark = screen <= 5;
  const textColor = isDark ? "rgba(255,255,255,0.85)" : "#1A1520";
  const subColor = isDark ? "rgba(255,255,255,0.6)" : "#6A5A55";

  const handleEntryTap = () => {
    haptic("medium");
    startTime.current = Date.now();
    setScreen(1);
  };

  const handleSenseTap = useCallback(() => {
    if (completed) return;
    if (!sense) return;

    // Anti-spam: block taps faster than 250ms
    if (Date.now() - lastTapRef.current < 250) return;
    lastTapRef.current = Date.now();

    clickSoft();
    haptic("light");

    const next = taps + 1;
    setTaps(next);

    if (next >= sense.count) {
      setCompleted(true);
      if (screen < 5) {
        chimeSuccess();
        haptic("success");
        setTimeout(() => {
          setScreen((s) => s + 1);
          setTaps(0);
          setCompleted(false);
        }, 2000);
      } else {
        // Last sense - transition to conclusion
        setTimeout(() => {
          playTherapeutic(FREQUENCIES.transformation, 2);
          haptic("success");
          setDuration(Math.round((Date.now() - startTime.current) / 1000));
          setScreen(6);
        }, 1500);
      }
    }
  }, [taps, sense, completed, screen]);

  const handleRestart = () => {
    setScreen(0);
    setTaps(0);
    setCompleted(false);
    setDuration(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent, handler: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handler();
    }
  };

  // Screen 0: Entry
  if (screen === 0) {
    return (
      <DynamicShell background={BACKGROUNDS[0]} showClose screenKey={0} isDark>
        <div
          className="flex-1 flex flex-col items-center justify-center gap-12 px-6"
          onClick={handleEntryTap}
          onKeyDown={(e) => handleKeyDown(e, handleEntryTap)}
          role="button"
          tabIndex={0}
          aria-label="Toque para começar a dinâmica de ancoragem"
        >
          {/* Breathing circle - 160px */}
          <motion.div
            style={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.3)",
            }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Instruction text */}
          <p
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 22,
              color: "rgba(255,255,255,0.85)",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Respira.
            <br />
            Eu estou aqui com você.
            <br />
            Vamos voltar juntos.
          </p>

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
              Começar
            </motion.span>
          </motion.button>
        </div>
      </DynamicShell>
    );
  }

  // Screens 1-5: Senses
  if (screen >= 1 && screen <= 5 && sense) {
    return (
      <DynamicShell background={bg} currentStep={screen - 1} totalSteps={5} showClose screenKey={screen} isDark>
        <div
          className="flex-1 flex flex-col items-center justify-center gap-8 px-6"
          onClick={!completed ? handleSenseTap : undefined}
          onKeyDown={!completed ? (e) => handleKeyDown(e, handleSenseTap) : undefined}
          role="button"
          tabIndex={0}
          aria-label={`${sense.label}: toque para identificar ${sense.count - taps} item(ns)`}
        >
          {/* Question */}
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: textColor, textAlign: "center", maxWidth: 320 }}>
            {SENSE_QUESTIONS[screen - 1]}
          </p>

          {/* Count - 72px */}
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 72, color: "#00BCD4", opacity: 0.4 }}>
            {sense.count - taps}
          </p>

          {/* Circles */}
          <div className="flex gap-4 justify-center">
            {Array.from({ length: sense.count }).map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full"
                style={{
                  width: 48,
                  height: 48,
                  border: i < taps ? "2px solid #00BCD4" : "2px solid rgba(255,255,255,0.15)",
                  background: i < taps ? "#00BCD4" : "transparent",
                  boxShadow: i < taps ? "0 0 20px rgba(0,188,212,0.4)" : "none",
                }}
                animate={i === taps - 1 ? { scale: [0, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          {/* Instruction or completion */}
          {completed ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: 20,
                color: "#00BCD4",
                textAlign: "center",
              }}
            >
              {sense.completion}
            </motion.p>
          ) : (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: subColor, textAlign: "center", maxWidth: 320 }}>
              {sense.instruction}
            </p>
          )}
        </div>
      </DynamicShell>
    );
  }

  // Screen 6: Conclusion
  if (screen === 6) {
    const min = Math.floor(duration / 60);
    const sec = duration % 60;
    return (
      <DynamicShell background={BACKGROUNDS[6]} showClose screenKey={6} isDark={false}>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
          {/* Mandala - 3 concentric circles with slow rotation */}
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
            {/* Outer circle */}
            <div
              className="absolute rounded-full"
              style={{
                width: 160,
                height: 160,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                border: "2px solid rgba(0,188,212,0.3)",
              }}
            />
            {/* Middle circle */}
            <div
              className="absolute rounded-full"
              style={{
                width: 110,
                height: 110,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                border: "2px solid rgba(0,188,212,0.5)",
              }}
            />
            {/* Inner circle */}
            <div
              className="absolute rounded-full"
              style={{
                width: 60,
                height: 60,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "linear-gradient(135deg, #00BCD4, #C4622D)",
              }}
            />
          </motion.div>

          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#1A1520", textAlign: "center", lineHeight: 1.4 }}>
            Você está aqui.
            <br />
            Inteiro.
          </p>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#6A5A55", textAlign: "center", maxWidth: 300, lineHeight: 1.6 }}>
            Seus cinco sentidos te trouxeram de volta. O pânico não tem poder sobre quem está presente.
          </p>

          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: "#C4622D", opacity: 0.7 }}>
            {min}:{sec.toString().padStart(2, "0")}
          </p>

          <button
            onClick={() => setScreen(7)}
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
            Como estou agora
          </button>
        </div>
      </DynamicShell>
    );
  }

  // Screen 7: Post-dynamic
  return (
    <DynamicShell background="#F2EDE4" showClose={false} screenKey={7} isDark={false}>
      <PostDynamicScreen dynamicId="anchor" durationSeconds={duration} onRestart={handleRestart} />
    </DynamicShell>
  );
};

export default AnchorDynamic;
