import { NextResponse, type NextRequest } from "next/server";
import { getHermandades, getHermandadBySlug } from "@/lib/data";
import { apiQuerySchema } from "@/lib/data/schemas";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  // Validación Zod de parámetros de entrada (sanitización)
  const parsed = apiQuerySchema.safeParse({
    dia: searchParams.get("dia") ?? undefined,
    slug: searchParams.get("slug") ?? undefined,
    nivel: searchParams.get("nivel") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parámetros inválidos", detalles: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { slug, dia } = parsed.data;

  if (slug) {
    const hermandad = getHermandadBySlug(slug);
    if (!hermandad) {
      return NextResponse.json({ error: "Hermandad no encontrada" }, { status: 404 });
    }
    return NextResponse.json(hermandad);
  }

  let data = getHermandades();
  if (dia) data = data.filter((h) => h.diaSemana === dia);

  return NextResponse.json(
    { total: data.length, data },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}
