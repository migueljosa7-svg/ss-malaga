"use client";

import { Gauge, WifiOff, Wifi } from "lucide-react";
import { useUIStore } from "@/lib/store";

/**
 * Botón flotante de Modo Ahorro de Datos / Aglomeración (v1.0 Pro).
 * Desactiva animaciones complejas, el audio global y las actualizaciones en vivo
 * cuando no hay buena señal 4G/5G o las calles están saturadas.
 */
export function BotonModoAhorro() {
  const modoAhorro = useUIStore((s) => s.modoAhorro);
  const toggleModoAhorro = useUIStore((s) => s.toggleModoAhorro);

  return (
    <button
      type="button"
      onClick={toggleModoAhorro}
      aria-pressed={modoAhorro}
      className={`fixed bottom-4 right-4 z-[90] flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-lg transition-colors ${
        modoAhorro
          ? "border-[#1B4D3E] bg-[#1B4D3E] text-white"
          : "border-[#C5A059]/60 bg-card text-primary hover:bg-muted dark:text-[#C5A059]"
      }`}
    >
      {modoAhorro ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
      <Gauge className="h-4 w-4" />
      <span className="hidden sm:inline">
        {modoAhorro ? "Modo aglomeración activo" : "Modo aglomeración"}
      </span>
    </button>
  );
}
