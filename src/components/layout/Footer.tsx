import { Truck, ShieldCheck, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const features = [
    { icon: Truck, title: 'Entrega rápida', subtitle: 'Desde solo 1.000 CFA' },
    { icon: ShieldCheck, title: 'Pago al recibir', subtitle: 'Compra con total tranquilidad' },
    { icon: MapPin, title: 'Cobertura en Malabo', subtitle: 'Cada vez más cerca de ti' },
    { icon: Heart, title: 'Miles de productos', subtitle: 'Todo en un solo lugar' },
  ];

  return (
    <footer className="bg-white border-t border-macketi-gray mt-16">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <feature.icon className="text-macketi-yellow-dark" size={28} strokeWidth={2} />
              <div>
                <p className="text-sm font-semibold text-macketi-black">
                  {feature.title}
                </p>
                <p className="text-xs text-gray-500">{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}