/**
 * staffPasswordSlice.js
 * Handles OTP initiation and password reset for staff members
 * Completely decoupled from staffSlice
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../SERVICES/axiosInstance";

const BASE = "/admin/staff";

// ─── THUNKS ───────────────────────────────────────────────────────────────────

export const initiatePasswordReset = createAsyncThunk(
  "staffPassword/initiate",
  async (staffId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`${BASE}/${staffId}/initiate-reset`);
      return { staffId, message: data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send OTP");
    }
  }
);

export const verifyOTPAndReset = createAsyncThunk(
  "staffPassword/verifyAndReset",
  async ({ staffId, otp, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`${BASE}/${staffId}/verify-reset`, {
        otp,
        newPassword,
      });
      return data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to reset password");
    }
  }
);

// ─── SLICE ────────────────────────────────────────────────────────────────────

const staffPasswordSlice = createSlice({
  name: "staffPassword",
  initialState: {
    // which staffId has OTP flow active
    activeStaffId: null,
    otpSent: false,
    resetSuccess: false,

    loading: {
      initiate: false,
      verify: false,
    },
    error: null,
    successMessage: null,
  },

  reducers: {
    clearPasswordState(state) {
      state.activeStaffId = null;
      state.otpSent = false;
      state.resetSuccess = false;
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    // ── initiatePasswordReset ──
    builder
      .addCase(initiatePasswordReset.pending, (state) => {
        state.loading.initiate = true;
        state.error = null;
        state.otpSent = false;
      })
      .addCase(initiatePasswordReset.fulfilled, (state, { payload }) => {
        state.loading.initiate = false;
        state.otpSent = true;
        state.activeStaffId = payload.staffId;
        state.successMessage = payload.message;
      })
      .addCase(initiatePasswordReset.rejected, (state, { payload }) => {
        state.loading.initiate = false;
        state.error = payload;
      });

    // ── verifyOTPAndReset ──
    builder
      .addCase(verifyOTPAndReset.pending, (state) => {
        state.loading.verify = true;
        state.error = null;
        state.resetSuccess = false;
      })
      .addCase(verifyOTPAndReset.fulfilled, (state, { payload }) => {
        state.loading.verify = false;
        state.resetSuccess = true;
        state.otpSent = false;
        state.successMessage = payload;
      })
      .addCase(verifyOTPAndReset.rejected, (state, { payload }) => {
        state.loading.verify = false;
        state.error = payload;
      });
  },
});

export const { clearPasswordState } = staffPasswordSlice.actions;
export default staffPasswordSlice.reducer;