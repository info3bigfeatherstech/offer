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
  async ({ addressId, couponCode, paymentMethodHint, demoMockShipping = false }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/checkout/quote", {
        addressId,
        couponCode: couponCode || undefined,
        paymentMethodHint: paymentMethodHint || undefined,
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
  async ({ quoteId, paymentMethod, paymentPlan = "full" }, { rejectWithValue }) => {
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
        details: err.response?.data?.details,
        status: err.response?.status,
      });
    }
  }
);

/**
 * POST /api/orders/items
 * Requires: addressId, paymentMethod, quoteId, optional couponCode
 * For online payments, backend returns razorpayOrder object
 */
export const placeOrder = createAsyncThunk(
  "checkout/placeOrder",
  async ({ addressId, paymentMethod, quoteId, couponCode, onlinePaymentMode = "full", idempotencyKey }, { rejectWithValue }) => {
    try {
      const requestConfig = idempotencyKey
        ? { headers: { "Idempotency-Key": idempotencyKey } }
        : undefined;

      const res = await axiosInstance.post("/orders/items", {
        addressId,
        paymentMethod,
        quoteId,
        couponCode: couponCode || undefined,
        onlinePaymentMode,
      }, requestConfig);
      if (!res.data.success) throw new Error(res.data.message || "Failed to place order");
      return res.data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message || "Failed to place order",
        code: err.response?.data?.code,
        details: err.response?.data?.details,
        status: err.response?.status,
      });
    }
  }
);

/**
 * GET /api/public/razorpay-key
 * Fetches Razorpay key_id from backend
 */
export const getRazorpayKey = createAsyncThunk(
  "checkout/getRazorpayKey",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/public/razorpay-key");
      if (!res.data.success) throw new Error(res.data.message || "Failed to get Razorpay key");
      return res.data.keyId;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message || "Failed to get Razorpay key",
        status: err.response?.status,
      });
    }
  }
);

/**
 * POST /api/orders/verify-payment
 * Verifies Razorpay payment signature and updates order status
 */
export const verifyRazorpayPayment = createAsyncThunk(
  "checkout/verifyPayment",
  async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/orders/items/verify-payment", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId,
      });
      if (!res.data.success) throw new Error(res.data.message || "Payment verification failed");
      return res.data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message || "Payment verification failed",
        code: err.response?.data?.code,
        details: err.response?.data?.details,
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
      return res.data;
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
    isDeliverable: null,
    estimatedDays: null,
    courierName: null,
    checkedPincode: null,
    message: null,
  },

  // Quote
  quote: null,
  quoteId: null,
  quoteExpiresAt: null,

  // Confirmed quote (after /confirm)
  confirmed: null,

  // Placed order result
  placedOrder: null,

  // Razorpay
  razorpayKey: null,
  razorpayKeyLoading: false,
  razorpayKeyError: null,

  // Payment verification
  paymentVerification: {
    loading: false,
    error: null,
    success: false,
  },

  // Selected address for checkout
  selectedAddressId: null,

  // Payment method and plan
  paymentMethod: null,
  paymentPlan: "full", // "full" or "advance"

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
    setPaymentPlan: (state, action) => {
      state.paymentPlan = action.payload;
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
      state.razorpayKeyError = null;
      state.paymentVerification.error = null;
    },
    setDeliveryResult: (state, action) => {
      state.delivery = { ...state.delivery, ...action.payload };
    },
    resetPaymentVerification: (state) => {
      state.paymentVerification = initialState.paymentVerification;
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
        if (action.payload?.totals) {
          state.quote = { ...state.quote, ...action.payload.totals };
        }
      })
      .addCase(confirmCheckoutQuote.rejected, (state, action) => {
        state.loading.confirm = false;
        state.error.confirm = action.payload || { message: "Failed to confirm quote" };
        const latest = action.payload?.details?.latest;
        if (latest) {
          state.quote = { ...state.quote, ...latest };
          state.error.confirm = {
            ...action.payload,
            message: "Prices updated — please review and confirm again",
          };
        }
        if (action.payload?.code === "QUOTE_EXPIRED" || action.payload?.details?.reason === "quote_expired") {
          state.quote = null;
          state.quoteId = null;
          state.quoteExpiresAt = null;
        }
      })

      // ── placeOrder ───────────────────────────────────────────────────────
      .addCase(placeOrder.pending, (state) => {
        state.loading.placeOrder = true;
        state.error.placeOrder = null;
        state.placedOrder = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading.placeOrder = false;
        state.placedOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading.placeOrder = false;
        state.error.placeOrder = action.payload || { message: "Failed to place order" };
      })

      // ── getRazorpayKey ───────────────────────────────────────────────────
      .addCase(getRazorpayKey.pending, (state) => {
        state.razorpayKeyLoading = true;
        state.razorpayKeyError = null;
      })
      .addCase(getRazorpayKey.fulfilled, (state, action) => {
        state.razorpayKeyLoading = false;
        state.razorpayKey = action.payload;
      })
      .addCase(getRazorpayKey.rejected, (state, action) => {
        state.razorpayKeyLoading = false;
        state.razorpayKeyError = action.payload?.message || "Failed to get Razorpay key";
      })

      // ── verifyRazorpayPayment ────────────────────────────────────────────
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.paymentVerification.loading = true;
        state.paymentVerification.error = null;
        state.paymentVerification.success = false;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        state.paymentVerification.loading = false;
        state.paymentVerification.success = true;
        // Update order status in placedOrder
        if (state.placedOrder?.order) {
          state.placedOrder.order.orderStatus = action.payload.order?.orderStatus || "confirmed";
          state.placedOrder.order.paymentStatus = action.payload.order?.paymentStatus || "paid";
        }
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.paymentVerification.loading = false;
        state.paymentVerification.error = action.payload?.message || "Payment verification failed";
        state.paymentVerification.success = false;
      });
  },
});

