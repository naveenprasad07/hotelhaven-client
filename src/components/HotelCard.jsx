import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl } from '../api/hotelApi';
import ConfirmModal from './ConfirmModal';

const PlaceholderImage = ({ title }) => (
  <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex flex-col items-center justify-center gap-2">
    <span className="text-4xl">🏨</span>
    <span className="text-xs text-black/30 font-medium px-4 text-center line-clamp-1">{title}</span>
  </div>
);

export default function HotelCard({ hotel, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [imgError, setImgError]       = useState(false);
  const imageUrl = getImageUrl(hotel.image_url);

  return (
    <>
      <motion.article
        className="hotel-card bg-white rounded-2xl overflow-hidden border border-black/[0.07] flex flex-col"
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
      >
        {/* ── Image ─────────────────────────────────────────────── */}
        <Link
          to={`/hotel/${hotel.id}`}
          className="block relative overflow-hidden"
          style={{ paddingBottom: '66%' }}
          aria-label={`View details for ${hotel.title}`}
        >
          <div className="absolute inset-0">
            {imageUrl && !imgError ? (
              <img
                src={imageUrl}
                alt={`${hotel.title} hotel exterior`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <PlaceholderImage title={hotel.title} />
            )}
          </div>

          {/* Price badge */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide">
            ${parseFloat(hotel.price).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            <span className="text-white/60 font-normal"> /night</span>
          </div>
        </Link>

        {/* ── Body ──────────────────────────────────────────────── */}
        <div className="p-4 flex flex-col flex-1">
          <Link to={`/hotel/${hotel.id}`} className="group/title">
            <h3 className="font-display text-lg leading-snug mb-1 group-hover/title:underline line-clamp-1">
              {hotel.title}
            </h3>
          </Link>

          {/* Coordinates pill */}
          <p className="flex items-center gap-1 text-[11px] text-black/35 mb-2.5 font-mono">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <circle cx="12" cy="11" r="3" strokeWidth={2} />
            </svg>
            {parseFloat(hotel.latitude).toFixed(4)}, {parseFloat(hotel.longitude).toFixed(4)}
          </p>

          <p className="text-sm text-black/55 line-clamp-2 leading-relaxed flex-1 mb-4">
            {hotel.description}
          </p>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <Link
              to={`/edit/${hotel.id}`}
              className="flex-1 text-center py-2 rounded-xl border border-black/15 text-sm font-medium
                         hover:bg-black hover:text-white hover:border-black transition-all duration-150"
            >
              Edit
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              className="flex-1 py-2 rounded-xl border border-red-100 text-red-500 text-sm font-medium
                         hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-150"
            >
              Delete
            </button>
          </div>
        </div>
      </motion.article>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete hotel?"
        message={`"${hotel.title}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Yes, delete"
        onConfirm={() => { onDelete(hotel.id); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
