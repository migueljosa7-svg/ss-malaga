import type { CalleCortada } from "@/types/hermandad";

/**
 * Grafo peatonal simplificado del centro de Sevilla para el calculador de rutas.
 * Los nodos son puntos clave (plazas, cruces) y las aristas, tramos de calle.
 * Las aristas cuyo id coincide con un `id` de CalleCortada quedan bloqueadas.
 */

export interface NodoRuta {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
}

export interface AristaRuta {
  id: string;
  desde: string; // id nodo
  hasta: string; // id nodo
  nombreCalle: string;
}

export const nodosRuta: NodoRuta[] = [
  { id: "campana", nombre: "La Campana", lat: 37.3938, lng: -5.9961 },
  { id: "duque", nombre: "Plaza del Duque", lat: 37.3947, lng: -5.9949 },
  { id: "alameda", nombre: "Alameda de Hércules", lat: 37.3961, lng: -5.9983 },
  { id: "feria", nombre: "Calle Feria (Mercado)", lat: 37.3981, lng: -5.9957 },
  { id: "macarena", nombre: "Puerta de la Macarena", lat: 37.4033, lng: -5.9907 },
  { id: "salvador", nombre: "Plaza del Salvador", lat: 37.3905, lng: -5.9939 },
  { id: "sierpes", nombre: "Calle Sierpes (centro)", lat: 37.3909, lng: -5.9945 },
  { id: "catedral", nombre: "Catedral", lat: 37.3867, lng: -5.9942 },
  { id: "jerez", nombre: "Puerta de Jerez", lat: 37.3854, lng: -5.993 },
  { id: "arenal", nombre: "El Arenal", lat: 37.3861, lng: -5.9973 },
  { id: "triana", nombre: "Puente de Triana", lat: 37.3862, lng: -6.0013 },
  { id: "castilla", nombre: "Calle Castilla (Triana)", lat: 37.3865, lng: -6.0028 },
  { id: "san-gonzalo", nombre: "San Gonzalo (Triana)", lat: 37.3846, lng: -6.0068 },
  { id: "san-lorenzo", nombre: "Plaza de San Lorenzo", lat: 37.3943, lng: -5.9973 },
  { id: "san-vicente", nombre: "Plaza de San Vicente", lat: 37.3946, lng: -5.9986 },
];

export const aristasRuta: AristaRuta[] = [
  { id: "cc-2", desde: "feria", hasta: "macarena", nombreCalle: "Calle Feria" },
  { id: "e-campana-feria", desde: "campana", hasta: "feria", nombreCalle: "Calle Feria (tramo bajo)" },
  { id: "e-campana-duque", desde: "campana", hasta: "duque", nombreCalle: "Calle Teodosio" },
  { id: "e-duque-alameda", desde: "duque", hasta: "alameda", nombreCalle: "Calle Trajano" },
  { id: "e-alameda-sanvicente", desde: "alameda", hasta: "san-vicente", nombreCalle: "Calle San Vicente de Paúl" },
  { id: "e-sanvicente-sanlorenzo", desde: "san-vicente", hasta: "san-lorenzo", nombreCalle: "Calle Castelar" },
  { id: "e-sanlorenzo-campana", desde: "san-lorenzo", hasta: "campana", nombreCalle: "Calle Jesús del Gran Poder" },
  { id: "e-campana-sierpes", desde: "campana", hasta: "sierpes", nombreCalle: "Calle Sierpes (norte)" },
  { id: "e-sierpes-salvador", desde: "sierpes", hasta: "salvador", nombreCalle: "Calle Córdoba" },
  { id: "cc-1", desde: "salvador", hasta: "sierpes", nombreCalle: "Calle Sierpes (sur)" },
  { id: "e-salvador-catedral", desde: "salvador", hasta: "catedral", nombreCalle: "Avenida de la Constitución" },
  { id: "cc-4", desde: "salvador", hasta: "catedral", nombreCalle: "Calle Álvarez Quintero" },
  { id: "e-catedral-jerez", desde: "catedral", hasta: "jerez", nombreCalle: "Avenida de la Constitución (sur)" },
  { id: "e-catedral-arenal", desde: "catedral", hasta: "arenal", nombreCalle: "Calle Pastor y Landero" },
  { id: "e-arenal-triana", desde: "arenal", hasta: "triana", nombreCalle: "Puente de Triana" },
  { id: "e-triana-castilla", desde: "triana", hasta: "castilla", nombreCalle: "Calle Castilla" },
  { id: "cc-3", desde: "castilla", hasta: "san-gonzalo", nombreCalle: "Calle Castilla (oeste)" },
  { id: "e-jerez-triana-alt", desde: "jerez", hasta: "triana", nombreCalle: "Calle Reyes Católicos - Puente" },
];

/** Distancia aproximada en metros entre dos coordenadas (haversine). */
export function distanciaMetros(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
