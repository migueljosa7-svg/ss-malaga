"use client";

import { useCallback, useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Tarjeta 3D Holofoil — "Cromo Cofrade" (v2.0 Max).
 * Efecto de inclinación 3D con parallax y brillo dorado que sigue al puntero;
 * en móviles usa el acelerómetro (deviceorientation). Desactivado en modo ahorro.
 */
export function CromoHolofoil({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const modoAhorro = useUIStore((s) => s.modoAhorro);

  const alMover = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rot-y", `${(px * 14).toFixed(2)}deg`);
    el.style.setProperty("--rot-x", `${(-py * 12).toFixed(2)}deg`);
    el.style.setProperty("--brillo-x", `${((px + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--brillo-y", `${((py + 0.5) * 100).toFixed(1)}%`);
  }, []);

  const alSalir = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rot-x", "0deg");
    el.style.setProperty("--rot-y", "0deg");
  }, []);

  // Inclinación con el móvil (gyroscope); en iOS requiere gesto previo, se degrada con gracia
  useEffect(() => {
    if (modoAhorro) return;
    if (typeof window === "undefined" || !("ontouchstart" in window)) return;
    function handler(e: DeviceOrientationEvent) {
      const el = ref.current;
      if (!el || e.beta == null || e.gamma == null) return;
      const rotY = Math.max(-12, Math.min(12, e.gamma / 4));
      const rotX = Math.max(-10, Math.min(10, (e.beta - 45) / 4));
      el.style.setProperty("--rot-y", `${rotY.toFixed(2)}deg`);
      el.style.setProperty("--rot-x", `${rotX.toFixed(2)}deg`);
    }
    window.addEventListener("deviceorientation", handler);
    return () => window.removeEventListener("deviceorientation", handler);
  }, [modoAhorro]);

  return (
    <div
      ref={ref}
      className={cn("cromo-holofoil relative", className)}
      onPointerMove={modoAhorro ? undefined : alMover}
      onPointerLeave={modoAhorro ? undefined : alSalir}
    >
      <div className="cromo-holofoil-inner">{children}</div>
      <div className="cromo-holofoil-brillo" aria-hidden="true" />
    </div>
  );
}
