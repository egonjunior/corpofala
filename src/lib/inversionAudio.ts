// Web Audio synthesis for Dinâmica 5 — Inverter

let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext => {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
};

/** Subliminal writing tone — critical (285Hz pulsing) or compassionate (528Hz stable) */
export const startWritingTone = (mode: "critical" | "compassionate"): (() => void) => {
  const ctx = getCtx();
  const freq = mode === "critical" ? 285 : 528;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.value = 0.02;
  osc.start();

  let interval: NodeJS.Timeout | null = null;
  if (mode === "critical") {
    interval = setInterval(() => {
      const t = ctx.currentTime;
      gain.gain.setValueAtTime(0.02, t);
      gain.gain.linearRampToValueAtTime(0.035, t + 0.15);
      gain.gain.linearRampToValueAtTime(0.015, t + 0.4);
    }, 800 + Math.random() * 400);
  }

  return () => {
    if (interval) clearInterval(interval);
    try {
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  };
};

/** The transmutation sound — 285Hz→528Hz glissando with harp and pad */
export const playTransmutationSound = () => {
  const ctx = getCtx();
  const duration = 10;
  const now = ctx.currentTime;

  // Layer 1 — glissando 285→528Hz
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(285, now);
  osc1.frequency.exponentialRampToValueAtTime(528, now + duration * 0.7);
  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.06, now + 0.5);
  gain1.gain.setValueAtTime(0.06, now + duration * 0.7);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.85);
  osc1.start(now);
  osc1.stop(now + duration);

  // Layer 2 — harp harmonics
  const harpNotes = [528, 660, 792, 1056, 1320];
  harpNotes.forEach((freq, i) => {
    const d = 0.5 + i * 0.6 + Math.random() * 0.4;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + d);
    gain.gain.linearRampToValueAtTime(0.025, now + d + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + d + 1.5);
    osc.start(now + d);
    osc.stop(now + d + 2);

    // Second wave
    const d2 = d + 2.5 + Math.random() * 0.6;
    if (d2 < duration - 2) {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = "sine";
      osc2.frequency.value = freq * (1 + Math.random() * 0.1);
      gain2.gain.setValueAtTime(0, now + d2);
      gain2.gain.linearRampToValueAtTime(0.02, now + d2 + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + d2 + 1.2);
      osc2.start(now + d2);
      osc2.stop(now + d2 + 1.5);
    }
  });

  // Layer 3 — pad (filtered sawtooth)
  const padOsc = ctx.createOscillator();
  const padGain = ctx.createGain();
  const padFilter = ctx.createBiquadFilter();
  padOsc.connect(padFilter);
  padFilter.connect(padGain);
  padGain.connect(ctx.destination);
  padOsc.type = "sawtooth";
  padOsc.frequency.value = 264;
  padFilter.type = "lowpass";
  padFilter.frequency.value = 800;
  padFilter.Q.value = 2;
  padGain.gain.setValueAtTime(0, now);
  padGain.gain.linearRampToValueAtTime(0.03, now + 3);
  padGain.gain.setValueAtTime(0.03, now + duration * 0.65);
  padGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.8);
  padOsc.start(now);
  padOsc.stop(now + duration);
};

/** Confirmation chord for letter saved */
export const playConfirmationChord = () => {
  const ctx = getCtx();
  const t = ctx.currentTime;
  [528, 660, 792].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t + i * 0.08);
    gain.gain.linearRampToValueAtTime(0.05, t + i * 0.08 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 1.2);
    osc.start(t + i * 0.08);
    osc.stop(t + i * 0.08 + 1.5);
  });
};
