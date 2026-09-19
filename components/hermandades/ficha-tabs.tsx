"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TimelineItinerario } from "@/components/hermandades/timeline-itinerario";
import { FichaPaso } from "@/components/hermandades/ficha-paso";
import type { Hermandad } from "@/types/hermandad";
import { cn } from "@/lib/utils";
import { Lightbulb, Music, Users, Shirt, History } from "lucide-react";

type Pestana = "historia" | "pasos" | "itinerario" | "galeria";

const pestanas: Array<{ id: Pestana; label: string }> = [
  { id: "historia", label: "Historia & Datos" },
  { id: "pasos", label: "Pasos & Túnica" },
  { id: "itinerario", label: "Itinerario" },
  { id: "galeria", label: "Vídeos" },
];

export function FichaTabs({ hermandad: h }: { hermandad: Hermandad }) {
  const [activa, setActiva] = useState<Pestana>("historia");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 border-b border-border" role="tablist">
        {pestanas.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={activa === p.id}
            onClick={() => setActiva(p.id)}
            className={cn(
              "rounded-t-md px-4 py-2 text-sm font-medium transition-colors",
              activa === p.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {activa === "historia" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" /> Historia
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {h.historia}
            </CardContent>
          </Card>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Datos de interés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {h.curiosidades.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" /> Acompañamiento musical
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {h.musica.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activa === "pasos" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shirt className="h-5 w-5 text-primary" /> Vestimenta de los nazarenos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>{h.vestimenta.descripcionTunica}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge>Antifaz: {h.vestimenta.colorAntifaz}</Badge>
                <Badge>{h.vestimenta.capa ? "Con capa" : "Sin capa"}</Badge>
                {h.vestimenta.cirios && <Badge>{h.vestimenta.cirios}</Badge>}
              </div>
            </CardContent>
          </Card>
          {h.pasos.map((p) => (
            <FichaPaso key={p.nombre} paso={p} />
          ))}
        </div>
      )}

      {activa === "itinerario" && <TimelineItinerario itinerario={h.itinerario} />}

      {activa === "galeria" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {h.videos.length === 0 && (
            <p className="text-sm text-muted-foreground">No hay vídeos disponibles.</p>
          )}
          {h.videos.map((v) => (
            <Card key={v.id}>
              <CardHeader>
                <CardTitle>{v.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video overflow-hidden rounded-md">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                    title={v.titulo}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
