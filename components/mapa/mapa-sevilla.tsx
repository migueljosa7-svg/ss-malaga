"use client";

import dynamic from "next/dynamic";

// Leaflet requiere window: se carga solo en el cliente
export const MapaSevilla = dynamic(
  () => import("./MapaSemanaSanta").then((m) => m.MapaInteligente),
  {
    ssr: false,
    loading: () => <div className="h-[520px] animate-pulse rounded-lg bg-muted" />,
  }
);
