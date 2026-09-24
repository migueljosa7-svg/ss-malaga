# SS Granada ✝

PWA de la Semana Santa de Granada 2026 (export 100 % estático): seguimiento de tronos y traslados en tiempo real, incidencias en vivo, mapa interactivo con simulador de hora, rutas peatonales evitando calles cortadas y fichas completas de 8 cofradías emblemáticas (Santa Cena, San Agustín, La Cañilla, Los Gitanos, Los Estudiantes, La Aurora, El Silencio y La Soledad de San Jerónimo). Datos del programa oficial de la Real Federación de Hermandades y Cofradías de Granada (29 de marzo – 5 de abril de 2026).

## Características
- **8 cofradías granadinas** con datos completos: túnicas, hábitos, correas de Hombres de Trono, tronos (Cristo y Virgen), mayordomos, bandas, toques de campana y marchas.
- **Multimedia**: ilustraciones SVG/WebP en `/public/images/hermandades/` (túnicas, tronos, escudos) y audios en `/public/audio/` listos para sustituir por grabaciones reales.
- **Mapa inteligente** (Leaflet) centrado en Granada (37.17733, -3.59856): itinerarios por día, calles cortadas, posición en vivo o simulada de cada trono con marcadores SVG diferenciados (Trono de Cristo / Trono de Virgen).
- **Simulador GPS de hora** (00:00–24:00) con momentos clave: Santa Cena, Sagrado Corazón, Carrera de la Virgen, Madrugá del Silencio.
- **Rutas peatonales A→B** con Dijkstra sobre el grafo del Centro Histórico de Granada (Carrera del Darro, Gran Vía de Colón, Carrera de la Virgen, Ganivet), evitando tramos bloqueados.
- **Muro de incidencias** en tiempo real (auto-refresh 30s) con niveles info/warning/danger.
- **PWA offline-first** (next-pwa): tiles de mapa y datos JSON cacheados.
- **Estática sin servidor**: `output: 'export'` (`./out`), sin API routes, ISR ni middleware; los datos viven en el bundle.
- **Estética barroca granadina**: Púrpura granadino `#1E0A24`, Azul noche `#0B0F19`, Dorado orfebre `#C5A059`, Grana granadino `#8B0000`, Fondo Crema Cera `#FAF7F2`.

## Desarrollo
```bash
npm install
npm run dev      # desarrollo
npm run build    # producción → genera ./out
```

## Despliegue en Render
El archivo `render.yaml` define el Static Site `ss-granada` (plan free) con `buildCommand: npm ci && npm run build` y `staticPublishPath: ./out`.
Conectar el repo de GitHub (`migueljosa7-svg/ss-granada`) en Render y usar "Blueprint" con este archivo.
