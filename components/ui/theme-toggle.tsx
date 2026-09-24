"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * v8.0 — Conmutador global Día / Noche (next-themes).
 * Modo Claro: blanco/orfebrería · Modo Oscuro: morado nazareno/noche.
 * Renderizado condicional SOLO tras montar para evitar desajustes de hidratación
 * (los hooks — useEffect/useState — se ejecutan siempre antes de cualquier return).
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Reserva el espacio exacto para no provocar saltos de layout en el SSR
    return <span className="inline-block h-8 w-8" aria-hidden="true" />;
  }

  const oscuro = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={oscuro ? "Cambiar a modo día" : "Cambiar a modo noche"}
      title={oscuro ? "Modo día (blanco/orfebrería)" : "Modo noche (morado nazareno)"}
      onClick={() => setTheme(oscuro ? "light" : "dark")}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C5A059]/60 bg-white/10 text-[#C5A059] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 active:scale-95"
    >
      {oscuro ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
