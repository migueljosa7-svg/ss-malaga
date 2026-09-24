"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TimelineItinerario } from "@/components/hermandades/timeline-itinerario";
import { FichaPaso } from "@/components/hermandades/ficha-paso";
import { BotonCampana } from "@/components/hermandades/boton-campana";
import { Directos } from "@/components/hermandades/directos";
import { CromoHolofoil } from "@/components/hermandades/cromo-holofoil";
import { TunicaCapirote } from "@/components/ilustraciones/tunica-capirote";
import { HombreTrono } from "@/components/ilustraciones/hombre-trono";
import { FonotecaToques } from "@/components/sonidos/fonoteca-toques";
import { Lightbox } from "@/components/ui/lightbox";
import type { Hermandad } from "@/types/hermandad";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store";
import { PATRONES_HAPTICOS, vibrar } from "@/lib/haptica";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, Music, Users, Shirt, History, Shield, Radio, ImageIcon } from "lucide-react";

type Pestana = "historia" | "pasos" | "itinerario" | "directos" | "galeria" | "sonidos";

const pestanas: Array<{ id: Pestana; label: string }> = [
  { id: "historia", label: "Historia & Datos" },
  { id: "pasos", label: "Tronos & Túnica" },
  { id: "itinerario", label: "Itinerario" },
  { id: "directos", label: "Directos" },
  { id: "galeria", label: "Vídeos" },
  { id: "sonidos", label: "Sonidos" },
];

export function FichaTabs({ hermandad: h }: { hermandad: Hermandad }) {
  const [activa, setActiva] = useState<Pestana>("historia");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const modoAhorro = useUIStore((s) => s.modoAhorro);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 border-b border-border" role="tablist">
        {pestanas.map((p) => (
          <motion.button
            key={p.id}
            role="tab"
            aria-selected={activa === p.id}
            onClick={() => {
              setActiva(p.id);
              vibrar(PATRONES_HAPTICOS.seleccion);
            }}
            whileHover={modoAhorro ? undefined : { y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative rounded-t-md px-4 py-2 text-sm font-medium transition-colors",
              activa === p.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {p.label}
            {activa === p.id && (
              <motion.span
                layoutId="subrayado-pestana"
                className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Transición de pestañas (v10.0 Ultimate): desenfoque morado + halo dorado */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activa}
          initial={modoAhorro ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={modoAhorro ? { opacity: 0 } : { opacity: 0, y: -10, filter: "blur(6px)" }}
          transition={{ duration: modoAhorro ? 0 : 0.3, ease: "easeOut" }}
          className="relative"
        >
          {!modoAhorro && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute -inset-1 rounded-xl ring-1 ring-[#C5A059]"
              initial={{ opacity: 0.95, boxShadow: "0 0 36px 6px rgba(212,175,55,0.5)" }}
              animate={{ opacity: 0, boxShadow: "0 0 0px 0px rgba(74,21,75,0)" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          )}
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
              {/* v3.0: ilustraciones SVG interactivas con colores exactos */}
              {h.vestimenta.correas && (
                <p className="mt-3 flex items-start gap-1.5 text-muted-foreground">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <strong className="text-foreground">Hombres de trono:</strong> {h.vestimenta.correas}
                  </span>
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-start justify-center gap-6 sm:justify-start">
                <TunicaCapirote slug={h.slug} />
                <HombreTrono slug={h.slug} />
              </div>
            </CardContent>
          </Card>
          {h.pasos.map((p, idx) => (
            <CromoHolofoil key={p.nombre} className="space-y-2">
              <FichaPaso paso={p} />
              {p.img && (
                <button
                  type="button"
                  onClick={() => setLightbox(idx)}
                  className="block w-full overflow-hidden rounded-lg border border-border transition-transform hover:scale-[1.02]"
                  aria-label={`Ampliar imagen del trono ${p.nombre}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={`Trono: ${p.nombre}`} className="h-48 w-full object-cover" loading="lazy" />
                </button>
              )}
            </CromoHolofoil>
          ))}
          {lightbox !== null && (
            <Lightbox
              imagenes={h.pasos.filter((p) => p.img).map((p) => p.img!)}
              titulo={`Tronos de ${h.nombrePopular ?? h.nombre}`}
              indiceInicial={Math.min(lightbox, h.pasos.filter((p) => p.img).length - 1)}
              onClose={() => setLightbox(null)}
            />
          )}
        </div>
      )}

      {activa === "itinerario" && <TimelineItinerario itinerario={h.itinerario} />}

      {activa === "directos" && <Directos hermandad={h} />}

      {activa === "sonidos" && (
        <div className="space-y-4">
          {/* v6.0: Fonoteca Sonora del Mayordomo de Trono */}
          <Card>
            <CardContent className="pt-6">
              <FonotecaToques />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" /> Toques de campana y marchas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-[#C5A059]/40 bg-[#1E0A24]/5 p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Shirt className="h-4 w-4 text-primary" /> Toca la campana como un mayordomo de trono
                </p>
                <p className="mb-3 text-xs text-muted-foreground">
                  Tres toques de alerta con audio de baja latencia y vibración háptica en tu móvil.
                </p>
                <BotonCampana />
              </div>
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
                  {s.tipo === "campana_trono" && (
                    <div className="mb-2">
                      <BotonCampana src={s.src} />
                    </div>
                  )}
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <audio controls preload="metadata" crossOrigin="anonymous" className="w-full" src={s.src}>
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
          {h.imagenes.length > 0 && (
            <div className="sm:col-span-2">
              <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                <ImageIcon className="h-4 w-4 text-primary" /> Galería de tronos (toca para ampliar)
              </p>
              <div className="flex flex-wrap gap-3">
                {h.imagenes.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setLightbox(i)}
                    className="overflow-hidden rounded-lg border border-border transition-transform hover:scale-105"
                    aria-label={`Ampliar imagen ${i + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Imagen ${i + 1} de ${h.nombre}`} className="h-28 w-40 object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          )}
          {h.videos.length === 0 && h.imagenes.length === 0 && (
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
          </motion.div>
        </AnimatePresence>
    </div>
  );
}
