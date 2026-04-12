import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { setFilters, resetFilters } from '../store/hotelSlice';

export default function SearchFilter() {
  const dispatch = useDispatch();
  const { filters, pagination } = useSelector((s) => s.hotels);

  const [localSearch, setLocalSearch] = useState(filters.search);
  const [localMin,    setLocalMin]    = useState(filters.minPrice);
  const [localMax,    setLocalMax]    = useState(filters.maxPrice);

  // Debounce search input → update Redux after 400 ms
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: localSearch, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, dispatch]);

  const applyPrice = () => {
    dispatch(setFilters({ minPrice: localMin, maxPrice: localMax, page: 1 }));
  };

  const handleReset = () => {
    setLocalSearch('');
    setLocalMin('');
    setLocalMax('');
    dispatch(resetFilters());
  };

  const hasActive = filters.search || filters.minPrice || filters.maxPrice;

  return (
    <div className="bg-white rounded-2xl border border-black/[0.07] p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-black/40">
          Filters
        </h2>
        <AnimatePresence>
          {hasActive && (
            <motion.button
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              onClick={handleReset}
              className="text-xs text-black/40 hover:text-red-500 transition-colors underline underline-offset-2"
            >
              Clear all
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-black/50 mb-1.5">Search by name</label>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/25 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="e.g. Grand Palace…"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            aria-label="Search hotels by name"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-black/12
                       text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-medium text-black/50 mb-1.5">Price range / night</label>
        <div className="flex gap-2 items-center mb-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35 text-sm pointer-events-none">$</span>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              aria-label="Minimum price"
              className="w-full pl-6 pr-2 py-2.5 rounded-xl border border-black/12
                         text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
            />
          </div>
          <span className="text-black/25 text-xs flex-shrink-0">—</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35 text-sm pointer-events-none">$</span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              aria-label="Maximum price"
              className="w-full pl-6 pr-2 py-2.5 rounded-xl border border-black/12
                         text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
            />
          </div>
        </div>
        <button
          onClick={applyPrice}
          className="w-full py-2.5 rounded-xl bg-black text-white text-sm font-medium
                     hover:bg-black/80 transition-colors"
        >
          Apply
        </button>
      </div>

      {/* Result count */}
      {pagination.totalCount > 0 && (
        <p className="text-xs text-black/35 text-center border-t border-black/8 pt-4">
          {pagination.totalCount} hotel{pagination.totalCount !== 1 ? 's' : ''} found
        </p>
      )}
    </div>
  );
}
