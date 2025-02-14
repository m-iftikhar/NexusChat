"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") { // Prevents SSR issues
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST", // Fixed: method (not methods)
        body: userData,
      }),
    }),
  }),
});

// ✅ Corrected Export
export const { useSignupMutation } = chatApi;
