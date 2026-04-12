import { motion } from 'framer-motion';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Build page list with ellipsis
  const getPages = () => {
    const delta = 1;
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    const pages = [1];
    if (range[0] > 2) pages.push('…');
    pages.push(...range);
    if (range[range.length - 1] < totalPages - 1) pages.push('…');
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  return (
    <nav
      className="flex items-center justify-center gap-1.5 mt-12"
      aria-label="Pagination"
    >
      {/* Prev */}
      <PagBtn
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ← Prev
      </PagBtn>

      {/* Pages */}
      {getPages().map((page, i) =>
        page === '…' ? (
          <span key={`ell-${i}`} className="px-1 text-black/30 text-sm select-none">…</span>
        ) : (
          <motion.button
            key={page}
            onClick={() => onPageChange(page)}
            whileTap={{ scale: 0.92 }}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
              currentPage === page
                ? 'bg-black text-white shadow-sm'
                : 'border border-black/12 hover:bg-black/5 text-black'
            }`}
          >
            {page}
          </motion.button>
        )
      )}

      {/* Next */}
      <PagBtn
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next →
      </PagBtn>
    </nav>
  );
}

function PagBtn({ children, disabled, onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3.5 h-10 rounded-xl border border-black/12 text-sm font-medium
                 hover:bg-black hover:text-white hover:border-black transition-all
                 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
                 disabled:hover:text-black disabled:hover:border-black/12"
      {...props}
    >
      {children}
    </button>
  );
}
