import type { Metadata } from "next";
import { ComparadorTronos } from "@/components/comparador/comparador-tronos";

export const metadata: Metadata = { title: "Comparador de Tronos" };

export default function ComparadorPage() {
  return (
    <div className="py-8">
      <h1 className="mb-2 text-2xl font-bold">Comparador de Tronos de Granada</h1>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
        Compara dos tronos cara a cara: peso aproximado, número de Hombres de Trono, año de
        hechura de las imágenes y diseñadores. Datos estimados de uso cofrade.
      </p>
      <ComparadorTronos />
    </div>
  );
}
