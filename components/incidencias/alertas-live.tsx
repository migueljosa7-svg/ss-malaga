"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CloudRain, TrafficCone, Users, Clock, Route } from "lucide-react";
import type { Incidencia } from "@/types/hermandad";
import { formatFecha, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const iconos = {
  retraso: Clock,
  cambio_recorrido: Route,
  lluvia: CloudRain,
  calle_cortada: TrafficCone,
  aglomeracion: Users,
} as const;

const nivelStyles = {
  // v11.0 AA: pares explícitos fondo/texto por tema — antes `bg-red-50` fijo
  // con texto heredado claro en dark → letras invisibles sobre fondo claro.
  info: "border-l-sky-500 bg-sky-50 text-sky-950 dark:bg-sky-950/70 dark:text-sky-100",
  warning: "border-l-amber-500 bg-amber-50 text-amber-950 dark:bg-amber-950/70 dark:text-amber-100",
  danger: "border-l-red-500 bg-red-50 text-red-950 dark:bg-red-950/70 dark:text-red-100",
} as const;

export function BannerAlertaCritica() {
  const { data: incidencias } = useQuery<Incidencia[]>({
    queryKey: ["incidencias"],
    queryFn: async () => {
      const res = await fetch("/api/incidencias");
      if (!res.ok) throw new Error("Error al cargar incidencias");
      return res.json();
    },
    refetchInterval: 30_000, // actualización en vivo cada 30s
  });

  const criticas = (incidencias ?? []).filter((i) => i.nivel === "danger");
  if (criticas.length === 0) return null;

  return (
    <div className="mb-6 space-y-2">
      {criticas.slice(0, 2).map((i) => (
        <div
          key={i.id}
          className="flex items-center gap-3 rounded-lg border-l-4 border-l-red-500 bg-red-50 px-4 py-3 text-red-950 dark:bg-red-950/80 dark:text-red-100"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-700 dark:text-red-300" />
          <div className="min-w-0">
            <p className="truncate font-semibold">{i.titulo}</p>
            <p className="truncate text-sm">{i.descripcion}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListaIncidencias({ limit }: { limit?: number }) {
  const { data, isLoading } = useQuery<Incidencia[]>({
    queryKey: ["incidencias"],
    queryFn: async () => {
      const res = await fetch("/api/incidencias");
      if (!res.ok) throw new Error("Error al cargar incidencias");
      return res.json();
    },
    refetchInterval: 30_000,
  });

  if (isLoading) return <p className="text-muted-foreground">Cargando avisos…</p>;
  const lista = (data ?? []).slice(0, limit);

  return (
    <ul className="space-y-3">
      {lista.map((i) => {
        const Icon = iconos[i.tipo];
        return (
          <li key={i.id}>
            <div className={cn("rounded-lg border border-l-4 border-border p-4", nivelStyles[i.nivel])}>
              <div className="flex flex-wrap items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="font-semibold">{i.titulo}</span>
                <Badge variant={i.nivel}>{i.tipo.replace("_", " ")}</Badge>
              </div>
              <p className="mt-1 text-sm opacity-90">{i.descripcion}</p>
              <p className="mt-1 text-xs opacity-70">{formatFecha(i.timestamp)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
