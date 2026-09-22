"use client";

import { cn } from "@/lib/utils";

/** Mapa de colores de túnica/antifaz/cap por hermandad (Semana Santa de Málaga). */
const COLORES: Record<string, { tunica: string; antifaz: string; cordon: string; capa?: string; nombre: string }> = {
  cautivo: { tunica: "#FFFFFF", antifaz: "#FFFFFF", cordon: "#FFFFFF", capa: "#FFFFFF", nombre: "El Cautivo" },
  pollinica: { tunica: "#FFFFFF", antifaz: "#FFFFFF", cordon: "#B91C1C", nombre: "La Pollinica" },
  rico: { tunica: "#FFFFFF", antifaz: "#1E3A8A", cordon: "#1E3A8A", capa: "#FFFFFF", nombre: "El Rico" },
  zamarrilla: { tunica: "#FFFFFF", antifaz: "#4A154B", cordon: "#4A154B", capa: "#FFFFFF", nombre: "La Zamarrilla" },
  esperanza: { tunica: "#1A1A1A", antifaz: "#14532D", cordon: "#14532D", capa: "#1A1A1A", nombre: "La Esperanza" },
  expiracion: { tunica: "#FFFFFF", antifaz: "#B91C1C", cordon: "#B91C1C", capa: "#FFFFFF", nombre: "La Expiración" },
  mena: { tunica: "#1A1A1A", antifaz: "#166534", cordon: "#166534", nombre: "La Mena" },
  sepulcro: { tunica: "#1A1A1A", antifaz: "#1A1A1A", cordon: "#E5E7EB", capa: "#1A1A1A", nombre: "El Sepulcro" },
};

/**
 * Ilustración SVG estilizada de túnica y capirote nazareno (v3.0).
 * Muestra la combinación exacta de colores según la hermandad, con borde de
 * destello dorado orfebre y elevación 3D al hover.
 */
export function TunicaCapirote({ slug, className }: { slug: string; className?: string }) {
  const c = COLORES[slug] ?? { tunica: "#FFFFFF", antifaz: "#4A154B", cordon: "#D4AF37", nombre: "Nazareno" };
  return (
    <figure
      className={cn(
        "ilustracion-cofrade inline-flex flex-col items-center gap-2 rounded-xl p-3",
        className
      )}
    >
      <svg viewBox="0 0 120 200" className="h-44 w-auto" role="img" aria-label={`Túnica y capirote de ${c.nombre}`}>
        <defs>
          <linearGradient id={`tela-${slug}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={c.tunica} />
            <stop offset="0.5" stopColor={c.tunica} stopOpacity="0.92" />
            <stop offset="1" stopColor={c.tunica} />
          </linearGradient>
        </defs>
        {/* Capirote */}
        <path d="M60 8 L82 78 Q60 90 38 78 Z" fill={c.antifaz} stroke="#D4AF37" strokeOpacity="0.5" strokeWidth="1.5" />
        <rect x="36" y="76" width="48" height="14" rx="4" fill={c.antifaz} stroke="#D4AF37" strokeOpacity="0.5" />
        {/* Antifaz (parte delantera del hombro) */}
        <path d="M46 90 L74 90 L72 118 L48 118 Z" fill={c.antifaz} opacity="0.85" />
        {/* Túnica */}
        <path d="M44 90 Q60 84 76 90 L92 190 L28 190 Z" fill={`url(#tela-${slug})`} stroke="rgba(212,175,55,0.4)" strokeWidth="1.5" />
        {/* Pliegues */}
        <path d="M52 120 L48 186 M68 120 L72 186" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" fill="none" />
        {/* Cordón / cíngulo */}
        <path d="M40 122 Q60 130 80 122" stroke={c.cordon} strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="60" cy="127" r="3.5" fill="#D4AF37" />
        {/* Capa (si procede) */}
        {c.capa && <path d="M30 96 Q60 88 90 96 L86 150 Q60 142 34 150 Z" fill={c.capa} opacity="0.75" stroke="#D4AF37" strokeOpacity="0.3" />}
        {/* Escudo dorado */}
        <circle cx="60" cy="98" r="7" fill="none" stroke="#D4AF37" strokeWidth="2" />
        <path d="M60 94 L60 102 M56 98 L64 98" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <figcaption className="text-center text-xs font-medium text-muted-foreground">
        Túnica de <span className="text-primary">{c.nombre}</span>
      </figcaption>
    </figure>
  );
}
