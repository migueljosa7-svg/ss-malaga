import type { CalleCortada } from "@/types/hermandad";

/**
 * Grafo peatonal simplificado del Centro Histórico de Málaga para el calculador de rutas.
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
  { id: "larios-alameda", nombre: "Calle Larios (Alameda)", lat: 36.7198, lng: -4.4207 },
  { id: "larios-constitucion", nombre: "Plaza de la Constitución", lat: 36.7211, lng: -4.4195 },
  { id: "granada", nombre: "Calle Granada (centro)", lat: 36.7222, lng: -4.4186 },
  { id: "tribuna", nombre: "Tribuna de los Pobres", lat: 36.7238, lng: -4.4169 },
  { id: "catedral", nombre: "Plaza del Obispo / Catedral", lat: 36.7206, lng: -4.4203 },
  { id: "pasillo-santa-isabel", nombre: "Pasillo de Santa Isabel", lat: 36.7216, lng: -4.4212 },
  { id: "carreteria", nombre: "Calle Carretería", lat: 36.7230, lng: -4.4237 },
  { id: "alameda-centro", nombre: "Alameda Principal (centro)", lat: 36.7196, lng: -4.4223 },
  { id: "alameda-pasanteria", nombre: "Alameda Principal (Pasantería)", lat: 36.7192, lng: -4.4247 },
  { id: "cortina-del-muelle", nombre: "Cortina del Muelle", lat: 36.7206, lng: -4.4215 },
  { id: "atasozarral", nombre: "Calle Atarazanas / Atazarral", lat: 36.7221, lng: -4.4247 },
  { id: "cacabelos", nombre: "Puente de los Alemanes / Cacabelos", lat: 36.7240, lng: -4.4251 },
  { id: "la-marina", nombre: "Paseo de la Farola / La Marina", lat: 36.7192, lng: -4.4195 },
  { id: "victoria", nombre: "Plaza de la Merced / Victoria", lat: 36.7240, lng: -4.4174 },
  { id: "cristo-de-la-espiracion", nombre: "Calle Andrés Pérez (Expiración)", lat: 36.7220, lng: -4.4252 },
];

export const aristasRuta: AristaRuta[] = [
  { id: "cc-1", desde: "larios-alameda", hasta: "larios-constitucion", nombreCalle: "Calle Larios" },
  { id: "e-larios-catedral", desde: "larios-constitucion", hasta: "catedral", nombreCalle: "Calle Molina Lario" },
  { id: "e-larios-granada", desde: "larios-constitucion", hasta: "granada", nombreCalle: "Calle Granada (tramo bajo)" },
  { id: "cc-2", desde: "granada", hasta: "tribuna", nombreCalle: "Calle Granada (Tribuna de los Pobres)" },
  { id: "e-tribuna-victoria", desde: "tribuna", hasta: "victoria", nombreCalle: "Calle Victoria" },
  { id: "e-granada-pasillo", desde: "granada", hasta: "pasillo-santa-isabel", nombreCalle: "Pasillo de Santa Isabel" },
  { id: "cc-3", desde: "pasillo-santa-isabel", hasta: "carreteria", nombreCalle: "Pasillo de Santa Isabel / Carretería" },
  { id: "e-carreteria-atasozarral", desde: "carreteria", hasta: "atasozarral", nombreCalle: "Calle Carretería (oeste)" },
  { id: "e-atasozarral-expiracion", desde: "atasozarral", hasta: "cristo-de-la-espiracion", nombreCalle: "Calle Andrés Pérez" },
  { id: "e-atasozarral-cacabelos", desde: "atasozarral", hasta: "cacabelos", nombreCalle: "Calle Cacabelos" },
  { id: "e-cacabelos-tribuna-alt", desde: "cacabelos", hasta: "tribuna", nombreCalle: "Puente de los Alemanes - Calle Trinidad" },
  { id: "cc-4", desde: "larios-alameda", hasta: "alameda-centro", nombreCalle: "Alameda Principal (Larios)" },
  { id: "e-alameda-pasanteria", desde: "alameda-centro", hasta: "alameda-pasanteria", nombreCalle: "Alameda Principal (oeste)" },
  { id: "e-alameda-carreteria", desde: "alameda-pasanteria", hasta: "carreteria", nombreCalle: "Calle Puente de la Alcazaba / Esperanto" },
  { id: "e-catedral-cortina", desde: "catedral", hasta: "cortina-del-muelle", nombreCalle: "Calle Císter" },
  { id: "e-cortina-marina", desde: "cortina-del-muelle", hasta: "la-marina", nombreCalle: "Paseo del Parque" },
  { id: "e-marina-larios", desde: "la-marina", hasta: "larios-alameda", nombreCalle: "Paseo de la Farola" },
  { id: "e-victoria-tribuna-alt", desde: "victoria", hasta: "tribuna", nombreCalle: "Calle Álamos" },
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
