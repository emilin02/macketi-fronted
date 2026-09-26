'use client';

import Link from 'next/link';
import { Menu, Headphones } from 'lucide-react';

export default function TopNav() {
  return (
    <nav className="bg-macketi-yellow">
      <div className="max-w-[1400px] mx-auto px-4 py-2 flex items-center gap-6 text-sm font-medium text-macketi-black">
        {/* Botón "Todas las categorías" */}
        <button className="flex items-center gap-2 bg-macketi-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-macketi-navy/90">
          <Menu size={18} />
          <span>Todas las categorías</span>
        </button>

        {/* Links */}
        <Link href="/tiendas" className="hover:text-macketi-black/70">
          Tiendas
        </Link>
        <Link href="/restaurantes" className="hover:text-macketi-black/70">
          Restaurantes
        </Link>
        <Link href="/supermercados" className="hover:text-macketi-black/70">
          Supermercados
        </Link>
        <Link href="/farmacias" className="hover:text-macketi-black/70">
          Farmacias
        </Link>
        <Link href="/ofertas" className="text-macketi-red font-semibold hover:text-macketi-red/80">
          Ofertas
        </Link>
        <Link href="/novedades" className="hover:text-macketi-black/70">
          Novedades
        </Link>
        <Link href="/marcas" className="hover:text-macketi-black/70">
          Marcas
        </Link>

        {/* Ayuda (a la derecha) */}
        <div className="ml-auto flex items-center gap-2 hover:text-macketi-black/70 cursor-pointer">
          <Headphones size={18} />
          <span>Ayuda</span>
        </div>
      </div>
    </nav>
  );
}