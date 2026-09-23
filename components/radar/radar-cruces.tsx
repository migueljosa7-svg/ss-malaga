"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crosshair, Radar as RadarIcon, X } from "lucide-react";
import type { Hermandad } from "@/types/hermandad";
import { posicionEnMinuto } from "@/lib/telemetria";
import { useUIStore } from "@/lib/store";
import { PATRONES_HAPTICOS, vibrar } from "@/lib/haptica";

const MALAGA: [number, number] = [36.7213, -4.4214];

function distanciaKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/**
 * Radar de cruces como Bottom Sheet deslizante (v10.0 Ultimate):
 * botón ⚡ sobre el mapa → hoja arrastrable (framer-motion) con los tronos
 * ordenados por distancia real (GPS opcional). Tocar centra el mapa + háptica.
 */
export function RadarCruces({
  hermandades,
  minuto,
  onCentrar,
}: {
  hermandades: Hermandad[];
  minuto: number;
  onCentrar: (slug: string) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [miPos, setMiPos] = useState<[number, number] | null>(null);
  const modoAhorro = useUIStore((s) => s.modoAhorro);

  const entradas = useMemo(() => {
    const base = miPos ?? MALAGA;
    return hermandades
      .map((h) => {
        const pos = posicionEnMinuto(h, minuto);
        if (!pos) return null;
        return {
          h,
          km: distanciaKm(base, [pos.lat, pos.lng]),
          enVivo: pos.estado === "en_calle",
        };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null)
      .sort((a, b) => a.km - b.km);
  }, [hermandades, minuto, miPos]);

  function abrir() {
    setAbierto(true);
    vibrar(PATRONES_HAPTICOS.panel);
  }
  function cerrar() {
    setAbierto(false);
    vibrar(PATRONES_HAPTICOS.seleccion);
  }
  function pedirMiPos() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setMiPos([p.coords.latitude, p.coords.longitude]),
      () => setMiPos(null)
    );
    vibrar(PATRONES_HAPTICOS.seleccion);
  }

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        aria-expanded={abierto}
        aria-label="Abrir radar de tronos cercanos"
        className="absolute bottom-4 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#D4AF37]/60 bg-[#4A154B] px-4 py-2.5 text-sm font-semibold text-[#D4AF37] shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
      >
        <RadarIcon className="h-4 w-4" />
        Radar de tronos
        {entradas.some((e) => e.enVivo) && (
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" aria-hidden />
        )}
      </button>

      <AnimatePresence>
        {abierto && (
          <>
            <motion.button
              key="scrim"
              type="button"
              aria-label="Cerrar radar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: modoAhorro ? 0 : 0.2 }}
              onClick={cerrar}
              className="absolute inset-0 z-[85] cursor-default bg-black/35"
            />
            <motion.div
              key="hoja"
              role="dialog"
              aria-label="Radar de tronos cercanos"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_e, info) => {
                if (info.offset.y > 70 || info.velocity.y > 600) cerrar();
              }}
              initial={modoAhorro ? { opacity: 0 } : { y: "100%" }}
              animate={modoAhorro ? { opacity: 1 } : { y: 0 }}
              exit={modoAhorro ? { opacity: 0 } : { y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="panel-vidrio absolute inset-x-0 bottom-0 z-[90] max-h-[78%] rounded-t-2xl border-t border-[#D4AF37]/50 shadow-[0_-16px_48px_-12px_rgba(0,0,0,0.5)]"
            >
              <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-[#D4AF37]/50" aria-hidden />
              <div className="flex items-center gap-2 px-4 pb-2 pt-3">
                <RadarIcon className="h-4 w-4 shrink-0 text-[#4A154B] dark:text-[#e8c86a]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">Radar — {entradas.length} tronos</p>
                  <p className="text-[11px] text-muted-foreground">
                    {miPos ? "Ordenado desde tu posición" : "Ordenado desde el centro de Málaga"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={pedirMiPos}
                  className="flex items-center gap-1 rounded-full border border-[#D4AF37]/50 px-2.5 py-1 text-[11px] font-semibold transition-transform hover:scale-105 active:scale-95"
                >
                  <Crosshair className="h-3.5 w-3.5" /> Mi posición
                </button>
                <button
                  type="button"
                  onClick={cerrar}
                  aria-label="Cerrar radar"
                  className="rounded-full border border-border p-1.5 transition-transform hover:scale-110 active:scale-95"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ul className="max-h-[52vh] space-y-1 overflow-y-auto px-3 pb-4">
                {entradas.map((e) => (
                  <li key={e.h.slug}>
                    <button
                      type="button"
                      onClick={() => {
                        onCentrar(e.h.slug);
                        vibrar(PATRONES_HAPTICOS.seleccion);
                        cerrar();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg border border-transparent px-2 py-2 text-left transition-colors hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 active:scale-[0.99]"
                    >
                      <span
                        className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-[#D4AF37] ${
                          e.enVivo ? "animate-pulse bg-red-600" : "bg-[#94a3b8]"
                        }`}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">
                          {e.h.nombrePopular ?? e.h.nombre}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {e.h.diaSemana} · {e.h.sede}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block font-mono text-sm font-bold">
                          {e.km < 1 ? `${Math.round(e.km * 1000)} m` : `${e.km.toFixed(1)} km`}
                        </span>
                        {e.enVivo && (
                          <span className="block text-[10px] font-bold uppercase text-[#B3261E]">
                            En la calle
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
                {entradas.length === 0 && (
                  <li className="px-2 py-6 text-center text-sm text-muted-foreground">
                    Ningún trono en el itinerario a esta hora.
                  </li>
                )}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
