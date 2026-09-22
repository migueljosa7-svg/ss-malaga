"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TimelineItinerario } from "@/components/hermandades/timeline-itinerario";
import { FichaPaso } from "@/components/hermandades/ficha-paso";
import type { Hermandad } from "@/types/hermandad";
import { cn } from "@/lib/utils";
import { Lightbulb, Music, Users, Shirt, History, Shield } from "lucide-react";

type Pestana = "historia" | "pasos" | "itinerario" | "galeria" | "sonidos";

const pestanas: Array<{ id: Pestana; label: string }> = [
  { id: "historia", label: "Historia & Datos" },
  { id: "pasos", label: "Tronos & Túnica" },
  { id: "itinerario", label: "Itinerario" },
  { id: "galeria", label: "Vídeos" },
  { id: "sonidos", label: "Sonidos" },
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
              {h.vestimenta.escudo && (
                <p className="mt-2 flex items-start gap-1.5 text-muted-foreground">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <strong className="text-foreground">Escudo:</strong> {h.vestimenta.escudo}
                  </span>
                </p>
              )}
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

      {activa === "sonidos" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" /> Toques de campana y marchas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(h.sonidos ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No hay audios disponibles para esta hermandad todavía.
                </p>
              )}
              {(h.sonidos ?? []).map((s) => (
                <div key={s.id} className="rounded-lg border border-border bg-muted/40 p-3">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-medium">{s.titulo}</span>
                    <Badge variant="secondary">{s.tipo.replace("_", " ")}</Badge>
                  </div>
                  {s.descripcion && (
                    <p className="mb-2 text-xs text-muted-foreground">{s.descripcion}</p>
                  )}
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <audio controls preload="none" className="w-full" src={s.src}>
                    Tu navegador no soporta audio HTML5.
                  </audio>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

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
