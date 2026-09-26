'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CategoryFiltersProps {
  onPriceChange?: (min: number, max: number) => void;
  onBrandChange?: (brands: number[]) => void;
  availableBrands?: Array<{ id: number; name: string }>;
}

export default function CategoryFilters({
  onPriceChange,
  onBrandChange,
  availableBrands = [],
}: CategoryFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [openSections, setOpenSections] = useState({
    price: true,
    brand: true,
  });

  const toggleSection = (section: 'price' | 'brand') => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    onPriceChange?.(min, max);
  };

  const handleBrandToggle = (brandId: number) => {
    const newSelection = selectedBrands.includes(brandId)
      ? selectedBrands.filter((id) => id !== brandId)
      : [...selectedBrands, brandId];
    setSelectedBrands(newSelection);
    onBrandChange?.(newSelection);
  };

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="bg-white border border-macketi-gray rounded-2xl p-5 sticky top-4">
        <h2 className="font-bold text-macketi-navy mb-4">Filtros</h2>

        {/* Filtro de precio */}
        <div className="border-b border-macketi-gray pb-4 mb-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full font-semibold text-sm text-macketi-navy mb-3"
          >
            <span>Precio</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${openSections.price ? 'rotate-180' : ''}`}
            />
          </button>
          {openSections.price && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
                  className="w-full px-3 py-2 border border-macketi-gray rounded-lg text-sm focus:outline-none focus:border-macketi-yellow"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                  className="w-full px-3 py-2 border border-macketi-gray rounded-lg text-sm focus:outline-none focus:border-macketi-yellow"
                />
              </div>
              <p className="text-xs text-gray-500">
                {priceRange[0].toLocaleString('es-ES')} - {priceRange[1].toLocaleString('es-ES')} CFA
              </p>
            </div>
          )}
        </div>

        {/* Filtro de marca */}
        {availableBrands.length > 0 && (
          <div className="border-b border-macketi-gray pb-4 mb-4">
            <button
              onClick={() => toggleSection('brand')}
              className="flex items-center justify-between w-full font-semibold text-sm text-macketi-navy mb-3"
            >
              <span>Marca</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${openSections.brand ? 'rotate-180' : ''}`}
              />
            </button>
            {openSections.brand && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableBrands.map((brand) => (
                  <label
                    key={brand.id}
                    className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-macketi-navy"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => handleBrandToggle(brand.id)}
                      className="accent-macketi-yellow"
                    />
                    <span>{brand.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}