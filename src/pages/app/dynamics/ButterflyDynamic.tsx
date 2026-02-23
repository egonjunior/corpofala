import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DynamicShell from "@/components/dynamics/DynamicShell";
import PostDynamicScreen from "@/components/dynamics/PostDynamicScreen";
import { clickSoft, chimeCompletion, playTherapeutic, FREQUENCIES } from "@/lib/audio";
import { haptic } from "@/lib/haptics";

// ─── Types & Config ────────────────────────────────────────

type Feeling = "ansiedade" | "tristeza" | "angustia" | "panico";
type Screen = "intention" | "position" | "stimulation" | "pause" | "conclusion" | "post";

interface FeelingOption {
    id: Feeling;
    label: string;
    emoji: string;
    sublabel: string;
    color: string;
    gradient: string;
}

const FEELINGS: FeelingOption[] = [
    {
        id: "ansiedade",
        label: "Ansiedade",
        emoji: "💨",
        sublabel: "Coração acelerado, inquietação",
        color: "#FF7043",
        gradient: "linear-gradient(135deg, #FF7043, #FF5722)",
    },
    {
        id: "tristeza",
        label: "Tristeza",
        emoji: "🌧️",
        sublabel: "Peso, vontade de chorar",
        color: "#64B5F6",
        gradient: "linear-gradient(135deg, #64B5F6, #42A5F5)",
    },
    {
        id: "angustia",
        label: "Angústia",
        emoji: "🌀",
        sublabel: "Aperto no peito, sem ar",
        color: "#CE93D8",
        gradient: "linear-gradient(135deg, #CE93D8, #AB47BC)",
    },
    {
        id: "panico",
        label: "Pânico",
        emoji: "⚡",
        sublabel: "Coração disparando, medo intenso",
        color: "#EF5350",
        gradient: "linear-gradient(135deg, #EF5350, #E53935)",
    },
];

const CYCLE_COUNT = 6;
const TAP_INTERVAL_MS = 800;

const SUPPORT_PHRASES: Record<Feeling, string[]> = {
    ansiedade: [
        "Você está seguro neste momento.",
        "Seu corpo está aprendendo a desacelerar.",
        "Cada toque acalma seu sistema nervoso.",
        "Não há perigo real agora.",
        "A ansiedade é uma onda — e ela passa.",
        "Você já sobreviveu a todas as anteriores.",
    ],
    tristeza: [
        "O que você sente é real e válido.",
        "Tristeza não é fraqueza — é profundidade.",
        "Você não precisa ter pressa de sair disso.",
        "Seu corpo está processando algo importante.",
        "É seguro sentir o que está sentindo.",
        "Depois da chuva, o chão absorve e renasce.",
    ],
    angustia: [
        "Você está aqui. Você está inteiro.",
        "Seu peito vai abrir espaço aos poucos.",
        "A angústia é informação, não sentença.",
        "Seu corpo está tentando te proteger.",
        "Respire no ritmo dos toques.",
        "O aperto vai soltar. Você está permitindo.",
    ],
    panico: [
        "Você não está morrendo. É o alarme do corpo.",
        "Seus pés estão no chão. Você está aqui.",
        "Este pânico vai passar em minutos.",
        "A amígdala disparou — mas não há perigo real.",
        "Cada toque desliga um pouco do alarme.",
        "Seu corpo vai se regular. Confie nele.",
    ],
};

// ─── Bilateral audio ──────────────────────────────────

function playBilateralTap(side: "left" | "right") {
    try {
        const actx = new AudioContext();
        if (actx.state === "suspended") actx.resume();
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        const panner = actx.createStereoPanner();

        osc.type = "sine";
        osc.frequency.setValueAtTime(side === "left" ? 220 : 260, actx.currentTime);
        panner.pan.setValueAtTime(side === "left" ? -0.8 : 0.8, actx.currentTime);

        gain.gain.setValueAtTime(0, actx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, actx.currentTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.2);

        osc.connect(gain).connect(panner).connect(actx.destination);
        osc.start(actx.currentTime);
        osc.stop(actx.currentTime + 0.2);

        setTimeout(() => actx.close(), 300);
    } catch { }
}

// ─── Animated Hands Component (Position Screen) ───────

