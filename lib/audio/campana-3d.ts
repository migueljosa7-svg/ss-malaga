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

/** Centro por defecto del mapa de Granada (posición del "oyente"). */
export const CENTRO_GRANADA: PosicionGeo = { lat: 37.17733, lng: -3.59856 };

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
/**
 * v4.0 "Audio Auténtico": cascada de carga de toques de campana de trono.
 * Prioriza grabaciones reales en /public/audio/campana/
 * (campana-3toques.mp3, campana-1.mp3) y solo si no hay red o el archivo no
 * responde, cae al sintetizador Web Audio API.
 */
const CAMPANA_REAL_CASCADA = [
  "/audio/campana/campana-3toques.mp3", // grabación de los 3 toques de mayordomo
  "/audio/campana/campana-1.mp3", // toque individual (se repite `toques` veces)
];

export async function tocarCampana3d(opts: {
  src?: string;
  toques?: number;
  posicion?: PosicionGeo | null;
  centro?: PosicionGeo;
} = {}): Promise<void> {
  const {
    src = "/audio/campana/campana-3toques.mp3",
    toques = 3,
    posicion = null,
    centro = CENTRO_GRANADA,
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

  // v4.0: cascada de audio real — primero la grabación de 3 toques, luego el
  // toque individual repetido, luego la fuente indicada y, si todo falla o es
  // mudo, el sintetizador Web Audio API como último recurso.
  let buffer: AudioBuffer | null = null;
  for (const candidato of [...CAMPANA_REAL_CASCADA, src]) {
    buffer = await obtenerBuffer(ctx, candidato);
    if (buffer) {
      const ahora = ctx.currentTime;
      const es3Toques = candidato.endsWith("campana-3toques.mp3");
      const repeticiones = es3Toques ? Math.max(1, Math.ceil(toques / 3)) : candidato.endsWith("campana-1.mp3") ? toques : toques;
      for (let i = 0; i < repeticiones; i++) {
        const fuente = ctx.createBufferSource();
        fuente.buffer = buffer;
        fuente.connect(destino);
        fuente.start(ahora + i * 0.7);
      }
      return;
    }
  }

  // Sin audio real disponible → campana sintética de respaldo por el mismo
  // canal (conserva la posición 3D si hay `posicion`).
  tocarCampanaSintetica({ toques, destino });
}
