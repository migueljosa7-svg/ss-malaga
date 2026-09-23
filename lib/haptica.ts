/**
 * Motor háptico cofrade (v10.0).
 * Patrones de vibración sincronizados con la Fonoteca de Toques de Campana
 * para que el móvil retumbe con los golpes del mayordomo de trono.
 * SSR-safe: no-op en servidor y en navegadores sin `navigator.vibrate`.
 */
export const PATRONES_HAPTICOS = {
  /** 1 toque — Atención / Silencio bajo varales */
  atencion: [120],
  /** 3 toques de levanta — ¡Arriba el trono! (patrón del mayordomo) */
  levanta: [100, 50, 100, 50, 100],
  /** 2 toques — Abajo / Posar en horquillas */
  abajo: [100, 60, 100],
  /** Mecida a pulso */
  mecida: [150, 80, 150, 80, 150, 80, 150],
  /** Campanilla de guía — ritmo de sección procesional */
  campanilla: [40, 40, 40, 40, 40, 40],
  /** Selección suave de resultados / pestañas */
  seleccion: [15],
  /** Apertura de panel hábil (bottom sheet, paleta) */
  panel: [20, 30, 20],
} as const;

/** Dispara una vibración si el dispositivo la soporta. Devuelve true si vibró. */
export function vibrar(patron: readonly number[] | number[]): boolean {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return false;
  try {
    return navigator.vibrate(patron as number[]);
  } catch {
    return false;
  }
}

/** Cancela cualquier vibración en curso. */
export function cancelarVibracion(): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(0);
  } catch {
    /* dispositivo sin soporte háptico */
  }
}