import Image from 'next/image';
import Link from 'next/link';
import { Truck, ShieldCheck, MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 mt-4">
      <div className="relative bg-macketi-yellow rounded-3xl overflow-hidden min-h-[320px] md:min-h-[400px]">
        {/* Imagen de fondo: ocupa todo el hero */}
        <Image
          src="/herobanner.png"
          alt="Repartidor Macketi en moto"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Overlay con el contenido (texto) a la izquierda */}
        <div className="relative z-10 grid md:grid-cols-2 items-center gap-4 px-8 md:px-16 py-8 md:py-10 min-h-[320px] md:min-h-[400px]">
          {/* Columna izquierda: texto */}
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-macketi-navy leading-tight">
              La ciudad
              <br />
              en tus manos
            </h1>
            <p className="mt-4 text-lg md:text-xl font-medium text-macketi-navy/80">
              Compra hoy. Recibe en casa.
            </p>

            {/* 3 features */}
            <div className="mt-6 flex flex-wrap gap-4 md:gap-6">
              <div className="flex items-center gap-2">
                <Truck size={22} className="text-macketi-navy" />
                <div className="text-xs md:text-sm leading-tight">
                  <p className="font-bold text-macketi-navy">Rápido</p>
                  <p className="text-macketi-navy/70">y seguro</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={22} className="text-macketi-navy" />
                <div className="text-xs md:text-sm leading-tight">
                  <p className="font-bold text-macketi-navy">Pago al</p>
                  <p className="text-macketi-navy/70">recibir</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={22} className="text-macketi-navy" />
                <div className="text-xs md:text-sm leading-tight">
                  <p className="font-bold text-macketi-navy">Cerca de ti</p>
                  <p className="text-macketi-navy/70">en Malabo</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 mt-8 bg-macketi-black text-white px-6 py-3 rounded-full font-semibold hover:bg-macketi-black/90 transition"
            >
              Explorar ahora
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Columna derecha: vacía, porque la imagen ya llena ese espacio */}
          <div className="hidden md:block" />
        </div>

        {/* Flechas del carrusel */}
        <button className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full w-10 h-10 items-center justify-center shadow-md hover:bg-gray-50">
          <ChevronLeft size={20} className="text-macketi-navy" />
        </button>
        <button className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full w-10 h-10 items-center justify-center shadow-md hover:bg-gray-50">
          <ChevronRight size={20} className="text-macketi-navy" />
        </button>

        {/* Indicadores (3 puntos) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          <span className="w-2 h-2 rounded-full bg-macketi-navy" />
          <span className="w-2 h-2 rounded-full bg-macketi-navy/30" />
          <span className="w-2 h-2 rounded-full bg-macketi-navy/30" />
        </div>
      </div>
    </section>
  );
}