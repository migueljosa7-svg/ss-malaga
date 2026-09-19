import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PuntoItinerario } from "@/types/hermandad";
import { cn } from "@/lib/utils";
import { MapPin, Clock } from "lucide-react";

const dotColor: Record<PuntoItinerario["estadoPaso"], string> = {
  en_templo: "bg-muted-foreground",
  en_calle: "bg-info",
  retrasado: "bg-warning",
  recogido: "bg-green-600",
};

export function TimelineItinerario({ itinerario }: { itinerario: PuntoItinerario[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Itinerario teórico vs real</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative ml-2 border-l-2 border-border">
          {itinerario.map((p) => {
            const retraso =
              p.horaEstimadaReal && p.horaEstimadaReal !== p.horaTeorica;
            return (
              <li key={p.id} className="mb-6 ml-4 last:mb-0">
                <span
                  className={cn(
                    "absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full",
                    dotColor[p.estadoPaso]
                  )}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{p.nombre}</span>
                  {p.estadoPaso === "retrasado" && <Badge variant="warning">Retrasado</Badge>}
                  {p.estadoPaso === "en_calle" && <Badge variant="info">En calle</Badge>}
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Teórico: {p.horaTeorica}
                  </span>
                  {p.horaEstimadaReal && (
                    <span
                      className={cn(
                        "flex items-center gap-1 font-medium",
                        retraso ? "text-warning" : "text-green-700"
                      )}
                    >
                      Real: {p.horaEstimadaReal}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
