import type { NodoRuta } from "./grafo-rutas";
import { nodosRuta } from "./grafo-rutas";

/**
 * Trazado realista por la trama urbana del Centro Histórico de Málaga (v4.0).
 * En lugar de dibujar líneas rectas punto a punto (que atraviesan manzanas),
 * cada segmento del itinerario se ajusta a las esquinas reales conocidas
 * (Larios, Constitución, Granada, Carretería, Alameda Principal, Tribuna de
 * los Pobres…). La interpolación del GPS sigue esos giros.
 */

/** Distancia perpendicular aproximada de un punto C al segmento AB (metros, equirectangular). */
function distanciaPerpendicular(c: NodoRuta, a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const kx = 111320 * Math.cos(((a.lat + b.lat) / 2) * (Math.PI / 180));
  const ky = 111320;
  const ax = a.lng * kx, ay = a.lat * ky;
  const bx = b.lng * kx, by = b.lat * ky;
  const cx = c.lng * kx, cy = c.lat * ky;
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(cx - ax, cy - ay);
  let t = ((cx - ax) * dx + (cy - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(cx - (ax + t * dx), cy - (ay + t * dy));
}

/** Proyección escalada t ∈ [0,1] de un punto sobre el segmento AB. */
function proyeccionT(c: NodoRuta, a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const kx = 111320 * Math.cos(((a.lat + b.lat) / 2) * (Math.PI / 180));
  const ky = 111320;
  const dx = (b.lng - a.lng) * kx, dy = (b.lat - a.lat) * ky;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return 0;
  const t = (((c.lng - a.lng) * kx) * dx + ((c.lat - a.lat) * ky) * dy) / len2;
  return Math.max(0, Math.min(1, t));
}

/** Distancia haversine en metros entre dos puntos. */
function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/**
 * Devuelve los puntos intermedios (esquinas reales) por los que pasa el
 * tramo A→B, ordenados a lo largo del recorrido. Solo se consideran esquinas
 * dentro de un corredor de 140 m del segmento (ancho de manzana del Centro).
 */
export function esquinasIntermedias(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): Array<{ lat: number; lng: number; nombre: string }> {
  const CORREDOR_M = 140;
  const candidatas = nodosRuta
    .map((n) => ({ nodo: n, dist: distanciaPerpendicular(n, a, b), t: proyeccionT(n, a, b) }))
    .filter((c) => c.dist <= CORREDOR_M && c.t > 0.02 && c.t < 0.98)
    .sort((x, y) => x.t - y.t);
  // Evita duplicar esquinas casi coincidentes (< 25 m entre sí en la proyección)
  const res: Array<{ lat: number; lng: number; nombre: string }> = [];
  let ultimaT = -1;
  for (const c of candidatas) {
    if (c.t - ultimaT < 0.03) continue;
    res.push({ lat: c.nodo.lat, lng: c.nodo.lng, nombre: c.nodo.nombre });
    ultimaT = c.t;
  }
  return res;
}

/** Polilínea realista completa de un tramo A→B: [A, ...esquinas, B]. */
export function polilineaTramo(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): Array<{ lat: number; lng: number }> {
  return [{ lat: a.lat, lng: a.lng }, ...esquinasIntermedias(a, b), { lat: b.lat, lng: b.lng }];
}

/**
 * Interpola la posición a lo largo de la polilínea realista del tramo,
 * según la fracción temporal t ∈ [0,1] y la distancia recorrida por calle
 * (el trono avanza a ritmo constante sobre el trazado urbano, no en línea recta).
 */
export function posicionEnPolilinea(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
  t: number
): { lat: number; lng: number; distanciaCalles: number } {
  const puntos = polilineaTramo(a, b);
  const tramos: number[] = [];
  let total = 0;
  for (let i = 0; i < puntos.length - 1; i++) {
    const d = haversine(puntos[i], puntos[i + 1]);
    tramos.push(d);
    total += d;
  }
  const objetivo = total * t;
  let acumulado = 0;
  for (let i = 0; i < tramos.length; i++) {
    if (objetivo <= acumulado + tramos[i] || i === tramos.length - 1) {
      const local = tramos[i] === 0 ? 0 : (objetivo - acumulado) / tramos[i];
      return {
        lat: puntos[i].lat + (puntos[i + 1].lat - puntos[i].lat) * local,
        lng: puntos[i].lng + (puntos[i + 1].lng - puntos[i].lng) * local,
        distanciaCalles: total,
      };
    }
    acumulado += tramos[i];
  }
  return { lat: b.lat, lng: b.lng, distanciaCalles: total };
}

/** Distancia real por calles (siguiendo esquinas) de un tramo A→B. */
export function distanciaPorCalles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  return posicionEnPolilinea(a, b, 0).distanciaCalles;
}
