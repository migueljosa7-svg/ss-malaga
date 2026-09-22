"use client";

import { useMemo } from "react";
import { Radio, Tv } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CANALES_DIRECTO } from "@/lib/data/directos";
import type { Hermandad } from "@/types/hermandad";

/**
 * Módulo de emisiones en directo (v1.0 Pro): embebe streams de televisión local
 * (101 TV, Canal Sur, Málaga TV) para seguir salidas, carreras oficiales y encierros.
 */
export function Directos({ hermandad }: { hermandad: Hermandad }) {
  const canales = useMemo(() => CANALES_DIRECTO, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" /> Directos &amp; Emisiones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sigue en directo la salida, carrera oficial y encierro de {hermandad.nombrePopular ?? hermandad.nombre}{" "}
            a través de las televisiones que retransmiten la Semana Santa malagueña.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            {canales.map((c) => (
              <div key={c.id} className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <Tv className="h-4 w-4 text-primary" /> {c.nombre}
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
                  </span>
                </p>
                <div className="aspect-video overflow-hidden rounded-md border border-border">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed?listType=user_uploads&list=${c.youtubeId}`}
                    title={`Directo: ${c.nombre}`}
                    allowFullScreen
                    loading="lazy"
                    allow="autoplay; encrypted-media; picture-in-picture"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{c.descripcion}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
