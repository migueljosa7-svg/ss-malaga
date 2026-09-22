"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Polyline, Popup, CircleMarker, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/lib/store";
import { calcularRutaPeatonal } from "@/lib/rutas";
import { nodosRuta } from "@/lib/data/grafo-rutas";
import { iconoTronoCristo, iconoTronoVirgen } from "@/lib/iconos-tronos";
import { HudTelemetria, type TronoSeleccionado } from "@/components/mapa/hud-telemetria";
import { RadarCruces } from "@/components/mapa/radar-cruces";
import type { CalleCortada, Hermandad } from "@/types/hermandad";
import "leaflet/dist/leaflet.css";

const MALAGA: [number, number] = [36.7213, -4.4214];

// ---------- Utilidades de tiempo ----------
function minutosDeHora(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function formatearMinutos(total: number): string {
  const t = ((total % 1440) + 1440) % 1440;
  const h = Math.floor(t / 60);
  const m = t % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Convierte itinerario a minutos acumulados gestionando el salto de medianoche. */
function itinerarioEnMinutos(h: Hermandad): Array<{ punto: Hermandad["itinerario"][number]; min: number }> {
  const puntos = h.itinerario;
  const res: Array<{ punto: Hermandad["itinerario"][number]; min: number }> = [];
  let offset = 0;
  let prev = -1;
  for (const p of puntos) {
    let m = minutosDeHora(p.horaTeorica) + offset;
    if (prev >= 0 && m < prev) {
      offset += 1440;
      m += 1440;
    }
    prev = m;
    res.push({ punto: p, min: m });
  }
  return res;
}

/** Interpola la posición de la cruz de guía para un minuto dado. */
function posicionEnMinuto(h: Hermandad, minuto: number) {
  const it = itinerarioEnMinutos(h);
  if (it.length === 0) return null;
  if (minuto <= it[0].min) return { lat: it[0].punto.lat, lng: it[0].punto.lng, estado: "antes" };
  if (minuto >= it[it.length - 1].min)
    return { lat: it[it.length - 1].punto.lat, lng: it[it.length - 1].punto.lng, estado: "despues" };
  for (let i = 0; i < it.length - 1; i++) {
    const a = it[i];
    const b = it[i + 1];
    if (minuto >= a.min && minuto <= b.min) {
      const t = b.min === a.min ? 0 : (minuto - a.min) / (b.min - a.min);
      return {
        lat: a.punto.lat + (b.punto.lat - a.punto.lat) * t,
        lng: a.punto.lng + (b.punto.lng - a.punto.lng) * t,
        estado: "en_calle",
      };
    }
  }
  return null;
}

const coloresPorDia: Record<string, string> = {
  "Domingo de Ramos": "#2563eb",
  "Lunes Santo": "#7c3aed",
  "Martes Santo": "#0d9488",
  "Miércoles Santo": "#ea580c",
  "Jueves Santo": "#0284c7",
  Madrugada: "#7f1d1d",
  "Viernes Santo": "#b91c1c",
  "Sábado Santo": "#4d7c0f",
  "Domingo de Resurrección": "#16a34a",
};

/** Componente para ajustar la vista cuando cambia la ruta calculada. */
function AjustarVista({ bounds }: { bounds: [number, number][] | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) map.fitBounds(bounds, { padding: [40, 40] });
  }, [bounds, map]);
  return null;
}

