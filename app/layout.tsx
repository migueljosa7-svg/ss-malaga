import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { Navbar } from "@/components/ui/navbar";
import { WidgetsFlotantes } from "@/components/ui/widgets-flotantes";
import { Footer } from "@/components/ui/footer";
// Nota: NO se importa `leaflet/dist/leaflet.css` aquí a propósito. El CSS de Leaflet
// vive únicamente en el chunk dinámico del mapa (components/mapa/MapaSemanaSanta.tsx).
// Importarlo en el layout emitía un <link rel="preload"> no utilizado en rutas sin
// mapa (p. ej. /comparador), generando el warning "preloaded but not used".
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ss-granada.example.com"),
  title: {
    default: "SS Granada — Semana Santa de Granada en tiempo real",
    template: "%s | SS Granada",
  },
  description:
    "Seguimiento de tronos, traslados e itinerarios en tiempo real, incidencias, calles cortadas y mapa interactivo de la Semana Santa de Granada. Offline-first, con audio de toques de campana.",
  keywords: ["Semana Santa Granada", "cofradías", "hermandades", "tronos", "hombres de trono", "incidencias", "mapa cofrade"],
  // Export estático: Next 15 no emite metadata routes dinámicas
  // (app/manifest.ts) en `output: 'export'` → se sirve public/manifest.json.
  manifest: "/manifest.json",
  // v10.0: iconos resueltos por CONVENCIÓN de ficheros (Metadata API de Next.js).
  // `app/favicon.ico`, `app/icon.svg` y `app/apple-icon.png` se emiten
  // automáticamente sin preloads duplicados ni 404.
  openGraph: {
    title: "SS Granada — Semana Santa de Granada en tiempo real",
    description:
      "Tronos, traslados, mapa e itinerarios en vivo de las hermandades de Granada. Semana Santa de Granada con toques de campana 3D y rutas sin calles cortadas.",
    locale: "es_ES",
    type: "website",
    siteName: "SS Granada",
    url: "/",
    // Export estático: sin Route Handler /api/og → se usa el icono estático.
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "SS Granada — Semana Santa de Granada en tiempo real",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SS Granada — Semana Santa de Granada en tiempo real",
    description:
      "Mapa cofrade en vivo: tronos, traslados, incidencias e itinerarios de la Semana Santa de Granada.",
    images: ["/icon-512.png"],
  },
  appleWebApp: { capable: true, title: "SS Granada", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F19" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 pb-16">{children}</main>
          <Footer />
          <WidgetsFlotantes />
        </Providers>
      </body>
    </html>
  );
}
