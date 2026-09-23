import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getHermandadBySlug } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Nota: `size`/`contentType` NO se exportan: la validación de tipos de route
// handlers de Next 15.5 los rechaza. Dimensiones fijas 1200×630 abajo.

/**
 * Tarjetas Open Graph dinámicas 1200×630 (v11.0).
 * `/api/og` → institucional; `/api/og?slug=cautivo` → tarjeta de la cofradía
 * con nombre, día de salida y paleta corporativa morado/oro orfebre.
 * Fuentes locales (Cinzel + EB Garamond, OFL) en `public/fonts/og`.
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const h = slug ? getHermandadBySlug(slug) : null;

  // Fuentes ESTÁTICAS (woff de Fontsource): las TTFs variables de Google Fonts
  // rompen `parseFvarAxis` de @vercel/og → "reading '258'" (fix v11.0).
  const dir = path.join(process.cwd(), "public/fonts/og");
  const [cinzel400, cinzel700, garamond400, garamond500] = await Promise.all([
    readFile(path.join(dir, "cinzel-400.woff")),
    readFile(path.join(dir, "cinzel-700.woff")),
    readFile(path.join(dir, "eb-garamond-latin-400-normal.woff")),
    readFile(path.join(dir, "eb-garamond-latin-500-normal.woff")),
  ]);

  const titulo = h ? (h.nombrePopular ?? h.nombre) : "SS Malaga";
  const subtitulo = h
    ? `${h.diaSemana} · salida desde ${h.sede}`
    : "Semana Santa de Malaga en tiempo real";
  const etiqueta = h ? "Hermandad" : "Mapa cofrade en vivo";

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 72,
          backgroundImage:
            "linear-gradient(135deg, #4A154B 0%, #31092F 55%, #14060F 100%)",
          color: "#F5EFE3",
          fontFamily: "Garamond",
        }}
      >
        {/* Marco dorado orfebre */}
        <div
          style={{
            position: "absolute",
            inset: 26,
            border: "3px solid #D4AF37",
            borderRadius: 26,
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Cinzel",
              fontSize: 34,
              letterSpacing: 8,
              color: "#D4AF37",
            }}
          >
            SS MALAGA
          </span>
          <span
            style={{
              fontSize: 26,
              color: "#E8C86A",
              background: "rgba(212,175,55,0.14)",
              border: "2px solid #D4AF37",
              padding: "8px 26px",
              borderRadius: 999,
            }}
          >
            {etiqueta}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 64,
            gap: 26,
          }}
        >
          <span
            style={{
              fontFamily: "Cinzel",
              fontWeight: 700,
              fontSize: h ? 78 : 96,
              lineHeight: 1.05,
              color: "#FFFFFF",
            }}
          >
            {titulo}
          </span>
          <span style={{ fontSize: 40, color: "#EADFC7" }}>{subtitulo}</span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#C9B98F",
          }}
        >
          <span>Mapa · Radar · Mi Ruta · Incidencias</span>
          <span>App PWA cofrade · sin calles cortadas</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Cinzel", data: cinzel400, weight: 400, style: "normal" },
        { name: "Cinzel", data: cinzel700, weight: 700, style: "normal" },
        { name: "Garamond", data: garamond400, weight: 400, style: "normal" },
        { name: "Garamond", data: garamond500, weight: 500, style: "normal" },
      ],
    }
  );
}
