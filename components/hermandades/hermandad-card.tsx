import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Hermandad } from "@/types/hermandad";

const estadoVariant: Record<Hermandad["itinerario"][number]["estadoPaso"], "info" | "warning" | "success" | "default"> = {
  en_templo: "default",
  en_calle: "info",
  retrasado: "warning",
  recogido: "success",
};

const estadoLabel = {
  en_templo: "En templo",
  en_calle: "En calle",
  retrasado: "Retrasado",
  recogido: "Recogido",
};

export function HermandadCard({ hermandad }: { hermandad: Hermandad }) {
  const estado = hermandad.itinerario[0]?.estadoPaso ?? "en_templo";
  return (
    <Link href={`/hermandades/${hermandad.slug}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>{hermandad.nombrePopular ?? hermandad.nombre}</CardTitle>
            <p className="text-sm text-muted-foreground">{hermandad.sede}</p>
          </div>
          <Badge variant={estadoVariant[estado]}>{estadoLabel[estado]}</Badge>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{hermandad.diaSemana}</Badge>
            <Badge>Fundada en {hermandad.añoFundacion}</Badge>
            <Badge>{hermandad.numeroNazarenos.toLocaleString("es-ES")} nazarenos</Badge>
          </div>
          <p className="line-clamp-2 text-muted-foreground">
            {hermandad.pasos.map((p) => p.nombre).join(" · ")}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
