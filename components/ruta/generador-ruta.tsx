"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Footprints, Sparkles, Route as RouteIcon } from "lucide-react";
import { getHermandades } from "@/lib/data";
import { nodosRuta, aristasRuta, distanciaMetros } from "@/lib/data/grafo-rutas";
import { calcularRutaPeatonal } from "@/lib/rutas";
import type { CalleCortada } from "@/types/hermandad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Generador "Mi Ruta Cofrade" (v2.0 Max): elige varias hermandades y optimiza
 * el itinerario a pie entre sus salidas (vecino más cercano sobre el grafo
 * peatonal del Centro Histórico, evitando las calles cortadas).
 */

const hermandades = getHermandades();

interface Escala {
  slug: string;
  nombre: string;
  dia: string;
  nodeId: string;
  nodeNombre: string;
  /** Coordenadas GPS reales de la salida (fallback haversine v11.0) */
  salida: { lat: number; lng: number };
}

interface Tramo {
  desde: string;
  hasta: string;
  exito: boolean;
  mensaje?: string;
  metros: number;
  minutos: number;
  calles: string[];
}

interface PlanRuta {
  orden: Escala[];
  tramos: Tramo[];
  totalMetros: number;
  totalMinutos: number;
}

/**
 * Nodo más cercano al punto. `usados` evita que dos hermandades se anclen al
 * MISMO nodo (bug v11.0: Zamarrilla y La Esperanza ancladas ambas en "Puente
 * de los Alemanes" → Dijkstra de un nodo a sí mismo = 0.00 km / 0 min).
 */
function nodoMasCercano(punto: { lat: number; lng: number }, usados?: Set<string>): (typeof nodosRuta)[number] {
  let mejor: (typeof nodosRuta)[number] | null = null;
  let mejorD = Infinity;
  for (const n of nodosRuta) {
    if (usados?.has(n.id)) continue;
    const d = distanciaMetros(n, punto);
    if (d < mejorD) {
      mejorD = d;
      mejor = n;
    }
  }
  if (mejor) return mejor;
  // Todos los nodos ocupados: repetir sin restricción (grafo > nº de selecciones)
  return nodoMasCercano(punto);
}

