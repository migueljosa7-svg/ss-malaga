import Link from "next/link";

/**
 * v8.0 — Pie de página discreto con enlace a la sección legal (RGPD).
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-card/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
        <p>
          © {new Date().getFullYear()} SS Málaga · Proyecto cofrade independiente sin ánimo de
          lucro
        </p>
        <nav aria-label="Enlaces legales" className="flex gap-3">
          <Link
            href="/legal"
            className="underline underline-offset-2 transition-colors hover:text-[#D4AF37]"
          >
            Aviso legal · Privacidad · Cookies
          </Link>
        </nav>
      </div>
    </footer>
  );
}
