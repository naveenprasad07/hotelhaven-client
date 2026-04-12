import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hotelApi } from '../api/hotelApi';

// ─── ASYNC THUNKS ─────────────────────────────────────────────────────────────

export const fetchHotels = createAsyncThunk(
  'hotels/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await hotelApi.getHotels(params);
      return res.data;
    } catch (e) { return rejectWithValue(e.message); }
  }
);

export const fetchHotelById = createAsyncThunk(
  'hotels/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await hotelApi.getHotelById(id);
      return res.data;
    } catch (e) { return rejectWithValue(e.message); }
  }
);

export const createHotel = createAsyncThunk(
  'hotels/create',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await hotelApi.createHotel(formData);
      return res.data;
    } catch (e) { return rejectWithValue(e.message); }
  }
);

export const updateHotel = createAsyncThunk(
  'hotels/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await hotelApi.updateHotel(id, formData);
      return res.data;
    } catch (e) { return rejectWithValue(e.message); }
  }
);

export const deleteHotel = createAsyncThunk(
  'hotels/delete',
  async (id, { rejectWithValue }) => {
    try {
      await hotelApi.deleteHotel(id);
      return id;
    } catch (e) { return rejectWithValue(e.message); }
  }
);

// ─── SLICE ────────────────────────────────────────────────────────────────────

const hotelSlice = createSlice({
  name: 'hotels',
  initialState: {
    list: [],
    currentHotel: null,
    pagination: { currentPage: 1, totalPages: 1, totalCount: 0, limit: 9, hasNext: false, hasPrev: false },
    filters: { search: '', minPrice: '', maxPrice: '', page: 1 },
    loading: false,
    detailLoading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    setFilters: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload };
    },
    resetFilters: (state) => {
      state.filters = { search: '', minPrice: '', maxPrice: '', page: 1 };
    },
    clearCurrentHotel: (state) => { state.currentHotel = null; },
    clearError:        (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // fetchHotels
    builder
      .addCase(fetchHotels.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchHotels.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list = payload.hotels;
        s.pagination = payload.pagination;
      })
      .addCase(fetchHotels.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; });

    // fetchHotelById
    builder
      .addCase(fetchHotelById.pending,   (s) => { s.detailLoading = true; s.currentHotel = null; s.error = null; })
      .addCase(fetchHotelById.fulfilled, (s, { payload }) => { s.detailLoading = false; s.currentHotel = payload; })
      .addCase(fetchHotelById.rejected,  (s, { payload }) => { s.detailLoading = false; s.error = payload; });

    // createHotel
    builder
      .addCase(createHotel.pending,   (s) => { s.submitting = true; s.error = null; })
      .addCase(createHotel.fulfilled, (s) => { s.submitting = false; })
      .addCase(createHotel.rejected,  (s, { payload }) => { s.submitting = false; s.error = payload; });

    // updateHotel
    builder
      .addCase(updateHotel.pending,   (s) => { s.submitting = true; s.error = null; })
      .addCase(updateHotel.fulfilled, (s, { payload }) => { s.submitting = false; s.currentHotel = payload.hotel; })
      .addCase(updateHotel.rejected,  (s, { payload }) => { s.submitting = false; s.error = payload; });

    // deleteHotel
    builder
      .addCase(deleteHotel.pending,   (s) => { s.loading = true; })
      .addCase(deleteHotel.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list = s.list.filter((h) => h.id !== payload);
        s.pagination.totalCount = Math.max(0, s.pagination.totalCount - 1);
      })
      .addCase(deleteHotel.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; });
  },
});

export const { setFilters, resetFilters, clearCurrentHotel, clearError } = hotelSlice.actions;
export default hotelSlice.reducer;
