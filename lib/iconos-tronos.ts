import L, { type DivIcon } from "leaflet";
import type { Hermandad } from "@/types/hermandad";

// ---------- v10.0: paleta por antifaz (ilustración de cofrades pequeñicos) ----------

/** Color del antifaz/túnica de cada hermandad a partir de su vestimenta real. */
export function colorAntifaz(h: Hermandad): string {
  const a = (h.vestimenta.colorAntifaz ?? "").toLowerCase();
  if (a.includes("morado")) return "#1E0A24";
  if (a.includes("verde botella")) return "#1B4D3E";
  if (a.includes("verde")) return "#1B4D3E";
  if (a.includes("rojo")) return "#B3261E";
  if (a.includes("azul")) return "#2E5E8C";
  if (a.includes("negro")) return "#1A1A1A";
  if (a.includes("blanco")) return "#F5F1E8";
  return "#1E0A24";
}

/** Túnica (fondo) coherente con el antifaz: negra donde la hermandad lo indica. */
export function colorTunica(h: Hermandad): string {
  const d = (h.vestimenta.descripcionTunica ?? "").toLowerCase();
  if (d.includes("túnica negra")) return "#1A1A1A";
  return "#F5F1E8";
}

/**
 * Marcadores SVG diferenciados para Trono de Cristo (cruz morada)
 * y Trono de Virgen (estrella dorada bajo palio).
 */
