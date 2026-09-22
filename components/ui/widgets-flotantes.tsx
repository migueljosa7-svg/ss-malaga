"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/store";
import { ReproductorGlobalMarchas } from "@/components/hermandades/reproductor-marchas";
import { BotonModoAhorro } from "@/components/ui/boton-modo-ahorro";

/**
 * Widgets flotantes globales (v1.0 Pro):
 * - Reproductor de marchas con barra de progreso.
 * - Botón de Modo Ahorro de Datos / Aglomeración.
 * Aplica la clase `modo-ahorro` al body para desactivar animaciones complejas.
 */
export function WidgetsFlotantes() {
  const modoAhorro = useUIStore((s) => s.modoAhorro);

  useEffect(() => {
    document.body.classList.toggle("modo-ahorro", modoAhorro);
  }, [modoAhorro]);

  return (
    <>
      <ReproductorGlobalMarchas />
      <BotonModoAhorro />
    </>
  );
}
