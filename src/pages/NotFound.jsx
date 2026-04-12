import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | Hotel Haven</title>
      </Helmet>

      <div className="max-w-xl mx-auto px-4 py-36 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        >
          <p className="font-display text-[9rem] leading-none text-black/8 select-none mb-2">404</p>
          <h1 className="font-display text-3xl mb-3">Page not found</h1>
          <p className="text-black/45 text-sm mb-8 leading-relaxed">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <Link
            to="/"
            className="inline-block bg-black text-white px-8 py-3 rounded-xl font-medium
                       hover:bg-black/80 transition-colors"
          >
            ← Back to Hotels
          </Link>
        </motion.div>
      </div>
    </>
  );
}
