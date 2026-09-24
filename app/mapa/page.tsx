import type { Metadata } from "next";
import { MapaGranada } from "@/components/mapa/mapa-granada";

export const metadata: Metadata = { title: "Mapa" };

export default function MapaPage() {
  return (
    <div className="py-8">
      <h1 className="mb-2 text-2xl font-bold">Mapa de la Semana Santa de Granada</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Capas: posición de los tronos (Cristo y Virgen), calles cortadas e itinerarios. Las capas de
        mapas base se guardan en caché para funcionar sin conexión.
      </p>
      <MapaGranada />
    </div>
  );
}
