'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { WooImage } from '@/types/woocommerce';

interface ProductGalleryProps {
  images: WooImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-macketi-gray-light rounded-2xl flex items-center justify-center">
        <span className="text-gray-400 text-sm">Sin imagen</span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-square bg-macketi-gray-light rounded-2xl overflow-hidden">
        <Image
          src={selectedImage.src}
          alt={selectedImage.alt || productName}
          fill
          priority
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                index === selectedIndex
                  ? 'border-macketi-yellow'
                  : 'border-transparent hover:border-macketi-gray'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt || `${productName} - imagen ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}