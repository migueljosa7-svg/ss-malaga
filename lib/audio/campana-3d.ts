import { decodificarValidandoSilencio, tocarCampanaSintetica } from "./sintetizador";

/**
 * Audio 3D posicional para toques de campana (v2.0 Max).
 * Usa un PannerNode HRTF de la Web Audio API para orientar el sonido según la
 * posición geográfica del trono respecto al centro del mapa.
 * v3.0: si el archivo .mp3 no existe o es mudo (placeholder vacío), se
 * sintetiza la campana con OscillatorNodes como respaldo — nunca queda muda.
 */

export interface PosicionGeo {
  lat: number;
  lng: number;
}

/** Centro por defecto del mapa de Málaga (posición del "oyente"). */
export const CENTRO_MALAGA: PosicionGeo = { lat: 36.7213, lng: -4.4214 };

let audioCtx: AudioContext | null = null;
const bufferCache = new Map<string, AudioBuffer>();

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  return audioCtx;
}

async function obtenerBuffer(ctx: AudioContext, src: string): Promise<AudioBuffer | null> {
  const cacheado = bufferCache.get(src);
  if (cacheado) return cacheado;
  // v3.0: valida silencio; los .mp3 placeholder (2 KB vacíos) devuelven null
  const buffer = await decodificarValidandoSilencio(ctx, src);
  if (buffer) bufferCache.set(src, buffer);
  return buffer;
}

/** Desplazamiento en metros (x = este, y = norte) respecto al centro. */
function desplazamientoRelativo(pos: PosicionGeo, centro: PosicionGeo): { x: number; y: number } {
  const metrosPorGradoLat = 111320;
  const metrosPorGradoLng = 111320 * Math.cos((centro.lat * Math.PI) / 180);
  return {
    x: (pos.lng - centro.lng) * metrosPorGradoLng,
    y: (pos.lat - centro.lat) * metrosPorGradoLat,
  };
}

/**
 * Toca la campana con toques tradicionales (3 por defecto).
 * Si se indica `posicion`, el sonido se orienta en 3D con HRTF según su
 * ubicación respecto a `centro` (el usuario "está" en el centro del mapa).
 * Lanza excepción si Web Audio no está disponible; el llamador debe hacer fallback.
 */
export async function tocarCampana3d(opts: {
  src?: string;
  toques?: number;
  posicion?: PosicionGeo | null;
  centro?: PosicionGeo;
} = {}): Promise<void> {
  const {
    src = "/audio/campana-trono.mp3",
    toques = 3,
    posicion = null,
    centro = CENTRO_MALAGA,
  } = opts;

  const ctx = getAudioContext();
  if (!ctx) throw new Error("Web Audio API no disponible");
  if (ctx.state === "suspended") await ctx.resume();

  // Oyente en el origen, mirando al norte (hacia -Z)
  const listener = ctx.listener;
  if (listener.forwardX) {
    listener.forwardX.value = 0;
    listener.forwardY.value = 0;
    listener.forwardZ.value = -1;
    listener.upX.value = 0;
    listener.upY.value = 1;
    listener.upZ.value = 0;
  } else {
    listener.setOrientation(0, 0, -1, 0, 1, 0);
  }

  let destino: AudioNode = ctx.destination;
  if (posicion) {
    const { x, y } = desplazamientoRelativo(posicion, centro);
    const panner = ctx.createPanner();
    panner.panningModel = "HRTF";
    panner.distanceModel = "inverse";
    panner.refDistance = 40;
    panner.maxDistance = 1500;
    panner.rolloffFactor = 1.2;
    // Escalamos la distancia geográfica al radio de escucha (±4 m) para que
    // la orientación sea claramente perceptible dentro del mapa.
    const hipotenusa = Math.max(50, Math.hypot(x, y));
    const escala = 4 / hipotenusa;
    const px = x * escala;
    const pz = -y * escala; // norte = delante del oyente (-Z)
    if (panner.positionX) {
      panner.positionX.value = px;
      panner.positionZ.value = pz;
    } else {
      panner.setPosition(px, 0, pz);
    }
    panner.connect(ctx.destination);
    destino = panner;
  }

  const buffer = await obtenerBuffer(ctx, src);
  const ahora = ctx.currentTime;
  if (!buffer) {
    // v3.0: el archivo no existe o es mudo → campana sintética de respaldo
    // por el mismo canal (conserva la posición 3D si hay `posicion`).
    tocarCampanaSintetica({ toques, destino });
    return;
  }
  for (let i = 0; i < toques; i++) {
    const fuente = ctx.createBufferSource();
    fuente.buffer = buffer;
    fuente.connect(destino);
    fuente.start(ahora + i * 0.7);
  }
}