export function iconoTronoCristo(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 30 42">
    <path d="M15 41 C15 41 27 24 27 14 A12 12 0 1 0 3 14 C3 24 15 41 15 41Z" fill="#1E0A24" stroke="#C5A059" stroke-width="2"/>
    <rect x="13.5" y="7" width="3" height="12" rx="1" fill="#C5A059"/>
    <rect x="9" y="10.5" width="12" height="3" rx="1" fill="#C5A059"/>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function iconoTronoVirgen(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 30 42">
    <path d="M15 41 C15 41 27 24 27 14 A12 12 0 1 0 3 14 C3 24 15 41 15 41Z" fill="#1B4D3E" stroke="#C5A059" stroke-width="2"/>
    <path d="M15 7 L17 12 L22 12 L18 15.5 L19.5 20.5 L15 17.5 L10.5 20.5 L12 15.5 L8 12 L13 12 Z" fill="#C5A059"/>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/** Devuelve el icono adecuado según el tipo de paso principal de la hermandad. */
export function iconoPorHermandad(h: Hermandad): string {
  const tieneMisterio = h.pasos.some((p) => p.tipo === "Misterio");
  return tieneMisterio ? iconoTronoCristo() : iconoTronoVirgen();
}

// ---------- v7.0: marcadores divIcon con escudo + siglas + pulso GPS ----------

/** Siglas institucionales de cada trono granadino (badge del marcador). */
export const SIGLAS_TRONOS: Record<string, string> = {
  "el-silencio": "SILENCIO",
  "los-gitanos": "GITANO",
  "la-aurora": "AURORA",
  "la-canilla": "CAÑILLA",
  "los-estudiantes": "ESTUDIANTES",
  "la-soledad": "SOLEDAD",
  "san-agustin": "SAN AGUSTÍN",
  "santa-cena": "SANTA CENA",
};

/** Siglas cortas del trono (fallback: iniciales del nombre popular). */
export function siglasTrono(h: Hermandad): string {
  const directo = SIGLAS_TRONOS[h.slug];
  if (directo) return directo;
  const base = h.nombrePopular ?? h.nombre;
  return base
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w.toUpperCase())
    .join(" ");
}

const ESCUDO_CRISTO = `
  <path d="M15 41 C15 41 27 24 27 14 A12 12 0 1 0 3 14 C3 24 15 41 15 41Z" fill="#1E0A24" stroke="#C5A059" stroke-width="2"/>
  <rect x="13.5" y="7" width="3" height="12" rx="1" fill="#C5A059"/>
  <rect x="9" y="10.5" width="12" height="3" rx="1" fill="#C5A059"/>`;

const ESCUDO_VIRGEN = `
  <path d="M15 41 C15 41 27 24 27 14 A12 12 0 1 0 3 14 C3 24 15 41 15 41Z" fill="#1B4D3E" stroke="#C5A059" stroke-width="2"/>
  <path d="M15 7 L17 12 L22 12 L18 15.5 L19.5 20.5 L15 17.5 L10.5 20.5 L12 15.5 L8 12 L13 12 Z" fill="#C5A059"/>`;

/**
 * Marcador Leaflet `L.divIcon` institucional (v7.0):
 *  - escudo SVG del trono (cruz morada / estrella dorada) con borde orfebre
 *  - badge con las siglas del trono (`EL RICO`, `LA MENA`, `ZA`…)
 *  - anillo de micro-pulso CSS si el GPS emite en tiempo real
 *
 * Requiere los estilos `.divicon-trono*` de `app/globals.css`.
 */
export function divIconTrono(
  h: Hermandad,
  tipo: "cristo" | "virgen",
  opts?: { enDirecto?: boolean; seleccionado?: boolean }
): DivIcon {
  const escudo = tipo === "virgen" ? ESCUDO_VIRGEN : ESCUDO_CRISTO;
  const siglas = siglasTrono(h);
  const clases = [
    "divicon-trono",
    opts?.enDirecto ? "divicon-trono-live" : "",
    opts?.seleccionado ? "divicon-trono-seleccionado" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const html = `
    <span class="divicon-pulso" aria-hidden="true"></span>
    <svg class="divicon-escudo" xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 30 42">${escudo}</svg>
    <span class="divicon-siglas">${siglas}</span>
  `;

  return L.divIcon({
    className: clases,
    html,
    iconSize: [48, 60],
    iconAnchor: [24, 54],
    popupAnchor: [0, -50],
  });
}

// ---------- v10.0: "Cofrades Pequeñicos" — marcadores ilustrados ----------

/**
 * Ilustración vectorial de un nazareno en miniatura:
 * capirote cónico, antifaz con el color real de la hermandad, túnica y cirio.
 */
function svgNazareno(x: number, tunica: string, antifaz: string, escala = 1): string {
  return `
  <g transform="translate(${x} 0) scale(${escala})">
    <path d="M0 4 L-5 20 L5 20 Z" fill="${antifaz}" stroke="#C5A059" stroke-width="0.8"/>
    <circle cx="0" cy="21" r="4.2" fill="${antifaz}" stroke="#C5A059" stroke-width="0.8"/>
    <circle cx="1.6" cy="20.4" r="1" fill="#1A1A1A"/>
    <path d="M-6 26 Q0 23.5 6 26 L7.5 46 L-7.5 46 Z" fill="${tunica}" stroke="#C5A059" stroke-width="0.8"/>
    <rect x="-6.6" y="34" width="13.2" height="2.4" fill="#C5A059"/>
    <rect x="7" y="24" width="1.8" height="16" rx="0.9" fill="#F5F1E8" stroke="#A8842B" stroke-width="0.5"/>
    <rect x="6.6" y="21.6" width="2.6" height="3" rx="1" fill="#C5A059"/>
    <rect x="-6" y="46" width="5" height="2.4" rx="1" fill="#1A1A1A"/>
    <rect x="1" y="46" width="5" height="2.4" rx="1" fill="#1A1A1A"/>
  </g>`;
}

/**
 * Miniatura de trono con varales, palio (Virgen) o cruz (Cristo),
 * portado por dos cofrades pequeñicos con la túnica de su hermandad.
 */
function svgTronoMini(tipo: "cristo" | "virgen", tunica: string, antifaz: string): string {
  const nazarenos = `${svgNazareno(8, tunica, antifaz, 0.78)}${svgNazareno(52, tunica, antifaz, 0.78)}`;
  const remate =
    tipo === "virgen"
      ? `<path d="M30 6 L32 11 L37 11 L33.2 14 L34.7 19 L30 16 L25.3 19 L26.8 14 L23 11 L28 11 Z" fill="#C5A059"/>`
      : `<rect x="28.6" y="5" width="2.8" height="13" rx="1" fill="#C5A059"/><rect x="24" y="9" width="12" height="2.8" rx="1" fill="#C5A059"/>`;
  const palio =
    tipo === "virgen"
      ? `<rect x="14" y="20" width="32" height="5" rx="1.5" fill="#1E0A24" stroke="#C5A059" stroke-width="1"/>
         <rect x="15.5" y="25" width="2" height="9" fill="#C5A059"/>
         <rect x="42.5" y="25" width="2" height="9" fill="#C5A059"/>`
      : `<rect x="16" y="24" width="28" height="3.4" rx="1.2" fill="#1E0A24" stroke="#C5A059" stroke-width="0.9"/>`;
  return `
  <g>
    ${nazarenos}
    <rect x="17" y="41" width="26" height="4.5" rx="1.5" fill="#A8842B" stroke="#C5A059" stroke-width="0.8"/>
    <rect x="19" y="45.5" width="3" height="3" fill="#8A6D1F"/>
    <rect x="38" y="45.5" width="3" height="3" fill="#8A6D1F"/>
    <rect x="19.5" y="27" width="1.6" height="14" fill="#C5A059"/>
    <rect x="39" y="27" width="1.6" height="14" fill="#C5A059"/>
    <circle cx="30" cy="34" r="4" fill="${tipo === "virgen" ? "#1E0A24" : "#2b1436"}" stroke="#C5A059" stroke-width="0.9"/>
    ${palio}
    ${remate}
  </g>`;
}

/**
 * Marcador ilustrado "Cofrade Pequeñico" (v10.0):
 *  - ilustración SVG vectorial: nazarenos con túnica/capirote reales de la
 *    hermandad portando su trono en miniatura (nada de pines genéricos)
 *  - halo dorado `#C5A059` pulsante SOLO sobre el trono cuyo GPS emite en vivo
 *  - badge inferior con las siglas del trono
 *
 * Estilos: `.divicon-cofrade*` de `app/globals.css`.
 */
export function divIconCofrade(
  h: Hermandad,
  tipo: "cristo" | "virgen",
  opts?: { enDirecto?: boolean; seleccionado?: boolean }
): DivIcon {
  const tunica = colorTunica(h);
  const antifaz = colorAntifaz(h);
  const siglas = siglasTrono(h);
  const clases = [
    "divicon-trono",
    "divicon-cofrade",
    opts?.enDirecto ? "divicon-trono-live" : "",
    opts?.seleccionado ? "divicon-trono-seleccionado" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const html = `
    <span class="divicon-pulso" aria-hidden="true"></span>
    <svg class="divicon-escudo" xmlns="http://www.w3.org/2000/svg" width="68" height="56" viewBox="0 0 68 56" role="img" aria-label="${siglas}">
      ${svgTronoMini(tipo, tunica, antifaz)}
    </svg>
    <span class="divicon-siglas">${siglas}</span>
  `;

  return L.divIcon({
    className: clases,
    html,
    iconSize: [72, 70],
    iconAnchor: [36, 62],
    popupAnchor: [0, -56],
  });
}
