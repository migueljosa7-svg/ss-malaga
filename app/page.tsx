import Link from "next/link";
import { Search, MapPin, AlertTriangle, Church, Scale } from "lucide-react";
import { getHermandades, getIncidencias } from "@/lib/data";
import { HermandadCard } from "@/components/hermandades/hermandad-card";
import { BannerAlertaCritica } from "@/components/incidencias/alertas-live";
import { Buscador } from "@/components/ui/buscador";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFecha } from "@/lib/utils";

export const revalidate = 60; // ISR: revalidar cada minuto

export default function DashboardPage() {
  const hermandades = getHermandades().slice(0, 6);
  const incidencias = getIncidencias().slice(0, 4);

  return (
    <div className="py-8">
      <section className="mb-8 text-center">
        <h1 className="barroco-title text-3xl font-bold sm:text-4xl">
          Semana Santa de Málaga <span className="text-primary">en tiempo real</span>
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Tronos, traslados, retrasos, cambios de itinerario, calles cortadas y mapas — todo en una
          sola app, con modo offline cuando la red se satura.
        </p>
      </section>

      <Buscador />

      <section className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
          <AlertTriangle className="h-5 w-5 text-danger" /> Incidencias en vivo
        </h2>
        <BannerAlertaCritica />
        <ul className="space-y-3">
          {incidencias.map((i) => (
            <li key={i.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{i.titulo}</span>
                <Badge variant={i.nivel}>{i.tipo.replace("_", " ")}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{i.descripcion}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatFecha(i.timestamp)}</p>
            </li>
          ))}
        </ul>
        <Link href="/incidencias" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
          Ver muro completo de incidencias →
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
          <Church className="h-5 w-5 text-primary" /> Hermandades destacadas
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hermandades.map((h) => (
            <HermandadCard key={h.id} hermandad={h} />
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link href="/mapa">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Mapa en vivo
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Posición de los pasos, calles cortadas y rutas alternativas.
            </CardContent>
          </Card>
        </Link>
        <Link href="/hermandades">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Church className="h-5 w-5 text-primary" /> Todas las hermandades
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Del Domingo de Ramos al Domingo de Resurrección.
            </CardContent>
          </Card>
        </Link>
        <Link href="/incidencias">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" /> Muro de avisos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Retrasos, lluvia y aglomeraciones actualizados cada 30s.
            </CardContent>
          </Card>
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
          <Scale className="h-5 w-5 text-primary" /> Comparador de tronos
        </h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              ¿250 Hombres de Trono en la Esperanza frente a 200 en el Cautivo? Compara peso,
              cuadrillas y hechuras de los tronos de Málaga cara a cara.
            </p>
            <Link
              href="/comparador"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              Abrir comparador de tronos →
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
