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
  costaleros: number;
  anio: number;
  descripcion?: string;
}

export interface Vestimenta {
  descripcionTunica: string;
  colorAntifaz: string;
  capa: boolean;
  escudo?: string;
  escudoImg?: string;
  cirios?: string;
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
  vestimenta: Vestimenta;
  pasos: Paso[];
  historia: string;
  curiosidades: string[];
  itinerario: PuntoItinerario[];
  videos: VideoEmbed[];
  imagenes: string[];
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
