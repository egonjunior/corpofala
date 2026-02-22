import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PATTERN_NAMES } from "@/data/readerContent";
import { haptic } from "@/lib/haptics";
import { clickSoft, chimeSuccess } from "@/lib/audio";

interface PatternSliderProps {
  patternKey: string;
  patternIndex: number;
  initialValue: number;
  onSave: (value: number) => void;
  darkMode: boolean;
}

function getReactiveText(value: number): { text: string; color: string; intensity: string } {
  if (value <= 30) return { text: "Esse padrão opera pouco em você.", color: "#8A7A70", intensity: "baixa" };
  if (value <= 60) return { text: "Alguns aspectos ressoam.", color: "#8A7A70", intensity: "moderada" };
  if (value <= 85) return { text: "Esse padrão está presente na sua história.", color: "#5A4A50", intensity: "forte" };
  return { text: "Esse padrão é central para você.", color: "#C4622D", intensity: "extrema" };
}

const PatternSlider = ({ patternKey, patternIndex, initialValue, onSave, darkMode }: PatternSliderProps) => {
  const [value, setValue] = useState(initialValue);
  const [moved, setMoved] = useState(initialValue > 0);
  const [saved, setSaved] = useState(false);
  const lastHapticRef = useRef(0);

  const reactive = getReactiveText(value);
  const isHigh = value >= 86;

  const handleChange = (newValue: number) => {
    setValue(newValue);
    if (!moved) setMoved(true);

    // Haptic feedback every 10 points
    const roundedNew = Math.floor(newValue / 10);
    if (roundedNew !== lastHapticRef.current) {
      lastHapticRef.current = roundedNew;
      haptic("selection");
    }
  };

  const handleSave = () => {
    haptic("success");
    chimeSuccess();
    onSave(value);
    setSaved(true);
  };

  if (saved) {
    return (
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
    );
  }

  const borderColor = isHigh ? "#C4622D" : darkMode ? "rgba(0,188,212,0.12)" : "rgba(0,188,212,0.08)";

  // Gradient color based on value
  const sliderHue = value > 85 ? "196,98,45" : "0,188,212";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: darkMode ? "rgba(0,188,212,0.04)" : "rgba(0,188,212,0.02)",
        border: `1px solid ${borderColor}`,
        borderRadius: 14,
        padding: 28,
        margin: "36px 0",
        transition: "border-color 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle glow when high */}
      {isHigh && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.06 }}
          style={{
            position: "absolute",
            inset: -20,
            background: "radial-gradient(circle at center, rgba(196,98,45,0.3), transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          color: "#00BCD4",
          letterSpacing: "0.2em",
          display: "block",
          marginBottom: 10,
          position: "relative",
        }}
      >
        RECONHECIMENTO · PADRÃO {patternIndex}
      </span>

      <p
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontStyle: "italic",
          fontSize: 18,
          color: darkMode ? "rgba(255,255,255,0.9)" : "#1A1520",
          marginBottom: 24,
          position: "relative",
        }}
      >
        Você se reconhece neste padrão?
      </p>

      {/* Slider */}
      <div style={{ margin: "24px 0", position: "relative" }}>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          style={{
            width: "100%",
            height: 4,
            appearance: "none",
            background: `linear-gradient(90deg, rgba(${sliderHue},0.3) 0%, rgba(${sliderHue},1) ${value}%, ${darkMode ? "rgba(255,255,255,0.08)" : "#E0D5CB"
              } ${value}%, ${darkMode ? "rgba(255,255,255,0.08)" : "#E0D5CB"} 100%)`,
            borderRadius: 2,
            outline: "none",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          className="reader-slider"
        />
        <div className="flex justify-between mt-3">
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: darkMode ? "rgba(255,255,255,0.25)" : "#B0A090" }}>
            Nada a ver comigo
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: darkMode ? "rgba(255,255,255,0.25)" : "#B0A090" }}>
            Sou eu completamente
          </span>
        </div>
      </div>

      {/* Value display */}
      <motion.p
        key={value}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.15 }}
        className="text-center"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 20,
          color: isHigh ? "#C4622D" : "#00BCD4",
          marginBottom: 8,
          transition: "color 0.3s",
          fontWeight: 500,
          position: "relative",
        }}
      >
        {value}
      </motion.p>

      {/* Reactive text */}
      <AnimatePresence mode="wait">
        {moved && (
          <motion.p
            key={reactive.text}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="text-center"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontStyle: "italic",
              color: darkMode ? "rgba(255,255,255,0.5)" : reactive.color,
              transition: "color 0.3s",
              marginBottom: 20,
              position: "relative",
            }}
          >
            {reactive.text}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Save button */}
      {moved && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "#00BCD4",
              background: "transparent",
              border: "1px solid rgba(0,188,212,0.3)",
              borderRadius: 10,
              padding: "10px 20px",
              cursor: "pointer",
              transition: "all 0.3s",
              letterSpacing: "0.01em",
            }}
          >
            Registrar e continuar
          </motion.button>
        </motion.div>
      )}

      <style>{`
        .reader-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${isHigh ? "#C4622D" : "#00BCD4"};
          border: 2.5px solid white;
          box-shadow: 0 2px 12px ${isHigh ? "rgba(196,98,45,0.4)" : "rgba(0,188,212,0.4)"};
          cursor: pointer;
          transition: all 0.3s;
        }
        .reader-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${isHigh ? "#C4622D" : "#00BCD4"};
          border: 2.5px solid white;
          box-shadow: 0 2px 12px ${isHigh ? "rgba(196,98,45,0.4)" : "rgba(0,188,212,0.4)"};
          cursor: pointer;
        }
      `}</style>
    </motion.div>
  );
};

export default PatternSlider;
