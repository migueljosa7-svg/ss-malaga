/** @type {import('next').NextConfig} */
const path = require("path");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      // Tiles de OpenStreetMap para uso offline del mapa
      urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
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
            "img-src 'self' blob: data: https://*.tile.openstreetmap.org https://images.pexels.com",
            "font-src 'self' data:",
            "connect-src 'self' https://nominatim.openstreetmap.org",
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
