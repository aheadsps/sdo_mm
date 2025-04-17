import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { Covers, CoversResponse } from './types'
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
    getCurrentCovers: build.query<Covers[], void>({
      query: () => ({
        url: `/covers/currents`,
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: () => ['Covers'],
    }),
  }),
})

export const { useGetCoversQuery, useGetCurrentCoversQuery } = coversApi
