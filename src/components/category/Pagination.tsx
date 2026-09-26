import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Anterior */}
      {currentPage > 1 && (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-macketi-gray hover:bg-macketi-yellow transition-colors"
        >
          <ChevronLeft size={18} className="text-macketi-navy" />
        </Link>
      )}

      {/* Primera página + elipsis */}
      {start > 1 && (
        <>
          <Link
            href={`${baseUrl}?page=1`}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-macketi-gray hover:bg-macketi-yellow transition-colors text-sm font-medium"
          >
            1
          </Link>
          {start > 2 && <span className="text-gray-400">...</span>}
        </>
      )}

      {/* Páginas visibles */}
      {pages.map((page) => (
        <Link
          key={page}
          href={`${baseUrl}?page=${page}`}
          className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            page === currentPage
              ? 'bg-macketi-navy text-white'
              : 'border border-macketi-gray hover:bg-macketi-yellow text-macketi-navy'
          }`}
        >
          {page}
        </Link>
      ))}

      {/* Última página + elipsis */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-gray-400">...</span>}
          <Link
            href={`${baseUrl}?page=${totalPages}`}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-macketi-gray hover:bg-macketi-yellow transition-colors text-sm font-medium"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Siguiente */}
      {currentPage < totalPages && (
        <Link
          href={`${baseUrl}?page=${currentPage + 1}`}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-macketi-gray hover:bg-macketi-yellow transition-colors"
        >
          <ChevronRight size={18} className="text-macketi-navy" />
        </Link>
      )}
    </div>
  );
}