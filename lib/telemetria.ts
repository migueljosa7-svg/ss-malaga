// ---------- Telemetría de tronos (v1.0 Pro) ----------
import type { Hermandad } from "@/types/hermandad";

export interface Telemetria {
  estado: "antes" | "en_calle" | "despues";
  lat: number;
  lng: number;
  /** Tramo actual: "Entre X y Y" o nombre del punto si está parado */
  tramoActual: string;
  /** Último punto pasado (o el primero si aún no ha salido) */
  puntoCercano: string;
  /** Velocidad estimada en m/h */
  velocidadMH: number;
  /** Descripción del ritmo de marcha */
  ritmo: string;
  /** Distancia al próximo punto clave (m) */
  distanciaProximo: number;
  /** Tiempo estimado de llegada al próximo punto (min) */
  etaProximo: number;
  /** Nombre del próximo punto clave */
  proximoPunto: string;
}

function minutosDeHora(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Itinerario convertido a minutos acumulados gestionando el salto de medianoche. */
export function itinerarioEnMinutos(h: Hermandad): Array<{ nombre: string; lat: number; lng: number; min: number }> {
  const res: Array<{ nombre: string; lat: number; lng: number; min: number }> = [];
  let offset = 0;
  let prev = -1;
  for (const p of h.itinerario) {
    let m = minutosDeHora(p.horaTeorica) + offset;
    if (prev >= 0 && m < prev) {
      offset += 1440;
      m += 1440;
    }
    prev = m;
    res.push({ nombre: p.nombre, lat: p.lat, lng: p.lng, min: m });
  }
  return res;
}

/** Distancia Haversine en metros. */
export function distanciaMetros(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function ritmoDe(velocidadMH: number): string {
  if (velocidadMH < 250) return "Ritmo de marcha muy lento (estación)";
  if (velocidadMH < 400) return "Ritmo de marcha lento";
  if (velocidadMH < 650) return "Ritmo de marcha medio";
  return "Ritmo de marcha ágil";
}

/**
 * Calcula la telemetría completa de un trono (cruz de guía o palio) para un minuto dado.
 * Devuelve null si la hermandad no tiene itinerario.
 */
export function calcularTelemetria(h: Hermandad, minuto: number): Telemetria | null {
  const it = itinerarioEnMinutos(h);
  if (it.length === 0) return null;

  if (minuto <= it[0].min) {
    return {
      estado: "antes",
      lat: it[0].lat,
      lng: it[0].lng,
      tramoActual: `En su templo — salida prevista a las ${h.itinerario[0].horaTeorica}`,
      puntoCercano: it[0].nombre,
      velocidadMH: 0,
      ritmo: "En espera de la hora de salida",
      distanciaProximo: 0,
      etaProximo: it[0].min - minuto,
      proximoPunto: it[0].nombre,
    };
  }
  if (minuto >= it[it.length - 1].min) {
    const ult = it[it.length - 1];
    return {
      estado: "despues",
      lat: ult.lat,
      lng: ult.lng,
      tramoActual: "Recogido en su templo",
      puntoCercano: ult.nombre,
      velocidadMH: 0,
      ritmo: "Encierro finalizado",
      distanciaProximo: 0,
      etaProximo: 0,
      proximoPunto: "—",
    };
  }

  for (let i = 0; i < it.length - 1; i++) {
    const a = it[i];
    const b = it[i + 1];
    if (minuto >= a.min && minuto <= b.min) {
      const t = b.min === a.min ? 0 : (minuto - a.min) / (b.min - a.min);
      const lat = a.lat + (b.lat - a.lat) * t;
      const lng = a.lng + (b.lng - a.lng) * t;
      const distTramo = distanciaMetros(a.lat, a.lng, b.lat, b.lng);
      const minutosTramo = Math.max(1, b.min - a.min);
      const velocidadMH = distTramo / (minutosTramo / 60);
      const restanteMin = b.min - minuto;
      const distanciaProximo = Math.round(distTramo * (1 - t));
      return {
        estado: "en_calle",
        lat,
        lng,
        tramoActual: `Entre ${a.nombre} y ${b.nombre}`,
        puntoCercano: a.nombre,
        velocidadMH: Math.round(velocidadMH),
        ritmo: ritmoDe(velocidadMH),
        distanciaProximo,
        etaProximo: Math.max(0, Math.round(restanteMin)),
        proximoPunto: b.nombre,
      };
    }
  }
  return null;
}

/** Interpolación simple de posición (compatibilidad con el mapa). */
export function posicionEnMinuto(
  h: Hermandad,
  minuto: number
): { lat: number; lng: number; estado: "antes" | "en_calle" | "despues" } | null {
  const t = calcularTelemetria(h, minuto);
  return t ? { lat: t.lat, lng: t.lng, estado: t.estado } : null;
}
