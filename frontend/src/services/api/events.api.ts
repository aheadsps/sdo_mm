import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { EventsResponse, Event } from './types'
import { baseUrl, getToken } from './variables'

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  tagTypes: ['Events'],
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    getUserCurrentEvents: build.query<EventsResponse, void>({
      query: () => ({
        url: '/events/currents',
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: () => ['Events'],
    }),
    getEvent: build.query<Event, number>({
      query: (event_id) => ({
        url: `/events/${event_id}`,
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: () => ['Events'],
    }),
  }),
})

// export const { useGetUserCurrentEventsQuery, useGetEventQuery } = eventsApi
export const { useLazyGetUserCurrentEventsQuery, useGetEventQuery } = eventsApi
