"use client";

import { useState } from "react";
import { Radio, Tv, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CANALES_DIRECTO } from "@/lib/data/directos";
import type { Hermandad } from "@/types/hermandad";

/**
 * Módulo de emisiones en directo (v6.0): carga bajo demanda.
 * Ya NO monta iframes fijos: se muestra una tarjeta por cadena y el iframe de
 * YouTube solo se inserta cuando el usuario pulsa "Ver en directo", evitando
 * errores de consola y consumo innecesario de red en la vista principal.
 */
export function Directos({ hermandad }: { hermandad: Hermandad }) {
  const [canalActivo, setCanalActivo] = useState<string | null>(null);

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
            a través de las televisiones que retransmiten la Semana Santa malagueña. El stream solo
            se carga cuando lo pides.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            {CANALES_DIRECTO.map((c) => (
              <div key={c.id} className="space-y-2 rounded-lg border border-border p-3">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <Tv className="h-4 w-4 text-primary" /> {c.nombre}
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{c.descripcion}</p>
                {canalActivo === c.id ? (
                  <div className="aspect-video overflow-hidden rounded-md border border-border">
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube.com/embed?listType=user_uploads&list=${c.youtubeId}`}
                      title={`Directo: ${c.nombre}`}
                      allowFullScreen
                      allow="autoplay; encrypted-media; picture-in-picture"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCanalActivo(c.id)}
                    className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
                    aria-label={`Cargar el directo de ${c.nombre}`}
                  >
                    <Play className="h-4 w-4" /> Ver en directo
                  </button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
