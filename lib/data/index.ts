import { hermandadesMock } from "./hermandades";
import { incidenciasMock, callesCortadasMock } from "./incidencias";
import { hermandadSchema, incidenciaSchema, calleCortadaSchema } from "./schemas";
import type { Hermandad, Incidencia, CalleCortada } from "@/types/hermandad";
import { DIAS_SEMANA } from "@/lib/utils";

// Re-exports explícitos: permite `import { hermandadesMock } from "@/lib/data"`,
// `import { apiQuerySchema } from "@/lib/data"` y `import { incidenciasMock } from "@/lib/data"`.
export * from "./hermandades";
export * from "./incidencias";
export * from "./schemas";

/**
 * Validación Zod en el límite de los datos (defensa en profundidad).
 * En producción estos datos vendrán de la API/BBDD.
 */
export function getHermandades(): Hermandad[] {
  return hermandadesMock
    .map((h) => hermandadSchema.safeParse(h))
    .filter((r) => {
      if (!r.success) console.error("Hermandad inválida:", r.error.issues);
      return r.success;
    })
    .map((r) => r.data as Hermandad);
}

export function getHermandadBySlug(slug: string): Hermandad | undefined {
  return getHermandades().find((h) => h.slug === slug);
}

export function getIncidencias(): Incidencia[] {
  return incidenciasMock
    .map((i) => incidenciaSchema.safeParse(i))
    .filter((r) => r.success)
    .map((r) => r.data as Incidencia)
    .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
}

export function getCallesCortadas(): CalleCortada[] {
  return callesCortadasMock
    .map((c) => calleCortadaSchema.safeParse(c))
    .filter((r) => r.success)
    .map((r) => r.data as CalleCortada);
}

export function getHermandadesPorDia(): Record<string, Hermandad[]> {
  const res: Record<string, Hermandad[]> = {};
  for (const dia of DIAS_SEMANA) res[dia] = [];
  for (const h of getHermandades()) res[h.diaSemana]?.push(h);
  return res;
}
