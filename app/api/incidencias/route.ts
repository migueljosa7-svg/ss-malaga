import { NextResponse, type NextRequest } from "next/server";
import { getIncidencias, getCallesCortadas } from "@/lib/data";
import { apiQuerySchema } from "@/lib/data/schemas";

export const dynamic = "force-dynamic";

/**
 * Feed ligero de incidencias. Con `?tipo=calles_cortadas` devuelve el
 * listado de calles cortadas (para las capas del mapa).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  if (searchParams.get("tipo") === "calles_cortadas") {
    return NextResponse.json(getCallesCortadas(), {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  }

  const parsed = apiQuerySchema.safeParse({
    nivel: searchParams.get("nivel") ?? undefined,
    slug: searchParams.get("slug") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parámetros inválidos", detalles: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  let data = getIncidencias();
  if (parsed.data.nivel) data = data.filter((i) => i.nivel === parsed.data.nivel);

  return NextResponse.json(
    data,
    { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } }
  );
}
