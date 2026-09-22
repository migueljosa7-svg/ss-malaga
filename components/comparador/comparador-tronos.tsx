"use client";

import { useMemo, useState } from "react";
import { Scale, Users, Hammer, Weight } from "lucide-react";
import { getHermandades } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Paso } from "@/types/hermandad";

interface Opcion {
  hermandad: string;
  hermandadSlug: string;
  paso: Paso;
}

const hermandades = getHermandades();

const opciones: Opcion[] = hermandades.flatMap((h) =>
  h.pasos.map((p) => ({ hermandad: h.nombrePopular ?? h.nombre, hermandadSlug: h.slug, paso: p }))
);

function SelectorTrono({
  valor,
  onChange,
  label,
}: {
  valor: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <select
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
        aria-label={label}
      >
        {opciones.map((o, i) => (
          <option key={`${o.hermandadSlug}-${o.paso.nombre}`} value={i}>
            {o.paso.nombre} — {o.hermandad}
          </option>
        ))}
      </select>
    </div>
  );
}

function FichaComparacion({ opcion }: { opcion: Opcion }) {
  const p = opcion.paso;
  return (
    <Card className="borde-orfebre">
      <CardHeader>
        <CardTitle className="text-center">
          {p.tipo === "Palio" ? "✨" : "✝️"} {p.nombre}
        </CardTitle>
        <p className="text-center text-sm text-muted-foreground">{opcion.hermandad}</p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {p.img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.img} alt={`Trono ${p.nombre}`} className="mx-auto h-40 w-auto rounded-md object-contain" />
        )}
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <Weight className="h-4 w-4 text-primary" />
            <span>
              <strong>Peso aproximado:</strong>{" "}
              {p.pesoKg ? `≈ ${p.pesoKg.toLocaleString("es-ES")} kg` : "dato no disponible"}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>
              <strong>{p.costaleros} Hombres de Trono</strong>
              {p.mayordomos ? ` · ${p.mayordomos} mayordomos` : ""}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Hammer className="h-4 w-4 text-primary" />
            <span>
              <strong>Hechura:</strong> {p.escultores.join(", ") || "Anónimo"} ({p.anio})
            </span>
          </li>
          {p.banda && <li>🎼 <strong>Banda:</strong> {p.banda}</li>}
          <li>
            <Badge variant="secondary">Capataz: {p.capataz}</Badge>
          </li>
        </ul>
        {p.descripcion && <p className="text-xs text-muted-foreground">{p.descripcion}</p>}
      </CardContent>
    </Card>
  );
}

export function ComparadorTronos() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(Math.min(3, opciones.length - 1));

  const diferencia = useMemo(() => {
    const oa = opciones[a];
    const ob = opciones[b];
    if (!oa?.paso.pesoKg || !ob?.paso.pesoKg) return null;
    return Math.abs(oa.paso.pesoKg - ob.paso.pesoKg);
  }, [a, b]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectorTrono valor={a} onChange={setA} label="Trono A" />
        <SelectorTrono valor={b} onChange={setB} label="Trono B" />
      </div>
      {a === b ? (
        <p className="text-center text-sm text-muted-foreground">
          Selecciona dos tronos distintos para compararlos cara a cara.
        </p>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <FichaComparacion opcion={opciones[a]} />
            <FichaComparacion opcion={opciones[b]} />
          </div>
          {diferencia !== null && (
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Scale className="h-4 w-4 text-primary" />
              Diferencia de peso: ≈ {diferencia.toLocaleString("es-ES")} kg
              {(() => {
                const oa = opciones[a];
                const ob = opciones[b];
                if (!oa?.paso.pesoKg || !ob?.paso.pesoKg) return null;
                const masPesado = oa.paso.pesoKg > ob.paso.pesoKg ? oa.paso.nombre : ob.paso.nombre;
                return <span>("{masPesado}" es el más pesado)</span>;
              })()}
            </p>
          )}
        </>
      )}
    </div>
  );
}
