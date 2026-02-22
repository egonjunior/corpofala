import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneStatusBar } from "../narrative/PhoneStatusBar";

interface FunnelCallProps {
  onNext: () => void;
}

/* ── Pulso Logo (3 concentric circles) ── */
const PulsoIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="3.5" fill="white" />
    <circle cx="16" cy="16" r="8" stroke="white" strokeWidth="1.3" opacity="0.45" />
    <circle cx="16" cy="16" r="13" stroke="white" strokeWidth="1" opacity="0.2" />
  </svg>
);

const PulsoIconLarge = ({ size = 52 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="3.5" fill="white" />
    <motion.circle cx="16" cy="16" r="8" stroke="white" strokeWidth="1.3"
      animate={{ opacity: [0.45, 0.7, 0.45], r: [8, 8.5, 8] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.circle cx="16" cy="16" r="13" stroke="white" strokeWidth="1"
      animate={{ opacity: [0.2, 0.35, 0.2], r: [13, 13.8, 13] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
    />
  </svg>
);

/* ── SVG icons ── */
const MuteIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .87-.16 1.71-.46 2.49"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const KeypadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
    {[0,1,2].map(r=>[0,1,2].map(c=><circle key={`${r}-${c}`} cx={6+c*6} cy={5+r*6} r="1.5" fill="white"/>))}
    <circle cx="12" cy="21" r="1.5" fill="white"/>
  </svg>
);

const SpeakerIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>
);

const AddCallIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);

const ContactsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const PhoneEndIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
    <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.18-.29-.43-.29-.71 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
  </svg>
);

const PhoneIcon = ({ size = 28, rotate = 0 }: { size?: number; rotate?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${rotate}deg)` }}>
    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z" fill="white"/>
  </svg>
);

/* ── Waveform bars ── */
const DynamicIslandWave = ({ playing }: { playing: boolean }) => (
  <div className="flex items-center justify-center gap-[2px] h-3">
    {[0,1,2,3,4].map(i => (
      <motion.div key={i} className="w-[2.5px] rounded-full bg-green-400"
        animate={playing ? { height: [3, 8+Math.random()*5, 3] } : { height: 3 }}
        transition={{ duration: 0.5+Math.random()*0.3, repeat: Infinity, delay: i*0.08 }}
      />
    ))}
  </div>
);

/* ── Call action button ── */
const CallActionButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center gap-1.5">
    <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
      {icon}
    </div>
    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>{label}</span>
  </div>
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

function clamp(min: number, vw: number, max: number) {
  return `clamp(${min}px, ${vw}vw, ${max}px)`;
}

/* ── iPhone "Reflection" ringtone approximation ── */
function createIPhoneRingtone(ctx: AudioContext, destination: AudioNode) {
  // Classic iPhone "Reflection" uses marimba-like tones with specific note pattern
  // Pattern: two groups of ascending notes, repeated every ~3s
  const notes = [
    // Group 1 - ascending arpeggio
    { freq: 987.8, delay: 0.00, dur: 0.12 },  // B5
    { freq: 1318.5, delay: 0.13, dur: 0.12 }, // E6
    { freq: 1568.0, delay: 0.26, dur: 0.12 }, // G6
    { freq: 1976.0, delay: 0.39, dur: 0.18 }, // B6
    // Group 2 - descending then resolving
    { freq: 1568.0, delay: 0.70, dur: 0.12 }, // G6
    { freq: 1318.5, delay: 0.83, dur: 0.12 }, // E6
    { freq: 1568.0, delay: 0.96, dur: 0.12 }, // G6
    { freq: 1976.0, delay: 1.09, dur: 0.25 }, // B6 (longer)
  ];

  let active = true;

  const playPattern = () => {
    if (!active) return;
    const now = ctx.currentTime;

    notes.forEach(({ freq, delay, dur }) => {
      // Main tone - marimba-like with fast attack, exponential decay
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now + delay);
      g.gain.linearRampToValueAtTime(0.5, now + delay + 0.004); // sharp attack
      g.gain.exponentialRampToValueAtTime(0.15, now + delay + dur * 0.4);
      g.gain.exponentialRampToValueAtTime(0.001, now + delay + dur + 0.15);
      osc.connect(g);
      g.connect(destination);
      osc.start(now + delay);
      osc.stop(now + delay + dur + 0.2);

      // Overtone for marimba brightness
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.value = freq * 3; // 3rd harmonic
      g2.gain.setValueAtTime(0, now + delay);
      g2.gain.linearRampToValueAtTime(0.08, now + delay + 0.003);
      g2.gain.exponentialRampToValueAtTime(0.001, now + delay + dur * 0.3);
      osc2.connect(g2);
      g2.connect(destination);
      osc2.start(now + delay);
      osc2.stop(now + delay + dur + 0.1);

      // Sub-harmonic body
      const osc3 = ctx.createOscillator();
      const g3 = ctx.createGain();
      osc3.type = "sine";
      osc3.frequency.value = freq * 0.5;
      g3.gain.setValueAtTime(0, now + delay);
      g3.gain.linearRampToValueAtTime(0.12, now + delay + 0.005);
      g3.gain.exponentialRampToValueAtTime(0.001, now + delay + dur * 0.5);
      osc3.connect(g3);
      g3.connect(destination);
      osc3.start(now + delay);
      osc3.stop(now + delay + dur + 0.15);
    });
  };

  playPattern();
  const iv = setInterval(playPattern, 3200);

  return {
    stop: () => {
      active = false;
      clearInterval(iv);
    },
  };
}

/* ── Main component ── */
const FunnelCall = ({ onNext }: FunnelCallProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const busyToneRef = useRef<{ stop: () => void } | null>(null);
  const ringtoneRef = useRef<{ stop: () => void } | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const vibIntervalRef = useRef<number | null>(null);

  const [phase, setPhase] = useState<"ringing" | "call" | "ended">("ringing");
  const [timer, setTimer] = useState("00:00");
  const [isPlaying, setIsPlaying] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [time, setTime] = useState(() => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
  const [isVibrating, setIsVibrating] = useState(true);
  const prewarmCtxRef = useRef<AudioContext | null>(null);

  const formatTime = useCallback((secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, []);

  // Clock
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })), 1000);
    return () => clearInterval(iv);
  }, []);

  // Start ringtone + vibration on mount
  useEffect(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.28;
      masterGain.connect(ctx.destination);

      ringtoneRef.current = createIPhoneRingtone(ctx, masterGain);
    } catch {}

    // Vibration synced with ringtone pattern (~3.2s cycle)
    const doVibrate = () => {
      try {
        navigator.vibrate?.([
          100, 80, 100, 80, 100, 80, 100,  // quick pulses for note group 1
          400,                               // pause between groups
          100, 80, 100, 80, 100, 80, 100,  // quick pulses for note group 2
        ]);
      } catch {}
    };
    doVibrate();
    vibIntervalRef.current = window.setInterval(doVibrate, 3200);

    return () => {
      ringtoneRef.current?.stop();
      try { audioCtxRef.current?.close(); } catch {}
      if (vibIntervalRef.current) clearInterval(vibIntervalRef.current);
      try { navigator.vibrate?.(0); } catch {}
    };
  }, []);

  // Handle answer
  const handleAnswer = useCallback(() => {
    if (phase !== "ringing") return;

    ringtoneRef.current?.stop();
    try { audioCtxRef.current?.close(); } catch {}
    if (vibIntervalRef.current) { clearInterval(vibIntervalRef.current); vibIntervalRef.current = null; }
    try { navigator.vibrate?.(50); } catch {}
    setIsVibrating(false);
    setPhase("call");

    const el = new Audio();
    el.play().catch(() => {});
    el.preload = "auto";
    el.src = "/audio/ligacao-oficial.mp3";
    audioRef.current = el;

    el.addEventListener("timeupdate", () => {
      setTimer(formatTime(el.currentTime));
      // Show "Reconectando..." in the last ~8 seconds
      if (el.duration && el.currentTime >= el.duration - 8 && !reconnecting) {
        setReconnecting(true);
        // Pre-warm AudioContext for busy tone
        try {
          prewarmCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch {}
      }
    });
    el.addEventListener("ended", () => {
      setIsPlaying(false);
      // 200ms delay for naturalidade then busy tone
      setTimeout(() => playBusyTone(), 200);
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
  }, [phase, formatTime]);

  const playBusyTone = useCallback(() => {
    try {
      const ctx = prewarmCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      prewarmCtxRef.current = null;
      const gain = ctx.createGain();
      gain.gain.value = 0.25;
      gain.connect(ctx.destination);

      const beepCount = 8;
      const beepOn = 0.25;
      const beepOff = 0.25;
      const totalDuration = beepCount * (beepOn + beepOff);

      for (let i = 0; i < beepCount; i++) {
        const osc = ctx.createOscillator();
        osc.type = "sine"; osc.frequency.value = 425;
        osc.connect(gain);
        const start = i * (beepOn + beepOff);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + beepOn);
      }

      let stopped = false;
      setTimeout(() => {
        if (!stopped) { ctx.close(); setPhase("ended"); }
      }, totalDuration * 1000 + 500);

      busyToneRef.current = { stop: () => { stopped = true; try { ctx.close(); } catch {} } };
    } catch {
      setTimeout(() => setPhase("ended"), 2000);
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (audioRef.current) { audioRef.current.src = ""; }
      busyToneRef.current?.stop();
    };
  }, []);

  const iosFont = '-apple-system, "SF Pro Display", system-ui, sans-serif';

  /* ── RINGING SCREEN ── */
  if (phase === "ringing") {
    return (
      <div className="w-full h-screen relative overflow-hidden" style={{ fontFamily: iosFont }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #1C1C3A 0%, #0D1B2A 40%, #1A0D2E 70%, #0A0A1A 100%)" }}/>
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }}/>

        <motion.div
          animate={isVibrating ? { y: [0, -2, 2, -1, 1, 0] } : {}}
          transition={isVibrating ? { duration: 0.35, repeat: Infinity, repeatDelay: 3.65 } : undefined}
          className="relative w-full h-full z-20"
        >
          {/* Status Bar */}
          <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between" style={{ height: 50, padding: "14px 24px 0" }}>
            <span style={{ fontSize: 17, fontWeight: 600, color: "#fff" }}>{time}</span>
            <motion.div
              className="absolute left-1/2 flex items-center justify-center"
              style={{ transform: "translateX(-50%)", top: 10, background: "#000", borderRadius: 20, width: 120, height: 34 }}
            >
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                style={{ width: 8, height: 8, borderRadius: "50%", background: "#30D158", marginLeft: "auto", marginRight: 12 }}
              />
            </motion.div>
            <div className="flex items-center gap-1.5">
              <svg width="16" height="12" viewBox="0 0 16 12"><rect x="0" y="8" width="3" height="4" rx="0.5" fill="white"/><rect x="4" y="5" width="3" height="7" rx="0.5" fill="white"/><rect x="8" y="2" width="3" height="10" rx="0.5" fill="white"/><rect x="12" y="0" width="3" height="12" rx="0.5" fill="white" opacity="0.3"/></svg>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", marginLeft: 2 }}>4G</span>
              <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="20" height="11" rx="2" stroke="white" strokeWidth="1" fill="none"/><rect x="2" y="2" width="14" height="8" rx="1" fill="white"/><rect x="21" y="3.5" width="2.5" height="5" rx="1" fill="white" opacity="0.4"/></svg>
            </div>
          </div>

          {/* Central area */}
          <div className="flex flex-col items-center w-full" style={{ paddingTop: "18vh" }}>
            <span style={{ fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>iPhone</span>
            <span style={{ fontSize: 46, fontWeight: 300, color: "#fff", letterSpacing: "-0.5px", marginBottom: 4 }}>Corpo</span>
            <span style={{ fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.55)", marginBottom: 40 }}>Chamada recebida</span>

            {/* Avatar with Pulso logo */}
            <div className="relative" style={{ marginBottom: 36 }}>
              <motion.div
                animate={{ boxShadow: ["0 0 0 0px rgba(0,188,212,0.5)", "0 0 0 20px rgba(0,188,212,0)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute rounded-full" style={{ inset: -4, borderRadius: "50%" }}
              />
              <div className="flex items-center justify-center rounded-full"
                style={{ width: 112, height: 112, background: "linear-gradient(135deg, #005F73 0%, #0A9396 50%, #00BCD4 100%)", boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }}
              >
                <PulsoIconLarge size={56}/>
              </div>
            </div>

            {/* Secondary buttons */}
            <div className="flex items-start gap-7" style={{ marginBottom: 24 }}>
              {[{ icon: <ClockIcon/>, label: "Lembrar-me" }, { icon: <MessageIcon/>, label: "Mensagem" }].map(btn => (
                <div key={btn.label} className="flex flex-col items-center">
                  <div className="flex items-center justify-center rounded-full"
                    style={{ width: 56, height: 56, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >{btn.icon}</div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>{btn.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Answer / Refuse */}
          <div className="fixed left-0 right-0 flex flex-col items-center z-30" style={{ bottom: 64 }}>
            <div className="flex items-start justify-center" style={{ gap: 72 }}>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center rounded-full"
                  style={{ width: 72, height: 72, background: "#FF3B30", boxShadow: "0 4px 20px rgba(255,59,48,0.4)" }}
                >
                  <PhoneIcon size={28} rotate={135}/>
                </div>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 8 }}>Recusar</span>
              </div>
              <div className="flex flex-col items-center">
                <motion.button
                  onClick={handleAnswer}
                  animate={{ scale: [1, 1.05, 1], boxShadow: ["0 4px 20px rgba(52,199,89,0.5)", "0 4px 20px rgba(52,199,89,0.8), 0 0 0 0px rgba(52,199,89,0.4)", "0 4px 20px rgba(52,199,89,0.5), 0 0 0 20px rgba(52,199,89,0)"] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 72, height: 72, background: "#34C759" }}
                >
                  <PhoneIcon size={28}/>
                </motion.button>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 8 }}>Atender</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── CALL IN PROGRESS / ENDED ── */
  return (
    <div className="w-full h-screen flex flex-col overflow-hidden relative" style={{ background: "#000" }}>
      <PhoneStatusBar />

      {/* Dynamic Island */}
      <div className="flex justify-center pt-1 pb-2">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
          <div className="w-2 h-2 rounded-full bg-green-400"/>
          <DynamicIslandWave playing={isPlaying}/>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "call" ? (
          <motion.div key="in-call" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col items-center justify-between pb-12 pt-8"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #005F73 0%, #0A9396 50%, #00BCD4 100%)", border: "2px solid rgba(255,255,255,0.1)", boxShadow: "0 0 30px rgba(0,188,212,0.15)" }}
              ><PulsoIcon size={36}/></div>
              <h2 style={{ fontSize: clamp(24, 7, 32), fontWeight: 300, color: "#fff", fontFamily: iosFont, letterSpacing: "0.02em" }}>Corpo</h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", fontFamily: iosFont, fontVariantNumeric: "tabular-nums" }}>
                {reconnecting ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    Reconectando
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >...</motion.span>
                  </motion.span>
                ) : timer}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-x-6 gap-y-5 px-8">
              <CallActionButton icon={<MuteIcon/>} label="silenciar"/>
              <CallActionButton icon={<KeypadIcon/>} label="teclado"/>
              <CallActionButton icon={<SpeakerIcon/>} label="áudio"/>
              <CallActionButton icon={<AddCallIcon/>} label="adicionar"/>
              <CallActionButton icon={<VideoIcon/>} label="FaceTime"/>
              <CallActionButton icon={<ContactsIcon/>} label="contatos"/>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-[70px] h-[70px] rounded-full flex items-center justify-center" style={{ backgroundColor: "#FF3B30" }}>
                <PhoneEndIcon/>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="ended" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col items-center justify-center gap-8 px-6"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #005F73 0%, #0A9396 50%, #00BCD4 100%)", border: "2px solid rgba(255,255,255,0.08)" }}
              ><PulsoIcon size={36}/></div>
              <p style={{ fontFamily: iosFont, fontSize: 13, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
                CHAMADA ENCERRADA — {timer}
              </p>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
              onClick={onNext}
              className="px-8 py-3 transition-all active:scale-95"
              style={{ fontFamily: iosFont, fontSize: 15, fontWeight: 600, letterSpacing: "0.05em", color: "#25D366", border: "1px solid rgba(37,211,102,0.3)", borderRadius: 12, backgroundColor: "rgba(37,211,102,0.08)" }}
            >
              ABRIR WHATSAPP
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FunnelCall;
