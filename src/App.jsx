import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HotelList   from './pages/HotelList';
import AddHotel    from './pages/AddHotel';
import EditHotel   from './pages/EditHotel';
import HotelDetail from './pages/HotelDetail';
import NotFound    from './pages/NotFound';

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFDF2' }}>
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/"          element={<HotelList />} />
            <Route path="/add"       element={<AddHotel />} />
            <Route path="/edit/:id"  element={<EditHotel />} />
            <Route path="/hotel/:id" element={<HotelDetail />} />
            <Route path="*"          element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
