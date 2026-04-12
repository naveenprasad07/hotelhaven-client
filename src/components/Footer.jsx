import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-black/8 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-black/40">
        <div className="flex items-center gap-2">
          <span className="text-base">🏨</span>
          <span className="font-display text-base text-black/60">Hotel <em>Haven</em></span>
        </div>
        <p>© {new Date().getFullYear()} Hotel Haven. Built with React + Node.js.</p>
        <div className="flex gap-4">
          <Link to="/" className="hover:text-black transition-colors">Browse</Link>
          <Link to="/add" className="hover:text-black transition-colors">Add Hotel</Link>
        </div>
      </div>
    </footer>
  );
}
