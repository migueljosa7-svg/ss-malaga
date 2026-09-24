"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Church, MapPin, Route, Search, Clock } from "lucide-react";
import { getHermandades } from "@/lib/data";
import { useUIStore } from "@/lib/store";
import { PATRONES_HAPTICOS, vibrar } from "@/lib/haptica";

const GRANADA: [number, number] = [37.17733, -3.59856];

const PAGINAS = [
  { id: "pag:inicio", titulo: "Inicio", subtitulo: "Portada cofrade", href: "/" },
  { id: "pag:hermandades", titulo: "Hermandades", subtitulo: "Las cofradías de Granada", href: "/hermandades" },
  { id: "pag:mapa", titulo: "Mapa en vivo", subtitulo: "Posición de tronos y radar", href: "/mapa" },
  { id: "pag:ruta", titulo: "Mi Ruta", subtitulo: "Planifica por dónde ver los tronos", href: "/mi-ruta" },
  { id: "pag:comparador", titulo: "Comparador", subtitulo: "Compara hermandades", href: "/comparador" },
  { id: "pag:incidencias", titulo: "Incidencias", subtitulo: "Retrasos y calles cortadas", href: "/incidencias" },
] as const;

type Item =
  | { id: string; titulo: string; subtitulo: string; tipo: "pagina"; href: string }
  | { id: string; titulo: string; subtitulo: string; tipo: "hermandad"; lat: number; lng: number };

/**
 * Command Palette cofrade (v10.0 Ultimate) — ⌘K / Ctrl+K.
 * Al elegir una hermandad ejecuta `centrarFoco` (+ navegación a /mapa si hace
 * falta); `MapaSemanaSanta` escucha el store y dispara `map.flyTo` al instante.
 */
