/**
 * Sintetizador Web Audio API de respaldo (v3.0).
 * Si un archivo .mp3 de /public/audio/ no contiene audio real (placeholders de
 * 2 KB) o falla su carga, se sintetiza el sonido con OscillatorNodes para que
 * la experiencia nunca sea muda.
 */
import { getAudioContext } from "./campana-3d";

/** Detecta si un AudioBuffer contiene silencio (archivos placeholder corruptos). */
export function bufferEsSilencioso(buffer: AudioBuffer): boolean {
  const datos = buffer.getChannelData(0);
  const muestra = Math.min(datos.length, 4096 * 4);
  let max = 0;
  for (let i = 0; i < muestra; i++) max = Math.max(max, Math.abs(datos[i]));
  return max < 0.001;
}

/** Intenta decodificar; devuelve null si falla o si el audio es mudo. */
export async function decodificarValidandoSilencio(ctx: AudioContext, src: string): Promise<AudioBuffer | null> {
  try {
    const res = await fetch(src, { mode: "same-origin" });
    if (!res.ok) return null;
    const buffer = await ctx.decodeAudioData(await res.arrayBuffer());
    if (bufferEsSilencioso(buffer)) return null;
    return buffer;
  } catch {
    return null;
  }
}

/**
 * Campana de trono sintética: 3 toques metálicos con armónicos inarmónicos
 * (fundamental ~880 Hz + parciales 1760 / 2640 Hz) y decaimiento progresivo,
 * simulando el bronce de una campana de mayordomo.
 */
export function tocarCampanaSintetica(opts: {
  toques?: number;
  destino?: AudioNode | null;
  cuando?: number;
} = {}): void {
  const { toques = 3, destino = null, cuando = 0 } = opts;
  const ctx = getAudioContext();
  if (!ctx) return;
  const salida = destino ?? ctx.destination;
  const t0 = cuando || ctx.currentTime;

  const parciales = [880, 1760, 2640]; // fundamental + armónicos metálicos
  const ganancias = [0.5, 0.3, 0.18];

  for (let i = 0; i < toques; i++) {
    const inicio = t0 + i * 0.7;
    const maestro = ctx.createGain();
    maestro.gain.value = 0.9;
    maestro.connect(salida);

    parciales.forEach((freq, j) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * (1 + (Math.random() - 0.5) * 0.004), inicio);
      // Decaimiento progresivo más rápido en los armónicos agudos (como el bronce real)
      const dur = 1.4 - j * 0.3;
      gain.gain.setValueAtTime(0, inicio);
      gain.gain.linearRampToValueAtTime(ganancias[j] / (i * 0.25 + 1), inicio + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, inicio + dur);
      osc.connect(gain).connect(maestro);
      osc.start(inicio);
      osc.stop(inicio + dur + 0.05);
    });
  }
}

/**
 * Marcha procesional sintética de respaldo: tambor grave + campanillas en
 * un patrón 4/4 solemne, para cuando el .mp3 de la marcha es mudo.
 * Devuelve la duración total en segundos.
 */
export function tocarMarchaSintetica(duracion = 24): number {
  const ctx = getAudioContext();
  if (!ctx) return 0;
  const t0 = ctx.currentTime + 0.05;
  const master = ctx.createGain();
  master.gain.value = 0.7;
  master.connect(ctx.destination);

  const bpm = 72;
  const beat = 60 / bpm;
  const compases = Math.ceil(duracion / (beat * 4));

  // Escala frigia solemne (típica de marchas procesionales)
  const escala = [220, 246.94, 261.63, 293.66, 329.63, 349.23, 415.3];
  const patron = [0, 2, 4, 2, 5, 4, 2, 0];

  for (let c = 0; c < compases; c++) {
    const base = t0 + c * beat * 4;
    for (let b = 0; b < 4; b++) {
      const t = base + b * beat;
      // Bombo grave
      const bombo = ctx.createOscillator();
      const gBombo = ctx.createGain();
      bombo.type = "sine";
      bombo.frequency.setValueAtTime(90, t);
      bombo.frequency.exponentialRampToValueAtTime(45, t + 0.25);
      gBombo.gain.setValueAtTime(0.8, t);
      gBombo.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      bombo.connect(gBombo).connect(master);
      bombo.start(t);
      bombo.stop(t + 0.35);

      // Redoble de caja (ruido corto simulado con onda triangular aguda)
      for (let r = 0; r < 2; r++) {
        const caja = ctx.createOscillator();
        const gCaja = ctx.createGain();
        caja.type = "triangle";
        caja.frequency.value = 320 + Math.random() * 60;
        const tc = t + r * beat * 0.5;
        gCaja.gain.setValueAtTime(0.12, tc);
        gCaja.gain.exponentialRampToValueAtTime(0.001, tc + 0.12);
        caja.connect(gCaja).connect(master);
        caja.start(tc);
        caja.stop(tc + 0.15);
      }

      // Melodía de cornetas
      const nota = patron[(c * 4 + b) % patron.length];
      const corneta = ctx.createOscillator();
      const gCorneta = ctx.createGain();
      corneta.type = "sawtooth";
      corneta.frequency.value = escala[nota];
      const filtro = ctx.createBiquadFilter();
      filtro.type = "lowpass";
      filtro.frequency.value = 1200;
      gCorneta.gain.setValueAtTime(0, t);
      gCorneta.gain.linearRampToValueAtTime(0.22, t + 0.04);
      gCorneta.gain.setValueAtTime(0.22, t + beat * 0.7);
      gCorneta.gain.exponentialRampToValueAtTime(0.001, t + beat * 0.95);
      corneta.connect(filtro).connect(gCorneta).connect(master);
      corneta.start(t);
      corneta.stop(t + beat);
    }
  }
  return compases * beat * 4;
}
