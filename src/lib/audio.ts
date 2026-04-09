/**
 * Utilitário de áudio — toca um bipe de feedback via Web Audio API.
 */
export function playBeep(type: "correct" | "wrong" | "click" = "click"): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const config = {
      correct: { freq: 660, type: "sine" as OscillatorType, duration: 0.4 },
      wrong:   { freq: 200, type: "square" as OscillatorType, duration: 0.4 },
      click:   { freq: 520, type: "sine" as OscillatorType, duration: 0.3 },
    };

    const { freq, type: waveType, duration } = config[type];

    osc.frequency.value = freq;
    osc.type = waveType;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Web Audio API não disponível — falha silenciosa
  }
}
