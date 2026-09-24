"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

/** Evento nativo `beforeinstallprompt` (Chromium: Android, Windows, macOS, Linux). */
interface EventoInstalacion extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const CLAVE_DESCARTE = "ss-instalacion-descartada";

/**
 * v8.0 — Banner de instalación PWA.
 * Captura `beforeinstallprompt` y muestra un botón elegante
 * "📲 Instalar App Cofrade". El usuario puede descartarlo (se recuerda en
 * localStorage) y el banner desaparece solo si la app ya está instalada.
 *
 * Hooks SIEMPRE al principio del componente (regla de React #310).
 */
export function InstallBanner() {
  const [evento, setEvento] = useState<EventoInstalacion | null>(null);
  const [visible, setVisible] = useState(false);
  const [instalando, setInstalando] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(CLAVE_DESCARTE)) return;

    const capturar = (e: Event) => {
      e.preventDefault();
      setEvento(e as EventoInstalacion);
      setVisible(true);
    };
    const yaInstalado = () => {
      setVisible(false);
      setEvento(null);
    };

    window.addEventListener("beforeinstallprompt", capturar);
    window.addEventListener("appinstalled", yaInstalado);
    return () => {
      window.removeEventListener("beforeinstallprompt", capturar);
      window.removeEventListener("appinstalled", yaInstalado);
    };
  }, []);

  if (!visible || !evento) return null;

  async function instalar() {
    if (!evento) return;
    setInstalando(true);
    try {
      await evento.prompt();
      const { outcome } = await evento.userChoice;
      if (outcome === "dismissed") localStorage.setItem(CLAVE_DESCARTE, "1");
    } finally {
      setInstalando(false);
      setEvento(null);
      setVisible(false);
    }
  }

  function descartar() {
    localStorage.setItem(CLAVE_DESCARTE, "1");
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Instalar la aplicación"
      className="fixed left-1/2 top-16 z-[85] w-[min(92vw,440px)] -translate-x-1/2 rounded-2xl border border-[#C5A059]/50 bg-[#1E0A24]/95 px-4 py-3 text-[#FAF7F2] shadow-[0_16px_48px_-12px_rgba(26,26,26,0.7)] backdrop-blur-md"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">
          📲
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#C5A059]">Instalar App Cofrade</p>
          <p className="text-xs text-[#FAF7F2]/80">
            Sigue los tronos incluso sin cobertura: funciona offline.
          </p>
        </div>
        <button
          type="button"
          onClick={instalar}
          disabled={instalando}
          className="rounded-full bg-[#C5A059] px-3 py-1.5 text-xs font-bold text-[#1E0A24] transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60"
        >
          <Download className="mr-1 inline h-3.5 w-3.5" />
          {instalando ? "Instalando…" : "Instalar"}
        </button>
        <button
          type="button"
          onClick={descartar}
          aria-label="Descartar aviso de instalación"
          className="rounded-full p-1 text-[#FAF7F2]/70 transition-colors hover:bg-white/10 hover:text-[#FAF7F2] active:scale-95"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
