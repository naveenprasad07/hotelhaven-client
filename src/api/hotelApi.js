import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30_000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.data?.errors?.[0] ||
      err.response?.data?.error ||
      err.message ||
      'Something went wrong';
    return Promise.reject(new Error(msg));
  }
);

/**
 * Convert a FormData object to a plain JSON object.
 * HotelForm builds a FormData (for convenience), but the backend
 * now expects JSON since multer was removed.
 */
function formDataToJson(fd) {
  const obj = {};
  for (const [key, value] of fd.entries()) {
    obj[key] = value;
  }
  return obj;
}

export const hotelApi = {
  getHotels:    (params) => api.get('/hotels', { params }),
  getHotelById: (id)     => api.get(`/hotels/${id}`),

  // Send as JSON — backend uses express.json(), not multer
  createHotel: (fd) => api.post('/hotels', formDataToJson(fd)),
  updateHotel: (id, fd) => api.put(`/hotels/${id}`, formDataToJson(fd)),

  deleteHotel: (id) => api.delete(`/hotels/${id}`),
};

/** Resolve a DB image_url (Cloudinary https:// URL) to display. */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;   // Cloudinary URL — use as-is
  return `${BASE_URL}${imageUrl}`;                    // legacy local path fallback
};

export default api;