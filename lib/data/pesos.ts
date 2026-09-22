// Pesos aproximados de los tronos de Málaga (kg) — estimaciones cofrades públicas.
// Se aplican por nombre de paso al cargar los datos.
const PESOS_TRONO: Record<string, number> = {
  "Pollinica": 1800,
  "Pollinica (Palio)": 2200,
  "Cautivo": 2700,
  "Virgen de la Merced": 2400,
  "Cristo de la Buena Muerte": 3200,
  "Virgen de la Paloma": 2500,
  "Esperanza": 3500,
  "Zamarrilla": 2300,
  "Santo Sepulcro": 2000,
  "Soledad": 2100,
};

export function pesoDePaso(nombre: string): number | undefined {
  const clave = Object.keys(PESOS_TRONO).find((k) => nombre.toLowerCase().includes(k.toLowerCase()));
  return clave ? PESOS_TRONO[clave] : undefined;
}
