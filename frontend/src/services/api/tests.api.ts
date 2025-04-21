import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { Answer, Question, TestsResponse } from './types.api'
import { baseUrl, getToken } from './variables'

export const testsApi = createApi({
  reducerPath: 'testsApi',
  tagTypes: ['Tests', 'Answers', 'Questions'],
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    getTests: build.query<TestsResponse, number>({
      query: (block_id) => ({
        url: `/test-block/${block_id}`,
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: ['Tests'],
    }),
    getQuestions: build.query<Question[], void>({
      query: () => ({
        url: '/questions',
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: ['Questions'],
    }),
    getQuestionById: build.query<Question, number>({
      query: (question_id) => ({
        url: `/questions/${question_id}`,
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: ['Questions'],
    }),
    getAnswers: build.query<Answer[], void>({
      query: () => ({
        url: '/answers',
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: ['Answers'],
    }),
    getAnswerById: build.query<Answer, number>({
      query: (answer_id) => ({
        url: `/answers/${answer_id}`,
        method: 'GET',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: ['Answers'],
    }),
  }),
})

export const {
  useGetTestsQuery,
  useGetQuestionsQuery,
  useGetQuestionByIdQuery,
  useGetAnswersQuery,
  useGetAnswerByIdQuery,
} = testsApi
