// Web Audio synthesis for Dinâmica 4 — Soltar

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
};

const createReverbBuffer = (ctx: AudioContext, duration: number): AudioBuffer => {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const impulse = ctx.createBuffer(2, length, sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
    }
  }
  return impulse;
};

/** Release sound — wind + fall + dissolution + 528Hz echo */
export const playReleaseSound = () => {
  const ctx = getAudioContext();
  const t = ctx.currentTime;

  // ── Layer 1: WIND (ascending bandpass noise, 2.5s) ──
  const windDuration = 2.5;
  const windBuffer = ctx.createBuffer(1, ctx.sampleRate * windDuration, ctx.sampleRate);
  const windData = windBuffer.getChannelData(0);
  for (let i = 0; i < windData.length; i++) windData[i] = Math.random() * 2 - 1;

  const windSrc = ctx.createBufferSource();
  windSrc.buffer = windBuffer;

  const windFilter = ctx.createBiquadFilter();
  windFilter.type = "bandpass";
  windFilter.Q.value = 1.2;
  windFilter.frequency.setValueAtTime(200, t);
  windFilter.frequency.exponentialRampToValueAtTime(2000, t + 2.0);

  const windGain = ctx.createGain();
  windGain.gain.setValueAtTime(0, t);
  windGain.gain.linearRampToValueAtTime(0.08, t + 0.6);
  windGain.gain.setValueAtTime(0.08, t + 1.2);
  windGain.gain.exponentialRampToValueAtTime(0.001, t + windDuration);

  const windReverb = ctx.createConvolver();
  windReverb.buffer = createReverbBuffer(ctx, 2.0);
  const windReverbGain = ctx.createGain();
  windReverbGain.gain.value = 0.3;

  windSrc.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(windReverb);
  windReverb.connect(windReverbGain);
  windReverbGain.connect(ctx.destination);
  windGain.connect(ctx.destination);

  windSrc.start(t);
  windSrc.stop(t + windDuration + 0.1);

  // ── Layer 2: FALL / WHOOSH (descending sine, 1.5s) ──
  const fallOsc = ctx.createOscillator();
  fallOsc.type = "sine";
  fallOsc.frequency.setValueAtTime(180, t + 0.3);
  fallOsc.frequency.exponentialRampToValueAtTime(80, t + 1.8);

  const fallFilter = ctx.createBiquadFilter();
  fallFilter.type = "lowpass";
  fallFilter.frequency.setValueAtTime(600, t + 0.3);
  fallFilter.frequency.exponentialRampToValueAtTime(100, t + 1.8);

  const fallGain = ctx.createGain();
  fallGain.gain.setValueAtTime(0, t + 0.3);
  fallGain.gain.linearRampToValueAtTime(0.10, t + 0.4);
  fallGain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

  fallOsc.connect(fallFilter);
  fallFilter.connect(fallGain);
  fallGain.connect(ctx.destination);

  fallOsc.start(t + 0.3);
  fallOsc.stop(t + 2.0);

  // ── Layer 3: DISSOLUTION (6 staggered micro-oscillators + long reverb) ──
  const dissolutionReverb = ctx.createConvolver();
  dissolutionReverb.buffer = createReverbBuffer(ctx, 4.0);
  const dissolutionReverbGain = ctx.createGain();
  dissolutionReverbGain.gain.value = 0.6;
  dissolutionReverb.connect(dissolutionReverbGain);
  dissolutionReverbGain.connect(ctx.destination);

  for (let i = 0; i < 6; i++) {
    const delay = 0.5 + i * 0.12;
    const freq = 400 + Math.random() * 500;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t + delay);
    g.gain.linearRampToValueAtTime(0.015, t + delay + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.15);
    osc.connect(g);
    g.connect(dissolutionReverb);
    osc.start(t + delay);
    osc.stop(t + delay + 0.2);
  }

  // ── Layer 4: 528Hz ECHO (delayed 0.5s, subtle) ──
  const echoOsc = ctx.createOscillator();
  echoOsc.type = "sine";
  echoOsc.frequency.value = 528;

  const echoGain = ctx.createGain();
  echoGain.gain.setValueAtTime(0, t + 0.5);
  echoGain.gain.linearRampToValueAtTime(0.04, t + 0.6);
  echoGain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);

  const echoReverb = ctx.createConvolver();
  echoReverb.buffer = createReverbBuffer(ctx, 3.0);
  const echoReverbGain = ctx.createGain();
  echoReverbGain.gain.value = 0.4;
  echoReverb.connect(echoReverbGain);
  echoReverbGain.connect(ctx.destination);

  echoOsc.connect(echoGain);
  echoGain.connect(echoReverb);

  echoOsc.start(t + 0.5);
  echoOsc.stop(t + 2.5);
};

/** Capture tone — 285Hz, 300ms, subtle */
export const playCaptureSound = () => {
  const ctx = getAudioContext();
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.value = 285;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.06, t + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  osc.start(t); osc.stop(t + 0.35);
};

/** Hold heartbeat pulse — returns stop function */
export const startHoldPulse = (): (() => void) => {
  const ctx = getAudioContext();
  let running = true;

  const pulse = () => {
    if (!running) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 174;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.03, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.start(t); osc.stop(t + 0.5);
  };

  pulse();
  const interval = setInterval(pulse, 800);

  return () => {
    running = false;
    clearInterval(interval);
  };
};

/** Particle crystal sounds — falling fragments, grave and spaced */
export const playParticleSounds = () => {
  const ctx = getAudioContext();
  const count = 6 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = 300 + Math.random() * 350;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.018, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.start(t); osc.stop(t + 0.15);
    }, i * 120);
  }
};

/** Simple tone utility */
export const playTone = (freq: number, durationMs: number, vol: number = 0.06) => {
  const ctx = getAudioContext();
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, t + durationMs / 1000);
  osc.start(t);
  osc.stop(t + durationMs / 1000 + 0.05);
};
