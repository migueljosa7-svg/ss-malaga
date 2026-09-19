import { z } from "zod";
import type { Hermandad, Incidencia, CalleCortada } from "@/types/hermandad";

// ---------- Esquemas Zod (validación en APIs y datos) ----------
export const puntoItinerarioSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1).max(120),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  horaTeorica: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  horaEstimadaReal: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
  estadoPaso: z.enum(["en_templo", "en_calle", "retrasado", "recogido"]),
});

export const pasoSchema = z.object({
  tipo: z.enum(["Misterio", "Palio", "Título"]),
  nombre: z.string().min(1).max(200),
  escultores: z.array(z.string().max(120)).default([]),
  capataz: z.string().max(120),
  costaleros: z.number().int().min(0).max(100),
  anio: z.number().int().min(1500).max(2100),
  descripcion: z.string().max(2000).optional(),
});

export const vestimentaSchema = z.object({
  descripcionTunica: z.string().max(1000),
  colorAntifaz: z.string().max(60),
  capa: z.boolean(),
  escudo: z.string().max(200).optional(),
  escudoImg: z.string().url().optional(),
  cirios: z.string().max(300).optional(),
});

export const videoEmbedSchema = z.object({
  id: z.string(),
  titulo: z.string().max(200),
  youtubeId: z.string().regex(/^[\w-]{6,20}$/),
});

export const hermandadSchema = z.object({
  id: z.string(),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(80),
  nombre: z.string().min(1).max(300),
  nombrePopular: z.string().max(120).optional(),
  sede: z.string().max(200),
  diaSemana: z.enum([
    "Domingo de Ramos", "Lunes Santo", "Martes Santo", "Miércoles Santo",
    "Jueves Santo", "Madrugada", "Viernes Santo", "Sábado Santo",
    "Domingo de Resurrección",
  ]),
  añoFundacion: z.number().int().min(1200).max(2100),
  numeroHermanos: z.number().int().min(0),
  numeroNazarenos: z.number().int().min(0),
  tiempoPaso: z.number().int().min(1).max(120),
  musica: z.array(z.string().max(120)),
  vestimenta: vestimentaSchema,
  pasos: z.array(pasoSchema).min(1),
  historia: z.string().max(8000),
  curiosidades: z.array(z.string().max(500)),
  itinerario: z.array(puntoItinerarioSchema).min(1),
  videos: z.array(videoEmbedSchema),
  imagenes: z.array(z.string().url()),
});

export const incidenciaSchema = z.object({
  id: z.string(),
  hermandadId: z.string().optional(),
  tipo: z.enum(["retraso", "cambio_recorrido", "lluvia", "calle_cortada", "aglomeracion"]),
  titulo: z.string().min(1).max(200),
  descripcion: z.string().min(1).max(2000),
  timestamp: z.string().datetime(),
  nivel: z.enum(["info", "warning", "danger"]),
});

export const calleCortadaSchema = z.object({
  id: z.string(),
  nombreCalle: z.string().min(1).max(200),
  coords: z.array(z.object({ lat: z.number(), lng: z.number() })).min(2),
  motivo: z.string().max(500),
  horaInicio: z.string(),
  horaFinEstimada: z.string(),
});

// Validadores de query-params para las APIs
export const apiQuerySchema = z.object({
  dia: z.enum([
    "Domingo de Ramos", "Lunes Santo", "Martes Santo", "Miércoles Santo",
    "Jueves Santo", "Madrugada", "Viernes Santo", "Sábado Santo",
    "Domingo de Resurrección",
  ]).optional(),
  slug: z.string().max(80).optional(),
  nivel: z.enum(["info", "warning", "danger"]).optional(),
});

export type ApiQuery = z.infer<typeof apiQuerySchema>;
export type HermandadValidada = z.infer<typeof hermandadSchema>;
export type { Hermandad, Incidencia, CalleCortada };
