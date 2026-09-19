import type { Hermandad } from "@/types/hermandad";

export const hermandadesBatch1: Hermandad[] = [
  {
    id: "h-borriquita",
    slug: "la-borriquita",
    nombre: "Hermandad de la Sagrada Entrada en Jerusalén",
    nombrePopular: "La Borriquita",
    sede: "Iglesia de la Anunciación (Universidad), Calle Laraña",
    diaSemana: "Domingo de Ramos",
    añoFundacion: 1922,
    numeroHermanos: 2200,
    numeroNazarenos: 700,
    tiempoPaso: 40,
    musica: ["Banda de Cornetas y Tambores Varales de Cristo", "Agrupación Musical Sagrada Entrada"],
    vestimenta: {
      descripcionTunica: "Túnica de lino crudo con botonadura, capillo antifaz rojo carmesí, cordón de seda al hombro y sandalias.",
      colorAntifaz: "rojo carmesí",
      capa: false,
      cirios: "Cirios blancos",
    },
    pasos: [
      {
        tipo: "Misterio",
        nombre: "Sagrada Entrada de Jesús en Jerusalén",
        escultores: ["José Ovando (1698)", "Antón de Astorga", "Sebastián Santos Rojas"],
        capataz: "Manuel Santiago",
        costaleros: 35,
        anio: 1698,
        descripcion: "El Señor sobre la borriquita con la Muchedumbre hebrea, una de las escenas más entrañables del Domingo de Ramos infantil.",
      },
    ],
    historia:
      "Fundada en 1922 por universitarios, radica en la capilla universitaria de la Anunciación. Es la hermandad más popular del Domingo de Ramos por su carácter familiar: niños con ramos de olivo acompañan al Señor en su entrada triunfal en Jerusalén.",
    curiosidades: [
      "Los niños hacen su primera comunión acompañando al Señor con palmas y olivos.",
      "La borriquita original es una talla anónima del siglo XVIII.",
      "Su itinerario atraviesa la zona comercial de Sierpes en plena tarde de Domingo de Ramos.",
    ],
    itinerario: [
      { id: "b1", nombre: "Iglesia de la Anunciación (Salida)", lat: 37.3922, lng: -5.9944, horaTeorica: "12:30", horaEstimadaReal: "12:40", estadoPaso: "en_templo" },
      { id: "b2", nombre: "Calle Laraña", lat: 37.3926, lng: -5.9939, horaTeorica: "13:00", estadoPaso: "en_templo" },
      { id: "b3", nombre: "Plaza Nueva", lat: 37.3889, lng: -5.9969, horaTeorica: "14:00", estadoPaso: "en_templo" },
      { id: "b4", nombre: "Catedral (Carrera Oficial)", lat: 37.3867, lng: -5.9942, horaTeorica: "16:15", estadoPaso: "en_templo" },
      { id: "b5", nombre: "Campana", lat: 37.3938, lng: -5.9961, horaTeorica: "19:00", estadoPaso: "en_templo" },
    ],
    videos: [
      { id: "vb-v1", titulo: "Salida de La Borriquita", youtubeId: "5qap5aO4i9A" },
    ],
    imagenes: [],
  },
  {
    id: "h-amor",
    slug: "el-amor",
    nombre: "Hermandad del Amor",
    nombrePopular: "El Amor",
    sede: "Iglesia de San Julian, Calle Cabrera",
    diaSemana: "Domingo de Ramos",
    añoFundacion: 1508,
    numeroHermanos: 1800,
    numeroNazarenos: 600,
    tiempoPaso: 45,
    musica: ["Banda de Música de Mairena del Alcor", "Banda de Música Giralda"],
    vestimenta: {
      descripcionTunica: "Túnica de raso blanco, antifaz morado con escapulario del Amor, capa morada y cirio blanco.",
      colorAntifaz: "morado",
      capa: true,
      cirios: "Cirios blancos",
    },
    pasos: [
      {
        tipo: "Misterio",
        nombre: "Santísimo Cristo del Amor",
        escultores: ["Francisco de Ocampo (1608)"],
        capataz: "Álvaro Moreno",
        costaleros: 40,
        anio: 1608,
        descripcion: "Crucificado de gran serenidad, atribuido a Francisco de Ocampo y Felguera.",
      },
      {
        tipo: "Palio",
        nombre: "Virgen del Socorro",
        escultores: ["Sebastián Santos (1937)"],
        capataz: "Álvaro Moreno",
        costaleros: 36,
        anio: 1937,
      },
    ],
    historia:
      "Es una de las hermandades más antiguas de Sevilla, con raíces en 1508 en el Hospital del Amor. Tras décadas en la Catedral, se instala en San Julián. Su Cristo del Amor es la primera imagen que entró en la nueva Catedral tras la restauración de 1992.",
    curiosidades: [
      "El Cristo del Amor fue la primera imagen en entrar en la Catedral tras la restauración del 92.",
      "Su banda de tambores interpreta 'Amor' a la entrada del paso en la Carrera Oficial.",
    ],
    itinerario: [
      { id: "a1", nombre: "Iglesia de San Julián (Salida)", lat: 37.3971, lng: -5.9906, horaTeorica: "15:50", estadoPaso: "en_templo" },
      { id: "a2", nombre: "Calle Feria", lat: 37.3981, lng: -5.9957, horaTeorica: "17:00", estadoPaso: "en_templo" },
      { id: "a3", nombre: "Campana", lat: 37.3938, lng: -5.9961, horaTeorica: "18:15", estadoPaso: "en_templo" },
      { id: "a4", nombre: "Catedral (Carrera Oficial)", lat: 37.3867, lng: -5.9942, horaTeorica: "20:30", estadoPaso: "en_templo" },
      { id: "a5", nombre: "Plaza del Salvador", lat: 37.3905, lng: -5.9939, horaTeorica: "23:30", estadoPaso: "en_templo" },
    ],
    videos: [
      { id: "va-v1", titulo: "El Amor en la Carrera Oficial", youtubeId: "zOzO7ZK6cAo" },
    ],
    imagenes: [],
  },
];
