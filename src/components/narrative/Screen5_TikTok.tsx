import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { PhoneStatusBar } from "./PhoneStatusBar";
import { useNarrativeAudio } from "@/contexts/NarrativeAudioContext";

interface Screen5Props {
  onNext: () => void;
}

/* ── Types ── */
type LineDelay = "short" | "long" | "verylong";
interface ReelLine {
  text: string;
  delay: LineDelay;
  isRupture?: boolean;
}
interface ReelComment {
  user: string;
  text: string;
  atLine: number; // appears when visibleLines reaches this
}
interface ReelData {
  lines: ReelLine[];
  caption: string;
  likes: string;
  comments: string;
  ruptureType: "pulse" | "freeze" | "flash";
  floatingComments: ReelComment[];
}
interface ReelComment {
  user: string;
  text: string;
  atLine: number; // appears when visibleLines reaches this
}
interface ReelData {
  lines: ReelLine[];
  caption: string;
  likes: string;
  comments: string;
  ruptureType: "pulse" | "freeze" | "flash";
  floatingComments: ReelComment[];
}

/* ── Highlight keywords ── */
const KEYWORDS = ["corpo", "somático", "somática", "estudos", "dinâmicas", "ebook", "mapa", "circuito", "padrão"];
const highlightKeywords = (text: string) => {
  const regex = new RegExp(`(${KEYWORDS.join("|")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    KEYWORDS.some((k) => k.toLowerCase() === part.toLowerCase()) ? (
      <span key={i} style={{ color: "#00BCD4" }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

/* ── Reel Data — 3 reels ── */
const REELS: ReelData[] = [
  {
    caption: "Seu corpo está falando. Você está ouvindo?",
    likes: "12,3 mil",
    comments: "1.247",
    ruptureType: "pulse",
    floatingComments: [
      { user: "mari.santos", text: "Isso explica tanta coisa", atLine: 6 },
      { user: "ana.psico", text: "Minha psicóloga ia amar", atLine: 13 },
    ],
    lines: [
      { text: "Aquela dor no peito antes de uma reunião.", delay: "short" },
      { text: "O nó no estômago quando você pensa naquela pessoa.", delay: "long" },
      { text: "A tensão no ombro que não vai embora.", delay: "short" },
      { text: "Você acha que é estresse.", delay: "long" },
      { text: "Mas não é.", delay: "verylong" },
      { text: "São mensagens.", delay: "long", isRupture: true },
      { text: "Seu corpo está tentando te dizer algo", delay: "short" },
      { text: "que sua mente se recusa a ouvir.", delay: "long" },
      { text: "200+ estudos de neurociência somática confirmam:", delay: "long" },
      { text: "cada emoção não processada fica armazenada no corpo.", delay: "long" },
      { text: "Peter Levine documentou.", delay: "short" },
      { text: "Bessel van der Kolk comprovou.", delay: "short" },
      { text: "Stephen Porges explicou o mecanismo.", delay: "long" },
      { text: "O sintoma nunca é o problema.", delay: "verylong", isRupture: true },
      { text: "É a resposta do corpo ao problema.", delay: "long" },
      { text: "E existe um mapa que mostra exatamente onde tudo está.", delay: "long" },
    ],
  },
  {
    caption: "Existe um mapa. E ele muda tudo.",
    likes: "8,7 mil",
    comments: "934",
    ruptureType: "freeze",
    floatingComments: [
      { user: "lucas_therapy", text: "Ebook interativo??? Como assim", atLine: 5 },
      { user: "carol.m", text: "Preciso disso urgente", atLine: 12 },
    ],
    lines: [
      { text: "Imagina ter um mapa do seu corpo.", delay: "short" },
      { text: "Que mostra onde você guarda raiva.", delay: "short" },
      { text: "Onde o medo se esconde. Onde a tristeza travou.", delay: "long" },
      { text: "Esse mapa existe.", delay: "long", isRupture: true },
      { text: "Eu passei 2 anos reunindo a ciência por trás dele.", delay: "long" },
      { text: "200+ estudos. Organizados. Traduzidos.", delay: "short" },
      { text: "Coloquei tudo num ebook interativo.", delay: "long" },
      { text: "Você responde. Ele se adapta.", delay: "short" },
      { text: "Te mostra exatamente onde seu corpo guarda o que você não processa.", delay: "long" },
      { text: "E quando a crise bate —", delay: "long" },
      { text: "você tem 5 dinâmicas somáticas que funcionam em minutos.", delay: "long" },
      { text: "Não em meses. Em minutos.", delay: "long", isRupture: true },
      { text: "Teoria Polivagal. Somática de Levine.", delay: "short" },
      { text: "Neurociência aplicada ao que você sente agora.", delay: "long" },
      { text: "Mas eu preciso que você entenda uma coisa", delay: "verylong" },
      { text: "antes de decidir se isso é pra você.", delay: "short" },
    ],
  },
  {
    caption: "O custo de não agir.",
    likes: "6,1 mil",
    comments: "723",
    ruptureType: "flash",
    floatingComments: [
      { user: "dr.renato.neuro", text: "Cada dia sem tratar é mais um circuito gravado", atLine: 6 },
      { user: "carol.m", text: "Link na bio!!", atLine: 14 },
    ],
    lines: [
      { text: "Cada dia que passa sem você entender esses padrões,", delay: "short" },
      { text: "o circuito se fortalece.", delay: "long" },
      { text: "A dor se repete. A ansiedade volta.", delay: "short" },
      { text: "O mesmo gatilho. A mesma reação.", delay: "long" },
      { text: "Não porque você é fraco.", delay: "verylong" },
      { text: "Mas porque ninguém te mostrou o mapa.", delay: "long", isRupture: true },
      { text: "Plataformas desse nível custam entre R$ 300 e R$ 800.", delay: "long" },
      { text: "Eu não quero cobrar isso.", delay: "long" },
      { text: "Porque eu sei o que é precisar e não ter acesso.", delay: "long" },
      { text: "CorpoFala te entrega tudo pronto.", delay: "short" },
      { text: "Ebook interativo. 5 dinâmicas validadas. Protocolo personalizado.", delay: "long" },
      { text: "Isso não substitui terapia.", delay: "verylong" },
      { text: "Mas te dá as ferramentas que a maioria não tem.", delay: "long" },
      { text: "Link na bio.", delay: "long" },
      { text: "Seu corpo já sabe. Agora você também pode.", delay: "long", isRupture: true },
    ],
  },
];

const DELAY_MS: Record<LineDelay, number> = { short: 800, long: 1800, verylong: 2800 };

/* ── Grain Overlay ── */
const GrainOverlay = () => (
  <svg className="fixed inset-0 w-full h-full pointer-events-none z-50" style={{ opacity: 0.03 }}>
    <filter id="grain5">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain5)" />
  </svg>
);

/* ── ECG Avatar SVG ── */
const ECGAvatar = ({ size = 86 }: { size?: number }) => (
  <div
    className="rounded-full flex items-center justify-center relative"
    style={{
      width: size,
      height: size,
      background: "linear-gradient(135deg, #005F73, #00BCD4)",
    }}
  >
    <svg viewBox="0 0 40 40" width={size * 0.42} height={size * 0.42}>
      <path
        d="M20 35 C10 25 2 18 2 12 C2 6 7 2 12 2 C15 2 18 4 20 7 C22 4 25 2 28 2 C33 2 38 6 38 12 C38 18 30 25 20 35Z"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        opacity="0.7"
      />
      <path
        d="M2 22 L10 22 L13 16 L16 28 L19 12 L22 26 L25 18 L28 22 L38 22"
        fill="none"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        style={{ strokeDasharray: 80, animation: "ecgDash 3s linear infinite" }}
      />
    </svg>
    <style>{`@keyframes ecgDash { 0% { stroke-dashoffset: 80; } 100% { stroke-dashoffset: -80; } }`}</style>
  </div>
);

/* ── Stories Ring ── */
const StoriesRing = ({ children, size = 92 }: { children: React.ReactNode; size?: number }) => (
  <div
    className="rounded-full flex items-center justify-center"
    style={{ width: size, height: size, background: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)", padding: 3 }}
  >
    <div className="rounded-full flex items-center justify-center" style={{ width: size - 6, height: size - 6, background: "#000", padding: 3 }}>
      {children}
    </div>
  </div>
);

/* ── HeartBurst (double-tap) ── */
const HeartBurst = ({ show, onDone }: { show: boolean; onDone: () => void }) => {
  if (!show) return null;
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      onAnimationComplete={onDone}
    >
      <motion.svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="white"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.4, times: [0, 0.6, 1] }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </motion.svg>
    </motion.div>
  );
};

/* ── iOS Follow Notification ── */
const IOSNotification = ({ show }: { show: boolean }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className="fixed left-3 right-3 z-[60] flex items-center gap-3"
        style={{
          top: 50,
          background: "rgba(30,30,30,0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 14,
          padding: "10px 14px",
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {/* IG icon */}
        <div
          className="flex-shrink-0 rounded-lg flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            background: "linear-gradient(135deg, #F58529, #DD2A7B, #8134AF)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", fontFamily: "-apple-system, sans-serif" }}>Instagram</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontFamily: "-apple-system, sans-serif" }}>
            corpofala.oficial começou a te seguir
          </p>
        </div>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>agora</span>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ── Floating Comments ── */
const FloatingComments = ({ comments, visibleLines }: { comments: ReelComment[]; visibleLines: number }) => {
  const visible = comments.filter((c) => visibleLines >= c.atLine);
  // Only show last 2
  const shown = visible.slice(-2);

  return (
    <div className="absolute z-20" style={{ bottom: 85, left: 16, right: 80 }}>
      <AnimatePresence>
        {shown.map((c) => (
          <motion.div
            key={c.user}
            className="flex items-center gap-2 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="rounded-full flex-shrink-0"
              style={{
                width: 20,
                height: 20,
                background: `linear-gradient(135deg, hsl(${c.user.length * 40}, 60%, 45%), hsl(${c.user.length * 40 + 60}, 50%, 55%))`,
              }}
            />
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
              <span style={{ fontWeight: 600 }}>@{c.user}</span>{" "}
              {c.text}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ── Instagram Profile ── */
const ProfileView = ({ isPostReels, onTapReel, onBioLink }: { isPostReels: boolean; onTapReel: () => void; onBioLink: () => void }) => {
  const [showHint, setShowHint] = useState(false);
  const [bioExpanding, setBioExpanding] = useState(false);

  useEffect(() => {
    if (!isPostReels) {
      const t = setTimeout(() => setShowHint(true), 3000);
      return () => clearTimeout(t);
    }
  }, [isPostReels]);

  const handleBioClick = () => {
    setBioExpanding(true);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto" style={{ background: "#000" }}>
      <PhoneStatusBar />

      {/* IG Header */}
      <div className="flex items-center justify-between px-4" style={{ height: 44 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontFamily: "-apple-system, 'SF Pro Display', sans-serif", fontSize: 16, fontWeight: 600, color: "#fff" }}>
          corpofala.oficial
        </span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </div>

      {/* Profile section */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-5 mb-4">
          <StoriesRing size={92}>
            <ECGAvatar size={80} />
          </StoriesRing>
          <div className="flex-1 flex justify-around">
            {[
              { num: "3", label: "publicações" },
              { num: "4,7 mil", label: "seguidores" },
              { num: "1", label: "seguindo" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p style={{ fontFamily: "-apple-system, sans-serif", fontSize: 17, fontWeight: 600, color: "#fff" }}>{s.num}</p>
                <p style={{ fontSize: 12, color: "#8E8E8E" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Name & Bio */}
        <p style={{ fontFamily: "-apple-system, sans-serif", fontSize: 14, fontWeight: 600, color: "#fff" }}>CORPO</p>
        <p style={{ fontSize: 14, color: "#fff", lineHeight: 1.5, marginTop: 2 }}>
          O corpo nunca mentiu.<br />Eu reuni tudo aqui.
        </p>

        {/* CTA caps lock */}
        <p
          className="text-center mt-3 mb-2"
          style={{
            fontFamily: "-apple-system, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#00BCD4",
          }}
        >
          CLIQUE AGORA NO LINK ABAIXO
        </p>

        {/* Link na bio — final CTA when post-reels */}
        <motion.button
          onClick={isPostReels ? handleBioClick : undefined}
          className="w-full flex items-center justify-center gap-2"
          style={{
            height: 32,
            background: "#1C1C1E",
            border: isPostReels ? "1px solid #00BCD4" : "1px solid #3A3A3C",
            borderRadius: 8,
            fontSize: 14,
            color: "#fff",
            cursor: isPostReels ? "pointer" : "default",
          }}
          animate={isPostReels ? { scale: [1, 1.02, 1] } : {}}
          transition={isPostReels ? { duration: 2, repeat: Infinity } : {}}
        >
          🔗 link na bio
          <span
            className="rounded-full"
            style={{ width: 6, height: 6, background: "#00BCD4", animation: "blink 1.2s ease-in-out infinite" }}
          />
        </motion.button>
        <style>{`@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }`}</style>

        {/* Tabs */}
        <div className="flex mt-4 border-t" style={{ borderColor: "#262626" }}>
          <div className="flex-1 flex justify-center py-3" style={{ color: "#8E8E8E" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <rect x="1" y="1" width="10" height="10" rx="1" />
              <rect x="13" y="1" width="10" height="10" rx="1" />
              <rect x="1" y="13" width="10" height="10" rx="1" />
              <rect x="13" y="13" width="10" height="10" rx="1" />
            </svg>
          </div>
          <div className="flex-1 flex justify-center py-3 relative" style={{ color: "#fff" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4L10 12V20L14 18V12L20 4H4Z" />
            </svg>
            <div className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: "#fff" }} />
          </div>
        </div>
      </div>

      {/* Thumbnail Grid — 3 reels */}
      <LayoutGroup>
        <div className="grid grid-cols-3" style={{ gap: 2 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              layoutId={!isPostReels && i === 0 ? "reelTransition" : undefined}
              className="relative flex items-center justify-center cursor-pointer"
              style={{
                background: "#111",
                aspectRatio: "9/16",
                outline: !isPostReels && i === 0 ? "2px solid #00BCD4" : "none",
                outlineOffset: !isPostReels && i === 0 ? -2 : 0,
                animation: !isPostReels && i === 0 && showHint ? "thumbPulse 2s ease-in-out infinite" : "none",
              }}
              onClick={!isPostReels ? onTapReel : undefined}
            >
              {isPostReels ? (
                /* Watched overlay with check */
                <>
                  <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="relative z-10">
                    <path d="M20 6L9 17L4 12" stroke="#00BCD4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#555">
                  <path d="M8 5V19L19 12L8 5Z" />
                </svg>
              )}
            </motion.div>
          ))}
        </div>
      </LayoutGroup>
      <style>{`@keyframes thumbPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.02); } }`}</style>

      {/* Hint text — only pre-reels */}
      {!isPostReels && showHint && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center pb-4"
          style={{ fontSize: 13, color: "#8E8E8E" }}
        >
          Toque no reel para assistir
        </motion.p>
      )}

      {/* Bio link expansion animation */}
      {bioExpanding && (
        <motion.div
          initial={{ scale: 0.1, opacity: 0.8 }}
          animate={{ scale: 20, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
          onAnimationComplete={() => setTimeout(onBioLink, 300)}
          className="fixed z-50 rounded-full"
          style={{
            width: 100,
            height: 100,
            top: "50%",
            left: "50%",
            marginLeft: -50,
            marginTop: -50,
            background: "linear-gradient(135deg, #00BCD4, #0097A7)",
          }}
        />
      )}
    </div>
  );
};

/* ── Reel View ── */
const ReelView = ({
  reel,
  reelIndex,
  onComplete,
  ctaMode,
  sidebarVisible,
}: {
  reel: ReelData;
  reelIndex: number;
  onComplete: () => void;
  ctaMode: boolean;
  sidebarVisible: boolean;
}) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [ruptureActive, setRuptureActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [freezeGradient, setFreezeGradient] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const timersRef = useRef<number[]>([]);
  const lastTapRef = useRef(0);

  useEffect(() => {
    timersRef.current = [];
    setVisibleLines(0);
    setCompleted(false);
    setRuptureActive(false);
    setFreezeGradient(false);
    setFlashActive(false);

    let cumDelay = 600;
    reel.lines.forEach((line, i) => {
      const t = window.setTimeout(() => {
        setVisibleLines(i + 1);

        if (line.isRupture) {
          setRuptureActive(true);

          try {
            if (reel.ruptureType === "pulse") navigator.vibrate?.(100);
            else if (reel.ruptureType === "freeze") navigator.vibrate?.([50, 30, 50]);
            else if (reel.ruptureType === "flash") navigator.vibrate?.(200);
          } catch {}

          if (reel.ruptureType === "freeze") {
            setFreezeGradient(true);
            window.setTimeout(() => { setFreezeGradient(false); setRuptureActive(false); }, 1500);
          } else if (reel.ruptureType === "flash") {
            setFlashActive(true);
            window.setTimeout(() => { setFlashActive(false); setRuptureActive(false); }, 400);
          } else {
            window.setTimeout(() => setRuptureActive(false), 2000);
          }
        }

        if (reelIndex === 1 && i + 1 === 10) {
          setShowNotification(true);
          window.setTimeout(() => setShowNotification(false), 3000);
        }

        if (i === reel.lines.length - 1) {
          window.setTimeout(() => setCompleted(true), 1500);
        }
      }, cumDelay);
      timersRef.current.push(t);
      cumDelay += DELAY_MS[line.delay];
    });

    return () => timersRef.current.forEach(clearTimeout);
  }, [reel, reelIndex]);

  const progress = reel.lines.length > 0 ? (visibleLines / reel.lines.length) * 100 : 0;

  // #3 Double-tap to like
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setLiked(true);
      setShowHeartBurst(true);
    }
    lastTapRef.current = now;
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        filter: flashActive ? "brightness(1.3)" : "brightness(1)",
        transition: "filter 0.4s ease",
      }}
      onClick={handleDoubleTap}
    >
      {/* Breathing gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #0A0A0F 0%, #0D0D1A 40%, #0A0F0D 70%, #0A0A0A 100%)",
          backgroundSize: "400% 400%",
          animation: freezeGradient ? "none" : "breathe 12s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes breathe {
          0% { background-position: 0% 0%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 50% 100%; }
          75% { background-position: 0% 50%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>

      {/* Status bar */}
      <div className="relative z-10"><PhoneStatusBar /></div>

      {/* Progress bar (3 segments) */}
      <div className="absolute left-3 right-3 flex gap-1 z-20" style={{ top: 48 }}>
        {REELS.map((_, i) => (
          <div key={i} className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.3)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: i < reelIndex ? "100%" : i === reelIndex ? `${progress}%` : "0%",
                backgroundColor: "rgba(255,255,255,0.8)",
                transition: "width 0.4s linear",
              }}
            />
          </div>
        ))}
      </div>

      {/* #4 iOS notification */}
      <IOSNotification show={showNotification} />

      {/* #3 HeartBurst */}
      <HeartBurst show={showHeartBurst} onDone={() => setShowHeartBurst(false)} />

      {/* Main text area */}
      <div
        ref={(el) => {
          // Auto-scroll to bottom as new lines appear
          if (el) el.scrollTop = el.scrollHeight;
        }}
        className="absolute z-10 overflow-y-auto scrollbar-hide"
        style={{ top: "10%", left: 16, right: 60, maxHeight: "58%" }}
      >
        {reel.lines.slice(0, visibleLines).map((line, i) => {
          const isRuptureLine = line.isRupture && ruptureActive;

          if (isRuptureLine && reel.ruptureType === "pulse") {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center my-4 relative"
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(0,188,212,0.3) 0%, transparent 70%)",
                    animation: "ruptPulse 2s ease-out",
                    transform: "scale(2)",
                  }}
                />
                <span style={{ fontSize: 24, fontWeight: 300, color: "#00BCD4", position: "relative", zIndex: 1 }}>
                  {line.text}
                </span>
                <style>{`@keyframes ruptPulse { 0% { opacity: 0; transform: scale(1); } 30% { opacity: 1; transform: scale(2); } 100% { opacity: 0; transform: scale(3); } }`}</style>
              </motion.div>
            );
          }

          if (isRuptureLine && reel.ruptureType === "freeze") {
            return (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: 17, color: "#FFFFFF", lineHeight: 1.7, letterSpacing: "0.08em" }}
              >
                {line.text}
              </motion.p>
            );
          }

          if (isRuptureLine && reel.ruptureType === "flash") {
            return (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: 17, color: "#34C759", lineHeight: 1.7 }}
              >
                {line.text}
              </motion.p>
            );
          }

          return (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: 17, color: "#fff", lineHeight: 1.7 }}
            >
              {highlightKeywords(line.text)}
            </motion.p>
          );
        })}
      </div>

      {/* #6 Floating comments */}
      <FloatingComments comments={reel.floatingComments} visibleLines={visibleLines} />

      {/* #10 Sidebar with fade-out in ctaMode */}
      <motion.div
        className="absolute z-20 flex flex-col items-center gap-5"
        style={{ right: 12, bottom: 120 }}
        animate={{ opacity: sidebarVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Avatar */}
        <div className="relative">
          <StoriesRing size={40}>
            <ECGAvatar size={32} />
          </StoriesRing>
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: "#0095F6", border: "2px solid #000" }}
          >
            <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>+</span>
          </div>
        </div>

        {/* Like */}
        <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); setLiked(true); }}>
          <motion.div animate={liked ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
            {liked ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#ED4956">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </motion.div>
          <span style={{ fontSize: 12, color: "#fff" }}>{reel.likes}</span>
        </div>

        {/* Comments */}
        <div className="flex flex-col items-center gap-1">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span style={{ fontSize: 12, color: "#fff" }}>{reel.comments}</span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center gap-1">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </div>

        {/* More */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="absolute z-20"
        style={{ bottom: 0, left: 0, width: "calc(100% - 60px)", padding: "0 16px 32px" }}
        animate={{ opacity: sidebarVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {!completed && sidebarVisible && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <ECGAvatar size={32} />
              </div>
              <span style={{ fontFamily: "-apple-system, sans-serif", fontSize: 14, fontWeight: 600, color: "#fff" }}>
                corpofala.oficial
              </span>
              <button
                className="ml-2"
                style={{ border: "1px solid #fff", borderRadius: 4, padding: "2px 12px", fontSize: 13, color: "#fff", background: "transparent" }}
              >
                Seguir
              </button>
            </div>
            <p style={{ fontSize: 14, color: "#fff", maxHeight: 40, overflow: "hidden" }}>{reel.caption}</p>
            <div className="flex items-center gap-2 mt-2">
              <span style={{ fontSize: 12, color: "#E8E8E8" }}>♪ Áudio original · corpofala.oficial</span>
              <motion.div
                animate={{ rotate: sidebarVisible ? 360 : 0 }}
                transition={{ duration: 4, repeat: sidebarVisible ? Infinity : 0, ease: "linear" }}
                className="ml-auto"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #333, #555)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#000" }} />
              </motion.div>
            </div>
          </>
        )}

        {completed && reelIndex < 2 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onComplete(); }}
            className="w-full text-center py-3"
            style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}
          >
            Próximo ↑
          </motion.button>
        )}
      </motion.div>

      <GrainOverlay />
    </div>
  );
};

/* ── CTA Overlay after Reel 3 — now "VER PERFIL" ── */
const CTAOverlay = ({ onAccess }: { onAccess: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-x-0 bottom-0 z-30 flex justify-center"
      style={{ padding: "0 16px 40px" }}
    >
      <motion.button
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        onClick={onAccess}
        className="w-full flex items-center justify-center gap-3"
        style={{
          height: 52,
          borderRadius: 12,
          background: "#1C1C1E",
          border: "1px solid rgba(255,255,255,0.3)",
          fontFamily: "-apple-system, sans-serif",
          fontSize: 15,
          fontWeight: 600,
          color: "#fff",
          letterSpacing: "0.05em",
          cursor: "pointer",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
        </svg>
        VER PERFIL @corpofala.oficial
      </motion.button>
    </motion.div>
  );
};

/* ── Swipe Sound ── */
const playSwipeSound = () => {
  try {
    const ctx = new AudioContext();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) * 0.1;
    }
    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2000;
    filter.Q.value = 0.7;
    src.buffer = buf;
    src.connect(filter);
    filter.connect(ctx.destination);
    src.start();
  } catch {}
};

/* ── Main Screen5 Component ── */
const Screen5_TikTok = ({ onNext }: Screen5Props) => {
  const [phase, setPhase] = useState<"reels" | "profile">("reels");
  const [currentReel, setCurrentReel] = useState(0);
  const [ctaMode, setCTAMode] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const touchStartRef = useRef(0);
  const lastScrollRef = useRef(0);
  const droneRef = useRef<{ osc: OscillatorNode; gain: GainNode; lfo: OscillatorNode } | null>(null);
  const { ensureContext, startHeartbeat, setHeartbeatVolume, stopAll } = useNarrativeAudio();

  // Start heartbeat at low volume
  useEffect(() => {
    startHeartbeat();
    setHeartbeatVolume(0.03, 1);
    return () => stopAll();
  }, [startHeartbeat, setHeartbeatVolume, stopAll]);

  // #9 Ambient drone when entering reels
  useEffect(() => {
    if (phase !== "reels") return;
    const ctx = ensureContext();
    if (!ctx || droneRef.current) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 80;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 2);

    lfo.type = "sine";
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 0.005;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    lfo.start();

    droneRef.current = { osc, gain, lfo };

    return () => {
      try { osc.stop(); } catch {}
      try { lfo.stop(); } catch {}
      droneRef.current = null;
    };
  }, [phase, ensureContext]);

  // #9 Fade out drone when CTA
  useEffect(() => {
    if (ctaMode && droneRef.current) {
      const ctx = ensureContext();
      if (ctx) {
        const now = ctx.currentTime;
        droneRef.current.gain.gain.cancelScheduledValues(now);
        droneRef.current.gain.gain.setValueAtTime(droneRef.current.gain.gain.value, now);
        droneRef.current.gain.gain.linearRampToValueAtTime(0, now + 1);
        const { osc, lfo } = droneRef.current;
        setTimeout(() => {
          try { osc.stop(); } catch {}
          try { lfo.stop(); } catch {}
        }, 1100);
        droneRef.current = null;
      }
    }
  }, [ctaMode, ensureContext]);

  const handleReelComplete = useCallback(() => {
    if (currentReel < 2) {
      playSwipeSound();
      setCurrentReel((prev) => prev + 1);
    } else {
      // Sidebar fade-out before CTA "VER PERFIL"
      setSidebarVisible(false);
      setTimeout(() => setCTAMode(true), 600);
    }
  }, [currentReel]);

  // CTA "VER PERFIL" -> go to profile phase
  const handleGoToProfile = useCallback(() => {
    setCTAMode(false);
    setPhase("profile");
  }, []);

  // Bio link -> final transition to Screen6_LP
  const handleBioLink = useCallback(() => {
    stopAll();
    onNext();
  }, [stopAll, onNext]);

  const handleSwipeStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleSwipeEnd = (e: React.TouchEvent) => {
    const delta = touchStartRef.current - e.changedTouches[0].clientY;
    if (delta > 50 && phase === "reels") {
      handleReelComplete();
    }
  };

  // #5 Scroll wheel support
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (phase !== "reels") return;
      const now = Date.now();
      if (now - lastScrollRef.current < 500) return;
      if (e.deltaY > 50) {
        lastScrollRef.current = now;
        handleReelComplete();
      }
    },
    [phase, handleReelComplete]
  );

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ background: "#000" }}
      onTouchStart={handleSwipeStart}
      onTouchEnd={handleSwipeEnd}
      onWheel={handleWheel}
    >
      <LayoutGroup>
        {phase === "reels" && (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentReel}
              className="absolute inset-0"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <ReelView
                reel={REELS[currentReel]}
                reelIndex={currentReel}
                onComplete={handleReelComplete}
                ctaMode={ctaMode}
                sidebarVisible={sidebarVisible}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {phase === "profile" && (
          <motion.div
            className="w-full h-full"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <ProfileView isPostReels={true} onTapReel={() => {}} onBioLink={handleBioLink} />
          </motion.div>
        )}
      </LayoutGroup>

      {ctaMode && <CTAOverlay onAccess={handleGoToProfile} />}

      <GrainOverlay />
    </div>
  );
};

export default Screen5_TikTok;