const HandsAnimation = ({ color }: { color: string }) => {
    return (
        <div className="relative" style={{ width: 260, height: 280 }}>
            {/* Soft ambient glow behind */}
            <div
                className="absolute rounded-full"
                style={{
                    width: 200,
                    height: 200,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: `radial-gradient(circle, ${color}15, transparent 70%)`,
                }}
            />

            {/* Torso silhouette */}
            <svg
                viewBox="0 0 260 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
            >
                {/* Head */}
                <circle cx="130" cy="48" r="28" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                {/* Neck */}
                <rect x="122" y="76" width="16" height="16" rx="4" fill="rgba(255,255,255,0.05)" />
                {/* Shoulders + upper body */}
                <path
                    d="M62 110 C62 96 88 88 130 88 C172 88 198 96 198 110 L198 200 C198 216 172 224 130 224 C88 224 62 216 62 200 Z"
                    fill="rgba(255,255,255,0.04)"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                />
            </svg>

            {/* Left hand crossing to right shoulder — animated */}
            <motion.div
                initial={{ x: -80, y: 60, rotate: 0, opacity: 0 }}
                animate={{ x: 10, y: -10, rotate: 35, opacity: 1 }}
                transition={{ delay: 0.6, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute"
                style={{ top: 120, left: 70 }}
            >
                <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
                    {/* Forearm */}
                    <rect x="0" y="6" width="60" height="12" rx="6" fill="rgba(255,255,255,0.15)" />
                    {/* Hand */}
                    <ellipse cx="66" cy="12" rx="14" ry="10" fill="rgba(255,255,255,0.2)" />
                </svg>
            </motion.div>

            {/* Right hand crossing to left shoulder — animated */}
            <motion.div
                initial={{ x: 80, y: 60, rotate: 0, opacity: 0 }}
                animate={{ x: -10, y: -10, rotate: -35, opacity: 1 }}
                transition={{ delay: 0.9, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute"
                style={{ top: 120, right: 70 }}
            >
                <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
                    <rect x="20" y="6" width="60" height="12" rx="6" fill="rgba(255,255,255,0.15)" />
                    <ellipse cx="14" cy="12" rx="14" ry="10" fill="rgba(255,255,255,0.2)" />
                </svg>
            </motion.div>

            {/* Tap targets — shoulder dots that pulse */}
            <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ delay: 2.2, duration: 1.2, repeat: Infinity, repeatDelay: 0.6 }}
                className="absolute rounded-full"
                style={{
                    width: 16,
                    height: 16,
                    top: 104,
                    left: 72,
                    background: color,
                    boxShadow: `0 0 20px ${color}66`,
                }}
            />
            <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ delay: 2.8, duration: 1.2, repeat: Infinity, repeatDelay: 0.6 }}
                className="absolute rounded-full"
                style={{
                    width: 16,
                    height: 16,
                    top: 104,
                    right: 72,
                    background: color,
                    boxShadow: `0 0 20px ${color}66`,
                }}
            />
        </div>
    );
};

// ─── Stimulation Visual ──────────────────────────────

