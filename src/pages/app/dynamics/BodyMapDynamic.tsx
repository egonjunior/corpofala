import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DynamicShell from "@/components/dynamics/DynamicShell";
import PostDynamicScreen from "@/components/dynamics/PostDynamicScreen";
import BodySilhouette from "@/components/dynamics/bodymap/BodySilhouette";
import { haptic } from "@/lib/haptics";
import {
  BODY_ZONES,
  BODY_ZONES_LIST,
  DYNAMICS,
  DYNAMIC_ROUTES,
  generateMapReflection,
  generateRecommendation,
  type DynamicId,
} from "@/data/dynamicsContent";

type Screen = "entry" | "mark" | "name" | "map" | "recommend" | "post";

// ─── Zone Sound Player ───────────────────────────────────────
const playZoneSound = (zoneId: string) => {
  const zone = BODY_ZONES[zoneId];
  if (!zone) return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = zone.sound.type;
    osc.frequency.value = zone.sound.frequency;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + zone.sound.duration / 1000);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + zone.sound.duration / 1000 + 0.1);
  } catch { }
};

const playConfirmSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [528, 660].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.6);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.7);
    });
  } catch { }
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const BodyMapDynamic = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("entry");
  const [markedZones, setMarkedZones] = useState<Set<string>>(new Set());
  const [sensationsMap, setSensationsMap] = useState<Record<string, string[]>>({});
  const [namingIndex, setNamingIndex] = useState(0);
  const [entryTextStep, setEntryTextStep] = useState(0);
  const [showSkipOption, setShowSkipOption] = useState(false);
  const startTime = useRef(Date.now());
  const [duration, setDuration] = useState(0);

  // ─── Entry text sequence ─────────────────────────────────
  useEffect(() => {
    if (screen !== "entry") return;
    const timers = [
      setTimeout(() => setEntryTextStep(1), 3200),
      setTimeout(() => setEntryTextStep(2), 5000),
      setTimeout(() => setEntryTextStep(3), 6800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [screen]);

  // ─── Show skip option after 10s on mark screen ──────────
  useEffect(() => {
    if (screen !== "mark") return;
    const timer = setTimeout(() => setShowSkipOption(true), 10000);
    return () => clearTimeout(timer);
  }, [screen]);

  // ─── Zone handlers ──────────────────────────────────────
  const handleMarkTap = useCallback((zoneId: string) => {
    setMarkedZones(prev => {
      const next = new Set(prev);
      if (next.has(zoneId)) {
        next.delete(zoneId);
        haptic("light");
      } else {
        next.add(zoneId);
        playZoneSound(zoneId);
        haptic("medium");
      }
      return next;
    });
  }, []);

  const markedArray = Array.from(markedZones);
  const currentNamingZone = markedArray[namingIndex] ? BODY_ZONES[markedArray[namingIndex]] : null;

  const handleSensationSelect = (sensation: string) => {
    const zoneId = markedArray[namingIndex];
    setSensationsMap(prev => {
      const current = prev[zoneId] || [];
      if (current.includes(sensation)) {
        return { ...prev, [zoneId]: current.filter(s => s !== sensation) };
      }
      return { ...prev, [zoneId]: [...current, sensation] };
    });
  };

  const advanceNaming = () => {
    if (namingIndex < markedArray.length - 1) {
      setNamingIndex(prev => prev + 1);
    } else {
      playConfirmSound();
      setScreen("map");
    }
  };

  const finishDynamic = () => {
    setDuration(Math.round((Date.now() - startTime.current) / 1000));
    setScreen("post");
  };

  const recommendation = generateRecommendation(markedArray, sensationsMap);
  const recDynamic = DYNAMICS[recommendation.dynamicId];
  const reflection = generateMapReflection(markedArray);

  // ═══════════════════════════════════════════════════════════
  // ATO 1 — ENTRADA
  // ═══════════════════════════════════════════════════════════
  if (screen === "entry") {
    return (
      <DynamicShell background="#07070E" showClose screenKey="entry">
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
          {/* Silhouette drawing animation */}
          <div className="relative">
            <BodySilhouette mode="draw" className="opacity-60" />
            <motion.div
              className="absolute inset-0"
              animate={{ scaleY: [1, 1.015, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "bottom" }}
            />
          </div>

          {/* Sequential text */}
          <div className="flex flex-col items-center gap-3 min-h-[140px]">
            <AnimatePresence>
              {entryTextStep >= 1 && (
                <motion.p
                  key="t1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "rgba(255,255,255,0.85)", textAlign: "center", fontStyle: "italic" }}
                >
                  Você não precisa saber o que sente.
                </motion.p>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {entryTextStep >= 2 && (
                <motion.p
                  key="t2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "rgba(255,255,255,0.85)", textAlign: "center", fontStyle: "italic" }}
                >
                  Seu corpo já sabe.
                </motion.p>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {entryTextStep >= 3 && (
                <motion.button
                  key="btn"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  onClick={() => { startTime.current = Date.now(); setScreen("mark"); }}
                  className="mt-4 px-10 py-3.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.8)",
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
          </div>
        </div>
      </DynamicShell>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // ATO 2 — MARCAÇÃO (direto, sem scan)
  // ═══════════════════════════════════════════════════════════
  if (screen === "mark") {
    return (
      <DynamicShell background="#07070E" showClose screenKey="mark">
        <div className="flex-1 flex flex-col items-center px-6 pt-2">
          {/* Header */}
          <div className="w-full mb-4">
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Onde você sente algo?
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
              Toque nas áreas onde sente tensão, dor ou desconforto.
            </p>
          </div>

          {/* Silhouette */}
          <div className="flex-1 flex items-center justify-center">
            <BodySilhouette
              mode="mark"
              markedZones={markedZones}
              onZoneTap={handleMarkTap}
            />
          </div>

          {/* Counter & Continue */}
          <div className="flex flex-col items-center gap-3 mb-6">
            {markedZones.size > 0 && (
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                {markedZones.size} área{markedZones.size !== 1 ? "s" : ""} marcada{markedZones.size !== 1 ? "s" : ""}
              </p>
            )}
            <AnimatePresence>
              {markedZones.size > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={() => { setNamingIndex(0); setScreen("name"); }}
                  className="px-10 py-3.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.8)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                  }}
                >
                  Continuar →
                </motion.button>
              )}
            </AnimatePresence>

            {/* Skip option after 10s with no marks */}
            <AnimatePresence>
              {showSkipOption && markedZones.size === 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    playConfirmSound();
                    setScreen("map");
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "rgba(255,255,255,0.35)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    textDecoration: "underline",
                    textUnderlineOffset: 4,
                    cursor: "pointer",
                  }}
                >
                  Não sinto nada específico — continuar
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DynamicShell>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // ATO 3 — NOMEAÇÃO
  // ═══════════════════════════════════════════════════════════
  if (screen === "name" && currentNamingZone) {
    const currentSensations = sensationsMap[currentNamingZone.id] || [];
    const isLast = namingIndex === markedArray.length - 1;

    return (
      <DynamicShell background="#07070E" showClose={false} screenKey={`name-${currentNamingZone.id}`}>
        <div className="flex-1 flex flex-col items-center px-6 pt-4">
          {/* Progress */}
          {markedArray.length > 1 && (
            <div className="w-full flex items-center gap-3 mb-6">
              <div className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "#00BCD4" }}
                  initial={false}
                  animate={{ width: `${((namingIndex + 1) / markedArray.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                {namingIndex + 1}/{markedArray.length}
              </p>
            </div>
          )}

          {/* Silhouette mini with active zone */}
          <div className="mb-6" style={{ maxWidth: 120 }}>
            <BodySilhouette
              mode="display"
              markedZones={new Set([currentNamingZone.id])}
              activeZone={currentNamingZone.id}
              className="opacity-50"
            />
          </div>

          {/* Question */}
          <motion.div
            key={currentNamingZone.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center gap-6 w-full max-w-sm"
          >
            <div className="text-center">
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: currentNamingZone.color, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
                {currentNamingZone.label}
              </p>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "rgba(255,255,255,0.85)", fontStyle: "italic" }}>
                O que você sente aqui?
              </p>
            </div>

            {/* Sensation pills */}
            <div className="flex flex-wrap gap-3 justify-center">
              {currentNamingZone.sensations.map((s, i) => {
                const isSelected = currentSensations.includes(s);
                return (
                  <motion.button
                    key={s}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.35 }}
                    onClick={() => handleSensationSelect(s)}
                    className="rounded-full px-6 py-3"
                    style={{
                      background: isSelected ? "rgba(196,98,45,0.2)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${isSelected ? "#C4622D" : "rgba(255,255,255,0.12)"}`,
                      color: isSelected ? "#C4622D" : "rgba(255,255,255,0.75)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 15,
                      transition: "all 0.25s ease",
                      boxShadow: isSelected ? "0 0 0 3px rgba(196,98,45,0.1)" : "none",
                    }}
                  >
                    {s}
                  </motion.button>
                );
              })}
            </div>

            {/* "Não sei" option */}
            <button
              onClick={() => {
                const zoneId = markedArray[namingIndex];
                setSensationsMap(prev => ({ ...prev, [zoneId]: ["Indefinido"] }));
                setTimeout(advanceNaming, 300);
              }}
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
              Não sei definir
            </button>

            {/* Continue */}
            <AnimatePresence>
              {currentSensations.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={advanceNaming}
                  className="mt-2 px-10 py-3.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.8)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                  }}
                >
                  {isLast ? "Ver meu mapa →" : "Próxima área →"}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </DynamicShell>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // ATO 4 — MAPA GERADO
  // ═══════════════════════════════════════════════════════════
  if (screen === "map") {
    return (
      <DynamicShell background="#0F0F1C" showClose screenKey="map">
        <div className="flex-1 flex flex-col items-center px-6 pt-4 pb-8 overflow-y-auto">
          {/* Silhouette with all marked zones */}
          <div className="mb-6">
            <BodySilhouette
              mode="display"
              markedZones={markedZones}
              sensationsMap={sensationsMap}
            />
          </div>

          {/* Legend */}
          <div className="w-full max-w-sm flex flex-col gap-2 mb-6">
            {markedArray.map(zoneId => {
              const zone = BODY_ZONES[zoneId];
              if (!zone) return null;
              const senses = sensationsMap[zoneId] || [];
              const emotionKey = senses[0]?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              const emotion = zone.emotionalMapping[emotionKey] || "";
              return (
                <motion.div
                  key={zoneId}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-r-lg py-3 px-4"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderLeft: `2px solid ${zone.color}`,
                  }}
                >
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    {zone.label}
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.9)", marginTop: 2 }}>
                    {senses.join(" · ")}
                  </p>
                  {emotion && (
                    <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 13, color: "rgba(255,255,255,0.45)", fontStyle: "italic", marginTop: 4 }}>
                      "{emotion}"
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Empty state */}
          {markedArray.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-sm text-center mb-8"
              style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: "rgba(255,255,255,0.7)", fontStyle: "italic", lineHeight: 1.6 }}
            >
              Hoje seu corpo não gritou. Isso também é informação. Volte quando quiser — ele vai estar aqui.
            </motion.p>
          )}

          {/* Reflection */}
          {reflection && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="max-w-sm text-center mb-8"
              style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: "rgba(255,255,255,0.8)", fontStyle: "italic", lineHeight: 1.6 }}
            >
              {reflection}
            </motion.p>
          )}

          {/* Actions */}
          <div className="w-full max-w-sm flex flex-col gap-3">
            {markedArray.length > 0 && (
              <button
                onClick={() => setScreen("recommend")}
                className="w-full py-3.5 rounded-xl"
                style={{ background: "#C4622D", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600 }}
              >
                Explorar o que fazer
              </button>
            )}
            <button
              onClick={finishDynamic}
              className="w-full py-3 rounded-xl"
              style={{
                background: markedArray.length === 0 ? "#C4622D" : "transparent",
                border: markedArray.length === 0 ? "none" : "1px solid rgba(255,255,255,0.15)",
                color: markedArray.length === 0 ? "#fff" : "rgba(255,255,255,0.6)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: markedArray.length === 0 ? 600 : 400,
              }}
            >
              {markedArray.length === 0 ? "Finalizar" : "Salvar e sair"}
            </button>
          </div>
        </div>
      </DynamicShell>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // RECOMENDAÇÃO PERSONALIZADA
  // ═══════════════════════════════════════════════════════════
  if (screen === "recommend") {
    return (
      <DynamicShell background="#0F0F1C" showClose screenKey="recommend">
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm rounded-2xl p-8"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#00BCD4", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
              Com base no seu mapa
            </p>

            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: "rgba(255,255,255,0.85)", fontStyle: "italic", lineHeight: 1.6, marginBottom: 24 }}>
              {recommendation.reason}
            </p>

            <button
              onClick={() => navigate(DYNAMIC_ROUTES[recommendation.dynamicId])}
              className="w-full py-3.5 rounded-xl mb-3"
              style={{ background: "#C4622D", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600 }}
            >
              {recDynamic.name} →
            </button>

            <button
              onClick={finishDynamic}
              className="w-full text-center"
              style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: 14, textDecoration: "underline", cursor: "pointer" }}
            >
              Ver todas as dinâmicas
            </button>
          </motion.div>
        </div>
      </DynamicShell>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // POST-DYNAMIC
  // ═══════════════════════════════════════════════════════════
  return (
    <DynamicShell background="#F2EDE4" showClose={false} screenKey="post" isDark={false}>
      <PostDynamicScreen
        dynamicId="bodymap"
        durationSeconds={duration}
        onRestart={() => {
          setScreen("entry");
          setMarkedZones(new Set());
          setSensationsMap({});
          setNamingIndex(0);
          setDuration(0);
          setEntryTextStep(0);
          setShowSkipOption(false);
        }}
      />
    </DynamicShell>
  );
};

export default BodyMapDynamic;
