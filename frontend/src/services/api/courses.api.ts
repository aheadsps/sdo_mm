import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { CoursesResponse, CourseVeiw } from './types'
import { baseUrl, getToken } from './variables'

export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  tagTypes: ['Courses'],
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    getCourses: build.query<CoursesResponse, void>({
      query: () => ({
        url: '/courses',
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: () => ['Courses'],
    }),
    getCourse: build.query<CourseVeiw, number>({
      query: (courseId: number) => ({
        url: `/courses/${courseId}`,
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: () => ['Courses'],
    }),
  }),
})

export const { useGetCoursesQuery, useGetCourseQuery } = coursesApi
