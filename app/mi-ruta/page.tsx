import type { Metadata } from "next";
import { GeneradorRutaCofrade } from "@/components/ruta/generador-ruta";

export const metadata: Metadata = { title: "Mi Ruta Cofrade" };

export default function MiRutaPage() {
  return (
    <div className="py-8">
      <h1 className="mb-2 text-2xl font-bold">Mi Ruta Cofrade</h1>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
        Planifica tu jornada: elige varias hermandades y generaremos el itinerario a pie
        optimizado entre sus puntos de salida, esquivando las calles cortadas del Centro Histórico.
      </p>
      <GeneradorRutaCofrade />
    </div>
  );
}