export function MapaInteligente() {
  const [mounted, setMounted] = useState(false);
  const capas = useUIStore((s) => s.capasMapa);

  // Simulador de hora: null = en vivo
  const [minutoSimulado, setMinutoSimulado] = useState<number | null>(null);
  const [sliderValor, setSliderValor] = useState(0);

  // Buscador de rutas A -> B
  const [origen, setOrigen] = useState("larios-alameda");
  const [destino, setDestino] = useState("catedral");
  const [ruta, setRuta] = useState<ReturnType<typeof calcularRutaPeatonal> | null>(null);

  // HUD de telemetría: trono seleccionado al hacer clic en un marcador
  const [seleccion, setSeleccion] = useState<TronoSeleccionado>(null);

  // Radar de cruces: foco del mapa sobre un encuentro cofrade
  const [focoCruce, setFocoCruce] = useState<[number, number][] | null>(null);

  useEffect(() => setMounted(true), []);

  const { data: calles } = useQuery<CalleCortada[]>({
    queryKey: ["calles-cortadas"],
    queryFn: async () => {
      const res = await fetch("/api/incidencias?tipo=calles_cortadas");
      if (!res.ok) throw new Error("Error cargando calles cortadas");
      return res.json();
    },
  });

  const { data: hermandades } = useQuery<Hermandad[]>({
    queryKey: ["hermandades"],
    queryFn: async () => {
      const res = await fetch("/api/hermandades");
      if (!res.ok) throw new Error("Error cargando hermandades");
      const json = await res.json();
      return json.data as Hermandad[];
    },
  });

  const minutoActual = useMemo(() => {
    if (minutoSimulado !== null) return minutoSimulado;
    const ahora = new Date();
    return ahora.getHours() * 60 + ahora.getMinutes();
  }, [minutoSimulado]);

  function calcularRuta() {
    setRuta(calcularRutaPeatonal(origen, destino, calles ?? []));
  }

  if (!mounted) {
    return <div className="h-[520px] animate-pulse rounded-lg bg-muted" aria-label="Cargando mapa…" />;
  }

  const boundsObjetivo = useMemo<[number, number][] | null>(() => {
    if (focoCruce) return focoCruce;
    return ruta?.exito ? ruta.nodosCamino.map((n) => [n.lat, n.lng] as [number, number]) : null;
  }, [focoCruce, ruta]);

  return (
    <div className="space-y-4">
      {/* Simulador de hora / en vivo */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={minutoSimulado !== null}
              onChange={(e) => {
                if (e.target.checked) {
                  setSliderValor(minutoActual);
                  setMinutoSimulado(minutoActual);
                } else setMinutoSimulado(null);
              }}
            />
            Simulador de hora
          </label>
          {minutoSimulado !== null && (
            <>
              <input
                type="range"
                min={0}
                max={1439}
                step={5}
                value={sliderValor}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setSliderValor(v);
                  setMinutoSimulado(v);
                }}
                className="min-w-[220px] flex-1"
                aria-label="Hora simulada"
              />
              <span className="font-mono text-lg font-bold text-primary">
                {formatearMinutos(minutoActual)}
              </span>
              <div className="w-full sm:w-auto">
                <p className="mb-1 text-[11px] text-muted-foreground">Saltar a un momento clave:</p>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {([
                    ["540", "09:00 Pollinica"],
                    ["1080", "18:00 Cautivo / Sepulcro"],
                    ["1200", "20:00 Tribuna"],
                    ["180", "03:00 Esperanza Madrugá"],
                  ] as Array<[string, string]>).map(([v, label]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        const n = Number(v);
                        setSliderValor(n);
                        setMinutoSimulado(n);
                      }}
                      className="rounded-full border border-border bg-background px-2.5 py-1 transition-colors hover:border-primary hover:text-primary"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          {minutoSimulado === null && (
            <span className="flex items-center gap-2 text-sm">
              <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-red-600" />
              En vivo — hora local
            </span>
          )}
        </div>
      </div>

      {/* Buscador de rutas peatonales */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-2 text-sm font-semibold">Ruta peatonal evitando calles cortadas</p>
        <div className="flex flex-wrap items-center gap-2">
          <select value={origen} onChange={(e) => setOrigen(e.target.value)} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm">
            {nodosRuta.map((n) => (
              <option key={n.id} value={n.id}>{n.nombre}</option>
            ))}
          </select>
          <span className="text-muted-foreground">→</span>
          <select value={destino} onChange={(e) => setDestino(e.target.value)} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm">
            {nodosRuta.map((n) => (
              <option key={n.id} value={n.id}>{n.nombre}</option>
            ))}
          </select>
          <button onClick={calcularRuta} className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
            Calcular ruta
          </button>
        </div>
        {ruta && (
          <div className="mt-3 text-sm">
            {ruta.exito ? (
              <>
                <p className="text-green-700">
                  ✅ {ruta.nodosCamino.map((n) => n.nombre).join(" → ")}
                </p>
                <p className="text-muted-foreground">
                  {(ruta.distanciaTotal / 1000).toFixed(1)} km · ≈ {ruta.pasosEstimados} min andando
                  {ruta.distanciaSinCortes < ruta.distanciaTotal &&
                    ` · +${Math.round(ruta.distanciaTotal - ruta.distanciaSinCortes)} m de desvío por cortes`}
                  {ruta.tramosCortadosEvitados.length > 0 &&
                    ` · Rodea ${ruta.tramosCortadosEvitados.length} tramo(s) cortado(s)`}
                </p>
              </>
            ) : (
              <p className="text-danger">{ruta.mensaje}</p>
            )}
          </div>
        )}
      </div>

      {/* Capas */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {(["pasos", "callesCortadas", "itinerarios"] as const).map((capa) => (
          <label key={capa} className="flex items-center gap-1.5">
            <input type="checkbox" checked={capas[capa]} onChange={() => useUIStore.getState().toggleCapa(capa)} />
            {capa === "pasos" ? "Posición de pasos" : capa === "callesCortadas" ? "Calles cortadas" : "Itinerarios"}
          </label>
        ))}
        <span className="ml-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-[#4A154B] ring-2 ring-[#D4AF37]" /> Trono de Cristo
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-[#1B4D3E] ring-2 ring-[#D4AF37]" /> Trono de Virgen (Palio)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-6 rounded bg-[#B3261E]" /> Tramo cortado
          </span>
        </span>
      </div>

      {/* Radar de cruces de tronos (v2.0 Max) */}
      <RadarCruces
        hermandades={hermandades ?? []}
        minuto={minutoActual}
        onCentrar={setFocoCruce}
      />

      <div className="relative">
      <MapContainer center={MALAGA} zoom={15} className="h-[520px] rounded-lg z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AjustarVista bounds={boundsObjetivo} />
        {/* Itinerarios teóricos */}
        {capas.itinerarios &&
          (hermandades ?? []).map((h) => (
            <Polyline
              key={h.slug}
              positions={itinerarioEnMinutos(h).map((i) => [i.punto.lat, i.punto.lng] as [number, number])}
              pathOptions={{ color: coloresPorDia[h.diaSemana] ?? "#7f1d1d", weight: 3, opacity: 0.55 }}
            >
              <Popup>
                <strong>{h.nombrePopular ?? h.nombre}</strong>
                <br />
                {h.diaSemana}
              </Popup>
            </Polyline>
          ))}

        {/* Posición simulada / en vivo de las cruces de guía y palios */}
        {capas.pasos &&
          (hermandades ?? []).map((h) => {
            const pos = posicionEnMinuto(h, minutoActual);
            if (!pos) return null;
            const enCalle = pos.estado === "en_calle";
            // El palio camina por el mismo itinerario ≈tiempoPaso por detrás de la cruz de guía
            const posPalio = posicionEnMinuto(h, minutoActual - h.tiempoPaso);
            const palioEnCalle = posPalio?.estado === "en_calle";
            const iconoCristo = L.icon({
              iconUrl: iconoTronoCristo(),
              iconSize: [30, 42],
              iconAnchor: [15, 42],
              popupAnchor: [0, -38],
            });
            const iconoVirgen = L.icon({
              iconUrl: iconoTronoVirgen(),
              iconSize: [30, 42],
              iconAnchor: [15, 42],
              popupAnchor: [0, -38],
            });
            return (
              <Fragment key={`pos-${h.slug}`}>
                {palioEnCalle && posPalio && (
                  <Marker
                    position={[posPalio.lat, posPalio.lng]}
                    icon={iconoVirgen}
                    opacity={0.95}
                    eventHandlers={{ click: () => setSeleccion({ slug: h.slug, tipo: "virgen" }) }}
                  >
                    <Popup>
                      <strong>Trono de Virgen (Palio) — {h.nombrePopular ?? h.nombre}</strong>
                      <br />
                      {formatearMinutos(minutoActual)} · camina ≈{h.tiempoPaso} min tras la cruz de guía
                      <br />
                      <em>Clic en el marcador para ver telemetría</em>
                    </Popup>
                  </Marker>
                )}
                {enCalle ? (
                  <Marker
                    position={[pos.lat, pos.lng]}
                    icon={iconoCristo}
                    eventHandlers={{ click: () => setSeleccion({ slug: h.slug, tipo: "cristo" }) }}
                  >
                    <Popup>
                      <strong>Trono de Cristo — {h.nombrePopular ?? h.nombre}</strong>
                      <br />
                      En itinerario — {formatearMinutos(minutoActual)}
                      <br />
                      <em>Clic en el marcador para ver telemetría</em>
                    </Popup>
                  </Marker>
                ) : (
                  <CircleMarker
                    center={[pos.lat, pos.lng]}
                    radius={8}
                    pathOptions={{ color: "#94a3b8", fillColor: "#64748b", fillOpacity: 0.8, weight: 2 }}
                  >
                    <Popup>
                      <strong>{h.nombrePopular ?? h.nombre}</strong>
                      <br />
                      {pos.estado === "antes" ? "Aún no ha salido" : "Ya está en su templo"}
                    </Popup>
                  </CircleMarker>
                )}
              </Fragment>
            );
          })}

        {/* Calles cortadas */}
        {capas.callesCortadas &&
          (calles ?? []).map((c) => (
            <Polyline
              key={c.id}
              positions={c.coords.map((p) => [p.lat, p.lng] as [number, number])}
              pathOptions={{ color: "#dc2626", weight: 6, dashArray: "8 8" }}
            >
              <Popup>
                <strong>🚧 {c.nombreCalle}</strong>
                <br />
                {c.motivo}
                <br />
                Cortada: {c.horaInicio} – {c.horaFinEstimada}
              </Popup>
            </Polyline>
          ))}

        {/* Ruta calculada */}
        {ruta?.exito && (
          <>
            <Polyline
              positions={ruta.nodosCamino.map((n) => [n.lat, n.lng] as [number, number])}
              pathOptions={{ color: "#16a34a", weight: 5 }}
            />
            {ruta.nodosCamino.map((n) => (
              <CircleMarker key={`r-${n.id}`} center={[n.lat, n.lng]} radius={5} pathOptions={{ color: "#16a34a", fillOpacity: 1 }}>
                <Popup>{n.nombre}</Popup>
              </CircleMarker>
            ))}
          </>
        )}
        </MapContainer>
        <HudTelemetria
          seleccion={seleccion}
          hermandades={hermandades ?? []}
          minuto={minutoActual}
          onCerrar={() => setSeleccion(null)}
        />
      </div>
    </div>
  );
}



