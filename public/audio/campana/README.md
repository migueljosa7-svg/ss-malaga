# Audio real de campana de trono malagueño

Coloca aquí las grabaciones auténticas de toques de mayordomo de trono:

- `campana-3toques.mp3` — grabación de los **3 toques tradicionales** completos
  (prioridad máxima; se carga en cascada primero).
- `campana-1.mp3` — **toque individual**; se repite `toques` veces con un
  intervalo de 0,7 s para componer la serie.

## Cascada de reproducción (`lib/audio/campana-3d.ts`)

1. `/audio/campana/campana-3toques.mp3` (real, prioridad)
2. `/audio/campana/campana-1.mp3` × `toques`
3. `src` indicado por el llamador (compatibilidad v1.0)
4. **Sintetizador Web Audio API** (fallback sin red)

Un archivo se descarta automáticamente si no existe o si su contenido está
en silencio (placeholders de 2 KB), pasando al siguiente de la cascada.
