import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchHotelById, deleteHotel, clearCurrentHotel } from '../store/hotelSlice';
import MapView      from '../components/MapView';
import ConfirmModal from '../components/ConfirmModal';
import { getImageUrl } from '../api/hotelApi';

function Stat({ label, value, mono }) {
  return (
    <div className="bg-[#FFFDF2] rounded-2xl border border-black/[0.07] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-black/35 mb-1">{label}</p>
      <p className={`text-xl font-semibold ${mono ? 'font-mono text-base' : ''}`}>{value}</p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse space-y-6">
      <div className="h-4 bg-stone-200 rounded w-1/4" />
      <div className="aspect-video bg-stone-200 rounded-2xl" />
      <div className="h-9 bg-stone-200 rounded w-1/2" />
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="h-20 bg-stone-100 rounded-2xl" />)}
      </div>
      <div className="h-48 bg-stone-100 rounded-2xl" />
      <div className="h-96 bg-stone-200 rounded-2xl" />
    </div>
  );
}

export default function HotelDetail() {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { currentHotel, detailLoading } = useSelector((s) => s.hotels);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [imgError,    setImgError]      = useState(false);

  useEffect(() => {
    dispatch(fetchHotelById(id));
    return () => dispatch(clearCurrentHotel());
  }, [dispatch, id]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteHotel(id)).unwrap();
      toast.success('Hotel deleted.');
      navigate('/');
    } catch (err) {
      toast.error(`Failed to delete: ${err}`);
      setShowConfirm(false);
    }
  };

  if (detailLoading) return <DetailSkeleton />;

  if (!currentHotel) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="font-display text-3xl mb-3">Hotel not found</h2>
        <p className="text-black/40 mb-6 text-sm">It may have been removed or the link is incorrect.</p>
        <Link to="/" className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-black/80 transition-colors">
          Browse Hotels
        </Link>
      </div>
    );
  }

  const imageUrl = getImageUrl(currentHotel.image_url);
  const formattedDate = new Date(currentHotel.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <>
      <Helmet>
        <title>{currentHotel.title} — Hotel Haven</title>
        <meta name="description" content={currentHotel.description.slice(0, 155)} />
        <meta property="og:title"       content={`${currentHotel.title} — Hotel Haven`} />
        <meta property="og:description" content={currentHotel.description.slice(0, 155)} />
        <meta property="og:type"        content="article" />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-black/40 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-black transition-colors">Hotels</Link>
          <span aria-hidden="true">/</span>
          <span className="text-black font-medium line-clamp-1">{currentHotel.title}</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          {/* ── Hero image ──────────────────────────────────────── */}
          {imageUrl && !imgError && (
            <div className="rounded-2xl overflow-hidden aspect-video border border-black/[0.07]">
              <img
                src={imageUrl}
                alt={`${currentHotel.title} — hotel exterior`}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          )}

          {/* ── Title row ───────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1">
              <h1 className="font-display text-3xl sm:text-4xl leading-tight mb-1">
                {currentHotel.title}
              </h1>
              <p className="text-sm text-black/35">Listed {formattedDate}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Link
                to={`/edit/${id}`}
                className="px-4 py-2 rounded-xl border border-black/15 text-sm font-medium
                           hover:bg-black hover:text-white hover:border-black transition-all"
              >
                Edit
              </Link>
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 rounded-xl border border-red-100 text-red-500 text-sm font-medium
                           hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
              >
                Delete
              </button>
            </div>
          </div>

          {/* ── Stats ───────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Stat label="Price / Night"
              value={`$${parseFloat(currentHotel.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
            <Stat label="Latitude"
              value={parseFloat(currentHotel.latitude).toFixed(6)} mono />
            <Stat label="Longitude"
              value={parseFloat(currentHotel.longitude).toFixed(6)} mono />
          </div>

          {/* ── Description ─────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-black/[0.07] p-6">
            <h2 className="font-display text-xl mb-3">About this property</h2>
            <p className="text-black/65 leading-relaxed text-[15px] whitespace-pre-line">
              {currentHotel.description}
            </p>
          </div>

          {/* ── Map ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-black/[0.07] p-6">
            <h2 className="font-display text-xl mb-4">Location</h2>
            <MapView
              latitude={parseFloat(currentHotel.latitude)}
              longitude={parseFloat(currentHotel.longitude)}
              title={currentHotel.title}
            />
            <p className="text-xs text-black/30 text-center mt-3 font-mono">
              {parseFloat(currentHotel.latitude).toFixed(6)}, {parseFloat(currentHotel.longitude).toFixed(6)}
            </p>
          </div>
        </motion.div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete hotel?"
        message={`"${currentHotel.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Yes, delete"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
