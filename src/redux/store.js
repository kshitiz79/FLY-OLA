// redux/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import baseURL from '../utils/baseURL';

export const bookingsApi = createApi({
  reducerPath: 'bookingsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseURL}/api` }),
  tagTypes: ['BookingSlots', 'CustomerBookings'],
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: () => '/bookings',
      providesTags: ['BookingSlots'],
    }),
    createBooking: builder.mutation({
      query: (newBooking) => ({
        url: '/bookings',
        method: 'POST',
        body: newBooking,
      }),
      invalidatesTags: ['BookingSlots'],
    }),
    createCustomerBooking: builder.mutation({
      query: (bookingData) => ({
        url: '/customer-bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['CustomerBookings', 'BookingSlots'],
    }),
    getCustomerBookings: builder.query({
      query: () => '/customer-bookings',
      providesTags: ['CustomerBookings'],
    }),
    // Existing flight slot deletion mutation
    deleteBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BookingSlots'],
    }),
    // New mutation for deleting a customer booking:
    deleteCustomerBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/customer-bookings/${bookingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CustomerBookings'],
    }),
  }),
});

export const { 
  useGetBookingsQuery, 
  useCreateBookingMutation, 
  useCreateCustomerBookingMutation,
  useGetCustomerBookingsQuery,
  useDeleteBookingMutation,
  useDeleteCustomerBookingMutation, // new hook for customer booking deletion
} = bookingsApi;

export const store = configureStore({
  reducer: {
    [bookingsApi.reducerPath]: bookingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(bookingsApi.middleware),
});
