# SS Málaga ✝

PWA de la Semana Santa de Málaga: seguimiento de tronos y traslados en tiempo real, incidencias en vivo, mapa interactivo con simulador de hora, rutas peatonales evitando calles cortadas y fichas completas de 8 cofradías emblemáticas (Pollinica, El Cautivo, Mena/Legión, El Rico, Zamarrilla, Esperanza, Expiración y Sepulcro).

## Características
- **8 cofradías malagueñas** con datos completos: túnicas, hábitos, correas de Hombres de Trono, tronos (Cristo y Virgen), mayordomos, bandas, toques de campana y marchas.
- **Multimedia**: ilustraciones SVG/WebP en `/public/images/hermandades/` (túnicas, tronos, escudos) y audios en `/public/audio/` listos para sustituir por grabaciones reales.
- **Mapa inteligente** (Leaflet) centrado en Málaga (36.7213, -4.4214): itinerarios por día, calles cortadas, posición en vivo o simulada de cada trono con marcadores SVG diferenciados (Trono de Cristo / Trono de Virgen).
- **Simulador GPS de hora** (00:00–24:00) con momentos clave: Pollinica, Cautivo, Tribuna, Madrugá.
- **Rutas peatonales A→B** con Dijkstra sobre el grafo del Centro Histórico de Málaga (Larios, Tribuna, Alameda, Carretería), evitando tramos bloqueados.
- **Muro de incidencias** en tiempo real (auto-refresh 30s) con niveles info/warning/danger.
- **PWA offline-first** (next-pwa): tiles de mapa y datos JSON cacheados.
- **Seguridad**: CSP estricta, HSTS, nosniff, X-Frame-Options, Permissions-Policy.
- **Estética barroca malagueña**: Dorado Orfebre `#D4AF37`, Púrpura Nazareno `#4A154B`, Verde Esperanza `#1B4D3E`, Negro Calvario `#1A1A1A`, Fondo Crema Cera `#FAF7F2`.

## Desarrollo
```bash
npm install
npm run dev      # desarrollo
npm run build    # producción
npm start        # servir build
```

## Despliegue en Render
El archivo `render.yaml` define el Web Service `ss-malaga` (Node, plan free, región Frankfurt) con comando standalone `node .next/standalone/server.js`.
Conectar el repo de GitHub (`migueljosa7-svg/ss-malaga`) en Render y usar "Blueprint" con este archivo.
