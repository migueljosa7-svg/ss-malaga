"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUIStore } from "@/lib/store";
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
  const modoAhorro = useUIStore((s) => s.modoAhorro);
  const estado = hermandad.itinerario[0]?.estadoPaso ?? "en_templo";
  return (
    <Link href={`/hermandades/${hermandad.slug}`} className="block h-full">
      {/* v10.0: entrada animada + halo dorado al pasar el cursor (framer-motion) */}
      <motion.div
        initial={modoAhorro ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: modoAhorro ? 0 : 0.45, ease: "easeOut" }}
        whileHover={
          modoAhorro
            ? undefined
            : { y: -6, boxShadow: "0 18px 38px -18px rgba(212, 175, 55, 0.55)" }
        }
        whileTap={{ scale: 0.985 }}
        className="h-full"
      >
        <Card className="tarjeta-cofrade h-full transition-all duration-300 borde-destello-dorado">
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
      </motion.div>
    </Link>
  );
}
