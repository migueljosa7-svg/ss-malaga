"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { tocarCampana3d, type PosicionGeo } from "@/lib/audio/campana-3d";

/**
 * Botón "Tocar Campana de Trono" — v2.0 Max.
 * - Audio con Web Audio API; si se proporciona `posicion` (lat/lng del trono),
 *   suena con PannerNode HRTF orientado en 3D respecto al centro del mapa.
 * - 3 toques tradicionales de mayordomo + vibración háptica sincronizada.
 * - Microanimación visual de balanceo con destellos dorados.
 */
export function BotonCampana({
  src = "/audio/campana-trono.mp3",
  compacto = false,
  posicion = null,
}: {
  src?: string;
  compacto?: boolean;
  posicion?: PosicionGeo | null;
}) {
  const [tocando, setTocando] = useState(false);
  const [soportaVibracion, setSoportaVibracion] = useState(false);

  useEffect(() => {
    setSoportaVibracion(typeof navigator !== "undefined" && "vibrate" in navigator);
  }, []);

  const tocar = useCallback(async () => {
    if (tocando) return;
    setTocando(true);
    try {
      await tocarCampana3d({ src, posicion });
    } catch {
      // Fallback silencioso: aunque el audio falle, se mantiene la respuesta háptica
    }
    navigator.vibrate?.([100, 50, 100, 50, 100]);
    setTimeout(() => setTocando(false), 2300);
  }, [src, tocando, posicion]);

  return (
    <button
      type="button"
      onClick={tocar}
      disabled={tocando}
      aria-label="Tocar campana de trono"
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/60 bg-[#4A154B] px-3 py-1.5 text-sm font-medium text-[#D4AF37] transition-transform hover:scale-105 disabled:opacity-70",
        compacto && "px-2 py-1 text-xs"
      )}
    >
      <span className={cn("inline-block", tocando && "campana-balanceo")}>
        <Bell className="h-4 w-4" />
      </span>
      {!compacto && <span>{tocando ? "¡Campana!" : "Tocar campana de trono"}</span>}
      {tocando && (
        <>
          <span className="destello-dorado destello-1" aria-hidden />
          <span className="destello-dorado destello-2" aria-hidden />
        </>
      )}
      {!soportaVibracion && !compacto && (
        <span className="sr-only">(La vibración no está soportada en este dispositivo)</span>
      )}
    </button>
  );
}
