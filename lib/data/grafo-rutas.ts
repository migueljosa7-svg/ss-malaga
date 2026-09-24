import type { CalleCortada } from "@/types/hermandad";

/**
 * Grafo peatonal simplificado del Centro Histórico de Granada para el calculador
 * de rutas (Carrera Oficial: Carrera de la Virgen → Bibataubín → Ganivet →
 * Puerta Real → Mesones → Marqués de Gerona → Pasiegas → Catedral).
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
  { id: "plaza-nueva", nombre: "Plaza Nueva", lat: 37.17682, lng: -3.59601 },
  { id: "santa-ana", nombre: "Plaza de Santa Ana", lat: 37.17718, lng: -3.59505 },
  { id: "reyes-catolicos", nombre: "Calle Reyes Católicos (centro)", lat: 37.1779, lng: -3.5984 },
  { id: "isabel-catolica", nombre: "Plaza de Isabel la Católica", lat: 37.1784, lng: -3.6003 },
  { id: "gran-via", nombre: "Gran Vía de Colón (centro)", lat: 37.181, lng: -3.6012 },
  { id: "universidad", nombre: "Plaza de la Universidad", lat: 37.17825, lng: -3.60167 },
  { id: "catedral", nombre: "Plaza de las Pasiegas / S.I. Catedral", lat: 37.17604, lng: -3.59979 },
  { id: "san-jeronimo", nombre: "Calle San Jerónimo", lat: 37.1769, lng: -3.59974 },
  { id: "mesones", nombre: "Calle Mesones", lat: 37.17476, lng: -3.60055 },
  { id: "trinidad", nombre: "Plaza de la Trinidad", lat: 37.1762, lng: -3.6018 },
  { id: "puerta-real", nombre: "Puerta Real de España", lat: 37.17346, lng: -3.59969 },
  { id: "ganivet", nombre: "Calle Ganivet", lat: 37.1742, lng: -3.599 },
  { id: "bibataubin", nombre: "Plaza Bibataubín", lat: 37.1727, lng: -3.598 },
  { id: "carrera-virgen", nombre: "Carrera de la Virgen (paseo central)", lat: 37.1705, lng: -3.5971 },
  { id: "puente-virgen", nombre: "Puente de la Virgen", lat: 37.16979, lng: -3.59695 },
  { id: "san-anton", nombre: "San Antón / Verónica de la Virgen", lat: 37.1705, lng: -3.5997 },
  { id: "santo-angel", nombre: "Monasterio del Santo Ángel Custodio", lat: 37.16987, lng: -3.59976 },
  { id: "recogidas", nombre: "Calle Recogidas", lat: 37.17281, lng: -3.60095 },
  { id: "santo-domingo", nombre: "Plaza de Santo Domingo (Realejo)", lat: 37.17294, lng: -3.59444 },
  { id: "gomerez", nombre: "Cuesta de Gomérez", lat: 37.17604, lng: -3.59457 },
  { id: "carrera-darro", nombre: "Carrera del Darro", lat: 37.17858, lng: -3.592 },
  { id: "san-pedro-pablo", nombre: "Iglesia de San Pedro y San Pablo", lat: 37.17852, lng: -3.59129 },
  { id: "chapiz", nombre: "Cuesta del Chapiz", lat: 37.1793, lng: -3.5943 },
  { id: "san-miguel-bajo", nombre: "San Miguel Bajo (Albaicín)", lat: 37.18068, lng: -3.5967 },
  { id: "san-jeronimo-monasterio", nombre: "Monasterio de San Jerónimo", lat: 37.17917, lng: -3.60462 },
  { id: "sacromonte", nombre: "Abadía del Sacromonte", lat: 37.18317, lng: -3.5771 },
];

export const aristasRuta: AristaRuta[] = [
  // Centro histórico y Carrera Oficial
  { id: "e-plaza-santa-ana", desde: "plaza-nueva", hasta: "santa-ana", nombreCalle: "Plaza Nueva — Plaza de Santa Ana" },
  { id: "e-nueva-reyes", desde: "plaza-nueva", hasta: "reyes-catolicos", nombreCalle: "Calle Reyes Católicos" },
  { id: "cc-6", desde: "reyes-catolicos", hasta: "isabel-catolica", nombreCalle: "Reyes Católicos (tramo Carrera Oficial)" },
  { id: "cc-4", desde: "isabel-catolica", hasta: "gran-via", nombreCalle: "Gran Vía de Colón (tramo centro)" },
  { id: "e-isabel-universidad", desde: "isabel-catolica", hasta: "universidad", nombreCalle: "Joaquín Costa" },
  { id: "e-universidad-juan", desde: "universidad", hasta: "san-jeronimo", nombreCalle: "Calle San Jerónimo" },
  { id: "e-universidad-mesones", desde: "universidad", hasta: "mesones", nombreCalle: "Calle Mesones" },
  { id: "cc-3", desde: "mesones", hasta: "puerta-real", nombreCalle: "Calle Mesones (tramo Puerta Real)" },
  { id: "e-mesones-trinidad", desde: "mesones", hasta: "trinidad", nombreCalle: "Plaza de la Trinidad" },
  { id: "e-puerta-ganivet", desde: "puerta-real", hasta: "ganivet", nombreCalle: "Calle Ganivet" },
  { id: "e-ganivet-bibataubin", desde: "ganivet", hasta: "bibataubin", nombreCalle: "Ángel Ganivet / Plaza del Campillo" },
  { id: "e-puerta-bibataubin", desde: "puerta-real", hasta: "bibataubin", nombreCalle: "Mesones / Marqués de Gerona" },
  { id: "cc-2", desde: "carrera-virgen", hasta: "bibataubin", nombreCalle: "Carrera de la Virgen (paseo central)" },
  { id: "e-carrera-puente", desde: "carrera-virgen", hasta: "puente-virgen", nombreCalle: "Carrera de la Virgen (sur)" },
  { id: "e-puente-anton", desde: "puente-virgen", hasta: "san-anton", nombreCalle: "Puente y Calle San Antón" },
  { id: "e-anton-santoangel", desde: "san-anton", hasta: "santo-angel", nombreCalle: "San Antón" },
  { id: "e-anton-recogidas", desde: "san-anton", hasta: "recogidas", nombreCalle: "Calle Recogidas" },
  { id: "e-recogidas-puerta", desde: "recogidas", hasta: "puerta-real", nombreCalle: "Recogidas / Puerta Real" },
  { id: "e-recogidas-trinidad", desde: "recogidas", hasta: "trinidad", nombreCalle: "Alhóndiga" },
  { id: "e-puerta-catedral", desde: "puerta-real", hasta: "catedral", nombreCalle: "Mesones / Marqués de Gerona" },
  { id: "e-catedral-jeronimo", desde: "catedral", hasta: "san-jeronimo", nombreCalle: "Cárcel Baja / San Jerónimo" },
  { id: "e-catedral-nueva", desde: "catedral", hasta: "plaza-nueva", nombreCalle: "Cárcel Baja" },
  // Realejo, Albaicín y Sacromonte
  { id: "cc-5", desde: "plaza-nueva", hasta: "gomerez", nombreCalle: "Cuesta de Gomérez (paso de la Alhambra)" },
  { id: "e-nueva-domingo", desde: "plaza-nueva", hasta: "santo-domingo", nombreCalle: "Cuesta de los Chinos / Realejo" },
  { id: "e-domingo-santaana", desde: "santo-domingo", hasta: "santa-ana", nombreCalle: "Ancha de Santo Domingo / Plaza Fortuny" },
  { id: "cc-1", desde: "santa-ana", hasta: "carrera-darro", nombreCalle: "Carrera del Darro (tramo Santa Ana)" },
  { id: "e-darro-pedropablo", desde: "carrera-darro", hasta: "san-pedro-pablo", nombreCalle: "Carrera del Darro / Campo del Príncipe" },
  { id: "e-darro-chapiz", desde: "carrera-darro", hasta: "chapiz", nombreCalle: "Cuesta del Chapiz" },
  { id: "e-chapiz-miguel", desde: "chapiz", hasta: "san-miguel-bajo", nombreCalle: "Cuesta de San Gregorio" },
  { id: "e-miguel-santaana", desde: "san-miguel-bajo", hasta: "santa-ana", nombreCalle: "Cárceles / San Juan de los Reyes" },
  { id: "e-universidad-sanjerome", desde: "universidad", hasta: "san-jeronimo-monasterio", nombreCalle: "Avenida de la Constitución" },
  { id: "e-chapiz-sacromonte", desde: "chapiz", hasta: "sacromonte", nombreCalle: "Paseo del Padre Manjón / Camino del Sacromonte" },
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
