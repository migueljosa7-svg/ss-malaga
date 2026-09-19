import type { Incidencia, CalleCortada } from "@/types/hermandad";

export const incidenciasMock: Incidencia[] = [
  {
    id: "i-1",
    hermandadId: "h-macarena",
    tipo: "retraso",
    titulo: "La Macarena retrasa su salida 15 minutos",
    descripcion:
      "La entrada de la cruz de guía se prevé a las 00:15 por retraso en la operación de salida.",
    timestamp: new Date().toISOString(),
    nivel: "warning",
  },
  {
    id: "i-2",
    hermandadId: "h-gran-poder",
    tipo: "aglomeracion",
    titulo: "Saturación en Calle Sierpes",
    descripcion:
      "Aforo completo en el tramo Sierpes entre Plaza del Salvador y Rioja. Se recomienda acceder por O'Donnell.",
    timestamp: new Date(Date.now() - 20 * 60_000).toISOString(),
    nivel: "danger",
  },
  {
    id: "i-3",
    tipo: "lluvia",
    titulo: "Aviso meteorológico: probabilidad de lluvia a las 04:00",
    descripcion:
      "AEMET avisa de chubascos en la madrugada. Posible protección de pasos en la Carrera Oficial.",
    timestamp: new Date(Date.now() - 45 * 60_000).toISOString(),
    nivel: "warning",
  },
  {
    id: "i-4",
    tipo: "cambio_recorrido",
    titulo: "Cambio de itinerario en Plaza del Salvador",
    descripcion:
      "Por obras, el paso de la Campana a Salvador se realizará por Rioja en lugar de Córdoba.",
    timestamp: new Date(Date.now() - 70 * 60_000).toISOString(),
    nivel: "info",
  },
  {
    id: "i-5",
    hermandadId: "h-esperanza-triana",
    tipo: "retraso",
    titulo: "La Esperanza de Triana demora la entrada en la Carrera Oficial",
    descripcion:
      "Se estima cruzar el Puente de Triana 20 minutos más tarde de lo previsto por la afluencia.",
    timestamp: new Date(Date.now() - 12 * 60_000).toISOString(),
    nivel: "danger",
  },
  {
    id: "i-6",
    hermandadId: "h-cachorro",
    tipo: "calle_cortada",
    titulo: "Calle Castilla cortada al tráfico y peatonalizada",
    descripcion:
      "Cortada entre Pagés del Corro y Callao por el paso del Cachorro. Acceso alternativo por Pureza.",
    timestamp: new Date(Date.now() - 30 * 60_000).toISOString(),
    nivel: "info",
  },
  {
    id: "i-7",
    hermandadId: "h-borriquita",
    tipo: "aglomeracion",
    titulo: "Zona infantil colapsada en Laraña",
    descripcion:
      "Gran afluencia de familias con niños en la salida. Se recomienda seguir el paso desde la Alameda o Orfila.",
    timestamp: new Date(Date.now() - 55 * 60_000).toISOString(),
    nivel: "warning",
  },
  {
    id: "i-8",
    tipo: "lluvia",
    titulo: "Posible lluvia sobre las 19:00 en el Domingo de Ramos",
    descripcion:
      "Modelos de predicción: 60% de probabilidad. Las hermandades preparan plásticos para los pasos.",
    timestamp: new Date(Date.now() - 100 * 60_000).toISOString(),
    nivel: "info",
  },
];

export const callesCortadasMock: CalleCortada[] = [
  {
    id: "cc-1",
    nombreCalle: "Calle Sierpes (tramo Salvador - Rioja)",
    coords: [
      { lat: 37.3905, lng: -5.9939 },
      { lat: 37.3909, lng: -5.9945 },
    ],
    motivo: "Paso de cofradía / aforo máximo",
    horaInicio: "22:00",
    horaFinEstimada: "04:00",
  },
  {
    id: "cc-2",
    nombreCalle: "Calle Feria (tramo Resolana - Bécquer)",
    coords: [
      { lat: 37.4021, lng: -5.9935 },
      { lat: 37.3981, lng: -5.9957 },
    ],
    motivo: "Itinerario de la Madrugada",
    horaInicio: "23:30",
    horaFinEstimada: "05:00",
  },
  {
    id: "cc-3",
    nombreCalle: "Calle Castilla (Triana, tramo Pagés - Callao)",
    coords: [
      { lat: 37.3848, lng: -6.0055 },
      { lat: 37.3865, lng: -6.0028 },
    ],
    motivo: "Paso del Cachorro",
    horaInicio: "00:00",
    horaFinEstimada: "06:00",
  },
  {
    id: "cc-4",
    nombreCalle: "Calle Álvarez Quintero (tramo Plaza del Salvador - Cánovas)",
    coords: [
      { lat: 37.3907, lng: -5.9926 },
      { lat: 37.391, lng: -5.9931 },
    ],
    motivo: "Paso de la Pasión",
    horaInicio: "16:00",
    horaFinEstimada: "00:30",
  },
  {
    id: "cc-5",
    nombreCalle: "Calle San Juan de la Palma (tramo Feria - Orfila)",
    coords: [
      { lat: 37.3961, lng: -5.9922 },
      { lat: 37.3958, lng: -5.9937 },
    ],
    motivo: "Salida de La Amargura",
    horaInicio: "14:00",
    horaFinEstimada: "20:00",
  },
];

