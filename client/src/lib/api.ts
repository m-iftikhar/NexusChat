"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setError, setUsers,setUser } from "./features/userslice";
import { addMessage, setMessageError, setMessages } from "./features/messageSlice";

export const chatApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
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
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: "/auth/login",
        method: "POST",
        body: userData,
      }),
    }),
    fetchUsers: builder.query({
      query: () => "users/users",
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUsers(data));
        } catch (err) {
          dispatch(setError(err));
        }
      },
    }),
    fetchUser: builder.query({
      query: () => "/users/user",
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (err) {
          dispatch(setError(err));
        }
      },
    }),
    fetchMessagesBySenderId: builder.query({
      query: (senderId) => `/message?senderId=${senderId}`,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setMessages(data));
        } catch (err) {
          dispatch(setMessageError(err));
        }
      },
    }),
    addMessage: builder.mutation({
      query: (data) => ({
        url: "/message/create",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { 
  useSignupMutation,
  useLoginMutation, 
  useFetchUserQuery, 
  useFetchUsersQuery, 
  useFetchMessagesBySenderIdQuery, 
  useAddMessageMutation 
} = chatApi;
