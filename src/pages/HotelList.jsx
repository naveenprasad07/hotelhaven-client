import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { fetchHotels, deleteHotel, setFilters } from '../store/hotelSlice';
import HotelCard    from '../components/HotelCard';
import SkeletonCard from '../components/SkeletonCard';
import SearchFilter from '../components/SearchFilter';
import Pagination   from '../components/Pagination';

export default function HotelList() {
  const dispatch = useDispatch();
  const { list, loading, pagination, filters } = useSelector((s) => s.hotels);

  // Re-fetch whenever filters change
  useEffect(() => {
    dispatch(fetchHotels({
      search:   filters.search   || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      page:     filters.page,
      limit:    9,
    }));
  }, [dispatch, filters.search, filters.minPrice, filters.maxPrice, filters.page]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteHotel(id)).unwrap();
      toast.success('Hotel deleted successfully.');
      // If we just emptied the last card on a page > 1, go back one page
      if (list.length === 1 && filters.page > 1) {
        dispatch(setFilters({ page: filters.page - 1 }));
      }
    } catch (err) {
      toast.error(`Could not delete hotel: ${err}`);
    }
  };

  const handlePageChange = (page) => {
    dispatch(setFilters({ page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Hotel Haven — Find Your Perfect Stay</title>
        <meta name="description"
          content="Browse our curated collection of premium hotels worldwide. Search by name, filter by price, and book your next stay." />
        <meta property="og:title"       content="Hotel Haven — Browse Hotels" />
        <meta property="og:description" content="Find your perfect hotel with Hotel Haven." />
        <meta property="og:type"        content="website" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Hero ────────────────────────────────────────────── */}
        <motion.header
          className="mb-10"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display text-4xl sm:text-5xl mb-2">
            Find your perfect <em>stay</em>
          </h1>
          <p className="text-black/45 text-lg">
            {loading
              ? 'Searching hotels…'
              : pagination.totalCount > 0
                ? `${pagination.totalCount.toLocaleString()} hotel${pagination.totalCount !== 1 ? 's' : ''} available`
                : 'Discover our collection of premium properties'}
          </p>
        </motion.header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Sidebar ──────────────────────────────────────── */}
          <aside className="lg:w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-20">
              <SearchFilter />
            </div>
          </aside>

          {/* ── Grid ─────────────────────────────────────────── */}
          <section className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : list.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <AnimatePresence mode="popLayout">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {list.map((hotel, i) => (
                      <motion.div
                        key={hotel.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                      >
                        <HotelCard hotel={hotel} onDelete={handleDelete} />
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>

                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-28 text-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <div className="w-20 h-20 bg-black/5 rounded-3xl flex items-center justify-center mb-5 text-4xl">
        🏨
      </div>
      <h2 className="font-display text-2xl mb-2">No hotels found</h2>
      <p className="text-black/40 text-sm max-w-xs mb-7 leading-relaxed">
        Try adjusting your search or filters, or add the first hotel to the collection.
      </p>
      <Link
        to="/add"
        className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium
                   hover:bg-black/80 transition-colors"
      >
        + Add First Hotel
      </Link>
    </motion.div>
  );
}
