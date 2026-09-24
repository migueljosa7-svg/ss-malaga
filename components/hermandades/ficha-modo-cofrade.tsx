import { Clock, MapPin, Music4, Shirt, Church } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Hermandad } from "@/types/hermandad";

/** Puntos de la Carrera Oficial por los que la mayoría de tronos pasan. */
const PUNTOS_CLAVE: Array<{ etiqueta: string; re: RegExp }> = [
  { etiqueta: "Carrera de la Virgen", re: /carrera de la virgen|puente de la virgen|bibataub/i },
  { etiqueta: "Puerta Real", re: /puerta real|ganivet|mesones/i },
  { etiqueta: "Entorno de la Catedral", re: /catedral|pasiegas/i },
];

/**
 * "Modo Cofrade" para la ficha de hermandad (v10.0 Ultimate):
 * datos prácticos de la calle → hábito, hombres de trono, marcha dedicada
 * y horarios teóricos en los puntos clave (Carrera de la Virgen, Puerta Real, Catedral).
 */
export function FichaModoCofrade({ hermandad: h }: { hermandad: Hermandad }) {
  const claves: Array<{ etiqueta: string; hora: string; calle: string }> = [];
  for (const p of PUNTOS_CLAVE) {
    const it = h.itinerario.find((x) => p.re.test(x.nombre));
    if (it) claves.push({ etiqueta: p.etiqueta, hora: it.horaTeorica, calle: it.nombre });
  }
  // Si su itinerario no pasa por esos puntos, mostramos sus primeros hitos
  const usarFallback = claves.length === 0;
  const horarios = usarFallback
    ? h.itinerario.slice(0, 4).map((it) => ({ etiqueta: it.nombre, hora: it.horaTeorica, calle: it.nombre }))
    : claves;

  const costaleros = Math.max(0, ...h.pasos.map((p) => p.costaleros));
  const marcha = h.musica[0];

  return (
    <section
      aria-label="Modo cofrade: datos prácticos de la calle"
      className="panel-vidrio borde-destello-dorado mb-6 rounded-xl p-4"
    >
      <header className="mb-3 flex flex-wrap items-center gap-2">
        <Church className="h-5 w-5 text-[#1E0A24] dark:text-[#e8c86a]" />
        <h2 className="text-base font-bold">Modo Cofrade</h2>
        <Badge variant="secondary">{h.diaSemana}</Badge>
        <span className="text-xs text-muted-foreground">Lo esencial para salir a la calle</span>
      </header>

      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <div className="flex items-start gap-2">
          <Shirt className="mt-0.5 h-4 w-4 shrink-0 text-[#1E0A24] dark:text-[#e8c86a]" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Hábito de nazareno
            </p>
            <p className="text-sm">{h.vestimenta.descripcionTunica}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Antifaz: <strong>{h.vestimenta.colorAntifaz}</strong>
              {h.vestimenta.capa ? " · con capa" : " · sin capa"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center text-[#1E0A24] dark:text-[#e8c86a]">
            💪
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Hombres de trono
            </p>
            <p className="text-sm">
              {costaleros > 0 ? `${costaleros} costaleros por trono` : "No consta el número de costaleros"}
            </p>
            {h.vestimenta.correas && (
              <p className="text-xs text-muted-foreground">{h.vestimenta.correas}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Music4 className="mt-0.5 h-4 w-4 shrink-0 text-[#1E0A24] dark:text-[#e8c86a]" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Marcha dedicada
            </p>
            <p className="text-sm">{marcha ?? "Sin marcha dedicada en el catálogo"}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#1E0A24] dark:text-[#e8c86a]" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sede canónica
            </p>
            <p className="text-sm">{h.sede}</p>
            <p className="text-xs text-muted-foreground">
              {h.numeroNazarenos.toLocaleString("es-ES")} nazarenos · fundada en {h.añoFundacion}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-[#C5A059]/30 pt-3">
        <p className="mb-2 flex items-center gap-2 text-sm font-bold">
          <Clock className="h-4 w-4 text-[#1E0A24] dark:text-[#e8c86a]" />
          Horarios por puntos clave
          {usarFallback && (
            <span className="font-normal text-muted-foreground">
              (su itinerario evita la Carrera Oficial — primeros hitos)
            </span>
          )}
        </p>
        <ul className="space-y-1.5">
          {horarios.map((p) => (
            <li
              key={`${p.etiqueta}-${p.hora}`}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 rounded-lg border border-[#C5A059]/25 bg-[#C5A059]/[0.07] px-3 py-2"
            >
              <span className="font-mono text-sm font-bold text-[#1E0A24] dark:text-[#e8c86a]">
                {p.hora}
              </span>
              <span className="text-sm font-semibold">{p.etiqueta}</span>
              <span className="text-xs text-muted-foreground">{p.calle}</span>
            </li>
          ))}
          {horarios.length === 0 && (
            <li className="text-sm text-muted-foreground">Sin itinerario publicado todavía.</li>
          )}
        </ul>
      </div>
    </section>
  );
}