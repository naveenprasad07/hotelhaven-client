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

export const hotelApi = {
  getHotels:    (params)        => api.get('/hotels', { params }),
  getHotelById: (id)            => api.get(`/hotels/${id}`),
  createHotel:  (fd)            => api.post('/hotels', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateHotel:  (id, fd)        => api.put(`/hotels/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteHotel:  (id)            => api.delete(`/hotels/${id}`),
};

/** Resolve a DB image_url (e.g. "/uploads/hotel-123.jpg") to a full URL. */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${BASE_URL}${imageUrl}`;
};

export default api;