const StimulationVisual = ({
    activeSide,
    color,
}: {
    activeSide: "left" | "right" | "idle";
    color: string;
}) => {
    const isLeft = activeSide === "left";
    const isRight = activeSide === "right";

    return (
        <div className="relative flex items-center justify-center" style={{ width: 280, height: 220 }}>
            {/* Large ambient glow */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: 220,
                    height: 220,
                    background: `radial-gradient(circle, ${color}0D, transparent 70%)`,
                }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Left circle — shoulder */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: 72,
                    height: 72,
                    left: 24,
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
                animate={{
                    background: isLeft
                        ? [color, `${color}CC`, color]
                        : "rgba(255,255,255,0.04)",
                    boxShadow: isLeft
                        ? [`0 0 0px ${color}00`, `0 0 40px ${color}88`, `0 0 0px ${color}00`]
                        : "0 0 0px transparent",
                    scale: isLeft ? [1, 1.12, 1] : 1,
                    borderColor: isLeft ? color : "rgba(255,255,255,0.1)",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <div
                    className="w-full h-full rounded-full flex items-center justify-center"
                    style={{ border: `1.5px solid ${isLeft ? color : "rgba(255,255,255,0.1)"}` }}
                >
                    <motion.span
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: 1.5,
                            color: isLeft ? "#fff" : "rgba(255,255,255,0.3)",
                            textTransform: "uppercase",
                        }}
                        animate={{ opacity: isLeft ? 1 : 0.4 }}
                    >
                        ESQ
                    </motion.span>
                </div>
            </motion.div>

            {/* Center — connecting line with butterfly */}
            <div className="relative z-10 flex flex-col items-center gap-2">
                <motion.span
                    style={{ fontSize: 36 }}
                    animate={{
                        rotateY: isLeft ? -20 : isRight ? 20 : 0,
                        scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                    🦋
                </motion.span>
            </div>

            {/* Right circle — shoulder */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: 72,
                    height: 72,
                    right: 24,
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
                animate={{
                    background: isRight
                        ? [color, `${color}CC`, color]
                        : "rgba(255,255,255,0.04)",
                    boxShadow: isRight
                        ? [`0 0 0px ${color}00`, `0 0 40px ${color}88`, `0 0 0px ${color}00`]
                        : "0 0 0px transparent",
                    scale: isRight ? [1, 1.12, 1] : 1,
                    borderColor: isRight ? color : "rgba(255,255,255,0.1)",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <div
                    className="w-full h-full rounded-full flex items-center justify-center"
                    style={{ border: `1.5px solid ${isRight ? color : "rgba(255,255,255,0.1)"}` }}
                >
                    <motion.span
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: 1.5,
                            color: isRight ? "#fff" : "rgba(255,255,255,0.3)",
                            textTransform: "uppercase",
                        }}
                        animate={{ opacity: isRight ? 1 : 0.4 }}
                    >
                        DIR
                    </motion.span>
                </div>
            </motion.div>

            {/* Connecting dashed line */}
            <svg
                className="absolute"
                style={{ width: "100%", height: "100%", top: 0, left: 0, pointerEvents: "none" }}
                viewBox="0 0 280 220"
            >
                <line
                    x1="96"
                    y1="110"
                    x2="184"
                    y2="110"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                />
            </svg>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const ButterflyDynamic = () => {
    const [screen, setScreen] = useState<Screen>("intention");
    const [feeling, setFeeling] = useState<Feeling>("ansiedade");

    // Stimulation state
    const [cycle, setCycle] = useState(0);
    const [activeSide, setActiveSide] = useState<"left" | "right" | "idle">("idle");

    // Pause state
    const [pauseCountdown, setPauseCountdown] = useState(30);

    // Timing
    const startTimeRef = useRef(Date.now());
    const [duration, setDuration] = useState(0);
    const intervalRef = useRef<number>();

    // Current feeling config
    const feelConfig = FEELINGS.find((f) => f.id === feeling)!;

    // ─── Stimulation Timer ────────────────────────────

    useEffect(() => {
        if (screen !== "stimulation") return;

        const tapsPerCycle = 12;
        let count = 0;

        intervalRef.current = window.setInterval(() => {
            count++;
            const side: "left" | "right" = count % 2 === 1 ? "left" : "right";
            setActiveSide(side);

            playBilateralTap(side);
            haptic("light");

            if (count >= tapsPerCycle) {
                setCycle((prev) => {
                    const next = prev + 1;
                    if (next >= CYCLE_COUNT) {
                        clearInterval(intervalRef.current);
                        setActiveSide("idle");
                        setTimeout(() => setScreen("pause"), 600);
                        return prev;
                    }
                    count = 0;
                    return next;
                });
            }
        }, TAP_INTERVAL_MS);

        return () => clearInterval(intervalRef.current);
    }, [screen]);

    // ─── Pause Timer ──────────────────────────────────

    useEffect(() => {
        if (screen !== "pause") return;

        playTherapeutic(FREQUENCIES.grounding, 30, 0.04);
        setPauseCountdown(30);

        const iv = window.setInterval(() => {
            setPauseCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(iv);
                    setDuration(Math.round((Date.now() - startTimeRef.current) / 1000));
                    setScreen("conclusion");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(iv);
    }, [screen]);

    useEffect(() => {
        if (screen === "conclusion") {
            chimeCompletion();
            haptic("success");
        }
    }, [screen]);

    // ─── Handlers ─────────────────────────────────────

    const handleSelectFeeling = (f: Feeling) => {
        setFeeling(f);
        clickSoft();
        haptic("selection");
        setScreen("position");
    };

    const handleStartStimulation = () => {
        startTimeRef.current = Date.now();
        setCycle(0);
        setActiveSide("idle");
        setScreen("stimulation");
    };

    const handleRestart = () => {
        setScreen("intention");
        setCycle(0);
        setDuration(0);
        setActiveSide("idle");
    };

    const currentPhrase = SUPPORT_PHRASES[feeling]?.[cycle] || "";

    // ═══ SCREEN 1 — INTENTION ═══

    if (screen === "intention") {
        return (
            <DynamicShell background="#0A0A12" showClose screenKey="intention" isDark>
                <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
                    {/* Butterfly icon */}
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{ fontSize: 40 }}
                    >
                        🦋
                    </motion.span>

                    {/* Title */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: 24,
                            color: "rgba(255,255,255,0.9)",
                            textAlign: "center",
                            lineHeight: 1.5,
                        }}
                    >
                        O que você está sentindo?
                    </motion.p>

                    {/* Feeling cards */}
                    <div className="w-full max-w-sm flex flex-col gap-3">
                        {FEELINGS.map((f, i) => (
                            <motion.button
                                key={f.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                                onClick={() => handleSelectFeeling(f.id)}
                                className="flex items-center gap-4 px-5 py-4 rounded-2xl text-left w-full"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                }}
                                whileHover={{
                                    background: "rgba(255,255,255,0.06)",
                                    borderColor: `${f.color}44`,
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${f.color}18` }}
                                >
                                    <span style={{ fontSize: 20 }}>{f.emoji}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontSize: 16,
                                            fontWeight: 600,
                                            color: f.color,
                                        }}
                                    >
                                        {f.label}
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontSize: 13,
                                            color: "rgba(255,255,255,0.4)",
                                        }}
                                    >
                                        {f.sublabel}
                                    </p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </DynamicShell>
        );
    }

    // ═══ SCREEN 2 — POSITION (redesigned with clear steps) ═══

    if (screen === "position") {
        return (
            <DynamicShell
                background="#0A0A12"
                currentStep={0}
                totalSteps={4}
                showClose
                screenKey="position"
                isDark
            >
                <div className="flex-1 flex flex-col items-center justify-between px-6 py-4">
                    {/* Top: what this is */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="flex items-center gap-2"
                    >
                        <span style={{ fontSize: 18 }}>🦋</span>
                        <p
                            style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: 13,
                                color: "rgba(255,255,255,0.35)",
                                letterSpacing: 2,
                                textTransform: "uppercase",
                            }}
                        >
                            Abraço da Borboleta
                        </p>
                    </motion.div>

                    {/* Center: visual instruction */}
                    <div className="flex flex-col items-center gap-6">
                        {/* Animated silhouette */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                        >
                            <HandsAnimation color={feelConfig.color} />
                        </motion.div>
                    </div>

                    {/* Bottom: stepped instructions + CTA */}
                    <div className="w-full max-w-sm flex flex-col items-center gap-6">
                        {/* Step-by-step instructions */}
                        <div className="flex flex-col gap-3 w-full">
                            {[
                                { num: 1, text: "Cruze os braços sobre o peito" },
                                { num: 2, text: "Cada mão toca o ombro oposto" },
                                { num: 3, text: "Toque alternando: esquerdo, direito..." },
                            ].map((step, i) => (
                                <motion.div
                                    key={step.num}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.2 + i * 0.3, duration: 0.6 }}
                                    className="flex items-center gap-3"
                                >
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{
                                            background: `${feelConfig.color}22`,
                                            border: `1px solid ${feelConfig.color}44`,
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: "'DM Mono', monospace",
                                                fontSize: 11,
                                                color: feelConfig.color,
                                            }}
                                        >
                                            {step.num}
                                        </span>
                                    </div>
                                    <p
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontSize: 15,
                                            color: "rgba(255,255,255,0.65)",
                                        }}
                                    >
                                        {step.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA */}
                        <motion.button
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.4, duration: 0.8 }}
                            onClick={handleStartStimulation}
                            className="w-full py-4 rounded-2xl"
                            style={{
                                background: feelConfig.gradient,
                                color: "#fff",
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: 16,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                boxShadow: `0 4px 24px ${feelConfig.color}33`,
                            }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Estou na posição
                        </motion.button>
                    </div>
                </div>
            </DynamicShell>
        );
    }

    // ═══ SCREEN 3 — STIMULATION ═══

    if (screen === "stimulation") {
        return (
            <DynamicShell
                background="#08060C"
                currentStep={cycle}
                totalSteps={CYCLE_COUNT}
                showClose
                screenKey="stimulation"
                isDark
            >
                <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                    {/* Cycle counter */}
                    <p
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 12,
                            color: "rgba(255,255,255,0.3)",
                            letterSpacing: 2.5,
                            textTransform: "uppercase",
                        }}
                    >
                        Ciclo {cycle + 1} de {CYCLE_COUNT}
                    </p>

                    {/* Visual */}
                    <StimulationVisual activeSide={activeSide} color={feelConfig.color} />

                    {/* Support phrase */}
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={cycle}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{
                                fontFamily: "'DM Serif Display', serif",
                                fontStyle: "italic",
                                fontSize: 18,
                                color: "rgba(255,255,255,0.6)",
                                textAlign: "center",
                                maxWidth: 280,
                                lineHeight: 1.6,
                            }}
                        >
                            {currentPhrase}
                        </motion.p>
                    </AnimatePresence>

                    {/* Progress dots */}
                    <div className="flex gap-2 mt-4">
                        {Array.from({ length: CYCLE_COUNT }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="rounded-full"
                                animate={{
                                    background: i < cycle ? feelConfig.color : i === cycle ? feelConfig.color : "rgba(255,255,255,0.1)",
                                    scale: i === cycle ? 1.3 : 1,
                                    opacity: i <= cycle ? 1 : 0.4,
                                }}
                                transition={{ duration: 0.3 }}
                                style={{ width: 6, height: 6 }}
                            />
                        ))}
                    </div>
                </div>
            </DynamicShell>
        );
    }

    // ═══ SCREEN 4 — SOMATIC PAUSE ═══

    if (screen === "pause") {
        return (
            <DynamicShell
                background="#0C0A14"
                currentStep={2}
                totalSteps={4}
                showClose
                screenKey="pause"
                isDark
            >
                <div className="flex-1 flex flex-col items-center justify-center gap-10 px-6">
                    {/* Breathing ring */}
                    <div className="relative" style={{ width: 160, height: 160 }}>
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ border: `1px solid ${feelConfig.color}22` }}
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute rounded-full"
                            style={{
                                width: 100,
                                height: 100,
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                border: `1px solid ${feelConfig.color}33`,
                            }}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                        />
                        <motion.div
                            className="absolute rounded-full"
                            style={{
                                width: 40,
                                height: 40,
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                background: `radial-gradient(circle, ${feelConfig.color}33, transparent)`,
                            }}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Instruction */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-center"
                    >
                        <p
                            style={{
                                fontFamily: "'DM Serif Display', serif",
                                fontSize: 22,
                                color: "rgba(255,255,255,0.8)",
                                lineHeight: 1.6,
                            }}
                        >
                            Feche os olhos.
                        </p>
                        <p
                            style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: 15,
                                color: "rgba(255,255,255,0.4)",
                                marginTop: 8,
                            }}
                        >
                            Ouça o que seu corpo diz agora.
                        </p>
                    </motion.div>

                    {/* Timer */}
                    <p
                        style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 14,
                            color: "rgba(255,255,255,0.2)",
                        }}
                    >
                        {pauseCountdown}s
                    </p>
                </div>
            </DynamicShell>
        );
    }

    // ═══ SCREEN 5 — CONCLUSION ═══

    if (screen === "conclusion") {
        const min = Math.floor(duration / 60);
        const sec = duration % 60;

        return (
            <DynamicShell background="#F5F0E8" showClose screenKey="conclusion" isDark={false}>
                <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
                    {/* Mandala */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative"
                        style={{ width: 140, height: 140 }}
                    >
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ border: `1.5px solid ${feelConfig.color}33` }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        />
                        <div
                            className="absolute rounded-full"
                            style={{
                                width: 90,
                                height: 90,
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                border: `1.5px solid ${feelConfig.color}55`,
                            }}
                        />
                        <div
                            className="absolute rounded-full"
                            style={{
                                width: 44,
                                height: 44,
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                background: feelConfig.gradient,
                            }}
                        />
                        <motion.span
                            className="absolute"
                            style={{
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                fontSize: 22,
                            }}
                        >
                            🦋
                        </motion.span>
                    </motion.div>

                    <div className="text-center">
                        <p
                            style={{
                                fontFamily: "'DM Serif Display', serif",
                                fontSize: 22,
                                color: "#1A1520",
                                lineHeight: 1.5,
                            }}
                        >
                            {CYCLE_COUNT} ciclos completos.
                        </p>
                        <p
                            style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: 16,
                                color: "#6A5A55",
                                marginTop: 4,
                            }}
                        >
                            Sente a diferença?
                        </p>
                    </div>

                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#9A8A85" }}>
                        {min}:{sec.toString().padStart(2, "0")}
                    </p>

                    <button
                        onClick={() => setScreen("post")}
                        className="mt-2 px-10 py-3.5 rounded-2xl"
                        style={{
                            background: "#1A1520",
                            color: "#F2EDE4",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 16,
                            fontWeight: 600,
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Continuar
                    </button>
                </div>
            </DynamicShell>
        );
    }

    // ═══ POST-DYNAMIC ═══

    return (
        <DynamicShell background="#F5F0E8" showClose={false} screenKey="post" isDark={false}>
            <PostDynamicScreen dynamicId="butterfly" durationSeconds={duration} onRestart={handleRestart} />
        </DynamicShell>
    );
};

export default ButterflyDynamic;
