"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/store";
import { ReproductorGlobalMarchas } from "@/components/hermandades/reproductor-marchas";
import { BotonModoAhorro } from "@/components/ui/boton-modo-ahorro";
import { PanelCache } from "@/components/ajustes/panel-cache";
import { InstallBanner } from "@/components/pwa/install-banner";

/**
 * Widgets flotantes globales (v1.0 Pro):
 * - Reproductor de marchas con barra de progreso.
 * - Botón de Modo Ahorro de Datos / Aglomeración.
 * - v8.0: banner de instalación PWA + panel de caché/almacenamiento.
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
      <PanelCache />
      <InstallBanner />
    </>
  );
}
