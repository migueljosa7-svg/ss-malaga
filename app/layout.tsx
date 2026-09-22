import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { Navbar } from "@/components/ui/navbar";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ss-malaga.example.com"),
  title: {
    default: "SS Málaga — Semana Santa de Málaga en tiempo real",
    template: "%s | SS Málaga",
  },
  description:
    "Seguimiento de tronos, traslados e itinerarios en tiempo real, incidencias, calles cortadas y mapa interactivo de la Semana Santa de Málaga. Offline-first, con audio de toques de campana.",
  keywords: ["Semana Santa Málaga", "cofradías", "hermandades", "tronos", "hombres de trono", "incidencias", "mapa cofrade"],
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "SS Málaga — Semana Santa de Málaga en tiempo real",
    description: "Tronos, traslados, mapa e itinerarios de las hermandades de Málaga.",
    locale: "es_ES",
    type: "website",
  },
  appleWebApp: { capable: true, title: "SS Málaga", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#4A154B",
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
