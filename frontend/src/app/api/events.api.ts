import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { EventsResponse } from './api.types'
import { baseUrl, getToken } from './auth.api'

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    getCurrentEvents: build.query<EventsResponse, void>({
      query: () => ({
        url: '/events/currents',
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
    }),
  }),
})

export const { useGetCurrentEventsQuery } = eventsApi