export const {
  setSelectedAddress,
  setPaymentMethod,
  setPaymentPlan,
  setCouponCode,
  resetQuote,
  resetCheckout,
  clearCheckoutErrors,
  setDeliveryResult,
  resetPaymentVerification,
} = checkoutSlice.actions;

// ─────────────────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────────────────
export const selectDelivery = (s) => s.checkout.delivery;
export const selectQuote = (s) => s.checkout.quote;
export const selectQuoteId = (s) => s.checkout.quoteId;
export const selectConfirmed = (s) => s.checkout.confirmed;
export const selectPlacedOrder = (s) => s.checkout.placedOrder;
export const selectSelectedAddressId = (s) => s.checkout.selectedAddressId;
export const selectPaymentMethod = (s) => s.checkout.paymentMethod;
export const selectPaymentPlan = (s) => s.checkout.paymentPlan;
export const selectCouponCode = (s) => s.checkout.couponCode;
export const selectCheckoutLoading = (s) => s.checkout.loading;
export const selectCheckoutError = (s) => s.checkout.error;
export const selectRazorpayKey = (s) => s.checkout.razorpayKey;
export const selectRazorpayKeyLoading = (s) => s.checkout.razorpayKeyLoading;
export const selectRazorpayKeyError = (s) => s.checkout.razorpayKeyError;
export const selectPaymentVerification = (s) => s.checkout.paymentVerification;

export default checkoutSlice.reducer;
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "../../../../SERVICES/axiosInstance";

// // ─────────────────────────────────────────────────────────────────────────────
// // Thunks
// // ─────────────────────────────────────────────────────────────────────────────

// /**
//  * POST /api/checkout/quote
//  * Requires: addressId, optional couponCode, paymentMethodHint
//  */
// export const fetchCheckoutQuote = createAsyncThunk(
//   "checkout/fetchQuote",
//   async ({ addressId, couponCode, paymentMethodHint = "cod", demoMockShipping = false }, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.post("/checkout/quote", {
//         addressId,
//         couponCode: couponCode || undefined,
//         paymentMethodHint,
//         demoMockShipping,
//       });
//       if (!res.data.success) throw new Error(res.data.message || "Failed to get quote");
//       return res.data;
//     } catch (err) {
//       return rejectWithValue({
//         message: err.response?.data?.message || err.message || "Failed to get quote",
//         code: err.response?.data?.code,
//         status: err.response?.status,
//       });
//     }
//   }
// );

// /**
//  * POST /api/checkout/confirm
//  * Requires: quoteId, paymentMethod ("cod" | "online")
//  */
// export const confirmCheckoutQuote = createAsyncThunk(
//   "checkout/confirmQuote",
//   async ({ quoteId, paymentMethod = "cod", paymentPlan = "full" }, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.post("/checkout/confirm", {
//         quoteId,
//         paymentMethod,
//         paymentPlan,
//       });
//       if (!res.data.success) throw new Error(res.data.message || "Failed to confirm quote");
//       return res.data;
//     } catch (err) {
//       return rejectWithValue({
//         message: err.response?.data?.message || err.message || "Failed to confirm quote",
//         code: err.response?.data?.code,
//         latest: err.response?.data?.latest,
//         status: err.response?.status,
//       });
//     }
//   }
// );

