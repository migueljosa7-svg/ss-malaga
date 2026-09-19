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
  tramosCortadosEvitados: string[]; // ids de tramos cortados que rodeó el camino
  distanciaTotal: number; // metros
  distanciaSinCortes: number; // metros del mejor camino si no hubiera cortes
  pasosEstimados: number; // minutos andando
}

const FALLBACK: ResultadoRuta = {
  exito: false,
  nodosCamino: [],
  aristasCamino: [],
  tramosCortadosEvitados: [],
  distanciaTotal: 0,
  distanciaSinCortes: 0,
  pasosEstimados: 0,
};

interface SolucionDijkstra {
  dist: Map<string, number>;
  prev: Map<string, { nodo: string; aristaId: string }>;
}

/** Lista de adyacencia del grafo peatonal excluyendo las aristas bloqueadas. */
function construirAdyacencia(bloqueadas: Set<string>) {
  const adyacencia = new Map<string, Array<{ hasta: string; aristaId: string; peso: number }>>();
  for (const a of aristasRuta) {
    if (bloqueadas.has(a.id)) continue; // tramo cortado: excluido del grafo
    const n1 = nodosRuta.find((n) => n.id === a.desde);
    const n2 = nodosRuta.find((n) => n.id === a.hasta);
    if (!n1 || !n2) continue;
    const peso = distanciaMetros(n1, n2);
    if (!adyacencia.has(a.desde)) adyacencia.set(a.desde, []);
    if (!adyacencia.has(a.hasta)) adyacencia.set(a.hasta, []);
    // Aristas bidireccionales peatonales
    adyacencia.get(a.desde)!.push({ hasta: a.hasta, aristaId: a.id, peso });
    adyacencia.get(a.hasta)!.push({ hasta: a.desde, aristaId: a.id, peso });
  }
  return adyacencia;
}

/** Dijkstra simple (nodos ~15): O(n²) más que suficiente para el centro de Sevilla. */
function dijkstra(desdeId: string, bloqueadas: Set<string>): SolucionDijkstra {
  const adyacencia = construirAdyacencia(bloqueadas);
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
  return { dist, prev };
}

function reconstruirCamino(
  desdeId: string,
  hastaId: string,
  prev: SolucionDijkstra["prev"]
): { nodos: NodoRuta[]; aristas: string[] } {
  const nodos: NodoRuta[] = [];
  const aristas: string[] = [];
  let cursor = hastaId;
  let seguro = 0; // guarda anti-bucle con grafos inconsistentes
  while (cursor !== desdeId && seguro < 100) {
    const nodo = nodosRuta.find((n) => n.id === cursor);
    if (nodo) nodos.unshift(nodo);
    const p = prev.get(cursor);
    if (!p) break;
    aristas.unshift(p.aristaId);
    cursor = p.nodo;
    seguro++;
  }
  const inicio = nodosRuta.find((n) => n.id === desdeId);
  if (inicio) nodos.unshift(inicio);
  return { nodos, aristas };
}

/**
 * Ruta peatonal A -> B (Dijkstra) evitando los tramos con calles cortadas.
 * Además, calcula el camino de referencia sin cortes para saber qué tramos
 * cortados ha rodeado realmente y cuántos metros de desvío provocan.
 */
export function calcularRutaPeatonal(
  desdeId: string,
  hastaId: string,
  callesCortadas: CalleCortada[]
): ResultadoRuta {
  const cortadasIds = new Set(callesCortadas.map((c) => c.id));

  const existe =
    nodosRuta.some((n) => n.id === desdeId) && nodosRuta.some((n) => n.id === hastaId);
  if (!existe) {
    return { ...FALLBACK, mensaje: "Origen o destino no encontrados en el mapa." };
  }

  // 1) Camino final respetando los cortes activos
  const conCortes = dijkstra(desdeId, cortadasIds);
  if (!isFinite(conCortes.dist.get(hastaId) ?? Infinity)) {
    return {
      ...FALLBACK,
      mensaje:
        "No hay ruta peatonal disponible evitando las calles cortadas. Prueba otro origen/destino.",
    };
  }

  // 2) Camino de referencia sin cortes (para medir el desvío que provocan)
  const sinCortes = dijkstra(desdeId, new Set<string>());

  const camino = reconstruirCamino(desdeId, hastaId, conCortes.prev);
  const caminoBase = reconstruirCamino(desdeId, hastaId, sinCortes.prev);

  // Un tramo cortado está "rodeado" cuando formaba parte del camino ideal sin cortes.
  const evitados = [...new Set(caminoBase.aristas.filter((id) => cortadasIds.has(id)))];

  const distanciaTotal = conCortes.dist.get(hastaId)!;
  const distBase = sinCortes.dist.get(hastaId) ?? Infinity;
  return {
    exito: true,
    nodosCamino: camino.nodos,
    aristasCamino: camino.aristas,
    tramosCortadosEvitados: evitados,
    distanciaTotal,
    distanciaSinCortes: isFinite(distBase) ? distBase : distanciaTotal,
    pasosEstimados: Math.ceil(distanciaTotal / 80), // 80 m/min andando con gente
  };
}
