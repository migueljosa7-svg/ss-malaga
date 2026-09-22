"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Polyline, Popup, CircleMarker, Marker, useMap } from "react-leaflet";
import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/lib/store";
import { calcularRutaPeatonal } from "@/lib/rutas";
import { itinerarioRealista, hermandadEnDirecto, posicionEnMinuto } from "@/lib/telemetria";
import { useRutasCallejeras } from "@/lib/osrm";
import { nodosRuta } from "@/lib/data/grafo-rutas";
import { divIconTrono } from "@/lib/iconos-tronos";
import { HudTelemetria, type TronoSeleccionado } from "@/components/mapa/hud-telemetria";
import { RadarCruces } from "@/components/mapa/radar-cruces";
import { DirectosFlotantes } from "@/components/mapa/directos-flotantes";
import { SelectorEnDirecto } from "@/components/mapa/selector-en-directo";
import type { CalleCortada, Hermandad } from "@/types/hermandad";
import "leaflet/dist/leaflet.css";

const MALAGA: [number, number] = [36.7213, -4.4214];

// ---------- Utilidades de tiempo ----------
function formatearMinutos(total: number): string {
  const t = ((total % 1440) + 1440) % 1440;
  const h = Math.floor(t / 60);
  const m = t % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
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
  const modoAhorro = useUIStore((s) => s.modoAhorro);

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

  // v6.0: filtrado estricto — por defecto solo se dibujan las procesiones
  // activamente en la calle (evita saturación de rutas y cruces fantasma).
  const [soloEnCalle, setSoloEnCalle] = useState(true);

  useEffect(() => setMounted(true), []);

  const { data: calles } = useQuery<CalleCortada[]>({
    queryKey: ["calles-cortadas"],
    queryFn: async () => {
      const res = await fetch("/api/incidencias?tipo=calles_cortadas");
      if (!res.ok) throw new Error("Error cargando calles cortadas");
      return res.json();
    },
    // v6.0: en modo ahorro se reduce el refetch y se confía en la caché PWA
    refetchInterval: modoAhorro ? 300_000 : 60_000,
    staleTime: modoAhorro ? 300_000 : 30_000,
    gcTime: 3_600_000, // retiene datos en caché para fallback offline
  });

  const { data: hermandades } = useQuery<Hermandad[]>({
    queryKey: ["hermandades"],
    queryFn: async () => {
      const res = await fetch("/api/hermandades");
      if (!res.ok) throw new Error("Error cargando hermandades");
      const json = await res.json();
      return json.data as Hermandad[];
    },
    refetchInterval: modoAhorro ? 300_000 : 60_000,
    staleTime: modoAhorro ? 300_000 : 30_000,
    gcTime: 3_600_000,
  });

  const minutoActual = useMemo(() => {
    if (minutoSimulado !== null) return minutoSimulado;
    const ahora = new Date();
    return ahora.getHours() * 60 + ahora.getMinutes();
  }, [minutoSimulado]);

  // v3.0 Fix React #310: este hook DEBE ejecutarse en TODOS los renderizados.
  // Antes estaba tras el `if (!mounted) return`, provocando que el número de
  // hooks difiriera entre el primer render (SSR/skeleton) y el segundo.
  const boundsObjetivo = useMemo<[number, number][] | null>(() => {
    if (focoCruce) return focoCruce;
    return ruta?.exito ? ruta.nodosCamino.map((n) => [n.lat, n.lng] as [number, number]) : null;
  }, [focoCruce, ruta]);

  function calcularRuta() {
    setRuta(calcularRutaPeatonal(origen, destino, calles ?? []));
  }

  // v6.0: lista efectiva de hermandades a dibujar (filtrado en directo)
  const visibles = useMemo(() => {
    const todas = hermandades ?? [];
    return soloEnCalle ? todas.filter((h) => hermandadEnDirecto(h, minutoActual)) : todas;
  }, [hermandades, soloEnCalle, minutoActual]);

  // v7.0: rutas densas por callejero real (OSRM); fallback al grafo local.
  const rutasCallejeras = useRutasCallejeras(visibles);

  if (!mounted) {
    return <div className="h-[520px] animate-pulse rounded-lg bg-muted" aria-label="Cargando mapa…" />;
  }


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
          <button onClick={calcularRuta} className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 hover:opacity-90">
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

      {/* Capas + panel flotante de directos (v4.0) */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <DirectosFlotantes />
        {(["pasos", "callesCortadas", "itinerarios"] as const).map((capa) => (
          <label key={capa} className="flex items-center gap-1.5">
            <input type="checkbox" checked={capas[capa]} onChange={() => useUIStore.getState().toggleCapa(capa)} />
            {capa === "pasos" ? "Posición de pasos" : capa === "callesCortadas" ? "Calles cortadas" : "Itinerarios"}
          </label>
        ))}
        {/* v6.0: filtrado estricto de procesiones activas */}
        <label className="flex items-center gap-1.5 font-medium text-primary">
          <input type="checkbox" checked={soloEnCalle} onChange={() => setSoloEnCalle((v) => !v)} />
          Solo en la calle
        </label>
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

      {/* Leyenda de protocolo cofrade malagueño (v4.0, ampliada v6.0) */}
      <div className="borde-destello-dorado rounded-lg border border-[#D4AF37]/40 bg-card px-3 py-2 text-[11px] text-muted-foreground">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="font-semibold uppercase tracking-wider text-[#D4AF37]">Protocolo:</span>
          <span title="Abre la procesión portando la cruz de la hermandad">✝️ Cruz de Guía</span>
          <span title="Oficial que gobierna el trono y toca la campana">🔔 Mayordomo de Campana</span>
          <span title="Cuadrilla que porta el trono a hombros">💪 Hombres de Trono</span>
          <span title="Brazos metálicos que flanquean al trono del Señor">🕯️ Varales</span>
          <span title="Coro de saetas y cantos que acompaña al paso">🎼 Masa Coral</span>
          <span title="Punto donde la cofradía espera su turno en la Carrera Oficial">🚩 Cabeza de Procesión</span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[#D4AF37]/20 pt-1.5">
          <span className="font-semibold uppercase tracking-wider text-[#D4AF37]">Puntos icónicos:</span>
          <span title="Balcón oficial desde donde la autoridad saluda a los tronos">🏛️ Tribuna de los Pobres</span>
          <span title="Eje de la Carrera Oficial malagueña">🛍️ Calle Larios</span>
          <span title="Fachada donde los tronos estacionan ante la Santa Iglesia Catedral">⛪ Entorno de la Catedral</span>
        </div>
      </div>

      {/* Radar de cruces de tronos (v2.0 Max) */}
      <RadarCruces
        hermandades={hermandades ?? []}
        minuto={minutoActual}
        onCentrar={setFocoCruce}
      />

      <div className="relative">
      <MapContainer center={MALAGA} zoom={15} className="h-[520px] rounded-lg z-0">
        {/* v7.0: capa base clara (CartoDB Positron) — etiquetado nítido de calles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains={["a", "b", "c", "d"]}
          maxZoom={20}
        />
        <AjustarVista bounds={boundsObjetivo} />
        {/* v6.0: dropdown de procesiones en la calle con flyTo */}
        <SelectorEnDirecto hermandades={hermandades ?? []} minuto={minutoActual} />
        {/* v7.0: itinerarios por callejero real (OSRM) — estilo GIS con casing
            exterior contrastado + línea central del color de la cofradía.
            Fallback: grafo local de esquinas si OSRM no responde. */}
        {capas.itinerarios &&
          visibles.map((h) => {
            const color = coloresPorDia[h.diaSemana] ?? "#7f1d1d";
            const trazado = rutasCallejeras[h.slug] ?? itinerarioRealista(h);
            return (
              <Fragment key={`itinerario-${h.slug}`}>
                <Polyline
                  positions={trazado}
                  pathOptions={{
                    color: "#0f172a",
                    weight: 8,
                    opacity: 0.85,
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                  interactive={false}
                />
                <Polyline
                  positions={trazado}
                  pathOptions={{
                    color,
                    weight: 4,
                    opacity: 0.95,
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                >
                  <Popup>
                    <div className="popup-cofrade min-w-[200px] max-w-[260px]">
                      <p className="popup-nombre">{h.nombrePopular ?? h.nombre}</p>
                      <p className="popup-meta">
                        {h.diaSemana} ·{" "}
                        {rutasCallejeras[h.slug]
                          ? "ruta GPS por el callejero (OSRM)"
                          : "itinerario por el Centro Histórico"}
                      </p>
                    </div>
                  </Popup>
                </Polyline>
              </Fragment>
            );
          })}

        {/* Posición simulada / en vivo de las cruces de guía y palios (v6.0: filtrado) */}
        {capas.pasos &&
          visibles.map((h) => {
            const pos = posicionEnMinuto(h, minutoActual);
            if (!pos) return null;
            const enCalle = pos.estado === "en_calle";
            // v3.0: indicador de pulso animado sobre el trono seleccionado
            const esSeleccionado = seleccion?.slug === h.slug;
            // El palio camina por el mismo itinerario ≈tiempoPaso por detrás de la cruz de guía
            const posPalio = posicionEnMinuto(h, minutoActual - h.tiempoPaso);
            const palioEnCalle = posPalio?.estado === "en_calle";
            // v7.0: divIcon institucional — escudo, siglas (EL RICO, ZA…) y pulso GPS
            const iconoCristo = divIconTrono(h, "cristo", {
              enDirecto: enCalle,
              seleccionado: esSeleccionado && seleccion?.tipo === "cristo",
            });
            const iconoVirgen = divIconTrono(h, "virgen", {
              enDirecto: palioEnCalle,
              seleccionado: esSeleccionado && seleccion?.tipo === "virgen",
            });
            return (
              <Fragment key={`pos-${h.slug}`}>
                {/* v3.0: anillo de pulso animado sobre el trono seleccionado */}
                {esSeleccionado && enCalle && (
                  <CircleMarker
                    center={[pos.lat, pos.lng]}
                    radius={18}
                    pathOptions={{
                      color: seleccion?.tipo === "virgen" ? "#1B4D3E" : "#4A154B",
                      fillColor: "#D4AF37",
                      fillOpacity: 0.15,
                      weight: 3,
                      className: "pulso-trono",
                    }}
                    interactive={false}
                  />
                )}
                {palioEnCalle && posPalio && (
                  <Marker
                    position={[posPalio.lat, posPalio.lng]}
                    icon={iconoVirgen}
                    opacity={0.95}
                    eventHandlers={{ click: () => setSeleccion({ slug: h.slug, tipo: "virgen" }) }}
                  >
                    <Popup>
                      <div className="popup-cofrade min-w-[200px] max-w-[260px]">
                        <p className="popup-titulo">✨ Trono de Virgen (Palio)</p>
                        <p className="popup-nombre">{h.nombrePopular ?? h.nombre}</p>
                        <p className="popup-meta">
                          🕒 {formatearMinutos(minutoActual)} · camina ≈{h.tiempoPaso} min tras la cruz de guía
                        </p>
                        <span className="popup-accion">Toca el marcador para ver telemetría</span>
                      </div>
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
                      <div className="popup-cofrade min-w-[200px] max-w-[260px]">
                        <p className="popup-titulo">✝ Trono de Cristo</p>
                        <p className="popup-nombre">{h.nombrePopular ?? h.nombre}</p>
                        <p className="popup-meta">🕒 En itinerario — {formatearMinutos(minutoActual)}</p>
                        <span className="popup-accion">Toca el marcador para ver telemetría</span>
                      </div>
                    </Popup>
                  </Marker>
                ) : (
                  <CircleMarker
                    center={[pos.lat, pos.lng]}
                    radius={8}
                    pathOptions={{ color: "#94a3b8", fillColor: "#64748b", fillOpacity: 0.8, weight: 2 }}
                  >
                    <Popup>
                      <div className="popup-cofrade min-w-[200px] max-w-[260px]">
                        <p className="popup-nombre">{h.nombrePopular ?? h.nombre}</p>
                        <p className="popup-meta">
                          {pos.estado === "antes" ? "⏳ Aún no ha salido" : "⛪ Ya está en su templo"}
                        </p>
                      </div>
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



