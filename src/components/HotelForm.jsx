import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../api/hotelApi';

const FIELD_CONFIG = [
  { name: 'title',       label: 'Hotel Name',           type: 'text',     placeholder: 'e.g. Grand Celestial Resort', hint: 'min. 3 characters' },
  { name: 'description', label: 'Description',           type: 'textarea', placeholder: 'Describe the hotel, amenities, unique features…', hint: 'min. 10 characters' },
  { name: 'latitude',    label: 'Latitude',              type: 'number',   placeholder: '48.8566',  hint: '-90 to 90' },
  { name: 'longitude',   label: 'Longitude',             type: 'number',   placeholder: '2.3522',   hint: '-180 to 180' },
  { name: 'price',       label: 'Price per Night (USD)', type: 'number',   placeholder: '299.00',   hint: 'USD, ≥ 0', prefix: '$' },
];

function validate(form) {
  const e = {};
  if (!form.title.trim() || form.title.trim().length < 3)
    e.title = 'Title must be at least 3 characters.';
  if (!form.description.trim() || form.description.trim().length < 10)
    e.description = 'Description must be at least 10 characters.';
  const lat = parseFloat(form.latitude);
  if (!form.latitude || isNaN(lat) || lat < -90 || lat > 90)
    e.latitude = 'Must be between −90 and 90.';
  const lng = parseFloat(form.longitude);
  if (!form.longitude || isNaN(lng) || lng < -180 || lng > 180)
    e.longitude = 'Must be between −180 and 180.';
  const p = parseFloat(form.price);
  if (!form.price || isNaN(p) || p < 0)
    e.price = 'Must be a non-negative number.';
  return e;
}

export default function HotelForm({ initialData, onSubmit, isLoading, submitLabel = 'Save Hotel' }) {
  const [form, setForm]       = useState({ title: '', description: '', latitude: '', longitude: '', price: '' });
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors]   = useState({});
  const [dragOver, setDragOver]           = useState(false);
  const [uploading, setUploading]         = useState(false); // tracks Cloudinary upload separately
  const fileRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        title:       initialData.title       || '',
        description: initialData.description || '',
        latitude:    initialData.latitude    || '',
        longitude:   initialData.longitude   || '',
        price:       initialData.price       || '',
      });
      if (initialData.image_url) setPreview(getImageUrl(initialData.image_url));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((p) => ({ ...p, image: 'Please select a valid image file (JPEG, PNG, WebP, GIF).' }));
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setErrors((p) => ({ ...p, image: 'Image must be smaller than 20 MB.' }));
      return;
    }
    setImage(file);
    setErrors((p) => ({ ...p, image: null }));
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    // Upload image directly to Cloudinary from the browser
    if (image) {
      const cloudName   = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      // Guard: if env vars are missing, stop and show a clear error
      if (!cloudName || !uploadPreset) {
        setErrors((p) => ({ ...p, image: 'Cloudinary is not configured. Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET env vars.' }));
        return;
      }

      try {
        setUploading(true);
        const cloudData = new FormData();
        cloudData.append('file', image);
        cloudData.append('upload_preset', uploadPreset);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: cloudData }
        );

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.error?.message || `Cloudinary error ${res.status}`);
        }

        const data = await res.json();

        if (!data.secure_url) throw new Error('No URL returned from Cloudinary.');

        fd.append('image_url', data.secure_url); // send full Cloudinary URL to backend
      } catch (err) {
        setErrors((p) => ({ ...p, image: `Image upload failed: ${err.message}` }));
        setUploading(false);
        return; // stop — don't submit with a broken image
      } finally {
        setUploading(false);
      }
    }

    onSubmit(fd);
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const isBusy = isLoading || uploading;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* ── Image Upload ───────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium mb-2">Hotel Image</label>

        {preview ? (
          <div className="relative rounded-2xl overflow-hidden border border-black/10 group" style={{ paddingBottom: '56.25%' }}>
            <img
              src={preview}
              alt="Hotel image preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button type="button" onClick={() => fileRef.current?.click()}
                className="bg-white text-black text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                Replace
              </button>
              <button type="button" onClick={removeImage}
                className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-red-600 transition-colors">
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
            aria-label="Upload hotel image"
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors
              ${dragOver ? 'border-black bg-black/4' : 'border-black/15 hover:border-black/35'}`}
          >
            <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-black/35" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-black/55">
              Drop image here or <span className="text-black underline">browse</span>
            </p>
            <p className="text-xs text-black/30 mt-1">JPEG · PNG · WebP · GIF — max 20 MB</p>
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => processFile(e.target.files[0])} aria-hidden="true" />
        {errors.image && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠ {errors.image}</p>}
      </div>

      {/* ── Text Fields ─────────────────────────────────────────── */}
      {FIELD_CONFIG.map(({ name, label, type, placeholder, hint, prefix }) => (
        <div key={name}>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor={name} className="text-sm font-medium">{label} <span className="text-red-400">*</span></label>
            {hint && <span className="text-xs text-black/30">{hint}</span>}
          </div>

          {type === 'textarea' ? (
            <>
              <textarea
                id={name} name={name} rows={4}
                value={form[name]} onChange={handleChange}
                placeholder={placeholder}
                aria-describedby={errors[name] ? `${name}-err` : undefined}
                className={`w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none transition-colors
                  ${errors[name] ? 'border-red-400 bg-red-50/30' : 'border-black/12 focus:border-black'}`}
              />
              <div className="flex justify-between mt-1">
                {errors[name]
                  ? <p id={`${name}-err`} className="text-red-500 text-xs">⚠ {errors[name]}</p>
                  : <span />}
                <span className="text-xs text-black/25">{form[name].length}</span>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                {prefix && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 text-sm pointer-events-none">
                    {prefix}
                  </span>
                )}
                <input
                  id={name} name={name} type={type}
                  step={type === 'number' ? 'any' : undefined}
                  value={form[name]} onChange={handleChange}
                  placeholder={placeholder}
                  aria-describedby={errors[name] ? `${name}-err` : undefined}
                  className={`w-full py-3 rounded-xl border text-sm focus:outline-none transition-colors
                    ${prefix ? 'pl-8 pr-4' : 'px-4'}
                    ${errors[name] ? 'border-red-400 bg-red-50/30' : 'border-black/12 focus:border-black'}`}
                />
              </div>
              {errors[name] && <p id={`${name}-err`} className="text-red-500 text-xs mt-1.5">⚠ {errors[name]}</p>}
            </>
          )}
        </div>
      ))}

      {/* ── Submit ──────────────────────────────────────────────── */}
      <motion.button
        type="submit"
        disabled={isBusy}
        whileHover={!isBusy ? { scale: 1.01 } : undefined}
        whileTap={!isBusy  ? { scale: 0.98 } : undefined}
        className="w-full py-3.5 bg-black text-white rounded-xl font-medium text-sm
                   hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Uploading image…
          </>
        ) : isLoading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Saving…
          </>
        ) : submitLabel}
      </motion.button>
    </form>
  );
}