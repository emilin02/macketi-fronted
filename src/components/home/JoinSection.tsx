import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const registrations = [
  {
    id: 'supermercado',
    title: 'Registra tu supermercado',
    description:
      'Conéctate con miles de compradores y gestiona tus pedidos de forma automática.',
    href: '/registro-supermercado',
    image: '/registro/supermercadov1.png',
  },
  {
    id: 'restaurante',
    title: 'Registra tu restaurante',
    description:
      'Empieza a recibir pedidos sin comisiones exageradas y sin complicarte la vida.',
    href: '/registro-restaurante',
    image: '/registro/restaurantev1.png',
  },
  {
    id: 'farmacia',
    title: 'Registra tu farmacia',
    description:
      'Gestiona tu inventario, vende más y ofrece recogida y entrega a domicilio.',
    href: '/registro-farmacia',
    image: '/registro/farmaciav1.png',
  },
  {
    id: 'tienda',
    title: 'Registra tu tienda',
    description:
      'Gestiona tu inventario, vende más y ofrece recogida y entrega a domicilio.',
    href: '/registro-tienda',
    image: '/registro/tiendav1.png',
  },
];

export default function JoinSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 mt-12">
      <div className="bg-macketi-blue rounded-3xl p-6 md:p-10">
        <div className="grid md:grid-cols-[1fr_2fr] gap-8 items-start">
          {/* Columna izquierda: CTA */}
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-macketi-black leading-tight mb-4">
              Únete a Macketi
            </h2>
            <p className="text-lg font-semibold text-macketi-black mb-3">
              Haz crecer tu negocio con nosotros
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Miles de clientes en Malabo te esperan. Registra tu negocio en
              pocos minutos y empieza a vender hoy.
            </p>
            <Link
              href="/registro-vendedor"
              className="inline-flex items-center gap-2 bg-macketi-black text-white px-6 py-3 rounded-full font-semibold hover:bg-macketi-black/90 transition-colors"
            >
              <span>Quiero registrarme</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Columna derecha: 4 tarjetas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {registrations.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden flex flex-col"
              >
                {/* Imagen */}
                <div className="relative w-full h-56">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Contenido */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-macketi-black text-sm mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex items-center justify-center gap-1 bg-macketi-blue hover:bg-macketi-yellow text-macketi-black text-xs font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    <span>Registrarme</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}