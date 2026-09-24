"use client";

import { useMemo, useState } from "react";
import { useMap } from "react-leaflet";
import { Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Hermandad } from "@/types/hermandad";
import { hermandadEnDirecto, calcularTelemetria } from "@/lib/telemetria";

/**
 * Dropdown "Procesiones en la Calle (X)" (v6.0).
 * Selector flotante en la esquina superior derecha del mapa que lista solo
 * los tronos activamente en la calle. Al pulsar, el mapa vuela (flyTo) a su
 * GPS en vivo con animación suave.
 */
export function SelectorEnDirecto({
  hermandades,
  minuto,
}: {
  hermandades: Hermandad[];
  minuto: number;
}) {
  const map = useMap();
  const [abierto, setAbierto] = useState(false);

  const enCalle = useMemo(
    () =>
      hermandades
        .filter((h) => hermandadEnDirecto(h, minuto))
        .map((h) => {
          const t = calcularTelemetria(h, minuto)!;
          return { h, lat: t.lat, lng: t.lng, tramo: t.tramoActual };
        }),
    [hermandades, minuto]
  );

  function volar(lat: number, lng: number) {
    map.flyTo([lat, lng], Math.max(map.getZoom(), 17), { duration: 1.4 });
    setAbierto(false);
  }

  return (
    <div className="leaflet-top leaflet-right z-[500] pointer-events-none">
      <div className="pointer-events-auto mt-16 mr-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            className={cn(
              "flex items-center gap-2 rounded-full border border-[#C5A059]/60 bg-[#1E0A24] px-3 py-1.5 text-xs font-semibold text-[#C5A059] shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:scale-95",
              abierto && "ring-2 ring-[#C5A059]/60"
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
            </span>
            En la Calle ({enCalle.length})
          </button>

          {abierto && (
            <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-[#C5A059]/50 bg-card/95 shadow-2xl backdrop-blur">
              <p className="border-b border-[#C5A059]/30 bg-[#1E0A24]/90 px-3 py-2 text-xs font-bold text-[#C5A059]">
                Procesiones en la Calle ({enCalle.length})
              </p>
              {enCalle.length === 0 ? (
                <p className="px-3 py-3 text-xs text-muted-foreground">
                  No hay tronos procesionando en esta hora. Usa el simulador para explorar.
                </p>
              ) : (
                <ul className="max-h-72 overflow-y-auto">
                  {enCalle.map((p) => (
                    <li key={p.h.slug}>
                      <button
                        type="button"
                        onClick={() => volar(p.lat, p.lng)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-[#1E0A24]/15 active:scale-[0.98]"
                      >
                        <Navigation className="h-3.5 w-3.5 shrink-0 text-[#C5A059]" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold">{p.h.nombrePopular ?? p.h.nombre}</span>
                          <span className="block truncate text-[10px] text-muted-foreground">{p.tramo}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
