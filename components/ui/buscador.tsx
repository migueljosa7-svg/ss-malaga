"use client";

import { Search } from "lucide-react";
import { useUIStore } from "@/lib/store";

export function Buscador() {
  const buscador = useUIStore((s) => s.buscador);
  const setBuscador = useUIStore((s) => s.setBuscador);

  return (
    <div className="relative mx-auto max-w-xl">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={buscador}
        onChange={(e) => setBuscador(e.target.value)}
        placeholder="Buscar hermandad, palio, calle…"
        maxLength={120}
        className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}
