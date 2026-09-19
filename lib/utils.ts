import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHora(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatFecha(iso: string): string {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const DIAS_SEMANA = [
  "Domingo de Ramos",
  "Lunes Santo",
  "Martes Santo",
  "Miércoles Santo",
  "Jueves Santo",
  "Madrugada",
  "Viernes Santo",
  "Sábado Santo",
  "Domingo de Resurrección",
] as const;