// /**
//  * POST /api/orders/items
//  * Requires: addressId, paymentMethod, quoteId, optional couponCode
//  */
// export const placeOrder = createAsyncThunk(
//   "checkout/placeOrder",
//   async ({ addressId, paymentMethod = "cod", quoteId, couponCode }, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.post("/orders/items", {
//         addressId,
//         paymentMethod,
//         quoteId,
//         couponCode: couponCode || undefined,
//         onlinePaymentMode: "full",
//       });
//       if (!res.data.success) throw new Error(res.data.message || "Failed to place order");
//       return res.data;
//     } catch (err) {
//       return rejectWithValue({
//         message: err.response?.data?.message || err.message || "Failed to place order",
//         code: err.response?.data?.code,
//         status: err.response?.status,
//       });
//     }
//   }
// );

// /**
//  * POST /api/delivery/check-delivery
//  * Checks if a pincode is serviceable (used by DeliveryChecker component)
//  */
// export const checkDelivery = createAsyncThunk(
//   "checkout/checkDelivery",
//   async ({ pincode }, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.post("/delivery/check-delivery", { pincode });
//       if (!res.data.success) throw new Error(res.data.message || "Delivery check failed");
//       return res.data; // { isDeliverable, estimatedDays, courierName, message, pincode }
//     } catch (err) {
//       return rejectWithValue({
//         message: err.response?.data?.message || err.message || "Delivery check failed",
//         status: err.response?.status,
//       });
//     }
//   }
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // Initial State
// // ─────────────────────────────────────────────────────────────────────────────
// const initialState = {
//   // Delivery check (DeliveryChecker component)
//   delivery: {
//     isDeliverable: null,    // null = unchecked, true/false = result
//     estimatedDays: null,
//     courierName: null,
//     checkedPincode: null,
//     message: null,
//   },

//   // Quote
//   quote: null,              // full quote response object
//   quoteId: null,
//   quoteExpiresAt: null,

//   // Confirmed quote (after /confirm)
//   confirmed: null,

//   // Placed order result
//   placedOrder: null,        // { orderId, totalAmount, orderStatus, paymentMethod, ... }

//   // Selected address for checkout
//   selectedAddressId: null,

//   // Payment method chosen by user
//   paymentMethod: "cod",

//   // Coupon
//   couponCode: "",

//   // Loading flags
//   loading: {
//     delivery: false,
//     quote: false,
//     confirm: false,
//     placeOrder: false,
//   },

//   // Errors
//   error: {
//     delivery: null,
//     quote: null,
//     confirm: null,
//     placeOrder: null,
//   },
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Slice
// // ─────────────────────────────────────────────────────────────────────────────
// const checkoutSlice = createSlice({
//   name: "checkout",
//   initialState,
//   reducers: {
//     setSelectedAddress: (state, action) => {
//       state.selectedAddressId = action.payload;
//       // Reset quote when address changes — must re-quote
//       state.quote = null;
//       state.quoteId = null;
//       state.quoteExpiresAt = null;
//       state.confirmed = null;
//       state.error.quote = null;
//       state.error.confirm = null;
//     },
//     setPaymentMethod: (state, action) => {
//       state.paymentMethod = action.payload;
//     },
//     setCouponCode: (state, action) => {
//       state.couponCode = action.payload;
//     },
//     resetQuote: (state) => {
//       state.quote = null;
//       state.quoteId = null;
//       state.quoteExpiresAt = null;
//       state.confirmed = null;
//       state.error.quote = null;
//       state.error.confirm = null;
//     },
//     resetCheckout: () => initialState,
//     clearCheckoutErrors: (state) => {
//       state.error = initialState.error;
//     },
//     // Called when delivery check result is already known (e.g. pre-checked in cart)
//     setDeliveryResult: (state, action) => {
//       state.delivery = { ...state.delivery, ...action.payload };
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // ── checkDelivery ────────────────────────────────────────────────────
//       .addCase(checkDelivery.pending, (state) => {
//         state.loading.delivery = true;
//         state.error.delivery = null;
//         state.delivery.isDeliverable = null;
//       })
//       .addCase(checkDelivery.fulfilled, (state, action) => {
//         state.loading.delivery = false;
//         state.delivery = {
//           isDeliverable: action.payload.isDeliverable,
//           estimatedDays: action.payload.estimatedDays,
//           courierName: action.payload.courierName,
//           checkedPincode: action.payload.pincode,
//           message: action.payload.message,
//         };
//       })
//       .addCase(checkDelivery.rejected, (state, action) => {
//         state.loading.delivery = false;
//         state.error.delivery = action.payload || { message: "Delivery check failed" };
//         state.delivery.isDeliverable = false;
//       })

