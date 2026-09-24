import type { Metadata } from "next";
import { ListaIncidencias } from "@/components/incidencias/alertas-live";

export const metadata: Metadata = { title: "Incidencias" };

export default function IncidenciasPage() {
  return (
    <div className="py-8">
      <h1 className="mb-2 text-2xl font-bold">Muro de avisos en tiempo real</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Retrasos, cambios de itinerario por lluvia, calles cortadas y aglomeraciones. Actualización
        automática cada 30 segundos.
      </p>
      <ListaIncidencias />
    </div>
  );
}
