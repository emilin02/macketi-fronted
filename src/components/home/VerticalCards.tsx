import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

const verticals = [
  {
    id: 'tiendas',
    name: 'Tiendas',
    description: 'Tecnología, moda y más',
    href: '/tiendas',
    icon: '/verticales/tiendas.png',
    bgColor: 'bg-vertical-tiendas',
  },
  {
    id: 'restaurantes',
    name: 'Restaurantes',
    description: 'Tu comida favorita',
    href: '/restaurantes',
    icon: '/verticales/restaurantes.png',
    bgColor: 'bg-vertical-restaurantes',
  },
  {
    id: 'supermercados',
    name: 'Supermercados',
    description: 'Todo para tu hogar',
    href: '/supermercados',
    icon: '/verticales/supermercados.png',
    bgColor: 'bg-vertical-supermercados',
  },
  {
    id: 'farmacias',
    name: 'Farmacias',
    description: 'Tu salud, nuestra prioridad',
    href: '/farmacias',
    icon: '/verticales/farmacias.png',
    bgColor: 'bg-vertical-farmacias',
  },
];

export default function VerticalCards() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 mt-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {verticals.map((vertical) => (
          <Link
            key={vertical.id}
            href={vertical.href}
            className={`${vertical.bgColor} rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-shadow group`}
          >
            {/* Icono a la izquierda */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative w-14 h-14 flex-shrink-0">
                <Image
                  src={vertical.icon}
                  alt={vertical.name}
                  fill
                  className="object-contain"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-macketi-black truncate">
                  {vertical.name}
                </h3>
                <p className="text-xs text-gray-600 truncate">
                  {vertical.description}
                </p>
              </div>
            </div>

            {/* Flecha a la derecha */}
            <ChevronRight
              size={20}
              className="text-macketi-black flex-shrink-0 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}