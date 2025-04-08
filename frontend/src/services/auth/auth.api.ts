import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { LoginResponse, LoginData, ProfileResponse } from '../auth/auth.types'

/* export const baseUrl = import.meta.env.VITE_BASE_URL */
export const baseUrl = 'http://localhost:8080/api/v1'

export const getToken = () => {
  const token = localStorage.getItem('token')
  if (!token) return
  return token
}

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['Profile'],
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginData>({
      query: (loginData) => ({
        url: '/login',
        method: 'POST',
        body: loginData,
      }),
      invalidatesTags: ['Profile'],
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      invalidatesTags: ['Profile'],
    }),
    getProfile: build.query<ProfileResponse, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: ['Profile'],
    }),
  }),
})

export const { useLoginMutation, useGetProfileQuery, useLogoutMutation } = authApi
