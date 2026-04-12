import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchHotelById, updateHotel } from '../store/hotelSlice';
import HotelForm from '../components/HotelForm';

function EditSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-pulse space-y-6">
      <div className="h-4 bg-stone-200 rounded w-1/3" />
      <div className="h-9 bg-stone-200 rounded w-2/3" />
      <div className="bg-white rounded-2xl border border-black/[0.07] p-8 space-y-5">
        <div className="aspect-video bg-stone-100 rounded-xl" />
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-stone-100 rounded-xl" />)}
      </div>
    </div>
  );
}

export default function EditHotel() {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { currentHotel, detailLoading, submitting } = useSelector((s) => s.hotels);

  useEffect(() => { dispatch(fetchHotelById(id)); }, [dispatch, id]);

  const handleSubmit = async (formData) => {
    try {
      await dispatch(updateHotel({ id, formData })).unwrap();
      toast.success('Hotel updated successfully! ✨');
      navigate(`/hotel/${id}`);
    } catch (err) {
      toast.error(`Failed to update: ${err}`);
    }
  };

  if (detailLoading) return <EditSkeleton />;

  if (!currentHotel) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-2xl mb-3">Hotel not found</h2>
        <Link to="/" className="text-sm text-black/50 hover:text-black underline transition-colors">
          ← Back to hotels
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit {currentHotel.title} — Hotel Haven</title>
        <meta name="description" content={`Edit ${currentHotel.title} on Hotel Haven.`} />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-black/40 mb-8 flex-wrap" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-black transition-colors">Hotels</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/hotel/${id}`} className="hover:text-black transition-colors max-w-[180px] truncate">
            {currentHotel.title}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-black font-medium">Edit</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="font-display text-3xl sm:text-4xl mb-1">Edit hotel</h1>
          <p className="text-black/45 mb-8">
            Updating <strong className="text-black font-semibold">{currentHotel.title}</strong>
          </p>

          <div className="bg-white rounded-2xl border border-black/[0.07] p-6 sm:p-8 shadow-card">
            <HotelForm
              initialData={currentHotel}
              onSubmit={handleSubmit}
              isLoading={submitting}
              submitLabel="Save Changes"
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}
