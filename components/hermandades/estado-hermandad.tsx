"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { getIncidencias } from "@/lib/data";
import type { Hermandad } from "@/types/hermandad";

/**
 * Módulo superior de estado en vivo (v1.0 Pro):
 * 🟢 En Carrera Oficial · 🟡 Retraso · 🔴 Riesgo de Lluvia / Suspendida.
 */
export function EstadoHermandad({ hermandad: h }: { hermandad: Hermandad }) {
  const estado = useMemo(() => {
    const incidencias = getIncidencias().filter((i) => i.hermandadId === h.id);
    const lluvia = incidencias.find((i) => i.tipo === "lluvia");
    if (lluvia && lluvia.nivel === "danger") {
      return { emoji: "🔴", texto: "Riesgo de Lluvia / Suspendida", variante: "danger" as const };
    }
    const retraso = incidencias.find((i) => i.tipo === "retraso");
    if (retraso) {
      return { emoji: "🟡", texto: retraso.titulo.includes("min") ? retraso.titulo : "Retraso en el recorrido", variante: "secondary" as const };
    }
    const enCalle = h.itinerario.some((p) => p.estadoPaso === "en_calle");
    if (enCalle) return { emoji: "🟢", texto: "En Carrera Oficial", variante: "default" as const };
    return { emoji: "⚪", texto: "Programada", variante: "info" as const };
  }, [h]);

  return (
    <Badge variant={estado.variante} className="text-sm" aria-live="polite">
      {estado.emoji} {estado.texto}
    </Badge>
  );
}
