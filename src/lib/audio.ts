/**
 * Minimal, elegant audio feedback system using Web Audio API.
 * Inspired by Apple's attention to sonic detail.
 * No external files — all tones are synthesised on the fly.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
}

/* ── Tone primitives ─────────────────────────────────── */

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.12) {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);

    gain.gain.setValueAtTime(0, c.currentTime);
    gain.gain.linearRampToValueAtTime(vol, c.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);

    osc.connect(gain).connect(c.destination);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
}

/* ── Therapeutic frequencies ─────────────────────────── */

export const FREQUENCIES = {
    grounding: 174,    // Hz — foundation, security
    healing: 285,      // Hz — tissue regeneration
    liberation: 396,   // Hz — release guilt & fear
    change: 417,       // Hz — facilitating change
    transformation: 528, // Hz — love, DNA repair
    connection: 639,   // Hz — re-connecting relationships
    intuition: 741,    // Hz — awakening intuition
    spiritual: 852,    // Hz — spiritual order
} as const;

/* ── Sound effects (Apple-like micro-sounds) ─────────── */

/** Soft confirmation chime — like completing a step */
export function chimeSuccess() {
    const c = getCtx();
    const now = c.currentTime;

    [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.08, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
        osc.connect(gain).connect(c.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
    });
}

/** Subtle reveal sound — ascending arpeggio */
export function chimeReveal() {
    const c = getCtx();
    const now = c.currentTime;

    [392, 493.88, 587.33, 783.99].forEach((freq, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.06, now + i * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.6);
        osc.connect(gain).connect(c.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.6);
    });
}

/** Soft click — like Apple's keyboard tick */
export function clickSoft() {
    playTone(800, 0.05, 'sine', 0.04);
}

/** Completion — warm resolution chord */
export function chimeCompletion() {
    const c = getCtx();
    const now = c.currentTime;

    [261.63, 329.63, 392, 523.25].forEach((freq) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.connect(gain).connect(c.destination);
        osc.start(now);
        osc.stop(now + 1.2);
    });
}

/** Play a therapeutic frequency (sustained, gentle) */
export function playTherapeutic(freq: number, durationSec = 3, vol = 0.06) {
    playTone(freq, durationSec, 'sine', vol);
}

/** Breathing guide tone — fades in/out with the breath */
export function breathInOut(inhale: number, hold: number, exhale: number) {
    const c = getCtx();
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(174, now);

    const total = inhale + hold + exhale;

    // Inhale: fade in
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + inhale);
    // Hold: sustain
    gain.gain.setValueAtTime(0.06, now + inhale);
    // Exhale: fade out  
    gain.gain.linearRampToValueAtTime(0.001, now + inhale + hold + exhale);

    osc.connect(gain).connect(c.destination);
    osc.start(now);
    osc.stop(now + total + 0.1);
}
