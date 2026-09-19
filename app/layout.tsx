import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { Navbar } from "@/components/ui/navbar";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ss-sevilla.example.com"),
  title: {
    default: "SS Sevilla — Semana Santa de Sevilla en tiempo real",
    template: "%s | SS Sevilla",
  },
  description:
    "Incidencias en vivo, retrasos de pasos, itinerarios reales vs teóricos, calles cortadas y mapa interactivo de la Semana Santa de Sevilla. Offline-first.",
  keywords: ["Semana Santa Sevilla", "cofradías", "hermandades", "incidencias", "mapa cofrade"],
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "SS Sevilla — Semana Santa de Sevilla en tiempo real",
    description: "Avisos en vivo, mapa e itinerarios de las hermandades de Sevilla.",
    locale: "es_ES",
    type: "website",
  },
  appleWebApp: { capable: true, title: "SS Sevilla", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#7f1d1d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 pb-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
