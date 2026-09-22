"use client";

import { useEffect, useRef } from "react";
import { useUIStore } from "@/lib/store";

/**
 * Canvas de Incienso (v2.0 Max): humo ligero y animado para la cabecera.
 * - Partículas doradas/ceniza que ascienden con deriva sinusoidal.
 * - Se desactiva con el Modo Aglomeración y respeta prefers-reduced-motion.
 */
export function ParticulasIncienso() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modoAhorro = useUIStore((s) => s.modoAhorro);

  useEffect(() => {
    if (modoAhorro) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let raf = 0;

    interface Particula {
      x: number;
      y: number;
      vy: number;
      r: number;
      vida: number;
      vidaMax: number;
      fase: number;
      dorada: boolean;
    }

    const particulas: Particula[] = [];
    const NUM = 42;

    function redimensionar() {
      const padre = canvas!.parentElement;
      if (!padre) return;
      canvas!.width = Math.max(1, padre.clientWidth * dpr);
      canvas!.height = Math.max(1, padre.clientHeight * dpr);
      canvas!.style.width = `${padre.clientWidth}px`;
      canvas!.style.height = `${padre.clientHeight}px`;
    }

    function crear(): Particula {
      const w = canvas!.width;
      const h = canvas!.height;
      return {
        x: w * (0.5 + (Math.random() - 0.5) * 0.6),
        y: h + Math.random() * h * 0.3,
        vy: (0.25 + Math.random() * 0.45) * dpr,
        r: (6 + Math.random() * 18) * dpr,
        vida: 0,
        vidaMax: 260 + Math.random() * 220,
        fase: Math.random() * Math.PI * 2,
        dorada: Math.random() < 0.45,
      };
    }

    redimensionar();
    for (let i = 0; i < NUM; i++) {
      const p = crear();
      // Reparto inicial vertical para que no aparezcan todas a la vez
      p.y = Math.random() * canvas!.height;
      p.vida = Math.random() * p.vidaMax;
      particulas.push(p);
    }

    function paso(t: number) {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);
      for (const p of particulas) {
        p.vida++;
        p.y -= p.vy;
        p.x += Math.sin(t / 1600 + p.fase) * 0.35 * dpr;
        p.r += 0.02 * dpr;
        const progreso = p.vida / p.vidaMax;
        const alpha = Math.sin(Math.PI * progreso) * 0.12;
        if (alpha > 0.001) {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx!.fillStyle = p.dorada
            ? `rgba(212, 175, 55, ${alpha.toFixed(3)})`
            : `rgba(168, 158, 150, ${alpha.toFixed(3)})`;
          ctx!.fill();
        }
        if (p.y + p.r < 0 || p.vida > p.vidaMax) {
          Object.assign(p, crear());
        }
      }
      raf = requestAnimationFrame(paso);
    }

    function alCambiarVisibilidad() {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(paso);
    }

    window.addEventListener("resize", redimensionar);
    document.addEventListener("visibilitychange", alCambiarVisibilidad);
    raf = requestAnimationFrame(paso);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", redimensionar);
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
    };
  }, [modoAhorro]);

  if (modoAhorro) return null;
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" />;
}
