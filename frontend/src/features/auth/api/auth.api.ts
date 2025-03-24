import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ResponseType, LoginData } from './api.types'

const baseUrl = 'http://localhost:8080/api/v1'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    login: build.mutation<ResponseType, LoginData>({
      query: () => '/login',
    }),
  }),
})

export const { useLoginMutation } = authApi
