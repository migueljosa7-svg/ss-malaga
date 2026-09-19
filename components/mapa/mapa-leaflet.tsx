"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Popup } from "react-leaflet";
import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/lib/store";
import type { CalleCortada } from "@/types/hermandad";
import "leaflet/dist/leaflet.css";

const SEVILLA: [number, number] = [37.3925, -5.9945];

export function MapaLeaflet() {
  const [mounted, setMounted] = useState(false);
  const capas = useUIStore((s) => s.capasMapa);

  useEffect(() => setMounted(true), []);

  const { data: calles } = useQuery<CalleCortada[]>({
    queryKey: ["calles-cortadas"],
    queryFn: async () => {
      const res = await fetch("/api/incidencias?tipo=calles_cortadas");
      if (!res.ok) throw new Error("Error cargando calles cortadas");
      return res.json();
    },
  });

  if (!mounted) {
    return <div className="h-[500px] rounded-lg bg-muted" aria-label="Cargando mapa…" />;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 text-sm">
        {(["pasos", "callesCortadas", "itinerarios"] as const).map((capa) => (
          <label key={capa} className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={capas[capa]}
              onChange={() => useUIStore.getState().toggleCapa(capa)}
            />
            {capa === "pasos" ? "Pasos" : capa === "callesCortadas" ? "Calles cortadas" : "Itinerarios"}
          </label>
        ))}
      </div>
      <MapContainer center={SEVILLA} zoom={13} className="h-[500px] rounded-lg z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {capas.callesCortadas &&
          (calles ?? []).map((c) => (
            <Polyline
              key={c.id}
              positions={c.coords.map((p) => [p.lat, p.lng] as [number, number])}
              pathOptions={{ color: "#dc2626", weight: 6, dashArray: "8 8" }}
            >
              <Popup>
                <strong>{c.nombreCalle}</strong>
                <br />
                {c.motivo}
                <br />
                {c.horaInicio} – {c.horaFinEstimada}
              </Popup>
            </Polyline>
          ))}
      </MapContainer>
    </div>
  );
}