//       // ── fetchCheckoutQuote ───────────────────────────────────────────────
//       .addCase(fetchCheckoutQuote.pending, (state) => {
//         state.loading.quote = true;
//         state.error.quote = null;
//         state.quote = null;
//         state.quoteId = null;
//         state.confirmed = null;
//       })
//       .addCase(fetchCheckoutQuote.fulfilled, (state, action) => {
//         state.loading.quote = false;
//         state.quote = action.payload;
//         state.quoteId = action.payload.quoteId;
//         state.quoteExpiresAt = action.payload.quoteExpiresAt;
//       })
//       .addCase(fetchCheckoutQuote.rejected, (state, action) => {
//         state.loading.quote = false;
//         state.error.quote = action.payload || { message: "Failed to get quote" };
//       })

//       // ── confirmCheckoutQuote ─────────────────────────────────────────────
//       .addCase(confirmCheckoutQuote.pending, (state) => {
//         state.loading.confirm = true;
//         state.error.confirm = null;
//       })
//       .addCase(confirmCheckoutQuote.fulfilled, (state, action) => {
//         state.loading.confirm = false;
//         state.confirmed = action.payload;
//         // If backend returns updated totals on stale quote, update quote too
//         if (action.payload?.totals) {
//           state.quote = { ...state.quote, ...action.payload.totals };
//         }
//       })
//       .addCase(confirmCheckoutQuote.rejected, (state, action) => {
//         state.loading.confirm = false;
//         state.error.confirm = action.payload || { message: "Failed to confirm quote" };
//         // If quote is stale, update quote with latest from backend
//         if (action.payload?.latest) {
//           state.quote = { ...state.quote, ...action.payload.latest };
//           state.error.confirm = {
//             ...action.payload,
//             message: "Prices updated — please review and confirm again",
//           };
//         }
//         // If quote expired, reset it
//         if (action.payload?.message?.toLowerCase().includes("expired")) {
//           state.quote = null;
//           state.quoteId = null;
//           state.quoteExpiresAt = null;
//         }
//       })

//       // ── placeOrder ───────────────────────────────────────────────────────
//       .addCase(placeOrder.pending, (state) => {
//         state.loading.placeOrder = true;
//         state.error.placeOrder = null;
//       })
//       .addCase(placeOrder.fulfilled, (state, action) => {
//         state.loading.placeOrder = false;
//         state.placedOrder = action.payload;
//       })
//       .addCase(placeOrder.rejected, (state, action) => {
//         state.loading.placeOrder = false;
//         state.error.placeOrder = action.payload || { message: "Failed to place order" };
//       });
//   },
// });

// export const {
//   setSelectedAddress,
//   setPaymentMethod,
//   setCouponCode,
//   resetQuote,
//   resetCheckout,
//   clearCheckoutErrors,
//   setDeliveryResult,
// } = checkoutSlice.actions;

// // ─────────────────────────────────────────────────────────────────────────────
// // Selectors
// // ─────────────────────────────────────────────────────────────────────────────
// export const selectDelivery         = (s) => s.checkout.delivery;
// export const selectQuote            = (s) => s.checkout.quote;
// export const selectQuoteId          = (s) => s.checkout.quoteId;
// export const selectConfirmed        = (s) => s.checkout.confirmed;
// export const selectPlacedOrder      = (s) => s.checkout.placedOrder;
// export const selectSelectedAddressId = (s) => s.checkout.selectedAddressId;
// export const selectPaymentMethod    = (s) => s.checkout.paymentMethod;
// export const selectCouponCode       = (s) => s.checkout.couponCode;
// export const selectCheckoutLoading  = (s) => s.checkout.loading;
// export const selectCheckoutError    = (s) => s.checkout.error;

// export default checkoutSlice.reducer;