import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { CoversResponse, CurrentCoversResponse } from './types.api'
import { baseUrl, getToken } from './variables'

export const coversApi = createApi({
  reducerPath: 'coversApi',
  tagTypes: ['Profile', 'Covers'],
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    getCovers: build.query<CoversResponse, void>({
      query: () => ({
        url: '/covers',
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: () => ['Covers'],
    }),
    getCurrentCovers: build.query<CurrentCoversResponse, void>({
      query: () => ({
        url: `/covers/currents?status=process`,
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: () => ['Covers'],
    }),
  }),
})

export const {
  useGetCoversQuery,
  useLazyGetCoversQuery,
  useGetCurrentCoversQuery,
  useLazyGetCurrentCoversQuery,
} = coversApi
