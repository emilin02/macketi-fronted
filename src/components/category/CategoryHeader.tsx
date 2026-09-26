import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface CategoryHeaderProps {
  categoryName: string;
  parentCategory?: { name: string; slug: string };
  productCount: number;
}

export default function CategoryHeader({
  categoryName,
  parentCategory,
  productCount,
}: CategoryHeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-gray-500 mb-3">
        <Link href="/" className="hover:text-macketi-navy">
          Inicio
        </Link>
        <ChevronRight size={12} />
        {parentCategory && (
          <>
            <Link
              href={`/categorias/${parentCategory.slug}`}
              className="hover:text-macketi-navy"
            >
              {parentCategory.name}
            </Link>
            <ChevronRight size={12} />
          </>
        )}
        <span className="text-macketi-navy font-medium">{categoryName}</span>
      </nav>

      {/* Título + contador */}
      <div className="flex items-end justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold text-macketi-navy">
          {categoryName}
        </h1>
        <p className="text-sm text-gray-500">
          {productCount} {productCount === 1 ? 'producto' : 'productos'}
        </p>
      </div>
    </div>
  );
}