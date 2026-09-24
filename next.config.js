/** @type {import('next').NextConfig} */
const path = require("path");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      // Tiles de OpenStreetMap para uso offline del mapa.
      // v12.1: Leaflet carga desde el host RAÍZ https://tile.openstreetmap.org
      // (no solo los subdominios [abc].) — sin cubrirlo, el service worker
      // jamás cacheaba los tiles reales.
      urlPattern: /^https:\/\/(?:[abc]\.)?tile\.openstreetmap\.org\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "osm-tiles",
        expiration: { maxEntries: 2000, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      // Fichas de hermandades / datos JSON offline-first
      urlPattern: /\.(?:json)$/i,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "api-data" },
    },
    {
      // Audio (campanas, marchas) para uso offline durante encierros
      urlPattern: /\.(?:mp3|ogg|wav)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "audio-cofrade",
        expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
        rangeRequests: true,
      },
    },
    {
      // Ilustraciones SVG/WebP de túnicas y tronos offline
      urlPattern: /\.(?:svg|webp|png|jpg|jpeg)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "imagenes-cofrade",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Export 100% estático: la web se sirve desde `out/` (Render Static Site).
  // NOTA: `headers()`, `redirects()`, `rewrites()`, ISR (`revalidate`) y las
  // Route Handlers (`app/api/*`) NO son compatibles con `output: "export"`.
  output: "export",
  trailingSlash: true, // cada ruta emite su propio index.html (hosting estático)
  experimental: {
    // El CSS crítico agresivo (optimizeCss/critters) emitía <link rel="preload">
    // de hojas no utilizadas en rutas sin el mapa ("/comparador"), provocando el
    // warning de rendimiento "was preloaded but not used". Se desactiva
    // explícitamente: el CSS de Leaflet se sirve solo en su chunk dinámico.
    optimizeCss: false,
  },
  images: {
    // Sin optimizador de imágenes en export estático (no existe el server de Next).
    unoptimized: true,
  },
  webpack: (config) => {
    // Alias explícito: '@/*' debe resolver SIEMPRE contra la raíz del proyecto,
    // independientemente del SO (Windows/Linux) o de la lectura de tsconfig paths.
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
};

module.exports = withPWA(nextConfig);
