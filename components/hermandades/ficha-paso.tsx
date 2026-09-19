"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Paso } from "@/types/hermandad";
import { Users, Hammer, Compass } from "lucide-react";

export function FichaPaso({ paso }: { paso: Paso }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {paso.tipo === "Palio" ? "✨" : paso.tipo === "Misterio" ? "✝️" : "⛪"} {paso.tipo}: {paso.nombre}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {paso.descripcion && <p className="text-muted-foreground">{paso.descripcion}</p>}
        <div className="flex flex-wrap gap-4 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Hammer className="h-4 w-4" /> {paso.escultores.join(", ") || "Anónimo"} ({paso.anio})
          </span>
          <span className="flex items-center gap-1.5">
            <Compass className="h-4 w-4" /> Capataz: {paso.capataz}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" /> {paso.costaleros} costaleros
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
