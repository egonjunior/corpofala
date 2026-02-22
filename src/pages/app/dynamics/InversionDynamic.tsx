import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DynamicShell from "@/components/dynamics/DynamicShell";
import PostDynamicScreen from "@/components/dynamics/PostDynamicScreen";
import { haptic } from "@/lib/haptics";
import {
  startWritingTone,
  playTransmutationSound,
  playConfirmationChord,
} from "@/lib/inversionAudio";

type Act = "recognition" | "critic" | "origin" | "mirror" | "transmutation" | "letter" | "post";

interface OriginOption {
  id: string;
  label: string;
  sublabel: string;
}

const ORIGIN_OPTIONS: OriginOption[] = [
  { id: "parent", label: "Sim — de alguém da família", sublabel: "pai, mãe, avô, tio..." },
  { id: "relationship", label: "Sim — de um relacionamento", sublabel: "parceiro, ex, amigo..." },
  { id: "other", label: "Sim — de outra pessoa", sublabel: "professor, colega, chefe..." },
  { id: "unknown", label: "Não sei de onde vem", sublabel: "e tudo bem não saber" },
];

const ORIGIN_RESPONSES: Record<string, string> = {
  parent: "Essa voz foi dada muito cedo.\nQuando você precisava deles mais que de qualquer coisa.\nVocê não escolheu acreditar nela — você sobreviveu acreditando.",
  relationship: "Alguém que deveria cuidar de você\nusou palavras que deixaram marca.\nIsso diz tudo sobre eles. Nada sobre você.",
  other: "Alguém com autoridade sobre você\nplantou uma semente que não era sua.\nVocê pode devolvê-la agora.",
  unknown: "Não saber a origem não muda o que você pode fazer:\nreconhecer que essa voz não é você.\nÉ algo que aconteceu com você.",
};

const CLOSING_LINES: Record<string, string> = {
  parent: "Essa voz veio de antes de você ser quem é.\nVocê não precisa mais carregá-la.",
  relationship: "O que alguém fez a você não diz quem você é.\nDiz o que eles carregavam.",
  other: "Devolvemos essa voz para onde ela pertence.\nO espaço é seu agora.",
  unknown: "De onde quer que tenha vindo,\nvocê tem o direito de não acreditar mais nela.",
};

const CRITIC_SUGGESTIONS = [
  "Não sou suficiente",
  "Sempre estrago tudo",
  "Não mereço",
  "Sou um fracasso",
  "Ninguém me quer de verdade",
];

