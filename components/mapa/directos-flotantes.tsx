"use client";

import { useState } from "react";
import { Radio, Tv, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CANALES_DIRECTO } from "@/lib/data/directos";

/**
 * Panel Flotante de Directos (v4.0 "Granada Real").
 * Botón compacto "🔴 En Vivo (TV)" en la barra del mapa que despliega un
 * panel lateral semitransparente con las cadenas (TG7 Granada, Canal Sur).
 * Solo se monta UN iframe y se conmuta el stream sin tapar la
 * telemetría ni los marcadores GPS del mapa.
 */
export function DirectosFlotantes() {
  const [abierto, setAbierto] = useState(false);
  const [canalId, setCanalId] = useState(CANALES_DIRECTO[0]?.id ?? "");
  const canal = CANALES_DIRECTO.find((c) => c.id === canalId) ?? CANALES_DIRECTO[0];

  return (
    <>
      {/* Botón compacto en la barra del mapa */}
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls="panel-directos"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-[#C5A059]/60 bg-[#1E0A24] px-3 py-1.5 text-sm font-semibold text-[#C5A059] shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:scale-95",
          abierto && "ring-2 ring-[#C5A059]/60"
        )}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
        </span>
        <Tv className="h-4 w-4" />
        En Vivo (TV)
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", abierto && "rotate-180")} />
      </button>

      {/* Panel flotante lateral semitransparente */}
      {abierto && canal && (
        <div
          id="panel-directos"
          role="dialog"
          aria-label="Emisiones en directo"
          className="fixed bottom-4 right-4 z-[600] w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-[#C5A059]/50 bg-[#1a1a1a]/90 shadow-[0_16px_48px_-12px_rgba(26,26,26,0.8)] backdrop-blur-md"
        >
          <div className="flex items-center gap-2 border-b border-[#C5A059]/30 bg-[#1E0A24]/80 px-3 py-2">
            <Radio className="h-4 w-4 text-[#C5A059]" />
            <p className="flex-1 text-sm font-bold text-[#C5A059]">Directos — Semana Santa de Granada</p>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar panel de directos"
              className="rounded-full p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white active:scale-90"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Selector de cadenas */}
          <div className="flex flex-wrap gap-1.5 px-3 pt-2">
            {CANALES_DIRECTO.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCanalId(c.id)}
                aria-pressed={c.id === canal.id}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95",
                  c.id === canal.id
                    ? "border-[#C5A059] bg-[#1E0A24] text-[#C5A059]"
                    : "border-white/20 bg-white/5 text-white/75 hover:border-[#C5A059]/50 hover:text-white"
                )}
              >
                {c.id === canal.id && (
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-red-500 align-middle" />
                )}
                {c.nombre.replace(" — Semana Santa", "")}
              </button>
            ))}
          </div>

          {/* Un único iframe conmutado: no sobrecarga la pantalla */}
          <div className="aspect-video overflow-hidden">
            <iframe
              key={canal.id}
              className="h-full w-full"
              src={`https://www.youtube.com/embed?listType=user_uploads&list=${canal.youtubeId}`}
              title={`Directo: ${canal.nombre}`}
              allowFullScreen
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture"
            />
          </div>
          <p className="px-3 py-2 text-xs text-white/60">{canal.descripcion}</p>
        </div>
      )}
    </>
  );
}
