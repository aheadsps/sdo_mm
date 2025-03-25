import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { LoginResponse, LoginData, ProfileResponse } from './api.types'

export const baseUrl = 'http://localhost:8080/api/v1'
export const token = localStorage.getItem('token')

export const authApi = createApi({
  reducerPath: 'authApi',
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
          Authorization: `Token ${token}`,
        },
      }),
    }),
  }),
})

export const { useLoginMutation, useGetProfileQuery } = authApi
