import type { Incidencia, CalleCortada } from "@/types/hermandad";

/** Timestamp relativo "hace X minutos": simula un feed que siempre está fresco. */
function hace(min: number): string {
  return new Date(Date.now() - min * 60_000).toISOString();
}

export const incidenciasMock: Incidencia[] = [
  {
    id: "i-1",
    hermandadId: "h-la-aurora",
    tipo: "retraso",
    titulo: "La Aurora retrasa su salida 10 minutos",
    descripcion:
      "La cruz de guía saldrá a las 16:40 desde San Miguel Bajo por la afluencia en el Albaicín. El palio se estima en la Carrera de la Virgen sobre las 20:30.",
    timestamp: hace(4),
    nivel: "warning",
  },
  {
    id: "i-2",
    tipo: "aglomeracion",
    titulo: "Aforo completo en la Carrera de la Virgen",
    descripcion:
      "Acceso peatonal limitado entre el Puente de la Virgen y la plaza Bibataubín. Sigue la procesión desde el paseo o la plaza del Campillo.",
    timestamp: hace(14),
    nivel: "danger",
  },
  {
    id: "i-3",
    tipo: "lluvia",
    titulo: "Aviso meteorológico: probabilidad de lluvia en la madrugada",
    descripcion:
      "AEMET avisa de chubascos tras la medianoche. Posible protección de tronos en la Carrera Oficial durante la salida de El Silencio (00:00).",
    timestamp: hace(25),
    nivel: "warning",
  },
  {
    id: "i-4",
    tipo: "cambio_recorrido",
    titulo: "Cambio de itinerario en la Plaza de los Girones",
    descripcion:
      "Por obras en Pavaneras, la Santa Cena y La Cañilla accederán a la Carrera de la Virgen por Enriqueta Lozano y Ancha de la Virgen.",
    timestamp: hace(40),
    nivel: "info",
  },
  {
    id: "i-5",
    hermandadId: "h-los-gitanos",
    tipo: "retraso",
    titulo: "Los Gitanos superan el retraso previsto en la Carrera Oficial",
    descripcion:
      "Se estima que la cruz de guía cruce el Marqués de Gerona 20 minutos más tarde; el regreso a la Abadía del Sacromonte podría retrasarse pasadas las 04:30.",
    timestamp: hace(8),
    nivel: "danger",
  },
  {
    id: "i-6",
    hermandadId: "h-el-silencio",
    tipo: "calle_cortada",
    titulo: "Carrera del Darro cortada al tráfico",
    descripcion:
      "Cortada entre la plaza de Santa Ana y el paseo del Padre Manjón por el paso de El Silencio. Acceso alternativo por la Gran Vía de Colón.",
    timestamp: hace(18),
    nivel: "info",
  },
  {
    id: "i-7",
    hermandadId: "h-la-canilla",
    tipo: "aglomeracion",
    titulo: "Gran afluencia en el Realejo para La Cañilla",
    descripcion:
      "Zona colapsada en la plaza de Santo Domingo. Se recomienda seguir el trono desde la Cuesta de Gomérez o la plaza de los Girones.",
    timestamp: hace(55),
    nivel: "warning",
  },
  {
    id: "i-8",
    hermandadId: "h-los-estudiantes",
    tipo: "retraso",
    titulo: "Los Estudiantes retrasan su cruz de guía 10 minutos",
    descripcion:
      "La salida de la Colegiata se demora por la afluencia en la Plaza de la Universidad. El misterio se espera en Recogidas hacia las 18:25.",
    timestamp: hace(6),
    nivel: "warning",
  },
  {
    id: "i-9",
    tipo: "aglomeracion",
    titulo: "Carrera Oficial al completo en la Carrera de la Virgen",
    descripcion:
      "Aforo máximo entre el Puente de la Virgen y la plaza Bibataubín. Accesos alternativos por la Acera del Darro y la plaza del Campillo.",
    timestamp: hace(14),
    nivel: "danger",
  },
  {
    id: "i-10",
    hermandadId: "h-la-soledad",
    tipo: "retraso",
    titulo: "La Soledad entra en la Carrera de la Virgen 25 minutos tarde",
    descripcion:
      "El ritmo paso a paso acumula retraso por la afluencia en la Plaza de la Universidad. La recogida en San Jerónimo se estima hacia la 01:45.",
    timestamp: hace(22),
    nivel: "warning",
  },
  {
    id: "i-11",
    tipo: "cambio_recorrido",
    titulo: "Corte en la Cuesta de Gomérez: regreso modificado",
    descripcion:
      "El regreso se realizará por la plaza de Santa Ana y la Carrera del Darro al permanecer la cuesta cortada por seguridad.",
    timestamp: hace(35),
    nivel: "info",
  },
  {
    id: "i-12",
    hermandadId: "h-el-silencio",
    tipo: "cambio_recorrido",
    titulo: "El Silencio procesiona en silencio absoluto",
    descripcion:
      "Se recuerda que la salida de medianoche del Jueves Santo se realiza sin música. Se pide respeto y silencio en todo el recorrido.",
    timestamp: hace(90),
    nivel: "info",
  },
];

export const callesCortadasMock: CalleCortada[] = [
  {
    id: "cc-1",
    nombreCalle: "Carrera del Darro (tramo Santa Ana — Padre Manjón)",
    coords: [
      { lat: 37.17718, lng: -3.59505 },
      { lat: 37.17858, lng: -3.592 },
    ],
    motivo: "Paso de hermandades / aforo máximo en el entorno de la Carrera del Darro",
    horaInicio: "18:00",
    horaFinEstimada: "06:00",
  },
  {
    id: "cc-2",
    nombreCalle: "Carrera de la Virgen (paseo central)",
    coords: [
      { lat: 37.1705, lng: -3.5971 },
      { lat: 37.1727, lng: -3.598 },
    ],
    motivo: "Carrera Oficial: paso de todas las hermandades / aforo máximo",
    horaInicio: "16:00",
    horaFinEstimada: "04:00",
  },
  {
    id: "cc-3",
    nombreCalle: "Calle Mesones (tramo Puerta Real)",
    coords: [
      { lat: 37.17346, lng: -3.59969 },
      { lat: 37.17476, lng: -3.60055 },
    ],
    motivo: "Itinerario de regreso a los templos / aforo máximo",
    horaInicio: "19:00",
    horaFinEstimada: "03:00",
  },
  {
    id: "cc-4",
    nombreCalle: "Gran Vía de Colón (tramo centro)",
    coords: [
      { lat: 37.1784, lng: -3.6003 },
      { lat: 37.181, lng: -3.6012 },
    ],
    motivo: "Salida de Los Gitanos desde la Iglesia del Sagrado Corazón",
    horaInicio: "15:30",
    horaFinEstimada: "21:00",
  },
  {
    id: "cc-5",
    nombreCalle: "Cuesta de Gomérez (paso hacia el Realejo)",
    coords: [
      { lat: 37.17682, lng: -3.59601 },
      { lat: 37.17604, lng: -3.59457 },
    ],
    motivo: "Paso de hermandades hacia el Realejo y la Alhambra",
    horaInicio: "17:00",
    horaFinEstimada: "02:00",
  },
  {
    id: "cc-6",
    nombreCalle: "Reyes Católicos (tramo Carrera Oficial)",
    coords: [
      { lat: 37.1779, lng: -3.5984 },
      { lat: 37.1784, lng: -3.6003 },
    ],
    motivo: "Itinerario oficial de todas las hermandades / aforo máximo",
    horaInicio: "15:00",
    horaFinEstimada: "23:00",
  },
];