const COMPASSION_SUGGESTIONS = [
  "Você está tentando, e isso é real.",
  "Você não é esse pensamento.",
  "Errar não te define — te ensina.",
  "Você merece o mesmo que daria a mim.",
  "Eu te amaria do mesmo jeito.",
  "Isso não é verdade. Eu sei quem você é.",
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const BACKGROUNDS: Record<string, string> = {
  recognition: "#08060C",
  critic: "#08060C",
  origin: "#0C0A12",
  mirror: "#0F0C16",
  transmutation: "#130F1A",
  letter: "#F5EDE4",
  post: "#F5EDE4",
};

// ─── Sentiment label for critic ──────────────────────
const detectCriticLabel = (text: string): string => {
  const lower = text.toLowerCase();
  const patterns: { keywords: string[]; label: string }[] = [
    { keywords: ["fracasso", "falha", "errei", "estrago"], label: "autocrítica de performance" },
    { keywords: ["não mereço", "não sou digno", "não sirvo", "indigno"], label: "indignidade" },
    { keywords: ["burro", "idiota", "inútil", "incapaz"], label: "desqualificação" },
    { keywords: ["sozinho", "ninguém", "abandonado", "rejeição"], label: "medo do abandono" },
    { keywords: ["culpa", "culpado", "minha culpa"], label: "culpabilização" },
    { keywords: ["nunca", "sempre", "todo mundo menos eu"], label: "generalização dolorosa" },
  ];
  for (const p of patterns) {
    if (p.keywords.some((k) => lower.includes(k))) return p.label;
  }
  return "pensamento crítico";
};

// ─── Morph by words ──────────────────────────────────
const morphByWords = (from: string, to: string, progress: number): string => {
  const fromWords = from.split(" ");
  const toWords = to.split(" ");
  const maxWords = Math.max(fromWords.length, toWords.length);
  const glyphs = "░▒▓█▪▫▬▭▮";
  return Array.from({ length: maxWords })
    .map((_, i) => {
      const fromWord = fromWords[i] || "";
      const toWord = toWords[i] || "";
      const wordThreshold = i / maxWords;
      if (progress > wordThreshold + 0.12) return toWord;
      if (progress > wordThreshold) {
        return Array.from(toWord || fromWord)
          .map((char) => {
            const charP = (progress - wordThreshold) / 0.12;
            if (Math.random() < charP) return char;
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join("");
      }
      return fromWord;
    })
    .join(" ");
};

// ─── Format date ─────────────────────────────────────
const formatDatePt = (date: Date): string => {
  const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
};

// ═══════════════════════════════════════════════════════
const InversionDynamic = () => {
  const [act, setAct] = useState<Act>("recognition");
  const [criticText, setCriticText] = useState("");
  const [originId, setOriginId] = useState("");
  const [compassionText, setCompassionText] = useState("");
  const startTime = useRef(Date.now());
  const [duration, setDuration] = useState(0);

  // Critic screen state (hoisted to prevent remount)
  const [criticShowSuggestions, setCriticShowSuggestions] = useState(false);
  const criticStopToneRef = useRef<(() => void) | null>(null);
  const criticIdleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mirror screen state (hoisted to prevent remount)
  const [mirrorShowSuggestions, setMirrorShowSuggestions] = useState(false);
  const mirrorStopToneRef = useRef<(() => void) | null>(null);
  const mirrorIdleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const bg = BACKGROUNDS[act] || "#08060C";
  const isDark = act !== "letter" && act !== "post";

  // ═══ ACT 1 — RECOGNITION ═══
  const RecognitionScreen = () => {
    const [visibleLines, setVisibleLines] = useState<number[]>([]);
    const [canTap, setCanTap] = useState(false);

    const lines = [
      { text: "Existe uma voz dentro de você", delay: 0, size: 18, font: "serif", opacity: 0.85 },
      { text: "que fala muito sobre quem você é.", delay: 2800, size: 18, font: "serif", opacity: 0.85 },
      { text: "E ela raramente é gentil.", delay: 5500, size: 16, font: "serif", opacity: 0.60 },
      { text: "__BUTTON__", delay: 7800, size: 14, font: "button", opacity: 1 },
    ];

    useEffect(() => {
      const timers: NodeJS.Timeout[] = [];
      lines.forEach((line, i) => {
        timers.push(
          setTimeout(() => {
            setVisibleLines((prev) => [...prev, i]);
            if (i === lines.length - 1) setCanTap(true);
          }, line.delay)
        );
      });
      return () => timers.forEach(clearTimeout);
    }, []);

    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
        {lines.map((line, i) => {
          if (line.font === "button") {
            return (
              <AnimatePresence key={i}>
                {visibleLines.includes(i) && (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    onClick={() => canTap && setAct("critic")}
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
              transition={{ duration: 1.2 }}
              style={{
                fontFamily: line.font === "sans" ? "'DM Sans', sans-serif" : "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: line.size,
                color: "white",
                textAlign: "center",
                lineHeight: 1.5,
                letterSpacing: "0.01em",
              }}
            >
              {line.text}
            </motion.p>
          );
        })}
      </div>
    );
  };

  // ═══ ACT 2 — CRITIC VOICE (effects) ═══
  useEffect(() => {
    if (act !== "critic") return;
    criticIdleTimerRef.current = setTimeout(() => setCriticShowSuggestions(true), 8000);
    return () => {
      criticStopToneRef.current?.();
      criticStopToneRef.current = null;
      if (criticIdleTimerRef.current) clearTimeout(criticIdleTimerRef.current);
    };
  }, [act]);

  const handleCriticChange = useCallback((val: string) => {
    setCriticText(val.slice(0, 300));
    setCriticShowSuggestions(false);
    if (criticIdleTimerRef.current) clearTimeout(criticIdleTimerRef.current);
    criticIdleTimerRef.current = setTimeout(() => setCriticShowSuggestions(true), 8000);
    if (val.length > 0 && !criticStopToneRef.current) {
      criticStopToneRef.current = startWritingTone("critical");
    }
    if (val.length === 0) {
      criticStopToneRef.current?.();
      criticStopToneRef.current = null;
    }
  }, []);

  const criticSentimentLabel = criticText.length > 5 ? detectCriticLabel(criticText) : "";

  const renderCriticScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 overflow-y-auto">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: 18, color: "rgba(255,255,255,0.85)", textAlign: "center" }}
      >
        O que ela diz que você é?
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 0.4 }}
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.35)", textAlign: "center", marginBottom: 16 }}
      >
        Escreve. Aqui é seguro.
      </motion.p>

      {/* Writing surface — refined */}
      <div
        className="w-full max-w-md relative rounded-lg"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: 24,
        }}
      >
        <textarea
          value={criticText}
          onChange={(e) => handleCriticChange(e.target.value)}
          placeholder="Eu não sou bom o suficiente..."
          rows={6}
          autoFocus
          className="w-full resize-none outline-none"
          style={{
            background: "transparent",
            border: "none",
            fontFamily: "'DM Serif Display', serif",
            fontSize: 16,
            fontStyle: "italic",
            color: "rgba(200, 195, 210, 0.80)",
            lineHeight: "28px",
            caretColor: "rgba(200, 195, 210, 0.5)",
          }}
        />

        {criticSentimentLabel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mt-2"
          >
            <div className="rounded-full" style={{ width: 5, height: 5, background: "rgba(200, 180, 170, 0.5)" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(200, 195, 210, 0.40)", letterSpacing: "0.03em" }}>
              {criticSentimentLabel}
            </span>
          </motion.div>
        )}
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {criticShowSuggestions && criticText.length < 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 mt-2">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
              Ou escolhe uma que ressoa:
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-sm">
              {CRITIC_SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => { setCriticText(s); setCriticShowSuggestions(false); }}
                  className="rounded-full px-4 py-2 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 13,
                    fontStyle: "italic",
                    color: "rgba(200, 195, 210, 0.55)",
                    cursor: "pointer",
                  }}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue */}
      <AnimatePresence>
        {criticText.length > 8 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={() => { criticStopToneRef.current?.(); criticStopToneRef.current = null; setAct("origin"); }}
            className="mt-4 px-8 py-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(200, 195, 210, 0.80)", fontFamily: "'DM Sans', sans-serif", fontSize: 16, cursor: "pointer" }}
          >
            Continuar →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );

  // ═══ ACT 3 — THE ORIGIN ═══
  const OriginScreen = () => {
    const [visibleLines, setVisibleLines] = useState<number[]>([]);
    const [showOptions, setShowOptions] = useState(false);
    const [selected, setSelected] = useState("");
    const [showContinue, setShowContinue] = useState(false);

    const lines = [
      { text: "Esta voz que escreve isso sobre você...", delay: 0 },
      { text: "ela lembra a voz de alguém?", delay: 2500 },
      { text: "Não precisa responder agora.\nSó... repara.", delay: 5000, font: "sans" },
    ];

    useEffect(() => {
      const timers: NodeJS.Timeout[] = [];
      lines.forEach((line, i) => {
        timers.push(setTimeout(() => setVisibleLines((prev) => [...prev, i]), line.delay));
      });
      timers.push(setTimeout(() => setShowOptions(true), 6000));
      return () => timers.forEach(clearTimeout);
    }, []);

    const handleSelect = (id: string) => {
      setSelected(id);
      setOriginId(id);
      setTimeout(() => setShowContinue(true), 3000);
    };

    return (
      <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-8 overflow-y-auto gap-4">
        {/* Critic text fading */}
        <p style={{ fontFamily: "'DM Mono', monospace", fontStyle: "italic", fontSize: 14, color: "rgba(200, 195, 210, 0.35)", textAlign: "center", lineHeight: 1.6 }}>
          "{criticText}"
        </p>

        <div className="h-4" />

        {/* Sequential text */}
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: visibleLines.includes(i) ? (line.font === "sans" ? 0.45 : 0.80) : 0 }}
            transition={{ duration: 1.2 }}
            style={{
              fontFamily: line.font === "sans" ? "'DM Sans', sans-serif" : "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: line.font === "sans" ? 14 : 17,
              color: "rgba(255,255,255,0.80)",
              textAlign: "center",
              lineHeight: 1.5,
              whiteSpace: "pre-line",
            }}
          >
            {line.text}
          </motion.p>
        ))}

        {/* Options */}
        <AnimatePresence>
          {showOptions && !selected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3 w-full max-w-sm mt-4">
              {ORIGIN_OPTIONS.map((opt, i) => (
                <motion.button
                  key={opt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  onClick={() => handleSelect(opt.id)}
                  className="w-full text-left rounded-xl p-4 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.80)", display: "block", marginBottom: 4 }}>
                    {opt.label}
                  </span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                    {opt.sublabel}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Origin response */}
        {selected && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.80 }}
            transition={{ duration: 1 }}
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: 15,
              color: "rgba(255,220,180,0.80)",
              textAlign: "center",
              lineHeight: 1.7,
              whiteSpace: "pre-line",
              marginTop: 16,
              maxWidth: 400,
            }}
          >
            {ORIGIN_RESPONSES[selected]}
          </motion.p>
        )}

        {showContinue && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setAct("mirror")}
            className="mt-4 px-8 py-3 rounded-xl"
            style={{ background: "rgba(255,220,180,0.12)", border: "1px solid rgba(255,220,180,0.3)", color: "rgba(255,220,180,0.8)", fontFamily: "'DM Sans', sans-serif", fontSize: 16, cursor: "pointer" }}
          >
            Continuar →
          </motion.button>
        )}
      </div>
    );
  };

  // ═══ ACT 4 — MIRROR (effects) ═══
  useEffect(() => {
    if (act !== "mirror") return;
    mirrorIdleTimerRef.current = setTimeout(() => setMirrorShowSuggestions(true), 15000);
    mirrorStopToneRef.current = startWritingTone("compassionate");
    return () => {
      mirrorStopToneRef.current?.();
      mirrorStopToneRef.current = null;
      if (mirrorIdleTimerRef.current) clearTimeout(mirrorIdleTimerRef.current);
    };
  }, [act]);

  const handleCompassionChange = useCallback((val: string) => {
    setCompassionText(val.slice(0, 400));
    setMirrorShowSuggestions(false);
    if (mirrorIdleTimerRef.current) clearTimeout(mirrorIdleTimerRef.current);
    mirrorIdleTimerRef.current = setTimeout(() => setMirrorShowSuggestions(true), 15000);
  }, []);

  const randomSuggestions = useMemo(
    () => [...COMPASSION_SUGGESTIONS].sort(() => Math.random() - 0.5).slice(0, 3),
    []
  );

  const renderMirrorScreen = () => (
    <div className="flex-1 flex flex-col items-center px-6 pt-6 pb-8 overflow-y-auto gap-4">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.80 }} style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: 17, color: "rgba(255,255,255,0.80)", textAlign: "center", lineHeight: 1.5 }}>
        Se a pessoa que você mais ama dissesse isso sobre si mesma —
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.90 }} transition={{ delay: 0.3 }} style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: 17, color: "rgba(255,220,180,0.90)", textAlign: "center" }}>
        o que você diria a ela?
      </motion.p>

      <div className="flex flex-col w-full max-w-lg mt-4 gap-0">
        {/* Critic side */}
        <div className="py-4">
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200, 195, 210, 0.35)" }}>
            ELA DISSE
          </span>
          <p className="mt-3" style={{ fontFamily: "'DM Mono', monospace", fontStyle: "italic", fontSize: 14, color: "rgba(200, 195, 210, 0.35)", lineHeight: 1.7, filter: "blur(0.3px)" }}>
            "{criticText}"
          </p>
        </div>

        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.20)" }}>→</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Compassion side */}
        <div className="py-4">
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,220,180,0.50)" }}>
            VOCÊ DIRIA
          </span>
          <textarea
            value={compassionText}
            onChange={(e) => handleCompassionChange(e.target.value)}
            placeholder="Eu diria que..."
            rows={5}
            autoFocus
            className="w-full mt-3 resize-none outline-none"
            style={{
              background: "transparent",
              border: "none",
              borderBottom: `1px solid ${compassionText ? "rgba(255,220,180,0.40)" : "rgba(255,220,180,0.20)"}`,
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: 16,
              color: "rgba(255,220,180,0.90)",
              lineHeight: 1.7,
              caretColor: "rgba(255,220,180,0.6)",
              paddingBottom: 8,
              transition: "border-color 0.3s ease",
            }}
          />
        </div>
      </div>

      <AnimatePresence>
        {mirrorShowSuggestions && compassionText.length < 5 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 mt-2">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,220,180,0.30)" }}>
              Ou escolhe uma que ressoa:
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-sm">
              {randomSuggestions.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => { setCompassionText(s); setMirrorShowSuggestions(false); }}
                  className="rounded-full px-4 py-2 transition-all"
                  style={{ background: "rgba(255,220,180,0.08)", border: "1px solid rgba(255,220,180,0.2)", fontFamily: "'DM Serif Display', serif", fontSize: 13, fontStyle: "italic", color: "rgba(255,220,180,0.6)", cursor: "pointer" }}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {compassionText.length > 10 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={() => { mirrorStopToneRef.current?.(); mirrorStopToneRef.current = null; setAct("transmutation"); }}
            className="mt-4 px-8 py-3 rounded-xl"
            style={{ background: "rgba(255,220,180,0.15)", border: "1px solid rgba(255,220,180,0.4)", color: "rgba(255,220,180,0.9)", fontFamily: "'DM Sans', sans-serif", fontSize: 16, cursor: "pointer" }}
          >
            Ver a transformação →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );

  // ═══ ACT 5 — THE TRANSMUTATION ═══
  const TransmutationScreen = () => {
    const [morphProgress, setMorphProgress] = useState(0);
    const [displayText, setDisplayText] = useState(criticText);
    const [displayColor, setDisplayColor] = useState("rgba(200, 195, 210, 0.75)");
    const [phase, setPhase] = useState<"morphing" | "pause" | "voice" | "transition">("morphing");
    const [bgColor, setBgColor] = useState("#130F1A");
    const morphDuration = 8000;

    useEffect(() => {
      playTransmutationSound();

      const startTime = Date.now();
      let raf: number;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / morphDuration, 1);
        setMorphProgress(progress);

        // Color interpolation: muted lavender → golden
        const r = Math.round(200 + (255 - 200) * progress);
        const g = Math.round(195 + (220 - 195) * progress);
        const b = Math.round(210 + (180 - 210) * progress);
        const a = (0.75 + (0.90 - 0.75) * progress).toFixed(2);
        setDisplayColor(`rgba(${r},${g},${b},${a})`);

        // Morph text
        setDisplayText(morphByWords(criticText, compassionText, progress));

        if (progress < 1) {
          raf = requestAnimationFrame(animate);
        } else {
          setDisplayText(compassionText);
          setPhase("pause");
          // 2s pause, then voice
          setTimeout(() => setPhase("voice"), 2000);
          // Background warming
          setTimeout(() => {
            setBgColor("#1C1420");
            setTimeout(() => {
              setBgColor("#F5EDE4");
              setTimeout(() => setAct("letter"), 2000);
            }, 1500);
          }, 3000);
        }
      };

      raf = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(raf);
    }, []);

    return (
      <DynamicShell background={bgColor} showClose={false} screenKey="transmutation" isDark={phase !== "transition"}>
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8">
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: phase === "morphing" ? "rgba(255,255,255,0.30)" : "rgba(255,220,180,0.40)" }}>
            TRANSFORMANDO
          </span>

          <p style={{
            fontFamily: "'DM Serif Display', serif",
            fontStyle: "italic",
            fontSize: 18,
            color: displayColor,
            textAlign: "center",
            lineHeight: 1.7,
            letterSpacing: "0.01em",
            minHeight: 120,
            whiteSpace: "pre-wrap",
            transition: "color 0.1s ease",
            maxWidth: 480,
          }}>
            {displayText}
          </p>

          {/* Progress bar */}
          <div className="w-full max-w-md h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${morphProgress * 100}%`,
                background: "linear-gradient(to right, rgba(200, 195, 210, 0.5), rgba(255,220,180,0.8))",
                transition: "width 0.1s linear",
              }}
            />
          </div>

          {phase === "voice" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1 }}
              style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: 15, color: "rgba(255,220,180,0.80)", textAlign: "center", marginTop: 16 }}
            >
              Guarda isso. É sua voz real.
            </motion.p>
          )}
        </div>
      </DynamicShell>
    );
  };

  // ═══ ACT 6 — THE LETTER ═══
  const LetterScreen = () => {
    const [saved, setSaved] = useState(false);
    const [checkIn, setCheckIn] = useState<string | null>(null);
    const closingLine = CLOSING_LINES[originId] || CLOSING_LINES.unknown;
    const dateStr = formatDatePt(new Date());
    const letterRef = useRef<HTMLDivElement>(null);

    const handleSave = () => {
      playConfirmationChord();
      haptic("medium");

      // Save letter to localStorage
      try {
        const letters = JSON.parse(localStorage.getItem("inversionLetters") || "[]");
        letters.push({
          date: new Date().toISOString(),
          criticText,
          compassionText,
          closingLine,
          sentiment: detectCriticLabel(criticText),
          origin: originId,
        });
        localStorage.setItem("inversionLetters", JSON.stringify(letters));
      } catch { }
      setSaved(true);
    };

    const handleCheckIn = (value: string) => {
      setCheckIn(value);
      setDuration(Math.round((Date.now() - startTime.current) / 1000));
      setTimeout(() => setAct("post"), value === "heavy" ? 4000 : 1500);
    };

    return (
      <div className="flex-1 flex flex-col items-center px-5 pt-6 pb-10 overflow-y-auto">
        {/* Letter card */}
        <motion.div
          ref={letterRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg rounded relative"
          style={{
            background: "#FDFAF5",
            boxShadow: "0 4px 40px rgba(26,21,32,0.12), 0 1px 4px rgba(26,21,32,0.08)",
            padding: "48px 32px",
            backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(26,21,32,0.02) 27px, rgba(26,21,32,0.02) 28px)",
          }}
        >
          {/* Date */}
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#B0A090", display: "block", textAlign: "right", marginBottom: 32 }}>
            {dateStr}
          </span>

          {/* Opening */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: 16, color: "#2A2035", marginBottom: 24 }}>
            Para mim,
          </motion.p>

          {/* Critic quote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            style={{ fontFamily: "'DM Mono', monospace", fontStyle: "italic", fontSize: 13, color: "#8A7A70", borderLeft: "2px solid rgba(196,98,45,0.30)", paddingLeft: 16, margin: "24px 0", lineHeight: 1.6 }}
          >
            "{criticText}"
          </motion.p>

          {/* Compassion body */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: 17, color: "#1A1520", lineHeight: 1.8, marginBottom: 20 }}
          >
            {compassionText}
          </motion.p>

          {/* Closing line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", fontSize: 15, color: "#6A5A55", lineHeight: 1.7, marginBottom: 32, whiteSpace: "pre-line" }}
          >
            {closingLine}
          </motion.p>

          {/* Signature */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.8 }} style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: 18, color: "#C4622D", marginBottom: 12 }}>
            Com amor,
          </motion.p>
          <motion.div initial={{ width: 0 }} animate={{ width: 120 }} transition={{ delay: 4.2, duration: 0.6 }} style={{ height: 1, background: "rgba(196,98,45,0.30)", marginBottom: 12 }} />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.6 }} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6A5A55" }}>
            Você
          </motion.p>

          {/* Seal */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 5 }} className="flex justify-center mt-8">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="#C4622D" strokeWidth="1.5" opacity="0.5" />
              <circle cx="16" cy="16" r="9" stroke="#C4622D" strokeWidth="1" opacity="0.3" />
              <path d="M16 10 L17.5 14 L22 14.5 L18.5 17.5 L19.5 22 L16 19.5 L12.5 22 L13.5 17.5 L10 14.5 L14.5 14 Z" fill="#C4622D" opacity="0.4" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 mt-8 w-full max-w-sm">
          {!saved ? (
            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-lg"
              style={{ background: "#C4622D", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer", border: "none" }}
            >
              Guardar esta carta
            </button>
          ) : !checkIn ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 w-full">
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#2A2035" }}>
                Como você está agora?
              </p>
              <div className="flex gap-3">
                {[
                  { label: "Mais leve", value: "lighter" },
                  { label: "Igual", value: "same" },
                  { label: "Ainda difícil", value: "heavy" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleCheckIn(opt.value)}
                    className="px-5 py-2.5 rounded-full"
                    style={{ background: "rgba(26,21,32,0.05)", border: "1px solid rgba(26,21,32,0.12)", color: "#2A2035", fontFamily: "'DM Sans', sans-serif", fontSize: 14, cursor: "pointer" }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : null}

          {checkIn === "heavy" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: 16, color: "#6A5A55", textAlign: "center", lineHeight: 1.7, marginTop: 8 }}
            >
              Isso é normal.
              <br />
              A voz de anos não muda em minutos.
              <br />
              Mas você plantou algo hoje.
              <br />
              Você pode reler esta carta quando precisar.
            </motion.p>
          )}
        </div>
      </div>
    );
  };

  // ═══ RENDER ═══
  if (act === "transmutation") return <TransmutationScreen />;

  if (act === "post") {
    return (
      <DynamicShell background="#F2EDE4" showClose={false} screenKey="post" isDark={false}>
        <PostDynamicScreen
          dynamicId="inversion"
          durationSeconds={duration}
          onRestart={() => {
            setAct("recognition");
            setCriticText("");
            setOriginId("");
            setCompassionText("");
            setDuration(0);
          }}
        />
      </DynamicShell>
    );
  }

  return (
    <DynamicShell background={bg} showClose screenKey={act} isDark={isDark}>
      {act === "recognition" && <RecognitionScreen />}
      {act === "critic" && renderCriticScreen()}
      {act === "origin" && <OriginScreen />}
      {act === "mirror" && renderMirrorScreen()}
      {act === "letter" && <LetterScreen />}
    </DynamicShell>
  );
};

export default InversionDynamic;

