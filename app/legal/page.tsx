import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso legal y privacidad",
  description:
    "Aviso legal, política de privacidad (RGPD), política de cookies y exención de responsabilidad sobre la telemetría GPS de la Semana Santa de Granada.",
};

const secciones = [
  {
    id: "aviso-legal",
    titulo: "1. Aviso Legal (LSSI-CE)",
    cuerpo: (
      <>
        <p>
          <strong>Titularidad:</strong> «SS Granada» es una aplicación comunitaria de carácter
          informativo, desarrollada y mantenida de forma independiente sin ánimo de lucro. No
          representa oficialmente ni sustituye a la Agrupación de Cofradías de Semana Santa de
          Granada, al Ayuntamiento de Granada ni a ninguna hermandad concreta; se ofrece como
          herramienta auxiliar de utilidad pública para el peregrinaje cofrade granadino.
        </p>
        <p>
          <strong>Propiedad intelectual:</strong> los escudos, imágenes, túnicas, ilustraciones
          y denominaciones de las cofradías pertenecen a sus respectivos titulares y se
          utilizan con fines identificativos y no comerciales. Las marchas procesionales y
          grabaciones son titularidad de sus autores, editores y de las bandas de música
          intérpretes; esta plataforma no reivindica derecho alguno sobre ellas y se reproducen
          únicamente como referencia informativa bajo cita de origen.
        </p>
        <p>
          <strong>Condiciones de uso:</strong> el acceso a la web implica la aceptación de
          estas condiciones. Queda prohibido el uso de los datos publicados con fines
          comerciales y la extracción masiva automatizada (scraping) de contenidos.
        </p>
      </>
    ),
  },
  {
    id: "privacidad",
    titulo: "2. Política de Privacidad y RGPD",
    cuerpo: (
      <>
        <p>
          Conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD),
          se informa de que:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>No se recogen datos personales identificativos.</strong> No hay registro de
            usuarios ni formularios con nombre, correo o teléfono.
          </li>
          <li>
            <strong>No se rastrea la ubicación del usuario.</strong> La aplicación no solicita
            permiso de geolocalización; las posiciones GPS mostradas corresponden a los tronos
            según itinerarios teóricos, nunca a la posición del visitante.
          </li>
          <li>
            <strong>Datos técnicos locales.</strong> Preferencias (tema, modo ahorro, capas)
            se guardan solo en el <code>localStorage</code> del dispositivo, sin salir de él.
          </li>
          <li>
            <strong>Sin cookies analíticas ni publicitarias.</strong> No se emplea Google
            Analytics ni redes de anuncios.
          </li>
          <li>
            <strong>Terceros.</strong> Tiles de OpenStreetMap y CARTO; vídeos de YouTube bajo
            modo de privacidad mejorada (youtube-nocookie), solo bajo demanda. Actúan como
            responsables independientes conforme a sus políticas.
          </li>
          <li>
            <strong>Derechos del interesado.</strong> Acceso, rectificación, supresión,
            oposición, limitación y portabilidad mediante los canales oficiales del proyecto.
            No se adoptan decisiones automatizadas ni se crean perfiles.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies",
    titulo: "3. Política de Cookies y caché PWA",
    cuerpo: (
      <>
        <p>
          Solo se utiliza <strong>almacenamiento técnico esencial</strong>:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code>localStorage</code> — preferencias (tema, modo ahorro, capas, descarte del
            banner de instalación).
          </li>
          <li>
            Caché del Service Worker (Workbox) — ficheros, tiles del mapa, ilustraciones y
            audio para funcionar <strong>offline</strong> en zonas sin cobertura.
          </li>
          <li>Cookies de sesión estrictamente necesarias para el funcionamiento técnico.</li>
        </ul>
        <p>
          No hay cookies de perfilamiento ni publicidad, por lo que no se requiere banner de
          consentimiento (art. 22.2 LSSI-CE y Guía del AEPD). Puede vaciar todo desde
          <strong> Ajustes y Almacenamiento → 🗑️ Borrar caché</strong> o desde la
          configuración de su navegador.
        </p>
      </>
    ),
  },
  {
    id: "exencion",
    titulo: "4. Exención de Responsabilidad (telemetría GPS en directo)",
    cuerpo: (
      <>
        <p>Advertencia sobre itinerarios, posiciones GPS y tiempos mostrados:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Las <strong>posiciones en vivo son estimaciones</strong> calculadas a partir de los
            itinerarios teóricos; la salida y paradas reales pueden desviarse por incidencias
            o acuerdos de última hora.
          </li>
          <li>
            Itinerarios, horarios y cambios de recorrido son
            <strong> propiedad de la Agrupación de Cofradías y las autoridades</strong>, y
            prevalecerán siempre sobre lo mostrado aquí.
          </li>
          <li>
            La información no sustituye a los bandos oficiales ni a la señalización en la vía;
            ante discrepancias, siga siempre a la Policía Local y las fuerzas de seguridad.
          </li>
          <li>
            El uso del mapa y la telemetría es responsabilidad del usuario; no se garantiza la
            exactitud ni la disponibilidad ininterrumpida de los datos en directo.
          </li>
        </ul>
        <p className="text-muted-foreground">Última actualización: marzo de 2026.</p>
      </>
    ),
  },
];

export default function PaginaLegal() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-10">
      <header className="space-y-2 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] oro-texto">
          Cumplimiento normativo
        </p>
        <h1 className="barroco-title text-3xl text-[#1E0A24] dark:text-[#C5A059]">
          Aviso Legal, Privacidad y Cookies
        </h1>
        <p className="text-sm text-muted-foreground">
          Información exigida por la Ley 34/2002 (LSSI-CE) y el Reglamento (UE) 2016/679
          (RGPD)
        </p>
      </header>

      <div className="space-y-3">
        {secciones.map((s) => (
          <details
            key={s.id}
            id={s.id}
            className="borde-destello-dorado group rounded-xl border border-[#C5A059]/40 bg-card p-4 open:shadow-[0_12px_32px_-16px_rgba(74,21,75,0.5)]"
          >
            <summary className="cursor-pointer list-none text-sm font-bold text-[#1E0A24] transition-colors hover:text-[#C5A059] dark:text-[#C5A059] [&::-webkit-details-marker]:hidden">
              {s.titulo}
              <span className="float-right transition-transform group-open:rotate-90" aria-hidden>
                ›
              </span>
            </summary>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/90">
              {s.cuerpo}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
