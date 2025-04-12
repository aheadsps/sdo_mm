import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { LoginResponse, LoginData, ProfileResponse, EventsResponse } from './user.types'

/* export const baseUrl = import.meta.env.VITE_BASE_URL */
/* export const baseUrl = 'http://localhost:8080/api/v1' */
export const baseUrl = `${location.protocol}//${location.hostname}/api/v1`

export const getToken = () => {
  const token = localStorage.getItem('token')
  if (!token) return
  return token
}

export const userApi = createApi({
  reducerPath: 'userApi',
  tagTypes: ['Profile', 'CurrentEvents'],
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginData>({
      query: (loginData) => ({
        url: '/login',
        method: 'POST',
        body: loginData,
      }),
      invalidatesTags: () => ['Profile', 'CurrentEvents'],
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
    getUserCurrentEvents: build.query<EventsResponse, void>({
      query: () => ({
        url: '/events/currents',
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: () => ['CurrentEvents'],
    }),
  }),
})

export const {
  useLoginMutation,
  useGetProfileQuery,
  useLogoutMutation,
  useGetUserCurrentEventsQuery,
} = userApi
