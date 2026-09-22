// Canales de televisión y emisiones en directo de la Semana Santa de Málaga.
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
    id: "101-tv",
    nombre: "101 TV Málaga",
    youtubeId: "UCZ0C4UJ7CkPMPXBhP2wE-hQ",
    descripcion: "Televisión local malagueña: salidas y encierros",
  },
  {
    id: "malaga-tv",
    nombre: "Málaga TV",
    youtubeId: "UCPt5B2UaEvKGbF3fRTo8zFA",
    descripcion: "Emisiones en directo del Centro Histórico",
  },
];
