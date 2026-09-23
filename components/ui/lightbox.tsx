"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Lightbox accesible a pantalla completa (v1.0 Pro).
 * - Navegación con flechas del teclado y swipe táctil.
 * - Zoom con doble clic / doble toque y botón de zoom.
 */
export function Lightbox({
  imagenes,
  titulo,
  indiceInicial = 0,
  onClose,
}: {
  imagenes: string[];
  titulo: string;
  indiceInicial?: number;
  onClose: () => void;
}) {
  const [indice, setIndice] = useState(indiceInicial);
  const [zoom, setZoom] = useState(false);
  const touchX = useRef<number | null>(null);

  const siguiente = useMemo(
    () => () => setIndice((i) => (i + 1) % imagenes.length),
    [imagenes.length]
  );
  const anterior = useMemo(
    () => () => setIndice((i) => (i - 1 + imagenes.length) % imagenes.length),
    [imagenes.length]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") siguiente();
      else if (e.key === "ArrowLeft") anterior();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, siguiente, anterior]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label={`Visor de imágenes: ${titulo}`}
      onClick={onClose}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (dx > 50) anterior();
        else if (dx < -50) siguiente();
        touchX.current = null;
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar visor"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setZoom((z) => !z);
        }}
        aria-label={zoom ? "Quitar zoom" : "Ampliar imagen"}
        className="absolute right-4 top-16 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <ZoomIn className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          anterior();
        }}
        aria-label="Imagen anterior"
        className="absolute left-2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:left-6"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          siguiente();
        }}
        aria-label="Imagen siguiente"
        className="absolute right-2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:right-6"
      >
        <ChevronRight className="h-8 w-8" />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagenes[indice]}
        alt={`${titulo} — imagen ${indice + 1} de ${imagenes.length}`}
        onClick={(e) => {
          e.stopPropagation();
          setZoom((z) => !z);
        }}
        className={
          zoom
            ? "max-h-[130vh] max-w-[160vw] cursor-zoom-out object-contain transition-transform"
            : "max-h-[85vh] max-w-[90vw] cursor-zoom-in object-contain transition-transform"
        }
      />
      <p className="absolute bottom-4 w-full text-center text-sm text-white/80">
        {titulo} · {indice + 1}/{imagenes.length}
      </p>
    </motion.div>
  );
}
