/**
 * staffSlice.js
 * Handles all staff CRUD operations
 * State is fully self-contained — no dependency on any component
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../SERVICES/axiosInstance";

const BASE = "/admin/staff";

// ─── THUNKS ───────────────────────────────────────────────────────────────────

export const fetchAllStaff = createAsyncThunk(
  "staff/fetchAll",
  async ({ page = 1, limit = 20, search = "", role = "" } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(BASE, {
        params: { page, limit, search, role },
      });
      return data.data; // { staff, pagination }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch staff");
    }
  }
);

export const fetchAdminProfile = createAsyncThunk(
  "staff/fetchAdminProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`${BASE}/profile/me`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);

export const createStaff = createAsyncThunk(
  "staff/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(BASE, payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create staff");
    }
  }
);

export const updateStaff = createAsyncThunk(
  "staff/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`${BASE}/${id}`, payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update staff");
    }
  }
);

export const deleteStaff = createAsyncThunk(
  "staff/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${BASE}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete staff");
    }
  }
);

// ─── SLICE ────────────────────────────────────────────────────────────────────

const staffSlice = createSlice({
  name: "staff",
  initialState: {
    list: [],
    pagination: null,
    adminProfile: null,

    // granular loading flags
    loading: {
      fetch: false,
      create: false,
      update: false,
      delete: false,
      profile: false,
    },
    error: null,
    successMessage: null,
  },

  reducers: {
    clearStaffMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    // ── fetchAllStaff ──
    builder
      .addCase(fetchAllStaff.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchAllStaff.fulfilled, (state, { payload }) => {
        state.loading.fetch = false;
        state.list = payload.staff;
        state.pagination = payload.pagination;
      })
      .addCase(fetchAllStaff.rejected, (state, { payload }) => {
        state.loading.fetch = false;
        state.error = payload;
      });

    // ── fetchAdminProfile ──
    builder
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading.profile = true;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, { payload }) => {
        state.loading.profile = false;
        state.adminProfile = payload;
      })
      .addCase(fetchAdminProfile.rejected, (state, { payload }) => {
        state.loading.profile = false;
        state.error = payload;
      });

    // ── createStaff ──
    builder
      .addCase(createStaff.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createStaff.fulfilled, (state, { payload }) => {
        state.loading.create = false;
        state.list.unshift(payload);
        if (state.pagination) state.pagination.total += 1;
        state.successMessage = "Staff created successfully";
      })
      .addCase(createStaff.rejected, (state, { payload }) => {
        state.loading.create = false;
        state.error = payload;
      });

    // ── updateStaff ──
    builder
      .addCase(updateStaff.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateStaff.fulfilled, (state, { payload }) => {
        state.loading.update = false;
        const idx = state.list.findIndex((s) => s._id === payload._id);
        if (idx !== -1) state.list[idx] = payload;
        state.successMessage = "Staff updated successfully";
      })
      .addCase(updateStaff.rejected, (state, { payload }) => {
        state.loading.update = false;
        state.error = payload;
      });

    // ── deleteStaff ──
    builder
      .addCase(deleteStaff.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteStaff.fulfilled, (state, { payload: id }) => {
        state.loading.delete = false;
        state.list = state.list.filter((s) => s._id !== id);
        if (state.pagination) state.pagination.total -= 1;
        state.successMessage = "Staff deleted successfully";
      })
      .addCase(deleteStaff.rejected, (state, { payload }) => {
        state.loading.delete = false;
        state.error = payload;
      });
  },
});

export const { clearStaffMessages } = staffSlice.actions;
export default staffSlice.reducer;