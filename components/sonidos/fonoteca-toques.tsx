"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAudioContext } from "@/lib/audio/campana-3d";
import { tocarCampanaSintetica } from "@/lib/audio/sintetizador";
import { vibrar } from "@/lib/haptica";

/**
 * Fonoteca Sonora del Mayordomo de Trono (v6.0).
 * Simbología interactiva del toque de campana de trono:
 * 1 toque = Atención · 3 toques = Arriba · 2 toques = Abajo ·
 * Mecida a pulso · Campanilla de guía.
 * Reproduce /audio/campana/ con fallback al sintetizador Web Audio API y
 * dispara navigator.vibrate sincronizado. La campana SVG se balancea al son.
 */

interface Toque {
  id: string;
  nombre: string;
  significado: string;
  toques: number;
  archivo: string;
  /** Intervalo entre golpes en segundos (mecida = más lento y solemne) */
  intervalo: number;
  patronVibracion: number[];
}

const TOQUES: Toque[] = [
  {
    id: "atencion",
    nombre: "Un toque",
    significado: "Atención / Silencio bajo varales",
    toques: 1,
    archivo: "/audio/campana/campana-1.mp3",
    intervalo: 0.7,
    patronVibracion: [120],
  },
  {
    id: "arriba",
    nombre: "Tres toques",
    significado: "¡Arriba el trono!",
    toques: 3,
    archivo: "/audio/campana/campana-3toques.mp3",
    intervalo: 0.7,
    patronVibracion: [100, 50, 100, 50, 100],
  },
  {
    id: "abajo",
    nombre: "Dos toques",
    significado: "Abajo / Posar en horquillas",
    toques: 2,
    archivo: "/audio/campana/campana-2toques.mp3",
    intervalo: 0.8,
    patronVibracion: [100, 60, 100],
  },
  {
    id: "mecida",
    nombre: "Toque a pulso",
    significado: "Mecida — levanta a brazo alzado",
    toques: 4,
    archivo: "/audio/campana/campana-mecida.mp3",
    intervalo: 1.1,
    patronVibracion: [150, 80, 150, 80, 150, 80, 150],
  },
  {
    id: "campanilla",
    nombre: "Campanilla de guía",
    significado: "Ritmo de sección procesional",
    toques: 6,
    archivo: "/audio/campana/campanilla-guia.mp3",
    intervalo: 0.35,
    patronVibracion: [40, 40, 40, 40, 40, 40],
  },
];

export function FonotecaToques() {
  const [sonando, setSonando] = useState<string | null>(null);

  async function reproducir(t: Toque) {
    if (sonando) return;
    setSonando(t.id);
    vibrar(t.patronVibracion);

    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") await ctx.resume();

    let reproducido = false;
    if (ctx) {
      // 1) Intento con la grabación real de la fonoteca
      try {
        const res = await fetch(t.archivo);
        if (res.ok) {
          const buffer = await ctx.decodeAudioData(await res.arrayBuffer());
          const datos = buffer.getChannelData(0);
          let max = 0;
          for (let i = 0; i < Math.min(datos.length, 8192); i++) max = Math.max(max, Math.abs(datos[i]));
          if (max >= 0.001) {
            const t0 = ctx.currentTime + 0.05;
            for (let i = 0; i < t.toques; i++) {
              const fuente = ctx.createBufferSource();
              fuente.buffer = buffer;
              fuente.connect(ctx.destination);
              fuente.start(t0 + i * t.intervalo);
            }
            reproducido = true;
          }
        }
      } catch {
        /* sin grabación real → pasa al sintetizador */
      }

      // 2) Fallback: sintetizador Web Audio API
      if (!reproducido) {
        tocarCampanaSintetica({ toques: t.toques });
      }
    }

    const duracionMs = t.toques * t.intervalo * 1000 + 1200;
    setTimeout(() => setSonando(null), duracionMs);
  }

  return (
    <section aria-label="Fonoteca del mayordomo de trono" className="space-y-3">
      <header>
        <h3 className="flex items-center gap-2 text-base font-bold">
          <Volume2 className="h-5 w-5 text-primary" /> Simbología del Toque de Campana en Granada
        </h3>
        <p className="text-sm text-muted-foreground">
          El mayordomo gobierna el trono con la campana: cada toque es una orden. Pulsa para escuchar
          (grabación real con respaldo sintético) y siente la vibración háptica.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOQUES.map((t) => (
          <ToqueCard key={t.id} toque={t} sonando={sonando === t.id} onReproducir={() => reproducir(t)} />
        ))}
      </div>
    </section>
  );
}

function ToqueCard({
  toque: t,
  sonando,
  onReproducir,
}: {
  toque: Toque;
  sonando: boolean;
  onReproducir: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onReproducir}
      disabled={sonando}
      aria-label={`Reproducir toque: ${t.nombre} — ${t.significado}`}
      className={cn(
        "ilustracion-cofrade flex items-center gap-3 rounded-xl p-3 text-left transition-transform duration-200 hover:scale-[1.03] active:scale-95 disabled:opacity-60",
        sonando && "ring-2 ring-[#C5A059]"
      )}
    >
      {/* Campana SVG que se balancea al son (dorado orfebre) */}
      <span className={cn("inline-block shrink-0", sonando && "campana-balanceo")}>
        <svg viewBox="0 0 40 48" className="h-12 w-10" role="img" aria-hidden="true">
          <path
            d="M20 4 C11 4 8 12 8 20 L8 30 L5 34 L35 34 L32 30 L32 20 C32 12 29 4 20 4Z"
            fill="#C5A059"
            stroke="#A8842B"
            strokeWidth="1.5"
          />
          <rect x="4" y="34" width="32" height="3.5" rx="1.5" fill="#A8842B" />
          <circle cx="20" cy="40" r="3.5" fill="#A8842B" />
          <circle cx="16" cy="14" r="3" fill="#E8C86A" opacity="0.8" />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-primary">{t.nombre}</span>
        <span className="block text-xs text-muted-foreground">{t.significado}</span>
      </span>
      {sonando && (
        <span className="ml-auto flex h-3 items-end gap-0.5" aria-hidden>
          <span className="w-1 animate-pulse rounded bg-[#C5A059]" style={{ height: "60%" }} />
          <span className="w-1 animate-pulse rounded bg-[#C5A059]" style={{ height: "100%", animationDelay: "0.15s" }} />
          <span className="w-1 animate-pulse rounded bg-[#C5A059]" style={{ height: "45%", animationDelay: "0.3s" }} />
        </span>
      )}
    </button>
  );
}

