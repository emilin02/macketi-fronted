'use client';

import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
}

export default function QuantitySelector({
  value,
  onChange,
  max = 99,
  min = 1,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (value > min) onChange(value - 1);
  };

  const increase = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        className="w-10 h-10 flex items-center justify-center border border-macketi-gray rounded-lg hover:bg-macketi-gray-light disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Reducir cantidad"
      >
        <Minus size={16} />
      </button>
      <span className="w-12 text-center font-semibold text-macketi-navy">
        {value}
      </span>
      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center border border-macketi-gray rounded-lg hover:bg-macketi-gray-light disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Aumentar cantidad"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}