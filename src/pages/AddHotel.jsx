import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createHotel } from '../store/hotelSlice';
import HotelForm from '../components/HotelForm';

export default function AddHotel() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { submitting } = useSelector((s) => s.hotels);

  const handleSubmit = async (formData) => {
    try {
      await dispatch(createHotel(formData)).unwrap();
      toast.success('Hotel added successfully! 🏨');
      navigate('/');
    } catch (err) {
      toast.error(`Failed to add hotel: ${err}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Hotel — Hotel Haven</title>
        <meta name="description" content="Add a new hotel listing to Hotel Haven." />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-black/40 mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-black transition-colors">Hotels</Link>
          <span aria-hidden="true">/</span>
          <span className="text-black font-medium">Add New</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="font-display text-3xl sm:text-4xl mb-1">Add a new hotel</h1>
          <p className="text-black/45 mb-8">Fill in the details below to list your property.</p>

          <div className="bg-white rounded-2xl border border-black/[0.07] p-6 sm:p-8 shadow-card">
            <HotelForm
              onSubmit={handleSubmit}
              isLoading={submitting}
              submitLabel="Add Hotel"
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}
