// adminAuthApi.js — replace fetchBaseQuery entirely

import { createApi }  from '@reduxjs/toolkit/query/react';
import axiosInstance  from '../../../SERVICES/axiosInstance'; // your existing instance
import { ROLES }      from '../roles';

const ADMIN_ROLES = Object.values(ROLES);

// ✅ Wrap axiosInstance so RTK Query can use it
// This means ALL admin API calls now go through your refresh interceptor
const axiosBaseQuery = () => async ({ url, method = 'GET', body, params }) => {
    try {
        const result = await axiosInstance({
            url,
            method,
            data: body,
            params,
        });
        return { data: result.data };
    } catch (axiosError) {
        return {
            error: {
                status: axiosError.response?.status,
                data:   axiosError.response?.data || axiosError.message,
            },
        };
    }
};

export const adminAuthApi = createApi({
    reducerPath: 'adminAuthApi',
    baseQuery:   axiosBaseQuery(),   // ✅ uses your interceptor — single refresh point
    tagTypes:    ['AdminUser'],
    endpoints:   (builder) => ({

        getAdminMe: builder.query({
            query: () => ({ url: '/auth/me' }),
            providesTags: ['AdminUser'],
            transformResponse: (response) => {
                const user = response?.user;
                if (!user?.role || !ADMIN_ROLES.includes(user.role)) {
                    throw new Error('insufficient_role');
                }
                return user;
            },
        }),

        adminLogin: builder.mutation({
            query: (credentials) => ({
                url:    '/auth/login',
                method: 'POST',
                body:   credentials,
            }),
            transformResponse: (response) => {
                const { accessToken, user } = response;
                if (!user?.role || !ADMIN_ROLES.includes(user.role)) {
                    throw new Error('Access denied. Insufficient permissions.');
                }
                if (accessToken) localStorage.setItem('accessToken', accessToken);
                return user;
            },
            invalidatesTags: ['AdminUser'],
        }),

        adminLogout: builder.mutation({
            query: () => ({ url: '/auth/logout', method: 'POST' }),
            transformResponse: (response) => {
                localStorage.removeItem('accessToken');
                return response;
            },
            invalidatesTags: ['AdminUser'],
        }),
    }),
});

export const {
    useGetAdminMeQuery,
    useAdminLoginMutation,
    useAdminLogoutMutation,
} = adminAuthApi;