import Link from "next/link";
import { Church, MapPin, AlertTriangle, Scale, Route } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio", icon: Church },
  { href: "/hermandades", label: "Hermandades", icon: Church },
  { href: "/mapa", label: "Mapa", icon: MapPin },
  { href: "/mi-ruta", label: "Mi Ruta", icon: Route },
  { href: "/comparador", label: "Comparador", icon: Scale },
  { href: "/incidencias", label: "Incidencias", icon: AlertTriangle },
];

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-wide">
          SS Málaga <span className="text-dorado">✝</span>
        </Link>
        <ul className="flex gap-1 sm:gap-4">
          {links.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-white/10"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
