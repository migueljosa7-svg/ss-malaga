import { useEffect, useState } from "react";
import type { Hermandad } from "@/types/hermandad";

/**
 * v7.0 — Trazado exacto por callejero (OSRM + OpenStreetMap).
 *
 * Pide a una instancia OSRM pública la ruta a PIE entre los puntos clave del
 * itinerario; la respuesta `overview=full&geometries=geojson` devuelve una
 * polilínea Densa que discurre por el eje real de las calles (Carrera del
 * Darro, Gran Vía de Colón, Carrera de la Virgen, Ganivet…), rodeando las
 * manzanas sin cortarlas.
 *
 * Cascada de servicio:
 *   1. Instancia OSRM a pie (routing.openstreetmap.de / routed-foot)
 *   2. Demo OSRM en coche (router.project-osrm.org) — sigue calles, peor perfil
 *   3. null → el mapa cae en el grafo local de esquinas (lib/data/calles-granada)
 *
 * Todo se memoriza en caché para no saturar las instancias públicas.
 */

type Punto = [number, number];

const ENDPOINTS = [
  "https://routing.openstreetmap.de/routed-foot/route/v1/foot",
  "https://router.project-osrm.org/route/v1/driving",
];

const TIMEOUT_MS = 7000;
const cache = new Map<string, Punto[] | null>();

function clave(puntos: Array<{ lat: number; lng: number }>): string {
  return puntos.map((p) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`).join(";");
}

async function pedirRuta(
  base: string,
  puntos: Array<{ lat: number; lng: number }>
): Promise<Punto[] | null> {
  const coords = puntos.map((p) => `${p.lng.toFixed(6)},${p.lat.toFixed(6)}`).join(";");
  const url = `${base}/${coords}?overview=full&geometries=geojson&steps=false&alternatives=false`;
  const ctrl = new AbortController();
  const reloj = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      code?: string;
      routes?: Array<{ geometry?: { coordinates?: number[][] } }>;
    };
    const coordsRuta = json.routes?.[0]?.geometry?.coordinates;
    if (json.code !== "Ok" || !Array.isArray(coordsRuta)) return null;
    // GeoJSON es [lng, lat] → convertir a [lat, lng] de Leaflet
    const ruta: Punto[] = coordsRuta.map((c) => [c[1], c[0]] as Punto);
    return ruta.length >= 2 ? ruta : null;
  } catch {
    return null;
  } finally {
    clearTimeout(reloj);
  }
}

/**
 * Devuelve la polilínea densa por calles de un itinerario (o null si las
 * instancias OSRM no responden y hay que usar el grafo local).
 */
export async function rutaCallejera(
  puntos: Array<{ lat: number; lng: number }>
): Promise<Punto[] | null> {
  if (puntos.length < 2) return null;
  const key = clave(puntos);
  if (cache.has(key)) return cache.get(key) ?? null;
  let ruta: Punto[] | null = null;
  for (const base of ENDPOINTS) {
    ruta = await pedirRuta(base, puntos);
    if (ruta) break;
  }
  cache.set(key, ruta);
  return ruta;
}

/**
 * Hook: resuelve las rutas OSRM de las hermandades visibles.
 * Devuelve un mapa slug → polilínea; los tronos sin ruta OSRM usan
 * `itinerarioRealista` (fallback local) en el componente.
 */
export function useRutasCallejeras(visibles: Hermandad[]): Record<string, Punto[]> {
  const [rutas, setRutas] = useState<Record<string, Punto[]>>({});

  useEffect(() => {
    let cancelado = false;
    (async () => {
      for (const h of visibles) {
        const ruta = await rutaCallejera(h.itinerario);
        if (cancelado) return;
        if (ruta) {
          setRutas((prev) => (prev[h.slug] ? prev : { ...prev, [h.slug]: ruta }));
        }
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [visibles]);

  return rutas;
}