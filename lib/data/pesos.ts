// Pesos aproximados de los tronos de Granada (kg) — estimaciones cofrades.
// Se aplican por nombre de paso al cargar los datos.
const PESOS_TRONO: Record<string, number> = {
  "Santa Cena": 2400,
  "Victoria": 2200,
  "San Agustín": 2600,
  "Consolación": 2300,
  "Humildad": 1700,
  "Soledad": 2100,
  "Consuelo": 2600,
  "Sacromonte": 2300,
  "Meditación": 2400,
  "Remedios": 2200,
  "Perdón": 2500,
  "Aurora": 2300,
  "Misericordia": 2000,
  "Descendimiento": 2500,
};

export function pesoDePaso(nombre: string): number | undefined {
  const clave = Object.keys(PESOS_TRONO).find((k) => nombre.toLowerCase().includes(k.toLowerCase()));
  return clave ? PESOS_TRONO[clave] : undefined;
}
