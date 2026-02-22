import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

const WAVEFORM_BARS = [
  3, 5, 8, 4, 7, 10, 6, 3, 9, 5, 7, 4, 8, 11, 6, 3, 7, 9, 5, 4,
  8, 6, 10, 3, 7, 5, 9, 4, 6, 8,
];

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

interface Props {
  onEnded: () => void;
}

const WhatsAppAudioPlayer = ({ onEnded }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState<1 | 1.5>(1);

  const progress = duration > 0 ? currentTime / duration : 0;

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setCurrent(el.currentTime);
    const onMeta = () => setDuration(el.duration);
    const onEnd = () => {
      setPlaying(false);
      onEnded();
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
    };
  }, [onEnded]);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      el.play();
    }
    setPlaying(!playing);
  }, [playing]);

  const toggleSpeed = useCallback(() => {
    const next = speed === 1 ? 1.5 : 1;
    setSpeed(next as 1 | 1.5);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }, [speed]);

  const activeBar = Math.floor(progress * WAVEFORM_BARS.length);

  return (
    <div className="flex justify-start">
      <motion.div
        className="flex items-center gap-2 px-2 py-2 rounded-lg rounded-tl-sm"
        style={{ backgroundColor: "#FFFFFF", maxWidth: 280 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <audio ref={audioRef} src="/audio/whatsapp-voice.mp3" preload="metadata" />

        {/* Play / Pause */}
        <button
          onClick={toggle}
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#25D366" }}
        >
          {playing ? (
            <Pause className="w-4 h-4 text-white fill-white" />
          ) : (
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          )}
        </button>

        {/* Waveform + time */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          {/* Bars */}
          <div className="flex items-end gap-[2px] h-5">
            {WAVEFORM_BARS.map((h, i) => (
              <div
                key={i}
                className="rounded-full transition-colors duration-150"
                style={{
                  width: 3,
                  height: h * 1.6,
                  backgroundColor: i <= activeBar ? "#25D366" : "#B0B0B0",
                }}
              />
            ))}
          </div>
          {/* Timer */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500">
              {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : "0:00"}
            </span>
            <button
              onClick={toggleSpeed}
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: "#E8E8E8", color: "#333" }}
            >
              {speed}x
            </button>
          </div>
        </div>

        {/* Contact avatar */}
        <div
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #005F73, #00BCD4)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 12h3l1.5-3 2 6 2-4 1.5 1h2"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

export default WhatsAppAudioPlayer;
