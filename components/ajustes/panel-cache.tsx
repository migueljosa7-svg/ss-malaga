"use client";

import { useCallback, useEffect, useState } from "react";
import { Database, Loader2, Trash2, X } from "lucide-react";

function formatearMb(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * v8.0 — Panel de Ajustes y Almacenamiento.
 * - Estimación de datos guardados (`navigator.storage.estimate()`).
 * - Nº de cachés del Service Worker.
 * - 🗑️ Borrar caché y restablecer: localStorage + sessionStorage +
 *   `caches.delete()` de todas las cachés + desregistro de service workers,
 *   con recarga limpia para eliminar cualquier estado corrupto de red/mapa.
 */
export function PanelCache() {
  const [abierto, setAbierto] = useState(false);
  const [uso, setUso] = useState<number | null>(null);
  const [cuota, setCuota] = useState<number | null>(null);
  const [numCaches, setNumCaches] = useState(0);
  const [limpiando, setLimpiando] = useState(false);
  const [hecho, setHecho] = useState(false);

  const medir = useCallback(async () => {
    try {
      if (navigator.storage?.estimate) {
        const est = await navigator.storage.estimate();
        setUso(est.usage ?? null);
        setCuota(est.quota ?? null);
      }
    } catch {
      /* API no soportada: se queda en null */
    }
    try {
      if ("caches" in window) {
        setNumCaches((await caches.keys()).length);
      }
    } catch {
      /* sin Cache API */
    }
  }, []);

  useEffect(() => {
    if (abierto) void medir();
  }, [abierto, medir]);

  async function borrarTodo() {
    setLimpiando(true);
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ("caches" in window) {
        const nombres = await caches.keys();
        await Promise.all(nombres.map((n) => caches.delete(n)));
      }
      if ("serviceWorker" in navigator) {
        const registros = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registros.map((r) => r.unregister()));
      }
      setUso(0);
      setNumCaches(0);
      setHecho(true);
      setTimeout(() => window.location.reload(), 1000);
    } finally {
      setLimpiando(false);
    }
  }

  return (
    <div className="fixed bottom-20 right-4 z-[85] flex flex-col items-end gap-2">
      {abierto && (
        <div
          role="dialog"
          aria-label="Ajustes y almacenamiento"
          className="w-[min(90vw,340px)] overflow-hidden rounded-2xl border border-[#C5A059]/50 bg-card/95 shadow-[0_16px_48px_-12px_rgba(26,26,26,0.6)] backdrop-blur-md"
        >
          <div className="flex items-center justify-between border-b border-[#C5A059]/30 bg-[#1E0A24] px-3 py-2">
            <p className="text-xs font-bold text-[#C5A059]">Ajustes y Almacenamiento</p>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar panel"
              className="rounded-full p-1 text-[#FAF7F2]/80 transition-colors hover:bg-white/10 active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 p-3 text-sm">
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Datos guardados en el dispositivo
              </p>
              <p className="text-lg font-bold text-[#1E0A24] dark:text-[#C5A059]">
                {uso === null ? "No disponible" : formatearMb(uso)}
              </p>
              <p className="text-xs text-muted-foreground">
                {cuota !== null && `de ${formatearMb(cuota)} disponibles · `}
                {numCaches} caché(s) del Service Worker
              </p>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Vacía localStorage, sessionStorage, las cachés PWA (incluidos tiles del mapa y
              audio) y desregistra los workers. Útil si el mapa o la red quedan en un estado
              corrupto.
            </p>

            <button
              type="button"
              onClick={borrarTodo}
              disabled={limpiando || hecho}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#B3261E] px-3 py-2 text-xs font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 active:scale-95 disabled:opacity-60"
            >
              {limpiando ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {hecho ? "Caché borrada ✓ Recargando…" : "🗑️ Borrar caché y restablecer app"}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-label="Ajustes y almacenamiento de datos"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C5A059]/60 bg-card text-[#1E0A24] shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 dark:text-[#C5A059]"
      >
        <Database className="h-5 w-5" />
      </button>
    </div>
  );
}
