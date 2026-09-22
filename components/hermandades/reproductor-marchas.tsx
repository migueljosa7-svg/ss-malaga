"use client";

import { useMemo, useRef, useState } from "react";
import { Music, Pause, Play, X } from "lucide-react";
import { getHermandades } from "@/lib/data";

interface Marcha {
  titulo: string;
  src: string;
}

/** Barra de progreso flotante global para las marchas cofrades (v1.0 Pro). */
export function ReproductorGlobalMarchas() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [indice, setIndice] = useState(0);

  const marchas: Marcha[] = useMemo(() => {
    const lista: Marcha[] = [];
    for (const h of getHermandades()) {
      for (const s of h.sonidos ?? []) {
        if (s.tipo === "marcha") lista.push({ titulo: s.titulo, src: s.src });
      }
    }
    return lista;
  }, []);

  if (marchas.length === 0) return null;

  const marcha = marchas[indice];

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (reproduciendo) {
      audio.pause();
      setReproduciendo(false);
    } else {
      audio.play().catch(() => setReproduciendo(false));
      setReproduciendo(true);
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-[90]">
      {!abierto ? (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Abrir reproductor de marchas"
          className="flex items-center gap-2 rounded-full border border-[#D4AF37]/60 bg-[#4A154B] px-4 py-2.5 text-sm font-medium text-[#D4AF37] shadow-lg"
        >
          <Music className="h-4 w-4" />
          <span className="hidden sm:inline">Marchas cofrades</span>
        </button>
      ) : (
        <div className="w-72 rounded-xl border border-[#D4AF37]/40 bg-card p-3 shadow-xl">
          <div className="mb-2 flex items-center gap-2">
            <Music className="h-4 w-4 text-primary" />
            <span className="flex-1 truncate text-sm font-medium">{marcha.titulo}</span>
            <button
              type="button"
              onClick={() => {
                audioRef.current?.pause();
                setReproduciendo(false);
                setAbierto(false);
              }}
              aria-label="Cerrar reproductor"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={progreso}
            onChange={(e) => {
              const v = Number(e.target.value);
              setProgreso(v);
              const audio = audioRef.current;
              if (audio && audio.duration) audio.currentTime = (v / 100) * audio.duration;
            }}
            className="w-full accent-[#D4AF37]"
            aria-label="Progreso de la marcha"
          />
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIndice((i) => (i - 1 + marchas.length) % marchas.length)}
              aria-label="Marcha anterior"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ⏮
            </button>
            <button
              type="button"
              onClick={toggle}
              aria-label={reproduciendo ? "Pausar marcha" : "Reproducir marcha"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4A154B] text-[#D4AF37]"
            >
              {reproduciendo ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setIndice((i) => (i + 1) % marchas.length)}
              aria-label="Marcha siguiente"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ⏭
            </button>
          </div>
          <audio
            ref={(el) => {
              if (el) audioRef.current = el;
            }}
            src={marcha.src}
            preload="none"
            onTimeUpdate={(e) => {
              const a = e.currentTarget;
              if (a.duration) setProgreso(Math.round((a.currentTime / a.duration) * 100));
            }}
            onEnded={() => setIndice((i) => (i + 1) % marchas.length)}
          />
        </div>
      )}
    </div>
  );
}
