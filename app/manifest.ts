import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Semana Santa Sevilla / Málaga',
    short_name: 'SS App',
    description: 'Seguimiento y geolocalización de procesiones en tiempo real',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#4A154B',
    icons: [
      // Nota: `'any maskable'` (combinado con espacio) NO está permitido por el
      // tipo `MetadataRoute.Manifest` de Next.js ('any' | 'maskable' | 'monochrome'),
      // por lo que se declaran dos entradas por tamaño: propósito `any` y `maskable`.
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
