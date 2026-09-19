import type { Metadata } from "next";
import { MapaSevilla } from "@/components/mapa/mapa-sevilla";

export const metadata: Metadata = { title: "Mapa" };

export default function MapaPage() {
  return (
    <div className="py-8">
      <h1 className="mb-2 text-2xl font-bold">Mapa de la Semana Santa</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Capas: posición de los pasos, calles cortadas e itinerarios. Las capas de mapas base se
        guardan en caché para funcionar sin conexión.
      </p>
      <MapaSevilla />
    </div>
  );
}
