// Canales de televisión y emisiones en directo de la Semana Santa de Granada.
// Los youtubeId corresponden a los canales oficiales (se embeben como streams en vivo).
export const CANALES_DIRECTO: Array<{
  id: string;
  nombre: string;
  youtubeId: string;
  descripcion: string;
}> = [
  {
    id: "canal-sur",
    nombre: "Canal Sur — Semana Santa",
    youtubeId: "UCy8fHm8kUX9oVwmmS3Tg6ww",
    descripcion: "Retransmisión oficial de las procesiones andaluzas",
  },
  {
    id: "tg7",
    nombre: "TG7 Granada (canal municipal)",
    youtubeId: "UC4svqJ0E5nUlvjo_fuzvjzA",
    descripcion: "Televisión municipal de Granada: salidas y Carrera Oficial en directo",
  },
];

