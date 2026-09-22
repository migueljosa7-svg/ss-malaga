import type { Incidencia, CalleCortada } from "@/types/hermandad";

/** Timestamp relativo "hace X minutos": simula un feed que siempre está fresco. */
function hace(min: number): string {
  return new Date(Date.now() - min * 60_000).toISOString();
}

export const incidenciasMock: Incidencia[] = [
  {
    id: "i-1",
    hermandadId: "h-cautivo",
    tipo: "retraso",
    titulo: "El Cautivo retrasa su salida 15 minutos",
    descripcion:
      "La cruz de guía de El Cautivo saldrá a las 18:15 por la afluencia en la Trinidad. El palio se estima en Larios hacia las 21:30.",
    timestamp: hace(4),
    nivel: "warning",
  },
  {
    id: "i-2",
    hermandadId: "h-mena",
    tipo: "aglomeracion",
    titulo: "Saturación en el Desembarco de la Legión (Muelle 2)",
    descripcion:
      "Aforo completo en el Puerto. Se recomienda seguir el traslado desde el Paseo del Parque o la Alameda.",
    timestamp: hace(12),
    nivel: "danger",
  },
  {
    id: "i-3",
    tipo: "lluvia",
    titulo: "Aviso meteorológico: probabilidad de lluvia a las 03:00",
    descripcion:
      "AEMET avisa de chubascos en la madrugada. Posible protección de tronos en el Recorrido Oficial.",
    timestamp: hace(25),
    nivel: "warning",
  },
  {
    id: "i-4",
    tipo: "cambio_recorrido",
    titulo: "Cambio de itinerario en Plaza de la Constitución",
    descripcion:
      "Por obras, el acceso a Larios se realizará por Granada en lugar de la Plaza de la Constitución.",
    timestamp: hace(40),
    nivel: "info",
  },
  {
    id: "i-5",
    hermandadId: "h-rico",
    tipo: "retraso",
    titulo: "El Rico demora su entrada en la Tribuna de los Pobres",
    descripcion:
      "Se estima cruzar la Tribuna 20 minutos más tarde de lo previsto por la afluencia en la Plaza de la Merced.",
    timestamp: hace(8),
    nivel: "danger",
  },
  {
    id: "i-6",
    hermandadId: "h-zamarrilla",
    tipo: "calle_cortada",
    titulo: "Calle Carretería cortada al tráfico y peatonalizada",
    descripcion:
      "Cortada entre Pasillo de Santa Isabel y Atarazanas por el paso de la Zamarrilla. Acceso alternativo por la Alameda.",
    timestamp: hace(18),
    nivel: "info",
  },
  {
    id: "i-7",
    hermandadId: "h-pollinica",
    tipo: "aglomeracion",
    titulo: "Gran afluencia de familias en la salida de la Pollinica",
    descripcion:
      "Zona colapsada en el Santuario de la Victoria. Se recomienda seguir el trono desde la Alameda o Larios.",
    timestamp: hace(55),
    nivel: "warning",
  },
  {
    id: "i-8",
    hermandadId: "h-esperanza",
    tipo: "retraso",
    titulo: "La Esperanza retrasa su cruz de guía 10 minutos",
    descripcion:
      "La salida de la Trinidad se demora por la afluencia. El Gran Trono de la Virgen se espera en Larios hacia las 03:30.",
    timestamp: hace(6),
    nivel: "warning",
  },
  {
    id: "i-9",
    tipo: "aglomeracion",
    titulo: "Recorrido Oficial al completo en Calle Larios",
    descripcion:
      "Aforo máximo entre la Alameda y la Plaza de la Constitución. Accesos alternativos por Molina Lario y Cortina del Muelle.",
    timestamp: hace(14),
    nivel: "danger",
  },
  {
    id: "i-10",
    hermandadId: "h-expiracion",
    tipo: "retraso",
    titulo: "La Expiración entra en Carretería 25 minutos tarde",
    descripcion:
      "El ritmo paso a paso acumula retraso. La recogida se estima en la Trinidad hacia la 01:15.",
    timestamp: hace(22),
    nivel: "warning",
  },
  {
    id: "i-11",
    tipo: "cambio_recorrido",
    titulo: "Corte en Pasillo de Santa Isabel: regreso modificado",
    descripcion:
      "El regreso se realizará por Atarazanas y Puente de los Alemanes al permanecer el Pasillo cortado por seguridad.",
    timestamp: hace(35),
    nivel: "info",
  },
  {
    id: "i-12",
    hermandadId: "h-sepulcro",
    tipo: "cambio_recorrido",
    titulo: "El Sepulcro procesionará en silencio absoluto",
    descripcion:
      "Se recuerda que el Viernes Santo el Sepulcro procesiona sin música. Se pide respeto y silencio en Larios.",
    timestamp: hace(90),
    nivel: "info",
  },
];

export const callesCortadasMock: CalleCortada[] = [
  {
    id: "cc-1",
    nombreCalle: "Calle Larios (tramo Alameda - Constitución)",
    coords: [
      { lat: 36.7198, lng: -4.4207 },
      { lat: 36.7211, lng: -4.4195 },
    ],
    motivo: "Recorrido Oficial: paso de todas las hermandades / aforo máximo",
    horaInicio: "09:00",
    horaFinEstimada: "14:00",
  },
  {
    id: "cc-2",
    nombreCalle: "Calle Granada (tramo Tribuna de los Pobres)",
    coords: [
      { lat: 36.7222, lng: -4.4186 },
      { lat: 36.7238, lng: -4.4169 },
    ],
    motivo: "Itinerario de hermandades / Tribuna de los Pobres",
    horaInicio: "09:00",
    horaFinEstimada: "14:00",
  },
  {
    id: "cc-3",
    nombreCalle: "Pasillo de Santa Isabel / Carretería (tramo Pasillo)",
    coords: [
      { lat: 36.7216, lng: -4.4212 },
      { lat: 36.7230, lng: -4.4237 },
    ],
    motivo: "Paso de hermandades de la Trinidad / peatonalización",
    horaInicio: "18:00",
    horaFinEstimada: "02:00",
  },
  {
    id: "cc-4",
    nombreCalle: "Alameda Principal (tramo Larios - Centro)",
    coords: [
      { lat: 36.7198, lng: -4.4207 },
      { lat: 36.7196, lng: -4.4223 },
    ],
    motivo: "Recorrido Oficial: aforo máximo y paso de tronos",
    horaInicio: "09:00",
    horaFinEstimada: "14:00",
  },
  {
    id: "cc-5",
    nombreCalle: "Calle Santo Domingo / Trinidad (entorno Santo Domingo)",
    coords: [
      { lat: 36.7230, lng: -4.4258 },
      { lat: 36.7235, lng: -4.4248 },
    ],
    motivo: "Desembarco y traslado de la Legión / salida de la Mena",
    horaInicio: "10:00",
    horaFinEstimada: "02:00",
  },
  {
    id: "cc-6",
    nombreCalle: "Calle Andrés Pérez (entorno Expiración)",
    coords: [
      { lat: 36.7220, lng: -4.4252 },
      { lat: 36.7225, lng: -4.4245 },
    ],
    motivo: "Salida y recogida de Los Dolores / Expiración",
    horaInicio: "19:00",
    horaFinEstimada: "01:30",
  },
];