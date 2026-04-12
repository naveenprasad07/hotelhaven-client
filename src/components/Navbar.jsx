import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  const navLink = (to, label) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={`text-sm font-medium transition-colors ${
          active ? 'text-black' : 'text-black/50 hover:text-black'
        }`}
      >
        {label}
        {active && (
          <motion.div
            layoutId="navUnderline"
            className="h-0.5 bg-black mt-0.5 rounded-full"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FFFDF2]/90 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.08)]'
          : 'bg-[#FFFDF2]'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center text-white text-base group-hover:scale-105 transition-transform select-none">
            🏨
          </div>
          <span className="font-display text-xl font-normal tracking-tight">
            Hotel <span className="italic">Haven</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-8">
          {navLink('/', 'Browse')}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/add"
              className="flex items-center gap-1.5 bg-black text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-black/80 transition-colors"
            >
              <span className="text-base leading-none">+</span> Add Hotel
            </Link>
          </motion.div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 -mr-2 rounded-lg hover:bg-black/5 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="block w-5 h-px bg-black transition-all duration-200"
            style={{ transform: menuOpen ? 'rotate(45deg) translate(0, 6px)' : 'none' }} />
          <span className="block w-5 h-px bg-black mt-1.5 transition-all duration-200"
            style={{ opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-5 h-px bg-black mt-1.5 transition-all duration-200"
            style={{ transform: menuOpen ? 'rotate(-45deg) translate(0, -6px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden overflow-hidden border-t border-black/8"
          >
            <div className="px-4 py-4 space-y-3 bg-[#FFFDF2]">
              <Link to="/" className="block text-sm font-medium py-2 text-black/70 hover:text-black">
                Browse Hotels
              </Link>
              <Link
                to="/add"
                className="block bg-black text-white text-sm font-medium py-2.5 rounded-xl text-center hover:bg-black/80 transition-colors"
              >
                + Add Hotel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
