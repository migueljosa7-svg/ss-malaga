import { getHermandadesPorDia } from "@/lib/data";
import { HermandadCard } from "@/components/hermandades/hermandad-card";
import { DIAS_SEMANA } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Hermandades" };

export default function HermandadesPage() {
  const porDia = getHermandadesPorDia();

  return (
    <div className="py-8">
      <h1 className="mb-6 text-2xl font-bold">Hermandades por día</h1>
      {DIAS_SEMANA.map((dia) =>
        porDia[dia]?.length ? (
          <section key={dia} className="mb-10">
            <h2 className="mb-3 border-b border-border pb-1 text-xl font-semibold text-primary">
              {dia}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {porDia[dia].map((h) => (
                <HermandadCard key={h.id} hermandad={h} />
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
}
