import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNarrativeAudio } from "@/contexts/NarrativeAudioContext";
import { PhoneStatusBar } from "./PhoneStatusBar";

interface Screen3Props {
  onNext: () => void;
}

/* ── SVG icons (matching Screen2_Phone style) ── */

const HeartECGIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path
      d="M20 35s-13-7.5-13-17.5C7 12 11 8 15.5 8c2.8 0 4.5 2 4.5 2s1.7-2 4.5-2C29 8 33 12 33 17.5S20 35 20 35z"
      fill="none"
      stroke="white"
      strokeWidth="1.5"
    />
    <polyline
      points="10,22 15,22 17,18 20,26 23,20 25,22 30,22"
      fill="none"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MuteIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .87-.16 1.71-.46 2.49" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const KeypadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
    {[0, 1, 2].map(row =>
      [0, 1, 2].map(col => (
        <circle key={`${row}-${col}`} cx={6 + col * 6} cy={5 + row * 6} r="1.5" fill="white" />
      ))
    )}
    <circle cx="12" cy="21" r="1.5" fill="white" />
  </svg>
);

const SpeakerIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const AddCallIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const VideoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const ContactsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PhoneEndIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
    <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.18-.29-.43-.29-.71 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
  </svg>
);

/* ── Waveform bars for Dynamic Island ── */
const DynamicIslandWave = ({ playing }: { playing: boolean }) => (
  <div className="flex items-center justify-center gap-[2px] h-3">
    {[0, 1, 2, 3, 4].map(i => (
      <motion.div
        key={i}
        className="w-[2.5px] rounded-full bg-green-400"
        animate={playing ? { height: [3, 8 + Math.random() * 5, 3] } : { height: 3 }}
        transition={{ duration: 0.5 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.08 }}
      />
    ))}
  </div>
);

/* ── Call action button ── */
const CallActionButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center gap-1.5">
    <div
      className="w-[60px] h-[60px] rounded-full flex items-center justify-center"
      style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
    >
      {icon}
    </div>
    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
      {label}
    </span>
  </div>
);

/* ── Main component ── */
const Screen3_Call = ({ onNext }: Screen3Props) => {
  const narrativeAudio = useNarrativeAudio();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [timer, setTimer] = useState("00:00");
  const [callEnded, setCallEnded] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const busyToneRef = useRef<{ stop: () => void } | null>(null);

  const formatTime = useCallback((secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, []);

  /* Play the "tu tu tu tu" busy/disconnect tone via Web Audio API */
  const playBusyTone = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gain = ctx.createGain();
      gain.gain.value = 0.25;
      gain.connect(ctx.destination);

      let stopped = false;
      const beepCount = 8;
      const beepOn = 0.25;   // 250ms tone
      const beepOff = 0.25;  // 250ms silence
      const totalDuration = beepCount * (beepOn + beepOff);

      for (let i = 0; i < beepCount; i++) {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 425; // standard busy tone freq
        osc.connect(gain);
        const start = i * (beepOn + beepOff);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + beepOn);
      }

      // After all beeps, show end screen
      setTimeout(() => {
        if (!stopped) {
          ctx.close();
          setShowEndScreen(true);
        }
      }, totalDuration * 1000 + 500);

      busyToneRef.current = {
        stop: () => {
          stopped = true;
          try { ctx.close(); } catch {}
        },
      };
    } catch {
      // Fallback if Web Audio not available
      setTimeout(() => setShowEndScreen(true), 2000);
    }
  }, []);

  useEffect(() => {
    narrativeAudio.stopAll();

    const el = new Audio("/audio/call-voice.mp3");
    audioRef.current = el;

    el.addEventListener("timeupdate", () => {
      setTimer(formatTime(el.currentTime));
    });

    el.addEventListener("ended", () => {
      setIsPlaying(false);
      setCallEnded(true);
      // Play busy tone "tu tu tu tu" then show end screen
      playBusyTone();
    });

    el.play().then(() => setIsPlaying(true)).catch(() => {
      const resume = () => {
        el.play().then(() => setIsPlaying(true));
        document.removeEventListener("touchstart", resume);
        document.removeEventListener("click", resume);
      };
      document.addEventListener("touchstart", resume, { once: true });
      document.addEventListener("click", resume, { once: true });
    });

    return () => {
      el.pause();
      el.src = "";
      el.removeAttribute("src");
      busyToneRef.current?.stop();
    };
  }, [narrativeAudio, formatTime, playBusyTone]);

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden relative" style={{ background: "#000" }}>
      <PhoneStatusBar />

      {/* Dynamic Island waveform indicator */}
      <div className="flex justify-center pt-1 pb-2">
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <DynamicIslandWave playing={isPlaying} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showEndScreen ? (
          /* ── In-call screen ── */
          <motion.div
            key="in-call"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col items-center justify-between pb-12 pt-8"
          >
            {/* Avatar + Name + Timer */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                  border: "2px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 0 30px rgba(0,188,212,0.15)",
                }}
              >
                <HeartECGIcon />
              </div>
              <h2
                style={{
                  fontSize: clamp(24, 7, 32),
                  fontWeight: 300,
                  color: "#fff",
                  fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
                  letterSpacing: "0.02em",
                }}
              >
                Corpo
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {timer}
              </p>
            </div>

            {/* Action buttons grid */}
            <div className="grid grid-cols-3 gap-x-6 gap-y-5 px-8">
              <CallActionButton icon={<MuteIcon />} label="silenciar" />
              <CallActionButton icon={<KeypadIcon />} label="teclado" />
              <CallActionButton icon={<SpeakerIcon />} label="áudio" />
              <CallActionButton icon={<AddCallIcon />} label="adicionar" />
              <CallActionButton icon={<VideoIcon />} label="FaceTime" />
              <CallActionButton icon={<ContactsIcon />} label="contatos" />
            </div>

            {/* End call button (decorative) */}
            <div className="flex flex-col items-center">
              <div
                className="w-[70px] h-[70px] rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#FF3B30" }}
              >
                <PhoneEndIcon />
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── Call ended screen ── */
          <motion.div
            key="ended"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col items-center justify-center gap-8 px-6"
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                  border: "2px solid rgba(255,255,255,0.08)",
                }}
              >
                <HeartECGIcon />
              </div>
              <p
                style={{
                  fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 500,
                }}
              >
                CHAMADA ENCERRADA — {timer}
              </p>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              onClick={onNext}
              className="px-8 py-3 transition-all active:scale-95"
              style={{
                fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.05em",
                color: "#25D366",
                border: "1px solid rgba(37,211,102,0.3)",
                borderRadius: 12,
                backgroundColor: "rgba(37,211,102,0.08)",
              }}
            >
              ABRIR WHATSAPP
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* helper – inline clamp for font-size */
function clamp(min: number, vw: number, max: number): string {
  return `clamp(${min}px, ${vw}vw, ${max}px)`;
}

export default Screen3_Call;
