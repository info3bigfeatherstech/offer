// ADMIN_SEGMENT/ADMIN_REDUX_MANAGEMENT/wholesalerApi.js

import { createApi } from '@reduxjs/toolkit/query/react';
import axiosInstance from "../../../../SERVICES/axiosInstance";

const logError = (context, error) => {
  console.error(`[wholesalerApi] ${context}`, {
    status: error?.response?.status ?? 'UNKNOWN',
    message: error?.response?.data?.message ?? error?.message ?? 'No message',
    errors: error?.response?.data?.errors ?? null,
    timestamp: new Date().toISOString(),
  });
};

const baseQuery = async ({ url, method, body, params }) => {
  try {
    const response = await axiosInstance({
      url: `/wholesaler${url}`,
      method: method || 'GET',
      data: body,
      params: params,
    });
    return { data: response.data };
  } catch (error) {
    logError(url, error);
    return {
      error: {
        status: error?.response?.status ?? 'FETCH_ERROR',
        data: error?.response?.data ?? { message: error?.message || 'Network error' },
      },
    };
  }
};

export const wholesalerApi = createApi({
  reducerPath: 'wholesalerApi',
  baseQuery: baseQuery,
  tagTypes: ['WholesalerRequests', 'WholesalerSummary', 'WholesalerDetail'],
  endpoints: (builder) => ({
    // Get all wholesaler requests with filters
    getWholesalerRequests: builder.query({
      query: ({ status = '', page = 1, limit = 10 }) => ({
        url: '/admin/requests',
        method: 'GET',
        params: { status, page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.requests.map((req) => ({ type: 'WholesalerRequests', id: req.id })),
              { type: 'WholesalerRequests', id: 'LIST' },
            ]
          : [{ type: 'WholesalerRequests', id: 'LIST' }],
    }),

    // Get single wholesaler request by ID
    getWholesalerRequestById: builder.query({
      query: ({ id }) => ({
        url: `/admin/requests/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, { id }) => [{ type: 'WholesalerDetail', id }],
    }),

    // Get summary counts (pending, approved, rejected, activated)
    getWholesalerSummary: builder.query({
      query: () => ({
        url: '/admin/requests/summary',
        method: 'GET',
      }),
      providesTags: [{ type: 'WholesalerSummary' }],
    }),

    // Notify owner - returns waMeUrl
    notifyOwner: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/requests/${id}/notify-owner`,
        method: 'GET',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'WholesalerRequests', id: 'LIST' }],
    }),

    // Notify applicant - returns waMeUrl (works for approved AND rejected)
    notifyApplicant: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/requests/${id}/notify-applicant`,
        method: 'GET',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'WholesalerRequests', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetWholesalerRequestsQuery,
  useGetWholesalerRequestByIdQuery,
  useGetWholesalerSummaryQuery,
  useNotifyOwnerMutation,
  useNotifyApplicantMutation,
} = wholesalerApi;