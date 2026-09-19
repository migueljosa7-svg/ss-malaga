import type { Incidencia, CalleCortada } from "@/types/hermandad";

/** Timestamp relativo "hace X minutos": simula un feed que siempre está fresco. */
function hace(min: number): string {
  return new Date(Date.now() - min * 60_000).toISOString();
}

export const incidenciasMock: Incidencia[] = [
  {
    id: "i-1",
    hermandadId: "h-macarena",
    tipo: "retraso",
    titulo: "La Macarena retrasa su salida 15 minutos",
    descripcion:
      "La entrada de la cruz de guía se prevé a las 00:15 por retraso en la operación de salida.",
    timestamp: hace(4),
    nivel: "warning",
  },
  {
    id: "i-2",
    hermandadId: "h-gran-poder",
    tipo: "aglomeracion",
    titulo: "Saturación en Calle Sierpes",
    descripcion:
      "Aforo completo en el tramo Sierpes entre Plaza del Salvador y Rioja. Se recomienda acceder por O'Donnell.",
    timestamp: hace(12),
    nivel: "danger",
  },
  {
    id: "i-3",
    tipo: "lluvia",
    titulo: "Aviso meteorológico: probabilidad de lluvia a las 04:00",
    descripcion:
      "AEMET avisa de chubascos en la madrugada. Posible protección de pasos en la Carrera Oficial.",
    timestamp: hace(25),
    nivel: "warning",
  },
  {
    id: "i-4",
    tipo: "cambio_recorrido",
    titulo: "Cambio de itinerario en Plaza del Salvador",
    descripcion:
      "Por obras, el paso de la Campana a Salvador se realizará por Rioja en lugar de Córdoba.",
    timestamp: hace(40),
    nivel: "info",
  },
  {
    id: "i-5",
    hermandadId: "h-esperanza-triana",
    tipo: "retraso",
    titulo: "La Esperanza de Triana demora la entrada en la Carrera Oficial",
    descripcion:
      "Se estima cruzar el Puente de Triana 20 minutos más tarde de lo previsto por la afluencia.",
    timestamp: hace(8),
    nivel: "danger",
  },
  {
    id: "i-6",
    hermandadId: "h-cachorro",
    tipo: "calle_cortada",
    titulo: "Calle Castilla cortada al tráfico y peatonalizada",
    descripcion:
      "Cortada entre Pagés del Corro y Callao por el paso del Cachorro. Acceso alternativo por Pureza.",
    timestamp: hace(18),
    nivel: "info",
  },
  {
    id: "i-7",
    hermandadId: "h-borriquita",
    tipo: "aglomeracion",
    titulo: "Zona infantil colapsada en Laraña",
    descripcion:
      "Gran afluencia de familias con niños en la salida. Se recomienda seguir el paso desde la Alameda o Orfila.",
    timestamp: hace(55),
    nivel: "warning",
  },
  {
    id: "i-8",
    tipo: "lluvia",
    titulo: "Posible lluvia sobre las 19:00 en el Domingo de Ramos",
    descripcion:
      "Modelos de predicción: 60% de probabilidad. Las hermandades preparan plásticos para los pasos.",
    timestamp: hace(100),
    nivel: "info",
  },
  {
    id: "i-9",
    hermandadId: "h-gitanos",
    tipo: "retraso",
    titulo: "Los Gitanos retrasan su cruz de guía 10 minutos",
    descripcion:
      "La salida del Buen Suceso se demora por la afluencia en Pi y Margall. El palio se espera hacia las 01:15.",
    timestamp: hace(6),
    nivel: "warning",
  },
  {
    id: "i-10",
    tipo: "aglomeracion",
    titulo: "Carrera Oficial al completo en Avenida de la Constitución",
    descripcion:
      "Aforo máximo entre Plaza del Triunfo y Puerta de Jerez. Accesos alternativos por San Gregorio y Fray Ceferino.",
    timestamp: hace(14),
    nivel: "danger",
  },
  {
    id: "i-11",
    hermandadId: "h-pasion",
    tipo: "retraso",
    titulo: "El palio de Pasión entra en la Campana 25 minutos tarde",
    descripcion:
      "El ritmo del paso a paso en Álvarez Quintero acumula retraso. La recogida se estima en la capilla a las 01:50.",
    timestamp: hace(22),
    nivel: "warning",
  },
  {
    id: "i-12",
    hermandadId: "h-san-bernardo",
    tipo: "cambio_recorrido",
    titulo: "Corte en Santa María la Blanca: regreso modificado",
    descripcion:
      "San Bernardo regresará por Puerta de la Carne y Mateos Gago al permanecer la calle cortada por un montacargas.",
    timestamp: hace(35),
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
  {
    id: "cc-6",
    nombreCalle: "Avenida de la Constitución (Catedral - Plaza del Triunfo)",
    coords: [
      { lat: 37.3867, lng: -5.9942 },
      { lat: 37.3856, lng: -5.9936 },
    ],
    motivo: "Carrera Oficial: aforo máximo y paso de todas las hermandades",
    horaInicio: "20:00",
    horaFinEstimada: "13:30",
  },
  {
    id: "cc-7",
    nombreCalle: "Calle Jesús del Gran Poder (San Lorenzo - Campana)",
    coords: [
      { lat: 37.3947, lng: -5.9959 },
      { lat: 37.3938, lng: -5.9961 },
    ],
    motivo: "Salida de la Soledad de San Lorenzo",
    horaInicio: "17:30",
    horaFinEstimada: "20:30",
  },
  {
    id: "cc-8",
    nombreCalle: "Calle Pureza (Triana, tramo Capilla de los Marineros)",
    coords: [
      { lat: 37.3878, lng: -6.0043 },
      { lat: 37.3877, lng: -6.0061 },
    ],
    motivo: "Salida de la Esperanza de Triana",
    horaInicio: "02:00",
    horaFinEstimada: "05:45",
  },
  {
    id: "cc-9",
    nombreCalle: "Alameda de Hércules (eje central)",
    coords: [
      { lat: 37.3961, lng: -5.9983 },
      { lat: 37.3973, lng: -5.9981 },
    ],
    motivo: "Regreso de La Amargura: peatonalización completa",
    horaInicio: "22:00",
    horaFinEstimada: "01:00",
  },
];

