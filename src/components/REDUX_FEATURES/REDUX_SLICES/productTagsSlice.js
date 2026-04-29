// store/slices/products/productTagsSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../SERVICES/axiosInstance";

// ─────────────────────────────────────────────
// THUNKS
// ─────────────────────────────────────────────

// 1. Fetch products by tag (no category filter)
// GET /products?tags=on_sale
export const fetchProductsByTag = createAsyncThunk(
  "productTags/fetchByTag",
  async ({ tag, page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/products/all?tags=${tag}&page=${page}&limit=${limit}`
      );
      console.log("res", response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch products");
      }
      return { ...response.data, tag };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch products",
        status: error.response?.status,
      });
    }
  }
);

// 2. Fetch products by tag within a category
// GET /products/category/:slug?tags=on_sale
export const fetchProductsByTagAndCategory = createAsyncThunk(
  "productTags/fetchByTagAndCategory",
  async ({ tag, categorySlug, page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/products/category/${categorySlug}?tags=${tag}&page=${page}&limit=${limit}`
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch products");
      }
      return { ...response.data, tag, categorySlug };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch products",
        status: error.response?.status,
      });
    }
  }
);

// 3. Fetch both on_sale and today_arrival together (for homepage sections)
// Two parallel calls
export const fetchTaggedProductSections = createAsyncThunk(
  "productTags/fetchSections",
  async ({ page = 1, limit = 12 } = {}, { rejectWithValue }) => {
    try {
      const [onSaleRes, todayArrivalRes] = await Promise.all([
        axiosInstance.get(`/products?tags=on_sale&page=${page}&limit=${limit}`),
        axiosInstance.get(`/products?tags=today_arrival&page=${page}&limit=${limit}`)
      ]);

      return {
        onSale: {
          products: onSaleRes.data.products || [],
          pagination: onSaleRes.data.pagination || {},
          total: onSaleRes.data.pagination?.total || 0
        },
        todayArrival: {
          products: todayArrivalRes.data.products || [],
          pagination: todayArrivalRes.data.pagination || {},
          total: todayArrivalRes.data.pagination?.total || 0
        }
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch tagged products",
        status: error.response?.status,
      });
    }
  }
);

// ─────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────

const initialState = {
  // For tag-only pages (no category)
  onSale: {
    products: [],
    pagination: {},
    total: 0
  },
  todayArrival: {
    products: [],
    pagination: {},
    total: 0
  },

  // For tag + category combined page
  categoryTagProducts: {
    products: [],
    pagination: {},
    total: 0,
    category: null,
    appliedTag: null,
    appliedCategorySlug: null
  },

  loading: {
    onSale: false,
    todayArrival: false,
    sections: false,
    categoryTag: false
  },
  error: {
    onSale: null,
    todayArrival: null,
    sections: null,
    categoryTag: null
  }
};

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────

const productTagsSlice = createSlice({
  name: "productTags",
  initialState,
  reducers: {
    clearTagProducts: (state) => {
      state.onSale = initialState.onSale;
      state.todayArrival = initialState.todayArrival;
    },
    clearCategoryTagProducts: (state) => {
      state.categoryTagProducts = initialState.categoryTagProducts;
    },
    clearTagErrors: (state) => {
      state.error = initialState.error;
    }
  },
  extraReducers: (builder) => {
    builder

      // ── fetchProductsByTag ──────────────────────────────────
      .addCase(fetchProductsByTag.pending, (state, action) => {
        const tag = action.meta.arg.tag;
        if (tag === 'on_sale') state.loading.onSale = true;
        if (tag === 'today_arrival') state.loading.todayArrival = true;
      })
      .addCase(fetchProductsByTag.fulfilled, (state, action) => {
        const { tag, products, pagination } = action.payload;
        if (tag === 'on_sale') {
          state.loading.onSale = false;
          state.onSale.products = products || [];
          state.onSale.pagination = pagination || {};
          state.onSale.total = pagination?.total || 0;
          state.error.onSale = null;
        }
        if (tag === 'today_arrival') {
          state.loading.todayArrival = false;
          state.todayArrival.products = products || [];
          state.todayArrival.pagination = pagination || {};
          state.todayArrival.total = pagination?.total || 0;
          state.error.todayArrival = null;
        }
      })
      .addCase(fetchProductsByTag.rejected, (state, action) => {
        const tag = action.meta.arg.tag;
        if (tag === 'on_sale') {
          state.loading.onSale = false;
          state.error.onSale = action.payload;
        }
        if (tag === 'today_arrival') {
          state.loading.todayArrival = false;
          state.error.todayArrival = action.payload;
        }
      })

      // ── fetchProductsByTagAndCategory ───────────────────────
      .addCase(fetchProductsByTagAndCategory.pending, (state) => {
        state.loading.categoryTag = true;
        state.error.categoryTag = null;
      })
      .addCase(fetchProductsByTagAndCategory.fulfilled, (state, action) => {
        state.loading.categoryTag = false;
        state.categoryTagProducts = {
          products: action.payload.products || [],
          pagination: action.payload.pagination || {
            total: action.payload.total || 0,
            page: action.payload.page || 1,
            limit: action.payload.limit || 12
          },
          total: action.payload.total || 0,
          category: action.payload.category || null,
          appliedTag: action.payload.tag || null,
          appliedCategorySlug: action.payload.categorySlug || null
        };
        state.error.categoryTag = null;
      })
      .addCase(fetchProductsByTagAndCategory.rejected, (state, action) => {
        state.loading.categoryTag = false;
        state.error.categoryTag = action.payload;
      })

      // ── fetchTaggedProductSections ──────────────────────────
      .addCase(fetchTaggedProductSections.pending, (state) => {
        state.loading.sections = true;
        state.error.sections = null;
      })
      .addCase(fetchTaggedProductSections.fulfilled, (state, action) => {
        state.loading.sections = false;
        state.onSale = action.payload.onSale;
        state.todayArrival = action.payload.todayArrival;
        state.error.sections = null;
      })
      .addCase(fetchTaggedProductSections.rejected, (state, action) => {
        state.loading.sections = false;
        state.error.sections = action.payload;
      });
  }
});

export const {
  clearTagProducts,
  clearCategoryTagProducts,
  clearTagErrors
} = productTagsSlice.actions;

// ─────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────

export const selectOnSaleProducts = (state) => state.productTags.onSale.products;
export const selectOnSalePagination = (state) => state.productTags.onSale.pagination;
export const selectOnSaleTotal = (state) => state.productTags.onSale.total;

export const selectTodayArrivalProducts = (state) => state.productTags.todayArrival.products;
export const selectTodayArrivalPagination = (state) => state.productTags.todayArrival.pagination;
export const selectTodayArrivalTotal = (state) => state.productTags.todayArrival.total;

export const selectCategoryTagProducts = (state) => state.productTags.categoryTagProducts.products;
export const selectCategoryTagPagination = (state) => state.productTags.categoryTagProducts.pagination;
export const selectCategoryTagInfo = (state) => state.productTags.categoryTagProducts;

export const selectTagsLoading = (state) => state.productTags.loading;
export const selectTagsError = (state) => state.productTags.error;

export default productTagsSlice.reducer;