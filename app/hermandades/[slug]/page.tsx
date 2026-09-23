import { notFound } from "next/navigation";
import { getHermandadBySlug, getHermandades } from "@/lib/data";
import { FichaTabs } from "@/components/hermandades/ficha-tabs";
import { FichaModoCofrade } from "@/components/hermandades/ficha-modo-cofrade";
import { EstadoHermandad } from "@/components/hermandades/estado-hermandad";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  return getHermandades().map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const h = getHermandadBySlug(slug);
  return { title: h?.nombre ?? "Hermandad" };
}

export default async function FichaHermandadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const h = getHermandadBySlug(slug);
  if (!h) notFound();

  return (
    <div className="py-8">
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{h.diaSemana}</Badge>
          <EstadoHermandad hermandad={h} />
        </div>
        <h1 className="mt-2 text-3xl font-bold">{h.nombre}</h1>
        <p className="text-muted-foreground">{h.sede}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge>
            <Users className="mr-1 inline h-3 w-3" />
            {h.numeroHermanos.toLocaleString("es-ES")} hermanos
          </Badge>
          <Badge>{h.numeroNazarenos.toLocaleString("es-ES")} nazarenos</Badge>
          <Badge>{h.tiempoPaso} min de paso a paso</Badge>
          <Badge>Fundada en {h.añoFundacion}</Badge>
        </div>
      </header>

      <FichaModoCofrade hermandad={h} />

      <FichaTabs hermandad={h} />
    </div>
  );
}