export function BuscadorCofrade() {
  const [abierto, setAbierto] = useState(false);
  const [consulta, setConsulta] = useState("");
  const [indice, setIndice] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listaRef = useRef<HTMLUListElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const modoAhorro = useUIStore((s) => s.modoAhorro);

  const hermandades = useMemo(
    () =>
      getHermandades().map((h) => {
        const p0 = h.itinerario[0];
        return {
          id: `her:${h.slug}`,
          titulo: h.nombrePopular ?? h.nombre,
          subtitulo: `${h.diaSemana} · ${h.sede}`,
          tipo: "hermandad" as const,
          lat: p0?.lat ?? GRANADA[0],
          lng: p0?.lng ?? GRANADA[1],
        };
      }),
    []
  );

  const q = consulta.trim().toLowerCase();
  const paginasFiltradas: Item[] = PAGINAS.filter(
    (p) => !q || p.titulo.toLowerCase().includes(q) || p.subtitulo.toLowerCase().includes(q)
  ).map((p) => ({ ...p, tipo: "pagina" }));
  const hermandadesFiltradas: Item[] = hermandades.filter(
    (h) => !q || h.titulo.toLowerCase().includes(q) || h.subtitulo.toLowerCase().includes(q)
  );
  // Sin consulta: navegación + sugerencias; con consulta: todo lo que coincida
  const lista: Item[] = q
    ? [...paginasFiltradas, ...hermandadesFiltradas]
    : [...paginasFiltradas, ...hermandadesFiltradas.slice(0, 5)];

  // Atajo global ⌘K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAbierto((a) => !a);
        vibrar(PATRONES_HAPTICOS.panel);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (abierto) {
      setConsulta("");
      setIndice(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [abierto]);

  useEffect(() => setIndice(0), [consulta]);

  // Mantiene visible el resultado resaltado
  useEffect(() => {
    const el = listaRef.current?.querySelector<HTMLElement>(`[data-idx="${indice}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [indice]);

  function ejecutar(item: Item | undefined) {
    if (!item) return;
    vibrar(PATRONES_HAPTICOS.seleccion);
    setAbierto(false);
    if (item.tipo === "pagina") {
      router.push(item.href);
    } else {
      useUIStore.getState().centrarFoco({ lat: item.lat, lng: item.lng, zoom: 16 });
      if (pathname !== "/mapa") router.push("/mapa");
    }
  }

  function alTeclar(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndice((i) => (lista.length ? (i + 1) % lista.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndice((i) => (lista.length ? (i - 1 + lista.length) % lista.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      ejecutar(lista[indice]);
    } else if (e.key === "Escape") {
      setAbierto(false);
    }
  }

  const dur = modoAhorro ? 0 : 0.22;

  return (
    <>
      {!abierto && (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Abrir buscador (atajo Cmd+K)"
          className="panel-vidrio fixed right-4 top-20 z-[95] flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
        >
          <Search className="h-4 w-4 text-[#1E0A24] dark:text-[#e8c86a]" />
          <span className="hidden sm:inline">Buscar</span>
          <kbd className="rounded border border-[#C5A059]/40 bg-[#1E0A24]/10 px-1.5 py-0.5 text-[10px] font-bold">
            ⌘K
          </kbd>
        </button>
      )}
      <AnimatePresence>
        {abierto && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: dur }}
              onClick={() => setAbierto(false)}
              className="fixed inset-0 z-[95] bg-black/45 backdrop-blur-[2px]"
            />
            {/* Contenedor posicionable aparte: framer-motion usa transform para animar */}
            <div className="fixed left-1/2 top-24 z-[96] w-[min(94vw,460px)] -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0">
              <motion.div
                key="paleta"
                role="dialog"
                aria-modal="true"
                aria-label="Buscador de hermandades"
                initial={modoAhorro ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={modoAhorro ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: dur, ease: "easeOut" }}
                className="panel-vidrio overflow-hidden rounded-2xl"
              >
                <div className="flex items-center gap-2 border-b border-[#C5A059]/35 px-3 py-2.5">
                  <Search className="h-4 w-4 shrink-0 text-[#1E0A24] dark:text-[#e8c86a]" />
                  <input
                    ref={inputRef}
                    value={consulta}
                    onChange={(e) => setConsulta(e.target.value)}
                    onKeyDown={alTeclar}
                    placeholder="Busca una hermandad, sede o día…"
                    aria-label="Buscar hermandades"
                    aria-controls="paleta-resultados"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <kbd className="rounded border border-[#C5A059]/40 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                    ESC
                  </kbd>
                </div>
                <ul
                  id="paleta-resultados"
                  ref={listaRef}
                  role="listbox"
                  aria-label="Resultados"
                  className="max-h-[55vh] overflow-y-auto p-2"
                >
                  {lista.map((item, i) => (
                    <li
                      key={item.id}
                      role="option"
                      aria-selected={i === indice}
                      data-idx={i}
                      onMouseEnter={() => setIndice(i)}
                      onClick={() => ejecutar(item)}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 transition-colors ${
                        i === indice ? "bg-[#1E0A24] text-white" : "hover:bg-[#C5A059]/10"
                      }`}
                    >
                      {item.tipo === "pagina" ? (
                        <Church className="h-4 w-4 shrink-0 opacity-80" />
                      ) : (
                        <MapPin
                          className={`h-4 w-4 shrink-0 ${
                            i === indice ? "text-[#C5A059]" : "text-[#1E0A24] dark:text-[#e8c86a]"
                          }`}
                        />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{item.titulo}</span>
                        <span
                          className={`block truncate text-xs ${
                            i === indice ? "text-white/70" : "text-muted-foreground"
                          }`}
                        >
                          {item.subtitulo}
                        </span>
                      </span>
                      {item.tipo === "pagina" && item.href === "/mapa" && (
                        <Clock className="h-3.5 w-3.5 shrink-0 opacity-60" />
                      )}
                    </li>
                  ))}
                  {lista.length === 0 && (
                    <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                      Sin resultados para «{consulta}»
                    </li>
                  )}
                </ul>
                <footer className="flex items-center justify-between border-t border-[#C5A059]/30 px-3 py-2 text-[11px] text-muted-foreground">
                  <span>↑↓ navegar · ↵ centrar en el mapa</span>
                  <span className="flex items-center gap-1">
                    <Route className="h-3 w-3" /> SS Granada
                  </span>
                </footer>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

