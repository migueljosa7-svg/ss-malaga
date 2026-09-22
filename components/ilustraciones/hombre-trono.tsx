"use client";

import { cn } from "@/lib/utils";

const DETALLES: Record<string, { correa: string; camisa: string; nombre: string }> = {
  cautivo: { correa: "#8B5A2B", camisa: "#FFFFFF", nombre: "El Cautivo" },
  pollinica: { correa: "#B45309", camisa: "#FFFFFF", nombre: "La Pollinica" },
  rico: { correa: "#1E3A8A", camisa: "#FFFFFF", nombre: "El Rico" },
  zamarrilla: { correa: "#4A154B", camisa: "#FFFFFF", nombre: "La Zamarrilla" },
  esperanza: { correa: "#14532D", camisa: "#FFFFFF", nombre: "La Esperanza" },
  expiracion: { correa: "#B91C1C", camisa: "#FFFFFF", nombre: "La Expiración" },
  mena: { correa: "#166534", camisa: "#7F1D1D", nombre: "La Mena (Legión)" },
  sepulcro: { correa: "#374151", camisa: "#1A1A1A", nombre: "El Sepulcro" },
};

/**
 * Ilustración del Hombre de Trono: uniforme con camisa y correa cruzada
 * característica de las cuadrillas malagueñas. Colores por hermandad.
 */
export function HombreTrono({ slug, className }: { slug: string; className?: string }) {
  const d = DETALLES[slug] ?? { correa: "#8B5A2B", camisa: "#FFFFFF", nombre: "Hombres de Trono" };
  return (
    <figure
      className={cn(
        "ilustracion-cofrade inline-flex flex-col items-center gap-2 rounded-xl p-3",
        className
      )}
    >
      <svg viewBox="0 0 120 200" className="h-44 w-auto" role="img" aria-label={`Uniforme de hombres de trono de ${d.nombre}`}>
        {/* Cabeza */}
        <circle cx="60" cy="26" r="14" fill="#E8C39E" stroke="#D4AF37" strokeOpacity="0.4" />
        {/* Camisa */}
        <path d="M42 44 Q60 38 78 44 L88 110 L32 110 Z" fill={d.camisa} stroke="rgba(212,175,55,0.4)" strokeWidth="1.5" />
        {/* Brazos */}
        <path d="M42 48 L28 100" stroke={d.camisa} strokeWidth="11" strokeLinecap="round" />
        <path d="M78 48 L92 100" stroke={d.camisa} strokeWidth="11" strokeLinecap="round" />
        {/* Correa cruzada al hombro */}
        <path d="M40 46 L82 102" stroke={d.correa} strokeWidth="7" strokeLinecap="round" />
        <path d="M80 46 L38 102" stroke={d.correa} strokeWidth="7" strokeLinecap="round" opacity="0.85" />
        {/* hebilla dorada */}
        <circle cx="60" cy="74" r="4.5" fill="#D4AF37" />
        {/* Pantalón */}
        <path d="M36 110 L84 110 L80 168 L64 168 L60 132 L56 168 L40 168 Z" fill="#1F2937" stroke="rgba(212,175,55,0.25)" />
        {/* Alpargatas / calzado de faena */}
        <rect x="36" y="168" width="22" height="10" rx="4" fill="#111827" />
        <rect x="62" y="168" width="22" height="10" rx="4" fill="#111827" />
        {/* Farol de trabajo */}
        <g>
          <rect x="90" y="88" width="12" height="16" rx="2" fill="#D4AF37" opacity="0.9" />
          <rect x="92.5" y="90.5" width="7" height="11" fill="#FEF3C7" />
          <path d="M96 88 L96 80" stroke="#D4AF37" strokeWidth="2" />
        </g>
      </svg>
      <figcaption className="text-center text-xs font-medium text-muted-foreground">
        Hombre de trono — <span className="text-primary">{d.nombre}</span>
      </figcaption>
    </figure>
  );
}
