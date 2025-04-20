import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { EventsResponse, Event } from './types.api'
import { baseUrl, getToken } from './variables'

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  tagTypes: ['Events'],
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    getEvents: build.query<EventsResponse, void>({
      query: () => ({
        url: '/events',
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
    //Вывод пользователей исходя из эвента
    getUsersEvent: build.query<string, number>({
      query: (event_id) => ({
        url: `/events/${event_id}/users`,
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      // providesTags: () => ['Events'],
    }),
  }),
})

export const { useGetEventsQuery, useGetEventQuery, useLazyGetUsersEventQuery } = eventsApi
