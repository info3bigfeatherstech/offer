import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../SERVICES/axiosInstance";

// ─────────────────────────────────────────────────────────────────────────────
// Thunks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/checkout/quote
 * Requires: addressId, optional couponCode, paymentMethodHint
 */
export const fetchCheckoutQuote = createAsyncThunk(
  "checkout/fetchQuote",
  async ({ addressId, couponCode, paymentMethodHint = "cod", demoMockShipping = false }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/checkout/quote", {
        addressId,
        couponCode: couponCode || undefined,
        paymentMethodHint,
        demoMockShipping,
      });
      if (!res.data.success) throw new Error(res.data.message || "Failed to get quote");
      return res.data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message || "Failed to get quote",
        code: err.response?.data?.code,
        status: err.response?.status,
      });
    }
  }
);

/**
 * POST /api/checkout/confirm
 * Requires: quoteId, paymentMethod ("cod" | "online")
 */
export const confirmCheckoutQuote = createAsyncThunk(
  "checkout/confirmQuote",
  async ({ quoteId, paymentMethod = "cod", paymentPlan = "full" }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/checkout/confirm", {
        quoteId,
        paymentMethod,
        paymentPlan,
      });
      if (!res.data.success) throw new Error(res.data.message || "Failed to confirm quote");
      return res.data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message || "Failed to confirm quote",
        code: err.response?.data?.code,
        latest: err.response?.data?.latest,
        status: err.response?.status,
      });
    }
  }
);

/**
 * POST /api/orders/items
 * Requires: addressId, paymentMethod, quoteId, optional couponCode
 */
export const placeOrder = createAsyncThunk(
  "checkout/placeOrder",
  async ({ addressId, paymentMethod = "cod", quoteId, couponCode }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/orders/items", {
        addressId,
        paymentMethod,
        quoteId,
        couponCode: couponCode || undefined,
        onlinePaymentMode: "full",
      });
      if (!res.data.success) throw new Error(res.data.message || "Failed to place order");
      return res.data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message || "Failed to place order",
        code: err.response?.data?.code,
        status: err.response?.status,
      });
    }
  }
);

/**
 * POST /api/delivery/check-delivery
 * Checks if a pincode is serviceable (used by DeliveryChecker component)
 */
export const checkDelivery = createAsyncThunk(
  "checkout/checkDelivery",
  async ({ pincode }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/delivery/check-delivery", { pincode });
      if (!res.data.success) throw new Error(res.data.message || "Delivery check failed");
      return res.data; // { isDeliverable, estimatedDays, courierName, message, pincode }
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message || "Delivery check failed",
        status: err.response?.status,
      });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────────────────────────────────────
