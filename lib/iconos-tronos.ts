import type { Hermandad } from "@/types/hermandad";

/**
 * Marcadores SVG diferenciados para Trono de Cristo (cruz morada)
 * y Trono de Virgen (estrella dorada bajo palio).
 */
export function iconoTronoCristo(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 30 42">
    <path d="M15 41 C15 41 27 24 27 14 A12 12 0 1 0 3 14 C3 24 15 41 15 41Z" fill="#4A154B" stroke="#D4AF37" stroke-width="2"/>
    <rect x="13.5" y="7" width="3" height="12" rx="1" fill="#D4AF37"/>
    <rect x="9" y="10.5" width="12" height="3" rx="1" fill="#D4AF37"/>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function iconoTronoVirgen(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 30 42">
    <path d="M15 41 C15 41 27 24 27 14 A12 12 0 1 0 3 14 C3 24 15 41 15 41Z" fill="#1B4D3E" stroke="#D4AF37" stroke-width="2"/>
    <path d="M15 7 L17 12 L22 12 L18 15.5 L19.5 20.5 L15 17.5 L10.5 20.5 L12 15.5 L8 12 L13 12 Z" fill="#D4AF37"/>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/** Devuelve el icono adecuado según el tipo de paso principal de la hermandad. */
export function iconoPorHermandad(h: Hermandad): string {
  const tieneMisterio = h.pasos.some((p) => p.tipo === "Misterio");
  return tieneMisterio ? iconoTronoCristo() : iconoTronoVirgen();
}