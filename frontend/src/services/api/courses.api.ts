import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { CoursesResponse, Course } from './types.api'
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
    getCourse: build.query<Course, number>({
      query: (courseId: number) => ({
        url: `/courses/${courseId}`,
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      transformResponse: (response: Course): Course => ({
        ...response,
        lessons: response.lessons.map((lesson) => ({
          ...lesson,
          expanded: false,
        })),
      }),
      providesTags: () => ['Courses'],
    }),
    createCourse: build.mutation<void, FormData>({
      query: (formDate) =>({
        url: '/courses',
        method: 'POST',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
        body: formDate
      })
    }),
  }),
})

export const { useGetCoursesQuery, useGetCourseQuery, useLazyGetCoursesQuery, useCreateCourseMutation } = coursesApi