export function GeneradorRutaCofrade() {
  const [seleccion, setSeleccion] = useState<string[]>([]);
  const [plan, setPlan] = useState<PlanRuta | null>(null);

  const { data: calles } = useQuery<CalleCortada[]>({
    queryKey: ["calles-cortadas"],
    queryFn: async () => {
      const res = await fetch("/api/incidencias?tipo=calles_cortadas");
      if (!res.ok) throw new Error("Error cargando calles cortadas");
      return res.json();
    },
  });

  function toggle(slug: string) {
    setSeleccion((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
    setPlan(null);
  }

  function optimizar() {
    if (seleccion.length < 2) return;

    // 1) Cada hermandad se ancla al nodo del grafo más próximo a su salida,
    //    SIN repetir nodo entre cofradías distintas (fix 0.00 km v11.0)
    const nodosUsados = new Set<string>();
    const escalas: Escala[] = seleccion.map((slug) => {
      const h = hermandades.find((x) => x.slug === slug)!;
      const punto = h.itinerario[0] ?? { lat: 36.7213, lng: -4.4214 };
      const nodo = nodoMasCercano(punto, nodosUsados);
      nodosUsados.add(nodo.id);
      return {
        slug,
        nombre: h.nombrePopular ?? h.nombre,
        dia: h.diaSemana,
        nodeId: nodo.id,
        nodeNombre: nodo.nombre,
        salida: { lat: punto.lat, lng: punto.lng },
      };
    });

    // 2) Optimización greedy (vecino más cercano) desde la primera selección
    const orden: Escala[] = [];
    const pendientes = [...escalas];
    let actual = pendientes.shift()!;
    orden.push(actual);
    while (pendientes.length > 0) {
      const nodoActual = nodosRuta.find((n) => n.id === actual.nodeId)!;
      let idxMejor = 0;
      let dMejor = Infinity;
      pendientes.forEach((e, i) => {
        const n2 = nodosRuta.find((n) => n.id === e.nodeId)!;
        const d = distanciaMetros(nodoActual, n2);
        if (d < dMejor) {
          dMejor = d;
          idxMejor = i;
        }
      });
      actual = pendientes.splice(idxMejor, 1)[0];
      orden.push(actual);
    }

    // 3) Tramos a pie con Dijkstra (respeta cortes y estima desvíos)
    const tramos: Tramo[] = [];
    for (let i = 0; i < orden.length - 1; i++) {
      const r = calcularRutaPeatonal(orden[i].nodeId, orden[i + 1].nodeId, calles ?? []);
      // v11.0: si el grafo falla, está desconectado o devuelve 0 m, se calcula
      // la distancia Haversine REAL entre las salidas GPS de ambas cofradías
      // (factor urbano ×1,35 y mín. 50 m) para que NUNCA dé 0.00 km.
      const directo = distanciaMetros(orden[i].salida, orden[i + 1].salida);
      const sinGrafo = !r.exito || r.distanciaTotal <= 0;
      const metros = sinGrafo ? Math.max(directo * 1.35, 50) : r.distanciaTotal;
      const minutos = sinGrafo
        ? Math.max(1, Math.round(metros / 80)) // ≈4,8 km/h andando
        : r.pasosEstimados;
      tramos.push({
        desde: orden[i].nombre,
        hasta: orden[i + 1].nombre,
        exito: true,
        mensaje: sinGrafo ? "Estimación directa (fallback GPS haversine)" : undefined,
        metros,
        minutos,
        calles: sinGrafo
          ? ["Trayecto directo a pie (estimación GPS haversine)"]
          : [
              ...new Set(
                r.aristasCamino
                  .map((id) => aristasRuta.find((a) => a.id === id)?.nombreCalle)
                  .filter((c): c is string => Boolean(c))
              ),
            ],
      });
    }

    setPlan({
      orden,
      tramos,
      totalMetros: tramos.reduce((s, t) => s + t.metros, 0),
      totalMinutos: tramos.reduce((s, t) => s + t.minutos, 0),
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RouteIcon className="h-5 w-5 text-primary" /> Elige tus hermandades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {hermandades.map((h) => (
              <li key={h.slug}>
                <label className="flex cursor-pointer items-start gap-2 rounded-md border border-border p-2 text-sm transition-colors hover:bg-muted/60">
                  <input
                    type="checkbox"
                    checked={seleccion.includes(h.slug)}
                    onChange={() => toggle(h.slug)}
                    className="mt-1"
                  />
                  <span>
                    <strong>{h.nombrePopular ?? h.nombre}</strong>
                    <br />
                    <span className="text-xs text-muted-foreground">
                      {h.diaSemana} · salida desde {h.itinerario[0]?.nombre ?? h.sede}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={optimizar}
            disabled={seleccion.length < 2}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#4A154B] px-4 py-2 text-sm font-medium text-[#D4AF37] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            Optimizar mi ruta cofrade
          </button>
          {seleccion.length === 1 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Selecciona al menos dos hermandades para planificar el recorrido.
            </p>
          )}
        </CardContent>
      </Card>

      {plan && (
        <Card className="borde-orfebre">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Footprints className="h-5 w-5 text-primary" /> Tu ruta optimizada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ol className="space-y-1">
              {plan.orden.map((e, i) => (
                <li key={e.slug} className="flex items-center gap-2">
                  <Badge variant="secondary">{i + 1}</Badge>
                  <span>
                    <strong>{e.nombre}</strong>{" "}
                    <span className="text-xs text-muted-foreground">
                      ({e.dia} · ancla: {e.nodeNombre})
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <ul className="space-y-2 border-t border-border pt-3">
              {plan.tramos.map((t, i) => (
                <li key={i} className="rounded-md bg-muted/40 p-2">
                  {t.exito ? (
                    <>
                      <p>
                        🚶 {t.desde} → {t.hasta}:{" "}
                        <strong>
                          {(t.metros / 1000).toFixed(2)} km · ≈{t.minutos} min
                        </strong>
                      </p>
                      {t.calles.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Por: {t.calles.join(" → ")}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-danger">
                      ⚠️ {t.desde} → {t.hasta}: {t.mensaje}
                    </p>
                  )}
                </li>
              ))}
            </ul>
            <p className="border-t border-border pt-2 font-medium">
              Total: {(plan.totalMetros / 1000).toFixed(2)} km · ≈{plan.totalMinutos} min andando
              {plan.tramos.some((t) => !t.exito) &&
                " (algunos tramos no pudieron calcularse)"}
            </p>
            <p className="text-xs text-muted-foreground">
              Optimización por vecino más cercano sobre {nodosRuta.length} nodos del Centro
              Histórico, evitando las calles cortadas activas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

