"use client";

import { useEffect, useMemo } from "react";
import type { Hermandad } from "@/types/hermandad";
import { calcularTelemetria } from "@/lib/telemetria";
import { BotonCampana } from "@/components/hermandades/boton-campana";

export type TronoSeleccionado = { slug: string; tipo: "cristo" | "virgen" } | null;

function formatearMinutos(total: number): string {
  const t = ((total % 1440) + 1440) % 1440;
  const h = Math.floor(t / 60);
  const m = t % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * HUD de telemetría flotante (v1.0 Pro). Se renderiza como overlay sobre el mapa:
 * calle/punto exacto actual, velocidad/ritmo estimado, distancia y ETA al próximo punto.
 */
export function HudTelemetria({
  seleccion,
  hermandades,
  minuto,
  onCerrar,
}: {
  seleccion: TronoSeleccionado;
  hermandades: Hermandad[];
  minuto: number;
  onCerrar: () => void;
}) {
  const { contenido } = useMemo(() => {
    if (!seleccion) return { contenido: null };
    const h = hermandades.find((x) => x.slug === seleccion.slug);
    if (!h) return { contenido: null };
    const m = seleccion.tipo === "cristo" ? minuto : minuto - h.tiempoPaso;
    const t = calcularTelemetria(h, m);
    if (!t) return { contenido: null };
    return {
      contenido: (
        <div
          className="absolute bottom-4 left-4 z-[500] w-72 rounded-xl border border-[#C5A059]/50 bg-card/95 p-4 shadow-2xl backdrop-blur"
          role="status"
          aria-live="polite"
        >
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar telemetría"
            className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
          <p className="mb-1 pr-6 text-sm font-bold text-primary">
            {seleccion.tipo === "cristo" ? "✝ Trono de Cristo" : "✨ Trono de Virgen"} —{" "}
            {h.nombrePopular ?? h.nombre}
          </p>
          <p className="mb-2 text-xs text-muted-foreground">🕒 {formatearMinutos(minuto)}</p>
          <dl className="space-y-1.5 text-xs">
            <div>
              <dt className="font-semibold">📍 Punto actual</dt>
              <dd className="text-muted-foreground">{t.tramoActual}</dd>
            </div>
            <div>
              <dt className="font-semibold">🏃 Velocidad / Ritmo</dt>
              <dd className="text-muted-foreground">
                ≈ {t.velocidadMH} m/h · {t.ritmo}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">➡️ Próximo punto clave</dt>
              <dd className="text-muted-foreground">
                {t.proximoPunto} · {t.distanciaProximo} m · ETA {t.etaProximo} min
              </dd>
            </div>
          </dl>
          <div className="mt-3">
            <BotonCampana compacto posicion={{ lat: t.lat, lng: t.lng }} />
          </div>
        </div>
      ),
    };
  }, [seleccion, hermandades, minuto, onCerrar]);

  // Cerrar con Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCerrar();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCerrar]);

  return contenido;
}
