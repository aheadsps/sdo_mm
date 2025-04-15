import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { LoginResponse, LoginData, ProfileResponse } from './user.types'
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
    //  getUserCurrentEvents: build.query<EventsResponse, void>({
    //    query: () => ({
    //      url: '/events/currents',
    //      method: 'GET',
    //      headers: {
    //        Authorization: `Token ${getToken()}`,
    //      },
    //    }),
    //    providesTags: () => ['CurrentEvents'],
    //  }),
    //  getEvent: build.query<Event, number>({
    //    query: (event_id) => ({
    //      url: `/events/${event_id}`,
    //      method: 'GET',
    //      headers: {
    //        Authorization: `Token ${getToken()}`,
    //      },
    //    }),
    //    providesTags: () => ['CurrentEvents'],
    //  }),
  }),
})

export const {
  useLoginMutation,
  useGetProfileQuery,
  useLogoutMutation,
  //   useGetUserCurrentEventsQuery,
  //   useGetEventQuery,
} = authApi
