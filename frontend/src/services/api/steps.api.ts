import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { Step, StepsResponse } from './types.api'
import { baseUrl, getToken } from './variables'

export const stepsApi = createApi({
  reducerPath: 'stepsApi',
  tagTypes: ['Steps'],
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    getSteps: build.query<StepsResponse, void>({
      query: () => ({
        url: '/steps',
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: ['Steps'],
    }),
    getStepById: build.query<Step, void>({
      query: (step_id) => ({
        url: `/steps/${step_id}`,
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: ['Steps'],
    }),
  }),
})

export const { useGetStepsQuery, useGetStepByIdQuery } = stepsApi
