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

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  experimental: {
    // El CSS crítico agresivo (optimizeCss/critters) emitía <link rel="preload">
    // de hojas no utilizadas en rutas sin el mapa ("/comparador"), provocando el
    // warning de rendimiento "was preloaded but not used". Se desactiva
    // explícitamente: el CSS de Leaflet se sirve solo en su chunk dinámico.
    optimizeCss: false,
  },
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  webpack: (config) => {
    // Alias explícito: '@/*' debe resolver SIEMPRE contra la raíz del proyecto,
    // independientemente del SO (Windows/Linux) o de la lectura de tsconfig paths.
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [...securityHeaders, {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net",
            // v12.1: `https://tile.openstreetmap.org` (host raíz) debe ir
            // EXPLÍCITO: el wildcard `https://*.tile.openstreetmap.org` NO
            // matchea el host sin subdominio y Chrome bloqueaba todos los
            // tiles con violación de CSP ("The action has been blocked").
            "img-src 'self' blob: data: https://tile.openstreetmap.org https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://images.pexels.com",
            "font-src 'self' data:",
            "connect-src 'self' https://nominatim.openstreetmap.org https://routing.openstreetmap.de https://router.project-osrm.org",
            "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
            "frame-ancestors 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests",
          ].join("; "),
        }],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
