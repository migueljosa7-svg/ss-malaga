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
  metadataBase: new URL("https://ss-malaga.example.com"),
  title: {
    default: "SS Málaga — Semana Santa de Málaga en tiempo real",
    template: "%s | SS Málaga",
  },
  description:
    "Seguimiento de tronos, traslados e itinerarios en tiempo real, incidencias, calles cortadas y mapa interactivo de la Semana Santa de Málaga. Offline-first, con audio de toques de campana.",
  keywords: ["Semana Santa Málaga", "cofradías", "hermandades", "tronos", "hombres de trono", "incidencias", "mapa cofrade"],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  openGraph: {
    title: "SS Málaga — Semana Santa de Málaga en tiempo real",
    description:
      "Tronos, traslados, mapa e itinerarios en vivo de las hermandades de Málaga. Semana Santa de Málaga con toques de campana 3D y rutas sin calles cortadas.",
    locale: "es_ES",
    type: "website",
    siteName: "SS Málaga",
    url: "/",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "SS Málaga — cruz de nazareno dorada sobre púrpura nazareno",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "SS Málaga — Semana Santa de Málaga en tiempo real",
    description:
      "Mapa cofrade en vivo: tronos, traslados, incidencias e itinerarios de la Semana Santa de Málaga.",
    images: ["/icon.svg"],
  },
  appleWebApp: { capable: true, title: "SS Málaga", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
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
