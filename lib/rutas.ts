import type { CalleCortada } from "@/types/hermandad";
import {
  nodosRuta,
  aristasRuta,
  distanciaMetros,
  type NodoRuta,
} from "@/lib/data/grafo-rutas";

export interface ResultadoRuta {
  exito: boolean;
  mensaje?: string;
  nodosCamino: NodoRuta[];
  aristasCamino: string[]; // ids de aristas recorridas
  tramosCortadosEvitados: string[]; // ids de calles cortadas que rodeó
  distanciaTotal: number; // metros
  pasosEstimados: number; // minutos andando
}

/**
 * Dijkstra sobre el grafo peatonal del centro evitando las aristas
 * que corresponden a calles cortadas activas.
 */
export function calcularRutaPeatonal(
  desdeId: string,
  hastaId: string,
  callesCortadas: CalleCortada[]
): ResultadoRuta {
  const cortadasIds = new Set(callesCortadas.map((c) => c.id));

  const nodoInicio = nodosRuta.find((n) => n.id === desdeId);
  const nodoFin = nodosRuta.find((n) => n.id === hastaId);
  if (!nodoInicio || !nodoFin) {
    return {
      exito: false,
      mensaje: "Origen o destino no encontrados en el mapa.",
      nodosCamino: [],
      aristasCamino: [],
      tramosCortadosEvitados: [],
      distanciaTotal: 0,
      pasosEstimados: 0,
    };
  }

  // Lista de adyacencia
  const adyacencia = new Map<string, Array<{ hasta: string; aristaId: string; peso: number; cortada: string | null }>>();
  for (const a of aristasRuta) {
    const bloqueada = cortadasIds.has(a.id);
    const n1 = nodosRuta.find((n) => n.id === a.desde)!;
    const n2 = nodosRuta.find((n) => n.id === a.hasta)!;
    const peso = distanciaMetros(n1, n2);

    if (!adyacencia.has(a.desde)) adyacencia.set(a.desde, []);
    if (!adyacencia.has(a.hasta)) adyacencia.set(a.hasta, []);
    // Aristas bidireccionales; las cortadas quedan excluidas del grafo
    if (!bloqueada) {
      adyacencia.get(a.desde)!.push({ hasta: a.hasta, aristaId: a.id, peso, cortada: null });
      adyacencia.get(a.hasta)!.push({ hasta: a.desde, aristaId: a.id, peso, cortada: null });
    }
  }

  // Dijkstra
  const dist = new Map<string, number>();
  const prev = new Map<string, { nodo: string; aristaId: string }>();
  const visitados = new Set<string>();
  for (const n of nodosRuta) dist.set(n.id, Infinity);
  dist.set(desdeId, 0);

  while (visitados.size < nodosRuta.length) {
    let actual: string | null = null;
    let min = Infinity;
    for (const [id, d] of dist) {
      if (!visitados.has(id) && d < min) {
        min = d;
        actual = id;
      }
    }
    if (actual === null || min === Infinity) break;
    visitados.add(actual);

    for (const vecino of adyacencia.get(actual) ?? []) {
      const nueva = dist.get(actual)! + vecino.peso;
      if (nueva < (dist.get(vecino.hasta) ?? Infinity)) {
        dist.set(vecino.hasta, nueva);
        prev.set(vecino.hasta, { nodo: actual, aristaId: vecino.aristaId });
      }
    }
  }

  if (!isFinite(dist.get(hastaId) ?? Infinity)) {
    return {
      exito: false,
      mensaje:
        "No hay ruta peatonal disponible evitando las calles cortadas. Prueba otro origen/destino.",
      nodosCamino: [],
      aristasCamino: [],
      tramosCortadosEvitados: [],
      distanciaTotal: 0,
      pasosEstimados: 0,
    };
  }

  // Reconstruir camino
  const caminoNodos: NodoRuta[] = [];
  const caminoAristas: string[] = [];
  let cursor = hastaId;
  while (cursor !== desdeId) {
    caminoNodos.unshift(nodosRuta.find((n) => n.id === cursor)!);
    const p = prev.get(cursor);
    if (!p) break;
    caminoAristas.unshift(p.aristaId);
    cursor = p.nodo;
  }
  caminoNodos.unshift(nodoInicio);

  // Calles cortadas evitadas = las cortadas conectadas a los nodos que rodeamos
  const tramosEvitados = callesCortadas
    .map((c) => c.id)
    .filter((id) => !caminoAristas.includes(id));

  const distanciaTotal = dist.get(hastaId)!;
  return {
    exito: true,
    nodosCamino: caminoNodos,
    aristasCamino: caminoAristas,
    tramosCortadosEvitados: tramosEvitados,
    distanciaTotal,
    pasosEstimados: Math.ceil(distanciaTotal / 80), // 80 m/min andando con gente
  };
}
