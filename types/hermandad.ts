// ---------- Enums / uniones estrictas ----------
export type DiaSemana =
  | "Domingo de Ramos"
  | "Lunes Santo"
  | "Martes Santo"
  | "Miércoles Santo"
  | "Jueves Santo"
  | "Madrugada"
  | "Viernes Santo"
  | "Sábado Santo"
  | "Domingo de Resurrección";

export type EstadoPaso = "en_templo" | "en_calle" | "retrasado" | "recogido";

export type TipoIncidencia =
  | "retraso"
  | "cambio_recorrido"
  | "lluvia"
  | "calle_cortada"
  | "aglomeracion";

export type NivelIncidencia = "info" | "warning" | "danger";

// ---------- Subtipos ----------
export interface PuntoItinerario {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  horaTeorica: string; // "HH:mm"
  horaEstimadaReal?: string;
  estadoPaso: EstadoPaso;
}

export interface Paso {
  tipo: "Misterio" | "Palio" | "Título";
  nombre: string;
  escultores: string[];
  capataz: string;
  costaleros: number; // Hombres de trono en Málaga
  mayordomos?: number;
  banda?: string; // Banda que acompaña al trono
  anio: number;
  pesoKg?: number; // Peso aproximado del trono en kg (v1.0 Pro)
  descripcion?: string;
  img?: string; // Imagen/ilustración del trono (fallback SVG en /public/images)
}

export interface Vestimenta {
  descripcionTunica: string;
  colorAntifaz: string;
  capa: boolean;
  escudo?: string;
  escudoImg?: string;
  cirios?: string;
  habitoImg?: string; // Ilustración del hábito/capirote (fallback SVG)
  correas?: string; // Correas y detalles del uniforme de Hombres de Trono
  uniformeTronoImg?: string;
}

export interface Sonido {
  id: string;
  titulo: string;
  tipo: "campana_trono" | "marcha" | "saeta" | "ambiente";
  src: string; // Ruta pública en /public/audio/
  descripcion?: string;
}

export interface VideoEmbed {
  id: string;
  titulo: string;
  youtubeId: string;
}

// ---------- Entidades principales ----------
export interface Hermandad {
  id: string;
  slug: string;
  nombre: string;
  nombrePopular?: string;
  sede: string;
  diaSemana: DiaSemana;
  añoFundacion: number;
  numeroHermanos: number;
  numeroNazarenos: number;
  tiempoPaso: number; // minutos
  musica: string[];
  sonidos?: Sonido[];
  vestimenta: Vestimenta;
  pasos: Paso[];
  historia: string;
  curiosidades: string[];
  itinerario: PuntoItinerario[];
  videos: VideoEmbed[];
  imagenes: string[];
  callesCortadas?: string[]; // ids de CalleCortada relacionadas
}

export interface Incidencia {
  id: string;
  hermandadId?: string;
  tipo: TipoIncidencia;
  titulo: string;
  descripcion: string;
  timestamp: string; // ISO
  nivel: NivelIncidencia;
}

export interface CalleCortada {
  id: string;
  nombreCalle: string;
  coords: Array<{ lat: number; lng: number }>;
  motivo: string;
  horaInicio: string;
  horaFinEstimada: string;
}
