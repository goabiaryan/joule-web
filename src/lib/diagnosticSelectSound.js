/** Soft UI tick on diagnostic answer taps (Web Audio, no asset). */

let audioContext = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioContext) audioContext = new Ctx();
  return audioContext;
}

function shouldPlaySound() {
  if (typeof window === "undefined") return false;
  try {
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return true;
  }
}

/**
 * Plays a short, low-volume tone. Must run from a user gesture (option click).
 */
export function playDiagnosticSelectSound({ complete = false } = {}) {
  if (!shouldPlaySound()) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  const start = ctx.currentTime;
  const duration = complete ? 0.11 : 0.075;
  const peak = complete ? 0.07 : 0.055;
  const freqStart = complete ? 784 : 880;
  const freqEnd = complete ? 988 : 720;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(freqStart, start);
  oscillator.frequency.exponentialRampToValueAtTime(freqEnd, start + duration * 0.85);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}
