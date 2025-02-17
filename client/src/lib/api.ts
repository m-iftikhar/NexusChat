"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setError, setUsers,setUser } from "./features/userslice";

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
    fetchUsers:builder.query({
        query:()=>"users/users",
      async onQueryStarted(arg,{dispatch,queryFulfilled}){
        try {
          const {data} = await queryFulfilled;
          dispatch(setUsers(data));
        } catch (err) {
          dispatch(setError(err))
        
    
          
        }
      },
    }),
    fetchUser: builder.query({
      query: () => "/users/user",
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // console.log(data); // Check if this returns user data correctly
          dispatch(setUser(data));
        } catch (err) {
          dispatch(setError(err));
        }
      }
    })
    

  }),
});


export const { useSignupMutation ,useLoginMutation, useFetchUserQuery, useFetchUsersQuery} = chatApi;
