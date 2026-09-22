/**
 * Radar de Cruces de Tronos (v2.0 Max).
 * Detecta automáticamente puntos clave donde dos cofradías se cruzan o se
 * acercan (< radioMetros) en un minuto dado, y predice los próximos
 * encuentros dentro de un horizonte temporal.
 */
import type { Hermandad } from "@/types/hermandad";
import { calcularTelemetria, distanciaMetros } from "@/lib/telemetria";

export interface TronoEnCalle {
  slug: string;
  hermandad: string;
  trono: "cristo" | "virgen";
  punto: string;
  lat: number;
  lng: number;
}

export interface CruceTronos {
  a: TronoEnCalle;
  b: TronoEnCalle;
  distancia: number; // metros
  lat: number; // punto medio del encuentro
  lng: number;
  minuto: number;
}

export interface CruceProximo extends CruceTronos {
  enMinutos: number;
}

function tronosEnCalle(h: Hermandad, minuto: number): TronoEnCalle[] {
  const res: TronoEnCalle[] = [];
  const cristo = calcularTelemetria(h, minuto);
  if (cristo?.estado === "en_calle") {
    res.push({
      slug: h.slug,
      hermandad: h.nombrePopular ?? h.nombre,
      trono: "cristo",
      punto: cristo.tramoActual,
      lat: cristo.lat,
      lng: cristo.lng,
    });
  }
  const virgen = calcularTelemetria(h, minuto - h.tiempoPaso);
  if (virgen?.estado === "en_calle") {
    res.push({
      slug: h.slug,
      hermandad: h.nombrePopular ?? h.nombre,
      trono: "virgen",
      punto: virgen.tramoActual,
      lat: virgen.lat,
      lng: virgen.lng,
    });
  }
  return res;
}

/** Detecta los cruces activos en un minuto concreto (radio por defecto: 150 m). */
export function detectarCruces(
  hermandades: Hermandad[],
  minuto: number,
  radioMetros = 150
): CruceTronos[] {
  const candidatos: CruceTronos[] = [];
  for (let i = 0; i < hermandades.length; i++) {
    for (let j = i + 1; j < hermandades.length; j++) {
      const ta = tronosEnCalle(hermandades[i], minuto);
      const tb = tronosEnCalle(hermandades[j], minuto);
      for (const a of ta) {
        for (const b of tb) {
          const d = distanciaMetros(a.lat, a.lng, b.lat, b.lng);
          if (d <= radioMetros) {
            candidatos.push({
              a,
              b,
              distancia: Math.round(d),
              lat: (a.lat + b.lat) / 2,
              lng: (a.lng + b.lng) / 2,
              minuto,
            });
          }
        }
      }
    }
  }
  // Un único cruce por par de tronos (el más cercano)
  const mejores = new Map<string, CruceTronos>();
  for (const c of candidatos) {
    const clave = [c.a.slug, c.a.trono, c.b.slug, c.b.trono].sort().join("|");
    const previo = mejores.get(clave);
    if (!previo || c.distancia < previo.distancia) mejores.set(clave, c);
  }
  return [...mejores.values()].sort((x, y) => x.distancia - y.distancia);
}

/**
 * Predice los próximos cruces dentro del horizonte (por defecto 60 min),
 * devolviendo el primer momento de aproximación de cada par de tronos.
 */
export function proximosCruces(
  hermandades: Hermandad[],
  minutoActual: number,
  horizonteMin = 60,
  radioMetros = 150
): CruceProximo[] {
  const vistos = new Set<string>();
  const res: CruceProximo[] = [];
  for (let delta = 1; delta <= horizonteMin; delta++) {
    const minuto = minutoActual + delta;
    for (const cruce of detectarCruces(hermandades, minuto, radioMetros)) {
      const clave = [cruce.a.slug, cruce.a.trono, cruce.b.slug, cruce.b.trono].sort().join("|");
      if (vistos.has(clave)) continue;
      vistos.add(clave);
      res.push({ ...cruce, enMinutos: delta });
    }
  }
  return res.sort((x, y) => x.enMinutos - y.enMinutos);
}
