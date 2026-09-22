"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Botón "Tocar Campana de Trono" — v1.0 Pro.
 * - Audio de baja latencia con Web Audio API (decodifica campana-trono.mp3 y lo
 *   reproduce 3 veces simulando los 3 toques del mayordomo).
 * - Vibración háptica en móviles: navigator.vibrate([100, 50, 100, 50, 100]).
 * - Microanimación visual de balanceo con destellos dorados.
 */
export function BotonCampana({ src = "/audio/campana-trono.mp3", compacto = false }: { src?: string; compacto?: boolean }) {
  const bufferRef = useRef<ArrayBuffer | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const [tocando, setTocando] = useState(false);
  const [soportaVibracion, setSoportaVibracion] = useState(false);

  useEffect(() => {
    setSoportaVibracion(typeof navigator !== "undefined" && "vibrate" in navigator);
  }, []);

  const tocar = useCallback(async () => {
    if (tocando) return;
    setTocando(true);
    try {
      if (!ctxRef.current) ctxRef.current = new AudioContext();
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") await ctx.resume();
      if (!bufferRef.current) {
        const res = await fetch(src);
        if (!res.ok) throw new Error("No se pudo cargar el audio");
        bufferRef.current = await res.arrayBuffer();
      }
      const buffer = await ctx.decodeAudioData(bufferRef.current!.slice(0));
      // 3 toques tradicionales de mayordomo de trono
      for (let i = 0; i < 3; i++) {
        const fuente = ctx.createBufferSource();
        fuente.buffer = buffer;
        fuente.connect(ctx.destination);
        fuente.start(ctx.currentTime + i * 0.7);
      }
      // Vibración háptica sincronizada con los 3 toques
      navigator.vibrate?.([100, 50, 100, 50, 100]);
      setTimeout(() => setTocando(false), 2300);
    } catch {
      // Fallback: vibración aunque no haya audio disponible
      navigator.vibrate?.([100, 50, 100, 50, 100]);
      setTimeout(() => setTocando(false), 800);
    }
  }, [src, tocando]);

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
