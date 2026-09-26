'use client';

import type { WooVariation } from '@/types/woocommerce';

interface VariantSelectorProps {
  variations: WooVariation[];
  selectedAttributes: Record<string, string>;
  onAttributeChange: (attributeName: string, value: string) => void;
}

export default function VariantSelector({
  variations,
  selectedAttributes,
  onAttributeChange,
}: VariantSelectorProps) {
  // Extraer todos los atributos disponibles y sus valores únicos
  const attributesMap = new Map<string, Set<string>>();

  variations.forEach((variation) => {
    variation.attributes.forEach((attr) => {
      if (!attributesMap.has(attr.name)) {
        attributesMap.set(attr.name, new Set());
      }
      attributesMap.get(attr.name)!.add(attr.option);
    });
  });

  if (attributesMap.size === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {Array.from(attributesMap.entries()).map(([attrName, options]) => (
        <div key={attrName}>
          <p className="text-sm font-semibold text-macketi-navy mb-2 capitalize">
            {attrName}
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from(options).map((option) => {
              const isSelected = selectedAttributes[attrName] === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onAttributeChange(attrName, option)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-macketi-yellow border-macketi-yellow text-macketi-navy font-semibold'
                      : 'border-macketi-gray hover:border-macketi-navy text-macketi-navy'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}