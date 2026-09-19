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
  info: "border-l-info",
  warning: "border-l-warning",
  danger: "border-l-danger bg-red-50",
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
          className="flex items-center gap-3 rounded-lg border-l-4 border-l-danger bg-red-50 px-4 py-3 text-red-900"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-danger" />
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
            <div className={cn("rounded-lg border border-border bg-card p-4 border-l-4", nivelStyles[i.nivel])}>
              <div className="flex flex-wrap items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="font-semibold">{i.titulo}</span>
                <Badge variant={i.nivel}>{i.tipo.replace("_", " ")}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{i.descripcion}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatFecha(i.timestamp)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
