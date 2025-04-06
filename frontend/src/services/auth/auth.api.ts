import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { LoginResponse, LoginData, ProfileResponse } from '../auth/auth.types'

export const baseUrl = import.meta.env.VITE_BASE_URL

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

export const { useLoginMutation, useGetProfileQuery } = authApi
