import React, { createContext, useContext, useRef, useCallback, useMemo } from "react";

interface NarrativeAudioAPI {
  ensureContext: () => AudioContext | null;
  startTone528: () => void;
  stopTone528: (fadeTime?: number) => void;
  startHeartbeat: () => void;
  stopHeartbeat: (fadeTime?: number) => void;
  setHeartbeatVolume: (vol: number, rampTime?: number) => void;
  playClickSound: () => void;
  startScanTone: () => void;
  stopScanTone: () => void;
  silenceAll: (duration?: number) => void;
  resumeHeartbeat: () => void;
  startRingtone: () => void;
  stopRingtone: (fadeTime?: number) => void;
  stopAll: () => void;
}

const NarrativeAudioContext = createContext<NarrativeAudioAPI | null>(null);

export const useNarrativeAudio = () => {
  const ctx = useContext(NarrativeAudioContext);
  if (!ctx) throw new Error("useNarrativeAudio must be inside NarrativeAudioProvider");
  return ctx;
};

export const NarrativeAudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const tone528OscRef = useRef<OscillatorNode | null>(null);
  const tone528GainRef = useRef<GainNode | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);
  const heartbeatGainRef = useRef<GainNode | null>(null);
  const scanOscRef = useRef<OscillatorNode | null>(null);
  const scanGainRef = useRef<GainNode | null>(null);
  const scanLfoRef = useRef<OscillatorNode | null>(null);
  const ringtoneIntervalRef = useRef<number | null>(null);
  const ringtoneGainRef = useRef<GainNode | null>(null);
  const ringtoneActiveRef = useRef<boolean>(false);

  const ensureContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const startTone528 = useCallback(() => {
    const ctx = ensureContext();
    if (!ctx || tone528OscRef.current) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 528;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    tone528OscRef.current = osc;
    tone528GainRef.current = gain;
  }, [ensureContext]);

  const stopTone528 = useCallback((fadeTime = 1.5) => {
    const ctx = audioCtxRef.current;
    if (!ctx || !tone528GainRef.current || !tone528OscRef.current) return;
    const now = ctx.currentTime;
    tone528GainRef.current.gain.cancelScheduledValues(now);
    tone528GainRef.current.gain.setValueAtTime(tone528GainRef.current.gain.value, now);
    tone528GainRef.current.gain.linearRampToValueAtTime(0, now + fadeTime);
    const osc = tone528OscRef.current;
    setTimeout(() => { try { osc.stop(); } catch {} }, fadeTime * 1000 + 100);
    tone528OscRef.current = null;
    tone528GainRef.current = null;
  }, []);

  const playHeartbeatPulse = useCallback(() => {
    const ctx = audioCtxRef.current;
    const gain = heartbeatGainRef.current;
    if (!ctx || !gain) return;

    const now = ctx.currentTime;
    // "lub"
    const osc1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.value = 60;
    g1.gain.setValueAtTime(0, now);
    g1.gain.linearRampToValueAtTime(1, now + 0.01);
    g1.gain.linearRampToValueAtTime(0, now + 0.08);
    osc1.connect(g1);
    g1.connect(gain);
    osc1.start(now);
    osc1.stop(now + 0.1);

    // "dub"
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.value = 60;
    const dubStart = now + 0.28; // 80ms + 200ms gap
    g2.gain.setValueAtTime(0, dubStart);
    g2.gain.linearRampToValueAtTime(0.7, dubStart + 0.01);
    g2.gain.linearRampToValueAtTime(0, dubStart + 0.08);
    osc2.connect(g2);
    g2.connect(gain);
    osc2.start(dubStart);
    osc2.stop(dubStart + 0.1);
  }, []);

  const startHeartbeat = useCallback(() => {
    const ctx = ensureContext();
    if (!ctx || heartbeatIntervalRef.current) return;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.connect(ctx.destination);
    heartbeatGainRef.current = gain;
    playHeartbeatPulse();
    heartbeatIntervalRef.current = window.setInterval(playHeartbeatPulse, 1030);
  }, [ensureContext, playHeartbeatPulse]);

  const stopHeartbeat = useCallback((fadeTime = 1) => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    const ctx = audioCtxRef.current;
    if (ctx && heartbeatGainRef.current) {
      const now = ctx.currentTime;
      heartbeatGainRef.current.gain.cancelScheduledValues(now);
      heartbeatGainRef.current.gain.setValueAtTime(heartbeatGainRef.current.gain.value, now);
      heartbeatGainRef.current.gain.linearRampToValueAtTime(0, now + fadeTime);
    }
  }, []);

  const setHeartbeatVolume = useCallback((vol: number, rampTime = 2) => {
    const ctx = audioCtxRef.current;
    if (!ctx || !heartbeatGainRef.current) return;
    const now = ctx.currentTime;
    heartbeatGainRef.current.gain.cancelScheduledValues(now);
    heartbeatGainRef.current.gain.setValueAtTime(heartbeatGainRef.current.gain.value, now);
    heartbeatGainRef.current.gain.linearRampToValueAtTime(vol, now + rampTime);
  }, []);

  const silenceAll = useCallback((duration = 0.6) => {
    // Temporarily mute heartbeat
    const ctx = audioCtxRef.current;
    if (!ctx || !heartbeatGainRef.current) return;
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    heartbeatGainRef.current.gain.setValueAtTime(0, ctx.currentTime);
  }, []);

  const resumeHeartbeat = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || !heartbeatGainRef.current) return;
    heartbeatGainRef.current.gain.setValueAtTime(heartbeatGainRef.current.gain.value, ctx.currentTime);
    if (!heartbeatIntervalRef.current) {
      playHeartbeatPulse();
      heartbeatIntervalRef.current = window.setInterval(playHeartbeatPulse, 1030);
    }
  }, [playHeartbeatPulse]);

  const playClickSound = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 800;
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }, []);

  const startScanTone = useCallback(() => {
    const ctx = ensureContext();
    if (!ctx || scanOscRef.current) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 220;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1);

    // LFO modulates gain ±0.02 at 0.5Hz
    lfo.type = "sine";
    lfo.frequency.value = 0.5;
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    lfo.start();

    scanOscRef.current = osc;
    scanGainRef.current = gain;
    scanLfoRef.current = lfo;
  }, [ensureContext]);

  const stopScanTone = useCallback(() => {
    try { scanOscRef.current?.stop(); } catch {}
    try { scanLfoRef.current?.stop(); } catch {}
    scanOscRef.current = null;
    scanGainRef.current = null;
    scanLfoRef.current = null;
  }, []);

  const startRingtone = useCallback(() => {
    const ctx = ensureContext();
    if (!ctx || ringtoneActiveRef.current) return;
    ringtoneActiveRef.current = true;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.30, ctx.currentTime);
    masterGain.connect(ctx.destination);
    ringtoneGainRef.current = masterGain;

    // Classic iPhone "Opening/Reflection" style marimba pattern
    // Uses pentatonic notes with sharp attack and quick decay (marimba-like)
    const notes = [
      // Pattern 1 (ascending)
      { freq: 1175, delay: 0.00 },  // D6
      { freq: 1319, delay: 0.12 },  // E6
      { freq: 1568, delay: 0.24 },  // G6
      { freq: 1760, delay: 0.36 },  // A6
      { freq: 1568, delay: 0.52 },  // G6
      { freq: 1319, delay: 0.64 },  // E6
      // Pattern 2 (descending variation)
      { freq: 1760, delay: 0.90 },  // A6
      { freq: 1568, delay: 1.02 },  // G6
      { freq: 1319, delay: 1.14 },  // E6
      { freq: 1175, delay: 1.26 },  // D6
      { freq: 1319, delay: 1.42 },  // E6
      { freq: 1568, delay: 1.54 },  // G6
    ];

    const playPattern = () => {
      if (!ringtoneActiveRef.current || !ringtoneGainRef.current) return;
      const now = ctx.currentTime;

      notes.forEach(({ freq, delay }) => {
        // Main tone (fundamental)
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;

        // Sharp attack, quick decay (marimba envelope)
        g.gain.setValueAtTime(0, now + delay);
        g.gain.linearRampToValueAtTime(0.6, now + delay + 0.008);
        g.gain.exponentialRampToValueAtTime(0.15, now + delay + 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.35);

        osc.connect(g);
        g.connect(ringtoneGainRef.current!);
        osc.start(now + delay);
        osc.stop(now + delay + 0.4);

        // Second harmonic for richness
        const osc2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.value = freq * 2;
        g2.gain.setValueAtTime(0, now + delay);
        g2.gain.linearRampToValueAtTime(0.15, now + delay + 0.005);
        g2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.15);
        osc2.connect(g2);
        g2.connect(ringtoneGainRef.current!);
        osc2.start(now + delay);
        osc2.stop(now + delay + 0.2);

        // Third harmonic (subtle, adds shimmer)
        const osc3 = ctx.createOscillator();
        const g3 = ctx.createGain();
        osc3.type = "sine";
        osc3.frequency.value = freq * 4;
        g3.gain.setValueAtTime(0, now + delay);
        g3.gain.linearRampToValueAtTime(0.04, now + delay + 0.003);
        g3.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);
        osc3.connect(g3);
        g3.connect(ringtoneGainRef.current!);
        osc3.start(now + delay);
        osc3.stop(now + delay + 0.1);
      });
    };

    playPattern();
    ringtoneIntervalRef.current = window.setInterval(playPattern, 2800);
  }, [ensureContext]);

  const stopRingtone = useCallback((fadeTime = 0) => {
    ringtoneActiveRef.current = false;
    if (ringtoneIntervalRef.current) {
      clearInterval(ringtoneIntervalRef.current);
      ringtoneIntervalRef.current = null;
    }
    const ctx = audioCtxRef.current;
    if (ctx && ringtoneGainRef.current) {
      const now = ctx.currentTime;
      ringtoneGainRef.current.gain.cancelScheduledValues(now);
      if (fadeTime > 0) {
        ringtoneGainRef.current.gain.setValueAtTime(ringtoneGainRef.current.gain.value, now);
        ringtoneGainRef.current.gain.linearRampToValueAtTime(0, now + fadeTime);
        setTimeout(() => {
          try { ringtoneGainRef.current?.disconnect(); } catch {}
          ringtoneGainRef.current = null;
        }, fadeTime * 1000 + 100);
      } else {
        ringtoneGainRef.current.gain.setValueAtTime(0, now);
        try { ringtoneGainRef.current.disconnect(); } catch {}
        ringtoneGainRef.current = null;
      }
    }
  }, []);

  const stopAll = useCallback(() => {
    stopTone528(0);
    stopHeartbeat(0);
    stopScanTone();
    stopRingtone(0);
  }, [stopTone528, stopHeartbeat, stopScanTone, stopRingtone]);

  const api: NarrativeAudioAPI = useMemo(() => ({
    ensureContext,
    startTone528,
    stopTone528,
    startHeartbeat,
    stopHeartbeat,
    setHeartbeatVolume,
    playClickSound,
    startScanTone,
    stopScanTone,
    silenceAll,
    resumeHeartbeat,
    startRingtone,
    stopRingtone,
    stopAll,
  }), [ensureContext, startTone528, stopTone528, startHeartbeat, stopHeartbeat, setHeartbeatVolume, playClickSound, startScanTone, stopScanTone, silenceAll, resumeHeartbeat, startRingtone, stopRingtone, stopAll]);

  return (
    <NarrativeAudioContext.Provider value={api}>
      {children}
    </NarrativeAudioContext.Provider>
  );
};
