# SS Sevilla ✝

PWA de la Semana Santa de Sevilla: incidencias en vivo, retrasos de pasos, mapa interactivo con simulador de hora, rutas peatonales evitando calles cortadas y fichas completas de 13 hermandades emblemáticas.

## Características
- **13 hermandades** con datos completos (pasos, túnicas, itinerarios, vídeos).
- **Mapa inteligente** (Leaflet): itinerarios por día, calles cortadas, posición en vivo o simulada de cada cruz de guía.
- **Rutas peatonales A→B** con Dijkstra sobre grafo del centro, evitando tramos bloqueados.
- **Muro de incidencias** en tiempo real (auto-refresh 30s) con niveles info/warning/danger.
- **PWA offline-first** (next-pwa): tiles de mapa y datos JSON cacheados.
- **Seguridad**: CSP estricta, HSTS, nosniff, X-Frame-Options, Permissions-Policy y rate limiting en `/api/*`.

## Desarrollo
```bash
npm install
npm run dev      # desarrollo
npm run build    # producción
npm start        # servir build
```

## Despliegue en Render
El archivo `render.yaml` define el Web Service (Node, plan free, región Frankfurt).
Conectar el repo de GitHub en Render y usar "Blueprint" con este archivo.