const initialState = {
  // Delivery check (DeliveryChecker component)
  delivery: {
    isDeliverable: null,    // null = unchecked, true/false = result
    estimatedDays: null,
    courierName: null,
    checkedPincode: null,
    message: null,
  },

  // Quote
  quote: null,              // full quote response object
  quoteId: null,
  quoteExpiresAt: null,

  // Confirmed quote (after /confirm)
  confirmed: null,

  // Placed order result
  placedOrder: null,        // { orderId, totalAmount, orderStatus, paymentMethod, ... }

  // Selected address for checkout
  selectedAddressId: null,

  // Payment method chosen by user
  paymentMethod: "cod",

  // Coupon
  couponCode: "",

  // Loading flags
  loading: {
    delivery: false,
    quote: false,
    confirm: false,
    placeOrder: false,
  },

  // Errors
  error: {
    delivery: null,
    quote: null,
    confirm: null,
    placeOrder: null,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────────────────────
const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setSelectedAddress: (state, action) => {
      state.selectedAddressId = action.payload;
      // Reset quote when address changes — must re-quote
      state.quote = null;
      state.quoteId = null;
      state.quoteExpiresAt = null;
      state.confirmed = null;
      state.error.quote = null;
      state.error.confirm = null;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    setCouponCode: (state, action) => {
      state.couponCode = action.payload;
    },
    resetQuote: (state) => {
      state.quote = null;
      state.quoteId = null;
      state.quoteExpiresAt = null;
      state.confirmed = null;
      state.error.quote = null;
      state.error.confirm = null;
    },
    resetCheckout: () => initialState,
    clearCheckoutErrors: (state) => {
      state.error = initialState.error;
    },
    // Called when delivery check result is already known (e.g. pre-checked in cart)
    setDeliveryResult: (state, action) => {
      state.delivery = { ...state.delivery, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // ── checkDelivery ────────────────────────────────────────────────────
      .addCase(checkDelivery.pending, (state) => {
        state.loading.delivery = true;
        state.error.delivery = null;
        state.delivery.isDeliverable = null;
      })
      .addCase(checkDelivery.fulfilled, (state, action) => {
        state.loading.delivery = false;
        state.delivery = {
          isDeliverable: action.payload.isDeliverable,
          estimatedDays: action.payload.estimatedDays,
          courierName: action.payload.courierName,
          checkedPincode: action.payload.pincode,
          message: action.payload.message,
        };
      })
      .addCase(checkDelivery.rejected, (state, action) => {
        state.loading.delivery = false;
        state.error.delivery = action.payload || { message: "Delivery check failed" };
        state.delivery.isDeliverable = false;
      })

      // ── fetchCheckoutQuote ───────────────────────────────────────────────
      .addCase(fetchCheckoutQuote.pending, (state) => {
        state.loading.quote = true;
        state.error.quote = null;
        state.quote = null;
        state.quoteId = null;
        state.confirmed = null;
      })
      .addCase(fetchCheckoutQuote.fulfilled, (state, action) => {
        state.loading.quote = false;
        state.quote = action.payload;
        state.quoteId = action.payload.quoteId;
        state.quoteExpiresAt = action.payload.quoteExpiresAt;
      })
      .addCase(fetchCheckoutQuote.rejected, (state, action) => {
        state.loading.quote = false;
        state.error.quote = action.payload || { message: "Failed to get quote" };
      })

      // ── confirmCheckoutQuote ─────────────────────────────────────────────
      .addCase(confirmCheckoutQuote.pending, (state) => {
        state.loading.confirm = true;
        state.error.confirm = null;
      })
      .addCase(confirmCheckoutQuote.fulfilled, (state, action) => {
        state.loading.confirm = false;
        state.confirmed = action.payload;
        // If backend returns updated totals on stale quote, update quote too
        if (action.payload?.totals) {
          state.quote = { ...state.quote, ...action.payload.totals };
        }
      })
      .addCase(confirmCheckoutQuote.rejected, (state, action) => {
        state.loading.confirm = false;
        state.error.confirm = action.payload || { message: "Failed to confirm quote" };
        // If quote is stale, update quote with latest from backend
        if (action.payload?.latest) {
          state.quote = { ...state.quote, ...action.payload.latest };
          state.error.confirm = {
            ...action.payload,
            message: "Prices updated — please review and confirm again",
          };
        }
        // If quote expired, reset it
        if (action.payload?.message?.toLowerCase().includes("expired")) {
          state.quote = null;
          state.quoteId = null;
          state.quoteExpiresAt = null;
        }
      })

      // ── placeOrder ───────────────────────────────────────────────────────
      .addCase(placeOrder.pending, (state) => {
        state.loading.placeOrder = true;
        state.error.placeOrder = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading.placeOrder = false;
        state.placedOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading.placeOrder = false;
        state.error.placeOrder = action.payload || { message: "Failed to place order" };
      });
  },
});

export const {
  setSelectedAddress,
  setPaymentMethod,
  setCouponCode,
  resetQuote,
  resetCheckout,
  clearCheckoutErrors,
  setDeliveryResult,
} = checkoutSlice.actions;

// ─────────────────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────────────────
export const selectDelivery         = (s) => s.checkout.delivery;
export const selectQuote            = (s) => s.checkout.quote;
export const selectQuoteId          = (s) => s.checkout.quoteId;
export const selectConfirmed        = (s) => s.checkout.confirmed;
export const selectPlacedOrder      = (s) => s.checkout.placedOrder;
export const selectSelectedAddressId = (s) => s.checkout.selectedAddressId;
export const selectPaymentMethod    = (s) => s.checkout.paymentMethod;
export const selectCouponCode       = (s) => s.checkout.couponCode;
export const selectCheckoutLoading  = (s) => s.checkout.loading;
export const selectCheckoutError    = (s) => s.checkout.error;

export default checkoutSlice.reducer;