"use client";

import { useMemo } from "react";
import { Radar, Crosshair } from "lucide-react";
import type { Hermandad } from "@/types/hermandad";
import { detectarCruces, proximosCruces } from "@/lib/cruces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Radar de Cruces de Tronos (v2.0 Max): muestra los encuentros activos entre
 * cofradías y los próximos dentro de 60 minutos. Al pulsar "Centrar" enfoca
 * el mapa en el punto del encuentro.
 */
export function RadarCruces({
  hermandades,
  minuto,
  onCentrar,
}: {
  hermandades: Hermandad[];
  minuto: number;
  onCentrar: (bounds: [number, number][]) => void;
}) {
  const actuales = useMemo(() => detectarCruces(hermandades, minuto), [hermandades, minuto]);
  const proximos = useMemo(() => proximosCruces(hermandades, minuto), [hermandades, minuto]);

  if (hermandades.length === 0) return null;

  return (
    <Card className="borde-orfebre">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Radar className="h-5 w-5 text-primary" /> Radar de cruces de tronos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {actuales.length === 0 && proximos.length === 0 && (
          <p className="text-muted-foreground">
            📡 Sin cruces previstos en esta hora. Mueve el simulador para explorar encuentros.
          </p>
        )}
        {actuales.map((c) => (
          <div
            key={`activo-${c.a.slug}-${c.a.trono}-${c.b.slug}-${c.b.trono}`}
            className="flex flex-wrap items-center gap-2 rounded-md border border-[#B3261E]/30 bg-[#B3261E]/5 p-2"
          >
            <span className="font-medium">
              ⚡ {c.a.hermandad} ({c.a.trono}) × {c.b.hermandad} ({c.b.trono})
            </span>
            <span className="text-xs text-muted-foreground">
              {c.distancia} m · ahora
            </span>
            <button
              type="button"
              onClick={() =>
                onCentrar([
                  [c.lat - 0.0012, c.lng - 0.0018],
                  [c.lat + 0.0012, c.lng + 0.0018],
                ])
              }
              className="ml-auto flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs hover:bg-muted"
            >
              <Crosshair className="h-3.5 w-3.5" /> Centrar
            </button>
          </div>
        ))}
        {proximos.slice(0, 4).map((c) => (
          <div
            key={`proximo-${c.a.slug}-${c.a.trono}-${c.b.slug}-${c.b.trono}`}
            className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted/40 p-2"
          >
            <span className="font-medium">
              🔮 {c.a.hermandad} × {c.b.hermandad}
            </span>
            <span className="text-xs text-muted-foreground">
              en ≈{c.enMinutos} min · {c.distancia} m
            </span>
            <button
              type="button"
              onClick={() =>
                onCentrar([
                  [c.lat - 0.0012, c.lng - 0.0018],
                  [c.lat + 0.0012, c.lng + 0.0018],
                ])
              }
              className="ml-auto flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs hover:bg-muted"
            >
              <Crosshair className="h-3.5 w-3.5" /> Centrar
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
