import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { LoginResponse, LoginData, ProfileResponse } from './types.api'
import { baseUrl, getToken } from './variables'

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
      invalidatesTags: () => ['Profile'],
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
