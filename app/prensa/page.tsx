import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Crosshair,
  ShieldAlert,
  Smartphone,
  FileDown,
  Mail,
  Radio,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Prensa — Dossier oficial",
  description:
    "Kit de prensa de SS Málaga: resumen ejecutivo, metadatos GPS, sistema de prevención de aglomeraciones y tecnología PWA para medios y Agrupación de Cofradías.",
};

const CONTACTO = "prensa@ss-malaga.example.com"; // ← sustituir por el correo oficial de la Agrupación

export default function PrensaPage() {
  return (
    <div className="py-8">
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="warning">Kit de prensa</Badge>
          <Badge>v11.0</Badge>
        </div>
        <h1 className="mt-2 text-3xl font-bold">Dossier oficial SS Málaga</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Recursos institucionales para medios de comunicación y la Agrupación de
          Cofradías: qué es el proyecto, cómo protege a los cofrades y qué
          tecnología lo sostiene.
        </p>
      </header>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-primary" /> Resumen ejecutivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>SS Málaga</strong> es una Progressive Web App (PWA) offline-first
              que sigue en tiempo real los tronos de la Semana Santa de Málaga:
              posición telemétrica interpolada sobre el callejero real, radar de
              proximidad, calculador de rutas peatonales que esquiva las calles
              cortadas, muro de incidencias y toques de campana con háptica.
            </p>
            <p>
              Diseñada por y para cofrades: modo ahorro de datos, instalable en el
              móvil y funcional sin cobertura en plena Carrera Oficial.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crosshair className="h-5 w-5 text-primary" /> Metadatos de precisión GPS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Interpolación de posición sobre polilíneas del callejero oficial
                (sin rectas imposibles entre esquinas).
              </li>
              <li>
                Puntos de itinerario con hora teorica y estado por paso; estimación
                de ETA y ritmo de marcha (m/h).
              </li>
              <li>
                Geolocalización opcional del usuario para el radar de cruces con
                distancia haversine en metros/kilómetros.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" /> Prevención de aglomeraciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Muro de avisos en vivo cada 30 s: retrasos, aglomeraciones, calles
                cortadas y cambios de itinerario por lluvia.
              </li>
              <li>
                Radar de tronos cercanos para dosificar la afluencia por puntos
                icónicos (Tribuna, Desembarco, Catedral).
              </li>
              <li>
                Filtro «solo en la calle»: el mapa solo dibuja procesiones activas,
                evitando ruido visual en momentos de alta densidad.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" /> Tecnología PWA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ul className="list-disc space-y-1 pl-5">
              <li>PWA instalable con service worker y caché offline-first.</li>
              <li>Next.js 15 (App Router) + Leaflet + React Query.</li>
              <li>
                Accesibilidad: contraste WCAG AA, listbox del ⌘K, háptica unificada
                y modo ahorro de datos/batería.
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <a
            href="/nota-de-prensa-ss-malaga.md"
            download
            className="inline-flex items-center gap-2 rounded-full bg-[#4A154B] px-5 py-2.5 text-sm font-semibold text-[#D4AF37] transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            <FileDown className="h-4 w-4" /> Descargar nota de prensa
          </a>
          <a
            href={`mailto:${CONTACTO}?subject=Prensa%20SS%20Malaga`}
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/60 px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            <Mail className="h-4 w-4" /> Contacto de prensa
          </a>
        </div>
      </div>
    </div>
  );
}
