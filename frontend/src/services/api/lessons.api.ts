import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { LessonsResponse } from './types.api'
import { baseUrl, getToken } from './variables'

export const lessonsApi = createApi({
  reducerPath: 'lessonsApi',
  tagTypes: ['Lessons', 'Scorms'],
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    getLessons: build.query<LessonsResponse, void>({
      query: () => ({
        url: '/lessons',
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: ['Lessons'],
    }),
    getScormById: build.query<LessonsResponse, number>({
      query: (scorm_id) => ({
        url: `/scorms/${scorm_id}`,
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: ['Scorms'],
    }),
  }),
})

export const { useGetLessonsQuery, useLazyGetScormByIdQuery } = lessonsApi
